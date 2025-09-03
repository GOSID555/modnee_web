// src/components/form/DebtListForm.tsx
'use client'

import {
    Box,
    Paper,
    Typography,
    Stack,
    TextField,
    IconButton,
    Button,
    MenuItem,
    Chip,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

import HomeRounded from '@mui/icons-material/HomeRounded'
import DirectionsCarFilledRounded from '@mui/icons-material/DirectionsCarFilledRounded'
import CreditCardRounded from '@mui/icons-material/CreditCardRounded'
import SchoolRounded from '@mui/icons-material/SchoolRounded'
import AccountBalanceWalletRounded from '@mui/icons-material/AccountBalanceWalletRounded'
import ShoppingCartRounded from '@mui/icons-material/ShoppingCartRounded'
import WorkHistoryRounded from '@mui/icons-material/WorkHistoryRounded'

import NumericTextField from '@/components/shared/NumericTextField'

import type {
    DebtUI,
    LoanCategory,
    InterestMethod,
    LockMode,
    ValidationIssue,
} from '@/types/debt'

/* -------------------------------------------------------------------------- */
/*                   ค่าแนะนำตามประเภทสินเชื่อ (แก้ไขได้ภายหลัง)              */
/* -------------------------------------------------------------------------- */
const CATEGORY_DEFAULTS: Record<
    LoanCategory,
    {
        method: InterestMethod
        interestRate: string
        lockMode: LockMode
        allocation?: 'rule78' | 'equal'
        minPct?: string
        minFloor?: string
    }
> = {
    mortgage: { method: 'reducing', interestRate: '6.5', lockMode: 'term' },
    auto: { method: 'flat', interestRate: '2.5', lockMode: 'term', allocation: 'rule78' },
    hire_purchase: { method: 'flat', interestRate: '2.5', lockMode: 'term', allocation: 'rule78' },
    personal: { method: 'reducing', interestRate: '15', lockMode: 'term' },
    credit_card: { method: 'revolving', interestRate: '18', lockMode: 'payment', minPct: '3', minFloor: '200' },
    business_od: { method: 'revolving', interestRate: '12', lockMode: 'payment', minPct: '3', minFloor: '500' },
    student: { method: 'reducing', interestRate: '4', lockMode: 'term' },
    bnpl: { method: 'flat', interestRate: '0', lockMode: 'term', allocation: 'equal' },
}

/** แนะนำค่าตาม category ใหม่ แต่ไม่ทับค่าที่ผู้ใช้แก้เองแล้ว */
function applyCategoryRecommended(current: DebtUI, nextCat: LoanCategory): Partial<DebtUI> {
    const next = CATEGORY_DEFAULTS[nextCat]
    const prev = CATEGORY_DEFAULTS[(current.category as LoanCategory) ?? 'personal']

    const take = <T,>(cur: T | undefined, prevVal?: T, nextVal?: T) =>
        cur === undefined || (cur as any) === '' || cur === prevVal ? nextVal : cur

    return {
        category: nextCat,
        method: take(current.method, prev.method, next.method) as InterestMethod,
        interestRate: take(current.interestRate, prev.interestRate, next.interestRate) as string,
        lockMode: take(current.lockMode, prev.lockMode, next.lockMode) as LockMode,
        allocation: take(current.allocation, prev.allocation, next.allocation),
        minPct: take(current.minPct, prev.minPct, next.minPct),
        minFloor: take(current.minFloor, prev.minFloor, next.minFloor),
    }
}

/* -------------------------------------------------------------------------- */
/*                                Header Badge                                */
/* -------------------------------------------------------------------------- */

const categoryIcon: Record<string, React.ReactNode> = {
    mortgage: <HomeRounded />,
    auto: <DirectionsCarFilledRounded />,
    credit_card: <CreditCardRounded />,
    student: <SchoolRounded />,
    personal: <AccountBalanceWalletRounded />,
    bnpl: <ShoppingCartRounded />,
    business_od: <WorkHistoryRounded />,
    hire_purchase: <ShoppingCartRounded />,
}

function HeaderBadge({ category, index }: { category?: string; index: number }) {
    const palette = ['#EF4444', '#2563EB', '#16A34A']
    const bg = palette[index % palette.length]
    return (
        <Box
            sx={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                mr: 1,
                color: '#fff',
                background: bg,
                boxShadow: `0 0 0 4px ${alpha('#2563EB', 0.06)}`,
                '& svg': { fontSize: 16 },
            }}
        >
            {categoryIcon[category ?? 'personal'] ?? <AccountBalanceWalletRounded />}
        </Box>
    )
}

