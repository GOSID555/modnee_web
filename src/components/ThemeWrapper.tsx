// src/ThemeWrapper.tsx
'use client'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { alpha } from '@mui/material/styles'
import React from 'react'

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#2563EB' },    // ฟ้า (ตามภาพ)
        secondary: { main: '#7C3AED' },  // ม่วง (ใช้กับจุดเน้นบางจุด)
        success: { main: '#16A34A' },
        error: { main: '#EF4444' },
        warning: { main: '#F59E0B' },
        info: { main: '#0EA5E9' },
        background: { default: '#F8FAFC', paper: '#FFFFFF' },
    },
    shape: { borderRadius: 12 },
    typography: {
        fontFamily: ['Inter', 'Roboto', 'system-ui', 'Segoe UI', 'Helvetica', 'Arial'].join(','),
        h5: { fontWeight: 800, letterSpacing: '-.02em' },
        h6: { fontWeight: 700 },
    },
    components: {
        MuiPaper: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: { border: '1px solid #E5E7EB' }, // ขอบจาง ๆ แบบการ์ด
            },
        },
        MuiTextField: {
            defaultProps: { size: 'small', fullWidth: true },
        },
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: { root: { borderRadius: 10, textTransform: 'none', fontWeight: 600 } },
        },
        MuiTableHead: {
            styleOverrides: {
                root: { backgroundColor: alpha('#2563EB', 0.06) },
            },
        },
    },
})

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}