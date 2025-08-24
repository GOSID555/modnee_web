'use client'

import { Box, Typography, Button, Stack } from '@mui/material'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import CalculateIcon from '@mui/icons-material/Calculate'

type Props = {
    onReset: () => void
    onCalculate: () => void
}

export default function Header({ onReset, onCalculate }: Props) {
    return (
        <Box
            component="header"
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                py: 2,
                px: 3,
                bgcolor: 'grey.50',          // พื้นหลังอ่อนตามดีไซน์
                borderBottom: '1px solid',
                borderColor: 'grey.200',     // เส้นคั่นบาง ๆ ใต้ header
            }}
        >
            {/* Title ด้านซ้าย ดันปุ่มไปขวาด้วย flex:1 */}
            <Typography
                variant="h5"
                sx={{ flex: 1, fontWeight: 700, color: 'grey.900' }}
            >
                Debt Payoff Calculator
            </Typography>

            {/* ปุ่มด้านขวา: Reset (outlined เทา) + Calculate (contained น้ำเงินเข้ม) */}
            <Stack direction="row" spacing={2}>
                <Button
                    variant="outlined"
                    startIcon={<RestartAltIcon />}
                    onClick={onReset}
                    sx={{
                        borderColor: 'grey.400',
                        color: 'grey.800',
                        textTransform: 'none',
                        '&:hover': {
                            borderColor: 'grey.600',
                            backgroundColor: 'grey.100',
                        },
                    }}
                >
                    Reset
                </Button>

                <Button
                    variant="contained"
                    startIcon={<CalculateIcon />}
                    onClick={onCalculate}
                    sx={{
                        backgroundColor: '#1c2536', // น้ำเงินเข้มตามภาพ
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#111827' },
                    }}
                >
                    Calculate
                </Button>
            </Stack>
        </Box>
    )
}