// components/ThemeWrapper.tsx
'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { greyTheme } from '../shared/theme';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={greyTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}