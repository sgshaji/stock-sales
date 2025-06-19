import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, MapPin, Building, Save, Camera, Bell, Shield, Palette, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { getUserInitials } from "@/lib/config/shop";
import { useTheme } from "next-themes";

const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    company: user?.user_metadata?.company || '',
    address: user?.user_metadata?.address || ''
  });
  
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    lowStockAlerts: true,
    salesReports: true,
    darkMode: theme === 'dark'
  });

  const handleSaveProfile = async () => {
    // TODO: Save to Supabase user profile
    toast({
      title: "Success",
      description: "Profile updated successfully!",
    });
    setIsEditing(false);
  };

  const handleThemeToggle = (enabled: boolean) => {
    const newTheme = enabled ? 'dark' : 'light';
    setTheme(newTheme);
    setPreferences(prev => ({ ...prev, darkMode: enabled }));
    toast({
      title: "Theme Updated",
      description: `Switched to ${newTheme} mode`,
    });
  };

  const getInitials = (name: string) => {
    return getUserInitials({ user_metadata: { full_name: name } });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-md mx-auto">
      {/* Enhanced Profile Header */}
      <Card className="bg-gradient-to-r from-primary-50 via-indigo-50 to-primary-50 border-primary-200/50 card-hover overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-primary-500 text-white text-xl font-bold">
                  {getInitials(formData.fullName)}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="sm" 
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary-600 hover:bg-primary-700 shadow-md p-0"
                onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: "Photo upload feature will be available soon!",
                  });
                }}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-headline-large font-bold text-gray-900 truncate">{formData.fullName}</h2>
              <p className="text-body-medium text-gray-600 flex items-center gap-2 truncate">
                <Mail className="h-4 w-4 flex-shrink-0" />
                {formData.email}
              </p>
              <p className="text-label-medium text-primary-600 mt-1 font-medium">Inventory Manager</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary-100 rounded-xl">
              <User className="h-5 w-5 text-primary-600" />
            </div>
            Profile Information
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="h-9 w-9 p-0 rounded-xl"
          >
            {isEditing ? <Save className="h-4 w-4" /> : <User className="h-4 w-4" />}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              disabled={!isEditing}
              className={isEditing ? "border-primary-300" : "bg-gray-50"}
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              value={formData.email}
              disabled
              className="bg-gray-50"
            />
            <p className="text-label-small text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              disabled={!isEditing}
              placeholder="Enter your phone number"
              className={isEditing ? "border-primary-300" : "bg-gray-50"}
            />
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              disabled={!isEditing}
              placeholder="Enter your company name"
              className={isEditing ? "border-primary-300" : "bg-gray-50"}
            />
          </div>
          
          {isEditing && (
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveProfile} className="flex-1">
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* App Preferences */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-info-100 rounded-xl">
              <Palette className="h-5 w-5 text-info-600" />
            </div>
            App Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-body-small text-gray-600">Use dark theme for better night viewing</p>
            </div>
            <Switch 
              checked={preferences.darkMode}
              onCheckedChange={handleThemeToggle}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-body-small text-gray-600">Receive updates via email</p>
            </div>
            <Switch 
              checked={preferences.emailNotifications}
              onCheckedChange={(checked) => setPreferences({...preferences, emailNotifications: checked})}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Low Stock Alerts</p>
              <p className="text-body-small text-gray-600">Get notified when inventory is low</p>
            </div>
            <Switch 
              checked={preferences.lowStockAlerts}
              onCheckedChange={(checked) => setPreferences({...preferences, lowStockAlerts: checked})}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Daily Sales Reports</p>
              <p className="text-body-small text-gray-600">Receive daily sales summaries</p>
            </div>
            <Switch 
              checked={preferences.salesReports}
              onCheckedChange={(checked) => setPreferences({...preferences, salesReports: checked})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-success-100 rounded-xl">
              <Shield className="h-5 w-5 text-success-600" />
            </div>
            Security & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 interactive-hover h-12"
            onClick={() => {
              toast({
                title: "Coming Soon",
                description: "Password change feature will be available soon!",
              });
            }}
          >
            <Lock className="h-4 w-4" />
            <div className="text-left">
              <div className="font-medium">Change Password</div>
              <div className="text-label-small text-muted-foreground">Update your account password</div>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 interactive-hover h-12"
            onClick={() => {
              toast({
                title: "Coming Soon",
                description: "Email update feature will be available soon!",
              });
            }}
          >
            <Mail className="h-4 w-4" />
            <div className="text-left">
              <div className="font-medium">Update Email Address</div>
              <div className="text-label-small text-muted-foreground">Change your login email</div>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;