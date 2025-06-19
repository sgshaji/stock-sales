import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TouchTarget } from "@/components/ui/mobile-touch";
import { 
  LogOut, 
  Settings, 
  Search, 
  ChevronDown,
  User,
  Store,
  Package,
  Palette,
  BarChart3
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, memo } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getShopName, getUserInitials } from "@/lib/config/shop";
import { SearchInput } from "@/components/ui/search";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TodayHeaderProps {
  onSearch?: (query: string) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const TodayHeader = memo<TodayHeaderProps>(({ onSearch, activeTab, onTabChange }) => {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  // Navigation handlers
  const handleDashboard = () => {
    if (window.location.pathname === '/') {
      onTabChange?.("dashboard");
    } else {
      navigate('/');
    }
  };

  const handleProfile = () => {
    if (window.location.pathname === '/') {
      onTabChange?.("profile");
    } else {
      navigate('/');
      setTimeout(() => onTabChange?.("profile"), 100);
    }
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const handleInventoryCategories = () => {
    // Quick access to inventory categories
    if (window.location.pathname === '/') {
      onTabChange?.("inventory");
    } else {
      navigate('/inventory');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const shopName = getShopName(user);
  const userInitials = getUserInitials(user);
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User";

  return (
    <div className="bg-background/95 backdrop-blur-md shadow-sm border-b border-border/20 sticky top-0 z-20">
      <div className="px-4 py-3">
        {/* SINGLE LINE: Shop Name + Profile Menu */}
        <div className="flex items-center justify-between">
          {/* Left: Shop Name (No Truncation!) */}
          <div className="flex-1 min-w-0 mr-4">
            <h1 className="text-title-large font-bold text-foreground">
              {shopName}
            </h1>
          </div>

          {/* Right: Compact Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Search Toggle */}
            {onSearch && (
              <TouchTarget minHeight={44}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowSearch(!showSearch)}
                  className={cn(
                    "h-9 w-9 p-0 rounded-xl",
                    showSearch 
                      ? "bg-primary-50 text-primary-600 shadow-sm" 
                      : "hover:bg-accent/50"
                  )}
                  title="Toggle search"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </TouchTarget>
            )}

            {/* Profile Menu Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TouchTarget minHeight={44}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "h-10 gap-2 px-3 rounded-xl hover:bg-accent/50 transition-all duration-200",
                      (activeTab === "profile" || window.location.pathname === '/settings')
                        ? "bg-primary-50 text-primary-600 shadow-sm" 
                        : ""
                    )}
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-primary-100 text-primary-700 text-xs font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </TouchTarget>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-background/95 backdrop-blur-md border border-border/40 shadow-lg"
              >
                {/* User Info Header */}
                <div className="px-3 py-2 border-b border-border/20">
                  <p className="text-sm font-medium text-foreground truncate">{userName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>

                {/* Navigation */}
                <DropdownMenuItem onClick={handleDashboard} className="gap-3 py-2.5">
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleProfile} className="gap-3 py-2.5">
                  <User className="h-4 w-4" />
                  Profile & Account
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Settings Group */}
                <DropdownMenuItem onClick={handleSettings} className="gap-3 py-2.5">
                  <Store className="h-4 w-4" />
                  Business Settings
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleInventoryCategories} className="gap-3 py-2.5">
                  <Package className="h-4 w-4" />
                  <div className="flex-1">
                    <span>Inventory Categories</span>
                    <span className="text-xs text-muted-foreground block">Quick access</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={toggleTheme} className="gap-3 py-2.5">
                  <Palette className="h-4 w-4" />
                  <div className="flex-1 flex items-center justify-between">
                    <span>Theme</span>
                    <span className="text-xs text-muted-foreground capitalize">{theme}</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleSettings} className="gap-3 py-2.5">
                  <Settings className="h-4 w-4" />
                  All Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Sign Out */}
                <DropdownMenuItem 
                  onClick={handleSignOut} 
                  disabled={isSigningOut}
                  className="gap-3 py-2.5 text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  {isSigningOut ? "Signing out..." : "Sign Out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {showSearch && onSearch && (
          <div className="mt-3 animate-slide-down">
            <SearchInput
              placeholder="Search across all modules..."
              onSearch={onSearch}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
});

TodayHeader.displayName = "TodayHeader";