'use client';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import useFinancialStore from '@/store/useFinancialStore';

export default function DebtProjectionTable() {
    const { calculateDebtProjection } = useFinancialStore();
    const data = calculateDebtProjection();

    return (
        <TableContainer component={Paper} sx={{ mt: 4, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ p: 2 }}>Debt Payment Projection</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Month</TableCell>
                        <TableCell align="right">Income</TableCell>
                        <TableCell align="right">Expenses</TableCell>
                        <TableCell align="right">Debt Payment</TableCell>
                        <TableCell align="right">Remaining</TableCell>
                        <TableCell align="right">Debt Left</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow key={row.month}>
                            <TableCell>{row.month}</TableCell>
                            <TableCell align="right">${row.income}</TableCell>
                            <TableCell align="right">${row.expenses}</TableCell>
                            <TableCell align="right">${row.totalDebtPayment}</TableCell>
                            <TableCell align="right">${row.remainingAfterDebt}</TableCell>
                            <TableCell align="right">${row.totalDebtLeft}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}