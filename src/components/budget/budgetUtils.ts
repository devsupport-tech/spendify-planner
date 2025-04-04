
import { BudgetGoal } from "@/lib/types";

// Sample budget goals data
export const sampleBudgetGoals: BudgetGoal[] = [
  {
    id: "bg1",
    category: "Food",
    amount: 500,
    current: 320,
    period: "monthly"
  },
  {
    id: "bg2",
    category: "Entertainment",
    amount: 200,
    current: 150,
    period: "monthly"
  },
  {
    id: "bg3",
    category: "Transportation",
    amount: 300,
    current: 250,
    period: "monthly"
  },
  {
    id: "bg4",
    category: "Marketing",
    amount: 1000,
    current: 600,
    period: "monthly"
  }
];

// Filter budget goals by period
export function filterBudgetGoalsByPeriod(
  goals: BudgetGoal[], 
  period: 'weekly' | 'monthly' | 'yearly'
): BudgetGoal[] {
  return goals.filter(goal => goal.period === period);
}

export type SortOption = 'category' | 'amount' | 'percentage' | 'remaining';

// Sort budget goals
export function sortBudgetGoals(
  goals: BudgetGoal[],
  sortBy: SortOption,
  sortOrder: 'asc' | 'desc' = 'asc'
): BudgetGoal[] {
  const sortedGoals = [...goals];
  
  sortedGoals.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      case 'amount':
        comparison = a.amount - b.amount;
        break;
      case 'percentage':
        const percentageA = (a.current / a.amount) * 100;
        const percentageB = (b.current / b.amount) * 100;
        comparison = percentageA - percentageB;
        break;
      case 'remaining':
        const remainingA = a.amount - a.current;
        const remainingB = b.amount - b.current;
        comparison = remainingA - remainingB;
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  return sortedGoals;
}

// Calculate summary statistics
export function calculateBudgetSummary(goals: BudgetGoal[]) {
  return goals.reduce((summary, goal) => {
    return {
      totalBudget: summary.totalBudget + goal.amount,
      totalSpent: summary.totalSpent + goal.current,
      overBudgetCount: summary.overBudgetCount + (goal.current > goal.amount ? 1 : 0)
    };
  }, { totalBudget: 0, totalSpent: 0, overBudgetCount: 0 });
}
