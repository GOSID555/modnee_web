'use client';

import useFinancialStore from '@/store/useFinancialStore';
import { Box, TextField, Typography, Stack } from '@mui/material';
import { useState } from 'react';

export default function Income_ExpenseForm() {
    const {
        financialData,
        setFinancialData,
    } = useFinancialStore();

    // Local state to maintain display values for each field
    const [displayValues, setDisplayValues] = useState({
        monthlyIncome: financialData.monthlyIncome.toString(),
        housing: financialData.housing.toString(),
        utilities: financialData.utilities.toString(),
        food: financialData.food.toString(),
        transportation: financialData.transportation.toString(),
        otherExpenses: financialData.otherExpenses.toString(),
    });

    const handleChange = (field: keyof typeof financialData) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            
            // Update display value immediately to show user input
            setDisplayValues(prev => ({
                ...prev,
                [field]: value
            }));

            // Only update store with valid numeric values
            if (value === '') {
                // Empty string should be treated as 0
                setFinancialData({ [field]: 0 });
            } else {
                const numericValue = parseFloat(value);
                // Only update store if the value is a valid number
                if (!isNaN(numericValue)) {
                    setFinancialData({ [field]: numericValue });
                }
                // If invalid, don't update store - let user continue typing
            }
        };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Income & Expenses
            </Typography>

            <Stack spacing={2}>
                <TextField 
                    label="Monthly Income" 
                    value={displayValues.monthlyIncome} 
                    onChange={handleChange('monthlyIncome')} 
                    fullWidth 
                    type="text"
                    inputProps={{ inputMode: 'decimal', pattern: '[0-9]*' }}
                />
                <TextField 
                    label="Housing Expenses" 
                    value={displayValues.housing} 
                    onChange={handleChange('housing')} 
                    fullWidth 
                    type="text"
                    inputProps={{ inputMode: 'decimal', pattern: '[0-9]*' }}
                />
                <TextField 
                    label="Utilities" 
                    value={displayValues.utilities} 
                    onChange={handleChange('utilities')} 
                    fullWidth 
                    type="text"
                    inputProps={{ inputMode: 'decimal', pattern: '[0-9]*' }}
                />
                <TextField 
                    label="Food & Groceries" 
                    value={displayValues.food} 
                    onChange={handleChange('food')} 
                    fullWidth 
                    type="text"
                    inputProps={{ inputMode: 'decimal', pattern: '[0-9]*' }}
                />
                <TextField 
                    label="Transportation" 
                    value={displayValues.transportation} 
                    onChange={handleChange('transportation')} 
                    fullWidth 
                    type="text"
                    inputProps={{ inputMode: 'decimal', pattern: '[0-9]*' }}
                />
                <TextField 
                    label="Other Expenses" 
                    value={displayValues.otherExpenses} 
                    onChange={handleChange('otherExpenses')} 
                    fullWidth 
                    type="text"
                    inputProps={{ inputMode: 'decimal', pattern: '[0-9]*' }}
                />
            </Stack>

        </Box>
    );
}