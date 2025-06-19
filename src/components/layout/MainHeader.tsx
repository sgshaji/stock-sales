
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { TouchTarget } from "@/components/ui/mobile-touch";
import { LogOut, Settings, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface MainHeaderProps {
  onSearch: (query: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MainHeader = ({ onSearch, activeTab, onTabChange }: MainHeaderProps) => {
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

  return (
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
          
          {/* Mobile-optimized action buttons - ICON ONLY */}
          <div className="flex items-center gap-1">
            <div className={cn(
              "flex items-center bg-background/60 rounded-xl border border-border/40",
              isMobile ? "p-1 gap-1" : "p-1 gap-1"
            )}>
              <TouchTarget minHeight={44}>
                <Button 
                  variant="ghost" 
                  size="icon-sm"
                  onClick={() => setShowSearch(!showSearch)}
                  className={cn(
                    "animate-quick",
                    showSearch 
                      ? "bg-brand-50 text-brand-600 shadow-sm dark:bg-brand-950/50 dark:text-brand-400" 
                      : "hover:bg-accent/50"
                  )}
                  title="Toggle search"
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
                  size="icon-sm"
                  onClick={() => onTabChange("profile")}
                  className={cn(
                    "animate-quick",
                    activeTab === "profile" 
                      ? "bg-brand-50 text-brand-600 shadow-sm dark:bg-brand-950/50 dark:text-brand-400" 
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
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 animate-quick ml-space-2"
                title="Sign out"
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
              onSearch={onSearch}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};
