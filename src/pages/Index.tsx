
import { BottomTabs } from "@/components/navigation/BottomTabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Package, DollarSign, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { MonthlyProfitTile } from "@/components/dashboard/MonthlyProfitTile";
import { DailyProfitTile } from "@/components/dashboard/DailyProfitTile";
import { LowStockTile } from "@/components/dashboard/LowStockTile";
import { FastMovingTile } from "@/components/dashboard/FastMovingTile";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brand-50/30 to-brand-100/40 dark:from-background dark:via-brand-950/30 dark:to-brand-900/40">
      <div className="container mx-auto px-4 py-6 pb-20 md:pb-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-500">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Overview of your business performance
          </p>
        </div>

        {/* Analytics Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <DailyProfitTile />
          <MonthlyProfitTile />
          <LowStockTile />
          <FastMovingTile />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Record new sales and view transaction history</p>
              <Link to="/sales">
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  New Sale
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Manage products and track stock levels</p>
              <Link to="/inventory">
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Link to="/sales">
                <Button variant="outline" className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Sales
                </Button>
              </Link>
              <Link to="/inventory">
                <Button variant="outline" className="w-full">
                  <Package className="h-4 w-4 mr-2" />
                  Inventory
                </Button>
              </Link>
              <Link to="/vendor">
                <Button variant="outline" className="w-full">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Vendors
                </Button>
              </Link>
              <Link to="/analytics">
                <Button variant="outline" className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <BottomTabs />
    </div>
  );
};

export default Index;
