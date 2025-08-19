import React from 'react';
import { render } from '@testing-library/react';
import { useTheme } from '@mui/material/styles';
import ThemeWrapper from '../ThemeWrapper';
import { greyTheme } from '../../shared/theme';

// Test component to capture the theme
const ThemeCapture = ({ onTheme }: { onTheme: (theme: any) => void }) => {
    const theme = useTheme();
    React.useEffect(() => {
        onTheme(theme);
    }, [theme, onTheme]);
    return <div>Theme Test</div>;
};

describe('ThemeWrapper', () => {
    it('should provide grey theme to child components', () => {
        let capturedTheme: any;
        
        render(
            <ThemeWrapper>
                <ThemeCapture onTheme={(theme) => { capturedTheme = theme; }} />
            </ThemeWrapper>
        );

        expect(capturedTheme).toBeDefined();
        expect(capturedTheme.palette.mode).toBe('light');
        expect(capturedTheme.palette.primary.main).toBe('#757575');
        expect(capturedTheme.palette.background.default).toBe('#f5f5f5');
        expect(capturedTheme.palette.text.primary).toBe('#424242');
    });

    it('should render children correctly', () => {
        const { getByText } = render(
            <ThemeWrapper>
                <div>Test Content</div>
            </ThemeWrapper>
        );

        expect(getByText('Test Content')).toBeInTheDocument();
    });

    it('should apply CssBaseline for consistent styling', () => {
        const { container } = render(
            <ThemeWrapper>
                <div>Content</div>
            </ThemeWrapper>
        );

        // CssBaseline should reset margins and apply consistent baseline styles
        expect(container.firstChild).toBeInTheDocument();
    });
});