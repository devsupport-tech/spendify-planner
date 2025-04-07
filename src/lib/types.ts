
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
  client?: string;
  project?: string;
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

export interface Project {
  id: string;
  name: string;
  client?: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  budget?: number;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
}

export interface ProjectSummary {
  id: string;
  name: string;
  client?: string;
  budget?: number;
  expenses: number;
  income: number;
  profit: number;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
}
