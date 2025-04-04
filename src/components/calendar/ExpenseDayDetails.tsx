
import { format } from "date-fns";
import { Expense } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ExpenseDayDetailsProps {
  date: Date | undefined;
  expenses: Expense[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExpenseDayDetails({
  date,
  expenses,
  open,
  onOpenChange,
}: ExpenseDayDetailsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Expenses for {date ? format(date, "MMMM d, yyyy") : ""}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {expenses.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No expenses for this date</p>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{expense.description}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{expense.category}</Badge>
                      {expense.type === 'business' && expense.project && (
                        <Badge variant="secondary">{expense.project}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatCurrency(expense.amount)}</div>
                    <div className="text-xs mt-1">
                      {expense.isPaid ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Unpaid</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-2 border-t mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-lg">
                    {formatCurrency(expenses.reduce((sum, exp) => sum + exp.amount, 0))}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
