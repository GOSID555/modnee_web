// src/utils/finance.ts
import type {
    InterestMethod,
    FlatAllocation,
    ScheduleRow,
    ValidationIssue,
    ValidationIssueKind,
} from '@/types/debt'

const M = 12
const DAYS = 365

export const round2 = (x: number) => Math.round(x * 100) / 100

export const addMonths = (start?: string, months = 0) => {
    const base = start ? new Date(start) : new Date()
    const d = new Date(base.getTime())
    d.setMonth(d.getMonth() + Math.max(0, Math.round(months)))
    return d.toISOString().slice(0, 10)
}

/** ---------- Amortizing / Reducing ---------- */
export function pmtReducing(P: number, apr: number, n: number) {
    if (n <= 0) return 0
    const i = apr / 100 / M
    if (i === 0) return P / n
    return P * (i / (1 - Math.pow(1 + i, -n)))
}

export function resolveReducingByMode(params: {
    principal: number
    apr: number
    lock: 'term' | 'payment'
    termMonths?: number
    pmtOverride?: number
}):
    | { ok: true; pmt: number; months: number; impliedMonths?: number; issues?: ValidationIssue[] }
    | { ok: false; issues: ValidationIssue[] } {
    const { principal: P, apr, lock, termMonths, pmtOverride } = params
    const i = apr / 100 / M
    const issues: ValidationIssue[] = []
    if (P <= 0) return { ok: true, pmt: 0, months: 0 }

    if (lock === 'term') {
        if (!termMonths || termMonths <= 0) return { ok: false, issues: [{ kind: 'INPUT_MISSING' }] }
        const n = Math.round(termMonths)
        const req = pmtReducing(P, apr, n)

        if (pmtOverride != null) {
            if (i > 0 && pmtOverride + 1e-8 < req) {
                issues.push({ kind: 'UNDERPAY_FOR_TERM', pmtRequired: req, term: n })
            } else if (i > 0 && pmtOverride - 1e-8 > req) {
                const implied = impliedMonthsFromPMT(P, i, pmtOverride)
                if (Number.isFinite(implied)) {
                    const m = Math.ceil(implied)
                    issues.push({ kind: 'EARLY_PAYOFF', impliedMonths: m })
                    return { ok: true, pmt: pmtOverride, months: m, impliedMonths: m, issues }
                }
            }
            return { ok: true, pmt: pmtOverride, months: n, issues }
        }
        return { ok: true, pmt: req, months: n, issues }
    }

    // lock = 'payment'
    if (pmtOverride == null || pmtOverride <= 0) return { ok: false, issues: [{ kind: 'INPUT_MISSING' }] }

    if (i === 0) {
        const n0 = Math.ceil(P / pmtOverride)
        return { ok: true, pmt: pmtOverride, months: n0, impliedMonths: n0 }
    }

    const interestOnly = P * i
    if (pmtOverride <= interestOnly) {
        return { ok: false, issues: [{ kind: 'NEGATIVE_AMORT', interestOnly }] }
    }
    const n = impliedMonthsFromPMT(P, i, pmtOverride)
    return { ok: true, pmt: pmtOverride, months: Math.ceil(n), impliedMonths: Math.ceil(n) }
}

export function scheduleReducing(P: number, apr: number, n: number, pmt?: number) {
    const i = apr / 100 / M
    const PMT = pmt ?? pmtReducing(P, apr, n)
    let bal = P
    const rows: ScheduleRow[] = []
    let totalInterest = 0

    for (let m = 1; m <= Math.max(1, n); m++) {
        const interest = round2(bal * i)
        let principal = round2(PMT - interest)
        if (principal > bal) principal = bal
        const payment = round2(principal + interest)
        bal = round2(bal - principal)
        totalInterest += interest
        rows.push({ month: m, payment, principal, interest, balance: Math.max(0, bal) })
        if (bal <= 0.005) break
    }
    return { pmt: round2(PMT), rows, totalInterest: round2(totalInterest) }
}

function impliedMonthsFromPMT(P: number, i: number, PMT: number) {
    if (PMT <= P * i) return Infinity
    return -Math.log(1 - (P * i) / PMT) / Math.log(1 + i)
}

/** ---------- Flat rate / Hire purchase ---------- */
export function scheduleFlat(
    P: number,
    flatRate: number,
    n: number,
    allocation: FlatAllocation = 'rule78'
) {
    const totalInterest = P * (flatRate / 100) * (n / 12)
    const PMT = (P + totalInterest) / n
    const S = (n * (n + 1)) / 2
    let bal = P
    const rows: ScheduleRow[] = []
    let accInt = 0

    for (let m = 1; m <= n; m++) {
        const interest =
            allocation === 'equal'
                ? totalInterest / n
                : totalInterest * ((n - m + 1) / S)
        let principal = PMT - interest
        if (principal > bal) principal = bal
        bal = Math.max(0, bal - principal)
        const payment = principal + interest
        const r = {
            month: m,
            payment: round2(payment),
            principal: round2(principal),
            interest: round2(interest),
            balance: round2(bal),
        }
        accInt += r.interest
        rows.push(r)
    }
    return { pmt: round2(PMT), rows, totalInterest: round2(accInt) }
}

