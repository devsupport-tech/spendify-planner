
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, Download, Filter, PieChart, BarChart as BarChartIcon, TrendingUp } from "lucide-react";
import { expenses } from "@/lib/data";
import { Expense } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPlePie, Pie, Cell, LineChart, Line } from "recharts";
import { addMonths, format, subMonths } from "date-fns";
import { formatCurrency } from "@/lib/formatters";

// Define chart colors
const COLORS = ['#4F46E5', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6', '#F43F5E', '#06B6D4', '#84CC16', '#6366F1', '#D946EF', '#14B8A6', '#F97316'];

export function ExpenseAnalytics() {
  const [timeRange, setTimeRange] = useState<'1m' | '3m' | '6m' | '1y'>('3m');
  const [chartType, setChartType] = useState<'overview' | 'categories' | 'trends'>('overview');
  const [expenseType, setExpenseType] = useState<'all' | 'personal' | 'business'>('all');
  
  // Filter expenses based on time range and type
  const filterExpenses = (): Expense[] => {
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case '1m':
        startDate = subMonths(now, 1);
        break;
      case '3m':
        startDate = subMonths(now, 3);
        break;
      case '6m':
        startDate = subMonths(now, 6);
        break;
      case '1y':
        startDate = subMonths(now, 12);
        break;
      default:
        startDate = subMonths(now, 3);
    }
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const matchesType = expenseType === 'all' || expense.type === expenseType;
      return expenseDate >= startDate && expenseDate <= now && matchesType;
    });
  };
  
  const filteredExpenses = filterExpenses();
  
  // Calculate total expenses
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate category breakdown
  const getCategoryBreakdown = () => {
    const categories: Record<string, number> = {};
    
    filteredExpenses.forEach(expense => {
      if (categories[expense.category]) {
        categories[expense.category] += expense.amount;
      } else {
        categories[expense.category] = expense.amount;
      }
    });
    
    return Object.keys(categories).map(category => ({
      name: category,
      value: categories[category],
      percentage: Math.round((categories[category] / totalExpenses) * 100)
    }));
  };
  
  const categoryData = getCategoryBreakdown();
  
  // Calculate monthly trends
  const getMonthlyData = () => {
    const months: Record<string, { expenses: number, count: number }> = {};
    const now = new Date();
    
    // Initialize with the last 6 months
    for (let i = 0; i < 6; i++) {
      const date = subMonths(now, i);
      const monthKey = format(date, 'MMM yyyy');
      months[monthKey] = { expenses: 0, count: 0 };
    }
    
    // Populate with actual data
    filteredExpenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthKey = format(date, 'MMM yyyy');
      
      if (months[monthKey]) {
        months[monthKey].expenses += expense.amount;
        months[monthKey].count += 1;
      }
    });
    
    // Convert to array and sort chronologically
    return Object.keys(months)
      .map(month => ({
        month,
        amount: months[month].expenses,
        count: months[month].count,
        average: months[month].count > 0 ? Math.round(months[month].expenses / months[month].count) : 0
      }))
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA.getTime() - dateB.getTime();
      });
  };
  
  const monthlyData = getMonthlyData();
  
  // Calculate business vs personal split
  const getBusinessVsPersonal = () => {
    const personal = filteredExpenses
      .filter(expense => expense.type === 'personal')
      .reduce((sum, expense) => sum + expense.amount, 0);
      
    const business = filteredExpenses
      .filter(expense => expense.type === 'business')
      .reduce((sum, expense) => sum + expense.amount, 0);
      
    return [
      { name: 'Personal', value: personal },
      { name: 'Business', value: business }
    ];
  };
  
  const businessVsPersonal = getBusinessVsPersonal();
  
  // Get top expenses
  const getTopExpenses = () => {
    return [...filteredExpenses]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  };
  
  const topExpenses = getTopExpenses();
  
  // Format percentage change
  const formatPercentChange = (current: number, previous: number) => {
    if (previous === 0) return "+100%";
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };
  
  // Calculate month-over-month change
  const calculateMonthlyChange = () => {
    if (monthlyData.length < 2) return { amount: 0, percentage: "+0%" };
    
    const currentMonth = monthlyData[monthlyData.length - 1].amount;
    const previousMonth = monthlyData[monthlyData.length - 2].amount;
    const change = currentMonth - previousMonth;
    const percentage = formatPercentChange(currentMonth, previousMonth);
    
    return { amount: change, percentage };
  };
  
  const monthlyChange = calculateMonthlyChange();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">
            Insights and trends for your financial data
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select 
            value={timeRange} 
            onValueChange={(value) => setTimeRange(value as '1m' | '3m' | '6m' | '1y')}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={expenseType} 
            onValueChange={(value) => setExpenseType(value as 'all' | 'personal' | 'business')}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Expense Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Expenses</SelectItem>
              <SelectItem value="personal">Personal Only</SelectItem>
              <SelectItem value="business">Business Only</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <div className="flex items-center text-xs">
              <span className={`flex items-center ${monthlyChange.amount >= 0 ? 'text-destructive' : 'text-emerald-500'}`}>
                {monthlyChange.amount >= 0 ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
                {monthlyChange.percentage}
              </span>
              <span className="ml-1 text-muted-foreground">
                vs previous period
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalExpenses / (filteredExpenses.length || 1))}
            </div>
            <p className="text-xs text-muted-foreground">
              From {filteredExpenses.length} transactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalExpenses / (monthlyData.filter(m => m.amount > 0).length || 1))}
            </div>
            <p className="text-xs text-muted-foreground">
              Per month over selected period
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Tabs defaultValue="overview" onValueChange={(value) => setChartType(value as 'overview' | 'categories' | 'trends')}>
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal vs Business</CardTitle>
                  <CardDescription>Expense distribution by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPlePie>
                        <Pie
                          data={businessVsPersonal}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          innerRadius={60}
                          paddingAngle={2}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {businessVsPersonal.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      </RechartsPlePie>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="flex justify-between mt-4 text-sm">
                    <div>
                      <div className="font-medium">Personal Expenses</div>
                      <div className="text-lg font-bold">{formatCurrency(businessVsPersonal[0].value)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">Business Expenses</div>
                      <div className="text-lg font-bold">{formatCurrency(businessVsPersonal[1].value)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Expenses</CardTitle>
                  <CardDescription>Your highest expenses in this period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topExpenses.map((expense) => (
                      <div key={expense.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{expense.description}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{expense.category}</Badge>
                            <Badge variant={expense.type === 'personal' ? 'secondary' : 'default'} className="capitalize">
                              {expense.type}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatCurrency(expense.amount)}</div>
                          <div className="text-xs mt-1 text-muted-foreground">
                            {format(new Date(expense.date), "MMM d, yyyy")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
                <CardDescription>Breakdown of your expenses by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="h-[300px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPlePie>
                        <Pie
                          data={categoryData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          paddingAngle={1}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      </RechartsPlePie>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-3">
                    {categoryData
                      .sort((a, b) => b.value - a.value)
                      .map((category, index) => (
                        <div key={index} className="flex items-center justify-between px-2 py-1.5">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span>{category.percentage}%</span>
                            <span className="font-medium">{formatCurrency(category.value)}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>How your expenses have changed over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                      />
                      <YAxis 
                        tickFormatter={(value) => `$${value}`}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                      />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value as number), 'Amount']}
                        labelFormatter={(label) => `Month: ${label}`}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          border: 'none'
                        }}
                      />
                      <Bar 
                        dataKey="amount" 
                        fill="#4F46E5"
                        barSize={40}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {monthlyData.slice(-3).reverse().map((data, index) => (
                    <Card key={index} className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="text-sm font-medium">{data.month}</div>
                        <div className="text-lg font-bold mt-1">{formatCurrency(data.amount)}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {data.count} transactions
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ExpenseAnalytics;
