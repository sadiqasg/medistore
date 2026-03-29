import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { mockNotifications } from '@/lib/mockData';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Package,
  Receipt,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  History,
  AlertCircle,
  AlertTriangle,
  Info,
  Truck,
  Wallet,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const mainNavigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Orders', href: '/orders', icon: Truck },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Financials', href: '/financials', icon: Wallet },
  { name: 'Customer Ledger', href: '/debt', icon: Users },
];

const bottomNavigation = [
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Analysis', href: '/analysis', icon: History },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const severityIcons = {
  critical: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const severityColors = {
  critical: 'text-danger',
  warning: 'text-warning',
  info: 'text-muted-foreground',
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, settingsRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/settings')
        ]);
        setUser(userRes.data);
        setSettings(settingsRes.data);
      } catch (error) {
        console.error('Failed to fetch layout data:', error);
      }
    };
    fetchData();
  }, []);

  // Handle PWA installation
  useState(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  });

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBtn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('medis_token');
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const unreadNotifications = mockNotifications.filter((n) => !n.read);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
    : '??';

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[60] bg-background/40 backdrop-blur-md lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 glass-sidebar shadow-2xl',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center justify-between px-6 border-b border-sidebar-border/30">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sidebar-primary/5 p-1 transition-transform group-hover:scale-105">
                <img src={settings?.logo_url || "/logo.png"} alt="Medistore Logo" className="h-full w-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-sidebar-primary leading-none">
                  {settings?.company_name || "MEDISTORE"}
                </span>
                <span className="text-[10px] text-sidebar-muted font-medium uppercase tracking-widest mt-1">HQ</span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent/50"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col px-3 py-6">
            <div className="space-y-1.5 flex-1">
              {mainNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group/nav relative',
                      isActive
                        ? 'bg-primary/10 text-primary shadow-md'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary'
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                    )}
                    <item.icon className={cn('h-5 w-5 transition-transform group-hover/nav:scale-110', isActive ? 'text-primary' : 'text-sidebar-muted')} />
                    {item.name}
                    {item.name === 'Expenses' && (
                      <Badge variant="destructive" className="ml-auto text-[10px] px-1.5 py-0">
                        2
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-sidebar-border/30" />

            {/* Bottom navigation */}
            <div className="space-y-1.5">
              {bottomNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group/nav relative',
                      isActive
                        ? 'bg-primary/10 text-primary shadow-md'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary'
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                    )}
                    <item.icon className={cn('h-5 w-5 transition-transform group-hover/nav:scale-110', isActive ? 'text-primary' : 'text-sidebar-muted')} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User section */}
          <div className="border-t border-sidebar-border/30 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer p-2 rounded-xl border border-transparent hover:border-sidebar-border/50 hover:bg-sidebar-accent/30 transition-all group">
                  <Avatar className="h-10 w-10 border border-sidebar-border/50 group-hover:border-primary/30 transition-colors">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-sidebar-primary truncate leading-tight">
                      {user?.name || "Loading..."}
                    </p>
                    <p className="text-[10px] text-sidebar-muted font-medium uppercase tracking-wider truncate mt-0.5">
                      {user?.role || "user"}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-sidebar-muted group-hover:text-sidebar-primary transition-colors" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="right" sideOffset={10} className="w-56 glass-card border-sidebar-border/40 rounded-2xl p-2 shadow-2xl">
                <div className="px-3 py-2 mb-2">
                  <p className="text-sm font-bold text-sidebar-primary">{user?.name}</p>
                  <p className="text-[10px] font-medium text-sidebar-muted uppercase tracking-widest mt-1">{user?.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-sidebar-border/30" />
                <DropdownMenuItem className="rounded-xl focus:bg-sidebar-accent/50 cursor-pointer py-2.5" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4 text-danger" />
                  <span className="text-sm font-semibold text-danger">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="glass-navbar border-b border-border/40 px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-accent/50"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Page title or breadcrumb placeholder */}
            <h2 className="hidden md:block text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              {location.pathname === '/' ? 'Overview' : location.pathname.split('/')[1]}
            </h2>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* PWA Install Button */}
            {showInstallBtn && (
              <Button
                onClick={handleInstallClick}
                variant="outline"
                size="sm"
                className="hidden sm:flex items-center gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary animate-bounce-subtle"
              >
                <Truck className="h-4 w-4" />
                Install App
              </Button>
            )}

            <div className="flex items-center gap-2">
              <ThemeToggle />

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative hover:bg-accent/50">
                    <Bell className="h-5 w-5" />
                    {unreadNotifications.length > 0 && (
                      <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
                    )}
                  </Button>
                </PopoverTrigger>
                {/* ... PopoverContent ... */}
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-1 hover:bg-accent/50 rounded-full">
                    <Avatar className="h-8 w-8 border border-border/50">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                {/* ... DropdownMenuContent ... */}
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </main>
      </div>
    </div>
  );
}
