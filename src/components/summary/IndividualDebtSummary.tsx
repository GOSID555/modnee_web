'use client'

import type { ReactNode } from 'react'
import { Box, Paper, Typography, Chip } from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { formatMoney } from '@/utils/format'

export type PerDebtSummary = {
    id: string
    name: string
    amount: number
    interestRate: number
    term: number
    type: 'fixed' | 'reducing'
    monthlyPayment: number
    debtFreeDate: string        // yyyy-mm-dd
    totalInterest?: number
}

type Props = {
    items: PerDebtSummary[]
    emptyHint?: ReactNode
}

export default function IndividualDebtSummary({ items, emptyHint }: Props) {
    return (
        <Box sx={{ px: 3, mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'grey.900' }}>
                Individual Debts
            </Typography>

            {/* Flexbox container */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {items.length === 0 && (
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            borderColor: 'grey.200',
                            bgcolor: 'white',
                            color: 'grey.600',
                            width: '100%',
                        }}
                    >
                        {emptyHint ?? 'ยังไม่มีรายการหนี้'}
                    </Paper>
                )}

                {items.map((d) => (
                    <Box key={d.id} sx={{ flex: '1 1 300px', minWidth: 280, maxWidth: '100%' }}>
                        <DebtCard {...d} />
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

function DebtCard(d: PerDebtSummary) {
    return (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: 'white',
                border: '1px solid',
                borderColor: 'grey.200',
                height: '100%',
            }}
        >
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ flex: 1, fontWeight: 600, color: 'grey.900' }}>
                    {d.name || 'Untitled Debt'}
                </Typography>
                <Chip
                    size="small"
                    label={d.type === 'reducing' ? 'Reducing' : 'Fixed'}
                    variant="outlined"
                />
            </Box>

            {/* Meta */}
            <Typography sx={{ color: 'grey.600', fontSize: 13 }}>
                Principal: $ {formatMoney(d.amount)} · Rate: {d.interestRate}% · Term: {d.term} mo
            </Typography>

            {/* Row: Monthly + Date */}
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                <Typography sx={{ color: 'grey.700' }}>
                    Monthly: <b>$ {formatMoney(d.monthlyPayment)}</b>
                </Typography>
                <Box sx={{ flex: 1 }} />
                <CalendarMonthIcon sx={{ fontSize: 18, color: 'grey.600' }} />
                <Typography sx={{ color: 'grey.800' }}>{d.debtFreeDate}</Typography>
            </Box>

            {!!d.totalInterest && (
                <Typography sx={{ color: 'grey.600', fontSize: 12, mt: 0.5 }}>
                    Interest total: $ {formatMoney(d.totalInterest)}
                </Typography>
            )}
        </Paper>
    )
}