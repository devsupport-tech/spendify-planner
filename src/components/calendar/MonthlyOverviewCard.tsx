
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense } from "@/lib/types";
import { formatCurrency } from "@/lib/formatters";
import { CalendarIcon, ArrowDownRight, ArrowUpRight } from "lucide-react";

interface MonthlyOverviewCardProps {
  monthDisplayed: Date;
  expenses: Expense[];
}

export function MonthlyOverviewCard({ monthDisplayed, expenses }: MonthlyOverviewCardProps) {
  const monthlyTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const unpaidMonthlyTotal = expenses
    .filter(expense => !expense.isPaid)
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">Monthly Overview</CardTitle>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="text-2xl font-bold">{formatCurrency(monthlyTotal)}</div>
            <p className="text-xs text-muted-foreground">
              Total for {format(monthDisplayed, 'MMMM')}
            </p>
          </div>

          <div className="pt-2 flex justify-between items-center text-sm">
            <div className="flex items-center gap-1">
              <ArrowDownRight className="h-4 w-4 text-destructive" />
              <span>Unpaid:</span>
            </div>
            <span className="font-medium">{formatCurrency(unpaidMonthlyTotal)}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1">
              <ArrowUpRight className="h-4 w-4 text-primary" />
              <span>Paid:</span>
            </div>
            <span className="font-medium">{formatCurrency(monthlyTotal - unpaidMonthlyTotal)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
