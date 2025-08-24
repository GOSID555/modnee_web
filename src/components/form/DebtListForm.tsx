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
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import NumericTextField from '@/components/shared/NumericTextField'

/** ชนิดข้อมูลสำหรับ UI (เก็บตัวเลขเป็น string เพื่อโชว์คอมมา) */
export type DebtUI = {
    id: string
    name: string
    amount: string
    interestType: 'fixed' | 'reducing'
    interestRate: string    // % ต่อปี
    term: string            // เดือน
    startDate: string       // YYYY-MM-DD
    monthlyPayment?: string // ใส่ก็ได้ ไม่ใส่ก็ได้
}

type Props = {
    debts: DebtUI[]
    onChangeDebts: (next: DebtUI[]) => void
}

export default function DebtListForm({ debts, onChangeDebts }: Props) {
    const add = () => {
        const blank: DebtUI = {
            id: crypto.randomUUID(),
            name: '',
            amount: '',
            interestType: 'reducing',   // ดีไซน์นิยม default เป็น reducing
            interestRate: '',
            term: '',
            startDate: '',
            monthlyPayment: '',
        }
        onChangeDebts([...debts, blank])
    }

    const remove = (id: string) => {
        onChangeDebts(debts.filter(d => d.id !== id))
    }

    const patch = (id: string, p: Partial<DebtUI>) => {
        onChangeDebts(debts.map(d => (d.id === id ? { ...d, ...p } : d)))
    }

    return (
        <Box sx={{ px: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ flex: 1, fontWeight: 600, color: 'grey.900' }}>
                    Your Debts
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={add}
                    sx={{
                        borderColor: 'grey.400',
                        color: 'grey.800',
                        textTransform: 'none',
                        '&:hover': { borderColor: 'grey.600', backgroundColor: 'grey.100' },
                    }}
                >
                    Add Debt
                </Button>
            </Box>

            <Stack spacing={2}>
                {debts.map((d, idx) => (
                    <DebtRow key={d.id} index={idx + 1} debt={d} onChange={patch} onRemove={remove} />
                ))}
                {debts.length === 0 && (
                    <Paper
                        variant="outlined"
                        sx={{ p: 3, borderRadius: 2, borderColor: 'grey.200', bgcolor: 'white', color: 'grey.600' }}
                    >
                        ยังไม่มีรายการหนี้ กด “Add Debt” เพื่อเพิ่มรายการแรก
                    </Paper>
                )}
            </Stack>
        </Box>
    )
}

/** คอมโพเนนต์ย่อยอยู่ในไฟล์เดียวกัน (ไม่ต้องแยกไฟล์) */
function DebtRow({
    index,
    debt,
    onChange,
    onRemove,
}: {
    index: number
    debt: DebtUI
    onChange: (id: string, patch: Partial<DebtUI>) => void
    onRemove: (id: string) => void
}) {
    return (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: 'white',
                border: '1px solid',
                borderColor: 'grey.200',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ flex: 1, fontWeight: 500, color: 'grey.700' }}>
                    Debt #{index}
                </Typography>
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

                <NumericTextField
                    label="Total Debt Amount"
                    value={debt.amount}
                    onChange={(v) => onChange(debt.id, { amount: v })}
                    decimals={2}
                    sx={{ minWidth: 180, flex: '1 1 160px' }}
                />

                <TextField
                    select
                    label="Interest Type"
                    value={debt.interestType}
                    onChange={(e) => onChange(debt.id, { interestType: e.target.value as DebtUI['interestType'] })}
                    sx={{ minWidth: 180, flex: '1 1 160px' }}
                >
                    <MenuItem value="fixed">Fixed</MenuItem>
                    <MenuItem value="reducing">Reducing</MenuItem>
                </TextField>

                <NumericTextField
                    label="Annual Interest Rate (%)"
                    value={debt.interestRate}
                    onChange={(v) => onChange(debt.id, { interestRate: v })}
                    decimals={2}
                    sx={{ minWidth: 200, flex: '1 1 180px' }}
                />

                <NumericTextField
                    label="Number of Months (term)"
                    value={debt.term}
                    onChange={(v) => onChange(debt.id, { term: v })}
                    decimals={0}
                    sx={{ minWidth: 200, flex: '1 1 180px' }}
                />

                <TextField
                    label="Start Date"
                    type="date"
                    value={debt.startDate}
                    onChange={(e) => onChange(debt.id, { startDate: e.target.value })}
                    sx={{ minWidth: 190, flex: '1 1 160px' }}
                    InputLabelProps={{ shrink: true }}
                />

                <NumericTextField
                    label="Monthly Payment (optional)"
                    value={debt.monthlyPayment ?? ''}
                    onChange={(v) => onChange(debt.id, { monthlyPayment: v })}
                    decimals={2}
                    sx={{ minWidth: 240, flex: '1 1 200px' }}
                />
            </Stack>
        </Paper>
    )
}