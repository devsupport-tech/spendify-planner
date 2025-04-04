
import { Badge } from "@/components/ui/badge";
import { format, isSameDay, isSameMonth } from "date-fns";
import { Expense } from "@/lib/types";
import { formatCurrency } from "@/lib/formatters";

interface ExpenseCalendarDayProps {
  day: Date;
  monthDisplayed: Date;
  expenses: Expense[];
  isSelected?: boolean;
}

export function ExpenseCalendarDay({ day, monthDisplayed, expenses, isSelected }: ExpenseCalendarDayProps) {
  const isToday = isSameDay(day, new Date());
  const isCurrentMonth = isSameMonth(day, monthDisplayed);
  
  // Calculate daily total
  const dayTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Determine if there are unpaid expenses for this day
  const hasUnpaidExpenses = expenses.some(expense => !expense.isPaid);
  
  return (
    <div
      className={`relative w-full h-full min-h-[40px] p-2 flex flex-col 
                  ${!isCurrentMonth ? 'opacity-40' : ''}`}
    >
      <div className={`text-center ${isToday ? 'bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mx-auto' : ''}`}>
        {format(day, "d")}
      </div>
      
      {expenses.length > 0 && dayTotal > 0 && (
        <div className={`mt-1 text-xs font-medium text-center ${hasUnpaidExpenses ? 'text-destructive' : 'text-muted-foreground'}`}>
          {formatCurrency(dayTotal)}
        </div>
      )}
      
      {expenses.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
          <div className={`h-1 w-4 rounded-full ${
            hasUnpaidExpenses ? 'bg-destructive' : 'bg-primary'
          }`} />
        </div>
      )}
    </div>
  );
}
