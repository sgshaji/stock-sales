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
        <LoadingCard count={1} />
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
      {/* Welcome Section - Simplified */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-5 text-white shadow-lg">
        <h2 className="text-title-large font-semibold mb-2">Welcome back!</h2>
        <p className="text-primary-100 text-body-medium opacity-90">Here's your business overview</p>
      </div>

      {/* Key Metrics Grid - Properly Aligned */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <Card className="bg-gradient-to-br from-success-50 to-success-100/50 border-success-200/50 shadow-sm">
          <CardHeader className="pb-3 px-4 pt-4">
            <CardTitle className="text-label-large flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-success-100 rounded-xl shadow-sm">
                  <DollarSign className="h-4 w-4 text-success-600" />
                </div>
                <span className="text-gray-700 font-medium">Sales</span>
              </div>
              <div className="flex items-center gap-1 text-success-600 text-xs bg-success-100 px-2 py-1 rounded-full border border-success-200">
                <ArrowUp className="h-3 w-3" />
                12%
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-gray-900">$1,247</div>
            <p className="text-xs text-gray-600 mt-1">+$134 today</p>
            <Progress value={75} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-info-50 to-info-100/50 border-info-200/50 shadow-sm">
          <CardHeader className="pb-3 px-4 pt-4">
            <CardTitle className="text-label-large flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-info-100 rounded-xl shadow-sm">
                  <Package className="h-4 w-4 text-info-600" />
                </div>
                <span className="text-gray-700 font-medium">Items</span>
              </div>
              <div className="flex items-center gap-1 text-info-600 text-xs bg-info-100 px-2 py-1 rounded-full border border-info-200">
                <ArrowUp className="h-3 w-3" />
                5%
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-gray-900">156</div>
            <p className="text-xs text-gray-600 mt-1">12 categories</p>
            <Progress value={62} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-200/50 shadow-sm">
          <CardHeader className="pb-3 px-4 pt-4">
            <CardTitle className="text-label-large flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-100 rounded-xl shadow-sm">
                  <ShoppingCart className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-gray-700 font-medium">Orders</span>
              </div>
              <div className="flex items-center gap-1 text-primary-600 text-xs bg-primary-100 px-2 py-1 rounded-full border border-primary-200">
                <ArrowUp className="h-3 w-3" />
                8%
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-gray-900">23</div>
            <p className="text-xs text-gray-600 mt-1">Today</p>
            <Progress value={85} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning-50 to-warning-100/50 border-warning-200/50 shadow-sm">
          <CardHeader className="pb-3 px-4 pt-4">
            <CardTitle className="text-label-large flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-warning-100 rounded-xl shadow-sm">
                  <Users className="h-4 w-4 text-warning-600" />
                </div>
                <span className="text-gray-700 font-medium">Customers</span>
              </div>
              <div className="flex items-center gap-1 text-warning-600 text-xs bg-warning-100 px-2 py-1 rounded-full border border-warning-200">
                <ArrowUp className="h-3 w-3" />
                3%
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-gray-900">42</div>
            <p className="text-xs text-gray-600 mt-1">This month</p>
            <Progress value={45} className="mt-3 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <Button 
          variant="outline" 
          className="h-14 gap-3 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200 hover:from-primary-100 hover:to-primary-150 w-full"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">Add Sale</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-14 gap-3 bg-gradient-to-r from-success-50 to-success-100 border-success-200 hover:from-success-100 hover:to-success-150 w-full"
        >
          <Package className="h-5 w-5" />
          <span className="font-medium">Add Stock</span>
        </Button>
      </div>

      {/* Low Stock Alerts - Compact */}
      <Card className="bg-gradient-to-br from-destructive/5 to-warning/5 border-destructive/20 shadow-sm w-full">
        <CardHeader className="pb-3 px-5 pt-4">
          <CardTitle className="text-title-medium flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-xl shadow-sm">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <span className="font-medium">Low Stock</span>
            <div className="ml-auto bg-destructive/10 text-destructive px-3 py-1 rounded-full text-xs font-medium border border-destructive/20">
              2 items
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-background rounded-xl border border-destructive/10 shadow-sm">
              <div>
                <span className="font-medium text-body-medium">Premium Headphones</span>
                <p className="text-xs text-muted-foreground">SKU: HD001</p>
              </div>
              <div className="text-right">
                <span className="text-destructive font-bold">3 left</span>
                <p className="text-xs text-muted-foreground">Need: 20</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-background rounded-xl border border-destructive/10 shadow-sm">
              <div>
                <span className="font-medium text-body-medium">Wireless Mouse</span>
                <p className="text-xs text-muted-foreground">SKU: MS002</p>
              </div>
              <div className="text-right">
                <span className="text-destructive font-bold">1 left</span>
                <p className="text-xs text-muted-foreground">Need: 15</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Selling Items - Compact */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-sm w-full">
        <CardHeader className="pb-3 px-5 pt-4">
          <CardTitle className="text-title-medium flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-xl shadow-sm">
              <TrendingUp className="h-4 w-4 text-primary-600" />
            </div>
            <span className="font-medium">Top Sellers</span>
            <div className="ml-auto bg-primary-50 text-primary-700 border-primary-200 px-3 py-1 rounded-full text-xs font-medium border">
              Week
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-primary-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  1
                </div>
                <div>
                  <span className="font-medium text-body-medium">Bluetooth Speaker</span>
                  <p className="text-xs text-gray-500">$45.99</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-success-600">15 sold</span>
                <p className="text-xs text-gray-500">$689.85</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-primary-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-gradient-to-r from-success-500 to-info-500 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  2
                </div>
                <div>
                  <span className="font-medium text-body-medium">Phone Case</span>
                  <p className="text-xs text-gray-500">$12.99</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-success-600">12 sold</span>
                <p className="text-xs text-gray-500">$155.88</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-primary-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-gradient-to-r from-warning-500 to-warning-600 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  3
                </div>
                <div>
                  <span className="font-medium text-body-medium">USB Cable</span>
                  <p className="text-xs text-gray-500">$8.99</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-success-600">8 sold</span>
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