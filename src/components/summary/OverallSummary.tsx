'use client'

import type { ReactNode } from 'react'
import { Box, Paper, Typography } from '@mui/material'
import PaidIcon from '@mui/icons-material/Paid'
import SavingsIcon from '@mui/icons-material/Savings'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import { formatMoney } from '@/utils/format'

export type OverallSummaryProps = {
    totalDebt: number
    totalMonthlyPayment: number
    netIncome: number
    payoffMonths: number
    debtFreeDate: string
    totalInterest?: number
}

type TileProps = { icon: ReactNode; title: string; value: string }

function Tile({ icon, title, value }: TileProps) {
    return (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: 'white',
                border: '1px solid',
                borderColor: 'grey.200',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                width: '100%',
            }}
        >
            <Box sx={{ color: 'grey.700' }}>{icon}</Box>
            <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ color: 'grey.600', fontSize: 13 }}>{title}</Typography>
                <Typography sx={{ color: 'grey.900', fontWeight: 700, fontSize: 18 }}>
                    {value}
                </Typography>
            </Box>
        </Paper>
    )
}

export default function OverallSummary({
    totalDebt,
    totalMonthlyPayment,
    netIncome,
    payoffMonths,
    debtFreeDate,
    totalInterest = 0,
}: OverallSummaryProps) {
    return (
        <Box sx={{ px: 3, mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'grey.900' }}>
                Summary Overview
            </Typography>

            {/* Flexbox แทน Grid: wrap อัตโนมัติ + ช่องไฟสวยงาม */}
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2, // theme spacing (16px)
                }}
            >
                {/* แต่ละ tile เป็น “คอลัมน์” ยืด/หดได้ตามความกว้าง */}
                <Box sx={{ flex: '1 1 260px' }}>
                    <Tile icon={<SavingsIcon />} title="Total Debt" value={`$ ${formatMoney(totalDebt)}`} />
                </Box>

                <Box sx={{ flex: '1 1 260px' }}>
                    <Tile icon={<PaidIcon />} title="Total Monthly Payment" value={`$ ${formatMoney(totalMonthlyPayment)}`} />
                </Box>

                <Box sx={{ flex: '1 1 260px' }}>
                    <Tile icon={<TrendingDownIcon />} title="Net Income (per month)" value={`$ ${formatMoney(netIncome)}`} />
                </Box>

                <Box sx={{ flex: '1 1 260px' }}>
                    <Tile
                        icon={<CalendarMonthIcon />}
                        title={`Debt-free in ~${Math.max(0, Math.round(payoffMonths))} mo.`}
                        value={debtFreeDate}
                    />
                </Box>
            </Box>

            {!!totalInterest && (
                <Typography sx={{ mt: 1, color: 'grey.600', fontSize: 13 }}>
                    Estimated total interest: $ {formatMoney(totalInterest)}
                </Typography>
            )}
        </Box>
    )
}