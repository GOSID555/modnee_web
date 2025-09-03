'use client'

import { useMemo, useState } from 'react'
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    Button,
    Stack,
    Divider,
    Pagination,
} from '@mui/material'
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded'
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded'
import { formatMoney } from '@/utils/format'
import type { AmortizationRow } from '@/utils/amortization'
import PdfExportButton from './PdfExportButton'

type RowEx = AmortizationRow & {
    debtName?: string // ถ้ามีจะใช้แสดง & filter
}

type Props = {
    rows: AmortizationRow[]
    title?: string
}

const ROWS_PER_PAGE = 30

export default function AmortizationTable({ rows, title = 'ตารางกำหนดชำระ' }: Props) {
    const data: RowEx[] = useMemo(() => rows as RowEx[], [rows])

    // รายชื่อหนี้สำหรับตัวกรอง (ซ่อน dropdown ถ้าไม่มีชื่อหนี้)
    const debtNames = useMemo(() => {
        const s = new Set<string>()
        data.forEach((r) => r.debtName && s.add(r.debtName))
        return Array.from(s)
    }, [data])

    const [selectedDebt, setSelectedDebt] = useState<string>('ALL')
    const [page, setPage] = useState<number>(1)

    const filtered = useMemo(() => {
        return selectedDebt === 'ALL'
            ? data
            : data.filter((r) => (r.debtName ?? '') === selectedDebt)
    }, [selectedDebt, data])

    const pageCount = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE))
    const start = (page - 1) * ROWS_PER_PAGE
    const paged = filtered.slice(start, start + ROWS_PER_PAGE)

    const showingFrom = filtered.length === 0 ? 0 : start + 1
    const showingTo = Math.min(filtered.length, start + paged.length)

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                mt: 3,
                borderRadius: 3,
                border: '1px solid #E5E7EB',
                background: '#FFFFFF',
            }}
        >
            {/* Header */}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
                spacing={1.5}
                sx={{ mb: 1.5 }}
            >
                <Box>
                    <Typography sx={{ fontWeight: 800, color: '#0F172A' }}>
                        {title}
                    </Typography>
                    <Typography sx={{ color: '#64748B', fontSize: 12 }}>
                        รายละเอียดการชำระเงินในแต่ละเดือน
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                    {debtNames.length > 0 && (
                        <Select
                            size="small"
                            value={selectedDebt}
                            onChange={(e) => {
                                setPage(1)
                                setSelectedDebt(e.target.value)
                            }}
                            sx={{
                                minWidth: 160,
                                background: '#F8FAFC',
                                borderRadius: 2,
                                '.MuiSelect-select': { py: 0.9 },
                            }}
                        >
                            <MenuItem value="ALL">ทุกหนี้</MenuItem>
                            {debtNames.map((n) => (
                                <MenuItem key={n} value={n}>
                                    {n}
                                </MenuItem>
                            ))}
                        </Select>
                    )}

                    {/* ปุ่ม Export PDF สำหรับตาราง */}
                    <PdfExportButton rows={filtered as any} />
                </Stack>
            </Stack>

            <Divider sx={{ mb: 1.5 }} />

            {/* Table (responsive overflow on small screens) */}
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <Table size="small" aria-label="amortization schedule" sx={{ minWidth: 1000 }}>
                <TableHead>
                    <TableRow
                        sx={{
                            '& th': {
                                background: '#F8FAFC',
                                color: '#94A3B8',
                                fontSize: 12,
                                fontWeight: 700,
                                borderBottom: '1px solid #E2E8F0',
                                textTransform: 'uppercase',
                                letterSpacing: 0.4,
                            },
                        }}
                    >
                        <TableCell>เดือนที่</TableCell>
                        {debtNames.length > 0 && <TableCell>ชื่อหนี้</TableCell>}
                        <TableCell align="right">รายได้ (฿)</TableCell>
                        <TableCell align="right">รายจ่าย (฿)</TableCell>
                        <TableCell align="right">เงินต้น (฿)</TableCell>
                        <TableCell align="right">ดอกเบี้ย (฿)</TableCell>
                        <TableCell align="right">ค่างวดต่อเดือน (฿)</TableCell>
                        <TableCell align="right">ยอดคงเหลือ (฿)</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {paged.map((r, i) => (
                        <TableRow
                            key={`${r.month}-${i}`}
                            hover
                            sx={{
                                '& td': {
                                    borderBottom: '1px solid #F1F5F9',
                                    fontSize: 13.5,
                                    color: '#0F172A',
                                },
                                background: i % 2 === 0 ? '#FFFFFF' : '#FBFDFF',
                            }}
                        >
                            <TableCell sx={{ color: '#475569' }}>{r.month}</TableCell>
                            {debtNames.length > 0 && (
                                <TableCell sx={{ color: '#0F172A' }}>
                                    {(r as RowEx).debtName ?? '–'}
                                </TableCell>
                            )}
                            <TableCell align="right">
                                ฿ {formatMoney((r as any).income ?? 0)}
                            </TableCell>
                            <TableCell align="right">
                                ฿ {formatMoney((r as any).expenses ?? 0)}
                            </TableCell>
                            <TableCell align="right">
                                ฿ {formatMoney((r as any).principal ?? (r as any).principalPaid ?? 0)}
                            </TableCell>
                            <TableCell align="right" sx={{ color: '#EF4444', fontWeight: 600 }}>
                                ฿ {formatMoney((r as any).interest ?? (r as any).interestPaid ?? 0)}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                                ฿ {formatMoney((r as any).payment ?? (r as any).monthlyDebtPayment ?? 0)}
                            </TableCell>
                            <TableCell align="right">
                                ฿ {formatMoney((r as any).balance ?? (r as any).remainingDebt ?? 0)}
                            </TableCell>
                        </TableRow>
                    ))}

                    {paged.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={debtNames.length > 0 ? 8 : 7}
                                align="center"
                                sx={{ py: 4, color: 'grey.600' }}
                            >
                                ไม่พบข้อมูล
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            </Box>

            {/* Footer / Pagination */}
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                alignItems={{ xs: 'flex-start', md: 'center' }}
                justifyContent="space-between"
                spacing={1.5}
                sx={{ mt: 1.5 }}
            >
                <Typography sx={{ color: '#64748B', fontSize: 12 }}>
                    แสดง {showingFrom.toLocaleString()}–{showingTo.toLocaleString()} จาก{' '}
                    {filtered.length.toLocaleString()} รายการชำระ
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<KeyboardArrowLeftRoundedIcon />}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                            borderColor: '#E2E8F0',
                            color: '#334155',
                            '&:hover': { borderColor: '#CBD5E1', background: '#F8FAFC' },
                        }}
                    >
                        ก่อนหน้า
                    </Button>

                    <Pagination
                        count={pageCount}
                        page={page}
                        onChange={(_, p) => setPage(p)}
                        size="small"
                        siblingCount={1}
                        boundaryCount={1}
                        sx={{
                            '.MuiPaginationItem-root': { borderRadius: 2, color: '#334155' },
                            '.Mui-selected': {
                                background: '#EEF2FF !important',
                                color: '#4338CA',
                                border: '1px solid #E0E7FF',
                                fontWeight: 700,
                            },
                        }}
                    />

                    <Button
                        variant="outlined"
                        size="small"
                        endIcon={<KeyboardArrowRightRoundedIcon />}
                        onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                        disabled={page >= pageCount}
                        sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                            borderColor: '#E2E8F0',
                            color: '#334155',
                            '&:hover': { borderColor: '#CBD5E1', background: '#F8FAFC' },
                        }}
                    >
                        ถัดไป
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    )
}
