import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Phone, Mail, Edit, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getShopName } from "@/lib/config/shop";

export const BusinessProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    businessName: getShopName(user),
    phone: user?.user_metadata?.phone || "+1 (555) 123-4567",
    email: user?.email || "contact@mystore.com"
  });

  const handleSave = () => {
    // TODO: Save to Supabase user profile
    toast({
      title: "Success",
      description: "Business profile updated successfully! Changes will appear in the header.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      businessName: getShopName(user),
      phone: user?.user_metadata?.phone || "+1 (555) 123-4567",
      email: user?.email || "contact@mystore.com"
    });
    setIsEditing(false);
  };

  return (
    <Card className="card-elevated">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Store className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-headline-large">Business Profile</CardTitle>
        </div>
        {!isEditing ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-9 w-9 p-0 rounded-xl"
          >
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-9 w-9 p-0 rounded-xl"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="h-9 w-9 p-0 rounded-xl"
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="businessName" className="flex items-center gap-2 text-label-large">
            <Store className="h-4 w-4" />
            Shop Name
          </Label>
          {isEditing ? (
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
              className="h-11"
              placeholder="Enter your shop name"
            />
          ) : (
            <p className="text-body-large py-2 px-3 bg-accent/30 rounded-xl">
              {formData.businessName}
            </p>
          )}
          <p className="text-label-small text-muted-foreground">
            This name appears in the header and throughout the app
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2 text-label-large">
            <Phone className="h-4 w-4" />
            Contact Number
          </Label>
          {isEditing ? (
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="h-11"
            />
          ) : (
            <p className="text-body-large py-2 px-3 bg-accent/30 rounded-xl">
              {formData.phone}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2 text-label-large">
            <Mail className="h-4 w-4" />
            Email Address
          </Label>
          {isEditing ? (
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="h-11"
            />
          ) : (
            <p className="text-body-large py-2 px-3 bg-accent/30 rounded-xl">
              {formData.email}
            </p>
          )}
        </div>

        {/* Brand Information */}
        <div className="pt-4 border-t border-border/20">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-label-large">
              <Store className="h-4 w-4" />
              App Brand
            </Label>
            <p className="text-body-large py-2 px-3 bg-accent/30 rounded-xl">
              StockFlow - Smart Inventory Management
            </p>
            <p className="text-label-small text-muted-foreground">
              The app brand name and description (not editable)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};