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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Truck, Plus, CheckCircle2, Pencil, DollarSign, MoreHorizontal } from 'lucide-react';
import { formatCurrency, type CocaColaOrder } from '@/lib/mockData';
import { CocaColaOrderDialog } from './CocaColaOrderDialog';
import { EditOrderDialog } from './EditOrderDialog';
import { RecordOrderPaymentDialog } from './RecordOrderPaymentDialog';
import { useToast } from '@/hooks/use-toast';

interface OrdersListProps {
  orders: CocaColaOrder[];
}

export function OrdersList({ orders }: OrdersListProps) {
  const { toast } = useToast();
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<CocaColaOrder | null>(null);

  const handleMarkDelivered = (order: CocaColaOrder) => {
    toast({
      title: 'Marked as Delivered ✅',
      description: `Order from ${order.customerName} has been marked as delivered.`,
      variant: 'success',
    });
  };

  const handleEdit = (order: CocaColaOrder) => {
    setSelectedOrder(order);
    setShowEditDialog(true);
  };

  const handleRecordPayment = (order: CocaColaOrder) => {
    setSelectedOrder(order);
    setShowPaymentDialog(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatItems = (items: CocaColaOrder['items']) => {
    return items.map(item => `${item.productName} (${item.crates})`).join(', ');
  };

  // Calculate totals
  const totalOrderValue = orders.reduce((sum, o) => sum + o.orderTotal, 0);
  const totalPaid = orders.reduce((sum, o) => sum + o.amountPaid, 0);
  const totalBalance = orders.reduce((sum, o) => sum + o.balance, 0);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Orders</h2>
            <p className="text-sm text-muted-foreground">
              Track your orders and deliveries
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
                      <TableHead>NAME</TableHead>
                      <TableHead>ITEMS</TableHead>
                      <TableHead className="text-right">PRICE</TableHead>
                      <TableHead className="text-right">PAID</TableHead>
                      <TableHead className="text-right">BALANCE</TableHead>
                      <TableHead className="text-center">STATUS</TableHead>
                      <TableHead className="text-center">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {formatDate(order.orderDate)}
                        </TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell className="max-w-[200px]">
                          <span className="text-sm truncate block" title={formatItems(order.items)}>
                            {formatItems(order.items)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(order.orderTotal)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-success">
                          {formatCurrency(order.amountPaid)}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          <span className={order.balance > 0 ? 'text-destructive' : 'text-success'}>
                            {formatCurrency(order.balance)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={
                              order.isDelivered
                                ? 'bg-success/10 text-success border-success/30'
                                : 'bg-warning/10 text-warning border-warning/30'
                            }
                          >
                            {order.isDelivered ? 'Delivered' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {!order.isDelivered && (
                                <DropdownMenuItem onClick={() => handleMarkDelivered(order)}>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Mark as Delivered
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleEdit(order)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Order
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRecordPayment(order)}>
                                <DollarSign className="mr-2 h-4 w-4" />
                                Record Payment
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
      <EditOrderDialog open={showEditDialog} onOpenChange={setShowEditDialog} order={selectedOrder} />
      <RecordOrderPaymentDialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog} order={selectedOrder} />
    </>
  );
}
