
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  DollarSign, 
  Calendar as CalendarIcon, 
  PiggyBank, 
  ArrowRight, 
  Bell, 
  Clock, 
  ChevronRight 
} from "lucide-react";
import { dashboardSummary, expenses, notifications, categoryBreakdown, monthlyTrends } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { format } from "date-fns";
import { motion } from "framer-motion";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function Dashboard() {
  const [viewMode, setViewMode] = useState<'overview' | 'spending' | 'savings'>('overview');
  
  // Get upcoming expenses (next 7 days)
  const now = new Date();
  const next7Days = new Date();
  next7Days.setDate(now.getDate() + 7);
  
  const upcomingExpenses = expenses
    .filter(exp => !exp.isPaid && new Date(exp.date) <= next7Days)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Get unread notifications
  const unreadNotifications = notifications.filter(n => !n.read).slice(0, 3);
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setViewMode(value as 'overview' | 'spending' | 'savings');
  };

  return (
    <div className="space-y-8 page-transition">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            {format(new Date(), "EEEE, MMMM do, yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1">
            <Bell size={16} />
            <span className="hidden sm:inline">Notifications</span>
          </Button>
          <Button size="sm" className="gap-1">
            <DollarSign size={16} />
            <span>Add Expense</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6" onValueChange={handleTabChange}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="spending">Spending</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(dashboardSummary.balance)}</div>
                <p className="text-xs text-muted-foreground">
                  +5.2% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Income</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(dashboardSummary.totalIncome)}</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                <ArrowDownRight className="h-4 w-4 text-rose-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(dashboardSummary.totalExpenses)}</div>
                <p className="text-xs text-muted-foreground">
                  +8.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(dashboardSummary.upcomingExpenses)}</div>
                <p className="text-xs text-muted-foreground">
                  Due in the next 7 days
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Monthly Trends */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>Income vs Expenses for the past 7 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrends}>
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
                        formatter={(value) => [`$${value}`, '']}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          border: 'none'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="income" 
                        stroke="#4F46E5" 
                        strokeWidth={3}
                        dot={{ stroke: '#4F46E5', fill: '#4F46E5', strokeWidth: 2, r: 4 }}
                        activeDot={{ stroke: '#4F46E5', fill: 'white', strokeWidth: 2, r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="expenses" 
                        stroke="#F43F5E" 
                        strokeWidth={3}
                        dot={{ stroke: '#F43F5E', fill: '#F43F5E', strokeWidth: 2, r: 4 }}
                        activeDot={{ stroke: '#F43F5E', fill: 'white', strokeWidth: 2, r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="savings" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        dot={{ stroke: '#10B981', fill: '#10B981', strokeWidth: 2, r: 4 }}
                        activeDot={{ stroke: '#10B981', fill: 'white', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bottom Grid: Upcoming Expenses & Alerts */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Upcoming Expenses */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Upcoming Expenses</CardTitle>
                    <CardDescription>Due in the next 7 days</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <span>View All</span>
                    <ArrowRight size={16} />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingExpenses.length === 0 ? (
                      <p className="text-center py-4 text-muted-foreground">No upcoming expenses for the next 7 days</p>
                    ) : (
                      upcomingExpenses.map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              expense.type === 'personal' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                            }`}>
                              <DollarSign size={16} />
                            </div>
                            <div>
                              <p className="font-medium">{expense.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(expense.date), "MMM d, yyyy")}
                              </p>
                            </div>
                          </div>
                          <p className="font-medium">{formatCurrency(expense.amount)}</p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notifications & Savings Progress */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="space-y-4"
            >
              {/* Savings Goal */}
              <Card>
                <CardHeader>
                  <CardTitle>Savings Progress</CardTitle>
                  <CardDescription>Emergency Fund Goal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <div className="font-medium">
                      <PiggyBank className="inline-block mr-2" size={18} />
                      <span>{formatCurrency(dashboardSummary.savingsGoalProgress)}</span>
                    </div>
                    <div className="text-muted-foreground">
                      Target: {formatCurrency(dashboardSummary.savingsGoalTarget)}
                    </div>
                  </div>
                  <Progress 
                    value={(dashboardSummary.savingsGoalProgress / dashboardSummary.savingsGoalTarget) * 100} 
                    className="h-2"
                  />
                  <div className="text-sm text-right text-muted-foreground">
                    {Math.round((dashboardSummary.savingsGoalProgress / dashboardSummary.savingsGoalTarget) * 100)}% completed
                  </div>
                </CardContent>
              </Card>

              {/* Recent Notifications */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Recent alerts and updates</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Bell size={18} />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {unreadNotifications.map((notification) => (
                      <div key={notification.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
                          notification.type === 'warning' ? 'bg-amber-100 text-amber-600' : 
                          notification.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {notification.type === 'warning' ? <Clock size={14} /> : 
                           notification.type === 'success' ? <ArrowUpRight size={14} /> : 
                           <Bell size={14} />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ChevronRight size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* Spending Tab */}
        <TabsContent value="spending" className="space-y-6">
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Spending By Category</CardTitle>
                <CardDescription>Your expense breakdown for this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis 
                        dataKey="category" 
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
                        formatter={(value) => [`$${value}`, '']}
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
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid gap-4 md:grid-cols-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Personal vs Business</CardTitle>
                <CardDescription>Expense comparison</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="flex items-center justify-center py-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {formatCurrency(2100)}
                      </div>
                      <div className="text-sm font-medium text-muted-foreground mt-1">
                        Personal
                      </div>
                      <div className="mt-4 text-xs">
                        +12% from last month
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">
                        {formatCurrency(4317)}
                      </div>
                      <div className="text-sm font-medium text-muted-foreground mt-1">
                        Business
                      </div>
                      <div className="mt-4 text-xs">
                        +5% from last month
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Expense Categories</CardTitle>
                <CardDescription>Highest spending areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryBreakdown
                    .sort((a, b) => b.amount - a.amount)
                    .slice(0, 3)
                    .map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{category.category}</span>
                          <span>{formatCurrency(category.amount)}</span>
                        </div>
                        <Progress value={category.percentage} className="h-2" />
                        <div className="text-xs text-right text-muted-foreground">
                          {category.percentage}% of total
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Savings Tab */}
        <TabsContent value="savings" className="space-y-6">
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 md:grid-cols-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Emergency Fund</CardTitle>
                <CardDescription>3-6 months of living expenses</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="space-y-6">
                  <div className="flex justify-between">
                    <div className="font-medium">
                      <PiggyBank className="inline-block mr-2" size={18} />
                      <span>{formatCurrency(dashboardSummary.savingsGoalProgress)}</span>
                    </div>
                    <div className="text-muted-foreground">
                      Target: {formatCurrency(dashboardSummary.savingsGoalTarget)}
                    </div>
                  </div>
                  <Progress 
                    value={(dashboardSummary.savingsGoalProgress / dashboardSummary.savingsGoalTarget) * 100} 
                    className="h-3"
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current</span>
                    <span className="font-medium">
                      {Math.round((dashboardSummary.savingsGoalProgress / dashboardSummary.savingsGoalTarget) * 100)}% complete
                    </span>
                  </div>
                  
                  <div className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      At your current savings rate, you'll reach your goal in:
                    </p>
                    <div className="bg-secondary p-4 rounded-lg text-center">
                      <span className="text-2xl font-bold">3</span>
                      <span className="text-lg font-medium ml-1">months</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Savings</CardTitle>
                <CardDescription>Track your progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrends}>
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
                        formatter={(value) => [`$${value}`, '']}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          border: 'none'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="savings" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        dot={{ stroke: '#10B981', fill: '#10B981', strokeWidth: 2, r: 4 }}
                        activeDot={{ stroke: '#10B981', fill: 'white', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Savings Recommendations</CardTitle>
                <CardDescription>Based on your spending patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Reduce restaurant spending</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      You spent $193 on restaurants this month, which is 30% higher than your average.
                      Try to reduce dining out to save an extra $50-60 monthly.
                    </p>
                    <Button variant="outline" size="sm">See Details</Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Subscription review</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      You have 5 active subscriptions totaling $65/month. Consider reviewing
                      which ones you actually use regularly.
                    </p>
                    <Button variant="outline" size="sm">Review Subscriptions</Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Automate your savings</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Setting up automatic transfers of $400/month would help you reach
                      your emergency fund goal 2 months faster.
                    </p>
                    <Button variant="outline" size="sm">Set Up Automation</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Dashboard;
