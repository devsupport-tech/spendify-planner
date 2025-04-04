import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  CreditCard, 
  Calendar, 
  ArrowRight, 
  BanknoteIcon, 
  Coins, 
  Landmark, 
  DollarSign,
  PlusCircle
} from "lucide-react";
import { expenses, payments, monthlyTrends } from "@/lib/data";
import { Expense, Payment } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { addMonths, format, startOfMonth, endOfMonth, isWithinInterval, subMonths } from "date-fns";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

export function FinanceDashboard({ onCardClick }) {
  const [timeRange, setTimeRange] = useState<'1m' | '3m' | '6m' | '1y'>('1m');
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const { toast } = useToast();
  
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    category: 'Food',
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'personal',
  });

  const [paymentForm, setPaymentForm] = useState({
    description: '',
    amount: '',
    category: 'Salary',
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'personal',
  });
  
  const getDateRange = () => {
    const endDate = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case '1m':
        startDate = subMonths(endDate, 1);
        break;
      case '3m':
        startDate = subMonths(endDate, 3);
        break;
      case '6m':
        startDate = subMonths(endDate, 6);
        break;
      case '1y':
        startDate = subMonths(endDate, 12);
        break;
      default:
        startDate = subMonths(endDate, 1);
    }
    
    return { startDate, endDate };
  };

  const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExpenseForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Expense Added",
      description: `$${expenseForm.amount} for ${expenseForm.description}`,
    });
    setShowExpenseDialog(false);
    setExpenseForm({
      description: '',
      amount: '',
      category: 'Food',
      date: format(new Date(), 'yyyy-MM-dd'),
      type: 'personal',
    });
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Payment Added",
      description: `$${paymentForm.amount} from ${paymentForm.description}`,
    });
    setShowPaymentDialog(false);
    setPaymentForm({
      description: '',
      amount: '',
      category: 'Salary',
      date: format(new Date(), 'yyyy-MM-dd'),
      type: 'personal',
    });
  };
  
  const { startDate, endDate } = getDateRange();
  
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return isWithinInterval(expenseDate, { start: startDate, end: endDate });
  });
  
  const filteredPayments = payments.filter(payment => {
    const paymentDate = new Date(payment.date);
    return isWithinInterval(paymentDate, { start: startDate, end: endDate });
  });
  
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncome = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const balance = totalIncome - totalExpenses;
  
  const personalExpenses = filteredExpenses
    .filter(expense => expense.type === 'personal')
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const businessExpenses = filteredExpenses
    .filter(expense => expense.type === 'business')
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const personalIncome = filteredPayments
    .filter(payment => payment.type === 'personal')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const businessIncome = filteredPayments
    .filter(payment => payment.type === 'business')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const upcomingExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      const now = new Date();
      return !expense.isPaid && expenseDate > now && expenseDate <= addMonths(now, 1);
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);
  
  const upcomingPayments = payments
    .filter(payment => {
      const paymentDate = new Date(payment.date);
      const now = new Date();
      return !payment.isReceived && paymentDate > now && paymentDate <= addMonths(now, 1);
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);
  
  const generateMonthlyData = () => {
    const data = [];
    const months = timeRange === '1m' ? 1 : timeRange === '3m' ? 3 : timeRange === '6m' ? 6 : 12;
    
    for (let i = months - 1; i >= 0; i--) {
      const currentMonth = subMonths(new Date(), i);
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      
      const monthlyExpenses = expenses
        .filter(expense => {
          const date = new Date(expense.date);
          return isWithinInterval(date, { start: monthStart, end: monthEnd });
        })
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      const monthlyIncome = payments
        .filter(payment => {
          const date = new Date(payment.date);
          return isWithinInterval(date, { start: monthStart, end: monthEnd });
        })
        .reduce((sum, payment) => sum + payment.amount, 0);
      
      data.push({
        month: format(currentMonth, 'MMM'),
        expenses: monthlyExpenses,
        income: monthlyIncome,
        profit: monthlyIncome - monthlyExpenses
      });
    }
    
    return data;
  };
  
  const monthlyData = generateMonthlyData();
  
  const expenseCategoryData = () => {
    const categories: Record<string, number> = {};
    
    filteredExpenses.forEach(expense => {
      if (categories[expense.category]) {
        categories[expense.category] += expense.amount;
      } else {
        categories[expense.category] = expense.amount;
      }
    });
    
    return Object.keys(categories)
      .map(category => ({
        name: category,
        value: categories[category]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };
  
  const incomeCategoryData = () => {
    const categories: Record<string, number> = {};
    
    filteredPayments.forEach(payment => {
      if (categories[payment.category]) {
        categories[payment.category] += payment.amount;
      } else {
        categories[payment.category] = payment.amount;
      }
    });
    
    return Object.keys(categories)
      .map(category => ({
        name: category,
        value: categories[category]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your personal and business finances
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showExpenseDialog} onOpenChange={setShowExpenseDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <ArrowDownRight className="h-4 w-4 text-red-500" />
                <span>New Expense</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>
                  Enter the details of your expense below.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleExpenseSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="description" className="text-right">Description</label>
                    <input
                      id="description"
                      name="description"
                      value={expenseForm.description}
                      onChange={handleExpenseChange}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Groceries, Rent, etc."
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="amount" className="text-right">Amount ($)</label>
                    <input
                      id="amount"
                      name="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={expenseForm.amount}
                      onChange={handleExpenseChange}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="100.00"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="category" className="text-right">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={expenseForm.category}
                      onChange={handleExpenseChange}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="Food">Food</option>
                      <option value="Transport">Transportation</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Housing">Housing</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="date" className="text-right">Date</label>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      value={expenseForm.date}
                      onChange={handleExpenseChange}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="type" className="text-right">Type</label>
                    <select
                      id="type"
                      name="type"
                      value={expenseForm.type}
                      onChange={handleExpenseChange}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="personal">Personal</option>
                      <option value="business">Business</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Expense</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <ArrowUpRight className="h-4 w-4" />
                <span>New Payment</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Payment</DialogTitle>
                <DialogDescription>
                  Enter the details of your incoming payment below.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handlePaymentSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="p-description" className="text-right">Description</label>
                    <input
                      id="p-description"
                      name="description"
                      value={paymentForm.description}
                      onChange={handlePaymentChange}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Salary, Freelance, etc."
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="p-amount" className="text-right">Amount ($)</label>
                    <input
                      id="p-amount"
                      name="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={paymentForm.amount}
                      onChange={handlePaymentChange}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="1000.00"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="p-category" className="text-right">Category</label>
                    <select
                      id="p-category"
                      name="category"
                      value={paymentForm.category}
                      onChange={handlePaymentChange}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="Salary">Salary</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Investment">Investment</option>
                      <option value="Gift">Gift</option>
                      <option value="Refund">Refund</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="p-date" className="text-right">Date</label>
                    <input
                      id="p-date"
                      name="date"
                      type="date"
                      value={paymentForm.date}
                      onChange={handlePaymentChange}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="p-type" className="text-right">Type</label>
                    <select
                      id="p-type"
                      name="type"
                      value={paymentForm.type}
                      onChange={handlePaymentChange}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="personal">Personal</option>
                      <option value="business">Business</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Payment</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as '1m' | '3m' | '6m' | '1y')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card onClick={() => onCardClick('Total Income')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Income
            </CardTitle>
            <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totalIncome)}</div>
            <div className="flex items-center text-xs">
              <span className="text-muted-foreground">
                {filteredPayments.length} transactions
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card onClick={() => onCardClick('Total Expenses')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
            <div className="flex items-center text-xs">
              <span className="text-muted-foreground">
                {filteredExpenses.length} transactions
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card onClick={() => onCardClick('Net Balance')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Net Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", balance >= 0 ? "text-emerald-600" : "text-red-600")}>
              {formatCurrency(balance)}
            </div>
            <div className="flex items-center text-xs">
              <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />
              <span className="text-muted-foreground">
                {balance >= 0 ? 'Positive cash flow' : 'Negative cash flow'}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card onClick={() => onCardClick('Upcoming Due')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Due
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(upcomingExpenses.reduce((sum, expense) => sum + expense.amount, 0))}
            </div>
            <div className="flex items-center text-xs">
              <span className="text-muted-foreground">
                {upcomingExpenses.length} upcoming expenses
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4" onClick={() => onCardClick('Income vs Expenses')}>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
            <CardDescription>
              Financial overview for {format(startDate, 'MMM yyyy')} to {format(endDate, 'MMM yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value as number)}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Bar dataKey="income" fill="#10B981" name="Income" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#F43F5E" name="Expenses" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3" onClick={() => onCardClick('Personal vs Business')}>
          <CardHeader>
            <CardTitle>Personal vs Business</CardTitle>
            <CardDescription>
              Breakdown by finance type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex justify-center items-center">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="font-medium text-muted-foreground">Income</h3>
                    <div className="text-2xl font-bold mt-1">{formatCurrency(totalIncome)}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm">Personal</span>
                      </div>
                      <span className="font-medium">{formatCurrency(personalIncome)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm">Business</span>
                      </div>
                      <span className="font-medium">{formatCurrency(businessIncome)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full mt-1">
                      <div 
                        className="h-2 bg-blue-500 rounded-full" 
                        style={{ 
                          width: `${(personalIncome / (totalIncome || 1)) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="font-medium text-muted-foreground">Expenses</h3>
                    <div className="text-2xl font-bold mt-1">{formatCurrency(totalExpenses)}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm">Personal</span>
                      </div>
                      <span className="font-medium">{formatCurrency(personalExpenses)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm">Business</span>
                      </div>
                      <span className="font-medium">{formatCurrency(businessExpenses)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full mt-1">
                      <div 
                        className="h-2 bg-blue-500 rounded-full" 
                        style={{ 
                          width: `${(personalExpenses / (totalExpenses || 1)) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card onClick={() => onCardClick('Top Expense Categories')}>
          <CardHeader>
            <CardTitle>Top Expense Categories</CardTitle>
            <CardDescription>Where your money is going</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseCategoryData().map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <span>{formatCurrency(category.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card onClick={() => onCardClick('Top Income Sources')}>
          <CardHeader>
            <CardTitle>Top Income Sources</CardTitle>
            <CardDescription>Where your money is coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incomeCategoryData().map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <span>{formatCurrency(category.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card onClick={() => onCardClick('Upcoming Transactions')}>
          <CardHeader>
            <CardTitle>Upcoming Transactions</CardTitle>
            <CardDescription>Over the next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingExpenses.length === 0 && upcomingPayments.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No upcoming transactions</p>
              ) : (
                <>
                  {upcomingExpenses.slice(0, 3).map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                        <div>
                          <div className="text-sm font-medium">{expense.description}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(expense.date), "MMM d")}
                          </div>
                        </div>
                      </div>
                      <span className="text-red-600">{formatCurrency(expense.amount)}</span>
                    </div>
                  ))}
                  
                  {upcomingPayments.slice(0, 3).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                        <div>
                          <div className="text-sm font-medium">{payment.description}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(payment.date), "MMM d")}
                          </div>
                        </div>
                      </div>
                      <span className="text-emerald-600">{formatCurrency(payment.amount)}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default FinanceDashboard;
