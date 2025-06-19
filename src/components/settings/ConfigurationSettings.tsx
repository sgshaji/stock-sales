
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Settings, Currency, Edit, Check, X } from "lucide-react";

const currencies = [
  { value: "USD", label: "US Dollar ($)", symbol: "$" },
  { value: "EUR", label: "Euro (€)", symbol: "€" },
  { value: "GBP", label: "British Pound (£)", symbol: "£" },
  { value: "INR", label: "Indian Rupee (₹)", symbol: "₹" },
  { value: "CAD", label: "Canadian Dollar (C$)", symbol: "C$" },
  { value: "AUD", label: "Australian Dollar (A$)", symbol: "A$" },
];

export const ConfigurationSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  const handleSave = () => {
    // TODO: Save to database
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset changes
    setIsEditing(false);
  };

  const currentCurrency = currencies.find(c => c.value === selectedCurrency);

  return (
    <Card className="card-elevated">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-warning/10">
            <Settings className="h-5 w-5 text-warning-600" />
          </div>
          <CardTitle className="text-headline-large">Configuration</CardTitle>
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
          <Label className="flex items-center gap-2 text-label-large">
            <Currency className="h-4 w-4" />
            Currency
          </Label>
          {isEditing ? (
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
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
            <div className="flex items-center gap-2 py-2 px-3 bg-accent/30 rounded-lg">
              <span className="font-medium text-lg">{currentCurrency?.symbol}</span>
              <span className="text-body-large">{currentCurrency?.label}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
