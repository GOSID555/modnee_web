// src/hooks/useDebtCalculator.ts
'use client'

import { useCallback, useMemo, useState } from 'react'

/** ---------- ชนิดจากแหล่งกลาง (อย่าประกาศซ้ำในไฟล์นี้) ---------- */
import type {
    DebtUI,
    ScheduleRow,
    ValidationIssue,
    PerDebtSummary,
    OverallSummary,
} from '@/types/debt'
import type { ChartPoint } from '@/utils/chartData'

/** ---------- ฟังก์ชันคำนวณหลักจาก utils/finance ---------- */
import {
    round2,
    addMonths,
    scheduleReducing,
    scheduleFlat,
    scheduleRevolving,
    resolveReducingByMode,
    aggregateSchedules,
    makeIssue,
} from '@/types/finance'

/* =========================================================================
   ตัวช่วยทั่วไป
   ========================================================================= */
const toNumber = (v: string | number | undefined | null): number => {
    if (v === undefined || v === null) return 0
    if (typeof v === 'number') return Number.isFinite(v) ? v : 0
    const s = String(v).trim().replace(/,/g, '')
    const n = Number(s)
    return Number.isFinite(n) ? n : 0
}

const toPercentFraction = (percentStr?: string | number) =>
    toNumber(percentStr) / 100

/* =========================================================================
   Hook: useDebtCalculator
   ========================================================================= */
type CalcPayload = {
    incomeStr: string
    expensesStr: string
    debtsUI: DebtUI[]
}

type IssuesByDebt = Record<string, ValidationIssue[]>

