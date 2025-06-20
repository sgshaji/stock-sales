
import { BottomTabs } from "@/components/navigation/BottomTabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Package, ShoppingCart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-50/30 to-primary-100/40 dark:from-background dark:via-primary-950/30 dark:to-primary-900/40">
      <div className="container mx-auto px-4 py-6 pb-20 md:pb-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent dark:from-primary-400 dark:to-primary-500">
            StockFlow Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Smart Inventory Management Overview
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-success-600" />
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,543</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Package className="h-4 w-4 text-info-600" />
                Items Sold
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-warning-600" />
                Low Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Items</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary-600" />
                Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+24%</div>
              <p className="text-xs text-muted-foreground">vs last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New sale recorded</p>
                  <p className="text-sm text-muted-foreground">$45.00 - iPhone Case</p>
                </div>
                <span className="text-xs text-muted-foreground">2m ago</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Inventory updated</p>
                  <p className="text-sm text-muted-foreground">Samsung Galaxy S23 - Stock: 15</p>
                </div>
                <span className="text-xs text-muted-foreground">1h ago</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Low stock alert</p>
                  <p className="text-sm text-muted-foreground">iPhone 14 Pro - Only 3 left</p>
                </div>
                <span className="text-xs text-muted-foreground">3h ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <BottomTabs />
    </div>
  );
};

export default Index;
