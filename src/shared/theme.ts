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
            main: '#616161',
            light: '#8e8e8e',
            dark: '#373737',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#9e9e9e',
            light: '#cfcfcf',
            dark: '#707070',
            contrastText: '#ffffff',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
        text: {
            primary: '#424242',
            secondary: '#757575',
        },
        error: {
            main: '#d32f2f',
        },
        warning: {
            main: '#f57c00',
        },
        info: {
            main: '#0288d1',
        },
        success: {
            main: '#388e3c',
        },
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    color: '#424242',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#9e9e9e',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#616161',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#616161',
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
                        color: '#616161',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
                contained: {
                    backgroundColor: '#616161',
                    color: '#ffffff',
                    '&:hover': {
                        backgroundColor: '#424242',
                    },
                },
                outlined: {
                    borderColor: '#9e9e9e',
                    color: '#616161',
                    '&:hover': {
                        borderColor: '#616161',
                        backgroundColor: 'rgba(97, 97, 97, 0.04)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#616161',
                    color: '#ffffff',
                },
            },
        },
    },
});