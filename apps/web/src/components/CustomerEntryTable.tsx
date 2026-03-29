import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/mockData';
import { format } from 'date-fns';

interface Transaction {
  date: string | Date;
  supply: string;
  items_number: number;
  unit: string;
  total: number;
  amount_paid: number;
  balance: number;
  payment_method: string;
}

interface CustomerEntryTableProps {
  transactions: Transaction[];
}

export function CustomerEntryTable({ transactions }: CustomerEntryTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-bold">DATE</TableHead>
            <TableHead className="font-bold">SUPPLY</TableHead>
            <TableHead className="text-right font-bold">ITEMS NUMBER</TableHead>
            <TableHead className="font-bold">UNIT</TableHead>
            <TableHead className="text-right font-bold">TOTAL</TableHead>
            <TableHead className="text-right font-bold">AMOUNT PAID</TableHead>
            <TableHead className="text-right font-bold">BALANCE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx, index) => (
            <TableRow key={index} className="hover:bg-muted/30 transition-colors">
              <TableCell className="text-xs font-medium">
                {typeof tx.date === 'string' ? tx.date : format(tx.date, 'dd/MM/yyyy')}
              </TableCell>
              <TableCell className="text-xs">
                {tx.supply}
              </TableCell>
              <TableCell className="text-right font-mono">
                {tx.items_number}
              </TableCell>
              <TableCell className="text-xs italic">
                {tx.unit}
              </TableCell>
              <TableCell className="text-right font-mono font-medium">
                {formatCurrency(tx.total)}
              </TableCell>
              <TableCell className="text-right font-mono text-success">
                {formatCurrency(tx.amount_paid)}
              </TableCell>
              <TableCell className="text-right font-mono text-destructive font-bold">
                {formatCurrency(tx.balance)}
              </TableCell>
            </TableRow>
          ))}
          {transactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                No transactions found for this period.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
