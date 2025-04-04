
import { Expense } from "@/lib/types";
import { addDays, startOfMonth, endOfMonth, isSameDay, isSameMonth } from "date-fns";

export class CalendarExpenseService {
  // Get expenses for a specific date
  static getExpensesForDate(expenses: Expense[], date: Date): Expense[] {
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return isSameDay(expenseDate, date);
    });
  }

  // Get expenses for a specific month
  static getExpensesForMonth(expenses: Expense[], date: Date): Expense[] {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= start && expenseDate <= end;
    });
  }

  // Get upcoming expenses for next 7 days
  static getUpcomingExpenses(expenses: Expense[]): Expense[] {
    const today = new Date();
    const next7Days = addDays(today, 7);
    
    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return !expense.isPaid && expenseDate >= today && expenseDate <= next7Days;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // Get total expenses for a date
  static getDateTotal(expenses: Expense[], date: Date): number {
    return CalendarExpenseService.getExpensesForDate(expenses, date)
      .reduce((sum, expense) => sum + expense.amount, 0);
  }
}
