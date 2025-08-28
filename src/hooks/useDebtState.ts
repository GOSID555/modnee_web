// src/hooks/useDebtState.ts
'use client'

import { useMemo, useState } from 'react'
import type { DebtUI, LoanCategory, InterestMethod } from '@/types/debt'
import { toNumber } from '@/utils/format'

export function createEmptyDebt(): DebtUI {
    return {
        id: crypto.randomUUID(),
        name: '',
        category: 'personal',
        method: 'reducing',
        amount: '',
        interestRate: '',
        term: '',
        monthlyPayment: '',
        lockMode: 'term',
        startDate: '',
        allocation: 'rule78', // สำหรับ flat (ค่าเริ่มต้น)
        minPct: '3',          // สำหรับ revolving
        minFloor: '200',
    }
}

export function useDebtState() {
    const [income, setIncome] = useState<string>('')     // รายได้/เดือน (string, รองรับลูกน้ำ)
    const [expenses, setExpenses] = useState<string>('') // รายจ่าย/เดือน (string)
    const [debts, setDebts] = useState<DebtUI[]>([])

    // ตัวเลขจริง (memo)
    const incomeNum = useMemo(() => toNumber(income), [income])
    const expensesNum = useMemo(() => toNumber(expenses), [expenses])
    const netIncome = useMemo(() => incomeNum - expensesNum, [incomeNum, expensesNum])

    // actions
    const addDebt = () => setDebts(prev => [...prev, createEmptyDebt()])
    const updateDebt = (id: string, patch: Partial<DebtUI>) =>
        setDebts(prev => prev.map(d => (d.id === id ? { ...d, ...patch } : d)))
    const removeDebt = (id: string) =>
        setDebts(prev => prev.filter(d => d.id !== id))

    const changeCategory = (id: string, category: LoanCategory) =>
        updateDebt(id, { category })
    const changeMethod = (id: string, method: InterestMethod) =>
        updateDebt(id, { method })

    const resetAll = () => {
        setIncome('')
        setExpenses('')
        setDebts([])
    }

    return {
        // raw
        income, setIncome,
        expenses, setExpenses,
        debts, setDebts,

        // derived
        incomeNum, expensesNum, netIncome,

        // actions
        addDebt, updateDebt, removeDebt, changeCategory, changeMethod, resetAll,
    }
}