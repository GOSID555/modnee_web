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
/*                   Category Recommended Defaults (ปรับได้)                   */
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
/*                               Header Badge                                 */
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
    const palette = ['#EF4444', '#2563EB', '#16A34A'] // แดง / น้ำเงิน / เขียว สลับกัน
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
        <Box sx={{ px: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ flex: 1, fontWeight: 700, color: 'grey.900' }}>
                    Your Debts
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
                    Add New Debt
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
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            borderColor: '#E5E7EB',
                            bgcolor: '#fff',
                            color: 'grey.600',
                        }}
                    >
                        ยังไม่มีรายการหนี้ กด “Add New Debt” เพื่อเพิ่มรายการแรก
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
        // เคลียร์ field ที่ไม่เกี่ยวกับ method ใหม่
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
    const rateLabel = debt.method === 'flat' ? 'Flat Rate (%)' : 'APR (%)'
    const isMortgage = debt.category === 'mortgage'

    // state เก็บ "เดือน" → แสดง "ปี" เมื่อเป็น Mortgage
    const termMonthsNum =
        debt.term && debt.term !== '' ? Number(String(debt.term).replace(/,/g, '')) : 0
    const termYearsDisplay = isMortgage && termMonthsNum > 0 ? String(Math.round(termMonthsNum / 12)) : ''

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
                <Typography sx={{ fontWeight: 600, color: 'grey.800' }}>Debt #{index}</Typography>
                <Box sx={{ flex: 1 }} />
                <IconButton color="error" onClick={() => onRemove(debt.id)}>
                    <DeleteIcon />
                </IconButton>
            </Box>

            <Stack direction="row" spacing={2} flexWrap="wrap">
                <TextField
                    label="Debt Name"
                    value={debt.name}
                    onChange={(e) => onChange(debt.id, { name: e.target.value })}
                    sx={{ minWidth: 220, flex: '1 1 240px' }}
                />

                {/* Category */}
                <TextField
                    select
                    label="Loan Category"
                    value={debt.category}
                    onChange={(e) => onCategoryChange(e.target.value as LoanCategory)}
                    sx={{ minWidth: 220, flex: '1 1 200px' }}
                >
                    <MenuItem value="mortgage">Mortgage (บ้าน)</MenuItem>
                    <MenuItem value="auto">Auto (รถ)</MenuItem>
                    <MenuItem value="personal">Personal</MenuItem>
                    <MenuItem value="credit_card">Credit Card</MenuItem>
                    <MenuItem value="hire_purchase">Hire Purchase</MenuItem>
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="business_od">Business OD</MenuItem>
                    <MenuItem value="bnpl">BNPL / 0%</MenuItem>
                </TextField>

                {/* Method */}
                <TextField
                    select
                    label="Interest Method"
                    value={debt.method}
                    onChange={(e) => onMethodChange(e.target.value as InterestMethod)}
                    sx={{ minWidth: 220, flex: '1 1 200px' }}
                >
                    <MenuItem value="reducing">Reducing (ผ่อนลดต้นลดดอก)</MenuItem>
                    <MenuItem value="flat">Flat Rate (ดอกคงที่)</MenuItem>
                    <MenuItem value="revolving">Revolving (บัตรเครดิต/วงเงิน)</MenuItem>
                </TextField>

                <NumericTextField
                    label="Total Debt Amount"
                    value={debt.amount}
                    onChange={(v) => onChange(debt.id, { amount: v })}
                    decimals={2}
                    sx={{ minWidth: 180, flex: '1 1 160px' }}
                />

                <NumericTextField
                    label={rateLabel}
                    value={debt.interestRate}
                    onChange={(v) => onChange(debt.id, { interestRate: v })}
                    decimals={2}
                    sx={{ minWidth: 200, flex: '1 1 180px' }}
                />

                {/* Term */}
                {showTerm &&
                    (isMortgage ? (
                        // 🏠 Mortgage: กรอกเป็น "ปี" → แปลงเป็น "เดือน" เก็บใน state
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 220, flex: '1 1 240px' }}>
                            <NumericTextField
                                label="Term (years)"
                                value={termYearsDisplay}
                                onChange={(v) => {
                                    const yrs = Number(String(v).replace(/,/g, ''))
                                    const months = Number.isFinite(yrs) && yrs > 0 ? String(yrs * 12) : ''
                                    onChange(debt.id, { term: months })
                                }}
                                decimals={0}
                                sx={{ flex: 1 }}
                            />
                            <Typography sx={{ color: 'grey.600', fontSize: 12 }}>
                                ≈ {termMonthsNum > 0 ? termMonthsNum : (Number(termYearsDisplay) || 0) * 12} mo
                            </Typography>
                        </Box>
                    ) : (
                        <NumericTextField
                            label="Number of Months (term)"
                            value={debt.term ?? ''}
                            onChange={(v) => onChange(debt.id, { term: v })}
                            decimals={0}
                            sx={{ minWidth: 200, flex: '1 1 180px' }}
                        />
                    ))}

                <TextField
                    label="Start Date"
                    type="date"
                    value={debt.startDate ?? ''}
                    onChange={(e) => onChange(debt.id, { startDate: e.target.value })}
                    sx={{ minWidth: 190, flex: '1 1 160px' }}
                    InputLabelProps={{ shrink: true }}
                />

                <TextField
                    select
                    label="Lock Mode"
                    value={debt.lockMode ?? 'term'}
                    onChange={(e) => onLockModeChange(e.target.value as LockMode)}
                    sx={{ minWidth: 220, flex: '1 1 200px' }}
                >
                    <MenuItem value="term">กำหนดจำนวนงวด (ระบบคำนวณค่างวด)</MenuItem>
                    <MenuItem value="payment">กำหนดค่างวด (ระบบคำนวณจำนวนงวด)</MenuItem>
                </TextField>

                {/* Monthly payment override */}
                {showPmtField && (
                    <NumericTextField
                        label="Monthly Payment (override)"
                        value={debt.monthlyPayment ?? ''}
                        onChange={(v) => onChange(debt.id, { monthlyPayment: v })}
                        decimals={2}
                        sx={{ minWidth: 220, flex: '1 1 200px' }}
                    />
                )}

                {/* เฉพาะ flat */}
                {debt.method === 'flat' && (
                    <TextField
                        select
                        label="Flat Interest Allocation"
                        value={debt.allocation ?? 'rule78'}
                        onChange={(e) =>
                            onChange(debt.id, { allocation: e.target.value as 'rule78' | 'equal' })
                        }
                        sx={{ minWidth: 220, flex: '1 1 200px' }}
                    >
                        <MenuItem value="rule78">Rule of 78</MenuItem>
                        <MenuItem value="equal">Equal per month</MenuItem>
                    </TextField>
                )}

                {/* เฉพาะ revolving */}
                {debt.method === 'revolving' && (
                    <>
                        <NumericTextField
                            label="Min payment (%)"
                            value={debt.minPct ?? ''}
                            onChange={(v) => onChange(debt.id, { minPct: v })}
                            decimals={2}
                            sx={{ minWidth: 160, flex: '1 1 140px' }}
                        />
                        <NumericTextField
                            label="Min floor (฿)"
                            value={debt.minFloor ?? ''}
                            onChange={(v) => onChange(debt.id, { minFloor: v })}
                            decimals={2}
                            sx={{ minWidth: 180, flex: '1 1 160px' }}
                        />
                    </>
                )}
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