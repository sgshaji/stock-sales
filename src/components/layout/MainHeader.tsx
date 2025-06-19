import { useState, memo } from "react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { TouchTarget } from "@/components/ui/mobile-touch";
import { LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface MainHeaderProps {
  onSearch: (query: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MainHeader = memo<MainHeaderProps>(({ onSearch, activeTab, onTabChange }) => {
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

  // Get user's business name from profile or fallback to email
  const getWorkspaceName = () => {
    if (user?.user_metadata?.business_name) {
      return `${user.user_metadata.business_name}`;
    }
    if (user?.user_metadata?.full_name) {
      return `${user.user_metadata.full_name}'s Store`;
    }
    if (user?.email) {
      const emailName = user.email.split('@')[0];
      return `${emailName}'s Store`;
    }
    return "Your Store";
  };

  return (
    <div className="bg-background/95 backdrop-blur-md shadow-sm border-b border-border/30 sticky top-0 z-20">
      <div className={cn(
        "p-4",
        isMobile ? "py-3" : "p-6"
      )}>
        <div className="flex justify-between items-center mb-4">
          <div className="animate-fade-in">
            <h1 className={cn(
              "bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent dark:from-primary-400 dark:to-primary-500 font-bold",
              isMobile ? "text-title-large" : "text-display-medium"
            )}>
              StockFlow
            </h1>
            <p className={cn(
              "text-muted-foreground mt-0.5",
              isMobile ? "text-body-small" : "text-body-medium"
            )}>
              {getWorkspaceName()}
            </p>
          </div>
          
          {/* Mobile-optimized action buttons */}
          <div className="flex items-center gap-1">
            <div className={cn(
              "flex items-center bg-background/60 rounded-2xl border border-border/30 backdrop-blur-sm",
              isMobile ? "p-1 gap-1" : "p-1 gap-1"
            )}>
              <TouchTarget minHeight={44}>
                <ThemeToggle />
              </TouchTarget>
              
              <TouchTarget minHeight={44}>
                <Button 
                  variant="ghost" 
                  size="icon-sm"
                  onClick={() => onTabChange("profile")}
                  className={cn(
                    "animate-quick rounded-xl",
                    activeTab === "profile" 
                      ? "bg-primary-50 text-primary-600 shadow-sm dark:bg-primary-950/50 dark:text-primary-400" 
                      : "hover:bg-accent/50"
                  )}
                  title="Open settings"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TouchTarget>
            </div>
            
            <TouchTarget minHeight={44}>
              <Button 
                variant="ghost" 
                size="icon-sm"
                onClick={handleSignOut}
                loading={isSigningOut}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 animate-quick ml-2 rounded-xl"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </TouchTarget>
          </div>
        </div>
        
        {/* Enhanced Search */}
        {showSearch && (
          <div className="animate-slide-down">
            <SearchInput
              placeholder="Search across all modules..."
              onSearch={onSearch}
              className="w-full bg-background/80 backdrop-blur-sm border-border/40 rounded-2xl"
            />
          </div>
        )}
      </div>
    </div>
  );
});

MainHeader.displayName = "MainHeader";