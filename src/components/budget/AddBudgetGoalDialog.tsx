
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlusCircle, User, Briefcase } from "lucide-react";
import { BudgetGoal } from "@/lib/types";

interface AddBudgetGoalDialogProps {
  onAddGoal: (goal: BudgetGoal) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialGoal: BudgetGoal | null;
}

export function AddBudgetGoalDialog({ onAddGoal, open, onOpenChange, initialGoal }: AddBudgetGoalDialogProps) {
  const [category, setCategory] = useState<string>(initialGoal?.category || 'Food');
  const [amount, setAmount] = useState<string>(initialGoal ? String(initialGoal.amount) : '');
  const [current, setCurrent] = useState<string>(initialGoal ? String(initialGoal.current) : '');
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>(initialGoal?.period || 'monthly');
  const [type, setType] = useState<'personal' | 'business'>(initialGoal?.type || 'personal');
  const isEditing = !!initialGoal;

  useEffect(() => {
    if (initialGoal) {
      setCategory(initialGoal.category);
      setAmount(String(initialGoal.amount));
      setCurrent(String(initialGoal.current));
      setPeriod(initialGoal.period);
      setType(initialGoal.type);
    } else {
      // Reset form when not editing
      setCategory('Food');
      setAmount('');
      setCurrent('');
      setPeriod('monthly');
      setType('personal');
    }
  }, [initialGoal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const goal: BudgetGoal = {
      id: initialGoal?.id || String(Math.random().toString(36).substr(2, 9)),
      category,
      amount: parseFloat(amount),
      current: parseFloat(current || '0'),
      period,
      type,
    };
    
    onAddGoal(goal);
    onOpenChange(false);
    
    if (!initialGoal) {
      // Only reset if adding new goal
      setCategory('Food');
      setAmount('');
      setCurrent('');
    }
  };

  const personalCategories = [
    'Housing', 
    'Transportation', 
    'Food', 
    'Utilities', 
    'Insurance', 
    'Healthcare', 
    'Personal', 
    'Entertainment', 
    'Education', 
    'Debt',
    'Other'
  ];

  const businessCategories = [
    'Marketing', 
    'Operations', 
    'Salaries', 
    'Technology', 
    'Travel', 
    'Office', 
    'Professional', 
    'Equipment',
    'Taxes',
    'Other'
  ];

  const trigger = (
    <Button>
      <PlusCircle className="mr-2 h-4 w-4" />
      New Budget Goal
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!isEditing && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Budget Goal' : 'Add New Budget Goal'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edit your existing budget goal details.' 
              : 'Create a new budget goal to track your spending.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <div className="col-span-3">
                <Select 
                  value={category} 
                  onValueChange={setCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {(type === 'personal' ? personalCategories : businessCategories).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <div className="col-span-3">
                <RadioGroup 
                  className="flex space-x-4"
                  value={type}
                  onValueChange={(value: 'personal' | 'business') => {
                    setType(value);
                    // Reset category when changing type
                    setCategory(value === 'personal' ? 'Food' : 'Marketing');
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="personal" id="personal" />
                    <Label htmlFor="personal" className="flex items-center">
                      <User className="mr-1 h-4 w-4" />
                      Personal
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="business" id="business" />
                    <Label htmlFor="business" className="flex items-center">
                      <Briefcase className="mr-1 h-4 w-4" />
                      Business
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Budget
              </Label>
              <div className="col-span-3 relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                  className="pl-8"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
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
                  step="0.01"
                  placeholder="0.00"
                  className="pl-8"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="period" className="text-right">
                Period
              </Label>
              <div className="col-span-3">
                <Select 
                  value={period} 
                  onValueChange={(value: 'weekly' | 'monthly' | 'yearly') => setPeriod(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {isEditing ? 'Save Changes' : 'Create Goal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
