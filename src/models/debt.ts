export type DebtType =
    | 'Credit Card'
    | 'Car Loan'
    | 'Personal Loan'
    | 'Mortgage'
    | 'Student Loan'
    | 'Business Loan'
    | 'Medical Debt'
    | 'Other';

export type InterestType = 'Fixed' | 'Reducing';

export const defaultInterestMap: Record<DebtType, InterestType> = {
    'Credit Card': 'Reducing',
    'Car Loan': 'Fixed',
    'Personal Loan': 'Fixed',
    'Mortgage': 'Fixed',
    'Student Loan': 'Fixed',
    'Business Loan': 'Reducing',
    'Medical Debt': 'Fixed',
    'Other': 'Fixed',
};