import { useState, useEffect, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingGrid, LoadingCard } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { TrendingUp, Package, DollarSign, AlertTriangle, ArrowUp, ShoppingCart, Users, Plus, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardProps {
  searchQuery?: string;
}

const Dashboard = memo<DashboardProps>(({ searchQuery }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(true);
  const { user } = useAuth();

  // Mock low stock items - in real app this would come from your inventory
  const lowStockItems = [
    { id: 1, name: "Premium Headphones", sku: "HD001", stock: 3, reorderPoint: 20 },
    { id: 2, name: "Wireless Mouse", sku: "MS002", stock: 1, reorderPoint: 15 },
    { id: 3, name: "USB Cable", sku: "USB003", stock: 2, reorderPoint: 25 },
    { id: 4, name: "Phone Case", sku: "PC004", stock: 0, reorderPoint: 10 },
    { id: 5, name: "Bluetooth Speaker", sku: "BS005", stock: 4, reorderPoint: 30 },
    { id: 6, name: "Power Bank", sku: "PB006", stock: 1, reorderPoint: 12 },
  ];

  // Show only first 3 items, with option to view more
  const displayedLowStockItems = lowStockItems.slice(0, 3);
  const hasMoreLowStockItems = lowStockItems.length > 3;

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <LoadingGrid count={4} />
        <LoadingCard count={2} />
      </div>
    );
  }

  // Show empty state if no data and searching
  if (searchQuery && searchQuery.length > 0 && !hasData) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="No results found"
        description={`No dashboard data matches "${searchQuery}". Try a different search term.`}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-md mx-auto">
      {/* RESTORED: 2x2 Grid Layout - Looks Better! */}
      <div className="grid grid-cols-2 gap-4 w-full">
        {/* Sales Card */}
        <Card className="bg-gradient-to-br from-success-50 to-success-100/50 border-success-200/50 shadow-sm overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-success-100 rounded-lg shadow-sm flex-shrink-0">
                <DollarSign className="h-4 w-4 text-success-600" />
              </div>
              <div className="flex items-center gap-1 text-success-600 text-xs bg-success-100 px-1.5 py-0.5 rounded-full border border-success-200 flex-shrink-0">
                <ArrowUp className="h-2.5 w-2.5" />
                <span>12%</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-gray-900 leading-tight">$1,247</div>
              <p className="text-xs text-gray-600">Sales Today</p>
              <Progress value={75} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        {/* Items Card */}
        <Card className="bg-gradient-to-br from-info-50 to-info-100/50 border-info-200/50 shadow-sm overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-info-100 rounded-lg shadow-sm flex-shrink-0">
                <Package className="h-4 w-4 text-info-600" />
              </div>
              <div className="flex items-center gap-1 text-info-600 text-xs bg-info-100 px-1.5 py-0.5 rounded-full border border-info-200 flex-shrink-0">
                <ArrowUp className="h-2.5 w-2.5" />
                <span>5%</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-gray-900 leading-tight">156</div>
              <p className="text-xs text-gray-600">Total Items</p>
              <Progress value={62} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-200/50 shadow-sm overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-primary-100 rounded-lg shadow-sm flex-shrink-0">
                <ShoppingCart className="h-4 w-4 text-primary-600" />
              </div>
              <div className="flex items-center gap-1 text-primary-600 text-xs bg-primary-100 px-1.5 py-0.5 rounded-full border border-primary-200 flex-shrink-0">
                <ArrowUp className="h-2.5 w-2.5" />
                <span>8%</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-gray-900 leading-tight">23</div>
              <p className="text-xs text-gray-600">Orders Today</p>
              <Progress value={85} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        {/* Customers Card */}
        <Card className="bg-gradient-to-br from-warning-50 to-warning-100/50 border-warning-200/50 shadow-sm overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-warning-100 rounded-lg shadow-sm flex-shrink-0">
                <Users className="h-4 w-4 text-warning-600" />
              </div>
              <div className="flex items-center gap-1 text-warning-600 text-xs bg-warning-100 px-1.5 py-0.5 rounded-full border border-warning-200 flex-shrink-0">
                <ArrowUp className="h-2.5 w-2.5" />
                <span>3%</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-gray-900 leading-tight">42</div>
              <p className="text-xs text-gray-600">Customers</p>
              <Progress value={45} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <Button 
          variant="outline" 
          className="h-12 gap-2 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200 hover:from-primary-100 hover:to-primary-150 w-full text-sm flex-col"
        >
          <Plus className="h-4 w-4 flex-shrink-0" />
          <span className="font-medium text-xs">Add Sale</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-12 gap-2 bg-gradient-to-r from-success-50 to-success-100 border-success-200 hover:from-success-100 hover:to-success-150 w-full text-sm flex-col"
        >
          <Package className="h-4 w-4 flex-shrink-0" />
          <span className="font-medium text-xs">Add Stock</span>
        </Button>
      </div>

      {/* SMART Low Stock Alerts - Handles Multiple Items Properly */}
      <Card className="bg-gradient-to-br from-destructive/5 to-warning/5 border-destructive/20 shadow-sm w-full overflow-hidden">
        <CardHeader className="pb-3 px-4 pt-4">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="p-2 bg-destructive/10 rounded-xl shadow-sm flex-shrink-0">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <span className="font-medium flex-1">Low Stock</span>
            <div className="bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm font-medium border border-destructive/20 flex-shrink-0">
              {lowStockItems.length} items
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          <div className="space-y-2">
            {displayedLowStockItems.map((item) => (
              <div key={item.id} className="p-3 bg-background rounded-xl border border-destructive/10 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-sm block truncate">{item.name}</span>
                    <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <span className={`font-bold text-sm ${item.stock === 0 ? 'text-destructive' : 'text-warning-600'}`}>
                      {item.stock === 0 ? 'Out of Stock' : `${item.stock} left`}
                    </span>
                    <p className="text-xs text-muted-foreground">Need: {item.reorderPoint}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Show "View More" if there are more items */}
            {hasMoreLowStockItems && (
              <Button 
                variant="ghost" 
                className="w-full h-10 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 gap-2"
                onClick={() => {
                  // Navigate to inventory page with low stock filter
                  console.log('Navigate to inventory with low stock filter');
                }}
              >
                <span>View {lowStockItems.length - 3} more items</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Sellers */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-sm w-full overflow-hidden">
        <CardHeader className="pb-3 px-4 pt-4">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="p-2 bg-primary-100 rounded-xl shadow-sm flex-shrink-0">
              <TrendingUp className="h-4 w-4 text-primary-600" />
            </div>
            <span className="font-medium flex-1">Top Sellers</span>
            <div className="bg-primary-50 text-primary-700 border-primary-200 px-3 py-1 rounded-full text-sm font-medium border flex-shrink-0">
              This Week
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          <div className="space-y-2">
            <div className="p-3 bg-white rounded-xl border border-primary-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0">
                  1
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-sm block truncate">Bluetooth Speaker</span>
                  <p className="text-xs text-gray-500">$45.99 each</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-bold text-success-600 text-sm">15 sold</span>
                  <p className="text-xs text-gray-500">$689.85</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-primary-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-gradient-to-r from-success-500 to-info-500 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0">
                  2
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-sm block truncate">Phone Case</span>
                  <p className="text-xs text-gray-500">$12.99 each</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-bold text-success-600 text-sm">12 sold</span>
                  <p className="text-xs text-gray-500">$155.88</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-primary-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-gradient-to-r from-warning-500 to-warning-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0">
                  3
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-sm block truncate">USB Cable</span>
                  <p className="text-xs text-gray-500">$8.99 each</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-bold text-success-600 text-sm">8 sold</span>
                  <p className="text-xs text-gray-500">$71.92</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

Dashboard.displayName = "Dashboard";

export default Dashboard;