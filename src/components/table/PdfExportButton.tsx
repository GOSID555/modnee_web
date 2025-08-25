// src/components/table/PdfExportButton.tsx
'use client'

import { Button } from '@mui/material'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import type { AmortizationRow } from '@/utils/amortization'
import { formatMoney } from '@/utils/format'

type Props = {
    rows: AmortizationRow[]
    fileName?: string
}

export default function PdfExportButton({ rows, fileName = 'amortization.pdf' }: Props) {
    const handleExport = () => {
        const doc = new jsPDF({ unit: 'pt' })
        doc.setFontSize(14)
        doc.text('Amortization Schedule', 40, 40)

        const head = [[
            'Month', 'Income', 'Expenses', 'Debt Payment',
            'Principal', 'Interest', 'Remaining', 'Cumulative Paid'
        ]]

        const body = rows.map(r => ([
            r.month,
            `$ ${formatMoney(r.income)}`,
            `$ ${formatMoney(r.expenses)}`,
            `$ ${formatMoney(r.monthlyDebtPayment)}`,
            `$ ${formatMoney(r.principalPaid)}`,
            `$ ${formatMoney(r.interestPaid)}`,
            `$ ${formatMoney(r.remainingDebt)}`,
            `$ ${formatMoney(r.cumulativePaid)}`
        ]))

        // @ts-ignore - typings ของ autotable ไม่ครบ
        doc.autoTable({
            head, body, startY: 60,
            styles: { fontSize: 10, cellPadding: 6 },
            headStyles: { fillColor: [17, 24, 39] },
            columnStyles: {
                0: { halign: 'right' }, 1: { halign: 'right' }, 2: { halign: 'right' },
                3: { halign: 'right' }, 4: { halign: 'right' }, 5: { halign: 'right' },
                6: { halign: 'right' }, 7: { halign: 'right' }
            },
        })

        doc.save(fileName)
    }

    return (
        <Button variant="outlined" startIcon={<PictureAsPdfIcon />} onClick={handleExport}
            sx={{
                borderColor: 'grey.400', color: 'grey.800', textTransform: 'none',
                '&:hover': { borderColor: 'grey.600', bgcolor: 'grey.100' }
            }}>
            Export PDF
        </Button>
    )
}