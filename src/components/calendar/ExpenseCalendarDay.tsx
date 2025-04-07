
import { Expense } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";

interface ExpenseCalendarDayProps {
  day: Date;
  monthDisplayed: Date;
  expenses: Expense[];
  isSelected: boolean;
}

export function ExpenseCalendarDay({ day, monthDisplayed, expenses, isSelected }: ExpenseCalendarDayProps) {
  const dayNumber = day.getDate();
  const isThisMonth = day.getMonth() === monthDisplayed.getMonth();
  const isToday = new Date().toDateString() === day.toDateString();
  
  const totalExpenseAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const hasExpenses = expenses.length > 0;
  
  return (
    <div
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-full p-0 text-sm",
        isSelected 
          ? "bg-primary text-primary-foreground font-semibold" 
          : isToday 
            ? "bg-muted text-foreground font-semibold"
            : "",
        !isThisMonth && "text-muted-foreground",
        hasExpenses && !isSelected && "border"
      )}
    >
      <span>{dayNumber}</span>
      {hasExpenses && !isSelected && (
        <div className={cn(
          "absolute -bottom-1 left-1/2 transform -translate-x-1/2",
          "h-1.5 w-1.5 rounded-full",
          expenses.some(e => !e.isPaid) ? "bg-orange-500" : "bg-green-500"
        )} />
      )}
    </div>
  );
}
