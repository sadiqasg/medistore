import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { mockDailySummaries, formatCurrency } from '@/lib/mockData';

export function ProfitChart() {
  const chartData = useMemo(() => {
    return mockDailySummaries.map((day) => ({
      date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
      revenue: day.revenue,
      expenses: day.expenses,
      profit: day.netProfit,
    }));
  }, []);

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="font-semibold">Weekly P&L Overview</h3>
        <p className="text-sm text-muted-foreground">Revenue, expenses, and net profit</p>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(222, 47%, 35%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(222, 47%, 35%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 60%, 42%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(160, 60%, 42%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 12 }}
              tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(214, 20%, 88%)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number) => [formatCurrency(value), '']}
              labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(222, 47%, 35%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              name="Revenue"
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="hsl(160, 60%, 42%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorProfit)"
              name="Net Profit"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-chart-1" />
          <span className="text-sm text-muted-foreground">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-metric-positive" />
          <span className="text-sm text-muted-foreground">Net Profit</span>
        </div>
      </div>
    </div>
  );
}
