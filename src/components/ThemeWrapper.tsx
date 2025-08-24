// src/shared/theme.ts
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        background: {
            default: '#f8f9fa',
        },
        primary: {
            main: '#1c2536', // navy
        },
        grey: {
            50: '#f8f9fa',
            200: '#e9ecef',
            400: '#ced4da',
            600: '#6c757d',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
})

export default theme