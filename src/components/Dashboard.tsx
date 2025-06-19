import { useState, useEffect, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingGrid, LoadingCard } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { TrendingUp, Package, DollarSign, AlertTriangle, ArrowUp, ShoppingCart, Users, Plus } from "lucide-react";
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
      {/* Key Metrics Grid - Optimized for Mobile */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <Card className="bg-gradient-to-br from-success-50 to-success-100/50 border-success-200/50 shadow-sm overflow-hidden">
          <CardHeader className="pb-2 px-3 pt-3">
            <CardTitle className="text-xs flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <div className="p-1.5 bg-success-100 rounded-lg shadow-sm flex-shrink-0">
                  <DollarSign className="h-3 w-3 text-success-600" />
                </div>
                <span className="text-gray-700 font-medium text-xs truncate">Sales</span>
              </div>
              <div className="flex items-center gap-0.5 text-success-600 text-xs bg-success-100 px-1.5 py-0.5 rounded-full border border-success-200 flex-shrink-0">
                <ArrowUp className="h-2.5 w-2.5" />
                <span className="text-xs">12%</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-0">
            <div className="text-xl font-bold text-gray-900 leading-tight">$1,247</div>
            <p className="text-xs text-gray-600 mt-0.5 truncate">+$134 today</p>
            <Progress value={75} className="mt-2 h-1.5" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-info-50 to-info-100/50 border-info-200/50 shadow-sm overflow-hidden">
          <CardHeader className="pb-2 px-3 pt-3">
            <CardTitle className="text-xs flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <div className="p-1.5 bg-info-100 rounded-lg shadow-sm flex-shrink-0">
                  <Package className="h-3 w-3 text-info-600" />
                </div>
                <span className="text-gray-700 font-medium text-xs truncate">Items</span>
              </div>
              <div className="flex items-center gap-0.5 text-info-600 text-xs bg-info-100 px-1.5 py-0.5 rounded-full border border-info-200 flex-shrink-0">
                <ArrowUp className="h-2.5 w-2.5" />
                <span className="text-xs">5%</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-0">
            <div className="text-xl font-bold text-gray-900 leading-tight">156</div>
            <p className="text-xs text-gray-600 mt-0.5 truncate">12 categories</p>
            <Progress value={62} className="mt-2 h-1.5" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-200/50 shadow-sm overflow-hidden">
          <CardHeader className="pb-2 px-3 pt-3">
            <CardTitle className="text-xs flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <div className="p-1.5 bg-primary-100 rounded-lg shadow-sm flex-shrink-0">
                  <ShoppingCart className="h-3 w-3 text-primary-600" />
                </div>
                <span className="text-gray-700 font-medium text-xs truncate">Orders</span>
              </div>
              <div className="flex items-center gap-0.5 text-primary-600 text-xs bg-primary-100 px-1.5 py-0.5 rounded-full border border-primary-200 flex-shrink-0">
                <ArrowUp className="h-2.5 w-2.5" />
                <span className="text-xs">8%</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-0">
            <div className="text-xl font-bold text-gray-900 leading-tight">23</div>
            <p className="text-xs text-gray-600 mt-0.5 truncate">Today</p>
            <Progress value={85} className="mt-2 h-1.5" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning-50 to-warning-100/50 border-warning-200/50 shadow-sm overflow-hidden">
          <CardHeader className="pb-2 px-3 pt-3">
            <CardTitle className="text-xs flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <div className="p-1.5 bg-warning-100 rounded-lg shadow-sm flex-shrink-0">
                  <Users className="h-3 w-3 text-warning-600" />
                </div>
                <span className="text-gray-700 font-medium text-xs truncate">Customers</span>
              </div>
              <div className="flex items-center gap-0.5 text-warning-600 text-xs bg-warning-100 px-1.5 py-0.5 rounded-full border border-warning-200 flex-shrink-0">
                <ArrowUp className="h-2.5 w-2.5" />
                <span className="text-xs">3%</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-0">
            <div className="text-xl font-bold text-gray-900 leading-tight">42</div>
            <p className="text-xs text-gray-600 mt-0.5 truncate">This month</p>
            <Progress value={45} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Compact and Professional */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <Button 
          variant="outline" 
          className="h-12 gap-2 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200 hover:from-primary-100 hover:to-primary-150 w-full text-sm"
        >
          <Plus className="h-4 w-4 flex-shrink-0" />
          <span className="font-medium truncate">Add Sale</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-12 gap-2 bg-gradient-to-r from-success-50 to-success-100 border-success-200 hover:from-success-100 hover:to-success-150 w-full text-sm"
        >
          <Package className="h-4 w-4 flex-shrink-0" />
          <span className="font-medium truncate">Add Stock</span>
        </Button>
      </div>

      {/* Low Stock Alerts - Compact Design */}
      <Card className="bg-gradient-to-br from-destructive/5 to-warning/5 border-destructive/20 shadow-sm w-full overflow-hidden">
        <CardHeader className="pb-2 px-4 pt-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <div className="p-1.5 bg-destructive/10 rounded-lg shadow-sm flex-shrink-0">
              <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
            </div>
            <span className="font-medium text-sm truncate flex-1">Low Stock</span>
            <div className="bg-destructive/10 text-destructive px-2 py-0.5 rounded-full text-xs font-medium border border-destructive/20 flex-shrink-0">
              2 items
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-3 pt-0">
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2.5 bg-background rounded-lg border border-destructive/10 shadow-sm">
              <div className="min-w-0 flex-1">
                <span className="font-medium text-sm block truncate">Premium Headphones</span>
                <p className="text-xs text-muted-foreground truncate">SKU: HD001</p>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <span className="text-destructive font-bold text-sm">3 left</span>
                <p className="text-xs text-muted-foreground">Need: 20</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-background rounded-lg border border-destructive/10 shadow-sm">
              <div className="min-w-0 flex-1">
                <span className="font-medium text-sm block truncate">Wireless Mouse</span>
                <p className="text-xs text-muted-foreground truncate">SKU: MS002</p>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <span className="text-destructive font-bold text-sm">1 left</span>
                <p className="text-xs text-muted-foreground">Need: 15</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Selling Items - Optimized Layout */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-sm w-full overflow-hidden">
        <CardHeader className="pb-2 px-4 pt-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <div className="p-1.5 bg-primary-100 rounded-lg shadow-sm flex-shrink-0">
              <TrendingUp className="h-3.5 w-3.5 text-primary-600" />
            </div>
            <span className="font-medium text-sm truncate flex-1">Top Sellers</span>
            <div className="bg-primary-50 text-primary-700 border-primary-200 px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0">
              Week
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-3 pt-0">
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2.5 bg-white rounded-lg border border-primary-100 shadow-sm">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                  1
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-sm block truncate">Bluetooth Speaker</span>
                  <p className="text-xs text-gray-500">$45.99</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <span className="font-bold text-success-600 text-sm">15 sold</span>
                <p className="text-xs text-gray-500">$689.85</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-white rounded-lg border border-primary-100 shadow-sm">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-6 h-6 bg-gradient-to-r from-success-500 to-info-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                  2
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-sm block truncate">Phone Case</span>
                  <p className="text-xs text-gray-500">$12.99</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <span className="font-bold text-success-600 text-sm">12 sold</span>
                <p className="text-xs text-gray-500">$155.88</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-white rounded-lg border border-primary-100 shadow-sm">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-6 h-6 bg-gradient-to-r from-warning-500 to-warning-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                  3
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-sm block truncate">USB Cable</span>
                  <p className="text-xs text-gray-500">$8.99</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <span className="font-bold text-success-600 text-sm">8 sold</span>
                <p className="text-xs text-gray-500">$71.92</p>
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