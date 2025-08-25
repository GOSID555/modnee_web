'use client'

import { Button } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import html2canvas from 'html2canvas'
import type { RefObject } from 'react'
import type { PerDebtSummary } from '@/components/summary/IndividualDebtSummary'
import type { AmortizationRow } from '@/utils/amortization'
import { formatMoney } from '@/utils/format'

type Overall = {
    totalDebt: number
    totalMonthlyPayment: number
    netIncome: number
    payoffMonths: number
    debtFreeDate: string
    totalInterest?: number
}

type Props = {
    overall: Overall
    perDebt: PerDebtSummary[]
    amortRows: AmortizationRow[]
    chartRef?: RefObject<HTMLDivElement> // กล่องที่ห่อกราฟ
    fileName?: string
}

export default function FullReportPdfButton({
    overall,
    perDebt,
    amortRows,
    chartRef,
    fileName = 'debt-report.pdf',
}: Props) {
    const exportPdf = async () => {
        const doc = new jsPDF({ unit: 'pt', format: 'a4' })
        const margin = 40
        const pageWidth = doc.internal.pageSize.getWidth()

        // Title
        doc.setFontSize(16)
        doc.text('Debt Payoff Report', margin, 36)

        // --- Overall Summary (ตารางเล็ก) ---
        // @ts-ignore
        doc.autoTable({
            startY: 56,
            head: [['Metric', 'Value']],
            body: [
                ['Total Debt', `$ ${formatMoney(overall.totalDebt)}`],
                ['Total Monthly Payment', `$ ${formatMoney(overall.totalMonthlyPayment)}`],
                ['Net Income (per month)', `$ ${formatMoney(overall.netIncome)}`],
                ['Debt-free in (months)', `${Math.max(0, Math.round(overall.payoffMonths))}`],
                ['Debt-free Date', overall.debtFreeDate],
                ...(overall.totalInterest
                    ? [['Estimated Total Interest', `$ ${formatMoney(overall.totalInterest)}`]]
                    : []),
            ],
            styles: { fontSize: 10, cellPadding: 6 },
            headStyles: { fillColor: [17, 24, 39] }, // #111827
            columnStyles: { 0: { cellWidth: 180 } },
            theme: 'striped',
            margin: { left: margin, right: margin },
        })
        // @ts-ignore
        let y = (doc as any).lastAutoTable.finalY + 16

        // --- Chart (ถ้ามี chartRef) ---
        if (chartRef?.current) {
            const canvas = await html2canvas(chartRef.current, {
                backgroundColor: '#ffffff',
                scale: 2,
            })
            const imgData = canvas.toDataURL('image/png')
            const imgW = pageWidth - margin * 2
            const ratio = canvas.height / canvas.width
            const imgH = imgW * ratio

            if (y + imgH > doc.internal.pageSize.getHeight() - margin) {
                doc.addPage()
                y = margin
            }

            doc.setFontSize(12)
            doc.text('Debt Progress Chart', margin, y)
            y += 8
            doc.addImage(imgData, 'PNG', margin, y, imgW, imgH)
            y += imgH + 16
        }

        // --- Individual Debts ---
        // @ts-ignore
        doc.autoTable({
            startY: y,
            head: [['Name', 'Amount', 'Rate (%)', 'Term (mo)', 'Monthly', 'Debt-free', 'Interest']],
            body: perDebt.map(d => [
                d.name,
                `$ ${formatMoney(d.amount)}`,
                d.interestRate.toFixed(2),
                d.term,
                `$ ${formatMoney(d.monthlyPayment)}`,
                d.debtFreeDate,
                d.totalInterest ? `$ ${formatMoney(d.totalInterest)}` : '-',
            ]),
            styles: { fontSize: 10, cellPadding: 6 },
            headStyles: { fillColor: [55, 65, 81] }, // #374151
            columnStyles: { 0: { cellWidth: 120 } },
            theme: 'striped',
            margin: { left: margin, right: margin },
        })
        // @ts-ignore
        y = (doc as any).lastAutoTable.finalY + 16

        // --- Amortization Table (ยาว: ให้ autotable แบ่งหน้าให้เอง) ---
        doc.setFontSize(12)
        if (y > doc.internal.pageSize.getHeight() - 100) {
            doc.addPage()
            y = margin
        }
        doc.text('Amortization Schedule', margin, y)
        y += 8

        // @ts-ignore
        doc.autoTable({
            startY: y,
            head: [['Month', 'Income', 'Expenses', 'Debt Payment', 'Principal', 'Interest', 'Remaining', 'Cumulative']],
            body: amortRows.map(r => [
                r.month,
                `$ ${formatMoney(r.income)}`,
                `$ ${formatMoney(r.expenses)}`,
                `$ ${formatMoney(r.monthlyDebtPayment)}`,
                `$ ${formatMoney(r.principalPaid)}`,
                `$ ${formatMoney(r.interestPaid)}`,
                `$ ${formatMoney(r.remainingDebt)}`,
                `$ ${formatMoney(r.cumulativePaid)}`,
            ]),
            styles: { fontSize: 9, cellPadding: 4 },
            headStyles: { fillColor: [75, 85, 99] }, // #4B5563
            theme: 'striped',
            margin: { left: margin, right: margin },
        })

        doc.save(fileName)
    }

    return (
        <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={exportPdf}
            sx={{ textTransform: 'none' }}
        >
            Download PDF
        </Button>
    )
}