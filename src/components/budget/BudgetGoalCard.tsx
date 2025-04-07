
import { BudgetGoal } from "@/lib/types";
import { formatCurrency } from "@/lib/formatters";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface BudgetGoalCardProps {
  goal: BudgetGoal;
  onDelete: (id: string) => void;
  onEdit: (goal: BudgetGoal) => void;
  onClick?: () => void;
}

export function BudgetGoalCard({ goal, onDelete, onEdit, onClick }: BudgetGoalCardProps) {
  const percentage = Math.round((goal.current / goal.amount) * 100);
  const isOverBudget = goal.current > goal.amount;
  const remaining = goal.amount - goal.current;
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick && onClick()}
    >
      <CardContent className="pt-6 pb-2">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium text-lg">{goal.category}</h3>
            <p className="text-sm text-muted-foreground capitalize">{goal.period}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onEdit(goal);
              }}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(goal.id);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className={isOverBudget ? "text-red-500 font-medium" : ""}>
              {percentage}%
            </span>
          </div>
          
          <Progress 
            value={isOverBudget ? 100 : percentage} 
            className={isOverBudget ? "bg-red-200" : ""}
            indicatorClassName={isOverBudget ? "bg-red-500" : undefined}
          />
          
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-muted-foreground">Spent</p>
              <p className={`text-xl font-semibold ${isOverBudget ? "text-red-500" : ""}`}>
                {formatCurrency(goal.current)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Budget</p>
              <p className="text-xl font-semibold">{formatCurrency(goal.amount)}</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/50 py-3">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-sm font-medium">
              {isOverBudget ? "Over budget:" : "Remaining:"}
            </span>
          </div>
          <span className={`font-medium ${isOverBudget ? "text-red-500" : "text-green-600"}`}>
            {formatCurrency(Math.abs(remaining))}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
