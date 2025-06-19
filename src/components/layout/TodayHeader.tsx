import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TouchTarget } from "@/components/ui/mobile-touch";
import { 
  LogOut, 
  Settings, 
  ChevronDown,
  User,
  Store,
  Package,
  Palette,
  BarChart3,
  Bell,
  Shield
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getShopName, getUserInitials } from "@/lib/config/shop";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface TodayHeaderProps {
  onSearch?: (query: string) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const TodayHeader = memo<TodayHeaderProps>(({ activeTab, onTabChange }) => {
  const [isSigningOut, setIsSigningOut] = useState(false);
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
    // Quick access to inventory categories in settings
    navigate('/settings');
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
        {/* PERFECT MOBILE LAYOUT: Shop Name + Profile Menu */}
        <div className="flex items-center justify-between">
          {/* Left: Shop Name (Maximum Space - No Truncation!) */}
          <div className="flex-1 min-w-0 mr-4">
            <h1 className="text-title-large font-bold text-foreground truncate">
              {shopName}
            </h1>
          </div>

          {/* Right: Single Profile Menu (Mobile-Optimized) */}
          <div className="flex-shrink-0">
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
                className="w-64 bg-background/95 backdrop-blur-md border border-border/40 shadow-lg"
              >
                {/* User Info Header */}
                <div className="px-3 py-3 border-b border-border/20">
                  <p className="text-sm font-medium text-foreground truncate">{userName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>

                {/* NAVIGATION SECTION */}
                <DropdownMenuLabel className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Navigation
                </DropdownMenuLabel>
                
                <DropdownMenuItem onClick={handleDashboard} className="gap-3 py-2.5 mx-2 rounded-lg">
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleProfile} className="gap-3 py-2.5 mx-2 rounded-lg">
                  <User className="h-4 w-4" />
                  My Profile
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-2" />

                {/* SETTINGS SECTION - Consolidated */}
                <DropdownMenuLabel className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Settings
                </DropdownMenuLabel>

                <DropdownMenuItem onClick={handleSettings} className="gap-3 py-2.5 mx-2 rounded-lg">
                  <Store className="h-4 w-4" />
                  <div className="flex-1">
                    <span>Business Settings</span>
                    <span className="text-xs text-muted-foreground block">Shop name, contact info</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleInventoryCategories} className="gap-3 py-2.5 mx-2 rounded-lg">
                  <Package className="h-4 w-4" />
                  <div className="flex-1">
                    <span>Inventory Categories</span>
                    <span className="text-xs text-muted-foreground block">Manage product categories</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={toggleTheme} className="gap-3 py-2.5 mx-2 rounded-lg">
                  <Palette className="h-4 w-4" />
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <span>Theme</span>
                      <span className="text-xs text-muted-foreground block">Light or dark mode</span>
                    </div>
                    <span className="text-xs text-muted-foreground capitalize bg-accent px-2 py-1 rounded-md">
                      {theme}
                    </span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-2" />

                {/* ACCOUNT SECTION */}
                <DropdownMenuLabel className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Account
                </DropdownMenuLabel>

                <DropdownMenuItem onClick={handleProfile} className="gap-3 py-2.5 mx-2 rounded-lg">
                  <Shield className="h-4 w-4" />
                  <div className="flex-1">
                    <span>Security & Privacy</span>
                    <span className="text-xs text-muted-foreground block">Password, notifications</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-2" />

                {/* Sign Out */}
                <DropdownMenuItem 
                  onClick={handleSignOut} 
                  disabled={isSigningOut}
                  className="gap-3 py-2.5 mx-2 rounded-lg text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  {isSigningOut ? "Signing out..." : "Sign Out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
});

TodayHeader.displayName = "TodayHeader";