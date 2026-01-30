import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Truck, Plus, CheckCircle2 } from 'lucide-react';
import { formatCurrency, type CocaColaOrder } from '@/lib/mockData';
import { CocaColaOrderDialog } from './CocaColaOrderDialog';
import { useToast } from '@/hooks/use-toast';

interface OrdersListProps {
  orders: CocaColaOrder[];
}

export function OrdersList({ orders }: OrdersListProps) {
  const { toast } = useToast();
  const [showOrderDialog, setShowOrderDialog] = useState(false);

  const handleMarkDelivered = (orderId: string) => {
    toast({
      title: 'Order Marked as Delivered',
      description: 'Inventory has been updated with the delivered items.',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Flatten orders into rows (one row per item for detailed view)
  const orderRows = orders.flatMap((order) =>
    order.items.map((item, idx) => ({
      orderId: order.id,
      date: order.orderDate,
      itemName: item.productName,
      qty: item.crates,
      unitPrice: item.unitCost,
      totalPrice: item.crates * item.unitCost,
      amountPaid: idx === 0 ? order.depositAmount : 0, // Show deposit on first item row
      balance: idx === 0 ? order.orderTotal - order.depositAmount : 0,
      status: order.status,
      isFirstItem: idx === 0,
      itemCount: order.items.length,
    }))
  );

  // Calculate totals
  const totalOrderValue = orders.reduce((sum, o) => sum + o.orderTotal, 0);
  const totalPaid = orders.reduce((sum, o) => sum + o.depositAmount, 0);
  const totalBalance = totalOrderValue - totalPaid;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Coca-Cola Orders</h2>
            <p className="text-sm text-muted-foreground">
              Track your orders and deliveries from Coca-Cola
            </p>
          </div>
          <Button onClick={() => setShowOrderDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Book Order
          </Button>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Truck className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No orders yet</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowOrderDialog(true)}
                >
                  Book your first order
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>DATE</TableHead>
                      <TableHead>ITEMS</TableHead>
                      <TableHead className="text-right">QTY (Crates)</TableHead>
                      <TableHead className="text-right">UNIT PRICE</TableHead>
                      <TableHead className="text-right">TOTAL PRICE</TableHead>
                      <TableHead className="text-right">AMOUNT PAID</TableHead>
                      <TableHead className="text-right">BALANCE</TableHead>
                      <TableHead className="text-center">ACTION</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderRows.map((row, index) => (
                      <TableRow key={`${row.orderId}-${index}`}>
                        <TableCell className="font-medium">
                          {row.isFirstItem ? formatDate(row.date) : ''}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {row.itemName}
                            {row.isFirstItem && (
                              <Badge
                                variant="outline"
                                className={
                                  row.status === 'delivered'
                                    ? 'bg-success/10 text-success border-success/30'
                                    : row.status === 'confirmed'
                                    ? 'bg-chart-1/10 text-chart-1 border-chart-1/30'
                                    : 'bg-warning/10 text-warning border-warning/30'
                                }
                              >
                                {row.status}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {row.qty}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(row.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(row.totalPrice)}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {row.isFirstItem ? formatCurrency(row.amountPaid) : ''}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {row.isFirstItem ? (
                            <span className={row.balance > 0 ? 'text-destructive' : 'text-success'}>
                              {formatCurrency(row.balance)}
                            </span>
                          ) : ''}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.isFirstItem && row.status !== 'delivered' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkDelivered(row.orderId)}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Summary row */}
            {orders.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-6 justify-end text-sm">
                <div>
                  <span className="text-muted-foreground">Total Order Value: </span>
                  <span className="font-mono font-semibold">{formatCurrency(totalOrderValue)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Paid: </span>
                  <span className="font-mono font-semibold text-success">{formatCurrency(totalPaid)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Balance: </span>
                  <span className={`font-mono font-semibold ${totalBalance > 0 ? 'text-destructive' : 'text-success'}`}>
                    {formatCurrency(totalBalance)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CocaColaOrderDialog open={showOrderDialog} onOpenChange={setShowOrderDialog} />
    </>
  );
}
