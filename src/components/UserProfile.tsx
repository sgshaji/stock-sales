import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, MapPin, Building, Save, Camera, Bell, Shield, Palette } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
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
    salesReports: true
  });

  const handleSaveProfile = async () => {
    // Here you would typically update the user profile in Supabase
    toast({
      title: "Success",
      description: "Profile updated successfully!",
    });
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-system-lg animate-fade-in">
      {/* Enhanced Profile Header */}
      <Card className="bg-gradient-to-r from-primary-50 via-indigo-50 to-primary-50 border-primary-200 card-hover">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-primary-500 text-white text-xl">
                  {getInitials(formData.fullName)}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="sm" 
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary-600 hover:bg-primary-700 shadow-md"
                onClick={() => {}}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{formData.fullName}</h2>
              <p className="text-gray-600 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {formData.email}
              </p>
              <p className="text-sm text-primary-600 mt-1 font-medium">Inventory Manager</p>
            </div>
            <Button 
              variant={isEditing ? "default" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
              className="gap-2"
            >
              {isEditing ? <Save className="h-4 w-4" /> : <User className="h-4 w-4" />}
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Profile Information */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary-100 rounded-lg">
              <User className="h-5 w-5 text-primary-600" />
            </div>
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-system-md">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                disabled={!isEditing}
                className={isEditing ? "border-blue-300" : "bg-gray-50"}
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
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                disabled={!isEditing}
                placeholder="Enter your phone number"
                className={isEditing ? "border-blue-300" : "bg-gray-50"}
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
                className={isEditing ? "border-blue-300" : "bg-gray-50"}
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                disabled={!isEditing}
                placeholder="Enter your address"
                className={isEditing ? "border-blue-300" : "bg-gray-50"}
              />
            </div>
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

      {/* Enhanced Notification Preferences */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Bell className="h-5 w-5 text-warning-600" />
            </div>
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-system-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive updates via email</p>
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
              <p className="text-sm text-gray-600">Get notified when inventory is low</p>
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
              <p className="text-sm text-gray-600">Receive daily sales summaries</p>
            </div>
            <Switch 
              checked={preferences.salesReports}
              onCheckedChange={(checked) => setPreferences({...preferences, salesReports: checked})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Security Settings */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-success-100 rounded-lg">
              <Shield className="h-5 w-5 text-success-600" />
            </div>
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-system-md">
          <Button variant="outline" className="w-full justify-start gap-2 interactive-hover">
            <Shield className="h-4 w-4" />
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2 interactive-hover">
            <Mail className="h-4 w-4" />
            Update Email Address
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
