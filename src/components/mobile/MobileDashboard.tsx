import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Users, 
  Plus,
  TrendingUp,
  AlertTriangle,
  ArrowUp
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const MobileDashboard = () => {
  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Today's Summary */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">$1,247</h2>
          <p className="text-sm text-gray-500">Today's Sales</p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <ArrowUp className="h-3 w-3 text-green-500" />
            <span className="text-xs text-green-600 font-medium">+12% from yesterday</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">+5%</span>
              </div>
              <div className="text-xl font-bold text-gray-900">156</div>
              <p className="text-xs text-gray-600">Total Items</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-green-100 rounded-lg">
                  <ShoppingCart className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">+8%</span>
              </div>
              <div className="text-xl font-bold text-gray-900">23</div>
              <p className="text-xs text-gray-600">Orders Today</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button className="h-16 bg-primary-600 hover:bg-primary-700 rounded-2xl flex-col gap-1">
            <Plus className="h-5 w-5" />
            <span className="text-sm font-medium">New Sale</span>
          </Button>
          <Button variant="outline" className="h-16 border-2 rounded-2xl flex-col gap-1">
            <Package className="h-5 w-5" />
            <span className="text-sm font-medium">Add Stock</span>
          </Button>
        </div>

        {/* Alerts */}
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-100 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Low Stock Alert</h3>
                <p className="text-sm text-gray-600">3 items need restocking</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                <span className="text-sm font-medium">Premium Headphones</span>
                <span className="text-sm text-red-600 font-bold">3 left</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                <span className="text-sm font-medium">Wireless Mouse</span>
                <span className="text-sm text-red-600 font-bold">1 left</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Sellers */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">Top Sellers</h3>
              <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">This Week</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Bluetooth Speaker</p>
                  <p className="text-xs text-gray-500">15 sold • $689.85</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Phone Case</p>
                  <p className="text-xs text-gray-500">12 sold • $155.88</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};