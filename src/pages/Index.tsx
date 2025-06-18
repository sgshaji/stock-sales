
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
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-50/20 to-primary-100/30 dark:from-background dark:via-primary-950/20 dark:to-primary-900/30 transition-colors">
      <div className="max-w-md mx-auto">
        {/* Enhanced Header with search and theme toggle */}
        <div className="bg-background/95 backdrop-blur-md shadow-sm border-b border-border/40 sticky top-0 z-20 transition-all duration-200 dark:bg-background/90">
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="animate-fade-in">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent dark:from-primary-400 dark:to-primary-500">
                  StockFlow
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0]}'s workspace
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowSearch(!showSearch)}
                  className={`p-2 button-press transition-all duration-200 ${
                    showSearch 
                      ? "bg-primary-50 text-primary-600 shadow-sm dark:bg-primary-950/50 dark:text-primary-400" 
                      : "hover:bg-accent"
                  }`}
                >
                  <Search className="h-4 w-4" />
                </Button>
                <ThemeToggle />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setActiveTab("profile")}
                  className={`p-2 button-press transition-all duration-200 ${
                    activeTab === "profile" 
                      ? "bg-primary-50 text-primary-600 shadow-sm dark:bg-primary-950/50 dark:text-primary-400" 
                      : "hover:bg-accent"
                  }`}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 button-press transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Search bar */}
            {showSearch && (
              <div className="animate-fade-in">
                <SearchInput
                  placeholder="Search inventory, sales, vendors..."
                  onSearch={handleSearch}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6 bg-background/60 backdrop-blur-sm shadow-sm border border-border/40 dark:bg-background/40">
              <TabsTrigger 
                value="dashboard" 
                className="flex flex-col gap-1 py-3 transition-all duration-200 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600 data-[state=active]:shadow-sm hover:bg-gray-50 dark:data-[state=active]:bg-primary-950/50 dark:data-[state=active]:text-primary-400 dark:hover:bg-gray-800"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="text-xs font-medium">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="inventory" 
                className="flex flex-col gap-1 py-3 transition-all duration-200 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600 data-[state=active]:shadow-sm hover:bg-gray-50 dark:data-[state=active]:bg-primary-950/50 dark:data-[state=active]:text-primary-400 dark:hover:bg-gray-800"
              >
                <Package className="h-4 w-4" />
                <span className="text-xs font-medium">Inventory</span>
              </TabsTrigger>
              <TabsTrigger 
                value="sales" 
                className="flex flex-col gap-1 py-3 transition-all duration-200 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600 data-[state=active]:shadow-sm hover:bg-gray-50 dark:data-[state=active]:bg-primary-950/50 dark:data-[state=active]:text-primary-400 dark:hover:bg-gray-800"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="text-xs font-medium">Sales</span>
              </TabsTrigger>
              <TabsTrigger 
                value="vendors" 
                className="flex flex-col gap-1 py-3 transition-all duration-200 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600 data-[state=active]:shadow-sm hover:bg-gray-50 dark:data-[state=active]:bg-primary-950/50 dark:data-[state=active]:text-primary-400 dark:hover:bg-gray-800"
              >
                <Users className="h-4 w-4" />
                <span className="text-xs font-medium">Vendors</span>
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="flex flex-col gap-1 py-3 transition-all duration-200 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600 data-[state=active]:shadow-sm hover:bg-gray-50 dark:data-[state=active]:bg-primary-950/50 dark:data-[state=active]:text-primary-400 dark:hover:bg-gray-800"
              >
                <User className="h-4 w-4" />
                <span className="text-xs font-medium">Profile</span>
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
