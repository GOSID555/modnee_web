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

export const greyTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#757575',
            light: '#a4a4a4',
            dark: '#494949',
        },
        secondary: {
            main: '#9e9e9e',
            light: '#cfcfcf',
            dark: '#707070',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
        text: {
            primary: '#424242',
            secondary: '#757575',
        },
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    color: '#424242',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#757575',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#424242',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#757575',
                    },
                },
                input: {
                    color: '#424242',
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#757575',
                    '&.Mui-focused': {
                        color: '#424242',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    color: '#424242',
                },
                contained: {
                    backgroundColor: '#757575',
                    color: '#ffffff',
                    '&:hover': {
                        backgroundColor: '#424242',
                    },
                },
                outlined: {
                    borderColor: '#757575',
                    color: '#424242',
                    '&:hover': {
                        borderColor: '#424242',
                        backgroundColor: 'rgba(66, 66, 66, 0.04)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    borderColor: '#e0e0e0',
                },
            },
        },
    },
});