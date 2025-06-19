
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchInput } from "@/components/ui/search";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { TouchTarget } from "@/components/ui/mobile-touch";
import { ShoppingCart, Users, BarChart3, LogOut, User, Settings, Search, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import SalesEntry from "@/components/SalesEntry";
import VendorManagement from "@/components/VendorManagement";
import Dashboard from "@/components/Dashboard";
import UserProfile from "@/components/UserProfile";
import InventoryManagement from "@/components/inventory/InventoryManagement";
import { BottomTabs } from "@/components/navigation/BottomTabs";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Format today's date
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  // Mock today's revenue - in real app this would come from your data source
  const todaysRevenue = "$2,847.50";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brand-50/30 to-brand-100/40 dark:from-background dark:via-brand-950/30 dark:to-brand-900/40">
      <div className={cn(
        "mx-auto",
        isMobile ? "px-0 max-w-full" : "container-content"
      )}>
        {/* Slim Today Header Bar */}
        <div className="bg-background/95 backdrop-blur-md shadow-sm border-b border-border/40 sticky top-0 z-20">
          <div className="flex items-center justify-between px-space-4 py-space-3">
            <div className="flex items-center gap-space-2">
              <span className="text-body-medium font-medium text-foreground">
                {today}
              </span>
            </div>
            <Badge variant="secondary" className="bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-950/50 dark:text-brand-400 dark:border-brand-800 font-semibold">
              {todaysRevenue}
            </Badge>
          </div>
        </div>

        {/* Simplified Header */}
        <div className="bg-background/95 backdrop-blur-md shadow-sm border-b border-border/40 sticky top-12 z-19">
          <div className={cn(
            "p-space-4",
            isMobile ? "py-space-3" : "p-space-6"
          )}>
            <div className="flex justify-between items-center mb-space-4">
              <div className="animate-fade-in">
                <h1 className={cn(
                  "bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-500",
                  isMobile ? "text-title-large font-bold" : "text-display-medium"
                )}>
                  StockFlow
                </h1>
                <p className={cn(
                  "text-muted-foreground mt-1",
                  isMobile ? "text-body-small" : "text-body-medium"
                )}>
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0]}'s workspace
                </p>
              </div>
              
              {/* Mobile-optimized action buttons */}
              <div className="flex items-center gap-1">
                <div className={cn(
                  "flex items-center bg-background/60 rounded-xl border border-border/40",
                  isMobile ? "p-1 gap-1" : "p-1 gap-1"
                )}>
                  <TouchTarget minHeight={44}>
                    <Button 
                      variant="ghost" 
                      size={isMobile ? "icon-sm" : "icon-sm"}
                      onClick={() => setShowSearch(!showSearch)}
                      className={cn(
                        "animate-quick",
                        showSearch 
                          ? "bg-brand-50 text-brand-600 shadow-sm dark:bg-brand-950/50 dark:text-brand-400" 
                          : "hover:bg-accent/50"
                      )}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </TouchTarget>
                  
                  <TouchTarget minHeight={44}>
                    <ThemeToggle />
                  </TouchTarget>
                  
                  <TouchTarget minHeight={44}>
                    <Button 
                      variant="ghost" 
                      size={isMobile ? "icon-sm" : "icon-sm"}
                      onClick={() => setActiveTab("profile")}
                      className={cn(
                        "animate-quick",
                        activeTab === "profile" 
                          ? "bg-brand-50 text-brand-600 shadow-sm dark:bg-brand-950/50 dark:text-brand-400" 
                          : "hover:bg-accent/50"
                      )}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TouchTarget>
                </div>
                
                <TouchTarget minHeight={44}>
                  <Button 
                    variant="ghost" 
                    size={isMobile ? "icon-sm" : "icon-sm"}
                    onClick={handleSignOut}
                    loading={isSigningOut}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 animate-quick ml-space-2"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TouchTarget>
              </div>
            </div>
            
            {/* Mobile-optimized Search */}
            {showSearch && (
              <div className="animate-slide-up">
                <SearchInput
                  placeholder="Search across all modules..."
                  onSearch={handleSearch}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className={cn(
          "content-spacing-relaxed pb-20 md:pb-6",
          isMobile ? "p-space-4 space-y-space-4" : "p-space-6"
        )}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Enhanced 5-tab Navigation - Hidden on mobile when BottomTabs is present */}
            <TabsList className={cn(
              "w-full bg-background/95 backdrop-blur-sm shadow-lg border border-border/40 rounded-2xl p-space-2 h-auto",
              isMobile 
                ? "hidden" 
                : "grid grid-cols-5 mb-space-8"
            )}>
              {[
                { value: "dashboard", icon: BarChart3, label: "Dashboard" },
                { value: "sales", icon: ShoppingCart, label: "Sales" },
                { value: "inventory", icon: Package, label: "Inventory" },
                { value: "vendors", icon: Users, label: "Vendors" },
                { value: "profile", icon: User, label: "Profile" }
              ].map((tab) => (
                <TouchTarget key={tab.value} minHeight={isMobile ? 56 : 64}>
                  <TabsTrigger 
                    value={tab.value}
                    className={cn(
                      "flex flex-col gap-space-2 rounded-xl animate-quick data-[state=active]:bg-brand-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-brand-50 dark:data-[state=active]:bg-brand-600 dark:hover:bg-brand-950/20 font-medium w-full",
                      isMobile ? "py-space-2 px-space-2" : "py-space-4 px-space-3"
                    )}
                  >
                    <tab.icon className={cn(
                      isMobile ? "h-4 w-4" : "h-5 w-5"
                    )} />
                    <span className={cn(
                      "font-medium",
                      isMobile ? "text-label-small leading-tight" : "text-label-medium"
                    )}>
                      {isMobile ? tab.label.split(' ')[0] : tab.label}
                    </span>
                  </TabsTrigger>
                </TouchTarget>
              ))}
            </TabsList>

            <div className="animate-fade-in mt-space-4">
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
      </div>
      
      {/* Add BottomTabs for mobile */}
      <BottomTabs />
    </div>
  );
};

export default Index;
