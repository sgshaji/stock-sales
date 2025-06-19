import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TouchTarget } from "@/components/ui/mobile-touch";
import { LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, memo } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getShopName, getUserInitials, defaultShopConfig } from "@/lib/config/shop";

interface TodayHeaderProps {
  onSearch?: (query: string) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const TodayHeader = memo<TodayHeaderProps>(({ onSearch, activeTab, onTabChange }) => {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  // Handle settings click - navigate to settings page
  const handleSettingsClick = () => {
    if (window.location.pathname === '/') {
      // If on main page, use tab change
      onTabChange?.("profile");
    } else {
      // If on other pages, navigate to settings
      navigate('/settings');
    }
  };

  // Handle profile click
  const handleProfileClick = () => {
    if (window.location.pathname === '/') {
      onTabChange?.("profile");
    } else {
      navigate('/');
      // Small delay to ensure navigation completes before tab change
      setTimeout(() => onTabChange?.("profile"), 100);
    }
  };

  const shopName = getShopName(user);
  const userInitials = getUserInitials(user);

  return (
    <div className="bg-background/95 backdrop-blur-md shadow-sm border-b border-border/20 sticky top-0 z-20">
      <div className="px-4 py-4">
        {/* Clean Two-Row Header Layout */}
        <div className="space-y-2">
          {/* Top Row: Brand + Controls */}
          <div className="flex items-center justify-between">
            {/* Left: StockFlow Brand */}
            <div className="flex items-center">
              <h1 className="text-title-large font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                {defaultShopConfig.brandName}
              </h1>
            </div>

            {/* Right: Essential Controls */}
            <div className="flex items-center gap-1">
              {/* Theme Toggle */}
              <TouchTarget minHeight={44}>
                <ThemeToggle />
              </TouchTarget>
              
              {/* Settings */}
              <TouchTarget minHeight={44}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleSettingsClick}
                  className={cn(
                    "h-9 w-9 p-0 rounded-xl",
                    (activeTab === "profile" || window.location.pathname === '/settings')
                      ? "bg-primary-50 text-primary-600 shadow-sm" 
                      : "hover:bg-accent/50"
                  )}
                  title="Open settings"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TouchTarget>

              {/* Logout */}
              <TouchTarget minHeight={44}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleSignOut}
                  loading={isSigningOut}
                  className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TouchTarget>
            </div>
          </div>

          {/* Bottom Row: Shop Name + Avatar (Bottom-Right) */}
          <div className="flex items-center justify-between">
            {/* Left: Configurable Shop Name */}
            <div className="flex-1 min-w-0">
              <p className="text-body-medium text-muted-foreground truncate">
                {shopName}
              </p>
            </div>

            {/* Right: User Avatar (Bottom-Right Position) */}
            <TouchTarget minHeight={44}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleProfileClick}
                className={cn(
                  "h-10 w-10 p-0 rounded-full",
                  activeTab === "profile" 
                    ? "bg-primary-50 ring-2 ring-primary-200" 
                    : "hover:bg-accent/50"
                )}
                title="View profile"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-primary-100 text-primary-700 text-sm font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </TouchTarget>
          </div>
        </div>
      </div>
    </div>
  );
});

TodayHeader.displayName = "TodayHeader";