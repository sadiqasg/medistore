import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart as PieChartIcon, 
  Calendar,
  Wallet,
  Banknote,
  Users,
  History,
  ArrowRight,
  Download
} from 'lucide-react';
import { formatCurrency, mockSales, mockExpenses } from '@/lib/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data for profit sharers
const mockProfitSharers = [
  { id: 1, name: 'Managing Director', percentage: 40, totalPaid: 150000 },
  { id: 2, name: 'Executive Partner', percentage: 30, totalPaid: 110000 },
  { id: 3, name: 'Operations Lead', percentage: 20, totalPaid: 75000 },
  { id: 4, name: 'Reserve Fund', percentage: 10, totalPaid: 0 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function FinancialDashboard() {
  const [dateRange, setDateRange] = useState({ start: '2026-01-01', end: '2026-01-31' });

  // Calculate totals
  const totalRevenue = mockSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const cashRevenue = mockSales.filter(s => s.paymentType === 'cash').reduce((sum, s) => sum + s.amountPaid, 0);
  const bankRevenue = totalRevenue - cashRevenue;
  const totalExpenses = mockExpenses.reduce((sum, e) => sum + e.totalAmount, 0);
  const netProfit = totalRevenue - totalExpenses;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Financial Management</h1>
            <p className="text-muted-foreground">Comprehensive overview of revenue, expenses, and profit distribution.</p>
          </div>
          <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-xl border border-border/50">
             <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium">
               <Calendar className="h-3.5 w-3.5" />
               <span>Period:</span>
               <span className="text-primary font-bold">{dateRange.start} - {dateRange.end}</span>
             </div>
             <Button variant="ghost" size="sm" className="h-8 rounded-lg">Change</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="metric-card border-primary/20 bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary">Net Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{formatCurrency(netProfit)}</div>
              <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                 <Badge className="h-4 px-1 text-[8px] bg-success/10 text-success border-success/30">+12%</Badge>
                 <span>from last period</span>
              </p>
            </CardContent>
          </Card>
          
          <Card className="metric-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold uppercase tracking-widest">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{formatCurrency(totalRevenue)}</div>
              <p className="text-[10px] text-muted-foreground mt-1">
                 Cash: {formatCurrency(cashRevenue)} | Bank: {formatCurrency(bankRevenue)}
              </p>
            </CardContent>
          </Card>

          <Card className="metric-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold uppercase tracking-widest">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono text-destructive">{formatCurrency(totalExpenses)}</div>
              <p className="text-[10px] text-muted-foreground mt-1">
                 24 transactions recorded
              </p>
            </CardContent>
          </Card>

          <Card className="metric-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold uppercase tracking-widest">Profit Margin</CardTitle>
              <PieChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{((netProfit / totalRevenue) * 100).toFixed(1)}%</div>
              <p className="text-[10px] text-muted-foreground mt-1">
                 Efficient operational state
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="balance-sheet" className="space-y-6">
          <TabsList className="bg-muted/50 p-1 rounded-xl h-auto">
            <TabsTrigger value="balance-sheet" className="gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-background">
              <Wallet className="h-4 w-4" />
              Balance Sheet
            </TabsTrigger>
            <TabsTrigger value="statement" className="gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-background">
              <History className="h-4 w-4" />
              Account Statement
            </TabsTrigger>
            <TabsTrigger value="profit-sharing" className="gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-background">
              <Users className="h-4 w-4" />
              Profit Sharing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="balance-sheet" className="space-y-6">
             <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass-card">
                   <CardHeader>
                      <CardTitle className="text-lg">Revenue vs Expenses</CardTitle>
                      <CardDescription>Visual comparison of income and operational costs.</CardDescription>
                   </CardHeader>
                   <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={mockSales.slice(0, 7).map((s, i) => ({ name: `Day ${i+1}`, revenue: s.totalAmount, expenses: totalExpenses / 30 }))}>
                            <defs>
                               <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <XAxis dataKey="name" fontSize={10} hide />
                            <YAxis fontSize={10} hide />
                            <Tooltip />
                            <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                            <Area type="monotone" dataKey="expenses" stroke="hsl(var(--destructive))" fillOpacity={0} strokeDasharray="5 5" />
                         </AreaChart>
                      </ResponsiveContainer>
                   </CardContent>
                </Card>

                <Card className="glass-card">
                   <CardHeader>
                      <CardTitle className="text-lg">Revenue Sources</CardTitle>
                      <CardDescription>Breakdown by payment method (Cash vs Bank).</CardDescription>
                   </CardHeader>
                   <CardContent className="flex flex-col items-center justify-center pt-4">
                      <div className="h-[200px] w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                               <Pie
                                  data={[
                                     { name: 'Cash', value: cashRevenue },
                                     { name: 'Bank', value: bankRevenue }
                                  ]}
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={5}
                                  dataKey="value"
                               >
                                  <Cell fill="hsl(var(--primary))" />
                                  <Cell fill="hsl(var(--muted))" />
                               </Pie>
                               <Tooltip />
                            </PieChart>
                         </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-8 mt-4 w-full">
                         <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                               <div className="h-3 w-3 rounded-full bg-primary" />
                               <span className="text-xs font-medium">Cash Income</span>
                            </div>
                            <span className="text-lg font-bold font-mono">{formatCurrency(cashRevenue)}</span>
                            <span className="text-[10px] text-muted-foreground">{((cashRevenue/totalRevenue)*100).toFixed(0)}% of total</span>
                         </div>
                         <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                               <div className="h-3 w-3 rounded-full bg-muted" />
                               <span className="text-xs font-medium">Bank Income</span>
                            </div>
                            <span className="text-lg font-bold font-mono">{formatCurrency(bankRevenue)}</span>
                            <span className="text-[10px] text-muted-foreground">{((bankRevenue/totalRevenue)*100).toFixed(0)}% of total</span>
                         </div>
                      </div>
                   </CardContent>
                </Card>
             </div>
          </TabsContent>

          <TabsContent value="profit-sharing" className="space-y-6">
             <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 glass-card">
                   <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Profit Allocation</CardTitle>
                        <CardDescription>Distribution of net profit among registered sharers.</CardDescription>
                      </div>
                      <Button size="sm" className="gap-2">
                         <Users className="h-4 w-4" />
                         Add Sharer
                      </Button>
                   </CardHeader>
                   <CardContent>
                      <div className="rounded-xl border border-border/50 overflow-hidden">
                         <table className="w-full text-sm">
                            <thead className="bg-muted/50 border-b border-border/50">
                               <tr>
                                  <th className="text-left px-4 py-3 font-bold">NAME</th>
                                  <th className="text-center px-4 py-3 font-bold">%</th>
                                  <th className="text-right px-4 py-3 font-bold">ALLOCATED</th>
                                  <th className="text-right px-4 py-3 font-bold">PAID</th>
                                  <th className="text-right px-4 py-3 font-bold">BALANCE</th>
                               </tr>
                            </thead>
                            <tbody>
                               {mockProfitSharers.map((sharer) => {
                                  const allocatedAmount = (sharer.percentage / 100) * netProfit;
                                  const balance = allocatedAmount - sharer.totalPaid;
                                  return (
                                     <tr key={sharer.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                                        <td className="px-4 py-4 font-semibold">{sharer.name}</td>
                                        <td className="px-4 py-4 text-center">
                                           <Badge variant="outline" className="font-mono">{sharer.percentage}%</Badge>
                                        </td>
                                        <td className="px-4 py-4 text-right font-mono">{formatCurrency(allocatedAmount)}</td>
                                        <td className="px-4 py-4 text-right font-mono text-success">{formatCurrency(sharer.totalPaid)}</td>
                                        <td className="px-4 py-4 text-right font-mono text-destructive font-bold">{formatCurrency(balance)}</td>
                                     </tr>
                                  );
                               })}
                            </tbody>
                         </table>
                      </div>
                   </CardContent>
                </Card>

                <Card className="glass-card border-success/20">
                   <CardHeader>
                      <CardTitle className="text-lg">Recent Payouts</CardTitle>
                      <CardDescription>Tracking historical payments to sharers.</CardDescription>
                   </CardHeader>
                   <CardContent>
                      <div className="space-y-4">
                         {[
                            { name: 'Managing Director', amount: 50000, date: '2026-01-24' },
                            { name: 'Executive Partner', amount: 35000, date: '2026-01-18' },
                            { name: 'Operations Lead', amount: 15000, date: '2026-01-15' },
                         ].map((p, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30">
                               <div className="flex flex-col">
                                  <span className="text-sm font-bold">{p.name}</span>
                                  <span className="text-[10px] text-muted-foreground uppercase">{p.date}</span>
                               </div>
                               <div className="text-sm font-mono font-bold text-success">+{formatCurrency(p.amount)}</div>
                            </div>
                         ))}
                         <Button variant="outline" className="w-full mt-2 gap-2 text-xs">
                            <History className="h-3 w-3" />
                            View Full Payout History
                         </Button>
                      </div>
                   </CardContent>
                </Card>
             </div>
          </TabsContent>

          <TabsContent value="statement" className="space-y-6">
             <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between">
                   <div>
                     <CardTitle className="text-lg">Account Statement Summary</CardTitle>
                     <CardDescription>Comprehensive ledger of all transactions in the defined period.</CardDescription>
                   </div>
                   <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export CSV
                   </Button>
                </CardHeader>
                <CardContent>
                   <div className="grid gap-6 md:grid-cols-3 mb-6">
                      <div className="p-4 rounded-xl bg-muted/20 border border-border/30 flex flex-col items-center">
                         <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Total Sales</span>
                         <span className="text-xl font-bold font-mono">{formatCurrency(totalRevenue)}</span>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/20 border border-border/30 flex flex-col items-center">
                         <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Cash in Hand</span>
                         <span className="text-xl font-bold font-mono text-success">{formatCurrency(cashRevenue)}</span>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/20 border border-border/30 flex flex-col items-center">
                         <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Bank Balance</span>
                         <span className="text-xl font-bold font-mono text-primary">{formatCurrency(bankRevenue)}</span>
                      </div>
                   </div>
                   
                   <div className="rounded-xl border border-border/50 overflow-hidden">
                      <table className="w-full text-sm">
                         <thead className="bg-muted/50 border-b border-border/50">
                            <tr>
                               <th className="text-left px-4 py-3 font-bold">DATE</th>
                               <th className="text-left px-4 py-3 font-bold">DESCRIPTION</th>
                               <th className="text-center px-4 py-3 font-bold">TYPE</th>
                               <th className="text-right px-4 py-3 font-bold">CREDIT</th>
                               <th className="text-right px-4 py-3 font-bold">DEBIT</th>
                               <th className="text-right px-4 py-3 font-bold">BALANCE</th>
                            </tr>
                         </thead>
                         <tbody>
                            {[
                               { date: '2026-01-26', desc: 'Sale: Oga Tunde (Sprite, Eva)', type: 'Income', credit: 7600, debit: 0, balance: 142000 },
                               { date: '2026-01-25', desc: 'Expense: Delivery Fuel', type: 'Expense', credit: 0, debit: 1200, balance: 134400 },
                               { date: '2026-01-24', desc: 'Sale: Cash Customer (Coke, Fanta)', type: 'Income', credit: 7800, debit: 0, balance: 135600 },
                               { date: '2026-01-24', desc: 'Profit Payout: Managing Director', type: 'Payout', credit: 0, debit: 50000, balance: 127800 },
                            ].map((row, i) => (
                               <tr key={i} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                                  <td className="px-4 py-4 text-xs font-medium">{row.date}</td>
                                  <td className="px-4 py-4">{row.desc}</td>
                                  <td className="px-4 py-4 text-center">
                                     <Badge variant="outline" className="text-[10px] uppercase font-bold">{row.type}</Badge>
                                  </td>
                                  <td className="px-4 py-4 text-right font-mono text-success">{row.credit > 0 ? `+${formatCurrency(row.credit)}` : '-'}</td>
                                  <td className="px-4 py-4 text-right font-mono text-destructive">{row.debit > 0 ? `-${formatCurrency(row.debit)}` : '-'}</td>
                                  <td className="px-4 py-4 text-right font-mono font-bold">{formatCurrency(row.balance)}</td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
