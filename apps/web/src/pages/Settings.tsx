import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Bell, Shield, Building2, Users, Plus, AlertTriangle, Loader2, Monitor, Globe, Clock, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { toast as sonnerToast } from 'sonner';
import { format } from 'date-fns';

export default function Settings() {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessionPage, setSessionPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [companyName, setCompanyName] = useState('');
  const [maxDebtPerCustomer, setMaxDebtPerCustomer] = useState(0);
  const [logoUrl, setLogoUrl] = useState('');

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Password reset state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, settingsRes, sessionsRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/settings'),
          api.get('/auth/sessions?page=1&size=5')
        ]);
        
        const userData = userRes.data;
        const settingsData = settingsRes.data;
        
        setUser(userData);
        setUserName(userData.name);
        setUserEmail(userData.email);
        
        setSettings(settingsData);
        setCompanyName(settingsData.company_name);
        setMaxDebtPerCustomer(settingsData.max_debt_per_customer);
        setLogoUrl(settingsData.logo_url || '');
        
        setSessions(sessionsRes.data);
      } catch (error) {
        console.error('Failed to fetch settings data:', error);
        sonnerToast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchSessions = async (page: number) => {
    try {
      const res = await api.get(`/auth/sessions?page=${page}&size=5`);
      setSessions(res.data);
      setSessionPage(page);
    } catch (error) {
      sonnerToast.error('Failed to load sessions');
    }
  };

  const initials = userName
    ? userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '??';

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      sonnerToast.error('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      sonnerToast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      sonnerToast.error('Password must be at least 6 characters long');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await api.post('/auth/reset-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      sonnerToast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Password reset error:', error);
      sonnerToast.error(error.response?.data?.detail || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSaveCompanySettings = async () => {
    setIsSavingSettings(true);
    try {
      await api.patch('/settings', {
        company_name: companyName,
        max_debt_per_customer: maxDebtPerCustomer,
        logo_url: logoUrl,
      });
      sonnerToast.success('Company settings updated');
      // Update global logo if needed, though DashboardLayout will refetch on refresh
    } catch (error) {
      sonnerToast.error('Failed to update company settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsSavingProfile(true);
    try {
      await api.patch('/auth/me', {
        name: userName,
        email: userEmail,
      });
      sonnerToast.success('Profile updated successfully');
    } catch (error: any) {
      sonnerToast.error(error.response?.data?.detail || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto px-4 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Page header */}
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground text-lg">
            Manage your account, company settings, and security preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Company Settings */}
          <Card className="glass-card border-border/40 shadow-xl rounded-3xl overflow-hidden h-full">
            <CardHeader className="bg-muted/30 pb-6 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Company Settings</CardTitle>
                  <CardDescription>Configure business details and operational limits.</CardDescription>
                </div>
              </div>
            </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company-name" className="text-[11px] font-bold uppercase tracking-wider ml-1 text-muted-foreground">Company Name</Label>
                <Input
                  id="company-name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-background/50 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-debt" className="text-[11px] font-bold uppercase tracking-wider ml-1 text-muted-foreground">Max Debt Per Customer</Label>
                <Input
                  id="max-debt"
                  type="number"
                  min="0"
                  value={maxDebtPerCustomer}
                  onChange={(e) => setMaxDebtPerCustomer(Number(e.target.value))}
                  className="bg-background/50 rounded-xl"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="logo-url" className="text-[11px] font-bold uppercase tracking-wider ml-1 text-muted-foreground">Logo URL</Label>
                <div className="flex gap-3">
                  <Input
                    id="logo-url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className="bg-background/50 rounded-xl"
                    placeholder="https://example.com/logo.png"
                  />
                  {logoUrl && (
                    <div className="h-10 w-10 rounded-lg border border-border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                      <img src={logoUrl} alt="Logo Preview" className="h-full w-full object-contain" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button 
              onClick={handleSaveCompanySettings} 
              disabled={isSavingSettings}
              className="rounded-xl shadow-lg shadow-primary/20"
            >
              {isSavingSettings ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Company Settings
            </Button>
          </CardContent>
        </Card>

          {/* Profile section */}
          <Card className="glass-card border-border/40 shadow-xl rounded-3xl overflow-hidden h-full">
            <CardHeader className="bg-muted/30 pb-6 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Profile</CardTitle>
                  <CardDescription>Your personal information and account details.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center gap-5">
                <Avatar className="h-20 w-20 border-2 border-background shadow-lg">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="font-bold text-xl">{user?.name || "Loading..."}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    <Badge variant="secondary" className="capitalize text-[10px] font-bold tracking-widest px-2 py-0">
                      {user?.role}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator className="opacity-50" />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[11px] font-bold uppercase tracking-wider ml-1 text-muted-foreground">Full Name</Label>
                <Input 
                  id="name" 
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)}
                  className="bg-background/50 rounded-xl" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider ml-1 text-muted-foreground">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={userEmail} 
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="bg-background/50 rounded-xl" 
                />
              </div>
            </div>

            <Button 
                onClick={handleUpdateProfile} 
                disabled={isSavingProfile}
                className="rounded-xl shadow-lg shadow-primary/10"
              >
                {isSavingProfile ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Security / Password Reset */}
          <Card className="lg:col-span-5 glass-card border-border/40 shadow-xl rounded-3xl overflow-hidden self-stretch">
            <CardHeader className="bg-muted/30 pb-6 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Security</CardTitle>
                  <CardDescription>Manage your password.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-[11px] font-bold uppercase tracking-wider ml-1 text-muted-foreground">Current Password</Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-background/50 rounded-xl"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-[11px] font-bold uppercase tracking-wider ml-1 text-muted-foreground">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-background/50 rounded-xl"
                    placeholder="At least 6 characters"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-[11px] font-bold uppercase tracking-wider ml-1 text-muted-foreground">Confirm New Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-background/50 rounded-xl"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleUpdatePassword} 
                disabled={isUpdatingPassword}
                className="w-full rounded-xl shadow-lg shadow-primary/20"
              >
                {isUpdatingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Login Sessions */}
          <Card className="lg:col-span-7 glass-card border-border/40 shadow-xl rounded-3xl overflow-hidden self-stretch">
            <CardHeader className="bg-muted/30 pb-6 border-b border-border/30">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Monitor className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Login Sessions</CardTitle>
                    <CardDescription>Recent activity on your account.</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="table-container bg-background/30 rounded-2xl border border-border/40 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border/30">
                      <TableHead className="font-bold text-foreground">Date & Time</TableHead>
                      <TableHead className="font-bold text-foreground">Device / Browser</TableHead>
                      <TableHead className="font-bold text-foreground text-right">IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions.length > 0 ? (
                      sessions.map((session) => (
                        <TableRow key={session.id} className="data-row hover:bg-muted/30 transition-colors border-border/20">
                          <TableCell className="font-medium">
                             <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs">{format(new Date(session.created_at), 'MMM dd, yyyy HH:mm')}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground max-w-[150px] truncate">
                            <div className="flex items-center gap-2">
                              <Monitor className="h-3 w-3" />
                              <span title={session.device} className="text-xs">{session.device}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono text-[10px]">
                             <div className="flex items-center justify-end gap-2">
                              <Globe className="h-3 w-3 text-muted-foreground" />
                              {session.ip_address}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                          No sessions recorded.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {sessions.length > 0 && (
                <div className="mt-4 flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={sessionPage === 1}
                    onClick={() => fetchSessions(sessionPage - 1)}
                    className="rounded-lg h-8 text-xs"
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fetchSessions(sessionPage + 1)}
                    className="rounded-lg h-8 text-xs"
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
}
