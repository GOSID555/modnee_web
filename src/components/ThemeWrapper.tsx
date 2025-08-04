// components/ThemeWrapper.tsx
'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme } from '../shared/theme';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}