// src/app/page.tsx
'use client'

import { useMemo, useState } from 'react'
import { Box, Container } from '@mui/material'

import Header from '@/components/layout/Header'
import FinancialOverviewForm from '@/components/form/FinancialOverviewForm'
import DebtListForm, { DebtUI } from '@/components/form/DebtListForm'
import OverallSummary from '@/components/summary/OverallSummary'
import IndividualDebtSummary, { PerDebtSummary } from '@/components/summary/IndividualDebtSummary'
import DebtProgressChart from '@/components/chart/DebtProgressChart'
import AmortizationTable from '@/components/table/AmortizationTable'

import { toNumber } from '@/utils/format'
import { buildMonthlySeries, ChartPoint } from '@/utils/chartData'
import { buildAmortizationRows, AmortizationRow } from '@/utils/amortization'

/** ลดต้นลดดอก (annuity) */
function reducingMonthlyPayment(principal: number, apr: number, months: number): number {
  if (months <= 0) return 0
  const r = apr / 100 / 12
  if (r === 0) return principal / months
  return principal * (r / (1 - Math.pow(1 + r, -months)))
}

/** ดอกคงที่ (flat) แบบประมาณการ */
function fixedMonthlyPayment(principal: number, apr: number, months: number): number {
  if (months <= 0) return 0
  const totalInterest = principal * (apr / 100) * (months / 12)
  return (principal + totalInterest) / months
}

/** บวกเดือนให้วันที่ (yyyy-mm-dd). ถ้าไม่ระบุ start ใช้วันนี้ */
function addMonths(yyyyMmDd: string | undefined, months: number): string {
  const base = yyyyMmDd ? new Date(yyyyMmDd) : new Date()
  const d = new Date(base.getTime())
  d.setMonth(d.getMonth() + Math.max(0, Math.round(months)))
  return d.toISOString().slice(0, 10)
}

export default function Page() {
  // ภาพรวมการเงิน (string เพื่อโชว์ลูกน้ำ + ลบได้ไม่เด้ง 0)
  const [income, setIncome] = useState<string>('')     // เช่น "30,000"
  const [expenses, setExpenses] = useState<string>('') // เช่น "12,500"

  // ลิสต์หนี้ (UI เก็บเป็น string เพื่อโชว์ลูกน้ำ)
  const [debts, setDebts] = useState<DebtUI[]>([])

  // ผลสรุป
  const [overall, setOverall] = useState<{
    totalDebt: number
    totalMonthlyPayment: number
    netIncome: number
    payoffMonths: number
    debtFreeDate: string
    totalInterest?: number
  } | null>(null)
  const [perDebt, setPerDebt] = useState<PerDebtSummary[]>([])

  // กราฟ + ตาราง
  const [chartData, setChartData] = useState<ChartPoint[]>([])
  const [amortRows, setAmortRows] = useState<AmortizationRow[]>([])

  // ตัวเลขจริงเมื่อจำเป็น
  const incomeNum = useMemo(() => toNumber(income), [income])
  const expensesNum = useMemo(() => toNumber(expenses), [expenses])
  const netIncome = useMemo(() => incomeNum - expensesNum, [incomeNum, expensesNum])

  const handleReset = () => {
    setIncome('')
    setExpenses('')
    setDebts([])
    setOverall(null)
    setPerDebt([])
    setChartData([])
    setAmortRows([])
  }

  const handleCalculate = () => {
    // 1) UI (string) -> model ตัวเลข
    const numericDebts = debts.map(d => {
      const amount = toNumber(d.amount)
      const rate = toNumber(d.interestRate)
      const term = Math.round(toNumber(d.term))
      const mpOverride = d.monthlyPayment ? toNumber(d.monthlyPayment) : undefined
      return {
        id: d.id,
        name: d.name || 'Debt',
        amount,
        interestRate: rate,
        term,
        type: d.interestType as 'fixed' | 'reducing',
        startDate: d.startDate || undefined,
        monthlyPayment: mpOverride,
      }
    })

    // 2) คำนวณสรุปแยกรายหนี้ (แบบง่ายก่อน)
    const perDebtSummaries: PerDebtSummary[] = numericDebts.map(d => {
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

    // 3) สรุปภาพรวม
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

    // 4) ซีรีส์ข้อมูลกราฟ (แบบง่ายก่อน)
    const series = buildMonthlySeries(
      incomeNum,
      expensesNum,
      numericDebts.map(d => ({
        amount: d.amount,
        interestRate: d.interestRate,
        term: d.term,
        type: d.type,
      }))
    )
    setChartData(series)

    // 5) แถวตาราง (30 แถว/หน้า + ปุ่ม Export PDF เฉพาะตารางในคอมโพเนนต์)
    const tableRows = buildAmortizationRows(
      incomeNum,
      expensesNum,
      numericDebts.map(d => ({
        amount: d.amount,
        interestRate: d.interestRate,
        term: d.term,
        type: d.type,
      }))
    )
    setAmortRows(tableRows)
  }

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Header onReset={handleReset} onCalculate={handleCalculate} />

      <Container sx={{ py: 3 }}>
        {/* ภาพรวมการเงิน */}
        <FinancialOverviewForm
          monthlyIncome={income}
          monthlyExpenses={expenses}
          onChangeIncome={setIncome}
          onChangeExpenses={setExpenses}
        />

        {/* ลิสต์หนี้ */}
        <DebtListForm debts={debts} onChangeDebts={setDebts} />

        {/* สรุปผล + กราฟ + ตาราง */}
        {overall && (
          <>
            <OverallSummary
              totalDebt={overall.totalDebt}
              totalMonthlyPayment={overall.totalMonthlyPayment}
              netIncome={overall.netIncome}
              payoffMonths={overall.payoffMonths}
              debtFreeDate={overall.debtFreeDate}
              totalInterest={overall.totalInterest}
            />

            <IndividualDebtSummary items={perDebt} />

            {chartData.length > 0 && <DebtProgressChart data={chartData} />}

            {amortRows.length > 0 && <AmortizationTable rows={amortRows} />}
          </>
        )}
      </Container>
    </Box>
  )
}