
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
  | 'Savings' 
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
  | 'Refund' 
  | 'Sale' 
  | 'Client' 
  | 'Other';

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: Date;
  isPaid: boolean;
  isRecurring: boolean;
  category: ExpenseCategory | BusinessCategory;
  type: 'personal' | 'business';
  department?: string;
  project?: string;
  projectId?: string;
}

export interface Payment {
  id: string;
  amount: number;
  description: string;
  date: Date;
  isReceived: boolean;
  isRecurring: boolean;
  category: PaymentCategory;
  type: 'personal' | 'business';
  client?: string;
  project?: string;
  projectId?: string;
}

export interface BudgetGoal {
  id: string;
  category: ExpenseCategory | BusinessCategory;
  amount: number;
  current: number;
  period: 'weekly' | 'monthly' | 'yearly';
}

export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  type: NotificationType;
  relatedExpenseId?: string;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  upcomingExpenses: number;
  savingsGoalProgress: number;
  savingsGoalTarget: number;
}

export interface CategoryBreakdown {
  category: ExpenseCategory | BusinessCategory;
  amount: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  savings: number;
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
