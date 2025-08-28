'use client'

import {
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { Paper, Box, Typography } from '@mui/material'
import { formatMoney } from '@/utils/format'
import type { ChartPoint } from '@/utils/chartData' // ใช้อยู่แล้วในโปรเจกต์

type Props = { data: ChartPoint[]; title?: string }

/** พยายาม map ชื่อคีย์อัตโนมัติให้เข้ากับ data ที่มีอยู่ */
function pickKey(obj: any, candidates: string[], fallback: string) {
    return candidates.find((k) => obj && k in obj) ?? fallback
}

const C = {
    remaining: { stroke: '#6366F1', fill: 'url(#gradRemaining)' }, // indigo
    paid: { stroke: '#22C55E', fill: 'url(#gradPaid)' },           // green
    income: { stroke: '#0EA5E9', fill: 'url(#gradIncome)' },       // sky
    expenses: { stroke: '#F43F5E', fill: 'url(#gradExpenses)' },   // rose
}

export default function DebtProgressChart({ data, title = 'Debt Payoff Progress' }: Props) {
    const first: any = data?.[0] ?? {}
    const xKey = pickKey(first, ['label', 'monthLabel', 'date', 'month'], 'label')
    const remainingKey = pickKey(first, ['remainingDebt', 'totalRemaining', 'balance', 'remaining'], 'remainingDebt')
    const paidKey = pickKey(first, ['cumulativePaid', 'totalDebtPaid', 'cumulative'], 'cumulativePaid')
    const incomeKey = pickKey(first, ['income', 'monthlyIncome'], 'income')
    const expensesKey = pickKey(first, ['expenses', 'monthlyExpenses'], 'expenses')

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                mt: 2,
                borderRadius: 3,
                border: '1px solid #E5E7EB',
            }}
        >
            <Typography sx={{ fontWeight: 700, color: '#0F172A', mb: 0.5 }}>
                {title}
            </Typography>
            <Typography sx={{ color: '#64748B', fontSize: 12, mb: 1.5 }}>
                Track your journey to debt freedom over time
            </Typography>

            <Box sx={{ width: '100%', height: 380 }}>
                <ResponsiveContainer>
                    <AreaChart data={data as any[]} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="gradRemaining" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6366F1" stopOpacity={0.24} />
                                <stop offset="100%" stopColor="#6366F1" stopOpacity={0.04} />
                            </linearGradient>
                            <linearGradient id="gradPaid" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#22C55E" stopOpacity={0.24} />
                                <stop offset="100%" stopColor="#22C55E" stopOpacity={0.04} />
                            </linearGradient>
                            <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.18} />
                                <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0.03} />
                            </linearGradient>
                            <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#F43F5E" stopOpacity={0.18} />
                                <stop offset="100%" stopColor="#F43F5E" stopOpacity={0.03} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid stroke="#EEF2F7" strokeDasharray="4 4" />
                        <XAxis
                            dataKey={xKey}
                            tick={{ fill: '#64748B', fontSize: 12 }}
                            axisLine={{ stroke: '#E2E8F0' }}
                            tickLine={{ stroke: '#E2E8F0' }}
                        />
                        <YAxis
                            tickFormatter={(v) => `$${formatMoney(v)}`}
                            tick={{ fill: '#64748B', fontSize: 12 }}
                            axisLine={{ stroke: '#E2E8F0' }}
                            tickLine={{ stroke: '#E2E8F0' }}
                            width={72}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: 8, borderColor: '#E5E7EB' }}
                            formatter={(value: any, name: any) =>
                                typeof value === 'number' ? [`$${formatMoney(value)}`, name] : [value, name]
                            }
                            labelStyle={{ color: '#0F172A' }}
                        />
                        <Legend wrapperStyle={{ color: '#475569', fontSize: 12 }} />

                        {/* Remaining balance */}
                        {first[remainingKey] != null && (
                            <Area
                                type="monotone"
                                name="Total Remaining"
                                dataKey={remainingKey}
                                stroke={C.remaining.stroke}
                                fill={C.remaining.fill}
                                strokeWidth={2}
                                dot={false}
                            />
                        )}
                        {/* Cumulative paid */}
                        {first[paidKey] != null && (
                            <Area
                                type="monotone"
                                name="Cumulative Paid"
                                dataKey={paidKey}
                                stroke={C.paid.stroke}
                                fill={C.paid.fill}
                                strokeWidth={2}
                                dot={false}
                            />
                        )}
                        {/* Income */}
                        {first[incomeKey] != null && (
                            <Area
                                type="monotone"
                                name="Income"
                                dataKey={incomeKey}
                                stroke={C.income.stroke}
                                fill={C.income.fill}
                                strokeWidth={2}
                                dot={false}
                            />
                        )}
                        {/* Expenses */}
                        {first[expensesKey] != null && (
                            <Area
                                type="monotone"
                                name="Expenses"
                                dataKey={expensesKey}
                                stroke={C.expenses.stroke}
                                fill={C.expenses.fill}
                                strokeWidth={2}
                                dot={false}
                            />
                        )}
                    </AreaChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    )
}