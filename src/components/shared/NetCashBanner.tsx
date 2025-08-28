// src/components/shared/NetCashBanner.tsx
'use client'
import { Box, Typography } from '@mui/material'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined'
import { alpha } from '@mui/material/styles'
import { formatMoney } from '@/utils/format'

export default function NetCashBanner({ amount }: { amount: number }) {
    const positive = amount >= 0
    return (
        <Box
            sx={(t) => ({
                mt: 1.5,
                px: 2,
                py: 1.25,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: positive ? t.palette.primary.main : t.palette.error.main,
                border: '1px solid',
                borderColor: alpha(positive ? t.palette.primary.main : t.palette.error.main, 0.2),
                background: alpha(positive ? t.palette.primary.main : t.palette.error.main, 0.08),
            })}
        >
            {positive ? <InfoOutlined fontSize="small" /> : <WarningAmberOutlined fontSize="small" />}
            <Typography variant="body2" sx={{ color: 'inherit', fontWeight: 500 }}>
                {positive
                    ? `Available for Debt Payment: $${formatMoney(amount)}/month`
                    : `Shortfall: $${formatMoney(Math.abs(amount))}/month`}
            </Typography>
        </Box>
    )
}