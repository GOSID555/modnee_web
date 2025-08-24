// src/hooks/useDebtCalculation.ts
import { useMemo } from 'react'
import { Debt } from '@/types/debt'

export type MonthlyResult = {
    month: number
    totalPayment: number
    remainingDebt: number
    cumulativePaid: number
}

export function useDebtCalculation(
    debts: Debt[],
    monthlyIncome: number,
    monthlyExpense: number
) {
    const results = useMemo<MonthlyResult[]>(() => {
        let remaining = debts.reduce((sum, debt) => sum + debt.amount, 0)
        let paid = 0
        const months = Math.max(...debts.map((d) => d.term))

        const result: MonthlyResult[] = []

        for (let i = 1; i <= months; i++) {
            let monthlyPayment = 0
            debts.forEach((debt) => {
                if (i <= debt.term) {
                    const principal = debt.amount / debt.term
                    const interest = (debt.amount * (debt.interestRate / 100)) / 12
                    monthlyPayment += principal + interest
                }
            })

            paid += monthlyPayment
            remaining -= monthlyPayment

            result.push({
                month: i,
                totalPayment: monthlyPayment,
                remainingDebt: Math.max(remaining, 0),
                cumulativePaid: paid,
            })
        }

        return result
    }, [debts, monthlyIncome, monthlyExpense])

    return {
        chartData: results,
        tableData: results,
    }
}