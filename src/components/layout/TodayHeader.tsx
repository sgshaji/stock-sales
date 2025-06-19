import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TouchTarget } from "@/components/ui/mobile-touch";
import { LogOut, Settings, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, memo } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getShopName, getUserInitials } from "@/lib/config/shop";
import { SearchInput } from "@/components/ui/search";

interface TodayHeaderProps {
  onSearch?: (query: string) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const TodayHeader = memo<TodayHeaderProps>(({ onSearch, activeTab, onTabChange }) => {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
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
      <div className="px-4 py-3">
        {/* SINGLE LINE: Shop Name + Controls */}
        <div className="flex items-center justify-between">
          {/* Left: Configurable Shop Name (Primary) */}
          <div className="flex-1 min-w-0 mr-4">
            <h1 className="text-title-large font-bold text-foreground truncate">
              {shopName}
            </h1>
          </div>

          {/* Right: Compact Control Strip */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Search Toggle */}
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

            {/* User Avatar (Clickable for Profile) */}
            <TouchTarget minHeight={44}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleProfileClick}
                className={cn(
                  "h-10 w-10 p-0 rounded-full ml-1",
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

            {/* Sign Out */}
            <TouchTarget minHeight={44}>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleSignOut}
                loading={isSigningOut}
                className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl ml-1"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </TouchTarget>
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