
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TouchTarget } from "@/components/ui/mobile-touch";
import { EmptyState } from "@/components/ui/empty-state";
import { VirtualizedInventoryList } from "./VirtualizedInventoryList";
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  RefreshCw,
  Filter,
  ArrowUpDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IntelligentSearch } from "./IntelligentSearch";

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  stock: number;
  price: number;
  category?: string;
  lastSold?: string;
  velocity?: 'fast' | 'medium' | 'slow';
  reorderPoint?: number;
}

interface InventoryManagementProps {
  searchQuery?: string;
}

export const InventoryManagement = ({ searchQuery }: InventoryManagementProps) => {
  const [items] = useState<InventoryItem[]>([
    { id: 1, name: "Premium Clay Tiles", sku: "CT001", stock: 3, price: 99.99, category: "clay", lastSold: "2 days ago", velocity: "medium", reorderPoint: 10 },
    { id: 2, name: "Plastic Outdoor Tiles", sku: "PT002", stock: 12, price: 29.99, category: "plastic", lastSold: "1 day ago", velocity: "fast", reorderPoint: 15 },
    { id: 3, name: "Cement Floor Tiles", sku: "CF003", stock: 8, price: 45.99, category: "cement", lastSold: "5 days ago", velocity: "slow", reorderPoint: 12 },
    { id: 4, name: "Tile Spacers", sku: "TS004", stock: 25, price: 8.99, category: "accessories", lastSold: "3 hours ago", velocity: "fast", reorderPoint: 20 },
    { id: 5, name: "Decorative Clay Tiles", sku: "DCT005", stock: 0, price: 129.99, category: "clay", lastSold: "1 week ago", velocity: "slow", reorderPoint: 8 },
  ]);

  const [localSearch, setLocalSearch] = useState("");
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price' | 'lastSold'>('name');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const getStockStatus = (stock: number, reorderPoint?: number) => {
    if (stock === 0) return { status: 'out', color: 'bg-red-500', label: 'Out of Stock', urgent: true };
    if (reorderPoint && stock <= reorderPoint * 0.3) return { status: 'critical', color: 'bg-red-500', label: 'Critical', urgent: true };
    if (reorderPoint && stock <= reorderPoint * 0.6) return { status: 'low', color: 'bg-orange-500', label: 'Low Stock', urgent: true };
    if (reorderPoint && stock <= reorderPoint) return { status: 'medium', color: 'bg-yellow-500', label: 'Reorder Soon', urgent: false };
    return { status: 'good', color: 'bg-green-500', label: 'In Stock', urgent: false };
  };

  const urgentItems = items.filter(item => getStockStatus(item.stock, item.reorderPoint).urgent);
  
  const effectiveSearch = searchQuery || localSearch;
  const filteredItems = effectiveSearch 
    ? items.filter(item => 
        item.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
        item.sku.toLowerCase().includes(effectiveSearch.toLowerCase())
      )
    : items;

  const displayItems = filterCategory !== 'all' 
    ? filteredItems.filter(item => item.category === filterCategory)
    : filteredItems;

  const categories = Array.from(new Set(items.map(item => item.category).filter(Boolean)));

  const handleQuickAdjust = (item: InventoryItem, adjustment: number) => {
    const action = adjustment > 0 ? 'added' : 'removed';
    toast({
      title: "Stock Updated",
      description: `${Math.abs(adjustment)} units ${action} to ${item.name}`,
    });
  };

  const handleEdit = (item: InventoryItem) => {
    toast({
      title: "Edit Item",
      description: `Opening edit form for ${item.name}`,
    });
  };

  const handleDelete = (item: InventoryItem) => {
    toast({
      title: "Item Deleted",
      description: `${item.name} has been removed from inventory`,
    });
  };

  const handleAddItem = () => {
    toast({
      title: "Add New Item",
      description: "Opening item creation form...",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border/20">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Inventory</h2>
              <p className="text-sm text-muted-foreground">{displayItems.length} items</p>
            </div>
            <div className="flex items-center gap-2">
              <TouchTarget minHeight={40}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Sync
                </Button>
              </TouchTarget>
              <TouchTarget minHeight={40}>
                <Button onClick={handleAddItem} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </TouchTarget>
            </div>
          </div>

          {/* Search */}
          {!searchQuery && (
            <div className="mb-4">
              <IntelligentSearch
                placeholder="Search items, SKUs, categories..."
                onSearch={setLocalSearch}
              />
            </div>
          )}

          {/* Filters */}
          <div className="flex gap-2 mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TouchTarget minHeight={40}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    {filterCategory === 'all' ? 'All Categories' : filterCategory}
                  </Button>
                </TouchTarget>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterCategory('all')}>
                  All Categories
                </DropdownMenuItem>
                {categories.map(category => (
                  <DropdownMenuItem key={category} onClick={() => setFilterCategory(category!)}>
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TouchTarget minHeight={40}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    Sort
                  </Button>
                </TouchTarget>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy('name')}>Name</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('stock')}>Stock Level</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('price')}>Price</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('lastSold')}>Last Sold</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Alert for urgent items */}
          {urgentItems.length > 0 && (
            <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-xl">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  {urgentItems.length} item{urgentItems.length > 1 ? 's' : ''} need immediate attention
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
        {displayItems.length === 0 ? (
          <EmptyState
            icon={Package}
            title={effectiveSearch ? "No items found" : "No items"}
            description={
              effectiveSearch 
                ? `No items match "${effectiveSearch}"`
                : "No items in this category."
            }
            action={{
              label: "Add New Item",
              onClick: handleAddItem
            }}
          />
        ) : (
          <VirtualizedInventoryList
            items={displayItems}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onQuickAdjust={handleQuickAdjust}
            height={isMobile ? 500 : 600}
          />
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;
