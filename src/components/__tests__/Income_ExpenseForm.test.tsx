import { render, screen, fireEvent } from '@testing-library/react'
import { Income_ExpenseForm } from '../Income_ExpenseForm'
import '@testing-library/jest-dom'

describe('Income_ExpenseForm', () => {
  test('should render form with amount input field', () => {
    render(<Income_ExpenseForm />)
    
    const amountInput = screen.getByLabelText(/amount/i)
    expect(amountInput).toBeInTheDocument()
    expect(amountInput).toHaveAttribute('type', 'number')
  })

  test('should display number input spinner controls', () => {
    render(<Income_ExpenseForm />)
    
    const amountInput = screen.getByLabelText(/amount/i)
    
    // Check that the input has spinner controls (step attribute enables spinners)
    expect(amountInput).toHaveAttribute('step')
    
    // Check that the input accepts decimal values
    expect(amountInput).toHaveAttribute('step', '0.01')
    expect(amountInput).toHaveAttribute('min', '0')
  })

  test('should allow incrementing amount value using spinner', () => {
    render(<Income_ExpenseForm />)
    
    const amountInput = screen.getByLabelText(/amount/i) as HTMLInputElement
    
    // Set initial value
    fireEvent.change(amountInput, { target: { value: '10.00' } })
    expect(amountInput.value).toBe('10.00')
    
    // Simulate spinner increment (stepUp)
    fireEvent.focus(amountInput)
    amountInput.stepUp()
    fireEvent.blur(amountInput)
    
    expect(parseFloat(amountInput.value)).toBe(10.01)
  })

  test('should allow decrementing amount value using spinner', () => {
    render(<Income_ExpenseForm />)
    
    const amountInput = screen.getByLabelText(/amount/i) as HTMLInputElement
    
    // Set initial value
    fireEvent.change(amountInput, { target: { value: '10.00' } })
    expect(amountInput.value).toBe('10.00')
    
    // Simulate spinner decrement (stepDown)
    fireEvent.focus(amountInput)
    amountInput.stepDown()
    fireEvent.blur(amountInput)
    
    expect(parseFloat(amountInput.value)).toBe(9.99)
  })

  test('should prevent negative values', () => {
    render(<Income_ExpenseForm />)
    
    const amountInput = screen.getByLabelText(/amount/i)
    
    // Try to set negative value
    fireEvent.change(amountInput, { target: { value: '-5.00' } })
    
    // Input should not accept negative values due to min="0"
    expect((amountInput as HTMLInputElement).checkValidity()).toBeFalsy()
  })

  test('should handle form submission with amount value', () => {
    const mockOnSubmit = jest.fn()
    render(<Income_ExpenseForm onSubmit={mockOnSubmit} />)
    
    const amountInput = screen.getByLabelText(/amount/i)
    const submitButton = screen.getByRole('button', { name: /submit/i })
    
    // Set amount value
    fireEvent.change(amountInput, { target: { value: '25.50' } })
    
    // Submit form
    fireEvent.click(submitButton)
    
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 25.50
      })
    )
  })

  test('should display proper styling for number input spinner', () => {
    const { container } = render(<Income_ExpenseForm />)
    
    const amountInput = screen.getByLabelText(/amount/i)
    
    // Check that the input has proper classes for styling
    expect(amountInput).toHaveClass('number-input')
    
    // Verify the input container has spinner styling
    const inputContainer = container.querySelector('.input-container')
    expect(inputContainer).toBeInTheDocument()
  })
})