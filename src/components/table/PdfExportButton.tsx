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

const money = (v: number) =>
    `฿ ${Number(v ?? 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const num = (v: number) => Number(v ?? 0).toLocaleString('th-TH')

// Lazy load and register Thai fonts (regular + bold) for jsPDF from /fonts
let thaiFontState: { family: string; hasBold: boolean } | null = null
const THAI_FONT_CANDIDATES: Array<{
    url: string
    vfsName: string
    family: string
    style: 'normal' | 'bold'
}> = [
        { url: '/fonts/Sarabun-Regular.ttf', vfsName: 'Sarabun-Regular.ttf', family: 'Sarabun', style: 'normal' },
        { url: '/fonts/Sarabun-Bold.ttf', vfsName: 'Sarabun-Bold.ttf', family: 'Sarabun', style: 'bold' },
        { url: '/fonts/THSarabunNew.ttf', vfsName: 'THSarabunNew.ttf', family: 'THSarabunNew', style: 'normal' },
    ]

async function registerThaiFont(doc: jsPDF): Promise<{ family: string; hasBold: boolean } | null> {
    if (thaiFontState) return thaiFontState

    let chosenFamily: string | null = null
    let hasBold = false

    for (const f of THAI_FONT_CANDIDATES) {
        try {
            const res = await fetch(f.url)
            if (!res.ok) continue
            const buf = await res.arrayBuffer()
            const base64 = arrayBufferToBase64(buf)
                ; (doc as any).addFileToVFS(f.vfsName, base64)
                ; (doc as any).addFont(f.vfsName, f.family, f.style)
            chosenFamily = chosenFamily ?? f.family
            if (f.style === 'bold') hasBold = true
        } catch {
            // ignore, try next
        }
    }

    if (!chosenFamily) return null
    thaiFontState = { family: chosenFamily, hasBold }
    return thaiFontState
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = ''
    const bytes = new Uint8Array(buffer)
    const len = bytes.byteLength
    for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i])
    // btoa expects binary string
    return typeof window !== 'undefined' ? window.btoa(binary) : Buffer.from(binary, 'binary').toString('base64')
}

export default function PdfExportButton({ rows, fileName = 'payment-schedule.pdf' }: Props) {
    const exportPdf = async () => {
        const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'landscape' })

        // ลองใช้วิธีแคปเจอร์ตารางเป็นภาพ (html2canvas) เพื่อแก้ปัญหาวรรณยุกต์ไทยซ้อน
        try {
            const { default: html2canvas } = await import('html2canvas')
            // กำหนดจำนวนแถวต่อหน้า (เช่น 23 แถว/หน้า ตามที่ร้องขอ)
            const ROWS_PER_PAGE = 23
            const pageWidth = doc.internal.pageSize.getWidth()
            const pageHeight = doc.internal.pageSize.getHeight()

            for (let start = 0; start < rows.length; start += ROWS_PER_PAGE) {
                const pageRows = rows.slice(start, start + ROWS_PER_PAGE)

                // สร้างตารางของหน้านี้
                const wrapper = document.createElement('div')
                wrapper.style.padding = '24px'
                wrapper.style.background = '#fff'
                wrapper.style.width = '1250px'
                wrapper.style.color = '#0F172A'

                const title = document.createElement('div')
                title.textContent = 'ตารางกำหนดชำระ'
                title.style.fontSize = '18px'
                title.style.marginBottom = '12px'
                title.style.fontWeight = '600'
                title.style.fontFamily = 'Sarabun, THSarabunNew, sans-serif'
                wrapper.appendChild(title)

                const table = document.createElement('table')
                table.style.width = '100%'
                table.style.borderCollapse = 'collapse'
                table.style.fontFamily = 'Sarabun, THSarabunNew, ui-sans-serif, system-ui'
                table.style.fontSize = '12px'

                const thead = document.createElement('thead')
                const trHead = document.createElement('tr')
                const headCells = [
                    'เดือนที่', 'รายได้ (฿)', 'รายจ่าย (฿)', 'ค่างวดต่อเดือน (฿)',
                    'เงินต้น (฿)', 'ดอกเบี้ย (฿)', 'ยอดคงเหลือ (฿)', 'ยอดชำระสะสม (฿)'
                ]
                headCells.forEach((txt) => {
                    const th = document.createElement('th')
                    th.textContent = txt
                    th.style.background = '#F8FAFC'
                    th.style.color = '#475569'
                    th.style.fontWeight = '700'
                    th.style.border = '1px solid #E2E8F0'
                    th.style.padding = '6px 8px'
                    th.style.textAlign = txt === 'เดือนที่' ? 'center' : 'right'
                    trHead.appendChild(th)
                })
                thead.appendChild(trHead)
                table.appendChild(thead)

                const tbody = document.createElement('tbody')
                pageRows.forEach((r, i) => {
                    const tr = document.createElement('tr')
                    tr.style.background = i % 2 === 0 ? '#FFFFFF' : '#FBFDFF'
                    const cells = [
                        String(r.month),
                        money(r.income),
                        money(r.expenses),
                        money(r.monthlyDebtPayment),
                        money(r.principalPaid),
                        money(r.interestPaid),
                        money(r.remainingDebt),
                        money(r.cumulativePaid),
                    ]
                    cells.forEach((txt, idx) => {
                        const td = document.createElement('td')
                        td.textContent = txt
                        td.style.border = '1px solid #E2E8F0'
                        td.style.padding = '6px 8px'
                        td.style.textAlign = idx === 0 ? 'center' : 'right'
                        td.style.color = '#0F172A'
                        tr.appendChild(td)
                    })
                    tbody.appendChild(tr)
                })
                table.appendChild(tbody)
                wrapper.appendChild(table)
                document.body.appendChild(wrapper)

                const canvas = await html2canvas(wrapper, { scale: 2, backgroundColor: '#ffffff' })
                document.body.removeChild(wrapper)

                const imgData = canvas.toDataURL('image/png')
                if (start > 0) doc.addPage()
                const imgWidth = pageWidth
                const imgHeight = (canvas.height * imgWidth) / canvas.width
                const renderHeight = Math.min(imgHeight, pageHeight)
                doc.addImage(imgData, 'PNG', 0, 0, imgWidth, renderHeight)
            }

            doc.save(fileName)
            return
        } catch (err) {
            // ถ้าไม่มี html2canvas จะ fallback ไปใช้ตารางตัวอักษร (อาจมีวรรณยุกต์ซ้อน)
        }

        // Fallback: ใช้ตารางตัวอักษร (อาจมีปัญหาวรรณยุกต์ในบางฟอนต์)
        const thai = await registerThaiFont(doc)
        const fontFamily = thai?.family ?? 'helvetica'

        doc.setFont(fontFamily, 'normal')
        doc.setFontSize(18)
        doc.text('ตารางกำหนดชำระ', 50, 50)

        const headFontStyle = 'normal' // ใช้ตัวปกติเพื่อลดปัญหาไม้เอกไม้โทตกในบางฟอนต์

        autoTable(doc, {
            head: [[
                'เดือนที่', 'รายได้ (฿)', 'รายจ่าย (฿)', 'ค่างวดต่อเดือน (฿)',
                'เงินต้น (฿)', 'ดอกเบี้ย (฿)', 'ยอดคงเหลือ (฿)', 'ยอดชำระสะสม (฿)'
            ]],
            body: rows.map(r => [
                String(r.month),
                money(r.income),
                money(r.expenses),
                money(r.monthlyDebtPayment),
                money(r.principalPaid),
                money(r.interestPaid),
                money(r.remainingDebt),
                money(r.cumulativePaid),
            ]),
            theme: 'grid',
            styles: {
                font: fontFamily,
                fontSize: 9,
                halign: 'right',
            },
            headStyles: {
                font: fontFamily,
                fontStyle: headFontStyle as any,
                fillColor: [245, 247, 250],
                textColor: 40,
                halign: 'center',
            },
            columnStyles: {
                0: { halign: 'center', cellWidth: 50 }, // เดือน
                1: { cellWidth: 90 }, // รายรับ
                2: { cellWidth: 90 }, // รายจ่าย
                3: { cellWidth: 110 }, // ค่างวดหนี้
                4: { cellWidth: 90 },  // เงินต้น
                5: { cellWidth: 90 },  // ดอกเบี้ย
                6: { cellWidth: 110 }, // ยอดคงเหลือ
                7: { cellWidth: 110 }, // สะสมชำระ
            },
            margin: { left: 40, right: 40, top: 60, bottom: 40 },
            alternateRowStyles: { fillColor: [248, 249, 251] },
            didDrawPage: (data) => {
                // header/footer ของหน้า
                doc.setFont(fontFamily, 'normal')
                doc.setFontSize(10)
                doc.setTextColor(120)
                const generatedAt = new Date().toLocaleString('th-TH')
                doc.text(`สร้างเมื่อ: ${generatedAt}`, data.settings.margin.left, 30)
                const page = `หน้า ${doc.getCurrentPageInfo().pageNumber}`
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
            ส่งออก PDF
        </Button>
    )
}
