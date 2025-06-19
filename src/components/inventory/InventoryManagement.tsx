
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TouchTarget } from "@/components/ui/mobile-touch";
import { EmptyState } from "@/components/ui/empty-state";
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Minus,
  Edit,
  MoreVertical,
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
          <div className="space-y-3">
            {displayItems.map((item) => {
              const status = getStockStatus(item.stock, item.reorderPoint);
              
              return (
                <Card
                  key={item.id}
                  className="bg-background border border-border/40 rounded-xl hover:bg-accent/20 transition-all duration-200"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      {/* Visual Stock Health Indicator */}
                      <div className="flex-shrink-0">
                        <div className={cn("w-3 h-12 rounded-full", status.color)} />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base text-foreground truncate leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{item.sku}</p>
                        
                        {/* Status and velocity info */}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {status.label}
                          </Badge>
                          {item.velocity === 'fast' && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                              Fast Moving
                            </Badge>
                          )}
                          {item.lastSold && (
                            <span className="text-xs text-muted-foreground">
                              Sold {item.lastSold}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stock Count & Quick Actions */}
                      <div className="flex items-center gap-2">
                        <TouchTarget minHeight={40}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickAdjust(item, -1)}
                            className="h-8 w-8 p-0 rounded-full"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                        </TouchTarget>
                        
                        <TouchTarget minHeight={40}>
                          <Button
                            variant="ghost"
                            className="min-w-[3rem] h-8 font-bold text-lg px-2"
                            onClick={() => handleEdit(item)}
                          >
                            {item.stock}
                          </Button>
                        </TouchTarget>
                        
                        <TouchTarget minHeight={40}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickAdjust(item, 1)}
                            className="h-8 w-8 p-0 rounded-full"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </TouchTarget>

                        {/* More Actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <TouchTarget minHeight={40}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-full"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </TouchTarget>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleEdit(item)} className="gap-2">
                              <Edit className="h-4 w-4" />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleQuickAdjust(item, 5)} className="gap-2">
                              <Plus className="h-4 w-4" />
                              Quick Restock (+5)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleQuickAdjust(item, item.reorderPoint || 10)} className="gap-2">
                              <RefreshCw className="h-4 w-4" />
                              Restock to Reorder Point
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Price and Value Info */}
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-lg font-bold text-primary">
                        ${item.price.toFixed(2)}
                      </span>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground">
                          Stock value: ${(item.stock * item.price).toFixed(2)}
                        </span>
                        {item.reorderPoint && (
                          <div className="text-xs text-muted-foreground">
                            Reorder at: {item.reorderPoint} units
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;
