
import React, { useState } from "react";
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
import { toast } from "@/hooks/use-toast";

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

export function FinanceDashboard({ onCardClick }) {
  const [timeRange, setTimeRange] = useState<'1m' | '3m' | '6m' | '1y'>('1m');
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  
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
                <span>New Income</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Income</DialogTitle>
                <DialogDescription>
                  Enter the details of your income below.
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
                      placeholder="100.00"
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
                  <Button type="submit">Add Income</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="finance-dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              From {filteredExpenses.length} transactions
            </p>
          </CardContent>
        </Card>
        <Card className="finance-dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-muted-foreground">
              From {filteredPayments.length} payments
            </p>
          </CardContent>
        </Card>
        <Card className="finance-dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
            <div className="flex items-center text-xs">
              <span className={`flex items-center ${balance >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {balance >= 0 ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
                {Math.abs(balance / (totalIncome || 1) * 100).toFixed(1)}%
              </span>
              <span className="ml-1 text-muted-foreground">
                {balance >= 0 ? 'savings' : 'deficit'} rate
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="finance-dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(upcomingExpenses.reduce((sum, expense) => sum + expense.amount, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              {upcomingExpenses.length} due in next 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-4 finance-dashboard-card">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Income vs expenses {timeRange === '1m' ? 'this month' : `for the last ${timeRange}`}</CardDescription>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
                <SelectTrigger className="h-8 w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">Last Month</SelectItem>
                  <SelectItem value="3m">Last 3 Months</SelectItem>
                  <SelectItem value="6m">Last 6 Months</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, '']}
                    contentStyle={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                    }}
                  />
                  <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" name="Profit" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-3 finance-dashboard-card">
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
            <CardDescription>Top spending categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategoryData()}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={60}
                    paddingAngle={2}
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {expenseCategoryData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="finance-dashboard-card">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Personal vs Business</CardTitle>
              <CardDescription>Expense comparison</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <p className="text-sm font-medium">Personal</p>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(personalExpenses)}</p>
                <p className="text-xs text-muted-foreground">
                  {Math.round((personalExpenses / totalExpenses) * 100)}% of total
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                  <p className="text-sm font-medium">Business</p>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(businessExpenses)}</p>
                <p className="text-xs text-muted-foreground">
                  {Math.round((businessExpenses / totalExpenses) * 100)}% of total
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between space-y-1">
                <p className="text-sm font-medium">Personal</p>
                <p className="text-sm font-medium">{Math.round((personalExpenses / totalExpenses) * 100)}%</p>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${(personalExpenses / totalExpenses) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-2">
              <div className="flex items-center justify-between space-y-1">
                <p className="text-sm font-medium">Business</p>
                <p className="text-sm font-medium">{Math.round((businessExpenses / totalExpenses) * 100)}%</p>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-purple-500"
                  style={{ width: `${(businessExpenses / totalExpenses) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 finance-dashboard-card">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest expenses and payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...filteredExpenses, ...filteredPayments]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((item, index) => {
                  const isExpense = 'isPaid' in item;
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-full",
                            isExpense 
                              ? "bg-rose-100 text-rose-600" 
                              : "bg-emerald-100 text-emerald-600"
                          )}
                        >
                          {isExpense ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(item.date), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "text-sm font-medium",
                          isExpense ? "text-rose-600" : "text-emerald-600"
                        )}>
                          {isExpense ? "-" : "+"}{formatCurrency(item.amount)}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-xs capitalize"
                        >
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="mt-4 flex justify-center">
              <Button variant="ghost" className="gap-1 text-sm">
                <span>View All Transactions</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default FinanceDashboard;
