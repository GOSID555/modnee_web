import { greyTheme } from '../theme';

describe('Theme Configuration', () => {
    describe('greyTheme', () => {
        it('should have grey background colors', () => {
            expect(greyTheme.palette.background.default).toBe('#f5f5f5');
            expect(greyTheme.palette.background.paper).toBe('#ffffff');
        });

        it('should have dark grey text color', () => {
            expect(greyTheme.palette.text.primary).toBe('#424242');
        });

        it('should have mode set to light', () => {
            expect(greyTheme.palette.mode).toBe('light');
        });

        it('should have grey primary color', () => {
            expect(greyTheme.palette.primary.main).toBe('#757575');
        });

        it('should have grey secondary color', () => {
            expect(greyTheme.palette.secondary.main).toBe('#9e9e9e');
        });

        it('should have proper component overrides for grey theme', () => {
            expect(greyTheme.components?.MuiOutlinedInput?.styleOverrides?.root).toBeDefined();
            expect(greyTheme.components?.MuiInputLabel?.styleOverrides?.root).toBeDefined();
        });

        it('should have consistent grey border colors for inputs', () => {
            const inputStyles = greyTheme.components?.MuiOutlinedInput?.styleOverrides?.root;
            expect(inputStyles).toMatchObject({
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
            });
        });

        it('should have grey input label colors', () => {
            const labelStyles = greyTheme.components?.MuiInputLabel?.styleOverrides?.root;
            expect(labelStyles).toMatchObject({
                color: '#757575',
                '&.Mui-focused': {
                    color: '#424242',
                },
            });
        });
    });
});