import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TouchTarget } from "@/components/ui/mobile-touch";
import { LogOut, Settings, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, memo } from "react";
import { SearchInput } from "@/components/ui/search";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface TodayHeaderProps {
  onSearch?: (query: string) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const TodayHeader = memo<TodayHeaderProps>(({ onSearch, activeTab, onTabChange }) => {
  const [showSearch, setShowSearch] = useState(false);
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

  // Get user's business name from profile or fallback to email
  const getWorkspaceName = () => {
    if (user?.user_metadata?.business_name) {
      return user.user_metadata.business_name;
    }
    if (user?.user_metadata?.full_name) {
      return `${user.user_metadata.full_name}'s Store`;
    }
    if (user?.email) {
      const emailName = user.email.split('@')[0];
      return `${emailName.charAt(0).toUpperCase() + emailName.slice(1)}'s Store`;
    }
    return "Your Store";
  };

  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <div className="bg-background/95 backdrop-blur-md shadow-sm border-b border-border/20 sticky top-0 z-20">
      <div className="px-4 py-4">
        {/* Single Clean Header Row */}
        <div className="flex items-center justify-between">
          {/* Left: StockFlow + Store Name Combined */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex flex-col">
              <h1 className="text-title-large font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                StockFlow
              </h1>
              <p className="text-body-small text-muted-foreground truncate -mt-0.5">
                {getWorkspaceName()}
              </p>
            </div>
          </div>

          {/* Right: Essential Actions Only */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* User Avatar */}
            <TouchTarget minHeight={44}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTabChange?.("profile")}
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
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </TouchTarget>

            {/* Essential Actions - Search & Settings Only */}
            <TouchTarget minHeight={44}>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowSearch(!showSearch)}
                className={cn(
                  "h-10 w-10 p-0 rounded-full",
                  showSearch 
                    ? "bg-primary-50 text-primary-600 shadow-sm" 
                    : "hover:bg-accent/50"
                )}
                title="Toggle search"
              >
                <Search className="h-4 w-4" />
              </Button>
            </TouchTarget>
            
            <TouchTarget minHeight={44}>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleSettingsClick}
                className={cn(
                  "h-10 w-10 p-0 rounded-full",
                  (activeTab === "profile" || window.location.pathname === '/settings')
                    ? "bg-primary-50 text-primary-600 shadow-sm" 
                    : "hover:bg-accent/50"
                )}
                title="Open settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </TouchTarget>

            {/* Logout Button */}
            <TouchTarget minHeight={44}>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleSignOut}
                loading={isSigningOut}
                className="h-10 w-10 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full ml-1"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </TouchTarget>
          </div>
        </div>
        
        {/* Search Bar - Collapsible */}
        {showSearch && (
          <div className="animate-slide-down mt-3">
            <SearchInput
              placeholder="Search across all modules..."
              onSearch={onSearch}
              className="w-full bg-background/80 backdrop-blur-sm border-border/30 rounded-xl h-11"
            />
          </div>
        )}
      </div>
    </div>
  );
});

TodayHeader.displayName = "TodayHeader";