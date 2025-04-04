
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense } from "@/lib/types";
import { expenses } from "@/lib/data";
import { motion } from "framer-motion";
import { ExpenseCalendarDay } from "./calendar/ExpenseCalendarDay";
import { ExpenseDayDetails } from "./calendar/ExpenseDayDetails";
import { MonthlyOverviewCard } from "./calendar/MonthlyOverviewCard";
import { UpcomingExpensesCard } from "./calendar/UpcomingExpensesCard";
import { CalendarExpenseService } from "./calendar/CalendarExpenseService";

interface ExpenseCalendarProps {
  onSelectDate?: (date: Date) => void;
}

export function ExpenseCalendar({ onSelectDate }: ExpenseCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [monthDisplayed, setMonthDisplayed] = useState<Date>(new Date());
  const [showDetails, setShowDetails] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      if (onSelectDate) {
        onSelectDate(date);
      }
      setShowDetails(true);
    }
  };

  const selectedDateExpenses = selectedDate 
    ? CalendarExpenseService.getExpensesForDate(expenses, selectedDate) 
    : [];
    
  const upcomingExpenses = CalendarExpenseService.getUpcomingExpenses(expenses);
  const monthlyExpenses = CalendarExpenseService.getExpensesForMonth(expenses, monthDisplayed);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Expense Calendar</CardTitle>
            <CardDescription>
              View and plan your expenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar 
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              onMonthChange={setMonthDisplayed}
              className="border rounded-md p-3"
              disabled={false}
              showOutsideDays={true}
              components={{
                Day: ({ date, ...props }) => {
                  const dateExpenses = CalendarExpenseService.getExpensesForDate(expenses, date);
                  return (
                    <div {...props}>
                      <ExpenseCalendarDay 
                        day={date} 
                        monthDisplayed={monthDisplayed}
                        expenses={dateExpenses} 
                        isSelected={selectedDate ? date.getTime() === selectedDate.getTime() : false}
                      />
                    </div>
                  );
                }
              }}
            />
          </CardContent>
        </Card>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-4"
        >
          <MonthlyOverviewCard 
            monthDisplayed={monthDisplayed}
            expenses={monthlyExpenses}
          />

          <UpcomingExpensesCard expenses={upcomingExpenses} />
        </motion.div>
      </div>

      <ExpenseDayDetails
        date={selectedDate}
        expenses={selectedDateExpenses}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
    </div>
  );
}

export default ExpenseCalendar;
