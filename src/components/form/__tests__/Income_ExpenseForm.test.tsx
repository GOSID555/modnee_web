import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import Income_ExpenseForm from '../Income_ExpenseForm';
import useFinancialStore from '@/store/useFinancialStore';

// Mock the store
const mockSetFinancialData = vi.fn();
const mockFinancialData = {
    monthlyIncome: 50000,
    housing: 10000,
    utilities: 2000,
    food: 5000,
    transportation: 3000,
    otherExpenses: 2000,
};

vi.mock('@/store/useFinancialStore');

describe('Income_ExpenseForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useFinancialStore as any).mockReturnValue({
            financialData: mockFinancialData,
            setFinancialData: mockSetFinancialData,
        });
    });

    it('should render all input fields with correct labels', () => {
        render(<Income_ExpenseForm />);
        
        expect(screen.getByLabelText('Monthly Income')).toBeInTheDocument();
        expect(screen.getByLabelText('Housing Expenses')).toBeInTheDocument();
        expect(screen.getByLabelText('Utilities')).toBeInTheDocument();
        expect(screen.getByLabelText('Food & Groceries')).toBeInTheDocument();
        expect(screen.getByLabelText('Transportation')).toBeInTheDocument();
        expect(screen.getByLabelText('Other Expenses')).toBeInTheDocument();
    });

    it('should display current financial data values', () => {
        render(<Income_ExpenseForm />);
        
        const monthlyIncomeInput = screen.getByLabelText('Monthly Income') as HTMLInputElement;
        expect(monthlyIncomeInput.value).toBe('50000');
    });

    it('should handle valid numeric input correctly', () => {
        render(<Income_ExpenseForm />);
        
        const monthlyIncomeInput = screen.getByLabelText('Monthly Income');
        fireEvent.change(monthlyIncomeInput, { target: { value: '60000' } });
        
        expect(mockSetFinancialData).toHaveBeenCalledWith({ monthlyIncome: 60000 });
    });

    it('should handle decimal input correctly', () => {
        render(<Income_ExpenseForm />);
        
        const monthlyIncomeInput = screen.getByLabelText('Monthly Income');
        fireEvent.change(monthlyIncomeInput, { target: { value: '50000.50' } });
        
        expect(mockSetFinancialData).toHaveBeenCalledWith({ monthlyIncome: 50000.50 });
    });

    it('should preserve input value when user types invalid characters', () => {
        render(<Income_ExpenseForm />);
        
        const monthlyIncomeInput = screen.getByLabelText('Monthly Income') as HTMLInputElement;
        
        // Simulate typing "a12a34a" - should only keep the numeric parts "1234"
        fireEvent.change(monthlyIncomeInput, { target: { value: 'a12a34a' } });
        
        // The input should show sanitized value "1234"
        expect(monthlyIncomeInput.value).toBe('1234');
        expect(mockSetFinancialData).toHaveBeenCalledWith({ monthlyIncome: 1234 });
    });

    it('should handle empty input without resetting to 0', () => {
        render(<Income_ExpenseForm />);
        
        const monthlyIncomeInput = screen.getByLabelText('Monthly Income') as HTMLInputElement;
        fireEvent.change(monthlyIncomeInput, { target: { value: '' } });
        
        // Empty input should remain empty (not reset to 0)
        expect(monthlyIncomeInput.value).toBe('');
        expect(mockSetFinancialData).toHaveBeenCalledWith({ monthlyIncome: 0 });
    });

    it('should handle input with only non-numeric characters', () => {
        render(<Income_ExpenseForm />);
        
        const monthlyIncomeInput = screen.getByLabelText('Monthly Income') as HTMLInputElement;
        fireEvent.change(monthlyIncomeInput, { target: { value: 'abc' } });
        
        // Should show empty string when no numeric characters found
        expect(monthlyIncomeInput.value).toBe('');
        expect(mockSetFinancialData).toHaveBeenCalledWith({ monthlyIncome: 0 });
    });

    it('should handle negative numbers correctly', () => {
        render(<Income_ExpenseForm />);
        
        const monthlyIncomeInput = screen.getByLabelText('Monthly Income');
        fireEvent.change(monthlyIncomeInput, { target: { value: '-5000' } });
        
        expect(mockSetFinancialData).toHaveBeenCalledWith({ monthlyIncome: -5000 });
    });

    it('should work correctly for all expense fields', () => {
        render(<Income_ExpenseForm />);
        
        const housingInput = screen.getByLabelText('Housing Expenses');
        fireEvent.change(housingInput, { target: { value: 'a15000b' } });
        
        expect(mockSetFinancialData).toHaveBeenCalledWith({ housing: 15000 });
    });
});