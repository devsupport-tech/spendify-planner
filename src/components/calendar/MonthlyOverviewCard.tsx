
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Expense } from "@/lib/types";
import { formatCurrency } from "@/lib/formatters";
import { format } from "date-fns";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { CalendarExpenseService } from "./CalendarExpenseService";

interface MonthlyOverviewCardProps {
  monthDisplayed: Date;
  expenses: Expense[];
}

export function MonthlyOverviewCard({ monthDisplayed, expenses }: MonthlyOverviewCardProps) {
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const paidExpenses = expenses.filter(e => e.isPaid);
  const unpaidExpenses = expenses.filter(e => !e.isPaid);
  
  const totalPaid = paidExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalUnpaid = unpaidExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  // Get previous month's data for comparison
  const previousMonth = new Date(monthDisplayed);
  previousMonth.setMonth(monthDisplayed.getMonth() - 1);
  const prevMonthExpenses = CalendarExpenseService.getExpensesForMonth([], previousMonth);
  const prevMonthTotal = prevMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  // Calculate percentage change
  const percentChange = prevMonthTotal > 0
    ? ((totalSpent - prevMonthTotal) / prevMonthTotal) * 100
    : 0;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{format(monthDisplayed, "MMMM yyyy")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Total Expenses</div>
          <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
          {prevMonthTotal > 0 && (
            <div className="flex items-center text-xs">
              <span className={`flex items-center ${percentChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {percentChange > 0 
                  ? <ArrowUpRight className="mr-1 h-3 w-3" /> 
                  : <ArrowDownRight className="mr-1 h-3 w-3" />}
                {Math.abs(percentChange).toFixed(1)}%
              </span>
              <span className="ml-1 text-muted-foreground">
                vs previous month
              </span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Paid</div>
            <div className="text-lg font-medium">{formatCurrency(totalPaid)}</div>
            <div className="text-xs text-muted-foreground">{paidExpenses.length} expenses</div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">Unpaid</div>
            <div className="text-lg font-medium">{formatCurrency(totalUnpaid)}</div>
            <div className="text-xs text-muted-foreground">{unpaidExpenses.length} expenses</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
