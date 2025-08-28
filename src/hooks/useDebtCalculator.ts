// src/hooks/useDebtCalculator.ts
'use client'

import { useState } from 'react'
import type {
    DebtUI, DebtModel, PerDebtSummary, OverallSummary,
    ScheduleRow, ValidationIssue,
} from '@/types/debt'
import { toNumber } from '@/utils/format'
import {
    addMonths, aggregateSchedules, resolveReducingByMode,
    scheduleReducing, scheduleFlat, scheduleRevolving,
    round2, minPaymentForRevolving, makeIssue
} from '@/types/finance'

/** จุดข้อมูลสำหรับกราฟ (โครงสร้างตรงกับคอมโพเนนต์กราฟของคุณ) */
export type ChartPoint = {
    month: number
    label: string
    income: number
    expenses: number
    remainingDebt: number
    paidToDate: number
}

function toModel(ui: DebtUI): DebtModel {
    return {
        id: ui.id,
        name: ui.name || 'Debt',
        category: ui.category,
        method: ui.method,
        amount: toNumber(ui.amount),
        interestRate: toNumber(ui.interestRate),
        term: ui.term ? Math.round(toNumber(ui.term)) : undefined,
        monthlyPayment: ui.monthlyPayment ? toNumber(ui.monthlyPayment) : undefined,
        lockMode: ui.lockMode ?? 'term',
        startDate: ui.startDate || undefined,
        allocation: ui.allocation,
        minPct: ui.minPct ? toNumber(ui.minPct) / 100 : undefined,
        minFloor: ui.minFloor ? toNumber(ui.minFloor) : undefined,
    }
}

function buildChartData(income: number, expenses: number, schedule: ScheduleRow[]): ChartPoint[] {
    let cumulative = 0
    return schedule.map(r => {
        cumulative += r.payment
        return {
            month: r.month,
            label: String(r.month),
            income,
            expenses,
            remainingDebt: round2(r.balance),
            paidToDate: round2(cumulative),
        }
    })
}

export function useDebtCalculator() {
    const [overall, setOverall] = useState<OverallSummary | null>(null)
    const [perDebt, setPerDebt] = useState<PerDebtSummary[]>([])
    const [schedule, setSchedule] = useState<ScheduleRow[]>([])
    const [chartData, setChartData] = useState<ChartPoint[]>([])
    const [issues, setIssues] = useState<Record<string, ValidationIssue[]>>({})

    const reset = () => {
        setOverall(null)
        setPerDebt([])
        setSchedule([])
        setChartData([])
        setIssues({})
    }

    /** คำนวณทั้งหมด (เรียกตอนกด Calculate ที่หน้า page) */
    const calculate = (params: {
        incomeStr: string
        expensesStr: string
        debtsUI: DebtUI[]
    }) => {
        const income = toNumber(params.incomeStr)
        const expenses = toNumber(params.expensesStr)
        const netIncome = income - expenses
        const models = params.debtsUI.map(toModel)

        const per: PerDebtSummary[] = []
        const schedules: ScheduleRow[][] = []
        const issueMap: Record<string, ValidationIssue[]> = {}

        for (const d of models) {
            const warn: ValidationIssue[] = []
            let usedPMT = 0
            let months = d.term ?? 0
            let totalInterest = 0
            let rows: ScheduleRow[] = []
            let implied: number | undefined

            switch (d.method) {
                case 'reducing': {
                    const resolved = resolveReducingByMode({
                        principal: d.amount,
                        apr: d.interestRate,
                        lock: d.lockMode,
                        termMonths: d.term,
                        pmtOverride: d.monthlyPayment,
                    })
                    if (!resolved.ok) {
                        issueMap[d.id] = resolved.issues
                        continue
                    }
                    usedPMT = resolved.pmt
                    months = resolved.months
                    if (resolved.issues?.length) warn.push(...resolved.issues)

                    const sch = scheduleReducing(d.amount, d.interestRate, months, usedPMT)
                    rows = sch.rows
                    totalInterest = sch.totalInterest
                    implied = resolved.impliedMonths
                    break
                }

                case 'flat': {
                    if (!d.term || d.term <= 0) {
                        issueMap[d.id] = [makeIssue('INPUT_MISSING')]
                        continue
                    }
                    const sch = scheduleFlat(d.amount, d.interestRate, d.term, d.allocation ?? 'rule78')
                    rows = sch.rows
                    months = rows.length
                    usedPMT = sch.pmt
                    totalInterest = sch.totalInterest
                    break
                }

                case 'revolving': {
                    const minPct = d.minPct ?? 0.03
                    const minFloor = d.minFloor ?? 200
                    const override = d.lockMode === 'payment' ? d.monthlyPayment : undefined
                    if (override != null) {
                        const minReq = minPaymentForRevolving(d.amount, minPct, minFloor)
                        if (override < minReq) {
                            warn.push(makeIssue('BELOW_MIN_PAYMENT', { minRequired: round2(minReq) }))
                        }
                    }
                    const sch = scheduleRevolving({
                        balance0: d.amount,
                        apr: d.interestRate,
                        minPct,
                        minFloor,
                        overridePayment: override,
                    })
                    rows = sch.rows
                    months = rows.length
                    usedPMT = rows[0]?.payment ?? 0
                    totalInterest = sch.totalInterest
                    break
                }

                default:
                    issueMap[d.id] = [makeIssue('INPUT_MISSING')]
                    continue
            }

            schedules.push(rows)

            per.push({
                id: d.id,
                name: d.name,
                method: d.method,
                amount: d.amount,
                interestRate: d.interestRate,
                term: months,
                monthlyPayment: round2(usedPMT),
                debtFreeDate: addMonths(d.startDate, months),
                totalInterest: round2(totalInterest),
                impliedMonths: implied,
                warnings: warn.length ? warn : undefined,
            })
        }

        // รวมตารางจากทุกหนี้
        const agg = aggregateSchedules(schedules)

        // ภาพรวม
        const totalDebt = models.reduce((s, x) => s + x.amount, 0)
        const totalMonthlyPayment = per.reduce((s, x) => s + x.monthlyPayment, 0)
        const payoffMonths = agg.length
        const debtFreeDate = addMonths(undefined, payoffMonths)
        const totalInterestAll = round2(per.reduce((s, x) => s + (x.totalInterest ?? 0), 0))

        const ov: OverallSummary = {
            totalDebt: round2(totalDebt),
            totalMonthlyPayment: round2(totalMonthlyPayment),
            netIncome: round2(netIncome),
            payoffMonths,
            debtFreeDate,
            totalInterest: totalInterestAll,
        }

        setPerDebt(per)
        setSchedule(agg)
        setChartData(buildChartData(income, expenses, agg))
        setOverall(ov)
        setIssues(issueMap)

        return { overall: ov, perDebt: per, schedule: agg, chartData: buildChartData(income, expenses, agg), issues: issueMap }
    }

    return { overall, perDebt, schedule, chartData, issues, calculate, reset }
}