import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, Filter, Plus, Search, X } from "lucide-react";
import { payments } from "@/lib/data";
import { Payment, PaymentCategory } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export function PaymentTracker() {
  const [paymentType, setPaymentType] = useState<'all' | 'personal' | 'business'>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [showAddPayment, setShowAddPayment] = useState(false);
  
  const [newPayment, setNewPayment] = useState<Partial<Payment>>({
    amount: 0,
    description: "",
    date: format(new Date(), 'yyyy-MM-dd'),
    isReceived: false,
    isRecurring: false,
    category: "Other",
    type: "personal",
    client: "",
    project: "",
  });

  const filteredPayments = payments.filter((payment) => {
    if (paymentType !== 'all' && payment.type !== paymentType) {
      return false;
    }
    
    if (
      searchQuery &&
      !payment.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    if (selectedCategory && payment.category !== selectedCategory) {
      return false;
    }
    
    if (dateRange.from && new Date(payment.date) < dateRange.from) {
      return false;
    }
    
    if (dateRange.to) {
      const endDate = new Date(dateRange.to);
      endDate.setHours(23, 59, 59, 999);
      if (new Date(payment.date) > endDate) {
        return false;
      }
    }
    
    return true;
  });

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const personalTotal = filteredPayments
    .filter(payment => payment.type === 'personal')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const businessTotal = filteredPayments
    .filter(payment => payment.type === 'business')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const handlePaymentChange = (field: string, value: any) => {
    if (field === 'date' && value instanceof Date) {
      value = format(value, 'yyyy-MM-dd');
    }
    
    setNewPayment({
      ...newPayment,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    toast({
      title: "Payment Added",
      description: `${newPayment.description} - ${formatCurrency(newPayment.amount || 0)}`,
    });
    
    setShowAddPayment(false);
    setNewPayment({
      amount: 0,
      description: "",
      date: format(new Date(), 'yyyy-MM-dd'),
      isReceived: false,
      isRecurring: false,
      category: "Other",
      type: "personal",
      client: "",
      project: "",
    });
  };

  const getUniqueCategories = () => {
    const categories = new Set<string>();
    payments.forEach((payment) => {
      categories.add(payment.category);
    });
    return Array.from(categories);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Tracker</h1>
          <p className="text-muted-foreground">
            Track and manage your income and payments
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAddPayment(true)} className="gap-1">
          <Plus size={16} />
          <span>Add Payment</span>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
            <p className="text-xs text-muted-foreground">
              From {filteredPayments.length} transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Personal Income</CardTitle>
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
            <CardTitle className="text-sm font-medium">Business Income</CardTitle>
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
            value={paymentType} 
            onValueChange={(value) => setPaymentType(value as 'all' | 'personal' | 'business')}
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
                placeholder="Search payments..."
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
                      className="pointer-events-auto"
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
                      className="pointer-events-auto"
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
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <X size={36} className="mb-2" />
                      <p>No payments found</p>
                      <p className="text-sm">Try adjusting your filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="font-medium">{payment.description}</div>
                      {payment.client && (
                        <div className="text-xs text-muted-foreground">
                          Client: {payment.client}
                        </div>
                      )}
                      {payment.project && (
                        <div className="text-xs text-muted-foreground">
                          Project: {payment.project}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{format(new Date(payment.date), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{payment.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={cn(
                          payment.type === 'personal' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        )}
                      >
                        {payment.type === 'personal' ? 'Personal' : 'Business'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-medium">
                        {formatCurrency(payment.amount)}
                      </span>
                      <div className="text-xs text-muted-foreground flex justify-end items-center gap-1 mt-1">
                        {payment.isRecurring && "Recurring"}
                        {payment.isReceived ? 
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Received</Badge> : 
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>
                        }
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={showAddPayment} onOpenChange={setShowAddPayment}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Payment</DialogTitle>
            <DialogDescription>
              Enter the details of your payment or income. Click save when you're done.
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
                  value={newPayment.amount || ''}
                  onChange={(e) => handlePaymentChange('amount', parseFloat(e.target.value))}
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
                value={newPayment.description}
                onChange={(e) => handlePaymentChange('description', e.target.value)}
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
                      {newPayment.date ? format(new Date(newPayment.date), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newPayment.date ? new Date(newPayment.date) : undefined}
                      onSelect={(date) => handlePaymentChange('date', date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select 
                value={newPayment.category as string}
                onValueChange={(value) => handlePaymentChange('category', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Salary">Salary</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                  <SelectItem value="Investment">Investment</SelectItem>
                  <SelectItem value="Rental">Rental</SelectItem>
                  <SelectItem value="Gift">Gift</SelectItem>
                  <SelectItem value="Refund">Refund</SelectItem>
                  <SelectItem value="Sale">Sale</SelectItem>
                  <SelectItem value="Client">Client Payment</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select 
                value={newPayment.type}
                onValueChange={(value: 'personal' | 'business') => handlePaymentChange('type', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newPayment.type === 'business' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="client" className="text-right">
                    Client
                  </Label>
                  <Input
                    id="client"
                    placeholder="Client name (optional)"
                    className="col-span-3"
                    value={newPayment.client || ''}
                    onChange={(e) => handlePaymentChange('client', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="project" className="text-right">
                    Project
                  </Label>
                  <Input
                    id="project"
                    placeholder="Project name (optional)"
                    className="col-span-3"
                    value={newPayment.project || ''}
                    onChange={(e) => handlePaymentChange('project', e.target.value)}
                  />
                </div>
              </>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isReceived" className="text-right">
                Received
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="isReceived"
                  checked={newPayment.isReceived}
                  onCheckedChange={(checked) => handlePaymentChange('isReceived', checked)}
                />
                <Label htmlFor="isReceived">
                  {newPayment.isReceived ? 'Received' : 'Pending'}
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
                  checked={newPayment.isRecurring}
                  onCheckedChange={(checked) => handlePaymentChange('isRecurring', checked)}
                />
                <Label htmlFor="isRecurring">
                  {newPayment.isRecurring ? 'Yes' : 'No'}
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit"
              onClick={handleSubmit}
              disabled={
                !newPayment.description || 
                !newPayment.amount || 
                newPayment.amount <= 0 || 
                !newPayment.date
              }
            >
              Save Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PaymentTracker;
