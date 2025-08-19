import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme } from '../../../shared/theme';
import NumberInputField from '../NumberInputField';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={lightTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('NumberInputField', () => {
  it('should render with label and default value', () => {
    renderWithTheme(
      <NumberInputField
        label="Monthly Income"
        value={5000}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByLabelText('Monthly Income')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5000')).toBeInTheDocument();
  });

  it('should display increment and decrement buttons', () => {
    renderWithTheme(
      <NumberInputField
        label="Monthly Income"
        value={1000}
        onChange={jest.fn()}
      />
    );

    const incrementButton = screen.getByRole('button', { name: /increment/i });
    const decrementButton = screen.getByRole('button', { name: /decrement/i });

    expect(incrementButton).toBeInTheDocument();
    expect(decrementButton).toBeInTheDocument();
  });

  it('should increment value by step amount when clicking increment button', () => {
    const mockOnChange = jest.fn();
    
    renderWithTheme(
      <NumberInputField
        label="Monthly Income"
        value={1000}
        onChange={mockOnChange}
        step={100}
      />
    );

    const incrementButton = screen.getByRole('button', { name: /increment/i });
    fireEvent.click(incrementButton);

    expect(mockOnChange).toHaveBeenCalledWith(1100);
  });

  it('should decrement value by step amount when clicking decrement button', () => {
    const mockOnChange = jest.fn();
    
    renderWithTheme(
      <NumberInputField
        label="Monthly Income"
        value={1000}
        onChange={mockOnChange}
        step={100}
      />
    );

    const decrementButton = screen.getByRole('button', { name: /decrement/i });
    fireEvent.click(decrementButton);

    expect(mockOnChange).toHaveBeenCalledWith(900);
  });

  it('should not allow negative values by default', () => {
    const mockOnChange = jest.fn();
    
    renderWithTheme(
      <NumberInputField
        label="Monthly Income"
        value={50}
        onChange={mockOnChange}
        step={100}
      />
    );

    const decrementButton = screen.getByRole('button', { name: /decrement/i });
    fireEvent.click(decrementButton);

    expect(mockOnChange).toHaveBeenCalledWith(0);
  });

  it('should allow negative values when allowNegative is true', () => {
    const mockOnChange = jest.fn();
    
    renderWithTheme(
      <NumberInputField
        label="Other Expenses"
        value={50}
        onChange={mockOnChange}
        step={100}
        allowNegative={true}
      />
    );

    const decrementButton = screen.getByRole('button', { name: /decrement/i });
    fireEvent.click(decrementButton);

    expect(mockOnChange).toHaveBeenCalledWith(-50);
  });

  it('should handle manual input changes', () => {
    const mockOnChange = jest.fn();
    
    renderWithTheme(
      <NumberInputField
        label="Monthly Income"
        value={1000}
        onChange={mockOnChange}
      />
    );

    const input = screen.getByLabelText('Monthly Income');
    fireEvent.change(input, { target: { value: '2500' } });

    expect(mockOnChange).toHaveBeenCalledWith(2500);
  });

  it('should handle empty input gracefully', () => {
    const mockOnChange = jest.fn();
    
    renderWithTheme(
      <NumberInputField
        label="Monthly Income"
        value={1000}
        onChange={mockOnChange}
      />
    );

    const input = screen.getByLabelText('Monthly Income');
    fireEvent.change(input, { target: { value: '' } });

    expect(mockOnChange).toHaveBeenCalledWith(0);
  });

  it('should respect maximum value constraint', () => {
    const mockOnChange = jest.fn();
    
    renderWithTheme(
      <NumberInputField
        label="Monthly Income"
        value={9900}
        onChange={mockOnChange}
        step={200}
        max={10000}
      />
    );

    const incrementButton = screen.getByRole('button', { name: /increment/i });
    fireEvent.click(incrementButton);

    expect(mockOnChange).toHaveBeenCalledWith(10000);
  });

  it('should respect minimum value constraint', () => {
    const mockOnChange = jest.fn();
    
    renderWithTheme(
      <NumberInputField
        label="Monthly Income"
        value={150}
        onChange={mockOnChange}
        step={200}
        min={100}
      />
    );

    const decrementButton = screen.getByRole('button', { name: /decrement/i });
    fireEvent.click(decrementButton);

    expect(mockOnChange).toHaveBeenCalledWith(100);
  });

  it('should format currency when startAdornment is provided', () => {
    renderWithTheme(
      <NumberInputField
        label="Monthly Income"
        value={5000}
        onChange={jest.fn()}
        startAdornment="$"
      />
    );

    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('should use default step value of 50', () => {
    const mockOnChange = jest.fn();
    
    renderWithTheme(
      <NumberInputField
        label="Monthly Income"
        value={1000}
        onChange={mockOnChange}
      />
    );

    const incrementButton = screen.getByRole('button', { name: /increment/i });
    fireEvent.click(incrementButton);

    expect(mockOnChange).toHaveBeenCalledWith(1050);
  });
});