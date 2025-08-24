'use client'

import type { ReactNode } from 'react'
import { Box, Paper, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import PaidIcon from '@mui/icons-material/Paid'
import SavingsIcon from '@mui/icons-material/Savings'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import { formatMoney } from '@/utils/format'

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
            }}
        >
            <Box sx={{ color: 'grey.700' }}>{icon}</Box>
            <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ color: 'grey.600', fontSize: 13 }}>{title}</Typography>
                <Typography sx={{ color: 'grey.900', fontWeight: 700, fontSize: 18 }}>{value}</Typography>
            </Box>
        </Paper>
    )
}

export default function OverallSummary(props: {
    totalDebt: number
    totalMonthlyPayment: number
    netIncome: number
    payoffMonths: number
    debtFreeDate: string
    totalInterest?: number
}) {
    const { totalDebt, totalMonthlyPayment, netIncome, payoffMonths, debtFreeDate, totalInterest = 0 } = props
    return (
        <Box sx={{ px: 3, mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'grey.900' }}>
                Summary Overview
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={3}>
                    <Tile icon={<SavingsIcon />} title="Total Debt" value={`$ ${formatMoney(totalDebt)}`} />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Tile icon={<PaidIcon />} title="Total Monthly Payment" value={`$ ${formatMoney(totalMonthlyPayment)}`} />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Tile icon={<TrendingDownIcon />} title="Net Income (per month)" value={`$ ${formatMoney(netIncome)}`} />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Tile
                        icon={<CalendarMonthIcon />}
                        title={`Debt-free in ~${Math.max(0, Math.round(payoffMonths))} mo.`}
                        value={debtFreeDate}
                    />
                </Grid>
            </Grid>

            {!!totalInterest && (
                <Typography sx={{ mt: 1, color: 'grey.600', fontSize: 13 }}>
                    Estimated total interest: $ {formatMoney(totalInterest)}
                </Typography>
            )}
        </Box>
    )
}