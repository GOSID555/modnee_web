import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#ffffff',
            paper: '#ffffff',
        },
        text: {
            primary: '#171717',
        },
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    color: '#171717',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#171717',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#171717',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#171717',
                    },
                },
                input: {
                    color: '#171717',
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#171717',
                    '&.Mui-focused': {
                        color: '#171717',
                    },
                },
            },
        },
    },
});