/* -------------------------------------------------------------------------- */

type Props = {
    debts: DebtUI[]
    onChangeDebts: (next: DebtUI[]) => void
    issuesByDebt?: Record<string, ValidationIssue[]>
}

export default function DebtListForm({ debts, onChangeDebts, issuesByDebt }: Props) {
    const add = () => {
        const baseCat: LoanCategory = 'personal'
        const base = CATEGORY_DEFAULTS[baseCat]

        const blank: DebtUI = {
            id: crypto.randomUUID(),
            name: '',
            category: baseCat,
            method: base.method,
            amount: '',
            interestRate: base.interestRate,
            term: '',
            monthlyPayment: '',
            lockMode: base.lockMode,
            startDate: '',
            allocation: base.allocation ?? 'rule78',
            minPct: base.minPct ?? '3',
            minFloor: base.minFloor ?? '200',
        }
        onChangeDebts([...debts, blank])
    }

    const remove = (id: string) => onChangeDebts(debts.filter((d) => d.id !== id))
    const patch = (id: string, p: Partial<DebtUI>) =>
        onChangeDebts(debts.map((d) => (d.id === id ? { ...d, ...p } : d)))

    return (
        <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ flex: 1, fontWeight: 700, color: 'grey.900' }}>
                    รายการหนี้ของคุณ
                </Typography>
                <Button
                    variant="outlined"
                    color="success"
                    startIcon={<AddIcon />}
                    onClick={add}
                    sx={{
                        borderColor: 'success.light',
                        textTransform: 'none',
                        '&:hover': { borderColor: 'success.main', backgroundColor: alpha('#16A34A', 0.06) },
                    }}
                >
                    เพิ่มรายการหนี้
                </Button>
            </Box>

            <Stack spacing={2.25}>
                {debts.map((d, idx) => (
                    <DebtRow
                        key={d.id}
                        index={idx + 1}
                        debt={d}
                        onChange={patch}
                        onRemove={remove}
                        issues={issuesByDebt?.[d.id]}
                    />
                ))}

                {debts.length === 0 && (
                    <Paper
                        variant="outlined"
                        sx={{ p: 3, borderRadius: 3, borderColor: '#E5E7EB', bgcolor: '#fff', color: 'grey.600' }}
                    >
                        ยังไม่มีรายการหนี้ กด “เพิ่มรายการหนี้” เพื่อเพิ่มรายการแรก
                    </Paper>
                )}
            </Stack>
        </Box>
    )
}

/* -------------------------------- Debt Row -------------------------------- */

