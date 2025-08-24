// src/utils/format.ts
export type NumericFormatResult = {
    formatted: string
    isValid: boolean
    errorMessage?: string
}

/**
 * ฟอร์แมต input ให้ใส่ลูกน้ำ + ตรวจว่าเป็นตัวเลข/จุด ถูกต้องไหม
 * @param raw  ข้อความที่ผู้ใช้พิมพ์
 * @param decimals จำกัดทศนิยมกี่ตำแหน่ง (เช่น 0=จำนวนเต็ม, 2=ทศนิยมสองตำแหน่ง)
 * @param allowNegative อนุญาตติดลบไหม
 */
export function formatNumericInputWithValidate(
    raw: string,
    decimals: number = 2,
    allowNegative = false
): NumericFormatResult {
    if (raw === '') return { formatted: '', isValid: true }

    // อนุญาตเฉพาะ 0-9 , . และสัญลักษณ์ลบต้นสตริง (ถ้า allowNegative)
    const invalidChar = allowNegative
        ? /[^\d.,-]/.test(raw) || (raw.includes('-') && raw.indexOf('-') !== 0)
        : /[^\d.,]/.test(raw)

    // เอาคอมมาออกก่อนประมวลผล
    const stripped = raw.replace(/,/g, '')

    // กรองตัวอักษรที่ไม่ใช่เลข/จุด/ลบ ตาม allowNegative
    const cleaned = stripped.replace(allowNegative ? /[^\d.-]/g : /[^\d.]/g, '')

    const dotCount = (cleaned.match(/\./g) || []).length
    const multiDot = dotCount > 1

    // split ตามจุดแรก
    let [intRaw = '', decRaw = ''] = cleaned.split('.', 2)

    // จำกัดทศนิยม
    if (decimals >= 0) decRaw = decRaw.slice(0, decimals)

    // handle ลบ: เก็บ '-' ไว้หน้าจำนวนเต็ม (ถ้ามีและอนุญาต)
    let sign = ''
    if (allowNegative && intRaw.startsWith('-')) {
        sign = '-'
        intRaw = intRaw.slice(1)
    }

    // ถ้าอินพุตเริ่มด้วย '.' ให้ถือว่าเป็น '0.'
    const safeInt = intRaw === '' ? '0' : intRaw
    const intWithCommas = safeInt.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    const formatted =
        dotCount >= 1
            ? `${sign}${intWithCommas}.${decRaw}`
            : `${sign}${intWithCommas}`

    let errorMessage: string | undefined
    if (invalidChar) errorMessage = 'กรุณาใส่ตัวเลขเท่านั้น (0-9 และ .)'
    else if (multiDot) errorMessage = 'ใส่จุดทศนิยมได้ 1 จุดเท่านั้น'

    return { formatted, isValid: !invalidChar && !multiDot, errorMessage }
}

/** แปลง string ที่มีลูกน้ำ → number (ว่าง = 0) */
export function toNumber(value: string): number {
    if (!value) return 0
    const num = Number(value.replace(/,/g, ''))
    return Number.isFinite(num) ? num : 0
}

// --- เพิ่มฟังก์ชันแสดงผล ---
export function formatMoney(n: number, decimals = 2): string {
    if (!Number.isFinite(n)) n = 0
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(n)
}

export function formatPercent(n: number, decimals = 2): string {
    if (!Number.isFinite(n)) n = 0
    return `${n.toFixed(decimals)}%`
}