'use client';

import { Box, Paper, Typography } from '@mui/material';
import useFinancialStore from '@/store/useFinancialStore';
import { useMemo } from 'react';

export default function DebtSummaryCards() {
    const totalDebt = useFinancialStore((s) =>
        s.debts.reduce((sum, d) => sum + d.balance, 0)
    );
    const monthlyPayment = useFinancialStore((s) =>
        s.debts.reduce((sum, d) => sum + d.monthlyPayment, 0)
    );
    const monthlyIncome = useFinancialStore((s) => s.financialData.monthlyIncome);
    const calculateDebtProjection = useFinancialStore.getState().calculateDebtProjection;

    const projection = useMemo(() => calculateDebtProjection(), []);

    const totalInterest = useMemo(() => {
        return projection.reduce(
            (sum, p, i) =>
                sum + (i === 0 ? 0 : p.totalDebtLeft - projection[i - 1].totalDebtLeft + p.totalDebtPayment),
            0
        );
    }, [projection]);

    const lastMonth = projection[projection.length - 1]?.month ?? 0;
    const debtFreeDate = useMemo(() => {
        const date = new Date();
        date.setMonth(date.getMonth() + lastMonth);
        return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    }, [lastMonth]);

    const cards = [
        {
            label: 'Total Debt',
            value: `$${totalDebt.toLocaleString()}`,
            sub: 'Combined balance',
            color: '#7e3af2',
        },
        {
            label: 'Debt-Free Date',
            value: debtFreeDate,
            sub: `${lastMonth} months remaining`,
            color: '#22c55e',
        },
        {
            label: 'Total Interest',
            value: `$${totalInterest.toFixed(0)}`,
            sub: `${((totalInterest / (totalDebt || 1)) * 100).toFixed(1)}% of total debt`,
            color: '#facc15',
        },
        {
            label: 'Monthly Payment',
            value: `$${monthlyPayment.toLocaleString()}`,
            sub: `${((monthlyPayment / (monthlyIncome || 1)) * 100).toFixed(1)}% of your income`,
            color: '#3b82f6',
        },
    ];

    return (
        <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
            {cards.map((c) => (
                <Paper
                    key={c.label}
                    elevation={1}
                    sx={{
                        flex: '1 1 240px',
                        p: 2,
                        borderLeft: `5px solid ${c.color}`,
                        minWidth: 200,
                    }}
                >
                    <Typography variant="subtitle2" color="text.secondary">
                        {c.label}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                        {c.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {c.sub}
                    </Typography>
                </Paper>
            ))}
        </Box>
    );
}