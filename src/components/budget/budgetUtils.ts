
import { BudgetGoal } from "@/lib/types";

export type SortOption = "category" | "amount" | "percentage" | "remaining";

// Sample budget goals for demonstration
export const sampleBudgetGoals: BudgetGoal[] = [
  {
    id: "1",
    category: "Housing",
    amount: 1200,
    current: 1200,
    period: "monthly",
    type: "personal"
  },
  {
    id: "2",
    category: "Food",
    amount: 500,
    current: 350,
    period: "monthly",
    type: "personal"
  },
  {
    id: "3",
    category: "Entertainment",
    amount: 200,
    current: 150,
    period: "monthly",
    type: "personal"
  },
  {
    id: "4",
    category: "Transportation",
    amount: 300,
    current: 275,
    period: "monthly",
    type: "personal"
  },
  {
    id: "5",
    category: "Marketing",
    amount: 600,
    current: 450,
    period: "monthly",
    type: "business"
  },
  {
    id: "6",
    category: "Office Supplies",
    amount: 150,
    current: 180,
    period: "monthly",
    type: "business"
  }
];

// Filter budget goals by period
export const filterBudgetGoalsByPeriod = (goals: BudgetGoal[], period: "weekly" | "monthly" | "yearly"): BudgetGoal[] => {
  return goals.filter(goal => goal.period === period);
};

// Sort budget goals based on different criteria
export const sortBudgetGoals = (goals: BudgetGoal[], sortBy: SortOption, sortOrder: "asc" | "desc"): BudgetGoal[] => {
  const sortedGoals = [...goals];
  
  switch (sortBy) {
    case "category":
      sortedGoals.sort((a, b) => a.category.localeCompare(b.category));
      break;
    case "amount":
      sortedGoals.sort((a, b) => a.amount - b.amount);
      break;
    case "percentage":
      sortedGoals.sort((a, b) => {
        const percentageA = (a.current / a.amount) * 100;
        const percentageB = (b.current / b.amount) * 100;
        return percentageA - percentageB;
      });
      break;
    case "remaining":
      sortedGoals.sort((a, b) => {
        const remainingA = a.amount - a.current;
        const remainingB = b.amount - b.current;
        return remainingA - remainingB;
      });
      break;
    default:
      break;
  }
  
  return sortOrder === "asc" ? sortedGoals : sortedGoals.reverse();
};

// Calculate budget summary metrics
export const calculateBudgetSummary = (goals: BudgetGoal[]) => {
  const totalBudget = goals.reduce((sum, goal) => sum + goal.amount, 0);
  const totalSpent = goals.reduce((sum, goal) => sum + goal.current, 0);
  const overBudgetGoals = goals.filter(goal => goal.current > goal.amount);
  
  return {
    totalBudget,
    totalSpent,
    overBudgetCount: overBudgetGoals.length,
    overBudgetAmount: overBudgetGoals.reduce((sum, goal) => sum + (goal.current - goal.amount), 0)
  };
};
