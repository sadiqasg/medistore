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
import { User, Bell, Shield, Building2, Users, Plus, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { toast } = useToast();
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserCanWrite, setNewUserCanWrite] = useState(false);
  const [companyName, setCompanyName] = useState(mockCompanySettings.name);
  const [maxDebtPerCustomer, setMaxDebtPerCustomer] = useState(mockCompanySettings.maxDebtPerCustomer);

  const initials = mockUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

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
      <div className="space-y-8 max-w-4xl">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account, company settings, and user permissions.
          </p>
        </div>

        {/* Company Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Company Settings</CardTitle>
            </div>
            <CardDescription>
              Configure your business details and operational limits.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-debt">Maximum Debt Per Customer</Label>
                <Input
                  id="max-debt"
                  type="number"
                  min="0"
                  value={maxDebtPerCustomer}
                  onChange={(e) => setMaxDebtPerCustomer(Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Current: {formatCurrency(maxDebtPerCustomer)}
                </p>
              </div>
            </div>
            <Button onClick={handleSaveCompanySettings}>Save Company Settings</Button>
          </CardContent>
        </Card>

        {/* Profile section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Profile</CardTitle>
            </div>
            <CardDescription>
              Your personal information and account details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{mockUser.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">{mockUser.email}</p>
                  <Badge variant="secondary" className="capitalize">
                    {mockUser.role}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={mockUser.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={mockUser.email} />
              </div>
            </div>

            <Button>Save Profile</Button>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <CardTitle>User Management</CardTitle>
              </div>
              <Button size="sm" onClick={() => setShowAddUser(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
            <CardDescription>
              Manage sub-admins and their permissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="table-container">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Permissions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id} className="data-row">
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.canWrite ? 'secondary' : 'outline'}
                          className={user.canWrite ? 'bg-success/10 text-success' : ''}
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

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure how you receive alerts and updates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Low Stock Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when items fall below minimum threshold
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Customer Debt Warnings</Label>
                <p className="text-sm text-muted-foreground">
                  Alert when customer debt exceeds the maximum limit
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Expense Approvals</Label>
                <p className="text-sm text-muted-foreground">
                  Notify when expenses need your approval
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Daily Summary</Label>
                <p className="text-sm text-muted-foreground">
                  Receive daily P&L summary
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>
              Manage your password and security settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div />
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </div>
            <Button variant="outline">Update Password</Button>
          </CardContent>
        </Card>

        {/* Add User Dialog */}
        <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Add a sub-admin to help manage the store. A temporary password will be generated.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-user-name">Full Name</Label>
                <Input
                  id="new-user-name"
                  placeholder="Enter name"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-user-email">Email Address</Label>
                <Input
                  id="new-user-email"
                  type="email"
                  placeholder="Enter email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="can-write"
                  checked={newUserCanWrite}
                  onCheckedChange={(checked) => setNewUserCanWrite(checked as boolean)}
                />
                <div>
                  <Label htmlFor="can-write">Full Access (Write Permissions)</Label>
                  <p className="text-xs text-muted-foreground">
                    If unchecked, user will have read-only access
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddUser(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
