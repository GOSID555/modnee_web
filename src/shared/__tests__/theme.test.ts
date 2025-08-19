import { greyTheme } from '../theme';

describe('Grey Theme', () => {
  it('should have grey color palette', () => {
    expect(greyTheme.palette.mode).toBe('light');
    expect(greyTheme.palette.background.default).toBe('#f5f5f5');
    expect(greyTheme.palette.background.paper).toBe('#ffffff');
  });

  it('should have proper grey text colors', () => {
    expect(greyTheme.palette.text.primary).toBe('#424242');
    expect(greyTheme.palette.text.secondary).toBe('#757575');
  });

  it('should have grey primary color', () => {
    expect(greyTheme.palette.primary.main).toBe('#616161');
    expect(greyTheme.palette.primary.light).toBe('#8e8e8e');
    expect(greyTheme.palette.primary.dark).toBe('#373737');
  });

  it('should have grey secondary color', () => {
    expect(greyTheme.palette.secondary.main).toBe('#9e9e9e');
    expect(greyTheme.palette.secondary.light).toBe('#cfcfcf');
    expect(greyTheme.palette.secondary.dark).toBe('#707070');
  });

  it('should have proper component overrides for grey theme', () => {
    const outlinedInputOverrides = greyTheme.components?.MuiOutlinedInput?.styleOverrides?.root;
    expect(outlinedInputOverrides).toBeDefined();
    
    const inputLabelOverrides = greyTheme.components?.MuiInputLabel?.styleOverrides?.root;
    expect(inputLabelOverrides).toBeDefined();
  });
});