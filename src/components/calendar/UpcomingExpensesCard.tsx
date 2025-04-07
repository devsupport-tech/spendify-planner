
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Expense } from "@/lib/types";
import { formatCurrency } from "@/lib/formatters";
import { format } from "date-fns";
import { ArrowRight, Calendar } from "lucide-react";

interface UpcomingExpensesCardProps {
  expenses: Expense[];
}

export function UpcomingExpensesCard({ expenses }: UpcomingExpensesCardProps) {
  const totalUpcoming = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Upcoming Expenses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Total Due</div>
          <div className="text-2xl font-bold">{formatCurrency(totalUpcoming)}</div>
          <div className="text-xs text-muted-foreground">Next 7 days</div>
        </div>
        
        <div className="space-y-3">
          {expenses.length === 0 ? (
            <p className="text-center py-2 text-muted-foreground text-sm">
              No upcoming expenses
            </p>
          ) : (
            expenses.slice(0, 3).map((expense) => (
              <div key={expense.id} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium truncate max-w-[120px]">{expense.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(expense.date), "MMM d")}
                    </p>
                  </div>
                </div>
                <p className="font-medium">{formatCurrency(expense.amount)}</p>
              </div>
            ))
          )}
        </div>
        
        {expenses.length > 3 && (
          <Button variant="ghost" size="sm" className="w-full text-xs">
            <span>View all ({expenses.length})</span>
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
