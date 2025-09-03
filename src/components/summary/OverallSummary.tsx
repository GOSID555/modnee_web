// src/components/summary/OverallSummary.tsx
'use client'

import type { ReactNode } from 'react'
import { Box, Paper, Typography } from '@mui/material'
import EventAvailableRounded from '@mui/icons-material/EventAvailableRounded'
import ReceiptLongRounded from '@mui/icons-material/ReceiptLongRounded'
import PaymentsRounded from '@mui/icons-material/PaymentsRounded'
import SavingsRounded from '@mui/icons-material/SavingsRounded'
import { formatMoney } from '@/utils/format'

export type OverallSummaryProps = {
    totalDebt: number
    totalMonthlyPayment: number
    netIncome: number
    payoffMonths: number
    debtFreeDate: string
    totalInterest?: number
}

type TileProps = {
    icon: ReactNode
    title: string
    value: string
    caption?: string
    color: 'indigo' | 'rose' | 'sky' | 'emerald'
}

const tone = {
    indigo: { bg: '#EEF2FF', border: '#E0E7FF', fg: '#4338CA' },
    rose: { bg: '#FFF1F2', border: '#FFE4E6', fg: '#BE123C' },
    sky: { bg: '#E0F2FE', border: '#BAE6FD', fg: '#0369A1' },
    emerald: { bg: '#ECFDF5', border: '#A7F3D0', fg: '#047857' },
}

function Tile({ icon, title, value, caption, color }: TileProps) {
    const t = tone[color]
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.25,
                borderRadius: 3,
                border: `1px solid ${t.border}`,
                background: t.bg,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                width: '100%',
            }}
        >
            <Box
                sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    background: '#fff',
                    color: t.fg,
                    border: `1px solid ${t.border}`,
                }}
            >
                {icon}
            </Box>
            <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 12, color: '#334155' }}>{title}</Typography>
                <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>
                    {value}
                </Typography>
                {caption && (
                    <Typography sx={{ fontSize: 12, color: '#64748B', mt: 0.25 }}>
                        {caption}
                    </Typography>
                )}
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
    const years = Math.max(0, Math.floor(payoffMonths / 12))
    const months = Math.max(0, payoffMonths % 12)

    return (
        <Box sx={{ px: 0, mb: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography sx={{ fontWeight: 800, color: '#0F172A', fontSize: 18 }}>
                    สรุปการปลดหนี้ของคุณ
                </Typography>
                <Typography sx={{ color: '#475569', fontSize: 13, mt: 0.5 }}>
                    ภาพรวมสรุปหนี้จากข้อมูลและแผนการชำระปัจจุบันของคุณ
                </Typography>
            </Box>

            {/* 4 metrics */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(12, 1fr)',
                    gap: 2,
                }}
            >
                <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 3' } }}>
                    <Tile
                        color="indigo"
                        icon={<EventAvailableRounded />}
                        title="วันที่คาดว่าจะปลดหนี้"
                        value={`${years} ปี ${months} เดือน`}
                        caption="วันที่เหลือ"
                    />
                </Box>

                <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 3' } }}>
                    <Tile
                        color="rose"
                        icon={<ReceiptLongRounded />}
                        title="ดอกเบี้ยรวมโดยประมาณ"
                        value={`฿${formatMoney(totalInterest)}`}
                        caption="รวมทุกหนี้"
                    />
                </Box>

                <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 3' } }}>
                    <Tile
                        color="sky"
                        icon={<PaymentsRounded />}
                        title="ยอดชำระต่อเดือน"
                        value={`฿${formatMoney(totalMonthlyPayment)}`}
                        caption="รวมทุกหนี้"
                    />
                </Box>

                <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 3' } }}>
                    <Tile
                        color="emerald"
                        icon={<SavingsRounded />}
                        title="เงินคงเหลือต่อเดือน"
                        value={`฿${formatMoney(netIncome - totalMonthlyPayment)}`}
                        caption="หลังหักรายจ่ายและหนี้"
                    />
                </Box>
            </Box>

            {!!totalDebt && (
                <Typography sx={{ mt: 1.5, color: '#64748B', fontSize: 12 }}>
                    ยอดหนี้รวมโดยประมาณ: ฿{formatMoney(totalDebt)}
                </Typography>
            )}
        </Box>
    )
}