import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, X, Edit, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const InventoryCategories = () => {
  const [categories, setCategories] = useState([
    "Electronics",
    "Clothing", 
    "Food & Beverages",
    "Home & Garden",
    "Sports & Outdoor"
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories(prev => [...prev, newCategory.trim()]);
      setNewCategory("");
      setIsAdding(false);
    }
  };

  const handleRemoveCategory = (index: number) => {
    setCategories(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewCategory("");
    }
  };

  return (
    <Card className="card-elevated">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-success/10">
            <Package className="h-5 w-5 text-success-600" />
          </div>
          <CardTitle className="text-headline-large">Inventory Categories</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAdding(true)}
          className="h-9 w-9 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-2 px-3 py-1.5 text-body-small"
            >
              {category}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveCategory(index)}
                className="h-4 w-4 p-0 hover:bg-destructive/20"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          {isAdding && (
            <div className="flex items-center gap-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Category name"
                className="h-8 text-xs w-32"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddCategory}
                className="h-8 w-8 p-0"
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  setNewCategory("");
                }}
                className="h-8 w-8 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        
        {categories.length === 0 && !isAdding && (
          <p className="text-muted-foreground text-body-small text-center py-4">
            No categories added yet. Click the + icon to add your first category.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
