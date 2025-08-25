// src/hooks/useDebtState.ts
'use client'

import { useMemo, useState } from 'react'
import { toNumber } from '@/utils/format'
import type { DebtUI } from '@/types/debt'

export function createEmptyDebt(): DebtUI {
    return {
        id: crypto.randomUUID(),
        name: '',
        amount: '',
        interestType: 'fixed',
        interestRate: '',
        term: '',
        startDate: '',
        monthlyPayment: '',
    }
}

export function useDebtState() {
    // เก็บค่าเป็น string เพื่อให้ฟอร์มโชว์คอมมา/ลบง่าย
    const [income, setIncome] = useState<string>('')
    const [expenses, setExpenses] = useState<string>('')
    const [debts, setDebts] = useState<DebtUI[]>([])

    // ตัวเลขจริง (memoized)
    const incomeNum = useMemo(() => toNumber(income), [income])
    const expensesNum = useMemo(() => toNumber(expenses), [expenses])
    const netIncome = useMemo(() => incomeNum - expensesNum, [incomeNum, expensesNum])

    // Actions สำหรับ list หนี้
    const addDebt = () => setDebts((prev) => [...prev, createEmptyDebt()])

    const updateDebt = (id: string, patch: Partial<DebtUI>) =>
        setDebts((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)))

    const removeDebt = (id: string) =>
        setDebts((prev) => prev.filter((d) => d.id !== id))

    const resetAll = () => {
        setIncome('')
        setExpenses('')
        setDebts([])
    }

    return {
        // raw state
        income, setIncome,
        expenses, setExpenses,
        debts, setDebts,

        // derived
        incomeNum, expensesNum, netIncome,

        // actions
        addDebt, updateDebt, removeDebt, resetAll,
    }
}