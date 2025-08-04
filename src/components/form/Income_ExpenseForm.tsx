'use client';

import useFinancialStore from '@/store/useFinancialStore';
import { Box, TextField, Typography, Stack } from '@mui/material';

export default function IncomeExpenseForm() {
    const {
        financialData,
        setFinancialData,

    } = useFinancialStore();

    const handleChange = (field: keyof typeof financialData) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setFinancialData({ [field]: Number(e.target.value) || 0 });
        };



    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Income & Expenses
            </Typography>

            <Stack spacing={2}>
                <TextField label="Monthly Income" value={financialData.monthlyIncome} onChange={handleChange('monthlyIncome')} fullWidth />
                <TextField label="Housing Expenses" value={financialData.housing} onChange={handleChange('housing')} fullWidth />
                <TextField label="Utilities" value={financialData.utilities} onChange={handleChange('utilities')} fullWidth />
                <TextField label="Food & Groceries" value={financialData.food} onChange={handleChange('food')} fullWidth />
                <TextField label="Transportation" value={financialData.transportation} onChange={handleChange('transportation')} fullWidth />
                <TextField label="Other Expenses" value={financialData.otherExpenses} onChange={handleChange('otherExpenses')} fullWidth />
            </Stack>


        </Box>
    );
}