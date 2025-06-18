
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, ShoppingCart, Users, BarChart3, LogOut, User, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import InventoryManagement from "@/components/InventoryManagement";
import SalesEntry from "@/components/SalesEntry";
import VendorManagement from "@/components/VendorManagement";
import Dashboard from "@/components/Dashboard";
import UserProfile from "@/components/UserProfile";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  StockFlow
                </h1>
                <p className="text-xs text-gray-500">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0]}'s workspace
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setActiveTab("profile")}
                  className={`p-2 ${activeTab === "profile" ? "bg-blue-50 text-blue-600" : ""}`}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="p-2 text-gray-600 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6 bg-white shadow-sm">
              <TabsTrigger value="dashboard" className="flex flex-col gap-1 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                <BarChart3 className="h-4 w-4" />
                <span className="text-xs">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex flex-col gap-1 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                <Package className="h-4 w-4" />
                <span className="text-xs">Inventory</span>
              </TabsTrigger>
              <TabsTrigger value="sales" className="flex flex-col gap-1 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                <ShoppingCart className="h-4 w-4" />
                <span className="text-xs">Sales</span>
              </TabsTrigger>
              <TabsTrigger value="vendors" className="flex flex-col gap-1 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                <Users className="h-4 w-4" />
                <span className="text-xs">Vendors</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex flex-col gap-1 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                <User className="h-4 w-4" />
                <span className="text-xs">Profile</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-0">
              <Dashboard />
            </TabsContent>

            <TabsContent value="inventory" className="mt-0">
              <InventoryManagement />
            </TabsContent>

            <TabsContent value="sales" className="mt-0">
              <SalesEntry />
            </TabsContent>

            <TabsContent value="vendors" className="mt-0">
              <VendorManagement />
            </TabsContent>

            <TabsContent value="profile" className="mt-0">
              <UserProfile />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
