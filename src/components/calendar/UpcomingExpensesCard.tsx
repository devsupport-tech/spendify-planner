
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Expense } from "@/lib/types";
import { formatCurrency } from "@/lib/formatters";
import { DollarSign } from "lucide-react";

interface UpcomingExpensesCardProps {
  expenses: Expense[];
}

export function UpcomingExpensesCard({ expenses }: UpcomingExpensesCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Upcoming Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {expenses.length === 0 ? (
            <p className="text-center py-2 text-sm text-muted-foreground">No upcoming expenses</p>
          ) : (
            expenses.slice(0, 3).map((expense) => (
              <div key={expense.id} className="flex items-center justify-between pb-2 border-b last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <div className="font-medium truncate max-w-[120px]">{expense.description}</div>
                    <div className="text-xs text-muted-foreground">{format(new Date(expense.date), "MMM d")}</div>
                  </div>
                </div>
                <span className="font-medium text-sm">{formatCurrency(expense.amount)}</span>
              </div>
            ))
          )}

          {expenses.length > 3 && (
            <Button variant="link" size="sm" className="w-full mt-2 text-xs">
              View all {expenses.length} upcoming expenses
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
