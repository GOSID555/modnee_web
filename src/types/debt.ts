// src/types/debt.ts
export type Debt = {
    id: string // ใช้สำหรับ map แต่ละก้อนหนี้
    name: string
    amount: number
    interestRate: number
    term: number // จำนวนงวด (เดือน)
}