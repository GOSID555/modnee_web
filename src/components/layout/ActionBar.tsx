// src/components/layout/ActionBar.tsx
'use client'

import { Box, Paper, Stack, Button } from '@mui/material'
import { alpha } from '@mui/material/styles'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import CalculateIcon from '@mui/icons-material/Calculate'

type Props = {
    onReset: () => void
    onCalculate: () => void
    disabled?: boolean
    sticky?: boolean   // ถ้าไม่อยากให้ลอย ให้ส่ง sticky={false}
}

export default function ActionBar({ onReset, onCalculate, disabled, sticky = true }: Props) {
    return (
        <Paper
            elevation={3}
            sx={(t) => ({
                mt: 2,
                px: { xs: 2, sm: 3 },
                py: 1.5,
                borderTop: '1px solid',
                borderColor: 'divider',
                backgroundColor: alpha(t.palette.background.paper, 0.9),
                backdropFilter: 'blur(8px)',
                position: sticky ? 'sticky' as const : 'static',
                bottom: 0,
                zIndex: 10,
                '@media print': { display: 'none' },
            })}
        >
            <Box maxWidth="lg" sx={{ mx: 'auto' }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1.5}
                    justifyContent="flex-end"
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                >
                    <Button
                        onClick={onReset}
                        variant="outlined"
                        startIcon={<RestartAltIcon />}
                        sx={{ minWidth: 140 }}
                    >
                        Reset
                    </Button>
                    <Button
                        onClick={onCalculate}
                        variant="contained"
                        startIcon={<CalculateIcon />}
                        disabled={disabled}
                        sx={{ minWidth: 180 }}
                    >
                        Calculate Payoff Plan
                    </Button>
                </Stack>
            </Box>
        </Paper>
    )
}