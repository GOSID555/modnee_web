// src/types/debt.ts

/** ประเภทสินเชื่อ (เพื่อ UX/ค่า default ตามเคสจริง) */
export type LoanCategory =
    | 'mortgage'      // บ้าน
    | 'auto'          // รถ
    | 'personal'      // สินเชื่อส่วนบุคคล
    | 'credit_card'   // บัตรเครดิต/วงเงินหมุนเวียน
    | 'hire_purchase' // เช่าซื้อ (เครื่องใช้ไฟฟ้า/รถบางสัญญา)
    | 'student'       // การศึกษา
    | 'business_od'   // วงเงินเบิกเกิน/ธุรกิจ
    | 'bnpl'          // ผ่อน 0%/BNPL

/** วิธีคิดดอกเบี้ย (ตัวกำหนดสูตรคำนวณจริง) */
export type InterestMethod =
    | 'reducing'       // ผ่อนแบบลดต้นลดดอก (annuity)
    | 'flat'           // อัตราคงที่/เช่าซื้อ (flat rate)
    | 'revolving'      // หมุนเวียน/ADB รายวัน (บัตรเครดิต/OD แบบรอบบิล)
    | 'interest_only'  // จ่ายดอกล้วนช่วงหนึ่ง (ถ้าต้องใช้ในอนาคต)
    | 'balloon'        // บอลลูน (ก้อนท้าย) (ถ้าต้องใช้ในอนาคต)

/** วิธีแจกแจงดอกสำหรับ flat rate */
export type FlatAllocation = 'equal' | 'rule78'

/** โหมดล็อกอินพุต: ล็อกจำนวนงวด หรือ ล็อกค่างวด */
export type LockMode = 'term' | 'payment'

/** แถวตารางผ่อนมาตรฐาน (ใช้กับตารางรวม/ต่อหนี้) */
export type ScheduleRow = {
    month: number
    payment: number
    principal: number
    interest: number
    balance: number
}

/** ข้อเตือน/ความไม่สอดคล้องของอินพุตต่อหนี้ (ไว้โชว์ UI) */
export type ValidationIssueKind =
    | 'NEGATIVE_AMORT'     // ค่างวดต่ำกว่าดอกขั้นต่ำ (ยอดพอกพูน)
    | 'UNDERPAY_FOR_TERM'  // จ่ายน้อยไปสำหรับจำนวนงวดที่ล็อก
    | 'IMPLIED_TERM'       // ค่างวดนี้จะทำให้จำนวนงวดจริงยาวกว่าที่ตั้ง
    | 'EARLY_PAYOFF'       // ค่างวดนี้จะทำให้ปิดเร็วกว่าที่ตั้ง
    | 'INPUT_MISSING'      // ขาดอินพุตจำเป็นตามโหมด
    | 'BELOW_MIN_PAYMENT'  // ต่ำกว่าขั้นต่ำที่ระบบ/สัญญากำหนด (เช่น revolving)

export type ValidationIssue = {
    kind: ValidationIssueKind
    message?: string
    /** สำหรับ NEGATIVE_AMORT: ดอกขั้นต่ำต่อเดือนโดยประมาณ */
    interestOnly?: number
    /** สำหรับ UNDERPAY_FOR_TERM: ค่างวดที่ต้องการจริง */
    pmtRequired?: number
    /** สำหรับ UNDERPAY_FOR_TERM: จำนวนงวดที่ล็อกไว้ */
    term?: number
    /** สำหรับ IMPLIED_TERM / EARLY_PAYOFF: จำนวนงวดจริงโดยประมาณ */
    impliedMonths?: number
    /** สำหรับ BELOW_MIN_PAYMENT: ขั้นต่ำที่ต้องจ่าย */
    minRequired?: number
}

/** โครงแบบฟอร์ม (UI) — เก็บเป็น string เพื่อรองรับ comma/validation ได้ง่าย */
export type DebtUI = {
    id: string
    name: string

    /** เลือกประเภทสินเชื่อ เพื่อกำหนด default อัตโนมัติ */
    category: LoanCategory
    /** เลือก/ปรับวิธีคิดดอกที่ใช้คำนวณจริง */
    method: InterestMethod

    /** เงินต้น/ยอดเริ่ม (string เพื่อโชว์ลูกน้ำ/ตรวจตัวเลข) */
    amount: string
    /** อัตรา: reducing/revolving = APR%, flat = flat rate% */
    interestRate: string

    /** จำนวนงวด (เดือน) — ใช้กับ reducing/flat; revolving มักไม่ใช้ */
    term?: string

    /** ค่างวดต่อเดือนที่ผู้ใช้กำหนดเอง (ถ้า lockMode = 'payment') */
    monthlyPayment?: string

    /** โหมดล็อกอินพุต (default 'term') */
    lockMode?: LockMode

    /** วันเริ่มต้น (yyyy-mm-dd) เพื่อคำนวณ debt-free date */
    startDate?: string

    /** เฉพาะ flat: วิธีแจกแจงดอก */
    allocation?: FlatAllocation

    /** เฉพาะ revolving: ขั้นต่ำเป็น % ของยอด/เดือน (เช่น "3") */
    minPct?: string
    /** เฉพาะ revolving: ขั้นต่ำเป็นจำนวนเงิน (เช่น "200") */
    minFloor?: string
}

/** โครงแบบตัวเลข (Model) — ใช้คำนวณจริง */
export type DebtModel = {
    id: string
    name: string
    category: LoanCategory
    method: InterestMethod

    amount: number          // principal/balance
    interestRate: number    // APR% หรือ flat rate%
    term?: number           // months (reducing/flat)
    monthlyPayment?: number // ถ้า lockMode = 'payment'
    lockMode: LockMode
    startDate?: string

    // method-specific
    allocation?: FlatAllocation
    minPct?: number
    minFloor?: number
}

/** ผลสรุปรายหนี้ (สำหรับแสดงใน IndividualDebtSummary) */
export type PerDebtSummary = {
    id: string
    name: string
    method: InterestMethod

    amount: number
    interestRate: number
    term?: number

    /** ค่างวดที่ใช้จริงหลัง resolve โหมด (อาจมาจากสูตรหรือ override) */
    monthlyPayment: number

    /** วันที่ปลดหนี้ (ถ้าคำนวณได้) */
    debtFreeDate?: string

    /** ดอกเบี้ยรวมโดยประมาณของหนี้ก้อนนี้ */
    totalInterest?: number

    /** จำนวนเดือนจริงโดยประมาณ (เมื่อ lock = 'payment') */
    impliedMonths?: number

    /** คำเตือน/ข้อผิดปกติสำหรับหนี้ก้อนนี้ */
    warnings?: ValidationIssue[]
}

/** ผลรวมภาพรวม (สำหรับ OverallSummary) */
export type OverallSummary = {
    totalDebt: number
    totalMonthlyPayment: number
    netIncome: number
    payoffMonths: number
    debtFreeDate: string
    totalInterest?: number
}

/** ผลลัพธ์ชุดใหญ่จากเครื่องคำนวณ (เผื่อใช้รวม/เทสต์) */
export type CalculatorOutput = {
    overall: OverallSummary
    perDebt: PerDebtSummary[]
    /** ตารางรวมรายเดือน (aggregate จากทุกหนี้) */
    schedule: ScheduleRow[]
}