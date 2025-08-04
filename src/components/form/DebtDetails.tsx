'use client';

import {
    Box, Typography, Paper, TextField, Stack, MenuItem,
    IconButton, Button, Divider,
} from '@mui/material';
import { useCallback } from 'react';
import DeleteIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { v4 as uuidv4 } from 'uuid';

import useFinancialStore from '@/store/useFinancialStore';
import { Debt } from '@/store/useFinancialStore';
import { DebtType, defaultInterestMap } from '@/models/debt';

const defaultDebt = (): Debt => ({
    id: uuidv4(),
    debtType: 'Credit Card',
    debtName: '',
    balance: 0,
    interestType: defaultInterestMap['Credit Card'],
    interestRate: 0,
    monthlyPayment: 0,
});

const iconsMap: Record<string, React.ReactNode> = {
    'Credit Card': <CreditCardIcon sx={{ color: 'purple' }} />,
    'Car Loan': <DirectionsCarIcon sx={{ color: 'purple' }} />,
};

export default function DebtDetailsForm() {
    const { debts, setDebts } = useFinancialStore();

    const addDebt = () => {
        setDebts((prev) => [...prev, defaultDebt()]);
    };

    const removeDebt = (id: string) => {
        setDebts((prev) => prev.filter((debt) => debt.id !== id));
    };

    const handleChange = useCallback(
        (id: string, field: keyof Debt, value: any) => {
            setDebts((prevDebts) =>
                prevDebts.map((debt) =>
                    debt.id === id ? { ...debt, [field]: value } : debt
                )
            );
        },
        [setDebts]
    );

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Debt Details</Typography>
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={addDebt}
                    sx={{
                        backgroundColor: '#f1e7ff',
                        color: '#7e3af2',
                        '&:hover': { backgroundColor: '#e9dfff' },
                    }}
                >
                    Add Debt
                </Button>
            </Box>

            <Stack spacing={3}>
                {debts.map((debt) => (
                    <Paper key={debt.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                {iconsMap[debt.debtType] ?? null}
                                <Typography fontWeight="bold">{debt.debtType}</Typography>
                            </Stack>
                            <IconButton onClick={() => removeDebt(debt.id)} size="small">
                                <DeleteIcon />
                            </IconButton>
                        </Stack>

                        <Divider sx={{ mb: 2 }} />

                        <Stack spacing={2}>
                            <Stack direction="row" spacing={2}>
                                <TextField
                                    select
                                    label="Debt Type"
                                    value={debt.debtType}
                                    onChange={(e) => {
                                        const selectedType = e.target.value as DebtType;
                                        handleChange(debt.id, 'debtType', selectedType);
                                        handleChange(debt.id, 'interestType', defaultInterestMap[selectedType]);
                                    }}
                                    fullWidth
                                >
                                    {Object.keys(defaultInterestMap).map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    label="Debt Name"
                                    value={debt.debtName}
                                    onChange={(e) => handleChange(debt.id, 'debtName', e.target.value)}
                                    fullWidth
                                />
                            </Stack>

                            <Stack direction="row" spacing={2}>
                                <TextField
                                    label="Current Balance"
                                    type="text"
                                    inputMode="numeric"
                                    value={debt.balance === 0 ? '' : debt.balance}
                                    onChange={(e) => {
                                        const cleaned = e.target.value.replace(/[^0-9]/g, '');
                                        handleChange(debt.id, 'balance', Number(cleaned));
                                    }}
                                    fullWidth
                                    InputProps={{ startAdornment: <span>$&nbsp;</span> }}
                                />

                                <TextField
                                    select
                                    label="Interest Type"
                                    value={debt.interestType}
                                    onChange={(e) => handleChange(debt.id, 'interestType', e.target.value)}
                                    fullWidth
                                >
                                    <MenuItem value="Fixed">Fixed</MenuItem>
                                    <MenuItem value="Reducing">Reducing</MenuItem>
                                </TextField>
                            </Stack>

                            <Stack direction="row" spacing={2}>
                                <TextField
                                    label="Interest Rate (%)"
                                    type="text"
                                    inputMode="numeric"
                                    value={debt.interestRate === 0 ? '' : debt.interestRate}
                                    onChange={(e) => {
                                        const cleaned = e.target.value.replace(/[^0-9.]/g, '');
                                        handleChange(debt.id, 'interestRate', Number(cleaned));
                                    }}
                                    fullWidth
                                    InputProps={{ startAdornment: <span>%&nbsp;</span> }}
                                />

                                <TextField
                                    label="Your Monthly Payment"
                                    type="text"
                                    inputMode="numeric"
                                    value={debt.monthlyPayment === 0 ? '' : debt.monthlyPayment}
                                    onChange={(e) => {
                                        const cleaned = e.target.value.replace(/[^0-9]/g, '');
                                        handleChange(debt.id, 'monthlyPayment', Number(cleaned));
                                    }}
                                    fullWidth
                                    InputProps={{ startAdornment: <span>$&nbsp;</span> }}
                                />
                            </Stack>
                        </Stack>
                    </Paper>
                ))}
            </Stack>
        </Box>
    );
}