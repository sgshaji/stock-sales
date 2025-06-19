import { useState, useEffect, useMemo, memo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search";
import { 
  Plus, 
  Calendar,
  ShoppingCart,
  User,
  DollarSign,
  Package,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Filter,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Eye,
  MoreVertical,
  Scan
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MobileBottomSheet } from "@/components/mobile/MobileBottomSheet";
import { SalesEntryForm } from "./SalesEntryForm";
import { SalesDateFilter } from "./SalesDateFilter";
import { cn } from "@/lib/utils";

// Mock data - in real app this would come from Supabase
const mockSales = [
  {
    id: 1,
    customerName: "John Doe",
    items: [
      { name: "Premium Headphones", quantity: 2, unitPrice: 99.99, discount: 0 },
      { name: "USB Cable", quantity: 1, unitPrice: 8.99, discount: 10 }
    ],
    subtotal: 207.97,
    totalDiscount: 0.90,
    finalTotal: 207.07,
    date: "2024-01-15",
    time: "14:30",
    status: "completed"
  },
  {
    id: 2,
    customerName: "Jane Smith",
    items: [
      { name: "Wireless Mouse", quantity: 1, unitPrice: 29.99, discount: 0 }
    ],
    subtotal: 29.99,
    totalDiscount: 0,
    finalTotal: 29.99,
    date: "2024-01-15",
    time: "13:45",
    status: "completed"
  },
  {
    id: 3,
    customerName: "Bob Wilson",
    items: [
      { name: "Bluetooth Speaker", quantity: 3, unitPrice: 45.99, discount: 5 },
      { name: "Phone Case", quantity: 2, unitPrice: 12.99, discount: 0 }
    ],
    subtotal: 163.95,
    totalDiscount: 6.90,
    finalTotal: 157.05,
    date: "2024-01-14",
    time: "16:20",
    status: "pending"
  },
  {
    id: 4,
    items: [
      { name: "Power Bank", quantity: 1, unitPrice: 35.99, discount: 0 }
    ],
    subtotal: 35.99,
    totalDiscount: 0,
    finalTotal: 35.99,
    date: "2024-01-14",
    time: "11:15",
    status: "completed"
  },
  {
    id: 5,
    customerName: "Alice Brown",
    items: [
      { name: "Tablet Stand", quantity: 1, unitPrice: 24.99, discount: 15 }
    ],
    subtotal: 24.99,
    totalDiscount: 3.75,
    finalTotal: 21.24,
    date: "2024-01-13",
    time: "09:30",
    status: "cancelled"
  }
];

const mockInventory = [
  { id: 1, name: "Premium Headphones", price: 99.99, stock: 15 },
  { id: 2, name: "Wireless Mouse", price: 29.99, stock: 25 },
  { id: 3, name: "Bluetooth Speaker", price: 45.99, stock: 8 },
  { id: 4, name: "USB Cable", price: 8.99, stock: 50 },
  { id: 5, name: "Phone Case", price: 12.99, stock: 30 },
  { id: 6, name: "Power Bank", price: 35.99, stock: 12 },
  { id: 7, name: "Tablet Stand", price: 24.99, stock: 18 },
  { id: 8, name: "Wireless Charger", price: 19.99, stock: 22 },
  { id: 9, name: "Screen Protector", price: 9.99, stock: 40 },
  { id: 10, name: "Car Mount", price: 15.99, stock: 14 }
];

interface MobileSalesEntryProps {
  searchQuery?: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return { icon: CheckCircle2, color: "text-success-500", bgColor: "bg-success-500" };
    case "pending":
      return { icon: Clock, color: "text-warning-500", bgColor: "bg-warning-500" };
    case "cancelled":
      return { icon: AlertTriangle, color: "text-error-500", bgColor: "bg-error-500" };
    default:
      return { icon: CheckCircle2, color: "text-gray-500", bgColor: "bg-gray-500" };
  }
};

