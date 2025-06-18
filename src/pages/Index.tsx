
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <div className="max-w-md mx-auto">
        {/* Enhanced Header with micro-interactions */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/60 sticky top-0 z-10 transition-all duration-200">
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div className="animate-fade-in">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  StockFlow
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0]}'s workspace
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setActiveTab("profile")}
                  className={`p-2 button-press transition-all duration-200 ${
                    activeTab === "profile" 
                      ? "bg-primary-50 text-primary-600 shadow-sm" 
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="p-2 text-gray-600 hover:text-error-600 hover:bg-error-50 button-press transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Main Content */}
        <div className="p-4 space-system-md">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6 bg-white/60 backdrop-blur-sm shadow-sm border border-gray-200/40">
              <TabsTrigger 
                value="dashboard" 
                className="flex flex-col gap-1 py-3 transition-all duration-200 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600 data-[state=active]:shadow-sm hover:bg-gray-50"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="text-xs font-medium">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="inventory" 
                className="flex flex-col gap-1 py-3 transition-all duration-200 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600 data-[state=active]:shadow-sm hover:bg-gray-50"
              >
                <Package className="h-4 w-4" />
                <span className="text-xs font-medium">Inventory</span>
              </TabsTrigger>
              <TabsTrigger 
                value="sales" 
                className="flex flex-col gap-1 py-3 transition-all duration-200 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600 data-[state=active]:shadow-sm hover:bg-gray-50"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="text-xs font-medium">Sales</span>
              </TabsTrigger>
              <TabsTrigger 
                value="vendors" 
                className="flex flex-col gap-1 py-3 transition-all duration-200 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600 data-[state=active]:shadow-sm hover:bg-gray-50"
              >
                <Users className="h-4 w-4" />
                <span className="text-xs font-medium">Vendors</span>
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="flex flex-col gap-1 py-3 transition-all duration-200 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600 data-[state=active]:shadow-sm hover:bg-gray-50"
              >
                <User className="h-4 w-4" />
                <span className="text-xs font-medium">Profile</span>
              </TabsTrigger>
            </TabsList>

            <div className="animate-fade-in">
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
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
