import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Store, 
  Bell, 
  Shield, 
  Palette, 
  ChevronRight,
  Edit,
  Mail,
  Phone
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import { getShopName, getUserInitials } from "@/lib/config/shop";

export const MobileProfile = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const shopName = getShopName(user);
  const userInitials = getUserInitials(user);
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User";

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    toast({
      title: "Theme Updated",
      description: `Switched to ${newTheme} mode`,
    });
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-4 border-white/20">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{userName}</h2>
            <p className="text-primary-100 text-sm">{user?.email}</p>
            <p className="text-primary-200 text-xs mt-1">Inventory Manager</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-white hover:bg-white/20"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-gray-900">156</div>
              <div className="text-xs text-gray-500">Items</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-gray-900">23</div>
              <div className="text-xs text-gray-500">Sales Today</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-gray-900">$1,247</div>
              <div className="text-xs text-gray-500">Revenue</div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              <Button
                variant="ghost"
                className="w-full justify-start h-14 gap-3 rounded-none"
              >
                <User className="h-5 w-5 text-gray-600" />
                <div className="flex-1 text-left">
                  <div className="font-medium">Personal Information</div>
                  <div className="text-sm text-gray-500">Name, email, phone</div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate('/settings')}
                className="w-full justify-start h-14 gap-3 rounded-none"
              >
                <Store className="h-5 w-5 text-gray-600" />
                <div className="flex-1 text-left">
                  <div className="font-medium">Business Settings</div>
                  <div className="text-sm text-gray-500">Shop name, categories</div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-14 gap-3 rounded-none"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                <div className="flex-1 text-left">
                  <div className="font-medium">Notifications</div>
                  <div className="text-sm text-gray-500">Alerts and reminders</div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Button>

              <Button
                variant="ghost"
                onClick={toggleTheme}
                className="w-full justify-start h-14 gap-3 rounded-none"
              >
                <Palette className="h-5 w-5 text-gray-600" />
                <div className="flex-1 text-left">
                  <div className="font-medium">Theme</div>
                  <div className="text-sm text-gray-500">Light or dark mode</div>
                </div>
                <span className="text-sm text-gray-500 capitalize">{theme}</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-14 gap-3 rounded-none"
              >
                <Shield className="h-5 w-5 text-gray-600" />
                <div className="flex-1 text-left">
                  <div className="font-medium">Security & Privacy</div>
                  <div className="text-sm text-gray-500">Password, data</div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">+1 (555) 123-4567</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};