const SaleItem = memo<{
  sale: any;
  onView: (sale: any) => void;
}>(({ sale, onView }) => {
  const status = useMemo(() => getStatusIcon(sale.status), [sale.status]);
  const handleView = useCallback(() => onView(sale), [onView, sale]);
  
  // Generate sale name based on items
  const saleName = sale.items.length === 1 
    ? sale.items[0].name
    : `${sale.items[0].name} +${sale.items.length - 1} more`;

  return (
    <Card 
      className="bg-white hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98]"
      onClick={handleView}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Sale Avatar */}
          <div className="relative flex-shrink-0">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm",
              status.bgColor
            )}>
              #{sale.id}
            </div>
            <div className={cn(
              "absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center bg-white",
              status.bgColor
            )}>
              <status.icon className={cn("w-2.5 h-2.5", status.color)} />
            </div>
          </div>

          {/* Sale Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate leading-tight">
              {saleName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">
                {sale.items.reduce((total: number, item: any) => total + item.quantity, 0)} items
              </span>
              {sale.customerName && (
                <>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3 text-gray-400" />
                    <span className="text-sm text-gray-500 truncate">{sale.customerName}</span>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Calendar className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                {new Date(sale.date).toLocaleDateString()} at {sale.time}
              </span>
            </div>
          </div>

          {/* Price and Status */}
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-bold text-primary-600">
              ${sale.finalTotal.toFixed(2)}
            </div>
            {sale.totalDiscount > 0 && (
              <div className="text-xs text-gray-500 line-through">
                ${sale.subtotal.toFixed(2)}
              </div>
            )}
            <Badge 
              variant={sale.status === 'completed' ? 'success' : sale.status === 'pending' ? 'warning' : 'destructive'}
              className="text-xs mt-1"
            >
              {sale.status}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

SaleItem.displayName = "SaleItem";

