import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronRight, Construction, Filter, FolderOpen, Plus, Search, X } from "lucide-react";
import { expenses, payments } from "@/lib/data";
import { Project, Expense, Payment, ProjectSummary } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

// Sample project data
const projects: Project[] = [
  {
    id: "prj-1",
    name: "Website Redesign",
    client: "Acme Corp",
    description: "Complete overhaul of the company website with new branding",
    startDate: new Date(2023, 5, 15),
    endDate: new Date(2023, 8, 30),
    budget: 12000,
    status: "completed"
  },
  {
    id: "prj-2",
    name: "Strategic Consulting",
    client: "TechStart Inc",
    description: "Business strategy consulting for tech startup",
    startDate: new Date(2023, 9, 1),
    budget: 8500,
    status: "active"
  },
  {
    id: "prj-3",
    name: "Marketing Campaign",
    client: "Global Services LLC",
    description: "Q4 digital marketing campaign",
    startDate: new Date(2023, 10, 1),
    endDate: new Date(2023, 11, 31),
    budget: 15000,
    status: "active"
  },
  {
    id: "prj-4",
    name: "App Development",
    client: "HealthPlus",
    description: "Mobile app for patient management",
    startDate: new Date(2023, 8, 15),
    budget: 25000,
    status: "on-hold"
  }
];

// Helper functions to get project-specific expenses and payments
const getProjectExpenses = (projectId: string): Expense[] => {
  return expenses.filter(expense => 
    expense.type === 'business' && 
    (expense.project === projects.find(p => p.id === projectId)?.name)
  );
};

const getProjectPayments = (projectId: string): Payment[] => {
  return payments.filter(payment => 
    payment.type === 'business' && 
    (payment.project === projects.find(p => p.id === projectId)?.name)
  );
};

// Calculate project summaries
const calculateProjectSummaries = (): ProjectSummary[] => {
  return projects.map(project => {
    const projectExpenses = getProjectExpenses(project.id);
    const projectPayments = getProjectPayments(project.id);
    
    const totalExpenses = projectExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalIncome = projectPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    return {
      id: project.id,
      name: project.name,
      client: project.client,
      budget: project.budget,
      expenses: totalExpenses,
      income: totalIncome,
      profit: totalIncome - totalExpenses,
      status: project.status
    };
  });
};

