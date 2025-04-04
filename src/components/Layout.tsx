
import { useState, useEffect, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Receipt, 
  Calendar, 
  BarChart3, 
  Bell, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  icon: any;
  label: string;
  href: string;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  // Close mobile nav when changing routes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Navigation items
  const navItems: NavItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Receipt, label: "Expenses", href: "/expenses" },
    { icon: Calendar, label: "Calendar", href: "/calendar" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  // Toggle sidebar state
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Menu Button */}
      {isMobile && (
        <button 
          className="fixed top-4 right-4 z-50 p-2 rounded-full bg-primary text-primary-foreground shadow-lg"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Sidebar - Desktop */}
      {!isMobile && (
        <div 
          className={cn(
            "glass-panel border-r h-screen sticky top-0 transition-all duration-300 ease-in-out z-30",
            collapsed ? "w-20" : "w-64"
          )}
        >
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary">
              <path 
                fill="currentColor" 
                d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,10.5A1.5,1.5 0 0,1 13.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,12A1.5,1.5 0 0,1 12,10.5M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5A1.5,1.5 0 0,1 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5Z" 
              />
            </svg>
            {!collapsed && <span className="ml-3 text-lg font-semibold">Spendify</span>}
          </div>

          {/* Navigation */}
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center py-3 px-4 rounded-lg transition-all duration-200",
                      location.pathname === item.href 
                        ? "bg-primary/10 text-primary" 
                        : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("flex-shrink-0", collapsed ? "mx-auto" : "mr-3")} size={20} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Collapse Button */}
          <button
            onClick={toggleSidebar}
            className="absolute right-0 top-20 -mr-3 glass-panel rounded-full p-1.5 text-foreground/70 hover:text-foreground"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      )}

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 w-full h-full glass-panel border-r"
          >
            <div className="flex items-center justify-between h-16 px-6 border-b">
              <div className="flex items-center">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary">
                  <path 
                    fill="currentColor" 
                    d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,10.5A1.5,1.5 0 0,1 13.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,12A1.5,1.5 0 0,1 12,10.5M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5A1.5,1.5 0 0,1 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5Z" 
                  />
                </svg>
                <span className="ml-3 text-lg font-semibold">Spendify</span>
              </div>
            </div>
            <nav className="p-6">
              <ul className="space-y-4">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center py-3 px-4 rounded-lg transition-all duration-200",
                        location.pathname === item.href 
                          ? "bg-primary/10 text-primary" 
                          : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <item.icon className="mr-4" size={22} />
                      <span className="text-lg">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 relative">
        <main className="py-8 px-6 md:px-10 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
