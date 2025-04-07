
import { Expense } from "@/lib/types";
import { isSameDay, isWithinInterval, startOfMonth, endOfMonth, addDays } from "date-fns";

export class CalendarExpenseService {
  // Get expenses for specific date
  static getExpensesForDate(expenses: Expense[], date: Date): Expense[] {
    return expenses.filter(expense => isSameDay(new Date(expense.date), date));
  }
  
  // Get expenses for current month
  static getExpensesForMonth(expenses: Expense[], month: Date): Expense[] {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
    });
  }
  
  // Get upcoming expenses (next 7 days)
  static getUpcomingExpenses(expenses: Expense[]): Expense[] {
    const now = new Date();
    const next7Days = addDays(now, 7);
    
    return expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return (
          !expense.isPaid && 
          isWithinInterval(expenseDate, { start: now, end: next7Days })
        );
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  
  // Get expenses trend by day for a month
  static getExpenseTrendByDay(expenses: Expense[], month: Date): Record<number, number> {
    const monthlyExpenses = this.getExpensesForMonth(expenses, month);
    const trendByDay: Record<number, number> = {};
    
    // Initialize all days
    const daysInMonth = endOfMonth(month).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      trendByDay[i] = 0;
    }
    
    // Sum expenses by day
    monthlyExpenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      const day = expenseDate.getDate();
      trendByDay[day] = (trendByDay[day] || 0) + expense.amount;
    });
    
    return trendByDay;
  }
}
