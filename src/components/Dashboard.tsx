
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Package, DollarSign, AlertTriangle, ArrowUp, ArrowDown, ShoppingCart, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
        <p className="text-blue-100">Here's what's happening with your inventory today</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-gray-700">Today's Sales</span>
              </div>
              <div className="flex items-center gap-1 text-green-600 text-xs">
                <ArrowUp className="h-3 w-3" />
                12%
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">$1,247</div>
            <p className="text-xs text-gray-600">+$134 from yesterday</p>
            <Progress value={75} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-gray-700">Total Items</span>
              </div>
              <div className="flex items-center gap-1 text-blue-600 text-xs">
                <ArrowUp className="h-3 w-3" />
                5%
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">156</div>
            <p className="text-xs text-gray-600">Across 12 categories</p>
            <Progress value={62} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ShoppingCart className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-gray-700">Orders</span>
              </div>
              <div className="flex items-center gap-1 text-purple-600 text-xs">
                <ArrowUp className="h-3 w-3" />
                8%
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">23</div>
            <p className="text-xs text-gray-600">Today's transactions</p>
            <Progress value={85} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Users className="h-4 w-4 text-amber-600" />
                </div>
                <span className="text-gray-700">Customers</span>
              </div>
              <div className="flex items-center gap-1 text-amber-600 text-xs">
                <ArrowUp className="h-3 w-3" />
                3%
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">42</div>
            <p className="text-xs text-gray-600">Active this month</p>
            <Progress value={45} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </div>
            <span>Low Stock Alerts</span>
            <div className="ml-auto bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
              2 items
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-orange-100">
              <div>
                <span className="font-medium text-sm">Premium Headphones</span>
                <p className="text-xs text-gray-500">SKU: HD001</p>
              </div>
              <div className="text-right">
                <span className="text-orange-600 font-bold">3 left</span>
                <p className="text-xs text-gray-500">Reorder: 20</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-red-100">
              <div>
                <span className="font-medium text-sm">Wireless Mouse</span>
                <p className="text-xs text-gray-500">SKU: MS002</p>
              </div>
              <div className="text-right">
                <span className="text-red-600 font-bold">1 left</span>
                <p className="text-xs text-gray-500">Reorder: 15</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Selling Items */}
      <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <div className="p-2 bg-violet-100 rounded-lg">
              <TrendingUp className="h-4 w-4 text-violet-600" />
            </div>
            <span>Top Selling Items</span>
            <div className="ml-auto bg-violet-100 text-violet-700 px-2 py-1 rounded-full text-xs font-medium">
              This week
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-violet-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                  1
                </div>
                <div>
                  <span className="font-medium text-sm">Bluetooth Speaker</span>
                  <p className="text-xs text-gray-500">$45.99 each</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-green-600">15 sold</span>
                <p className="text-xs text-gray-500">+$689.85</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-violet-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                  2
                </div>
                <div>
                  <span className="font-medium text-sm">Phone Case</span>
                  <p className="text-xs text-gray-500">$12.99 each</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-green-600">12 sold</span>
                <p className="text-xs text-gray-500">+$155.88</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-violet-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                  3
                </div>
                <div>
                  <span className="font-medium text-sm">USB Cable</span>
                  <p className="text-xs text-gray-500">$8.99 each</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-green-600">8 sold</span>
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
