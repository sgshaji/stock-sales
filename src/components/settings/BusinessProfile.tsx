
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Phone, Mail, Edit, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const BusinessProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "My Store",
    phone: "+1 (555) 123-4567",
    email: "contact@mystore.com"
  });

  const handleSave = () => {
    // TODO: Save to database
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data
    setIsEditing(false);
  };

  return (
    <Card className="card-elevated">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Store className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-headline-large">Business Profile</CardTitle>
        </div>
        {!isEditing ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-9 w-9 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-9 w-9 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="h-9 w-9 p-0"
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
            Business Name
          </Label>
          {isEditing ? (
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
              className="h-11"
            />
          ) : (
            <p className="text-body-large py-2 px-3 bg-accent/30 rounded-lg">
              {formData.businessName}
            </p>
          )}
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
            <p className="text-body-large py-2 px-3 bg-accent/30 rounded-lg">
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
            <p className="text-body-large py-2 px-3 bg-accent/30 rounded-lg">
              {formData.email}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
