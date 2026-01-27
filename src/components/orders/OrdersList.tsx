import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  Calendar,
  Plus,
} from 'lucide-react';
import { formatCurrency, type CocaColaOrder } from '@/lib/mockData';
import { CocaColaOrderDialog } from './CocaColaOrderDialog';
import { useToast } from '@/hooks/use-toast';

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Clock,
    badge: 'bg-warning/10 text-warning border-warning/30',
  },
  confirmed: {
    label: 'Confirmed',
    icon: Package,
    badge: 'bg-chart-1/10 text-chart-1 border-chart-1/30',
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCircle2,
    badge: 'bg-success/10 text-success border-success/30',
  },
};

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

        {/* Orders list */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Truck className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No orders yet</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowOrderDialog(true)}
                >
                  Book your first order
                </Button>
              </CardContent>
            </Card>
          ) : (
            orders.map((order, index) => {
              const config = statusConfig[order.status];
              const StatusIcon = config.icon;

              return (
                <Card
                  key={order.id}
                  className="animate-fade-in overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                      <div className="flex-1 p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">Order #{order.id}</h3>
                              <Badge variant="outline" className={config.badge}>
                                <StatusIcon className="mr-1 h-3 w-3" />
                                {config.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Ref: {order.depositReference}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold font-mono tabular-nums">
                              {formatCurrency(order.orderTotal)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Deposit: {formatCurrency(order.depositAmount)}
                            </p>
                          </div>
                        </div>

                        {/* Order items summary */}
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground mb-2">Items:</p>
                          <div className="flex flex-wrap gap-2">
                            {order.items.map((item, idx) => (
                              <Badge key={idx} variant="secondary">
                                {item.productName} × {item.crates} crates
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Order Date</p>
                              <p className="text-sm font-medium">{formatDate(order.orderDate)}</p>
                            </div>
                          </div>
                          {order.expectedDelivery && (
                            <div className="flex items-center gap-2">
                              <Truck className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">Expected Delivery</p>
                                <p className="text-sm font-medium">{formatDate(order.expectedDelivery)}</p>
                              </div>
                            </div>
                          )}
                          {order.deliveredDate && (
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-success" />
                              <div>
                                <p className="text-xs text-muted-foreground">Delivered</p>
                                <p className="text-sm font-medium">{formatDate(order.deliveredDate)}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action panel */}
                      {order.status !== 'delivered' && (
                        <div className="bg-muted/30 border-t lg:border-t-0 lg:border-l border-border p-4 lg:w-48 flex flex-col items-center justify-center gap-2">
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => handleMarkDelivered(order.id)}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Mark Delivered
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      <CocaColaOrderDialog open={showOrderDialog} onOpenChange={setShowOrderDialog} />
    </>
  );
}
