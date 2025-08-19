import React, { useState, FormEvent } from 'react'
import './Income_ExpenseForm.css'

interface FormData {
  amount: number
  description: string
  category: string
  type: 'income' | 'expense'
}

interface Income_ExpenseFormProps {
  onSubmit?: (data: FormData) => void
}

/**
 * Income and Expense Form Component
 * Features a number input with spinner controls for amount entry
 */
export const Income_ExpenseForm: React.FC<Income_ExpenseFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    amount: 0,
    description: '',
    category: '',
    type: 'expense'
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})

  /**
   * Handle form field changes
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }))

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0' as any
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required' as any
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required' as any
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handle form submission
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit?.(formData)
      
      // Reset form after successful submission
      setFormData({
        amount: 0,
        description: '',
        category: '',
        type: 'expense'
      })
    }
  }

  /**
   * Handle amount increment via spinner
   */
  const incrementAmount = () => {
    setFormData(prev => ({
      ...prev,
      amount: Math.round((prev.amount + 0.01) * 100) / 100
    }))
  }

  /**
   * Handle amount decrement via spinner
   */
  const decrementAmount = () => {
    setFormData(prev => ({
      ...prev,
      amount: Math.max(0, Math.round((prev.amount - 0.01) * 100) / 100)
    }))
  }

  return (
    <div className="income-expense-form">
      <h2>Add Transaction</h2>
      
      <form onSubmit={handleSubmit} className="form-container">
        {/* Transaction Type */}
        <div className="form-group">
          <label htmlFor="type">Transaction Type:</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="form-select"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        {/* Amount Input with Spinner */}
        <div className="form-group">
          <label htmlFor="amount">Amount:</label>
          <div className="input-container">
            <input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount.toFixed(2)}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`form-input number-input ${errors.amount ? 'error' : ''}`}
              placeholder="0.00"
              aria-label="Amount"
            />
            <div className="spinner-controls">
              <button
                type="button"
                className="spinner-btn spinner-up"
                onClick={incrementAmount}
                aria-label="Increase amount"
              >
                ▲
              </button>
              <button
                type="button"
                className="spinner-btn spinner-down"
                onClick={decrementAmount}
                aria-label="Decrease amount"
              >
                ▼
              </button>
            </div>
          </div>
          {errors.amount && <span className="error-message">{errors.amount}</span>}
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input
            id="description"
            name="description"
            type="text"
            value={formData.description}
            onChange={handleChange}
            className={`form-input ${errors.description ? 'error' : ''}`}
            placeholder="Enter description"
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <input
            id="category"
            name="category"
            type="text"
            value={formData.category}
            onChange={handleChange}
            className={`form-input ${errors.category ? 'error' : ''}`}
            placeholder="Enter category"
          />
          {errors.category && <span className="error-message">{errors.category}</span>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn">
          Add {formData.type === 'income' ? 'Income' : 'Expense'}
        </button>
      </form>
    </div>
  )
}