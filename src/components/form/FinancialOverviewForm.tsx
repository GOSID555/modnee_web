// src/components/form/FinancialOverviewForm.tsx
'use client'

import { Box, Paper, Typography } from '@mui/material'
import NumericTextField from '@/components/shared/NumericTextField'

type Props = {
    monthlyIncome: string
    monthlyExpenses: string
    onChangeIncome: (value: string) => void
    onChangeExpenses: (value: string) => void
}

export default function FinancialOverviewForm({
    monthlyIncome,
    monthlyExpenses,
    onChangeIncome,
    onChangeExpenses,
}: Props) {
    return (
        <Box sx={{ px: 3, mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'grey.900' }}>
                Personal Financial Overview
            </Typography>

            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Paper elevation={2} sx={{ p: 3, flex: '1 1 320px', borderRadius: 2, bgcolor: 'white', border: '1px solid', borderColor: 'grey.200' }}>
                    <Typography sx={{ mb: 1, color: 'grey.700', fontSize: 15 }}>
                        Monthly Income
                    </Typography>
                    <NumericTextField
                        fullWidth
                        size="small"
                        value={monthlyIncome}
                        onChange={onChangeIncome}
                        decimals={2}
                        placeholder="0.00"
                    />
                </Paper>

                <Paper elevation={2} sx={{ p: 3, flex: '1 1 320px', borderRadius: 2, bgcolor: 'white', border: '1px solid', borderColor: 'grey.200' }}>
                    <Typography sx={{ mb: 1, color: 'grey.700', fontSize: 15 }}>
                        Monthly Expenses
                    </Typography>
                    <NumericTextField
                        fullWidth
                        size="small"
                        value={monthlyExpenses}
                        onChange={onChangeExpenses}
                        decimals={2}
                        placeholder="0.00"
                    />
                </Paper>
            </Box>
        </Box>
    )
}