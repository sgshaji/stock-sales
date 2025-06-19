import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Settings, 
  LogOut, 
  Store, 
  Palette, 
  Shield,
  X,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import { getShopName, getUserInitials } from "@/lib/config/shop";
import { cn } from "@/lib/utils";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileDrawer = ({ isOpen, onClose, activeTab, onTabChange }: MobileDrawerProps) => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const shopName = getShopName(user);
  const userInitials = getUserInitials(user);
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User";

  const handleProfile = () => {
    onTabChange("profile");
    onClose();
  };

  const handleSettings = () => {
    navigate('/settings');
    onClose();
    toast({
      title: "Settings",
      description: "Opening business settings...",
    });
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    toast({
      title: "Theme Updated",
      description: `Switched to ${newTheme} mode`,
    });
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 animate-slide-in-from-right shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 safe-top">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* User Info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-primary-100 text-primary-700 text-lg font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{userName}</p>
              <p className="text-sm text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {/* Profile */}
            <Button
              variant="ghost"
              onClick={handleProfile}
              className="w-full justify-start h-12 gap-3 rounded-xl"
            >
              <User className="h-5 w-5" />
              <span className="flex-1 text-left">My Profile</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </Button>

            {/* Business Settings */}
            <Button
              variant="ghost"
              onClick={handleSettings}
              className="w-full justify-start h-12 gap-3 rounded-xl"
            >
              <Store className="h-5 w-5" />
              <span className="flex-1 text-left">Business Settings</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              onClick={toggleTheme}
              className="w-full justify-start h-12 gap-3 rounded-xl"
            >
              <Palette className="h-5 w-5" />
              <span className="flex-1 text-left">Theme</span>
              <span className="text-sm text-gray-500 capitalize">{theme}</span>
            </Button>

            {/* Security */}
            <Button
              variant="ghost"
              onClick={handleProfile}
              className="w-full justify-start h-12 gap-3 rounded-xl"
            >
              <Shield className="h-5 w-5" />
              <span className="flex-1 text-left">Security & Privacy</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 safe-bottom">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start h-12 gap-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>
    </>
  );
};