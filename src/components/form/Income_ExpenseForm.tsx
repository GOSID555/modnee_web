'use client';

import useFinancialStore from '@/store/useFinancialStore';
import { Box, TextField, Typography, Stack } from '@mui/material';
import { useState } from 'react';

export default function Income_ExpenseForm() {
    const {
        financialData,
        setFinancialData,
    } = useFinancialStore();

    // Local state to manage display values for inputs
    const [inputValues, setInputValues] = useState({
        monthlyIncome: financialData.monthlyIncome.toString(),
        housing: financialData.housing.toString(),
        utilities: financialData.utilities.toString(),
        food: financialData.food.toString(),
        transportation: financialData.transportation.toString(),
        otherExpenses: financialData.otherExpenses.toString(),
    });

    const sanitizeNumericInput = (value: string): string => {
        // Remove all non-numeric characters except decimal point and minus sign
        // Keep only digits, decimal point, and minus (only at the beginning)
        const sanitized = value.replace(/[^0-9.-]/g, '');
        
        // Handle multiple decimal points - keep only the first one
        const decimalIndex = sanitized.indexOf('.');
        if (decimalIndex !== -1) {
            const beforeDecimal = sanitized.substring(0, decimalIndex + 1);
            const afterDecimal = sanitized.substring(decimalIndex + 1).replace(/\./g, '');
            return beforeDecimal + afterDecimal;
        }
        
        // Handle multiple minus signs - keep only if at the beginning
        if (sanitized.includes('-')) {
            const isNegative = sanitized.charAt(0) === '-';
            const numbersOnly = sanitized.replace(/-/g, '');
            return isNegative ? '-' + numbersOnly : numbersOnly;
        }
        
        return sanitized;
    };

    const handleChange = (field: keyof typeof financialData) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const rawValue = e.target.value;
            const sanitizedValue = sanitizeNumericInput(rawValue);
            
            // Update local display state with sanitized value
            setInputValues(prev => ({
                ...prev,
                [field]: sanitizedValue
            }));
            
            // Convert to number for store, handling empty string as 0
            const numericValue = sanitizedValue === '' || sanitizedValue === '-' 
                ? 0 
                : parseFloat(sanitizedValue) || 0;
                
            setFinancialData({ [field]: numericValue });
        };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Income & Expenses
            </Typography>

            <Stack spacing={2}>
                <TextField 
                    label="Monthly Income" 
                    value={inputValues.monthlyIncome} 
                    onChange={handleChange('monthlyIncome')} 
                    fullWidth 
                />
                <TextField 
                    label="Housing Expenses" 
                    value={inputValues.housing} 
                    onChange={handleChange('housing')} 
                    fullWidth 
                />
                <TextField 
                    label="Utilities" 
                    value={inputValues.utilities} 
                    onChange={handleChange('utilities')} 
                    fullWidth 
                />
                <TextField 
                    label="Food & Groceries" 
                    value={inputValues.food} 
                    onChange={handleChange('food')} 
                    fullWidth 
                />
                <TextField 
                    label="Transportation" 
                    value={inputValues.transportation} 
                    onChange={handleChange('transportation')} 
                    fullWidth 
                />
                <TextField 
                    label="Other Expenses" 
                    value={inputValues.otherExpenses} 
                    onChange={handleChange('otherExpenses')} 
                    fullWidth 
                />
            </Stack>
        </Box>
    );
}