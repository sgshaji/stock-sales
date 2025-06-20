
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, X, Edit, Check, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const InventoryCategories = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState([
    "Electronics",
    "Clothing", 
    "Food & Beverages",
    "Home & Garden",
    "Sports & Outdoor",
    "Books & Media",
    "Health & Beauty",
    "Automotive"
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories(prev => [...prev, newCategory.trim()]);
      setNewCategory("");
      setIsAdding(false);
      toast({
        title: "Category Added",
        description: `"${newCategory.trim()}" has been added to your inventory categories.`,
      });
    }
  };

  const handleRemoveCategory = (index: number, categoryName: string) => {
    setCategories(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Category Removed",
      description: `"${categoryName}" has been removed from your categories.`,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewCategory("");
    }
  };

  // Suggested categories for quick adding
  const suggestedCategories = [
    "Accessories", "Tools", "Toys", "Office Supplies", "Pet Supplies"
  ].filter(suggested => !categories.includes(suggested));

  return (
    <Card className="card-elevated">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-success/10">
            <Package className="h-5 w-5 text-success-600" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Inventory Categories</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Organize your products into categories for better management
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAdding(true)}
          className="h-9 w-9 p-0 rounded-xl"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-2 px-3 py-2 text-sm bg-accent/50 hover:bg-accent/70 transition-colors"
            >
              {category}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveCategory(index, category)}
                className="h-4 w-4 p-0 hover:bg-destructive/20 rounded-full"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          {/* Add New Category Input */}
          {isAdding && (
            <div className="flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-xl px-3 py-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Category name"
                className="h-6 text-xs w-32 border-0 bg-transparent focus-visible:ring-0 p-0"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddCategory}
                className="h-6 w-6 p-0 rounded-full"
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
                className="h-6 w-6 p-0 rounded-full"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Quick Add Suggestions */}
        {suggestedCategories.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              <span>Quick Add</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedCategories.slice(0, 3).map((suggested) => (
                <Button
                  key={suggested}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCategories(prev => [...prev, suggested]);
                    toast({
                      title: "Category Added",
                      description: `"${suggested}" has been added to your categories.`,
                    });
                  }}
                  className="h-8 text-xs border-dashed border-primary-300 text-primary-600 hover:bg-primary-50"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {suggested}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {categories.length === 0 && !isAdding && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-base text-muted-foreground mb-4">
              No categories added yet. Start organizing your inventory!
            </p>
            <Button onClick={() => setIsAdding(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add First Category
            </Button>
          </div>
        )}

        {/* Category Count */}
        {categories.length > 0 && (
          <div className="pt-4 border-t border-border/20">
            <p className="text-xs text-muted-foreground">
              {categories.length} {categories.length === 1 ? 'category' : 'categories'} configured
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
