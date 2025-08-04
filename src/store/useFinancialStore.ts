'use client';

import { create } from 'zustand';

export type UserFinancialData = {
    monthlyIncome: number;
    housing: number;
    utilities: number;
    food: number;
    transportation: number;
    otherExpenses: number;
};

export type InterestType = 'Fixed' | 'Reducing';

export type Debt = {
    id: string;
    debtType: string;
    debtName: string;
    balance: number;
    interestType: InterestType;
    interestRate: number; // %
    monthlyPayment: number;
};

type DebtSummary = {
    id: string;
    name: string;
    totalMonths: number;
    payoffDate: string;
};

type FinancialStore = {
    financialData: UserFinancialData;
    debts: Debt[];
    setFinancialData: (data: Partial<UserFinancialData>) => void;
    setDebts: (debts: Debt[] | ((prev: Debt[]) => Debt[])) => void;
    addDebt: (debt: Debt) => void;
    removeDebt: (id: string) => void;

    calculateTotalExpenses: () => number;
    calculateRemainingIncome: () => number;
    calculateTotalMonthlyDebt: () => number;
    calculateRemainingAfterDebt: () => number;
    calculateDebtSummary: () => DebtSummary[];
    calculateDebtProjection: () => {
        month: number;
        income: number;
        expenses: number;
        totalDebtPayment: number;
        remainingAfterDebt: number;
        totalDebtLeft: number;
    }[];
};

const useFinancialStore = create<FinancialStore>((set, get) => ({
    financialData: {
        monthlyIncome: 0,
        housing: 0,
        utilities: 0,
        food: 0,
        transportation: 0,
        otherExpenses: 0,
    },
    debts: [],

    setFinancialData: (data) => {
        set((state) => ({
            financialData: { ...state.financialData, ...data },
        }));
    },

    setDebts: (debts) => {
        if (typeof debts === 'function') {
            set((state) => ({ debts: debts(state.debts) }));
        } else {
            set({ debts });
        }
    },

    addDebt: (debt) => {
        set((state) => ({ debts: [...state.debts, debt] }));
    },

    removeDebt: (id) => {
        set((state) => ({
            debts: state.debts.filter((d) => d.id !== id),
        }));
    },

    calculateTotalExpenses: () => {
        const d = get().financialData;
        return d.housing + d.utilities + d.food + d.transportation + d.otherExpenses;
    },

    calculateRemainingIncome: () => {
        const d = get().financialData;
        return d.monthlyIncome - get().calculateTotalExpenses();
    },

    calculateTotalMonthlyDebt: () => {
        return get().debts.reduce((sum, d) => sum + Number(d.monthlyPayment || 0), 0);
    },

    calculateRemainingAfterDebt: () => {
        return get().calculateRemainingIncome() - get().calculateTotalMonthlyDebt();
    },

    calculateDebtSummary: () => {
        const debts = get().debts;
        return debts.map((debt) => {
            const totalMonths = debt.monthlyPayment > 0
                ? Math.ceil(debt.balance / debt.monthlyPayment)
                : 0;

            const now = new Date();
            const payoffDate = new Date(now.setMonth(now.getMonth() + totalMonths)).toLocaleDateString();

            return {
                id: debt.id,
                name: debt.debtName || debt.debtType,
                totalMonths,
                payoffDate,
            };
        });
    },

    calculateDebtProjection: () => {
        const { monthlyIncome, housing, utilities, food, transportation, otherExpenses } = get().financialData;
        const debts = JSON.parse(JSON.stringify(get().debts)) as Debt[];
        const totalExpenses = housing + utilities + food + transportation + otherExpenses;

        const projection = [];
        let month = 1;

        while (debts.some((d) => d.balance > 0)) {
            let totalDebtPayment = 0;
            let remainingIncome = monthlyIncome - totalExpenses;

            debts.forEach((d) => {
                if (d.balance <= 0) return;
                const pay = Math.min(d.monthlyPayment, d.balance); // ไม่ลดจาก remaining
                d.balance -= pay;
                remainingIncome -= pay;
                totalDebtPayment += pay;
            });

            const totalDebtLeft = debts.reduce((sum, d) => sum + d.balance, 0);

            projection.push({
                month,
                income: monthlyIncome,
                expenses: totalExpenses,
                totalDebtPayment,
                remainingAfterDebt: remainingIncome, // อาจติดลบได้
                totalDebtLeft,
            });

            if (totalDebtLeft <= 0) break;
            month++;
        }

        return projection;
    },
}));

export default useFinancialStore;