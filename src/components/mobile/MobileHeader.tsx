import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getShopName, getUserInitials } from "@/lib/config/shop";
import { MobileDrawer } from "./MobileDrawer";

interface MobileHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileHeader = ({ activeTab, onTabChange }: MobileHeaderProps) => {
  const { user } = useAuth();
  const [showDrawer, setShowDrawer] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  
  const shopName = getShopName(user);
  const userInitials = getUserInitials(user);

  return (
    <>
      {/* Fixed Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50 safe-top">
        {/* Left: Shop Name */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-gray-900 truncate">
            {shopName}
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSearch(!showSearch)}
            className="h-10 w-10 rounded-full"
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full relative"
          >
            <Bell className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
          </Button>

          <Button
            variant="ghost"
            onClick={() => setShowDrawer(true)}
            className="h-10 w-10 p-0 rounded-full"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-primary-100 text-primary-700 text-sm font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </header>

      {/* Search Bar (Expandable) */}
      {showSearch && (
        <div className="bg-white border-b border-gray-200 px-4 py-3 animate-slide-down">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search everything..."
              className="w-full h-12 pl-10 pr-4 bg-gray-100 rounded-full border-0 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      <MobileDrawer 
        isOpen={showDrawer} 
        onClose={() => setShowDrawer(false)}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    </>
  );
};