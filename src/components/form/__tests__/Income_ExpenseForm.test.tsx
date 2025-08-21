import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Income_ExpenseForm from '../Income_ExpenseForm';
import useFinancialStore from '@/store/useFinancialStore';

// Mock the store
vi.mock('@/store/useFinancialStore');

const mockSetFinancialData = vi.fn();
const mockFinancialData = {
  monthlyIncome: 0,
  housing: 0,
  utilities: 0,
  food: 0,
  transportation: 0,
  otherExpenses: 0,
};

describe('Income_ExpenseForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useFinancialStore as any).mockReturnValue({
      financialData: mockFinancialData,
      setFinancialData: mockSetFinancialData,
    });
  });

  it('should render all input fields correctly', () => {
    render(<Income_ExpenseForm />);
    
    expect(screen.getByLabelText(/Monthly Income/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Housing Expenses/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Utilities/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Food & Groceries/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Transportation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Other Expenses/i)).toBeInTheDocument();
  });

  it('should handle valid numeric input correctly', () => {
    render(<Income_ExpenseForm />);
    
    const monthlyIncomeInput = screen.getByLabelText(/Monthly Income/i);
    fireEvent.change(monthlyIncomeInput, { target: { value: '1234' } });
    
    expect(mockSetFinancialData).toHaveBeenCalledWith({ monthlyIncome: 1234 });
  });

  it('should handle invalid input (numbers with letters) gracefully', () => {
    render(<Income_ExpenseForm />);
    
    const monthlyIncomeInput = screen.getByLabelText(/Monthly Income/i);
    fireEvent.change(monthlyIncomeInput, { target: { value: '1234a' } });
    
    // Should not call setFinancialData with invalid data
    expect(mockSetFinancialData).not.toHaveBeenCalledWith({ monthlyIncome: 0 });
    expect(mockSetFinancialData).not.toHaveBeenCalledWith({ monthlyIncome: NaN });
    
    // The input field should show the user's input
    expect(monthlyIncomeInput).toHaveValue('1234a');
  });

  it('should handle empty string input', () => {
    render(<Income_ExpenseForm />);
    
    const monthlyIncomeInput = screen.getByLabelText(/Monthly Income/i);
    fireEvent.change(monthlyIncomeInput, { target: { value: '' } });
    
    expect(mockSetFinancialData).toHaveBeenCalledWith({ monthlyIncome: 0 });
  });

  it('should handle decimal numbers correctly', () => {
    render(<Income_ExpenseForm />);
    
    const monthlyIncomeInput = screen.getByLabelText(/Monthly Income/i);
    fireEvent.change(monthlyIncomeInput, { target: { value: '1234.56' } });
    
    expect(mockSetFinancialData).toHaveBeenCalledWith({ monthlyIncome: 1234.56 });
  });

  it('should handle negative numbers correctly', () => {
    render(<Income_ExpenseForm />);
    
    const monthlyIncomeInput = screen.getByLabelText(/Monthly Income/i);
    fireEvent.change(monthlyIncomeInput, { target: { value: '-100' } });
    
    expect(mockSetFinancialData).toHaveBeenCalledWith({ monthlyIncome: -100 });
  });

  it('should preserve partial valid input during typing', () => {
    render(<Income_ExpenseForm />);
    
    const monthlyIncomeInput = screen.getByLabelText(/Monthly Income/i);
    
    // Simulate user typing "123."
    fireEvent.change(monthlyIncomeInput, { target: { value: '123.' } });
    
    // Should show the partial input but not update store with invalid number
    expect(monthlyIncomeInput).toHaveValue('123.');
    expect(mockSetFinancialData).toHaveBeenCalledWith({ monthlyIncome: 123 });
  });

  it('should work correctly for all input fields', () => {
    render(<Income_ExpenseForm />);
    
    const tests = [
      { field: /Housing Expenses/i, storeKey: 'housing' },
      { field: /Utilities/i, storeKey: 'utilities' },
      { field: /Food & Groceries/i, storeKey: 'food' },
      { field: /Transportation/i, storeKey: 'transportation' },
      { field: /Other Expenses/i, storeKey: 'otherExpenses' },
    ];
    
    tests.forEach(({ field, storeKey }) => {
      const input = screen.getByLabelText(field);
      fireEvent.change(input, { target: { value: '100abc' } });
      
      // Should preserve invalid input in UI
      expect(input).toHaveValue('100abc');
      
      // Should not update store with invalid data
      expect(mockSetFinancialData).not.toHaveBeenCalledWith({ [storeKey]: 0 });
      expect(mockSetFinancialData).not.toHaveBeenCalledWith({ [storeKey]: NaN });
    });
  });
});