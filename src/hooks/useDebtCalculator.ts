// src/hooks/useDebtCalculator.ts
'use client'

import { useState } from 'react'
import { toNumber } from '@/utils/format'
import { buildMonthlySeries, type ChartPoint } from '@/utils/chartData'
import { buildAmortizationRows, type AmortizationRow } from '@/utils/amortization'
import type { DebtUI, DebtModel, OverallSummary, PerDebtSummary } from '@/types/debt'

// สูตรพื้นฐาน (ยังเป็น approx เหมือนของเดิม)
function reducingMonthlyPayment(p: number, apr: number, m: number) {
    if (m <= 0) return 0
    const r = apr / 100 / 12
    if (r === 0) return p / m
    return p * (r / (1 - Math.pow(1 + r, -m)))
}
function fixedMonthlyPayment(p: number, apr: number, m: number) {
    if (m <= 0) return 0
    const totalInterest = p * (apr / 100) * (m / 12)
    return (p + totalInterest) / m
}
function addMonths(yyyyMmDd: string | undefined, months: number) {
    const base = yyyyMmDd ? new Date(yyyyMmDd) : new Date()
    const d = new Date(base.getTime())
    d.setMonth(d.getMonth() + Math.max(0, Math.round(months)))
    return d.toISOString().slice(0, 10)
}

// UI -> Model ตัวเลข
function toModel(d: DebtUI): DebtModel {
    return {
        id: d.id,
        name: d.name || 'Debt',
        amount: toNumber(d.amount),
        interestRate: toNumber(d.interestRate),
        term: Math.round(toNumber(d.term)),
        type: d.interestType,
        startDate: d.startDate || undefined,
        monthlyPayment: d.monthlyPayment ? toNumber(d.monthlyPayment) : undefined,
    }
}

export function useDebtCalculator() {
    const [overall, setOverall] = useState<OverallSummary | null>(null)
    const [perDebt, setPerDebt] = useState<PerDebtSummary[]>([])
    const [chartData, setChartData] = useState<ChartPoint[]>([])
    const [amortRows, setAmortRows] = useState<AmortizationRow[]>([])

    const resetResults = () => {
        setOverall(null)
        setPerDebt([])
        setChartData([])
        setAmortRows([])
    }

    const calculate = (params: {
        incomeStr: string
        expensesStr: string
        debtsUI: DebtUI[]
    }) => {
        const income = toNumber(params.incomeStr)
        const expenses = toNumber(params.expensesStr)
        const netIncome = income - expenses

        const models = params.debtsUI.map(toModel)

        // summary per-debt
        const perDebtSummaries: PerDebtSummary[] = models.map((d) => {
            const mPay =
                d.monthlyPayment ??
                (d.type === 'reducing'
                    ? reducingMonthlyPayment(d.amount, d.interestRate, d.term)
                    : fixedMonthlyPayment(d.amount, d.interestRate, d.term))

            const payoff = Math.max(0, d.term)
            const dfDate = addMonths(d.startDate, payoff)
            const totalInterest = Math.max(0, mPay * payoff - d.amount)

            return {
                id: d.id,
                name: d.name,
                amount: d.amount,
                interestRate: d.interestRate,
                term: d.term,
                type: d.type,
                monthlyPayment: mPay,
                debtFreeDate: dfDate,
                totalInterest,
            }
        })

        // overall
        const totalDebt = perDebtSummaries.reduce((s, x) => s + x.amount, 0)
        const totalMonthlyPayment = perDebtSummaries.reduce((s, x) => s + x.monthlyPayment, 0)
        const payoffMonths = perDebtSummaries.reduce((max, x) => Math.max(max, x.term), 0)
        const debtFreeDate = addMonths(undefined, payoffMonths)
        const totalInterest = perDebtSummaries.reduce((s, x) => s + (x.totalInterest ?? 0), 0)

        setPerDebt(perDebtSummaries)
        setOverall({
            totalDebt,
            totalMonthlyPayment,
            netIncome,
            payoffMonths,
            debtFreeDate,
            totalInterest,
        })

        // chart series & table rows
        setChartData(
            buildMonthlySeries(
                income,
                expenses,
                models.map((d) => ({
                    amount: d.amount,
                    interestRate: d.interestRate,
                    term: d.term,
                    type: d.type,
                }))
            )
        )

        setAmortRows(
            buildAmortizationRows(
                income,
                expenses,
                models.map((d) => ({
                    amount: d.amount,
                    interestRate: d.interestRate,
                    term: d.term,
                    type: d.type,
                }))
            )
        )
    }

    return { overall, perDebt, chartData, amortRows, calculate, resetResults }
}