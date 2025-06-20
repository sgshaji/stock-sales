import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Currency, Edit, Check, X, Globe, Clock, Bell, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCurrency, currencies } from "@/contexts/CurrencyContext";
import { supabase } from "@/integrations/supabase/client";

const timezones = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
];

interface ProfileWithNotifications {
  id: string;
  email: string;
  full_name?: string;
  business_name?: string;
  timezone?: string;
  currency?: string;
  notification_email?: string;
  reminder_time?: string;
  email_notifications_enabled?: boolean;
}

export const ConfigurationSettings = () => {
  const { toast } = useToast();
  const { selectedCurrency, setCurrency } = useCurrency();
  const [isEditing, setIsEditing] = useState(false);
  const [tempCurrency, setTempCurrency] = useState(selectedCurrency);
  const [selectedTimezone, setSelectedTimezone] = useState("UTC");
  const [notificationEmail, setNotificationEmail] = useState("");
  const [reminderTime, setReminderTime] = useState("18:00");
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false);

  useEffect(() => {
    setTempCurrency(selectedCurrency);
    loadUserSettings();
  }, [selectedCurrency]);

  const loadUserSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        const profileWithNotifications = profile as ProfileWithNotifications;
        setSelectedTimezone(profileWithNotifications.timezone || 'UTC');
        setNotificationEmail(profileWithNotifications.notification_email || profileWithNotifications.email || '');
        setReminderTime(profileWithNotifications.reminder_time || '18:00');
        setEmailNotificationsEnabled(profileWithNotifications.email_notifications_enabled || false);
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
    }
  };

  const handleSave = async () => {
    try {
      // Validate email if notifications are enabled
      if (emailNotificationsEnabled && !notificationEmail) {
        toast({
          title: "Error",
          description: "Please enter a notification email address.",
          variant: "destructive",
        });
        return;
      }

      // Save currency setting
      setCurrency(tempCurrency);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Update user profile
      const { error } = await supabase
        .from('profiles')
        .update({
          timezone: selectedTimezone,
          currency: tempCurrency,
          notification_email: notificationEmail || null,
          reminder_time: reminderTime,
          email_notifications_enabled: emailNotificationsEnabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Configuration settings updated successfully!",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    // Reset changes to original values
    setTempCurrency(selectedCurrency);
    loadUserSettings(); // Reload original settings
    setIsEditing(false);
  };

  const currentCurrency = currencies.find(c => c.value === selectedCurrency);
  const currentTimezone = timezones.find(t => t.value === selectedTimezone);

  return (
    <Card className="card-elevated">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-2 rounded-xl bg-warning/10 flex-shrink-0">
            <Settings className="h-5 w-5 text-warning-600" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-xl font-semibold">App Configuration</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Regional settings and app preferences
            </p>
          </div>
        </div>
        {!isEditing ? (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsEditing(true)}
            className="flex-shrink-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleCancel}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleSave}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Currency className="h-4 w-4" />
            Currency
          </Label>
          {isEditing ? (
            <Select value={tempCurrency} onValueChange={setTempCurrency}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{currency.symbol}</span>
                      <span>{currency.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex items-center gap-2 py-2 px-3 bg-accent/30 rounded-xl">
              <span className="font-medium text-lg">{currentCurrency?.symbol}</span>
              <span className="text-base">{currentCurrency?.label}</span>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            This currency will be used throughout the app for pricing and reports
          </p>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Clock className="h-4 w-4" />
            Timezone
          </Label>
          {isEditing ? (
            <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((timezone) => (
                  <SelectItem key={timezone.value} value={timezone.value}>
                    {timezone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="py-2 px-3 bg-accent/30 rounded-xl">
              <span className="text-base">{currentTimezone?.label}</span>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Used for timestamps and scheduling features
          </p>
        </div>

        {/* Email Notifications Section */}
        <div className="pt-4 border-t border-border/20 space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Bell className="h-4 w-4" />
              Daily Sales Reminder
            </Label>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={emailNotificationsEnabled} 
                onCheckedChange={setEmailNotificationsEnabled}
                disabled={!isEditing}
              />
              <span className="text-sm">Enable email notifications</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Get reminded to enter daily sales if no entries are recorded
            </p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4" />
              Notification Email
            </Label>
            {isEditing ? (
              <Input
                type="email"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
                placeholder="Enter email address for notifications"
                className="h-11"
                disabled={!emailNotificationsEnabled}
              />
            ) : (
              <div className="py-2 px-3 bg-accent/30 rounded-xl">
                <span className="text-base">{notificationEmail || 'No email set'}</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Email address where reminders will be sent
            </p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4" />
              Reminder Time
            </Label>
            {isEditing ? (
              <Input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="h-11"
                disabled={!emailNotificationsEnabled}
              />
            ) : (
              <div className="py-2 px-3 bg-accent/30 rounded-xl">
                <span className="text-base">{reminderTime}</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Time when reminder emails will be sent if no sales recorded
            </p>
          </div>
        </div>

        {/* App Information */}
        <div className="pt-4 border-t border-border/20 space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Globe className="h-4 w-4" />
              App Version
            </Label>
            <div className="py-2 px-3 bg-accent/30 rounded-xl">
              <span className="text-base">StockFlow v1.0.0</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Current version of the inventory management app
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
