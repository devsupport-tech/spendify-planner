
import { Expense, Payment } from "@/lib/types";

export const expenses: Expense[] = [
  {
    id: "1",
    description: "Grocery Shopping",
    amount: 85.47,
    date: "2023-03-20T10:00:00",
    category: "Food",
    isPaid: true,
    isRecurring: false,
    type: "personal"
  },
  {
    id: "2",
    description: "Apartment Rent",
    amount: 1200.00,
    date: "2023-04-01T10:00:00",
    category: "Housing",
    isPaid: true,
    isRecurring: true,
    type: "personal"
  },
  {
    id: "3",
    description: "Electricity Bill",
    amount: 75.20,
    date: "2023-04-05T10:00:00",
    category: "Utilities",
    isPaid: true,
    isRecurring: true,
    type: "personal"
  },
  // Add more expense data here
];

export const payments: Payment[] = [
  {
    id: "p1",
    description: "Salary",
    amount: 3500.00,
    date: "2023-03-28T10:00:00",
    category: "Salary",
    isReceived: true,
    isRecurring: true,
    type: "personal"
  },
  {
    id: "p2",
    description: "Freelance Work",
    amount: 450.00,
    date: "2023-04-10T10:00:00",
    category: "Freelance",
    isReceived: true,
    isRecurring: false,
    type: "business"
  }
  // Add more payment data here
];

export const monthlyTrends = [
  {
    month: "Jan",
    income: 4200,
    expenses: 3100,
    savings: 1100
  },
  {
    month: "Feb",
    income: 4100,
    expenses: 3300,
    savings: 800
  },
  {
    month: "Mar",
    income: 4500,
    expenses: 3200,
    savings: 1300
  },
  {
    month: "Apr",
    income: 4300,
    expenses: 3450,
    savings: 850
  },
  {
    month: "May",
    income: 4800,
    expenses: 3600,
    savings: 1200
  },
  {
    month: "Jun",
    income: 5100,
    expenses: 3700,
    savings: 1400
  },
  {
    month: "Jul",
    income: 4900,
    expenses: 3800,
    savings: 1100
  }
];

export const categoryBreakdown = [
  {
    category: "Housing",
    amount: 1400,
    percentage: 35
  },
  {
    category: "Food",
    amount: 550,
    percentage: 14
  },
  {
    category: "Transportation",
    amount: 350,
    percentage: 9
  },
  {
    category: "Entertainment",
    amount: 300,
    percentage: 8
  },
  {
    category: "Utilities",
    amount: 280,
    percentage: 7
  },
  {
    category: "Insurance",
    amount: 270,
    percentage: 7
  },
  {
    category: "Healthcare",
    amount: 220,
    percentage: 6
  },
  {
    category: "Other",
    amount: 580,
    percentage: 14
  }
];

export const notifications = [
  {
    id: "n1",
    title: "Bill Due Tomorrow",
    message: "Your electricity bill of $75.20 is due tomorrow",
    date: "2023-04-04",
    type: "warning",
    read: false
  },
  {
    id: "n2",
    title: "Budget Exceeded",
    message: "You've exceeded your food budget by $23.50",
    date: "2023-04-02",
    type: "warning",
    read: false
  },
  {
    id: "n3",
    title: "Payment Received",
    message: "You received $450 from freelance work",
    date: "2023-04-01",
    type: "success",
    read: false
  },
  {
    id: "n4",
    title: "New Feature Available",
    message: "Try our new budget planning tools",
    date: "2023-03-30",
    type: "info",
    read: true
  }
];

export const dashboardSummary = {
  balance: 4700,
  totalIncome: 3950,
  totalExpenses: 2350,
  upcomingExpenses: 450,
  savingsGoalProgress: 8500,
  savingsGoalTarget: 15000
};
