// src/components/chart/DebtProgressChart.tsx
'use client'

import { forwardRef } from 'react'
import { Box, Paper, Typography } from '@mui/material'
import {
    ResponsiveContainer,
    ComposedChart,
    Line,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
} from 'recharts'
import { formatMoney } from '@/utils/format'

export type ChartPoint = {
    month: number
    label: string
    income: number
    expenses: number
    remainingDebt: number
    paidToDate: number
}

type Props = {
    data: ChartPoint[]
    title?: string
}

const DebtProgressChart = forwardRef<HTMLDivElement, Props>(
    ({ data, title = 'Debt Progress' }, ref) => {
        return (
            <Box sx={{ px: 3, mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'grey.900' }}>
                    {title}
                </Typography>

                {/* ผูก ref ที่กล่องครอบกราฟ เพื่อให้ html2canvas จับภาพได้ */}
                <Paper
                    ref={ref}
                    elevation={2}
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'white',
                        border: '1px solid',
                        borderColor: 'grey.200',
                        height: 360,
                    }}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data} margin={{ left: 8, right: 12, top: 8, bottom: 8 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="label" />
                            <YAxis tickFormatter={(v) => `$${formatMoney(Number(v), 0)}`} width={80} />
                            <Tooltip
                                formatter={(val: any, name: string) => {
                                    const moneyKeys = ['income', 'expenses', 'remainingDebt', 'paidToDate']
                                    if (moneyKeys.includes(name)) return [`$ ${formatMoney(Number(val))}`, name]
                                    return [val, name]
                                }}
                                labelFormatter={(label) => `Month: ${label}`}
                            />
                            <Legend />

                            <Area type="monotone" dataKey="remainingDebt" name="Remaining Debt" fill="#e5e7eb" stroke="#6b7280" strokeWidth={2} fillOpacity={0.6} />
                            <Line type="monotone" dataKey="paidToDate" name="Paid (Cumulative)" stroke="#111827" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="income" name="Income / month" stroke="#1f2937" strokeDasharray="5 4" dot={false} />
                            <Line type="monotone" dataKey="expenses" name="Expenses / month" stroke="#9ca3af" strokeDasharray="4 4" dot={false} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </Paper>
            </Box>
        )
    }
)

DebtProgressChart.displayName = 'DebtProgressChart'
export default DebtProgressChart