'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import FinancialOverviewForm from '@/components/form/FinancialOverviewForm'
import DebtListForm, { DebtUI } from '@/components/form/DebtListForm'
import { toNumber } from '@/utils/format'
import { Box, Container } from '@mui/material'

export default function Page() {
  const [income, setIncome] = useState<string>('')     // string มีคอมมา
  const [expenses, setExpenses] = useState<string>('')
  const [debts, setDebts] = useState<DebtUI[]>([])

  const handleReset = () => {
    setIncome('')
    setExpenses('')
    setDebts([])
  }

  const handleCalculate = () => {
    // แปลง UI → Model ก่อนส่งเข้า hook คำนวณ
    const incomeNum = toNumber(income)
    const expensesNum = toNumber(expenses)
    const numericDebts = debts.map(d => ({
      id: d.id,
      name: d.name,
      amount: toNumber(d.amount),
      interestType: d.interestType,
      interestRate: toNumber(d.interestRate),
      term: Math.round(toNumber(d.term)),
      startDate: d.startDate,
      monthlyPayment: d.monthlyPayment ? toNumber(d.monthlyPayment) : undefined,
    }))
    console.log({ incomeNum, expensesNum, numericDebts })
    // TODO: ส่ง numericDebts, incomeNum, expensesNum เข้า useDebtCalculator แล้วไปแสดงผล
  }

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Header onReset={handleReset} onCalculate={handleCalculate} />

      <Container sx={{ py: 3 }}>
        <FinancialOverviewForm
          monthlyIncome={income}
          monthlyExpenses={expenses}
          onChangeIncome={setIncome}
          onChangeExpenses={setExpenses}
        />

        <DebtListForm debts={debts} onChangeDebts={setDebts} />
      </Container>
    </Box>
  )
}