// src/app/page.tsx
'use client'


import { useMemo } from 'react'
import {
  Box,
  Container,
  Paper,
  Typography,
  Stack,
  Divider,
  Button,
} from '@mui/material'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import CalculateIcon from '@mui/icons-material/Calculate'

import Hero from '@/components/layout/Hero'
import FinancialOverviewForm from '@/components/form/FinancialOverviewForm'
import DebtListForm from '@/components/form/DebtListForm'
import OverallSummary from '@/components/summary/OverallSummary'
import IndividualDebtSummary from '@/components/summary/IndividualDebtSummary'
import DebtProgressChart from '@/components/chart/DebtProgressChart'
import AmortizationTable from '@/components/table/AmortizationTable'

import { useDebtState } from '@/hooks/useDebtState'
import useDebtCalculator from '@/hooks/useDebtCalculator'


export default function Page() {
  /** 1) เก็บ state จากฟอร์ม (string-friendly สำหรับ NumericTextField) */
  const {
    income, setIncome,
    expenses, setExpenses,
    debts, setDebts,
    incomeNum, expensesNum,
    resetAll,
  } = useDebtState()

  /** 2) Logic คำนวณ (ทั้งหมดอยู่ใน hook — หน้าเพจไม่คำนวณเอง) */
  const {
    overall,         // ภาพรวมสรุป
    perDebt,         // สรุปแยกรายหนี้
    schedule,        // ตารางรวม (เดือน, principal, interest, balance)
    chartData,       // ข้อมูลกราฟ
    issues,          // ป้ายแจ้งเตือนต่อหนี้
    calculate,       // trigger คำนวณ
    reset,           // ล้างผลคำนวณ
    makeTableRows,   // helper ทำแถวตาราง (map schedule → UI rows)
  } = useDebtCalculator()

  /** ปุ่ม: ล้างค่า */
  const handleReset = () => { resetAll(); reset() }

  /** ปุ่ม: คำนวณ */
  const handleCalculate = () => {
    calculate({ incomeStr: income, expensesStr: expenses, debtsUI: debts })
  }

  /** 3) แถวตาราง (ใช้ helper จาก hook — หน้าเพจไม่ทำสูตรเอง) */
  const tableRows = useMemo(
    () => makeTableRows(schedule, incomeNum, expensesNum),
    [makeTableRows, schedule, incomeNum, expensesNum],
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f7f9fc' }}>
      {/* HERO ด้านบน */}
      <Hero />
      <Box sx={{ height: 10 }}></Box>
      <Container maxWidth="lg" sx={{ pb: 6 }}>
        {/* การ์ดฟอร์มหลัก (กระแสเงินสด + รายการหนี้ + ปุ่ม) */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            mb: 4,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: '#fff',
          }}
        >
          {/* หัวการ์ด */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'grey.900' }}>
              เพิ่มข้อมูลหนี้ของคุณ
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              กรอกข้อมูลของแต่ละหนี้เพื่อสร้างแผนการปลดหนี้ที่เหมาะกับคุณ
            </Typography>
          </Box>

          {/* กระแสเงินสด (รายรับ/รายจ่าย) */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2, md: 2.5 },
              mb: 3,
              borderRadius: 2,
              bgcolor: '#f8fbff',
              borderColor: 'rgba(59,130,246,0.25)',
            }}
          >
            <FinancialOverviewForm
              monthlyIncome={income}
              monthlyExpenses={expenses}
              onChangeIncome={setIncome}
              onChangeExpenses={setExpenses}
            />
          </Paper>

          {/* รายการหนี้หลายก้อน */}
          <DebtListForm
            debts={debts}
            onChangeDebts={setDebts}
            issuesByDebt={issues}
          />

          {/* แถบปุ่มล่างสุดของการ์ด */}

          <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<RestartAltIcon />}
              onClick={handleReset}
              sx={{ textTransform: 'none' }}
            >
              ล้างค่า
            </Button>
            <Button
              variant="contained"
              startIcon={<CalculateIcon />}
              onClick={handleCalculate}
              sx={{ textTransform: 'none' }}
            >
              คำนวณแผนการชำระ
            </Button>
          </Stack>
        </Paper>

        {/* ผลลัพธ์หลังคำนวณ */}
        {overall && (
          <>
            {/* สรุปภาพรวม */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3 },
                mb: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: '#fff',
              }}
            >
              <OverallSummary
                totalDebt={overall.totalDebt}
                totalMonthlyPayment={overall.totalMonthlyPayment}
                netIncome={overall.netIncome}
                payoffMonths={overall.payoffMonths}
                debtFreeDate={overall.debtFreeDate}
                totalInterest={overall.totalInterest}
              />
            </Paper>

            {/* สรุปแยกรายหนี้ */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3 },
                mb: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: '#fff',
              }}
            >
              <IndividualDebtSummary items={perDebt} />
            </Paper>

            {/* กราฟความคืบหน้า */}
            {chartData.length > 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  mb: 3,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: '#fff',
                }}
              >
                <DebtProgressChart data={chartData} />
              </Paper>
            )}

            {/* ตารางผ่อนชำระ */}
            {tableRows.length > 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  mb: 3,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: '#fff',
                }}
              >
                <AmortizationTable rows={tableRows} />
              </Paper>
            )}
          </>
        )}
      </Container>
    </Box>
  )
}