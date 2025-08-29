import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Income_ExpenseForm from '../Income_ExpenseForm';
import useFinancialStore from '@/store/useFinancialStore';

// Mock the store
jest.mock('@/store/useFinancialStore');

const mockSetFinancialData = jest.fn();
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
    jest.clearAllMocks();
    (useFinancialStore as jest.Mock).mockReturnValue({
      financialData: mockFinancialData,
      setFinancialData: mockSetFinancialData,
    });
  });

  test('should update monthly income correctly when user types 1234', () => {
    render(<Income_ExpenseForm />);
    
    const monthlyIncomeInput = screen.getByLabelText(/Monthly Income/i);
    
    // Simulate typing 1234
    fireEvent.change(monthlyIncomeInput, { target: { value: '1234' } });
    
    // The setFinancialData should be called with the correct value
    expect(mockSetFinancialData).toHaveBeenCalledWith({
      monthlyIncome: 1234
    });
  });

  test('should handle empty input correctly by setting to 0', () => {
    render(<Income_ExpenseForm />);
    
    const monthlyIncomeInput = screen.getByLabelText(/Monthly Income/i);
    
    // Simulate empty input
    fireEvent.change(monthlyIncomeInput, { target: { value: '' } });
    
    // The setFinancialData should be called with 0 for empty input
    expect(mockSetFinancialData).toHaveBeenCalledWith({
      monthlyIncome: 0
    });
  });

  test('should handle decimal numbers correctly', () => {
    render(<Income_ExpenseForm />);
    
    const monthlyIncomeInput = screen.getByLabelText(/Monthly Income/i);
    
    // Simulate typing a decimal number
    fireEvent.change(monthlyIncomeInput, { target: { value: '1234.56' } });
    
    expect(mockSetFinancialData).toHaveBeenCalledWith({
      monthlyIncome: 1234.56
    });
  });

  test('should handle invalid input by setting to 0', () => {
    render(<Income_ExpenseForm />);
    
    const monthlyIncomeInput = screen.getByLabelText(/Monthly Income/i);
    
    // Simulate invalid input
    fireEvent.change(monthlyIncomeInput, { target: { value: 'abc' } });
    
    expect(mockSetFinancialData).toHaveBeenCalledWith({
      monthlyIncome: 0
    });
  });

  test('should handle all expense fields correctly', () => {
    render(<Income_ExpenseForm />);
    
    const fields = [
      { label: /Housing Expenses/i, field: 'housing' },
      { label: /Utilities/i, field: 'utilities' },
      { label: /Food & Groceries/i, field: 'food' },
      { label: /Transportation/i, field: 'transportation' },
      { label: /Other Expenses/i, field: 'otherExpenses' },
    ];

    fields.forEach(({ label, field }) => {
      const input = screen.getByLabelText(label);
      fireEvent.change(input, { target: { value: '500' } });
      
      expect(mockSetFinancialData).toHaveBeenCalledWith({
        [field]: 500
      });
    });
  });
});