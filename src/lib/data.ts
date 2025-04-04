import { BudgetGoal, CategoryBreakdown, DashboardSummary, Expense, MonthlyTrend, Notification, Payment } from "./types";

// Helper function to create a date N days from now
const daysFromNow = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

// Helper function to create a date N days ago
const daysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

// Mock expenses data
export const expenses: Expense[] = [
  {
    id: "exp-1",
    amount: 1200,
    description: "Monthly Rent",
    date: daysFromNow(5),
    isPaid: false,
    isRecurring: true,
    category: "Housing",
    type: "personal",
  },
  {
    id: "exp-2",
    amount: 85.33,
    description: "Internet Bill",
    date: daysFromNow(12),
    isPaid: false,
    isRecurring: true,
    category: "Utilities",
    type: "personal",
  },
  {
    id: "exp-3",
    amount: 65.49,
    description: "Grocery Shopping",
    date: daysAgo(2),
    isPaid: true,
    isRecurring: false,
    category: "Food",
    type: "personal",
  },
  {
    id: "exp-4",
    amount: 750,
    description: "Car Payment",
    date: daysFromNow(15),
    isPaid: false,
    isRecurring: true,
    category: "Transportation",
    type: "personal",
  },
  {
    id: "exp-5",
    amount: 2500,
    description: "Website Development",
    date: daysAgo(5),
    isPaid: true,
    isRecurring: false,
    category: "Technology",
    type: "business",
    project: "Website Redesign",
    department: "Marketing"
  },
  {
    id: "exp-6",
    amount: 350,
    description: "Office Supplies",
    date: daysAgo(10),
    isPaid: true,
    isRecurring: false,
    category: "Office",
    type: "business",
    department: "Operations"
  },
  {
    id: "exp-7",
    amount: 1200,
    description: "Staff Training",
    date: daysFromNow(20),
    isPaid: false,
    isRecurring: false,
    category: "Professional",
    type: "business",
    department: "Human Resources"
  },
  {
    id: "exp-8",
    amount: 95,
    description: "Subscription Services",
    date: daysFromNow(8),
    isPaid: false,
    isRecurring: true,
    category: "Technology",
    type: "business",
    department: "Operations"
  },
  {
    id: "exp-9",
    amount: 42.99,
    description: "Movie Night",
    date: daysAgo(3),
    isPaid: true,
    isRecurring: false,
    category: "Entertainment",
    type: "personal"
  },
  {
    id: "exp-10",
    amount: 128.47,
    description: "Dining Out",
    date: daysAgo(1),
    isPaid: true,
    isRecurring: false,
    category: "Food",
    type: "personal"
  }
];

// Mock payments data
export const payments: Payment[] = [
  {
    id: "pay-1",
    amount: 3500,
    description: "Monthly Salary",
    date: daysAgo(5),
    isReceived: true,
    isRecurring: true,
    category: "Salary",
    type: "personal",
  },
  {
    id: "pay-2",
    amount: 850,
    description: "Freelance Project",
    date: daysAgo(10),
    isReceived: true,
    isRecurring: false,
    category: "Freelance",
    type: "personal",
  },
  {
    id: "pay-3",
    amount: 125,
    description: "Dividend Payment",
    date: daysAgo(7),
    isReceived: true,
    isRecurring: false,
    category: "Investment",
    type: "personal",
  },
  {
    id: "pay-4",
    amount: 1200,
    description: "Rental Income",
    date: daysFromNow(2),
    isReceived: false,
    isRecurring: true,
    category: "Rental",
    type: "personal",
  },
  {
    id: "pay-5",
    amount: 4500,
    description: "Client Project Payment",
    date: daysAgo(3),
    isReceived: true,
    isRecurring: false,
    category: "Client",
    type: "business",
    client: "Acme Corp",
    project: "Website Redesign"
  },
  {
    id: "pay-6",
    amount: 2800,
    description: "Consulting Services",
    date: daysFromNow(10),
    isReceived: false,
    isRecurring: false,
    category: "Client",
    type: "business",
    client: "TechStart Inc",
    project: "Strategic Consulting"
  },
  {
    id: "pay-7",
    amount: 950,
    description: "Product Sale",
    date: daysAgo(8),
    isReceived: true,
    isRecurring: false,
    category: "Sale",
    type: "business"
  },
  {
    id: "pay-8",
    amount: 3200,
    description: "Monthly Retainer",
    date: daysFromNow(5),
    isReceived: false,
    isRecurring: true,
    category: "Client",
    type: "business",
    client: "Global Services LLC"
  }
];

// Mock budget goals
export const budgetGoals: BudgetGoal[] = [
  {
    id: "goal-1",
    category: "Housing",
    amount: 1300,
    current: 1200,
    period: "monthly"
  },
  {
    id: "goal-2",
    category: "Food",
    amount: 500,
    current: 194.46,
    period: "monthly"
  },
  {
    id: "goal-3",
    category: "Entertainment",
    amount: 200,
    current: 42.99,
    period: "monthly"
  },
  {
    id: "goal-4",
    category: "Technology",
    amount: 3000,
    current: 2595,
    period: "monthly"
  }
];

// Mock notifications
export const notifications: Notification[] = [
  {
    id: "notif-1",
    title: "Upcoming Rent Payment",
    message: "Your monthly rent payment of $1,200 is due in 5 days.",
    date: new Date(),
    read: false,
    type: "warning",
    relatedExpenseId: "exp-1"
  },
  {
    id: "notif-2",
    title: "Budget Alert",
    message: "You've used 80% of your Food budget for this month.",
    date: daysAgo(1),
    read: true,
    type: "info"
  },
  {
    id: "notif-3",
    title: "Payment Success",
    message: "Your payment for Grocery Shopping has been processed.",
    date: daysAgo(2),
    read: false,
    type: "success",
    relatedExpenseId: "exp-3"
  },
  {
    id: "notif-4",
    title: "Savings Goal Achieved",
    message: "Congratulations! You've reached your Emergency Fund savings goal.",
    date: daysAgo(3),
    read: true,
    type: "success"
  }
];

// Mock dashboard summary
export const dashboardSummary: DashboardSummary = {
  totalIncome: 9500,
  totalExpenses: 6417.28,
  balance: 3082.72,
  upcomingExpenses: 2130.33,
  savingsGoalProgress: 12500,
  savingsGoalTarget: 15000
};

// Mock category breakdown
export const categoryBreakdown: CategoryBreakdown[] = [
  { category: "Housing", amount: 1200, percentage: 18.7 },
  { category: "Transportation", amount: 750, percentage: 11.7 },
  { category: "Food", amount: 193.96, percentage: 3.0 },
  { category: "Utilities", amount: 85.33, percentage: 1.3 },
  { category: "Entertainment", amount: 42.99, percentage: 0.7 },
  { category: "Technology", amount: 2595, percentage: 40.4 },
  { category: "Office", amount: 350, percentage: 5.5 },
  { category: "Professional", amount: 1200, percentage: 18.7 }
];

// Mock monthly trends
export const monthlyTrends: MonthlyTrend[] = [
  { month: "Jan", income: 8200, expenses: 5100, savings: 3100 },
  { month: "Feb", income: 8300, expenses: 5300, savings: 3000 },
  { month: "Mar", income: 8800, expenses: 5600, savings: 3200 },
  { month: "Apr", income: 9200, expenses: 5800, savings: 3400 },
  { month: "May", income: 9100, expenses: 6100, savings: 3000 },
  { month: "Jun", income: 9300, expenses: 6200, savings: 3100 },
  { month: "Jul", income: 9500, expenses: 6400, savings: 3100 }
];
