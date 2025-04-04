
import { Trash2, ArrowUpCircle, ArrowDownCircle, Pencil } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BudgetGoal } from "@/lib/types";
import { formatCurrency } from "@/lib/formatters";

interface BudgetGoalCardProps {
  goal: BudgetGoal;
  onDelete: (id: string) => void;
  onEdit: (goal: BudgetGoal) => void;
  onClick?: () => void;
}

export function BudgetGoalCard({ goal, onDelete, onEdit, onClick }: BudgetGoalCardProps) {
  const percentage = Math.min(Math.round((goal.current / goal.amount) * 100), 100);
  const isOverBudget = goal.current > goal.amount;
  
  // Prevent propagation of button clicks to the card
  const handleEditClick = (e: React.MouseEvent, goal: BudgetGoal) => {
    e.stopPropagation();
    onEdit(goal);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDelete(id);
  };
  
  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{goal.category}</CardTitle>
            <CardDescription>{goal.period}</CardDescription>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-muted-foreground hover:text-primary"
              onClick={(e) => handleEditClick(e, goal)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-muted-foreground hover:text-destructive"
              onClick={(e) => handleDeleteClick(e, goal.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">
              {formatCurrency(goal.current)} of {formatCurrency(goal.amount)}
            </span>
            <span 
              className={`text-sm font-medium ${
                isOverBudget ? 'text-destructive' : 'text-primary'
              }`}
            >
              {percentage}%
            </span>
          </div>
          
          <Progress 
            value={percentage} 
            className={isOverBudget ? 'bg-destructive/20' : 'bg-primary/20'} 
            indicatorClassName={isOverBudget ? 'bg-destructive' : undefined}
          />
          
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-1 text-xs">
              {isOverBudget ? (
                <>
                  <ArrowUpCircle className="h-3 w-3 text-destructive" />
                  <span className="text-destructive">
                    {formatCurrency(goal.current - goal.amount)} over budget
                  </span>
                </>
              ) : (
                <>
                  <ArrowDownCircle className="h-3 w-3 text-primary" />
                  <span className="text-primary">
                    {formatCurrency(goal.amount - goal.current)} remaining
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
