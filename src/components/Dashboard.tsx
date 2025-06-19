import { useState, useEffect, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingGrid, LoadingCard } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { TrendingUp, Package, DollarSign, AlertTriangle, ArrowUp, ShoppingCart, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
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
    }, 1000);
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
    <div className="space-y-4 animate-fade-in">
      {/* Compact Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-4 text-white shadow-md">
        <h2 className="text-title-medium font-semibold mb-1">Welcome back!</h2>
        <p className="text-primary-100 text-body-small">Here's your inventory overview</p>
      </div>

      {/* Key Metrics Grid - Mobile Optimized */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gradient-to-br from-success-50 to-success-100/50 border-success-200">
          <CardHeader className="pb-2 px-3 pt-3">
            <CardTitle className="text-label-medium flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-success-100 rounded-lg">
                  <DollarSign className="h-3 w-3 text-success-600" />
                </div>
                <span className="text-gray-700 font-medium text-xs">Sales</span>
              </div>
              <div className="flex items-center gap-1 text-success-600 text-xs bg-success-100 px-1.5 py-0.5 rounded-full">
                <ArrowUp className="h-2 w-2" />
                12%
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-title-large font-bold text-gray-900">$1,247</div>
            <p className="text-xs text-gray-600 mt-0.5">+$134 today</p>
            <Progress value={75} className="mt-2 h-1.5" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-info-50 to-info-100/50 border-info-200">
          <CardHeader className="pb-2 px-3 pt-3">
            <CardTitle className="text-label-medium flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-info-100 rounded-lg">
                  <Package className="h-3 w-3 text-info-600" />
                </div>
                <span className="text-gray-700 font-medium text-xs">Items</span>
              </div>
              <div className="flex items-center gap-1 text-info-600 text-xs bg-info-100 px-1.5 py-0.5 rounded-full">
                <ArrowUp className="h-2 w-2" />
                5%
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-title-large font-bold text-gray-900">156</div>
            <p className="text-xs text-gray-600 mt-0.5">12 categories</p>
            <Progress value={62} className="mt-2 h-1.5" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-200">
          <CardHeader className="pb-2 px-3 pt-3">
            <CardTitle className="text-label-medium flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary-100 rounded-lg">
                  <ShoppingCart className="h-3 w-3 text-primary-600" />
                </div>
                <span className="text-gray-700 font-medium text-xs">Orders</span>
              </div>
              <div className="flex items-center gap-1 text-primary-600 text-xs bg-primary-100 px-1.5 py-0.5 rounded-full">
                <ArrowUp className="h-2 w-2" />
                8%
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-title-large font-bold text-gray-900">23</div>
            <p className="text-xs text-gray-600 mt-0.5">Today</p>
            <Progress value={85} className="mt-2 h-1.5" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning-50 to-warning-100/50 border-warning-200">
          <CardHeader className="pb-2 px-3 pt-3">
            <CardTitle className="text-label-medium flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-warning-100 rounded-lg">
                  <Users className="h-3 w-3 text-warning-600" />
                </div>
                <span className="text-gray-700 font-medium text-xs">Customers</span>
              </div>
              <div className="flex items-center gap-1 text-warning-600 text-xs bg-warning-100 px-1.5 py-0.5 rounded-full">
                <ArrowUp className="h-2 w-2" />
                3%
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-title-large font-bold text-gray-900">42</div>
            <p className="text-xs text-gray-600 mt-0.5">This month</p>
            <Progress value={45} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts - Compact */}
      <Card className="bg-gradient-to-br from-destructive/5 to-warning/5 border-destructive/20">
        <CardHeader className="pb-2 px-4 pt-3">
          <CardTitle className="text-title-small flex items-center gap-2">
            <div className="p-1.5 bg-destructive/10 rounded-lg">
              <AlertTriangle className="h-3 w-3 text-destructive" />
            </div>
            <span className="font-medium">Low Stock</span>
            <div className="ml-auto bg-destructive/10 text-destructive px-2 py-0.5 rounded-full text-xs font-medium border border-destructive/20">
              2 items
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-3">
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-background rounded-lg border border-destructive/10">
              <div>
                <span className="font-medium text-body-small">Premium Headphones</span>
                <p className="text-xs text-muted-foreground">SKU: HD001</p>
              </div>
              <div className="text-right">
                <span className="text-destructive font-bold text-sm">3 left</span>
                <p className="text-xs text-muted-foreground">Need: 20</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-background rounded-lg border border-destructive/10">
              <div>
                <span className="font-medium text-body-small">Wireless Mouse</span>
                <p className="text-xs text-muted-foreground">SKU: MS002</p>
              </div>
              <div className="text-right">
                <span className="text-destructive font-bold text-sm">1 left</span>
                <p className="text-xs text-muted-foreground">Need: 15</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Selling Items - Compact */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader className="pb-2 px-4 pt-3">
          <CardTitle className="text-title-small flex items-center gap-2">
            <div className="p-1.5 bg-primary-100 rounded-lg">
              <TrendingUp className="h-3 w-3 text-primary-600" />
            </div>
            <span className="font-medium">Top Sellers</span>
            <div className="ml-auto bg-primary-50 text-primary-700 border-primary-200 px-2 py-0.5 rounded-full text-xs font-medium border">
              Week
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-3">
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-white rounded-lg border border-primary-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                  1
                </div>
                <div>
                  <span className="font-medium text-body-small">Bluetooth Speaker</span>
                  <p className="text-xs text-gray-500">$45.99</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-success-600 text-sm">15 sold</span>
                <p className="text-xs text-gray-500">$689.85</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded-lg border border-primary-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-success-500 to-info-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                  2
                </div>
                <div>
                  <span className="font-medium text-body-small">Phone Case</span>
                  <p className="text-xs text-gray-500">$12.99</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-success-600 text-sm">12 sold</span>
                <p className="text-xs text-gray-500">$155.88</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded-lg border border-primary-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-warning-500 to-warning-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                  3
                </div>
                <div>
                  <span className="font-medium text-body-small">USB Cable</span>
                  <p className="text-xs text-gray-500">$8.99</p>
                </div>
              </div>
              <div className="text-right">
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