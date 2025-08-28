// src/components/summary/IndividualDebtSummary.tsx
'use client'

import { Box, Paper, Typography } from '@mui/material'
import type { PerDebtSummary } from '@/types/debt'

type Props = { items: PerDebtSummary[] }

// แผนที่ชื่อ method → ไทย (รองรับค่าที่อาจหลงเหลือจากเวอร์ชันเก่า เช่น "fixed")
const METHOD_TH: Record<string, string> = {
    reducing: 'ลดต้นลดดอก',
    flat: 'ดอกคงที่ (Flat)',
    revolving: 'หมุนเวียน/บัตรเครดิต',
    fixed: 'ดอกคงที่ (Flat)',
}

export default function IndividualDebtSummary({ items }: Props) {
    if (!items?.length) return null

    return (
        <Box sx={{ px: 3, mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'grey.900' }}>
                สรุปแยกรายหนี้
            </Typography>

            {/* ใช้ flex + wrap ให้การ์ดปรับเองตามความกว้าง */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {items.map((d) => (
                    <Paper
                        key={d.id}
                        elevation={1}
                        sx={{
                            p: 2.5,
                            borderRadius: 2,
                            bgcolor: 'white',
                            border: '1px solid',
                            borderColor: 'grey.200',
                            flex: '1 1 280px',
                            minWidth: 260,
                            maxWidth: 420,
                        }}
                    >
                        <Typography sx={{ fontWeight: 600, color: 'grey.900' }}>{d.name}</Typography>
                        <Typography sx={{ fontSize: 13, color: 'grey.600', mt: 0.5 }}>
                            วิธีคิดดอก: {METHOD_TH[String(d.method)] ?? String(d.method)}
                        </Typography>

                        <Box sx={{ mt: 1.5 }}>
                            <Row label="ค่างวดต่อเดือน" value={`฿${(d.monthlyPayment ?? 0).toLocaleString()}`} />
                            <Row label="จำนวนงวด (เดือน)" value={d.term?.toString() ?? '-'} />
                            <Row label="คาดว่าจะปลดหนี้วันที่" value={d.debtFreeDate ?? '-'} />
                            {d.totalInterest != null && (
                                <Row label="ดอกเบี้ยรวม (ประมาณ)" value={`฿${d.totalInterest.toLocaleString()}`} />
                            )}
                        </Box>
                    </Paper>
                ))}
            </Box>
        </Box>
    )
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
            <Typography sx={{ color: 'grey.600', fontSize: 13 }}>{label}</Typography>
            <Typography sx={{ color: 'grey.900', fontWeight: 600, fontSize: 14 }}>{value}</Typography>
        </Box>
    )
}