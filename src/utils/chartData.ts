// src/utils/chartData.ts
export type ChartPoint = {
    month: number           // 1..N
    label: string           // e.g., "M1"
    income: number
    expenses: number
    remainingDebt: number
    paidToDate: number
}

export type DebtInput = {
    amount: number
    interestRate: number    // APR %
    term: number            // months
    type: 'fixed' | 'reducing'
}

/** สูตรค่างวดแบบลดต้นลดดอก (annuity) */
function reducingMonthlyPayment(p: number, apr: number, m: number) {
    if (m <= 0) return 0
    const r = apr / 100 / 12
    if (r === 0) return p / m
    return p * (r / (1 - Math.pow(1 + r, -m)))
}

/** สูตรค่างวดแบบ flat (ดอกคงที่โดยประมาณ) */
function fixedMonthlyPayment(p: number, apr: number, m: number) {
    if (m <= 0) return 0
    const totalInterest = p * (apr / 100) * (m / 12)
    return (p + totalInterest) / m
}

/**
 * สร้างซีรีส์รายเดือนแบบคร่าว ๆ:
 * - ค่างวดต่อเดือน: คงที่ (per debt) ตามสูตรด้านบน
 * - ตัดเงินต้นต่อเดือน: ประมาณ = amount / term (เชิงเส้น) — เดี๋ยวค่อยละเอียดทีหลัง
 */
export function buildMonthlySeries(
    monthlyIncome: number,
    monthlyExpenses: number,
    debts: DebtInput[]
): ChartPoint[] {
    const months = Math.max(0, ...debts.map(d => d.term), 0)
    let remainingPrincipal = debts.reduce((s, d) => s + d.amount, 0)
    let paidToDate = 0
    const points: ChartPoint[] = []

    // เตรียมยอดผ่อนรายหนี้
    const perDebtMonthlyPay = debts.map(d =>
        d.type === 'reducing'
            ? reducingMonthlyPayment(d.amount, d.interestRate, d.term)
            : fixedMonthlyPayment(d.amount, d.interestRate, d.term)
    )
    const perDebtPrincipalPerMonth = debts.map(d => (d.term > 0 ? d.amount / d.term : 0))

    for (let i = 1; i <= months; i++) {
        // รวมยอดจ่ายหนี้ของเดือนนี้ (เฉพาะหนี้ที่ยังไม่จบ term)
        let monthlyDebtPay = 0
        debts.forEach((d, idx) => {
            if (i <= d.term) monthlyDebtPay += perDebtMonthlyPay[idx]
        })

        // ประมาณการตัดเงินต้นรวมเดือนนี้ = sum(amount/term ของหนี้ที่ยังผ่อนอยู่)
        let principalCut = 0
        debts.forEach((d, idx) => {
            if (i <= d.term) principalCut += perDebtPrincipalPerMonth[idx]
        })

        paidToDate += monthlyDebtPay
        remainingPrincipal = Math.max(0, remainingPrincipal - principalCut)

        points.push({
            month: i,
            label: `M${i}`,
            income: monthlyIncome,
            expenses: monthlyExpenses,
            remainingDebt: remainingPrincipal,
            paidToDate: paidToDate,
        })
    }

    return points
}