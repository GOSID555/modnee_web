'use client';

import { useMemo } from 'react';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import useFinancialStore from '@/store/useFinancialStore';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function DebtProjectionChart() {
    const calculateDebtProjection = useFinancialStore((s) => s.calculateDebtProjection);

    // ✅ ใช้ useMemo เพื่อคำนวณแค่ครั้งเดียวเมื่อ store เปลี่ยน
    const projection = useMemo(() => calculateDebtProjection(), [calculateDebtProjection]);

    const data = {
        labels: projection.map((p) => `Month ${p.month}`),
        datasets: [
            {
                label: 'Debt Left',
                data: projection.map((p) => p.totalDebtLeft),
                borderColor: '#7e3af2',
                backgroundColor: '#f1e7ff',
                fill: false,
            },
            {
                label: 'Remaining After Debt',
                data: projection.map((p) => p.remainingAfterDebt),
                borderColor: '#22c55e',
                backgroundColor: '#dcfce7',
                fill: false,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: 'Debt Reduction Projection' },
        },
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <Line data={data} options={options} />
        </div>
    );
}