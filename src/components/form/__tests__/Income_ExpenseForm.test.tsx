import { render, screen, fireEvent } from '@testing-library/react';
import Income_ExpenseForm from '../Income_ExpenseForm';
import { act } from 'react';

// Mock the financial store
const mockSetFinancialData = jest.fn();
jest.mock('@/store/useFinancialStore', () => {
  return jest.fn(() => ({
    financialData: {
      monthlyIncome: 0,
      housing: 0,
      utilities: 0,
      food: 0,
      transportation: 0,
      otherExpenses: 0,
    },
    setFinancialData: mockSetFinancialData,
  }));
});

describe('Income_ExpenseForm', () => {
  beforeEach(() => {
    mockSetFinancialData.mockClear();
  });

  it('should handle valid numeric input for monthly income', () => {
    render(<Income_ExpenseForm />);
    const monthlyIncomeInput = screen.getByLabelText('Monthly Income');
    
    act(() => {
      fireEvent.change(monthlyIncomeInput, { target: { value: '1234' } });
    });

    expect(mockSetFinancialData).toHaveBeenCalledWith({ monthlyIncome: 1234 });
  });

  it('should handle invalid input (letters mixed with numbers) by keeping only numbers', () => {
    render(<Income_ExpenseForm />);
    const monthlyIncomeInput = screen.getByLabelText('Monthly Income');
    
    act(() => {
      fireEvent.change(monthlyIncomeInput, { target: { value: '1234a' } });
    });

    // Should extract only the numeric part and call with 1234
    expect(mockSetFinancialData).toHaveBeenCalledWith({ monthlyIncome: 1234 });
  });

  it('should handle input with only letters by setting to 0', () => {
    render(<Income_ExpenseForm />);
    const monthlyIncomeInput = screen.getByLabelText('Monthly Income');
    
    act(() => {
      fireEvent.change(monthlyIncomeInput, { target: { value: 'abc' } });
    });

    expect(mockSetFinancialData).toHaveBeenCalledWith({ monthlyIncome: 0 });
  });

  it('should handle decimal numbers correctly', () => {
    render(<Income_ExpenseForm />);
    const monthlyIncomeInput = screen.getByLabelText('Monthly Income');
    
    act(() => {
      fireEvent.change(monthlyIncomeInput, { target: { value: '1234.56' } });
    });

    expect(mockSetFinancialData).toHaveBeenCalledWith({ monthlyIncome: 1234.56 });
  });

  it('should handle negative numbers by converting to positive', () => {
    render(<Income_ExpenseForm />);
    const monthlyIncomeInput = screen.getByLabelText('Monthly Income');
    
    act(() => {
      fireEvent.change(monthlyIncomeInput, { target: { value: '-1234' } });
    });

    expect(mockSetFinancialData).toHaveBeenCalledWith({ monthlyIncome: 1234 });
  });

  it('should handle empty input by setting to 0', () => {
    render(<Income_ExpenseForm />);
    const monthlyIncomeInput = screen.getByLabelText('Monthly Income');
    
    act(() => {
      fireEvent.change(monthlyIncomeInput, { target: { value: '' } });
    });

    expect(mockSetFinancialData).toHaveBeenCalledWith({ monthlyIncome: 0 });
  });
});