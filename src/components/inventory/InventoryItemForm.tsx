
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventory } from "@/hooks/use-inventory";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-skeleton";
import { Package, DollarSign, BarChart3 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

interface InventoryItemFormProps {
  item?: Tables<"inventory_items"> | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const categories = [
  { value: "clay", label: "Clay Tiles" },
  { value: "plastic", label: "Plastic Tiles" },
  { value: "cement", label: "Cement Tiles" },
  { value: "ceramic", label: "Ceramic Tiles" },
  { value: "accessories", label: "Accessories" },
  { value: "other", label: "Other" }
];

const velocityOptions = [
  { value: "fast", label: "Fast Moving" },
  { value: "medium", label: "Medium" },
  { value: "slow", label: "Slow Moving" }
];

export const InventoryItemForm = ({ item, onClose, onSuccess }: InventoryItemFormProps) => {
  const { addItem, updateItem, isAddingItem, isUpdatingItem } = useInventory();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: item?.name || "",
    sku: item?.sku || "",
    price: item?.price?.toString() || "",
    purchase_price: item?.purchase_price?.toString() || "",
    stock_quantity: item?.stock_quantity?.toString() || "0",
    reorder_point: item?.reorder_point?.toString() || "10",
    category: item?.category || "",
    velocity: item?.velocity || ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEditing = !!item;
  const isLoading = isAddingItem || isUpdatingItem;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid selling price is required";
    }

    if (formData.purchase_price && parseFloat(formData.purchase_price) < 0) {
      newErrors.purchase_price = "Purchase price cannot be negative";
    }

    if (!formData.stock_quantity || parseInt(formData.stock_quantity) < 0) {
      newErrors.stock_quantity = "Valid stock quantity is required";
    }

    if (!formData.reorder_point || parseInt(formData.reorder_point) < 0) {
      newErrors.reorder_point = "Valid reorder point is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const itemData = {
      name: formData.name.trim(),
      sku: formData.sku.trim() || null,
      price: parseFloat(formData.price),
      purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
      stock_quantity: parseInt(formData.stock_quantity),
      reorder_point: parseInt(formData.reorder_point),
      category: formData.category || null,
      velocity: formData.velocity || null
    };

    if (isEditing && item) {
      updateItem({ 
        id: item.id, 
        updates: itemData 
      });
      toast({
        title: "Item Updated",
        description: `${itemData.name} has been updated successfully.`,
      });
    } else {
      addItem(itemData);
      toast({
        title: "Item Added",
        description: `${itemData.name} has been added to inventory.`,
      });
    }
    
    onSuccess?.();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const profit = formData.price && formData.purchase_price 
    ? parseFloat(formData.price) - parseFloat(formData.purchase_price)
    : 0;

  const margin = formData.price && formData.purchase_price && parseFloat(formData.price) > 0
    ? ((parseFloat(formData.price) - parseFloat(formData.purchase_price)) / parseFloat(formData.price)) * 100
    : 0;

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Package className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">
            {isEditing ? "Edit Item" : "Add New Item"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isEditing ? "Update item details" : "Enter product information"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter product name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  type="text"
                  value={formData.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  placeholder="Enter SKU (optional)"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleInputChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="purchase_price">Purchase Price</Label>
                <Input
                  id="purchase_price"
                  type="number"
                  step="0.01"
                  value={formData.purchase_price}
                  onChange={(e) => handleInputChange("purchase_price", e.target.value)}
                  placeholder="0.00"
                  className={errors.purchase_price ? "border-red-500" : ""}
                />
                {errors.purchase_price && <p className="text-sm text-red-500 mt-1">{errors.purchase_price}</p>}
              </div>

              <div>
                <Label htmlFor="price">Selling Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0.00"
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
              </div>
            </div>

            {/* Profit/Margin Display */}
            {formData.price && formData.purchase_price && (
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Profit per unit:</span>
                    <span className={`ml-2 font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${profit.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Margin:</span>
                    <span className={`ml-2 font-medium ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {margin.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stock Management */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Stock Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => handleInputChange("stock_quantity", e.target.value)}
                  placeholder="0"
                  className={errors.stock_quantity ? "border-red-500" : ""}
                />
                {errors.stock_quantity && <p className="text-sm text-red-500 mt-1">{errors.stock_quantity}</p>}
              </div>

              <div>
                <Label htmlFor="reorder_point">Reorder Point *</Label>
                <Input
                  id="reorder_point"
                  type="number"
                  value={formData.reorder_point}
                  onChange={(e) => handleInputChange("reorder_point", e.target.value)}
                  placeholder="10"
                  className={errors.reorder_point ? "border-red-500" : ""}
                />
                {errors.reorder_point && <p className="text-sm text-red-500 mt-1">{errors.reorder_point}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="velocity">Sales Velocity</Label>
              <Select 
                value={formData.velocity} 
                onValueChange={(value) => handleInputChange("velocity", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select velocity" />
                </SelectTrigger>
                <SelectContent>
                  {velocityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                {isEditing ? "Updating..." : "Adding..."}
              </>
            ) : (
              isEditing ? "Update Item" : "Add Item"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
