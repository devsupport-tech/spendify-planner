
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Expense } from "@/lib/types";
import { formatCurrency } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, FileEdit } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ExpenseDayDetailsProps {
  date?: Date;
  expenses: Expense[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExpenseDayDetails({ date, expenses, open, onOpenChange }: ExpenseDayDetailsProps) {
  const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  
  if (!date) return null;
  
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const filteredExpenses = expenses.filter(expense => {
    if (filter === 'all') return true;
    if (filter === 'paid') return expense.isPaid;
    if (filter === 'unpaid') return !expense.isPaid;
    return true;
  });
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Expenses for {format(date, "MMMM d, yyyy")}</span>
            <span className="text-sm font-normal text-muted-foreground">
              {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        {expenses.length === 0 ? (
          <div className="flex flex-col items-center py-6">
            <FileEdit className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No expenses for this date</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                >
                  All
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'paid' ? 'default' : 'outline'}
                  onClick={() => setFilter('paid')}
                >
                  Paid
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'unpaid' ? 'default' : 'outline'}
                  onClick={() => setFilter('unpaid')}
                >
                  Unpaid
                </Button>
              </div>
              <p className="text-sm font-medium">
                Total: <span className="font-bold">{formatCurrency(totalAmount)}</span>
              </p>
            </div>
          
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {filteredExpenses.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">No matching expenses</p>
              ) : (
                filteredExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                        expense.isPaid 
                          ? "bg-green-100 text-green-600" 
                          : "bg-orange-100 text-orange-600"
                      )}>
                        {expense.isPaid 
                          ? <Check className="h-4 w-4" /> 
                          : <Clock className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{expense.category}</Badge>
                          <Badge
                            variant="secondary"
                            className={cn(
                              expense.type === "personal" 
                                ? "bg-blue-100 text-blue-800" 
                                : "bg-purple-100 text-purple-800"
                            )}
                          >
                            {expense.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <p className="font-semibold">{formatCurrency(expense.amount)}</p>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
