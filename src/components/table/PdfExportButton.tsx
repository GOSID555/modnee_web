'use client'

import { Button } from '@mui/material'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { AmortizationRow } from '@/utils/amortization'

type Props = {
    rows: AmortizationRow[]
    fileName?: string
}

const n = (v: number) =>
    Number(v ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function PdfExportButton({ rows, fileName = 'payment-schedule.pdf' }: Props) {
    const exportPdf = () => {
        const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'landscape' })

        // ใช้ฟอนต์ default (helvetica) และใช้ข้อความ ASCII เท่านั้น
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(18)
        doc.text('Payment Schedule', 40, 40)

        autoTable(doc, {
            head: [[
                'Month', 'Income', 'Expenses', 'Debt Payment',
                'Principal', 'Interest', 'Remaining', 'Cumulative'
            ]],
            body: rows.map(r => [
                String(r.month),
                n(r.income),
                n(r.expenses),
                n(r.monthlyDebtPayment),
                n(r.principalPaid),
                n(r.interestPaid),
                n(r.remainingDebt),
                n(r.cumulativePaid),
            ]),
            theme: 'grid',
            styles: {
                font: 'helvetica',
                fontSize: 9,
                halign: 'right', // คอลัมน์ตัวเลขชิดขวาเป็นค่า default
            },
            headStyles: {
                fillColor: [245, 247, 250],
                textColor: 40,
                halign: 'center',
            },
            columnStyles: {
                0: { halign: 'center', cellWidth: 50 }, // Month
                1: { cellWidth: 90 }, // Income
                2: { cellWidth: 90 }, // Expenses
                3: { cellWidth: 110 }, // Debt Payment
                4: { cellWidth: 90 },  // Principal
                5: { cellWidth: 90 },  // Interest
                6: { cellWidth: 110 }, // Remaining
                7: { cellWidth: 110 }, // Cumulative
            },
            margin: { left: 40, right: 40, top: 60, bottom: 40 },
            alternateRowStyles: { fillColor: [248, 249, 251] },
            didDrawPage: (data) => {
                // header/footer ของหน้า
                doc.setFontSize(10)
                doc.setTextColor(120)
                const generatedAt = new Date().toLocaleString('en-GB') // ASCII-only
                doc.text(`Generated: ${generatedAt}`, data.settings.margin.left, 30)
                const page = `Page ${doc.getCurrentPageInfo().pageNumber}`
                doc.text(page,
                    doc.internal.pageSize.getWidth() - data.settings.margin.right,
                    30,
                    { align: 'right' }
                )
            },
        })

        doc.save(fileName)
    }

    return (
        <Button
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
            onClick={exportPdf}
            sx={{ textTransform: 'none' }}
        >
            Export PDF
        </Button>
    )
}