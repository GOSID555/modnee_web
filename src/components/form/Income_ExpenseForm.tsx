'use client';

import useFinancialStore from '@/store/useFinancialStore';
import { Box, TextField, Typography, Stack } from '@mui/material';

export default function Income_ExpenseForm() {
    const {
        financialData,
        setFinancialData,

    } = useFinancialStore();

    const handleChange = (field: keyof typeof financialData) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            
            // Handle empty input
            if (value === '' || value === undefined || value === null) {
                setFinancialData({ [field]: 0 });
                return;
            }

            // Convert to number
            const numericValue = parseFloat(value);
            
            // Check if it's a valid number
            if (!isNaN(numericValue) && isFinite(numericValue)) {
                setFinancialData({ [field]: numericValue });
            } else {
                // For invalid input, set to 0
                setFinancialData({ [field]: 0 });
            }
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