export function ProjectsTracker() {
  const [activeView, setActiveView] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddProject, setShowAddProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: "",
    client: "",
    description: "",
    startDate: new Date(),
    budget: undefined,
    status: "active"
  });

  const projectSummaries = calculateProjectSummaries();
  
  const filteredProjects = projectSummaries.filter((project) => {
    if (activeView !== 'all' && project.status !== activeView) {
      return false;
    }
    
    if (
      searchQuery &&
      !project.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(project.client && project.client.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false;
    }
    
    return true;
  });

  const handleProjectChange = (field: string, value: any) => {
    setNewProject({
      ...newProject,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    toast({
      title: "Project Added",
      description: `${newProject.name} for ${newProject.client || 'No Client'}`,
    });
    
    setShowAddProject(false);
    setNewProject({
      name: "",
      client: "",
      description: "",
      startDate: new Date(),
      budget: undefined,
      status: "active"
    });
  };

  const openProjectDetails = (project: ProjectSummary) => {
    const fullProject = projects.find(p => p.id === project.id) || null;
    setSelectedProject(fullProject);
    setShowProjectDetails(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Tracker</h1>
          <p className="text-muted-foreground">
            Track your business projects, expenses, and income
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAddProject(true)} className="gap-1">
          <Plus size={16} />
          <span>Add Project</span>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              {projects.filter(p => p.status === 'active').length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(projects.reduce((sum, project) => sum + (project.budget || 0), 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(projectSummaries.reduce((sum, project) => sum + project.income, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              From all projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profit/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              projectSummaries.reduce((sum, project) => sum + project.profit, 0) >= 0 
                ? "text-green-500" 
                : "text-red-500"
            )}>
              {formatCurrency(projectSummaries.reduce((sum, project) => sum + project.profit, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Revenue - Expenses
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border rounded-lg p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between mb-4">
          <Tabs 
            value={activeView} 
            onValueChange={(value) => setActiveView(value as 'all' | 'active' | 'completed')}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="pl-8 w-full sm:w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Expenses</TableHead>
                <TableHead>Income</TableHead>
                <TableHead className="text-right">Profit/Loss</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <FolderOpen size={36} className="mb-2" />
                      <p>No projects found</p>
                      <p className="text-sm">Try adjusting your search or add a new project</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project) => (
                  <TableRow key={project.id} className="cursor-pointer hover:bg-muted/40" onClick={() => openProjectDetails(project)}>
                    <TableCell>
                      <div className="font-medium flex items-center gap-2">
                        <Badge 
                          variant="outline"
                          className={cn(
                            project.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 
                            project.status === 'completed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            project.status === 'on-hold' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-red-50 text-red-700 border-red-200'
                          )}
                        >
                          {project.status}
                        </Badge>
                        {project.name}
                      </div>
                    </TableCell>
                    <TableCell>{project.client || '—'}</TableCell>
                    <TableCell>{project.budget ? formatCurrency(project.budget) : '—'}</TableCell>
                    <TableCell>{formatCurrency(project.expenses)}</TableCell>
                    <TableCell>{formatCurrency(project.income)}</TableCell>
                    <TableCell className={cn(
                      "text-right font-medium",
                      project.profit >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {formatCurrency(project.profit)}
                    </TableCell>
                    <TableCell>
                      <ChevronRight size={16} className="text-muted-foreground ml-2" />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add Project Dialog */}
      <Dialog open={showAddProject} onOpenChange={setShowAddProject}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogDescription>
              Enter the details of your business project. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Project Name
              </Label>
              <Input
                id="name"
                placeholder="Enter project name"
                className="col-span-3"
                value={newProject.name}
                onChange={(e) => handleProjectChange('name', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client" className="text-right">
                Client
              </Label>
              <Input
                id="client"
                placeholder="Enter client name"
                className="col-span-3"
                value={newProject.client || ''}
                onChange={(e) => handleProjectChange('client', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the project"
                className="col-span-3"
                rows={3}
                value={newProject.description || ''}
                onChange={(e) => handleProjectChange('description', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newProject.startDate ? format(new Date(newProject.startDate), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newProject.startDate ? new Date(newProject.startDate) : undefined}
                      onSelect={(date) => handleProjectChange('startDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newProject.endDate ? format(new Date(newProject.endDate), "PPP") : <span>Optional</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newProject.endDate ? new Date(newProject.endDate) : undefined}
                      onSelect={(date) => handleProjectChange('endDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="budget" className="text-right">
                Budget
              </Label>
              <div className="col-span-3 relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                <Input
                  id="budget"
                  type="number"
                  min={0}
                  step={1}
                  placeholder="Optional"
                  className="pl-8"
                  value={newProject.budget || ''}
                  onChange={(e) => handleProjectChange('budget', parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select 
                value={newProject.status}
                onValueChange={(value: 'active' | 'completed' | 'on-hold' | 'cancelled') => 
                  handleProjectChange('status', value)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit"
              onClick={handleSubmit}
              disabled={!newProject.name || !newProject.startDate}
            >
              Save Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Project Details Dialog */}
      <Dialog open={showProjectDetails} onOpenChange={setShowProjectDetails}>
        <DialogContent className="sm:max-w-[650px]">
          {selectedProject && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl">{selectedProject.name}</DialogTitle>
                  <Badge 
                    variant="outline"
                    className={cn(
                      selectedProject.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 
                      selectedProject.status === 'completed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      selectedProject.status === 'on-hold' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    )}
                  >
                    {selectedProject.status}
                  </Badge>
                </div>
                {selectedProject.client && (
                  <DialogDescription className="text-base mt-1">
                    Client: {selectedProject.client}
                  </DialogDescription>
                )}
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                {selectedProject.description && (
                  <div>
                    <h3 className="font-semibold mb-1">Description</h3>
                    <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-1">Start Date</h3>
                    <p className="text-sm">{format(new Date(selectedProject.startDate), "MMMM d, yyyy")}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">End Date</h3>
                    <p className="text-sm">{selectedProject.endDate 
                      ? format(new Date(selectedProject.endDate), "MMMM d, yyyy") 
                      : "Not specified"}
                    </p>
                  </div>
                </div>
                
                {selectedProject.budget && (
                  <div>
                    <h3 className="font-semibold mb-1">Budget</h3>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Budget:</span>
                        <span className="font-medium">{formatCurrency(selectedProject.budget)}</span>
                      </div>
                      
                      {/* Budget progress */}
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Budget spent:</span>
                          <span className="text-xs font-medium">
                            {Math.min(100, Math.round((getProjectExpenses(selectedProject.id).reduce((sum, exp) => sum + exp.amount, 0) / selectedProject.budget) * 100))}%
                          </span>
                        </div>
                        <Progress value={Math.min(100, (getProjectExpenses(selectedProject.id).reduce((sum, exp) => sum + exp.amount, 0) / selectedProject.budget) * 100)} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Project financials */}
                <div className="mt-2">
                  <h3 className="font-semibold mb-3">Financial Summary</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <Card>
                      <CardContent className="p-3">
                        <div className="text-xs text-muted-foreground">Expenses</div>
                        <div className="text-lg font-bold mt-1 text-destructive">
                          {formatCurrency(getProjectExpenses(selectedProject.id).reduce((sum, exp) => sum + exp.amount, 0))}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3">
                        <div className="text-xs text-muted-foreground">Income</div>
                        <div className="text-lg font-bold mt-1 text-primary">
                          {formatCurrency(getProjectPayments(selectedProject.id).reduce((sum, pay) => sum + pay.amount, 0))}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3">
                        <div className="text-xs text-muted-foreground">Profit/Loss</div>
                        <div className={cn(
                          "text-lg font-bold mt-1",
                          getProjectPayments(selectedProject.id).reduce((sum, pay) => sum + pay.amount, 0) - 
                          getProjectExpenses(selectedProject.id).reduce((sum, exp) => sum + exp.amount, 0) >= 0 
                            ? "text-green-600" 
                            : "text-red-600"
                        )}>
                          {formatCurrency(
                            getProjectPayments(selectedProject.id).reduce((sum, pay) => sum + pay.amount, 0) - 
                            getProjectExpenses(selectedProject.id).reduce((sum, exp) => sum + exp.amount, 0)
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Project tabs */}
                <div className="mt-2">
                  <Tabs defaultValue="expenses">
                    <TabsList className="w-full">
                      <TabsTrigger value="expenses">Expenses</TabsTrigger>
                      <TabsTrigger value="payments">Income</TabsTrigger>
                    </TabsList>
                    <TabsContent value="expenses">
                      <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto">
                        {getProjectExpenses(selectedProject.id).length === 0 ? (
                          <p className="text-sm text-center text-muted-foreground py-4">No expenses recorded for this project</p>
                        ) : (
                          <div className="space-y-2">
                            {getProjectExpenses(selectedProject.id).map(expense => (
                              <div key={expense.id} className="flex justify-between items-center text-sm p-2 border-b last:border-0">
                                <div>
                                  <div>{expense.description}</div>
                                  <div className="text-xs text-muted-foreground">{format(new Date(expense.date), "MMM d, yyyy")}</div>
                                </div>
                                <div className="font-medium">{formatCurrency(expense.amount)}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="payments">
                      <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto">
                        {getProjectPayments(selectedProject.id).length === 0 ? (
                          <p className="text-sm text-center text-muted-foreground py-4">No payments recorded for this project</p>
                        ) : (
                          <div className="space-y-2">
                            {getProjectPayments(selectedProject.id).map(payment => (
                              <div key={payment.id} className="flex justify-between items-center text-sm p-2 border-b last:border-0">
                                <div>
                                  <div>{payment.description}</div>
                                  <div className="text-xs text-muted-foreground">{format(new Date(payment.date), "MMM d, yyyy")}</div>
                                </div>
                                <div className="font-medium">{formatCurrency(payment.amount)}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProjectsTracker;
