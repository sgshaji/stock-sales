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
import { useSales, type SaleWithItems } from "@/hooks/use-sales";
import { useInventory } from "@/hooks/use-inventory";
import { transformInventoryItem } from "@/types/inventory";

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
  sale: SaleWithItems;
  onView: (sale: SaleWithItems) => void;
}>(({ sale, onView }) => {
  const status = useMemo(() => getStatusIcon(sale.status), [sale.status]);
  const handleView = useCallback(() => onView(sale), [onView, sale]);
  
  // Generate sale name based on items
  const saleName = sale.items.length === 1 
    ? sale.items[0].item_name
    : `${sale.items[0]?.item_name || 'Sale'} +${sale.items.length - 1} more`;

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
              #{sale.id.slice(-4)}
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
                {sale.items.reduce((total, item) => total + item.quantity, 0)} items
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
                {new Date(sale.sale_date).toLocaleDateString()} at {sale.sale_time}
              </span>
            </div>
          </div>

          {/* Price and Status */}
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-bold text-primary-600">
              ${sale.final_total.toFixed(2)}
            </div>
            {sale.total_discount > 0 && (
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
  const [selectedSale, setSelectedSale] = useState<SaleWithItems | null>(null);
  const { toast } = useToast();

  // Use real data from database
  const { sales, loading, createSale, getSalesByDate, getSalesStats } = useSales();
  const { items: dbInventory } = useInventory();

  // Transform database inventory items to component format
  const inventory = useMemo(() => 
    dbInventory.map(transformInventoryItem), 
    [dbInventory]
  );

  const effectiveSearch = searchQuery || localSearch;

  // Filter sales by selected date and search query
  const filteredSales = useMemo(() => {
    return getSalesByDate(selectedDate).filter(sale => {
      const matchesSearch = !effectiveSearch || 
        sale.items.some(item => item.item_name.toLowerCase().includes(effectiveSearch.toLowerCase())) ||
        (sale.customerName && sale.customerName.toLowerCase().includes(effectiveSearch.toLowerCase()));
      
      return matchesSearch;
    });
  }, [getSalesByDate, selectedDate, effectiveSearch]);

  // Calculate today's stats
  const todayStats = useMemo(() => {
    return getSalesStats(selectedDate);
  }, [getSalesStats, selectedDate]);

  const handleNewSale = useCallback(() => {
    setShowNewSale(true);
  }, []);

  const handleViewSale = useCallback((sale: SaleWithItems) => {
    setSelectedSale(sale);
  }, []);

  const handleSaleComplete = useCallback(async (saleData: any) => {
    const result = await createSale(saleData);
    if (result.success) {
      setShowNewSale(false);
    }
  }, [createSale]);

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading sales...</p>
        </div>
      </div>
    );
  }

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
              Add Sales
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

      {/* New Sale Form - NO HEADER, SEARCH BAR AT TOP */}
      <MobileBottomSheet
        isOpen={showNewSale}
        onClose={() => setShowNewSale(false)}
        showHeader={false}
        className="h-[95vh]"
      >
        <SalesEntryForm 
          inventory={inventory}
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
          title={`Sale #${selectedSale.id.slice(-4)}`}
        >
          <div className="p-4 space-y-4">
            {/* Sale Summary */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">Sale Details</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedSale.sale_date).toLocaleDateString()} at {selectedSale.sale_time}
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
                  {selectedSale.total_discount > 0 && (
                    <div className="flex justify-between text-sm text-success-600">
                      <span>Discount:</span>
                      <span>-${selectedSale.total_discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-primary-600">${selectedSale.final_total.toFixed(2)}</span>
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
                  {selectedSale.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.item_name}</p>
                        <p className="text-xs text-gray-500">
                          ${item.unit_price.toFixed(2)} × {item.quantity}
                          {item.discount_percent > 0 && ` (${item.discount_percent}% off)`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${item.total.toFixed(2)}
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
