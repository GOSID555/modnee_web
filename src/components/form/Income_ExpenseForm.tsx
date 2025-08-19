'use client';

import useFinancialStore from '@/store/useFinancialStore';
import { Box, Typography, Stack } from '@mui/material';
import NumberInputField from './NumberInputField';

export default function IncomeExpenseForm() {
    const {
        financialData,
        setFinancialData,
    } = useFinancialStore();

    const handleChange = (field: keyof typeof financialData) =>
        (value: number) => {
            setFinancialData({ [field]: value });
        };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Income & Expenses
            </Typography>

            <Stack spacing={2}>
                <NumberInputField
                    label="Monthly Income"
                    value={financialData.monthlyIncome}
                    onChange={handleChange('monthlyIncome')}
                    startAdornment="$"
                    step={100}
                    min={0}
                />
                <NumberInputField
                    label="Housing Expenses"
                    value={financialData.housing}
                    onChange={handleChange('housing')}
                    startAdornment="$"
                    step={50}
                    min={0}
                />
                <NumberInputField
                    label="Utilities"
                    value={financialData.utilities}
                    onChange={handleChange('utilities')}
                    startAdornment="$"
                    step={25}
                    min={0}
                />
                <NumberInputField
                    label="Food & Groceries"
                    value={financialData.food}
                    onChange={handleChange('food')}
                    startAdornment="$"
                    step={25}
                    min={0}
                />
                <NumberInputField
                    label="Transportation"
                    value={financialData.transportation}
                    onChange={handleChange('transportation')}
                    startAdornment="$"
                    step={25}
                    min={0}
                />
                <NumberInputField
                    label="Other Expenses"
                    value={financialData.otherExpenses}
                    onChange={handleChange('otherExpenses')}
                    startAdornment="$"
                    step={25}
                    min={0}
                    allowNegative={true}
                />
            </Stack>
        </Box>
    );
}