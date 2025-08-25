// src/utils/amortization.ts
export type DebtInput = {
    amount: number
    interestRate: number   // APR %
    term: number           // months
    type: 'fixed' | 'reducing'
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

// annuity (ลดต้นลดดอก)
function reducingMonthlyPayment(p: number, apr: number, m: number) {
    if (m <= 0) return 0
    const r = apr / 100 / 12
    if (r === 0) return p / m
    return p * (r / (1 - Math.pow(1 + r, -m)))
}

// flat (ดอกคงที่โดยประมาณ)
function fixedMonthlyPayment(p: number, apr: number, m: number) {
    if (m <= 0) return 0
    const totalInterest = p * (apr / 100) * (m / 12)
    return (p + totalInterest) / m
}

/** ตารางแบบประมาณการเพื่อโชว์ UI (จะละเอียดขึ้นตอนปรับ business logic) */
export function buildAmortizationRows(
    monthlyIncome: number,
    monthlyExpenses: number,
    debts: DebtInput[]
): AmortizationRow[] {
    const months = Math.max(0, ...debts.map(d => d.term), 0)
    const totalPrincipal = debts.reduce((s, d) => s + d.amount, 0)

    // เตรียมค่างวด/เงินต้นต่อเดือนของหนี้แต่ละก้อน
    const perDebtPayment = debts.map(d =>
        d.type === 'reducing'
            ? reducingMonthlyPayment(d.amount, d.interestRate, d.term)
            : fixedMonthlyPayment(d.amount, d.interestRate, d.term)
    )
    const perDebtPrincipal = debts.map(d => (d.term > 0 ? d.amount / d.term : 0))

    let remaining = totalPrincipal
    let cumulative = 0
    const rows: AmortizationRow[] = []

    for (let i = 1; i <= months; i++) {
        let monthlyDebtPayment = 0
        let principalPaid = 0

        debts.forEach((d, idx) => {
            if (i <= d.term) {
                monthlyDebtPayment += perDebtPayment[idx]
                principalPaid += perDebtPrincipal[idx]
            }
        })

        const interestPaid = Math.max(0, monthlyDebtPayment - principalPaid)
        cumulative += monthlyDebtPayment
        remaining = Math.max(0, remaining - principalPaid)

        rows.push({
            month: i,
            income: monthlyIncome,
            expenses: monthlyExpenses,
            monthlyDebtPayment,
            principalPaid,
            interestPaid,
            remainingDebt: remaining,
            cumulativePaid: cumulative,
        })
    }

    return rows
}