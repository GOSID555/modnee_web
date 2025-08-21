'use client';

import useFinancialStore from '@/store/useFinancialStore';
import { Box, TextField, Typography, Stack } from '@mui/material';

export default function IncomeExpenseForm() {
    const {
        financialData,
        setFinancialData,

    } = useFinancialStore();

    const parseNumericInput = (value: string): number => {
        // Remove all non-numeric characters except decimal point
        const cleanValue = value.replace(/[^\d.]/g, '');
        
        // If empty or invalid, return 0
        if (!cleanValue || cleanValue === '.') return 0;
        
        // Parse as number and ensure it's positive
        const parsed = parseFloat(cleanValue);
        return isNaN(parsed) ? 0 : Math.abs(parsed);
    };

    const handleChange = (field: keyof typeof financialData) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const numericValue = parseNumericInput(e.target.value);
            setFinancialData({ [field]: numericValue });
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