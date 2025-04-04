
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Pencil } from "lucide-react";
import { BudgetGoal, ExpenseCategory, BusinessCategory } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/formatters";

interface AddBudgetGoalDialogProps {
  onAddGoal: (goal: BudgetGoal) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialGoal?: BudgetGoal | null;
}

export function AddBudgetGoalDialog({ onAddGoal, open, onOpenChange, initialGoal = null }: AddBudgetGoalDialogProps) {
  const [newGoal, setNewGoal] = useState<Partial<BudgetGoal>>({
    category: "Food",
    amount: 0,
    current: 0,
    period: "monthly"
  });

  const isEditing = !!initialGoal;

  // Update form when initialGoal changes
  useEffect(() => {
    if (initialGoal) {
      setNewGoal(initialGoal);
    } else {
      // Reset form when not editing
      setNewGoal({
        category: "Food",
        amount: 0,
        current: 0,
        period: "monthly"
      });
    }
  }, [initialGoal, open]);

  const handleInputChange = (field: keyof BudgetGoal, value: any) => {
    setNewGoal({
      ...newGoal,
      [field]: value
    });
  };

  const handleSaveGoal = () => {
    if (newGoal.category && newGoal.amount && newGoal.amount > 0) {
      const goal: BudgetGoal = {
        id: isEditing ? (initialGoal?.id || '') : uuidv4(),
        category: newGoal.category as ExpenseCategory | BusinessCategory,
        amount: newGoal.amount,
        current: newGoal.current || 0,
        period: newGoal.period as 'weekly' | 'monthly' | 'yearly'
      };

      onAddGoal(goal);
      
      if (!isEditing) {
        setNewGoal({
          category: "Food",
          amount: 0,
          current: 0,
          period: "monthly"
        });
      }
      
      onOpenChange(false);
    }
  };

  const personalCategories: ExpenseCategory[] = [
    'Housing', 'Transportation', 'Food', 'Utilities', 'Insurance', 
    'Healthcare', 'Personal', 'Entertainment', 'Education', 'Savings', 'Debt', 'Other'
  ];
  
  const businessCategories: BusinessCategory[] = [
    'Marketing', 'Operations', 'Salaries', 'Technology', 'Travel', 
    'Office', 'Professional', 'Equipment', 'Taxes', 'Other'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Budget Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Budget Goal' : 'Add Budget Goal'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update your budget goal details.' : 'Create a new budget goal to track your spending.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select 
              value={newGoal.category as string} 
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="" disabled>Personal Categories</SelectItem>
                {personalCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
                <SelectItem value="" disabled>Business Categories</SelectItem>
                {businessCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="period" className="text-right">
              Period
            </Label>
            <Select 
              value={newGoal.period as string} 
              onValueChange={(value: 'weekly' | 'monthly' | 'yearly') => handleInputChange('period', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Budget Amount
            </Label>
            <div className="col-span-3 relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                min={0}
                step={1}
                placeholder="0"
                className="pl-8"
                value={newGoal.amount || ''}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value))}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="current" className="text-right">
              Current Spent
            </Label>
            <div className="col-span-3 relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
              <Input
                id="current"
                type="number"
                min={0}
                step={1}
                placeholder="0"
                className="pl-8"
                value={newGoal.current || ''}
                onChange={(e) => handleInputChange('current', parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleSaveGoal}
            disabled={!newGoal.category || !newGoal.amount || newGoal.amount <= 0}
          >
            {isEditing ? (
              <>
                <Pencil className="mr-2 h-4 w-4" />
                Update Budget Goal
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Budget Goal
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
