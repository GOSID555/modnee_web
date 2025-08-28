// src/app/page.tsx
'use client'

import { useMemo } from 'react'
import {
  Box,
  Container,
  Paper,
  Typography,
  Stack,
  Button,
  Divider,
} from '@mui/material'
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded'
import ShowChartRounded from '@mui/icons-material/ShowChartRounded'
import DownloadRounded from '@mui/icons-material/DownloadRounded'

import FinancialOverviewForm from '@/components/form/FinancialOverviewForm'
import DebtListForm from '@/components/form/DebtListForm'
import OverallSummary from '@/components/summary/OverallSummary'
import IndividualDebtSummary from '@/components/summary/IndividualDebtSummary'
import DebtProgressChart from '@/components/chart/DebtProgressChart'
import AmortizationTable from '@/components/table/AmortizationTable'

import { useDebtState } from '@/hooks/useDebtState'
import { useDebtCalculator } from '@/hooks/useDebtCalculator'
import { formatMoney } from '@/utils/format'

function Hero() {
  return (
    <Box
      sx={{
        position: 'relative',
        py: { xs: 6, md: 9 },
        background:
          'linear-gradient(180deg, #F0F7FF 0%, #F7FBFF 50%, #FFFFFF 100%)',
        borderBottom: '1px solid #EEF2F7',
        overflow: 'hidden',
      }}
    >
      {/* soft glow */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(1000px 300px at 50% -50px, rgba(99, 102, 241, .08), transparent 50%)',
          pointerEvents: 'none',
        }}
      />
      <Container>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 32, md: 44 },
            fontWeight: 800,
            color: '#0F172A',
            textAlign: 'center',
            letterSpacing: -0.5,
          }}
        >
          Take Control of Your Debt
        </Typography>
        <Typography
          sx={{
            mt: 1,
            textAlign: 'center',
            color: '#334155',
            maxWidth: 780,
            mx: 'auto',
            lineHeight: 1.7,
          }}
        >
          สร้างแผนปลดหนี้แบบเฉพาะตัว ดูความคืบหน้าด้วยกราฟ สรุปตารางผ่อน
          และดาวน์โหลดรายงานได้ในคลิกเดียว
        </Typography>

        <Stack
          direction="row"
          spacing={3}
          sx={{
            mt: 2.5,
            justifyContent: 'center',
            flexWrap: 'wrap',
            '& .chip': {
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 1.25,
              py: 0.5,
              borderRadius: 999,
              fontSize: 13,
              color: '#0B1220',
              background: '#EBF3FF',
            },
          }}
        >
          <Box className="chip">
            <CheckCircleRounded fontSize="small" /> Multiple debt tracking
          </Box>
          <Box className="chip">
            <ShowChartRounded fontSize="small" /> Visual progress charts
          </Box>
          <Box className="chip">
            <DownloadRounded fontSize="small" /> Exportable reports
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default function Page() {
  // 1) state ฟอร์ม (string-friendly)
  const {
    income,
    setIncome,
    expenses,
    setExpenses,
    debts,
    setDebts,
    incomeNum,
    expensesNum,
    resetAll,
  } = useDebtState()

  // 2) คำนวณผลลัพธ์
  const {
    overall,
    perDebt,
    schedule,
    chartData,
    issues,
    calculate,
    reset,
  } = useDebtCalculator()

  const handleReset = () => {
    resetAll()
    reset()
  }

  const handleCalculate = () => {
    calculate({ incomeStr: income, expensesStr: expenses, debtsUI: debts })
  }

  // 3) ตารางรวม (30 แถว/หน้าไปจัดที่คอมโพเนนต์ตาราง)
  const tableRows = useMemo(() => {
    let cumulative = 0
    return schedule.map((r) => {
      cumulative += r.payment
      return {
        month: r.month,
        income: incomeNum,
        expenses: expensesNum,
        monthlyDebtPayment: r.payment,
        principalPaid: r.principal,
        interestPaid: r.interest,
        remainingDebt: r.balance,
        cumulativePaid: cumulative,
      }
    })
  }, [schedule, incomeNum, expensesNum])

  const availableForDebt = Math.max(0, incomeNum - expensesNum)

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh' }}>
      <Hero />

      <Container sx={{ py: 4 }}>
        {/* Monthly Cash Flow */}

        {/* ใช้ฟอร์มเดิม (สองช่องรายได้/รายจ่าย) */}
        <FinancialOverviewForm
          monthlyIncome={income}
          monthlyExpenses={expenses}
          onChangeIncome={setIncome}
          onChangeExpenses={setExpenses}
        />

        {/* แถบแจ้งเตือนโทนอ่อน */}
        <Box
          sx={{
            m: 4,
            mt: 1.5,
            px: 1.5,
            py: 1,
            borderRadius: 2,
            background: '#EEF6FF',
            color: '#0B1220',
            border: '1px solid #D8E9FF',
            fontSize: 14,
          }}
        >
          Available for Debt Payment:{' '}
          <b>${formatMoney(availableForDebt)}/month</b>
        </Box>


        {/* Debts List */}
        <DebtListForm debts={debts} onChangeDebts={setDebts} issuesByDebt={issues} />

        {/* ปุ่มควบคุมล่างสุดของฟอร์ม */}
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ justifyContent: 'flex-end', mb: 2 }}
        >
          <Button variant="outlined" onClick={handleReset}>
            Reset
          </Button>
          <Button
            variant="contained"
            onClick={handleCalculate}
            startIcon={<ShowChartRounded />}
            sx={{
              background: '#2563EB',
              '&:hover': { background: '#1E40AF' },
            }}
          >
            Calculate Payoff Plan
          </Button>
        </Stack>

        {/* ผลลัพธ์หลังคำนวณ */}
        {overall && (
          <>
            <Divider sx={{ my: 3 }} />

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

            {tableRows.length > 0 && (
              <AmortizationTable rows={tableRows} title="Amortization Schedule" />
            )}
          </>
        )}
      </Container>
    </Box>
  )
}