export default function useDebtCalculator() {
    /** state ผลลัพธ์ */
    const [overall, setOverall] = useState<OverallSummary | null>(null)
    const [perDebt, setPerDebt] = useState<PerDebtSummary[]>([])
    const [schedule, setSchedule] = useState<ScheduleRow[]>([])
    const [chartData, setChartData] = useState<ChartPoint[]>([])
    const [issues, setIssues] = useState<IssuesByDebt>({})

    /** ล้างผลคำนวณ */
    const reset = useCallback(() => {
        setOverall(null)
        setPerDebt([])
        setSchedule([])
        setChartData([])
        setIssues({})
    }, [])

    /** สร้างแถวตารางให้ UI ใช้ (map schedule → table rows) */
    const makeTableRows = useCallback(
        (sched: ScheduleRow[], income: number, expenses: number) => {
            let cumulative = 0
            return sched.map((r) => {
                cumulative = round2(cumulative + r.payment)
                return {
                    month: r.month,
                    income,
                    expenses,
                    monthlyDebtPayment: r.payment,
                    principalPaid: r.principal,
                    interestPaid: r.interest,
                    remainingDebt: r.balance,
                    cumulativePaid: cumulative,
                }
            })
        },
        []
    )

    /** คำนวณหลัก */
    const calculate = useCallback(
        ({ incomeStr, expensesStr, debtsUI }: CalcPayload) => {
            // 1) แปลงรายรับ/รายจ่าย
            const income = toNumber(incomeStr)
            const expenses = toNumber(expensesStr)

            // 2) วนต่อหนี้แต่ละก้อน
            const allSchedules: ScheduleRow[][] = []
            const perDebtOut: PerDebtSummary[] = []
            const issueMap: IssuesByDebt = {}

            for (const d of debtsUI) {
                const id = d.id
                const P = toNumber(d.amount)
                const apr = toNumber(d.interestRate)
                const method = (d.method ?? 'reducing') as PerDebtSummary['method']
                const lock = (d.lockMode ?? 'term') as 'term' | 'payment'
                const nInput = Math.max(0, Math.round(toNumber(d.term)))
                const pmtOverride =
                    d.monthlyPayment !== undefined && d.monthlyPayment !== ''
                        ? toNumber(d.monthlyPayment)
                        : undefined
                const start = d.startDate || undefined

                let myIssues: ValidationIssue[] = []
                let rows: ScheduleRow[] = []
                let totalInterest = 0
                let pmt = 0
                let months = 0

                if (P <= 0) {
                    // วงเงิน 0 → ข้าม
                    allSchedules.push([])
                    issueMap[id] = []
                    perDebtOut.push({
                        id,
                        name: d.name || '',
                        method,
                        amount: 0,
                        interestRate: apr,
                        monthlyPayment: 0,
                        term: 0,
                        debtFreeDate: start ? addMonths(start, 0) : '',
                        totalInterest: 0,
                    })
                    continue
                }

                if (method === 'reducing') {
                    const r =
                        lock === 'term'
                            ? resolveReducingByMode({
                                principal: P,
                                apr,
                                lock: 'term',
                                termMonths: nInput,
                                pmtOverride,
                            })
                            : resolveReducingByMode({
                                principal: P,
                                apr,
                                lock: 'payment',
                                pmtOverride,
                            })

                    if (!r.ok) {
                        myIssues = r.issues
                        // สร้าง schedule ว่างๆ เพื่อให้รวมได้
                        rows = []
                        totalInterest = 0
                        pmt = pmtOverride ?? 0
                        months = nInput || 0
                    } else {
                        myIssues = r.issues ?? []
                        months = r.months
                        pmt = r.pmt
                        const s = scheduleReducing(P, apr, months, pmt)
                        rows = s.rows
                        totalInterest = s.totalInterest
                    }
                } else if (method === 'flat') {
                    const s = scheduleFlat(
                        P,
                        apr, // flat rate
                        Math.max(1, nInput),
                        d.allocation ?? 'rule78'
                    )
                    rows = s.rows
                    totalInterest = s.totalInterest
                    pmt = s.pmt
                    months = rows.length
                } else {
                    // revolving / credit card
                    const s = scheduleRevolving({
                        balance0: P,
                        apr,
                        minPct: toPercentFraction(d.minPct),
                        minFloor: toNumber(d.minFloor) || 200,
                        overridePayment: pmtOverride,
                        monthsLimit: 360,
                    })
                    rows = s.rows
                    totalInterest = s.totalInterest
                    months = rows.length
                    pmt = rows[0]?.payment ?? 0
                    // ถ้าจ่ายต่ำกว่าดอกขั้นต่ำ → เตือน
                    if (rows.length > 0 && pmt <= round2(P * (apr / 100 / 365) * 30)) {
                        myIssues.push(makeIssue('BELOW_MIN_PAYMENT', { minRequired: rows[0].payment }))
                    }
                }

                allSchedules.push(rows)
                issueMap[id] = myIssues

                perDebtOut.push({
                    id,
                    name: d.name || '',
                    method,
                    amount: P,
                    interestRate: apr,
                    monthlyPayment: round2(pmt),
                    term: months,
                    debtFreeDate: start ? addMonths(start, months) : '',
                    totalInterest: round2(totalInterest),
                })
            }

            // 3) รวมตารางทุกหนี้
            const merged = aggregateSchedules(allSchedules)

            // 4) ทำ chartData

            let cum = 0
            const chart: ChartPoint[] = merged.map((r) => {
                cum = round2(cum + r.payment)
                return {
                    month: r.month,
                    label: `M${r.month}`,
                    remainingDebt: r.balance,  // ✅ ชื่อฟิลด์ตรงกับ type
                    paidToDate: cum,
                    income,
                    expenses,
                }
            })
            setChartData(chart)

            // 5) ภาพรวม summary
            const totalDebt = debtsUI.reduce((s, d) => s + toNumber(d.amount), 0)
            const totalMonthlyPayment = round2(merged[0]?.payment ?? 0) // ประมาณการเดือนแรกของยอดรวม
            const payoffMonths = merged.length
            const debtFreeDate = debtsUI[0]?.startDate
                ? addMonths(debtsUI[0].startDate!, payoffMonths)
                : ''

            const totalInterestAll = round2(
                perDebtOut.reduce((s, x) => s + (x.totalInterest ?? 0), 0)
            )

            const overallOut: OverallSummary = {
                totalDebt: round2(totalDebt),
                totalMonthlyPayment,
                netIncome: round2(income - expenses),
                payoffMonths,
                debtFreeDate,
                totalInterest: totalInterestAll,
            }

            // 6) set states
            setIssues(issueMap)
            setPerDebt(perDebtOut)
            setSchedule(merged)
            setChartData(chart)
            setOverall(overallOut)
        },
        []
    )

    /** memo กำกับค่าที่ส่งออก */
    return useMemo(
        () => ({
            overall,
            perDebt,
            schedule,
            chartData,
            issues,
            calculate,
            reset,
            makeTableRows,
        }),
        [overall, perDebt, schedule, chartData, issues, calculate, reset, makeTableRows]
    )
}