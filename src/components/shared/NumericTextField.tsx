// src/components/shared/NumericTextField.tsx
'use client'

import { TextField, TextFieldProps } from '@mui/material'
import { useState } from 'react'
import { formatNumericInputWithValidate } from '@/utils/format'

type Props = Omit<TextFieldProps, 'value' | 'onChange' | 'type' | 'inputMode'> & {
    value: string
    onChange: (v: string) => void
    decimals?: number        // จำนวนทศนิยม (default 2)
    allowNegative?: boolean  // อนุญาตค่าติดลบไหม (default false)
}

export default function NumericTextField({
    value,
    onChange,
    decimals = 2,
    allowNegative = false,
    helperText,
    error,
    ...rest
}: Props) {
    const [internalError, setInternalError] = useState<string | null>(null)

    return (
        <TextField
            {...rest}
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => {
                const { formatted, isValid, errorMessage } = formatNumericInputWithValidate(
                    e.target.value,
                    decimals,
                    allowNegative
                )
                onChange(formatted)
                setInternalError(isValid ? null : (errorMessage ?? 'ค่าที่กรอกไม่ถูกต้อง'))
            }}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            error={error || !!internalError}
            helperText={internalError ?? helperText ?? ' '}
            InputProps={{
                sx: { textAlign: 'right' },
                ...rest.InputProps,
            }}
        />
    )
}