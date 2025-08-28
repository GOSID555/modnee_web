// src/components/layout/Hero.tsx
'use client'

import { Box, Container, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded'
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'grey.700' }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</Box>
            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>{label}</Typography>
        </Stack>
    )
}

export default function Hero() {
    return (
        <Box
            sx={(t) => ({
                py: { xs: 6, md: 10 },
                // ไล่เฉดสีบาง ๆ จาก primary → โปร่งใส
                background: `linear-gradient(180deg,
          ${alpha(t.palette.primary.main, 0.10)} 0%,
          ${alpha(t.palette.primary.main, 0.05)} 55%,
          transparent 100%)`,
                borderBottom: `1px solid ${alpha(t.palette.primary.main, 0.12)}`,
            })}
        >
            <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 800,
                        color: 'grey.900',
                        letterSpacing: '-0.02em',
                        mb: 1.5,
                    }}
                >
                    Take Control of Your Debt
                </Typography>

                <Typography sx={{ color: 'grey.700', maxWidth: 760, mx: 'auto' }}>
                    Create a personalized debt payoff plan with our advanced calculator.
                    Visualize your progress, optimize your strategy, and accelerate your journey to financial freedom.
                </Typography>

                <Stack
                    direction="row"
                    spacing={3}
                    justifyContent="center"
                    alignItems="center"
                    sx={{ mt: 2 }}
                    useFlexGap
                    flexWrap="wrap"
                >
                    <Feature
                        icon={<CheckCircleRoundedIcon sx={{ fontSize: 16, color: 'success.main' }} />}
                        label="Multiple debt tracking"
                    />
                    <Feature
                        icon={<ShowChartRoundedIcon sx={{ fontSize: 16, color: 'primary.main' }} />}
                        label="Visual progress charts"
                    />
                    <Feature
                        icon={<DownloadRoundedIcon sx={{ fontSize: 16, color: 'secondary.main' }} />}
                        label="Exportable reports"
                    />
                </Stack>
            </Container>
        </Box>
    )
}