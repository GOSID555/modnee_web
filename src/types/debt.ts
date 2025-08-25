// src/types/debt.ts
export type InterestType = 'fixed' | 'reducing'

// แบบที่ฟอร์มใช้ (string เพื่อโชว์ลูกน้ำ/validate)
export type DebtUI = {
    id: string
    name: string
    amount: string
    interestType: InterestType
    interestRate: string
    term: string
    startDate?: string
    monthlyPayment?: string
}

// แบบตัวเลขจริง ใช้คำนวณ
export type DebtModel = {
    id: string
    name: string
    amount: number
    interestRate: number
    term: number
    type: InterestType
    startDate?: string
    monthlyPayment?: number
}

// ผลสรุปรายหนี้
export type PerDebtSummary = {
    id: string
    name: string
    amount: number
    interestRate: number
    term: number
    type: InterestType
    monthlyPayment: number
    debtFreeDate: string
    totalInterest?: number
}

// ผลสรุปรวม
export type OverallSummary = {
    totalDebt: number
    totalMonthlyPayment: number
    netIncome: number
    payoffMonths: number
    debtFreeDate: string
    totalInterest?: number
}