export const MobileSalesEntry = memo<MobileSalesEntryProps>(({ searchQuery }) => {
  const [showNewSale, setShowNewSale] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [localSearch, setLocalSearch] = useState("");
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const { toast } = useToast();

  const effectiveSearch = searchQuery || localSearch;

  // Filter sales by selected date and search query
  const filteredSales = useMemo(() => {
    return mockSales.filter(sale => {
      const matchesDate = sale.date === selectedDate;
      const matchesSearch = !effectiveSearch || 
        sale.items.some(item => item.name.toLowerCase().includes(effectiveSearch.toLowerCase())) ||
        (sale.customerName && sale.customerName.toLowerCase().includes(effectiveSearch.toLowerCase()));
      
      return matchesDate && matchesSearch;
    });
  }, [selectedDate, effectiveSearch]);

  // Calculate today's stats
  const todayStats = useMemo(() => {
    const todaySales = mockSales.filter(sale => sale.date === selectedDate && sale.status === 'completed');
    const totalRevenue = todaySales.reduce((sum, sale) => sum + sale.finalTotal, 0);
    const totalItems = todaySales.reduce((sum, sale) => 
      sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    const totalTransactions = todaySales.length;
    
    return { totalRevenue, totalItems, totalTransactions };
  }, [selectedDate]);

  const handleNewSale = useCallback(() => {
    setShowNewSale(true);
  }, []);

  const handleViewSale = useCallback((sale: any) => {
    setSelectedSale(sale);
  }, []);

  const handleSaleComplete = useCallback((saleData: any) => {
    // TODO: Save to Supabase and update inventory
    toast({
      title: "Sale Recorded",
      description: `Successfully recorded sale of $${saleData.finalTotal.toFixed(2)}`,
    });
    setShowNewSale(false);
  }, [toast]);

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header with Date and Stats */}
      <div className="bg-white border-b border-gray-200 p-4 space-y-4">
        {/* Date Selector */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setShowDateFilter(true)}
            className="gap-2 h-10 rounded-full"
          >
            <Calendar className="h-4 w-4" />
            {isToday ? "Today" : new Date(selectedDate).toLocaleDateString()}
          </Button>
          <Button
            onClick={handleNewSale}
            className="h-10 bg-primary-600 hover:bg-primary-700 rounded-full gap-2"
          >
            <Plus className="h-4 w-4" />
            New Sale
          </Button>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-gradient-to-br from-success-50 to-success-100 rounded-xl border border-success-200">
            <div className="text-lg font-bold text-success-700">
              ${todayStats.totalRevenue.toFixed(0)}
            </div>
            <div className="text-xs text-success-600">Revenue</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl border border-primary-200">
            <div className="text-lg font-bold text-primary-700">
              {todayStats.totalTransactions}
            </div>
            <div className="text-xs text-primary-600">Sales</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-info-50 to-info-100 rounded-xl border border-info-200">
            <div className="text-lg font-bold text-info-700">
              {todayStats.totalItems}
            </div>
            <div className="text-xs text-info-600">Items</div>
          </div>
        </div>

        {/* Search */}
        {!searchQuery && (
          <SearchInput
            placeholder="Search sales, customers, products..."
            onSearch={setLocalSearch}
            className="h-12 rounded-full bg-gray-100 border-0"
          />
        )}
      </div>

      {/* Sales List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredSales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <ShoppingCart className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {effectiveSearch ? "No sales found" : "No sales recorded"}
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm">
              {effectiveSearch 
                ? `No sales match "${effectiveSearch}" for ${isToday ? 'today' : new Date(selectedDate).toLocaleDateString()}`
                : `No sales recorded for ${isToday ? 'today' : new Date(selectedDate).toLocaleDateString()}`
              }
            </p>
            <Button onClick={handleNewSale} className="gap-2">
              <Plus className="h-4 w-4" />
              Record First Sale
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSales.map((sale) => (
              <SaleItem
                key={sale.id}
                sale={sale}
                onView={handleViewSale}
              />
            ))}
          </div>
        )}
      </div>

      {/* New Sale Form */}
      <MobileBottomSheet
        isOpen={showNewSale}
        onClose={() => setShowNewSale(false)}
        title="New Sale"
        className="h-[95vh]"
      >
        <SalesEntryForm 
          inventory={mockInventory}
          onComplete={handleSaleComplete}
          onCancel={() => setShowNewSale(false)}
        />
      </MobileBottomSheet>

      {/* Date Filter */}
      <MobileBottomSheet
        isOpen={showDateFilter}
        onClose={() => setShowDateFilter(false)}
        title="Select Date"
      >
        <SalesDateFilter
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onClose={() => setShowDateFilter(false)}
        />
      </MobileBottomSheet>

      {/* Sale Details */}
      {selectedSale && (
        <MobileBottomSheet
          isOpen={!!selectedSale}
          onClose={() => setSelectedSale(null)}
          title={`Sale #${selectedSale.id}`}
        >
          <div className="p-4 space-y-4">
            {/* Sale Summary */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">Sale Details</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedSale.date).toLocaleDateString()} at {selectedSale.time}
                    </p>
                  </div>
                  <Badge variant={selectedSale.status === 'completed' ? 'success' : 'warning'}>
                    {selectedSale.status}
                  </Badge>
                </div>
                
                {selectedSale.customerName && (
                  <div className="flex items-center gap-2 mb-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{selectedSale.customerName}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${selectedSale.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedSale.totalDiscount > 0 && (
                    <div className="flex justify-between text-sm text-success-600">
                      <span>Discount:</span>
                      <span>-${selectedSale.totalDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-primary-600">${selectedSale.finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items List */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Items Sold</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {selectedSale.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          ${item.unitPrice.toFixed(2)} × {item.quantity}
                          {item.discount > 0 && ` (${item.discount}% off)`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${((item.unitPrice * item.quantity) * (1 - item.discount / 100)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </MobileBottomSheet>
      )}
    </div>
  );
});

MobileSalesEntry.displayName = "MobileSalesEntry";