function DebtRow({
    index,
    debt,
    onChange,
    onRemove,
    issues,
}: {
    index: number
    debt: DebtUI
    onChange: (id: string, patch: Partial<DebtUI>) => void
    onRemove: (id: string) => void
    issues?: ValidationIssue[]
}) {
    const onCategoryChange = (cat: LoanCategory) => {
        const p = applyCategoryRecommended(debt, cat)
        if (p.method === 'revolving') p.allocation = undefined
        if (p.method === 'flat') {
            p.minPct = undefined
            p.minFloor = undefined
        }
        onChange(debt.id, p)
    }

    const onMethodChange = (m: InterestMethod) => {
        onChange(debt.id, { method: m })
    }

    const onLockModeChange = (v: LockMode) => {
        const p: Partial<DebtUI> = { lockMode: v }
        if (v === 'payment') p.term = ''
        else p.monthlyPayment = ''
        onChange(debt.id, p)
    }

    const isLockPayment = (debt.lockMode ?? 'term') === 'payment'
    const showTerm = !isLockPayment
    const showPmtField = isLockPayment
    const rateLabel =
        debt.method === 'flat' ? 'อัตราดอกแบบคงที่ (%)' : 'อัตราดอกเบี้ยต่อปี (APR) (%)'
    const isMortgage = debt.category === 'mortgage'

    // state เก็บ "เดือน" → แสดง "ปี" เมื่อเป็นสินเชื่อบ้าน
    const termMonthsNum =
        debt.term && debt.term !== '' ? Number(String(debt.term).replace(/,/g, '')) : 0
    const termYearsDisplay =
        isMortgage && termMonthsNum > 0 ? String(Math.round(termMonthsNum / 12)) : ''

    return (
        <Paper
            elevation={0}
            sx={(t) => ({
                p: 2.5,
                borderRadius: 3,
                border: '1px solid',
                borderColor: '#E5E7EB',
                bgcolor: '#fff',
                transition: 'border-color .15s, box-shadow .15s',
                '&:hover': {
                    borderColor: alpha(t.palette.primary.main, 0.5),
                    boxShadow: `0 8px 24px ${alpha('#000', 0.06)}`,
                },
            })}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HeaderBadge category={debt.category} index={index - 1} />
                <Typography sx={{ fontWeight: 600, color: 'grey.800' }}>หนี้ #{index}</Typography>
                <Box sx={{ flex: 1 }} />
                <IconButton color="error" onClick={() => onRemove(debt.id)}>
                    <DeleteIcon />
                </IconButton>
            </Box>

            <Stack direction="row" spacing={2} flexWrap="wrap">
                <Box
                    sx={{
                        display: 'grid',
                        gap: 2,
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(4, 1fr)',
                        },
                    }}
                >
                    <TextField
                        label="ชื่อหนี้"
                        value={debt.name}
                        onChange={(e) => onChange(debt.id, { name: e.target.value })}
                        fullWidth
                    />

                    {/* Category */}
                    <TextField
                        select
                        label="ประเภทสินเชื่อ"
                        value={debt.category}
                        onChange={(e) => onCategoryChange(e.target.value as LoanCategory)}
                        fullWidth
                    >
                        <MenuItem value="mortgage">สินเชื่อบ้าน (Mortgage)</MenuItem>
                        <MenuItem value="auto">รถยนต์ (Auto)</MenuItem>
                        <MenuItem value="personal">ส่วนบุคคล (Personal)</MenuItem>
                        <MenuItem value="credit_card">บัตรเครดิต (Credit Card)</MenuItem>
                        <MenuItem value="hire_purchase">ผ่อนสินค้า (Hire Purchase)</MenuItem>
                        <MenuItem value="student">นักเรียน/กยศ. (Student)</MenuItem>
                        <MenuItem value="business_od">วงเงินธุรกิจ/OD</MenuItem>
                        <MenuItem value="bnpl">ผ่อน 0% / BNPL</MenuItem>
                    </TextField>

                    {/* Method */}
                    <TextField
                        select
                        label="วิธีคิดดอกเบี้ย"
                        value={debt.method}
                        onChange={(e) => onMethodChange(e.target.value as InterestMethod)}
                        fullWidth
                    >
                        <MenuItem value="reducing">ลดต้นลดดอก (Reducing)</MenuItem>
                        <MenuItem value="flat">ดอกคงที่ (Flat Rate)</MenuItem>
                        <MenuItem value="revolving">หมุนเวียน/บัตรเครดิต (Revolving)</MenuItem>
                    </TextField>

                    <NumericTextField
                        label="ยอดหนี้รวม"
                        value={debt.amount}
                        onChange={(v) => onChange(debt.id, { amount: v })}
                        decimals={2}
                        fullWidth
                        sx={{ width: '100%' }}
                    />

                    <NumericTextField
                        label={rateLabel}
                        value={debt.interestRate}
                        onChange={(v) => onChange(debt.id, { interestRate: v })}
                        decimals={2}
                        fullWidth
                        sx={{ width: '100%' }}
                    />

                    {/* ระยะเวลา */}
                    {showTerm &&
                        (isMortgage ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                <NumericTextField
                                    label="ระยะเวลา (ปี)"
                                    value={termYearsDisplay}
                                    onChange={(v) => {
                                        const yrs = Number(String(v).replace(/,/g, ''))
                                        const months = Number.isFinite(yrs) && yrs > 0 ? String(yrs * 12) : ''
                                        onChange(debt.id, { term: months })
                                    }}
                                    decimals={0}
                                    fullWidth
                                    sx={{ width: '100%' }}
                                />
                                <Typography sx={{ color: 'grey.600', fontSize: 12, whiteSpace: 'nowrap' }}>
                                    ≈ {termMonthsNum > 0 ? termMonthsNum : (Number(termYearsDisplay) || 0) * 12} เดือน
                                </Typography>
                            </Box>
                        ) : (
                            <NumericTextField
                                label="จำนวนเดือน (ระยะเวลา)"
                                value={debt.term ?? ''}
                                onChange={(v) => onChange(debt.id, { term: v })}
                                decimals={0}
                                fullWidth
                                sx={{ width: '100%' }}
                            />
                        ))}

                    <TextField
                        label="วันที่เริ่มต้น"
                        type="date"
                        value={debt.startDate ?? ''}
                        onChange={(e) => onChange(debt.id, { startDate: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />

                    <TextField
                        select
                        label="โหมดคำนวณ"
                        value={debt.lockMode ?? 'term'}
                        onChange={(e) => onLockModeChange(e.target.value as LockMode)}
                        fullWidth
                    >
                        <MenuItem value="term">กำหนดจำนวนงวด (ระบบคำนวณค่างวด)</MenuItem>
                        <MenuItem value="payment">กำหนดค่างวด (ระบบคำนวณจำนวนงวด)</MenuItem>
                    </TextField>

                    {/* ค่างวด override */}
                    {showPmtField && (
                        <NumericTextField
                            label="ค่างวดต่อเดือน (กำหนดเอง)"
                            value={debt.monthlyPayment ?? ''}
                            onChange={(v) => onChange(debt.id, { monthlyPayment: v })}
                            decimals={2}
                            fullWidth
                            sx={{ width: '100%' }}
                        />
                    )}

                    {/* ตัวเลือกเฉพาะ flat */}
                    {debt.method === 'flat' && (
                        <TextField
                            select
                            label="วิธีเฉลี่ยดอกเบี้ย (Flat)"
                            value={debt.allocation ?? 'rule78'}
                            onChange={(e) =>
                                onChange(debt.id, { allocation: e.target.value as 'rule78' | 'equal' })
                            }
                            fullWidth
                        >
                            <MenuItem value="rule78">Rule of 78</MenuItem>
                            <MenuItem value="equal">เท่ากันทุกเดือน</MenuItem>
                        </TextField>
                    )}

                    {/* ตัวเลือกเฉพาะ revolving */}
                    {debt.method === 'revolving' && (
                        <>
                            <NumericTextField
                                label="ยอดชำระขั้นต่ำ (%)"
                                value={debt.minPct ?? ''}
                                onChange={(v) => onChange(debt.id, { minPct: v })}
                                decimals={2}
                                fullWidth
                                sx={{ width: '100%' }}
                            />
                            <NumericTextField
                                label="ยอดชำระขั้นต่ำ (฿)"
                                value={debt.minFloor ?? ''}
                                onChange={(v) => onChange(debt.id, { minFloor: v })}
                                decimals={2}
                                fullWidth
                                sx={{ width: '100%' }}
                            />
                        </>
                    )}
                </Box>
            </Stack>

            {!!issues?.length && (
                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                    {issues.map((it, i) => (
                        <Chip
                            key={i}
                            size="small"
                            color={it.kind === 'NEGATIVE_AMORT' ? 'error' : 'warning'}
                            label={renderIssueText(it)}
                            sx={{ mr: 1, mb: 1 }}
                        />
                    ))}
                </Stack>
            )}
        </Paper>
    )
}

/* --------------------------------- Helper --------------------------------- */

function renderIssueText(it: ValidationIssue) {
    switch (it.kind) {
        case 'NEGATIVE_AMORT':
            return `ค่างวดต่ำกว่าดอกขั้นต่ำ ~฿${it.interestOnly?.toLocaleString()}`
        case 'UNDERPAY_FOR_TERM':
            return `เพื่อจบใน ${it.term} เดือน ต้องจ่าย ≥ ฿${it.pmtRequired?.toLocaleString()}`
        case 'IMPLIED_TERM':
            return `ค่างวดนี้จะจบ ~${it.impliedMonths} เดือน`
        case 'EARLY_PAYOFF':
            return `จบเร็วกว่าที่ตั้ง ~${it.impliedMonths} เดือน`
        case 'BELOW_MIN_PAYMENT':
            return `ต่ำกว่าขั้นต่ำ ≥ ฿${it.minRequired?.toLocaleString()}`
        default:
            return 'ตรวจสอบข้อมูล'
    }
}