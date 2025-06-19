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
      {/* SOLUTION 1: Single Column Layout - Prevents horizontal overflow */}
      <div className="grid grid-cols-1 gap-4 w-full">
        {/* Sales Card - Horizontal Layout */}
        <Card className="bg-gradient-to-r from-success-50 to-success-100/50 border-success-200/50 shadow-sm overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="p-2 bg-success-100 rounded-xl shadow-sm flex-shrink-0">
                  <DollarSign className="h-5 w-5 text-success-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Sales</span>
                    <div className="flex items-center gap-1 text-success-600 text-xs bg-success-100 px-2 py-0.5 rounded-full border border-success-200">
                      <ArrowUp className="h-3 w-3" />
                      <span>12%</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 leading-tight">$1,247</div>
                  <p className="text-xs text-gray-600">+$134 today</p>
                </div>
              </div>
            </div>
            <Progress value={75} className="mt-3 h-2" />
          </CardContent>
        </Card>

        {/* Items Card - Horizontal Layout */}
        <Card className="bg-gradient-to-r from-info-50 to-info-100/50 border-info-200/50 shadow-sm overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="p-2 bg-info-100 rounded-xl shadow-sm flex-shrink-0">
                  <Package className="h-5 w-5 text-info-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Items</span>
                    <div className="flex items-center gap-1 text-info-600 text-xs bg-info-100 px-2 py-0.5 rounded-full border border-info-200">
                      <ArrowUp className="h-3 w-3" />
                      <span>5%</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 leading-tight">156</div>
                  <p className="text-xs text-gray-600">12 categories</p>
                </div>
              </div>
            </div>
            <Progress value={62} className="mt-3 h-2" />
          </CardContent>
        </Card>

        {/* Orders Card - Horizontal Layout */}
        <Card className="bg-gradient-to-r from-primary-50 to-primary-100/50 border-primary-200/50 shadow-sm overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="p-2 bg-primary-100 rounded-xl shadow-sm flex-shrink-0">
                  <ShoppingCart className="h-5 w-5 text-primary-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Orders</span>
                    <div className="flex items-center gap-1 text-primary-600 text-xs bg-primary-100 px-2 py-0.5 rounded-full border border-primary-200">
                      <ArrowUp className="h-3 w-3" />
                      <span>8%</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 leading-tight">23</div>
                  <p className="text-xs text-gray-600">Today</p>
                </div>
              </div>
            </div>
            <Progress value={85} className="mt-3 h-2" />
          </CardContent>
        </Card>

        {/* Customers Card - Horizontal Layout */}
        <Card className="bg-gradient-to-r from-warning-50 to-warning-100/50 border-warning-200/50 shadow-sm overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="p-2 bg-warning-100 rounded-xl shadow-sm flex-shrink-0">
                  <Users className="h-5 w-5 text-warning-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Customers</span>
                    <div className="flex items-center gap-1 text-warning-600 text-xs bg-warning-100 px-2 py-0.5 rounded-full border border-warning-200">
                      <ArrowUp className="h-3 w-3" />
                      <span>3%</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 leading-tight">42</div>
                  <p className="text-xs text-gray-600">This month</p>
                </div>
              </div>
            </div>
            <Progress value={45} className="mt-3 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* SOLUTION 2: Simplified Quick Actions */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <Button 
          variant="outline" 
          className="h-14 gap-2 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200 hover:from-primary-100 hover:to-primary-150 w-full text-sm flex-col"
        >
          <Plus className="h-5 w-5 flex-shrink-0" />
          <span className="font-medium">Add Sale</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-14 gap-2 bg-gradient-to-r from-success-50 to-success-100 border-success-200 hover:from-success-100 hover:to-success-150 w-full text-sm flex-col"
        >
          <Package className="h-5 w-5 flex-shrink-0" />
          <span className="font-medium">Add Stock</span>
        </Button>
      </div>

      {/* SOLUTION 3: Simplified Low Stock Alerts */}
      <Card className="bg-gradient-to-br from-destructive/5 to-warning/5 border-destructive/20 shadow-sm w-full overflow-hidden">
        <CardHeader className="pb-3 px-4 pt-4">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="p-2 bg-destructive/10 rounded-xl shadow-sm flex-shrink-0">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <span className="font-medium flex-1">Low Stock Alerts</span>
            <div className="bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm font-medium border border-destructive/20 flex-shrink-0">
              2 items
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          <div className="space-y-3">
            <div className="p-3 bg-background rounded-xl border border-destructive/10 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-sm block">Premium Headphones</span>
                  <p className="text-xs text-muted-foreground">SKU: HD001</p>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <span className="text-destructive font-bold">3 left</span>
                  <p className="text-xs text-muted-foreground">Need: 20</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-background rounded-xl border border-destructive/10 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-sm block">Wireless Mouse</span>
                  <p className="text-xs text-muted-foreground">SKU: MS002</p>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <span className="text-destructive font-bold">1 left</span>
                  <p className="text-xs text-muted-foreground">Need: 15</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SOLUTION 4: Simplified Top Sellers */}
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
          <div className="space-y-3">
            <div className="p-3 bg-white rounded-xl border border-primary-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0">
                  1
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-sm block">Bluetooth Speaker</span>
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
                <div className="w-8 h-8 bg-gradient-to-r from-success-500 to-info-500 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0">
                  2
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-sm block">Phone Case</span>
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
                <div className="w-8 h-8 bg-gradient-to-r from-warning-500 to-warning-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0">
                  3
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-sm block">USB Cable</span>
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