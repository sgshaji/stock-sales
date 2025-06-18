
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, ShoppingCart, Users, BarChart3, Plus } from "lucide-react";
import InventoryManagement from "@/components/InventoryManagement";
import SalesEntry from "@/components/SalesEntry";
import VendorManagement from "@/components/VendorManagement";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Inventory Manager
          </h1>
          <p className="text-center text-gray-600 text-sm">
            Your mobile retail management solution
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="dashboard" className="flex flex-col gap-1 py-3">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex flex-col gap-1 py-3">
              <Package className="h-4 w-4" />
              <span className="text-xs">Inventory</span>
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex flex-col gap-1 py-3">
              <ShoppingCart className="h-4 w-4" />
              <span className="text-xs">Sales</span>
            </TabsTrigger>
            <TabsTrigger value="vendors" className="flex flex-col gap-1 py-3">
              <Users className="h-4 w-4" />
              <span className="text-xs">Vendors</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryManagement />
          </TabsContent>

          <TabsContent value="sales">
            <SalesEntry />
          </TabsContent>

          <TabsContent value="vendors">
            <VendorManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
