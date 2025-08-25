// src/components/table/AmortizationTable.tsx
'use client'

import { useMemo, useState } from 'react'
import {
    Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TablePagination
} from '@mui/material'
import type { AmortizationRow } from '@/utils/amortization'
import { formatMoney } from '@/utils/format'

import FullReportPdfButton from '@/components/export/FullReportPdfButton'
import type { PerDebtSummary } from '@/components/summary/IndividualDebtSummary'
import PdfExportButton from './PdfExportButton'

type FullReportProps = {
    overall: {
        totalDebt: number
        totalMonthlyPayment: number
        netIncome: number
        payoffMonths: number
        debtFreeDate: string
        totalInterest?: number
    }
    perDebt: PerDebtSummary[]
    amortRows: AmortizationRow[]
    chartRef?: React.RefObject<HTMLDivElement>
    fileName?: string
}

type Props = {
    rows: AmortizationRow[]
    title?: string
    /** ถ้าส่งมา จะแสดงปุ่ม Download PDF (Full Report) บนหัวตาราง */
    fullReport?: FullReportProps
}

const ROWS_PER_PAGE = 30

export default function AmortizationTable({ rows, title = 'Amortization Schedule', fullReport }: Props) {
    const [page, setPage] = useState(0)

    const paged = useMemo(() => {
        const start = page * ROWS_PER_PAGE
        return rows.slice(start, start + ROWS_PER_PAGE)
    }, [rows, page])

    return (
        <Box sx={{ px: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                <Typography variant="h6" sx={{ flex: 1, fontWeight: 600, color: 'grey.900' }}>
                    {title}
                </Typography>

                {/* ⬇️ ปุ่มโหลด PDF ทั้งหน้า (ถ้าส่ง fullReport มา) */}
                {fullReport && (
                    <FullReportPdfButton
                        overall={fullReport.overall}
                        perDebt={fullReport.perDebt}
                        amortRows={fullReport.amortRows}
                        chartRef={fullReport.chartRef}
                        fileName={fullReport.fileName ?? 'debt-report.pdf'}
                    />
                )}

                {/* ปุ่ม export เฉพาะตาราง */}
                <PdfExportButton rows={rows} />
            </Box>

            <Paper
                elevation={2}
                sx={{
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'grey.200',
                    overflow: 'hidden',
                }}
            >
                <TableContainer sx={{ maxHeight: 560 }}>
                    <Table stickyHeader size="small" aria-label="amortization table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">Month</TableCell>
                                <TableCell align="right">Income</TableCell>
                                <TableCell align="right">Expenses</TableCell>
                                <TableCell align="right">Debt Payment</TableCell>
                                <TableCell align="right">Principal</TableCell>
                                <TableCell align="right">Interest</TableCell>
                                <TableCell align="right">Remaining</TableCell>
                                <TableCell align="right">Cumulative Paid</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paged.map((r) => (
                                <TableRow key={r.month} hover>
                                    <TableCell align="right">{r.month}</TableCell>
                                    <TableCell align="right">$ {formatMoney(r.income)}</TableCell>
                                    <TableCell align="right">$ {formatMoney(r.expenses)}</TableCell>
                                    <TableCell align="right">$ {formatMoney(r.monthlyDebtPayment)}</TableCell>
                                    <TableCell align="right">$ {formatMoney(r.principalPaid)}</TableCell>
                                    <TableCell align="right">$ {formatMoney(r.interestPaid)}</TableCell>
                                    <TableCell align="right">$ {formatMoney(r.remainingDebt)}</TableCell>
                                    <TableCell align="right">$ {formatMoney(r.cumulativePaid)}</TableCell>
                                </TableRow>
                            ))}
                            {paged.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'grey.600' }}>
                                        No data
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={rows.length}
                    page={page}
                    onPageChange={(_, p) => setPage(p)}
                    rowsPerPage={ROWS_PER_PAGE}
                    rowsPerPageOptions={[ROWS_PER_PAGE]}
                    sx={{
                        borderTop: '1px solid',
                        borderColor: 'grey.200',
                        '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': { m: 1 },
                    }}
                />
            </Paper>
        </Box>
    )
}