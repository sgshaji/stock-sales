
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchInput } from "@/components/ui/search";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Package, ShoppingCart, Users, BarChart3, LogOut, User, Settings, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import InventoryManagement from "@/components/InventoryManagement";
import SalesEntry from "@/components/SalesEntry";
import VendorManagement from "@/components/VendorManagement";
import Dashboard from "@/components/Dashboard";
import UserProfile from "@/components/UserProfile";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-50/30 to-primary-100/40 dark:from-background dark:via-primary-950/30 dark:to-primary-900/40">
      <div className="container-content">
        {/* Enhanced Header */}
        <div className="bg-background/95 backdrop-blur-md shadow-sm border-b border-border/40 sticky top-0 z-20 rounded-b-2xl">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="animate-fade-in">
                <h1 className="text-display-medium bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent dark:from-primary-400 dark:to-primary-500">
                  StockFlow
                </h1>
                <p className="text-body-small text-muted-foreground mt-1">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0]}'s workspace
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon-sm" 
                  onClick={() => setShowSearch(!showSearch)}
                  className={`animate-quick ${
                    showSearch 
                      ? "bg-primary-50 text-primary-600 shadow-sm dark:bg-primary-950/50 dark:text-primary-400" 
                      : ""
                  }`}
                >
                  <Search className="h-4 w-4" />
                </Button>
                <ThemeToggle />
                <Button 
                  variant="ghost" 
                  size="icon-sm"
                  onClick={() => setActiveTab("profile")}
                  className={`animate-quick ${
                    activeTab === "profile" 
                      ? "bg-primary-50 text-primary-600 shadow-sm dark:bg-primary-950/50 dark:text-primary-400" 
                      : ""
                  }`}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon-sm"
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 animate-quick"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Enhanced Search bar */}
            {showSearch && (
              <div className="animate-slide-up">
                <SearchInput
                  placeholder="Search inventory, sales, vendors..."
                  onSearch={handleSearch}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* Main Content with improved spacing */}
        <div className="content-spacing-relaxed p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-background/80 backdrop-blur-sm shadow-md border border-border/40 rounded-2xl p-1 h-auto">
              <TabsTrigger 
                value="dashboard" 
                className="flex flex-col gap-1.5 py-4 px-3 rounded-xl animate-quick data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600 data-[state=active]:shadow-sm hover:bg-gray-50 dark:data-[state=active]:bg-primary-950/50 dark:data-[state=active]:text-primary-400 dark:hover:bg-gray-800"
              >
                <BarChart3 className="h-5 w-5" />
                <span className="text-label-medium">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="inventory" 
                className="flex flex-col gap-1.5 py-4 px-3 rounded-xl animate-quick data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600 data-[state=active]:shadow-sm hover:bg-gray-50 dark:data-[state=active]:bg-primary-950/50 dark:data-[state=active]:text-primary-400 dark:hover:bg-gray-800"
              >
                <Package className="h-5 w-5" />
                <span className="text-label-medium">Inventory</span>
              </TabsTrigger>
              <TabsTrigger 
                value="sales" 
                className="flex flex-col gap-1.5 py-4 px-3 rounded-xl animate-quick data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600 data-[state=active]:shadow-sm hover:bg-gray-50 dark:data-[state=active]:bg-primary-950/50 dark:data-[state=active]:text-primary-400 dark:hover:bg-gray-800"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="text-label-medium">Sales</span>
              </TabsTrigger>
              <TabsTrigger 
                value="vendors" 
                className="flex flex-col gap-1.5 py-4 px-3 rounded-xl animate-quick data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600 data-[state=active]:shadow-sm hover:bg-gray-50 dark:data-[state=active]:bg-primary-950/50 dark:data-[state=active]:text-primary-400 dark:hover:bg-gray-800"
              >
                <Users className="h-5 w-5" />
                <span className="text-label-medium">Vendors</span>
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="flex flex-col gap-1.5 py-4 px-3 rounded-xl animate-quick data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600 data-[state=active]:shadow-sm hover:bg-gray-50 dark:data-[state=active]:bg-primary-950/50 dark:data-[state=active]:text-primary-400 dark:hover:bg-gray-800"
              >
                <User className="h-5 w-5" />
                <span className="text-label-medium">Profile</span>
              </TabsTrigger>
            </TabsList>

            <div className="animate-fade-in">
              <TabsContent value="dashboard" className="mt-0">
                <Dashboard searchQuery={searchQuery} />
              </TabsContent>

              <TabsContent value="inventory" className="mt-0">
                <InventoryManagement searchQuery={searchQuery} />
              </TabsContent>

              <TabsContent value="sales" className="mt-0">
                <SalesEntry searchQuery={searchQuery} />
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
      </div>
    </div>
  );
};

export default Index;
