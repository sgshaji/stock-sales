import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingGrid, LoadingCard } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { TrendingUp, Package, DollarSign, AlertTriangle, ArrowUp, ArrowDown, ShoppingCart, Users, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DashboardProps {
  searchQuery?: string;
}

const Dashboard = ({ searchQuery }: DashboardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
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
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-200">
        <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
        <p className="text-primary-100 text-sm">Here's what's happening with your inventory today</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-success-50 to-success-100/50 border-success-200 card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-success-100 rounded-lg shadow-sm">
                  <DollarSign className="h-4 w-4 text-success-600" />
                </div>
                <span className="text-gray-700 font-medium">Today's Sales</span>
              </div>
              <div className="flex items-center gap-1 text-success-600 text-xs font-medium status-success px-2 py-1 rounded-full border">
                <ArrowUp className="h-3 w-3" />
                12%
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">$1,247</div>
            <p className="text-xs text-gray-600 mt-1">+$134 from yesterday</p>
            <Progress value={75} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-info-50 to-info-100/50 border-info-200 card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-info-100 rounded-lg shadow-sm">
                  <Package className="h-4 w-4 text-info-600" />
                </div>
                <span className="text-gray-700 font-medium">Total Items</span>
              </div>
              <div className="flex items-center gap-1 text-info-600 text-xs font-medium status-info px-2 py-1 rounded-full border">
                <ArrowUp className="h-3 w-3" />
                5%
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">156</div>
            <p className="text-xs text-gray-600 mt-1">Across 12 categories</p>
            <Progress value={62} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-200 card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-100 rounded-lg shadow-sm">
                  <ShoppingCart className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-gray-700 font-medium">Orders</span>
              </div>
              <div className="flex items-center gap-1 text-primary-600 text-xs font-medium bg-primary-50 text-primary-700 border-primary-200 px-2 py-1 rounded-full border">
                <ArrowUp className="h-3 w-3" />
                8%
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">23</div>
            <p className="text-xs text-gray-600 mt-1">Today's transactions</p>
            <Progress value={85} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning-50 to-warning-100/50 border-warning-200 card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-warning-100 rounded-lg shadow-sm">
                  <Users className="h-4 w-4 text-warning-600" />
                </div>
                <span className="text-gray-700 font-medium">Customers</span>
              </div>
              <div className="flex items-center gap-1 text-warning-600 text-xs font-medium status-warning px-2 py-1 rounded-full border">
                <ArrowUp className="h-3 w-3" />
                3%
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">42</div>
            <p className="text-xs text-gray-600 mt-1">Active this month</p>
            <Progress value={45} className="mt-3 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      <Card className="bg-gradient-to-br from-destructive/5 to-warning/5 border-destructive/20 hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <div className="p-2 bg-destructive/10 rounded-lg shadow-sm">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <span className="font-medium">Low Stock Alerts</span>
            <div className="ml-auto bg-destructive/10 text-destructive px-3 py-1 rounded-full text-xs font-medium border border-destructive/20">
              2 items need attention
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-background rounded-lg border border-destructive/10 hover:shadow-sm transition-shadow duration-200">
              <div>
                <span className="font-medium text-sm">Premium Headphones</span>
                <p className="text-xs text-muted-foreground">SKU: HD001</p>
              </div>
              <div className="text-right">
                <span className="text-destructive font-bold">3 left</span>
                <p className="text-xs text-muted-foreground">Reorder: 20</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-background rounded-lg border border-destructive/10 hover:shadow-sm transition-shadow duration-200">
              <div>
                <span className="font-medium text-sm">Wireless Mouse</span>
                <p className="text-xs text-muted-foreground">SKU: MS002</p>
              </div>
              <div className="text-right">
                <span className="text-destructive font-bold">1 left</span>
                <p className="text-xs text-muted-foreground">Reorder: 15</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Selling Items */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <div className="p-2 bg-primary-100 rounded-lg shadow-sm">
              <TrendingUp className="h-4 w-4 text-primary-600" />
            </div>
            <span className="font-medium">Top Selling Items</span>
            <div className="ml-auto bg-primary-50 text-primary-700 border-primary-200 px-3 py-1 rounded-full text-xs font-medium border">
              This week
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-system-sm">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-primary-100 interactive-hover">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  1
                </div>
                <div>
                  <span className="font-medium text-sm">Bluetooth Speaker</span>
                  <p className="text-xs text-gray-500">$45.99 each</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-success-600">15 sold</span>
                <p className="text-xs text-gray-500">+$689.85</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-primary-100 interactive-hover">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-success-500 to-info-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  2
                </div>
                <div>
                  <span className="font-medium text-sm">Phone Case</span>
                  <p className="text-xs text-gray-500">$12.99 each</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-success-600">12 sold</span>
                <p className="text-xs text-gray-500">+$155.88</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-primary-100 interactive-hover">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-warning-500 to-warning-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  3
                </div>
                <div>
                  <span className="font-medium text-sm">USB Cable</span>
                  <p className="text-xs text-gray-500">$8.99 each</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-success-600">8 sold</span>
                <p className="text-xs text-gray-500">+$71.92</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
