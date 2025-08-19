'use client';

import React from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  TextFieldProps,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export interface NumberInputFieldProps {
  /** The field label */
  label: string;
  /** Current numeric value */
  value: number;
  /** Callback when value changes */
  onChange: (value: number) => void;
  /** Step size for increment/decrement (default: 50) */
  step?: number;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Whether to allow negative values (default: false) */
  allowNegative?: boolean;
  /** Start adornment text (e.g., "$" for currency) */
  startAdornment?: string;
  /** Additional TextField props */
  textFieldProps?: Omit<TextFieldProps, 'value' | 'onChange' | 'label'>;
}

/**
 * NumberInputField component with spinner controls
 * 
 * Features:
 * - Manual text input with numeric validation
 * - Increment/Decrement buttons (spinner)
 * - Configurable step size, min/max values
 * - Optional currency/unit prefix
 * - Prevents negative values by default
 */
const NumberInputField: React.FC<NumberInputFieldProps> = ({
  label,
  value,
  onChange,
  step = 50,
  min,
  max,
  allowNegative = false,
  startAdornment,
  textFieldProps = {},
}) => {
  /**
   * Handle manual text input changes
   * Filters out non-numeric characters and converts to number
   */
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    
    // Allow empty input
    if (inputValue === '') {
      onChange(0);
      return;
    }

    // Remove non-numeric characters (except decimal point and minus sign)
    const cleanedValue = inputValue.replace(/[^0-9.-]/g, '');
    const numericValue = parseFloat(cleanedValue) || 0;
    
    // Apply constraints
    const constrainedValue = applyConstraints(numericValue);
    onChange(constrainedValue);
  };

  /**
   * Apply min/max constraints and negative value rules
   */
  const applyConstraints = (newValue: number): number => {
    let constrainedValue = newValue;

    // Handle negative values
    if (!allowNegative && constrainedValue < 0) {
      constrainedValue = 0;
    }

    // Apply min constraint
    if (min !== undefined && constrainedValue < min) {
      constrainedValue = min;
    }

    // Apply max constraint
    if (max !== undefined && constrainedValue > max) {
      constrainedValue = max;
    }

    return constrainedValue;
  };

  /**
   * Handle increment button click
   */
  const handleIncrement = () => {
    const newValue = value + step;
    const constrainedValue = applyConstraints(newValue);
    onChange(constrainedValue);
  };

  /**
   * Handle decrement button click
   */
  const handleDecrement = () => {
    const newValue = value - step;
    const constrainedValue = applyConstraints(newValue);
    onChange(constrainedValue);
  };

  /**
   * Format display value
   * Shows empty string for 0 values to improve UX
   */
  const getDisplayValue = (): string => {
    return value === 0 ? '' : value.toString();
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <TextField
        {...textFieldProps}
        label={label}
        value={getDisplayValue()}
        onChange={handleInputChange}
        fullWidth
        type="text"
        inputMode="numeric"
        InputProps={{
          startAdornment: startAdornment ? (
            <InputAdornment position="start">
              <span>{startAdornment}&nbsp;</span>
            </InputAdornment>
          ) : undefined,
          endAdornment: (
            <InputAdornment position="end">
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  ml: 1
                }}
              >
                <IconButton
                  aria-label="increment"
                  size="small"
                  onClick={handleIncrement}
                  disabled={max !== undefined && value >= max}
                  sx={{
                    padding: '2px',
                    minWidth: '24px',
                    height: '20px',
                    borderRadius: '4px 4px 0 0',
                    backgroundColor: '#f5f5f5',
                    '&:hover': {
                      backgroundColor: '#e0e0e0',
                    },
                    '&:disabled': {
                      backgroundColor: '#fafafa',
                    },
                  }}
                >
                  <AddIcon sx={{ fontSize: '14px' }} />
                </IconButton>
                <IconButton
                  aria-label="decrement"
                  size="small"
                  onClick={handleDecrement}
                  disabled={
                    (min !== undefined && value <= min) || 
                    (!allowNegative && value <= 0)
                  }
                  sx={{
                    padding: '2px',
                    minWidth: '24px',
                    height: '20px',
                    borderRadius: '0 0 4px 4px',
                    backgroundColor: '#f5f5f5',
                    '&:hover': {
                      backgroundColor: '#e0e0e0',
                    },
                    '&:disabled': {
                      backgroundColor: '#fafafa',
                    },
                  }}
                >
                  <RemoveIcon sx={{ fontSize: '14px' }} />
                </IconButton>
              </Box>
            </InputAdornment>
          ),
          ...textFieldProps.InputProps,
        }}
      />
    </Box>
  );
};

export default NumberInputField;