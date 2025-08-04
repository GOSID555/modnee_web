'use client';


import { Box, Container } from '@mui/material';
import CalculateButton from './CalculateButton';
import IncomeExpenseForm from './Income_ExpenseForm';
import DebtDetailsForm from './DebtDetails';

type AllFormProps = {
    calculated: boolean;
    setCalculated: (value: boolean) => void;
};
export default function AllForm({ calculated, setCalculated }: AllFormProps) {


    return (
        <Container sx={{ display: 'flex', flexDirection: 'column' }}>
            <Container sx={{ display: 'flex', flexDirection: 'row' }}>
                <Box sx={{ flex: 1 }}>
                    <IncomeExpenseForm />
                </Box>
                <Box sx={{ width: 30 }} />
                <Box sx={{ flex: 1 }}>
                    <DebtDetailsForm />
                </Box>
            </Container>

            <Box sx={{ height: 30 }} />

            <Box textAlign="center" mt={4}>
                <CalculateButton onClick={() => setCalculated(true)} /> {/* ✅ */}
            </Box>

        </Container>
    );
}