/** ---------- Revolving / Credit card (ADB approx) ---------- */
export function scheduleRevolving(params: {
    balance0: number
    apr: number
    minPct?: number
    minFloor?: number
    overridePayment?: number
    monthsLimit?: number
}) {
    let { balance0: bal, apr, minPct = 0.03, minFloor = 200, overridePayment, monthsLimit = 240 } = params
    const rateDay = apr / 100 / DAYS

    const rows: ScheduleRow[] = []
    let totalInterest = 0
    for (let m = 1; m <= monthsLimit && bal > 0.005; m++) {
        const interest = round2(bal * rateDay * 30) // รอบบิล 30 วัน (approx)
        const minPay = Math.max(minFloor, bal * minPct)
        const target = overridePayment ?? minPay
        const payment = Math.min(round2(bal + interest), round2(target))
        const principal = Math.max(0, round2(payment - interest))
        bal = Math.max(0, round2(bal - principal))
        totalInterest += interest
        rows.push({ month: m, payment, principal, interest, balance: bal })
    }
    return { rows, totalInterest: round2(totalInterest) }
}

/** ---------- รวมตารางจากหลายหนี้เป็นตารางเดียว ---------- */
export function aggregateSchedules(schedules: ScheduleRow[][]): ScheduleRow[] {
    const maxMonths = schedules.reduce((mx, s) => Math.max(mx, s.length), 0)
    const out: ScheduleRow[] = []
    for (let m = 1; m <= maxMonths; m++) {
        let payment = 0, principal = 0, interest = 0, balance = 0
        for (const s of schedules) {
            const row = s.find(r => r.month === m)
            if (row) {
                payment += row.payment
                principal += row.principal
                interest += row.interest
                balance += row.balance
            }
        }
        out.push({
            month: m,
            payment: round2(payment),
            principal: round2(principal),
            interest: round2(interest),
            balance: round2(balance),
        })
    }
    while (out.length > 0 && out[out.length - 1].balance === 0 && out[out.length - 1].payment === 0) {
        out.pop()
    }
    return out
}

/** ---------- ตัวช่วยแจ้งเตือนขั้นต่ำ/ข้อผิดปกติ ---------- */
export function minPaymentForRevolving(balance: number, minPct = 0.03, minFloor = 200) {
    return Math.max(minFloor, balance * minPct)
}

export function makeIssue(kind: ValidationIssueKind, extra?: Partial<ValidationIssue>): ValidationIssue {
    return { kind, ...extra }
}

/* ==========================================================================
   ตารางรวมสำหรับ UI (ย้ายมาที่ไฟล์นี้ให้เป็นแหล่งคำนวณเดียว)
   ========================================================================== */

export type DebtInput =
    | {
        method: 'reducing'
        amount: number
        interestRate: number // APR %
        term?: number                 // ถ้า lock=term
        monthlyPayment?: number       // ถ้า lock=payment
    }
    | {
        method: 'flat'
        amount: number
        interestRate: number          // flat rate %
        term: number
        allocation?: 'rule78' | 'equal'
    }
    | {
        method: 'revolving'
        amount: number
        interestRate: number          // APR %
        minPct?: number               // 0.03 = 3%
        minFloor?: number             // 200
        monthlyPayment?: number       // override ค่างวดคงที่
    }

export type AmortizationRow = {
    month: number
    income: number
    expenses: number
    monthlyDebtPayment: number
    principalPaid: number
    interestPaid: number
    remainingDebt: number
    cumulativePaid: number
}

/** รวมตารางแบบ “จริง” สำหรับ UI (อย่าคำนวณซ้ำที่อื่น) */
export function buildAmortizationRows(
    monthlyIncome: number,
    monthlyExpenses: number,
    debts: DebtInput[],
): AmortizationRow[] {
    const schedules = debts.map(d => {
        if (d.method === 'reducing') {
            if (d.monthlyPayment && !d.term) {
                const r = resolveReducingByMode({
                    principal: d.amount,
                    apr: d.interestRate,
                    lock: 'payment',
                    pmtOverride: d.monthlyPayment,
                })
                const n = r.ok ? r.months : 0
                return scheduleReducing(d.amount, d.interestRate, n, d.monthlyPayment)
            }
            return scheduleReducing(d.amount, d.interestRate, Math.max(0, Math.round(d.term ?? 0)))
        }

        if (d.method === 'flat') {
            return scheduleFlat(d.amount, d.interestRate, d.term, d.allocation ?? 'rule78')
        }

        return scheduleRevolving({
            balance0: d.amount,
            apr: d.interestRate,
            minPct: d.minPct,
            minFloor: d.minFloor,
            overridePayment: d.monthlyPayment,
            monthsLimit: 360,
        })
    })

    const merged = aggregateSchedules(schedules.map(s => s.rows))

    let cumulative = 0
    return merged.map(r => {
        cumulative = round2(cumulative + r.payment)
        return {
            month: r.month,
            income: monthlyIncome,
            expenses: monthlyExpenses,
            monthlyDebtPayment: r.payment,
            principalPaid: r.principal,
            interestPaid: r.interest,
            remainingDebt: r.balance,
            cumulativePaid: cumulative,
        }
    })
}