import { useState } from "react";
import { PlusCircle, SortAsc, SortDesc } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BudgetGoal } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { BudgetGoalCard } from "@/components/budget/BudgetGoalCard";
import { AddBudgetGoalDialog } from "@/components/budget/AddBudgetGoalDialog";
import { 
  sampleBudgetGoals, 
  filterBudgetGoalsByPeriod, 
  sortBudgetGoals, 
  SortOption,
  calculateBudgetSummary 
} from "@/components/budget/budgetUtils";
import { formatCurrency } from "@/lib/formatters";

export function BudgetTracker() {
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>(sampleBudgetGoals);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activePeriod, setActivePeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [sortBy, setSortBy] = useState<SortOption>('category');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [editingGoal, setEditingGoal] = useState<BudgetGoal | null>(null);

  const handleAddGoal = (goal: BudgetGoal) => {
    setBudgetGoals([...budgetGoals, goal]);
  };

  const handleDeleteGoal = (id: string) => {
    setBudgetGoals(budgetGoals.filter(goal => goal.id !== id));
    toast({
      title: "Budget Goal Removed",
      description: "The budget goal has been removed successfully."
    });
  };

  const handleEditGoal = (goal: BudgetGoal) => {
    setEditingGoal(goal);
    setDialogOpen(true);
  };

  const handleUpdateGoal = (updatedGoal: BudgetGoal) => {
    setBudgetGoals(budgetGoals.map(goal => 
      goal.id === updatedGoal.id ? updatedGoal : goal
    ));
    setEditingGoal(null);
    toast({
      title: "Budget Goal Updated",
      description: "The budget goal has been updated successfully."
    });
  };

  const handleSortChange = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortOrder('asc');
    }
  };

  const filteredGoals = filterBudgetGoalsByPeriod(budgetGoals, activePeriod);
  const sortedGoals = sortBudgetGoals(filteredGoals, sortBy, sortOrder);
  
  const { totalBudget, totalSpent, overBudgetCount } = calculateBudgetSummary(filteredGoals);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget Tracker</h1>
          <p className="text-muted-foreground">
            Set and track your spending goals
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Select 
            value={activePeriod} 
            onValueChange={(value: 'weekly' | 'monthly' | 'yearly') => setActivePeriod(value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          
          <AddBudgetGoalDialog 
            onAddGoal={editingGoal ? handleUpdateGoal : handleAddGoal}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            initialGoal={editingGoal}
          />
        </div>
      </div>

      {filteredGoals.length > 0 && (
        <Card className="bg-muted/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Budget Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-semibold">{formatCurrency(totalBudget)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-semibold">{formatCurrency(totalSpent)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-semibold">{Math.round((totalSpent / totalBudget) * 100)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredGoals.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleSortChange('category')}
            className={sortBy === 'category' ? 'bg-muted' : ''}
          >
            Category
            {sortBy === 'category' && (
              sortOrder === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleSortChange('amount')}
            className={sortBy === 'amount' ? 'bg-muted' : ''}
          >
            Budget Amount
            {sortBy === 'amount' && (
              sortOrder === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleSortChange('percentage')}
            className={sortBy === 'percentage' ? 'bg-muted' : ''}
          >
            Progress
            {sortBy === 'percentage' && (
              sortOrder === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleSortChange('remaining')}
            className={sortBy === 'remaining' ? 'bg-muted' : ''}
          >
            Remaining
            {sortBy === 'remaining' && (
              sortOrder === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
            )}
          </Button>
        </div>
      )}

      {filteredGoals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full p-3 bg-muted">
              <PlusCircle className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No Budget Goals</h3>
            <p className="text-sm text-muted-foreground text-center mt-2">
              You haven't set any {activePeriod} budget goals yet. Click the "New Budget Goal" button to get started.
            </p>
            <Button 
              className="mt-4" 
              onClick={() => {
                setEditingGoal(null);
                setDialogOpen(true);
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Budget
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedGoals.map((goal) => (
            <BudgetGoalCard 
              key={goal.id} 
              goal={goal} 
              onDelete={handleDeleteGoal} 
              onEdit={handleEditGoal}
              onClick={() => {
                toast({
                  title: `${goal.category} Budget`,
                  description: `${formatCurrency(goal.current)} spent of ${formatCurrency(goal.amount)} budget`,
                });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BudgetTracker;
