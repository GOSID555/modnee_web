'use client'

import { Box, Grid, Paper, Typography, Chip } from '@mui/material'
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
}

export default function IndividualDebtSummary({ items }: Props) {
    return (
        <Box sx={{ px: 3, mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'grey.900' }}>
                Individual Debts
            </Typography>

            <Grid container spacing={2}>
                {items.map((d) => (
                    <Grid item xs={12} md={6} lg={4} key={d.id}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                bgcolor: 'white',
                                border: '1px solid',
                                borderColor: 'grey.200',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography sx={{ flex: 1, fontWeight: 600, color: 'grey.900' }}>
                                    {d.name || 'Untitled Debt'}
                                </Typography>
                                <Chip
                                    size="small"
                                    label={d.type === 'reducing' ? 'Reducing' : 'Fixed'}
                                    color="default"
                                    variant="outlined"
                                />
                            </Box>

                            <Typography sx={{ color: 'grey.600', fontSize: 13 }}>
                                Principal: $ {formatMoney(d.amount)} · Rate: {d.interestRate}% · Term: {d.term} mo
                            </Typography>

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
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}