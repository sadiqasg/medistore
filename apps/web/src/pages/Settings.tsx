import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockUser, mockUsers, mockCompanySettings, formatCurrency } from '@/lib/mockData';
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
import { Checkbox } from '@/components/ui/checkbox';
import { User, Bell, Shield, Building2, Users, Plus, AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { toast as sonnerToast } from 'sonner';

export default function Settings() {
  const { toast } = useToast();
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserCanWrite, setNewUserCanWrite] = useState(false);
  const [companyName, setCompanyName] = useState(mockCompanySettings.name);
  const [maxDebtPerCustomer, setMaxDebtPerCustomer] = useState(mockCompanySettings.maxDebtPerCustomer);

  // Password reset state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const initials = mockUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

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

  const handleAddUser = () => {
    if (!newUserName.trim() || !newUserEmail.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    const generatedPassword = Math.random().toString(36).slice(-8) + 'A1!';

    toast({
      title: 'User Added',
      description: `${newUserName} has been added. Temporary password: ${generatedPassword}`,
    });

    setNewUserName('');
    setNewUserEmail('');
    setNewUserCanWrite(false);
    setShowAddUser(false);
  };

  const handleSaveCompanySettings = () => {
    toast({
      title: 'Settings Saved',
      description: 'Company settings have been updated',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl px-4 py-8">
        {/* Page header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account, company settings, and user permissions.
          </p>
        </div>

        {/* Company Settings */}
        <Card className="glass-card border-border/40 shadow-xl rounded-3xl overflow-hidden">
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
                <p className="text-xs text-muted-foreground ml-1">
                  Current Limit: <span className="font-bold text-foreground">{formatCurrency(maxDebtPerCustomer)}</span>
                </p>
              </div>
            </div>
            <Button onClick={handleSaveCompanySettings} className="rounded-xl shadow-lg shadow-primary/20">Save Company Settings</Button>
          </CardContent>
        </Card>

        {/* Profile section */}
        <Card className="glass-card border-border/40 shadow-xl rounded-3xl overflow-hidden">
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
                <p className="font-bold text-xl">{mockUser.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">{mockUser.email}</p>
                  <Badge variant="secondary" className="capitalize text-[10px] font-bold tracking-widest px-2 py-0">
                    {mockUser.role}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator className="opacity-50" />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[11px] font-bold uppercase tracking-wider ml-1 text-muted-foreground">Full Name</Label>
                <Input id="name" defaultValue={mockUser.name} className="bg-background/50 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider ml-1 text-muted-foreground">Email Address</Label>
                <Input id="email" type="email" defaultValue={mockUser.email} className="bg-background/50 rounded-xl" />
              </div>
            </div>

            <Button className="rounded-xl shadow-lg shadow-primary/10">Save Profile</Button>
          </CardContent>
        </Card>

        {/* Security / Password Reset */}
        <Card className="glass-card border-border/40 shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-muted/30 pb-6 border-b border-border/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Security</CardTitle>
                <CardDescription>Manage your password and security settings.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-6 md:grid-cols-2">
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
              <div className="hidden md:block" />
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
              className="rounded-xl shadow-lg shadow-primary/20 min-w-[160px]"
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

        {/* User Management */}
        <Card className="glass-card border-border/40 shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-muted/30 pb-6 border-b border-border/30">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">User Management</CardTitle>
                  <CardDescription>Manage sub-admins and permissions.</CardDescription>
                </div>
              </div>
              <Button size="sm" onClick={() => setShowAddUser(true)} className="rounded-xl shadow-lg shadow-primary/10">
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="table-container bg-background/30 rounded-2xl border border-border/40 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/30">
                    <TableHead className="font-bold text-foreground">User</TableHead>
                    <TableHead className="font-bold text-foreground">Email</TableHead>
                    <TableHead className="font-bold text-foreground">Role</TableHead>
                    <TableHead className="font-bold text-foreground">Permissions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id} className="data-row hover:bg-muted/30 transition-colors border-border/20">
                      <TableCell className="font-semibold">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize text-[10px] font-bold tracking-widest">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.canWrite ? 'secondary' : 'outline'}
                          className={cn("text-[10px] font-bold tracking-widest", user.canWrite ? 'bg-success/10 text-success border-success/20' : 'text-muted-foreground')}
                        >
                          {user.canWrite ? 'Full Access' : 'Read Only'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Add User Dialog */}
        <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
          <DialogContent className="glass-card border-border/40 rounded-3xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Add New User</DialogTitle>
              <DialogDescription>
                Add a sub-admin to help manage the store. A temporary password will be generated for them.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-user-name" className="text-[11px] font-bold uppercase tracking-wider ml-1 text-muted-foreground">Full Name</Label>
                <Input
                  id="new-user-name"
                  placeholder="Enter name"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-user-email" className="text-[11px] font-bold uppercase tracking-wider ml-1 text-muted-foreground">Email Address</Label>
                <Input
                  id="new-user-email"
                  type="email"
                  placeholder="Enter email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-2xl bg-muted/30 border border-border/20">
                <Checkbox
                  id="can-write"
                  checked={newUserCanWrite}
                  onCheckedChange={(checked) => setNewUserCanWrite(checked as boolean)}
                />
                <div className="space-y-1">
                  <Label htmlFor="can-write" className="font-bold">Full Access (Write Permissions)</Label>
                  <p className="text-xs text-muted-foreground">
                    If unchecked, user will have read-only access
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="ghost" onClick={() => setShowAddUser(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button onClick={handleAddUser} className="rounded-xl shadow-lg shadow-primary/10">Add User Account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
