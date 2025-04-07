
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, Filter, Plus, Search, X, User, Briefcase } from "lucide-react";
import { expenses } from "@/lib/data";
import { Expense, ExpenseCategory, BusinessCategory } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function ExpenseTracker() {
  const [expenseType, setExpenseType] = useState<'all' | 'personal' | 'business'>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [showAddExpense, setShowAddExpense] = useState(false);
  
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    amount: 0,
    description: "",
    date: format(new Date(), 'yyyy-MM-dd'), // Convert Date to string format
    isPaid: false,
    isRecurring: false,
    category: "Other",
    type: "personal",
  });

  const filteredExpenses = expenses.filter((expense) => {
    if (expenseType !== 'all' && expense.type !== expenseType) {
      return false;
    }
    
    if (
      searchQuery &&
      !expense.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    if (selectedCategory && expense.category !== selectedCategory) {
      return false;
    }
    
    if (dateRange.from && new Date(expense.date) < dateRange.from) {
      return false;
    }
    
    if (dateRange.to) {
      const endDate = new Date(dateRange.to);
      endDate.setHours(23, 59, 59, 999);
      if (new Date(expense.date) > endDate) {
        return false;
      }
    }
    
    return true;
  });

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const personalTotal = filteredExpenses
    .filter(expense => expense.type === 'personal')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const businessTotal = filteredExpenses
    .filter(expense => expense.type === 'business')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const handleExpenseChange = (field: string, value: any) => {
    // Handle date specially to convert Date objects to string format
    if (field === 'date' && value instanceof Date) {
      value = format(value, 'yyyy-MM-dd');
    }
    
    setNewExpense({
      ...newExpense,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    toast({
      title: "Expense Added",
      description: `${newExpense.description} - ${formatCurrency(newExpense.amount || 0)}`,
    });
    
    setShowAddExpense(false);
    setNewExpense({
      amount: 0,
      description: "",
      date: new Date(),
      isPaid: false,
      isRecurring: false,
      category: "Other",
      type: "personal",
    });
  };

  const getUniqueCategories = () => {
    const categories = new Set<string>();
    expenses.forEach((expense) => {
      categories.add(expense.category);
    });
    return Array.from(categories);
  };

  const personalCategories: ExpenseCategory[] = [
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

  const businessCategories: BusinessCategory[] = [
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expense Tracker</h1>
          <p className="text-muted-foreground">
            Track and manage your expenses
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAddExpense(true)} className="gap-1">
          <Plus size={16} />
          <span>Add Expense</span>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
            <p className="text-xs text-muted-foreground">
              From {filteredExpenses.length} transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Personal Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(personalTotal)}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((personalTotal / totalAmount) * 100) || 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Business Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(businessTotal)}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((businessTotal / totalAmount) * 100) || 0}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border rounded-lg p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between mb-4">
          <Tabs 
            value={expenseType} 
            onValueChange={(value) => setExpenseType(value as 'all' | 'personal' | 'business')}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search expenses..."
                className="pl-8 w-full sm:w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
              <Filter size={16} />
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {getUniqueCategories().map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? format(dateRange.from, "PPP") : <span>Start date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.to && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to ? format(dateRange.to, "PPP") : <span>End date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="flex items-end gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setSelectedCategory("");
                  setDateRange({});
                  setSearchQuery("");
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <X size={36} className="mb-2" />
                      <p>No expenses found</p>
                      <p className="text-sm">Try adjusting your filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      <div className="font-medium">{expense.description}</div>
                      {expense.project && (
                        <div className="text-xs text-muted-foreground">
                          Project: {expense.project}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{format(new Date(expense.date), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{expense.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={cn(
                          expense.type === 'personal' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        )}
                      >
                        {expense.type === 'personal' ? 'Personal' : 'Business'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-medium">
                        {formatCurrency(expense.amount)}
                      </span>
                      {expense.isRecurring && (
                        <div className="text-xs text-muted-foreground">
                          Recurring
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Enter the details of your expense. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <div className="col-span-3 relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="0.00"
                  className="pl-8"
                  value={newExpense.amount || ''}
                  onChange={(e) => handleExpenseChange('amount', parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                placeholder="Enter description"
                className="col-span-3"
                value={newExpense.description}
                onChange={(e) => handleExpenseChange('description', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newExpense.date ? format(new Date(newExpense.date), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newExpense.date ? new Date(newExpense.date) : undefined}
                      onSelect={(date) => handleExpenseChange('date', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Type</Label>
              <div className="col-span-3">
                <RadioGroup 
                  className="flex space-x-4"
                  value={newExpense.type}
                  onValueChange={(value: 'personal' | 'business') => handleExpenseChange('type', value)}
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
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select 
                value={newExpense.category as string}
                onValueChange={(value) => handleExpenseChange('category', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {newExpense.type === 'personal' ? (
                    personalCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))
                  ) : (
                    businessCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            {newExpense.type === 'business' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="project" className="text-right">
                    Project
                  </Label>
                  <Input
                    id="project"
                    placeholder="Project name (optional)"
                    className="col-span-3"
                    value={newExpense.project || ''}
                    onChange={(e) => handleExpenseChange('project', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">
                    Department
                  </Label>
                  <Input
                    id="department"
                    placeholder="Department name (optional)"
                    className="col-span-3"
                    value={newExpense.department || ''}
                    onChange={(e) => handleExpenseChange('department', e.target.value)}
                  />
                </div>
              </>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isPaid" className="text-right">
                Paid
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="isPaid"
                  checked={newExpense.isPaid}
                  onCheckedChange={(checked) => handleExpenseChange('isPaid', checked)}
                />
                <Label htmlFor="isPaid">
                  {newExpense.isPaid ? 'Paid' : 'Unpaid'}
                </Label>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isRecurring" className="text-right">
                Recurring
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="isRecurring"
                  checked={newExpense.isRecurring}
                  onCheckedChange={(checked) => handleExpenseChange('isRecurring', checked)}
                />
                <Label htmlFor="isRecurring">
                  {newExpense.isRecurring ? 'Yes' : 'No'}
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit"
              onClick={handleSubmit}
              disabled={
                !newExpense.description || 
                !newExpense.amount || 
                newExpense.amount <= 0 || 
                !newExpense.date
              }
            >
              Save Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ExpenseTracker;
