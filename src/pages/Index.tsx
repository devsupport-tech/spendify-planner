
import { ExpenseCalendar } from "@/components/ExpenseCalendar";
import { ExpenseTracker } from "@/components/ExpenseTracker";
import { ExpenseAnalytics } from "@/components/ExpenseAnalytics";
import { PaymentTracker } from "@/components/PaymentTracker";
import { ClickableDashboard } from "@/components/ClickableDashboard";
import { ProjectsTracker } from "@/components/ProjectsTracker";
import { BudgetTracker } from "@/components/BudgetTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="container mx-auto py-8 px-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-3xl grid-cols-7 mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <ClickableDashboard onCardClick={setActiveTab} />
        </TabsContent>
        <TabsContent value="expenses">
          <ExpenseTracker />
        </TabsContent>
        <TabsContent value="payments">
          <PaymentTracker />
        </TabsContent>
        <TabsContent value="projects">
          <ProjectsTracker />
        </TabsContent>
        <TabsContent value="budget">
          <BudgetTracker />
        </TabsContent>
        <TabsContent value="calendar">
          <h1 className="text-3xl font-bold mb-6">Expense Calendar</h1>
          <ExpenseCalendar />
        </TabsContent>
        <TabsContent value="analytics">
          <ExpenseAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
