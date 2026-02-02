import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  mockInventory,
  formatCurrency,
  getStockStatus,
  getProductDisplayName,
  type InventoryItem,
} from '@/lib/mockData';
import { Sparkline } from '@/components/dashboard/Sparkline';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Download,
  Plus,
  ArrowUpDown,
  AlertTriangle,
  Package,
  XCircle,
} from 'lucide-react';

type SortField = 'name' | 'currentStock' | 'unitPrice' | 'size';
type SortOrder = 'asc' | 'desc';

export function InventoryTable() {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const filteredAndSorted = useMemo(() => {
    let items = [...mockInventory];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.sku.toLowerCase().includes(searchLower) ||
          item.size.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    items.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'currentStock':
          comparison = a.currentStock - b.currentStock;
          break;
        case 'unitPrice':
          comparison = a.unitPrice - b.unitPrice;
          break;
        case 'size':
          comparison = a.size.localeCompare(b.size);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return items;
  }, [search, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getStockBadge = (item: InventoryItem) => {
    const status = getStockStatus(item.currentStock, item.minStock, item.maxStock);
    switch (status) {
      case 'out':
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Out of Stock
          </Badge>
        );
      case 'low':
        return (
          <Badge variant="outline" className="gap-1 border-warning text-warning">
            <AlertTriangle className="h-3 w-3" />
            Low Stock
          </Badge>
        );
      case 'high':
        return <Badge className="bg-success text-success-foreground">Overstocked</Badge>;
      default:
        return <Badge variant="secondary">Normal</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, SKU, or size..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Inventory
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[280px]">
                <button
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                  onClick={() => handleSort('name')}
                >
                  Product
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                  onClick={() => handleSort('size')}
                >
                  Size
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button
                  className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors"
                  onClick={() => handleSort('currentStock')}
                >
                  Crates
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Trend (7d)</TableHead>
              <TableHead className="text-right">
                <button
                  className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors"
                  onClick={() => handleSort('unitPrice')}
                >
                  Price/Crate
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSorted.map((item, index) => (
              <TableRow
                key={item.id}
                className={cn(
                  'data-row animate-fade-in',
                  item.isOutOfStock && 'opacity-60'
                )}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg',
                      item.isOutOfStock ? 'bg-muted' : 'bg-primary/10'
                    )}>
                      <Package className={cn(
                        'h-5 w-5',
                        item.isOutOfStock ? 'text-muted-foreground' : 'text-primary'
                      )} />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {item.sku}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{item.size}</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className={cn(
                    'font-mono tabular-nums font-medium',
                    item.currentStock === 0 && 'text-destructive'
                  )}>
                    {item.currentStock}
                  </span>
                  <span className="text-muted-foreground text-xs ml-1">
                    / {item.maxStock}
                  </span>
                </TableCell>
                <TableCell>{getStockBadge(item)}</TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Sparkline data={item.trend} width={80} height={24} showArea />
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {formatCurrency(item.unitPrice * 12)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredAndSorted.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Package className="h-12 w-12 mb-3 opacity-50" />
            <p className="font-medium">No items found</p>
            <p className="text-sm">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
