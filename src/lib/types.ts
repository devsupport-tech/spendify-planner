
export type ExpenseCategory = 
  | 'Housing' 
  | 'Transportation' 
  | 'Food' 
  | 'Utilities' 
  | 'Insurance' 
  | 'Healthcare' 
  | 'Personal' 
  | 'Entertainment' 
  | 'Education' 
  | 'Debt' 
  | 'Other';

export type BusinessCategory = 
  | 'Marketing' 
  | 'Operations' 
  | 'Salaries' 
  | 'Technology' 
  | 'Travel' 
  | 'Office' 
  | 'Professional' 
  | 'Equipment'
  | 'Taxes'
  | 'Other';

export type PaymentCategory = 
  | 'Salary' 
  | 'Freelance' 
  | 'Investment' 
  | 'Rental' 
  | 'Gift' 
  | 'Other';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  isPaid: boolean;
  isRecurring: boolean;
  type: 'personal' | 'business';
  project?: string;
  department?: string;
}

export interface Payment {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: PaymentCategory | string;
  isReceived: boolean;
  isRecurring: boolean;
  type: 'personal' | 'business';
  source?: string;
}

export interface BudgetGoal {
  id: string;
  category: string;
  amount: number;
  current: number;
  period: 'weekly' | 'monthly' | 'yearly';
  icon?: string;
  color?: string;
  type: 'personal' | 'business';
}
