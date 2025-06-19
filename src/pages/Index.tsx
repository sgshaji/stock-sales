import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { MainLayout } from "@/components/layout/MainLayout";
import { TodayHeader } from "@/components/layout/TodayHeader";
import { TabNavigation } from "@/components/navigation/TabNavigation";
import { BottomTabs } from "@/components/navigation/BottomTabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import SalesEntry from "@/components/SalesEntry";
import VendorManagement from "@/components/VendorManagement";
import Dashboard from "@/components/Dashboard";
import UserProfile from "@/components/UserProfile";
import InventoryManagement from "@/components/inventory/InventoryManagement";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <MainLayout>
      <TodayHeader 
        onSearch={handleSearch}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <div className={cn(
        "pb-20 md:pb-6",
        isMobile ? "px-4 pt-4" : "px-6 pt-6"
      )}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabNavigation />

          <div className="animate-fade-in mt-4 space-y-4">
            <TabsContent value="dashboard" className="mt-0">
              <Dashboard searchQuery={searchQuery} />
            </TabsContent>

            <TabsContent value="sales" className="mt-0">
              <SalesEntry searchQuery={searchQuery} />
            </TabsContent>

            <TabsContent value="inventory" className="mt-0">
              <InventoryManagement searchQuery={searchQuery} />
            </TabsContent>

            <TabsContent value="vendors" className="mt-0">
              <VendorManagement searchQuery={searchQuery} />
            </TabsContent>

            <TabsContent value="profile" className="mt-0">
              <UserProfile />
            </TabsContent>
          </div>
        </Tabs>
      </div>
      
      <BottomTabs />
    </MainLayout>
  );
};

export default Index;