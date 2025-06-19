
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TouchTarget } from "@/components/ui/mobile-touch";
import { EmptyState } from "@/components/ui/empty-state";
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Plus, 
  Minus,
  Edit,
  MoreVertical,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  stock: number;
  price: number;
  category?: string;
  lastSold?: string;
  velocity?: 'fast' | 'medium' | 'slow';
}

interface ActionableInventoryDashboardProps {
  searchQuery?: string;
}

export const ActionableInventoryDashboard = ({ searchQuery }: ActionableInventoryDashboardProps) => {
  const [items] = useState<InventoryItem[]>([
    { id: 1, name: "Premium Clay Tiles", sku: "CT001", stock: 3, price: 99.99, category: "clay", lastSold: "2 days ago", velocity: "medium" },
    { id: 2, name: "Plastic Outdoor Tiles", sku: "PT002", stock: 12, price: 29.99, category: "plastic", lastSold: "1 day ago", velocity: "fast" },
    { id: 3, name: "Cement Floor Tiles", sku: "CF003", stock: 8, price: 45.99, category: "cement", lastSold: "5 days ago", velocity: "slow" },
    { id: 4, name: "Tile Spacers", sku: "TS004", stock: 25, price: 8.99, category: "accessories", lastSold: "3 hours ago", velocity: "fast" },
    { id: 5, name: "Decorative Clay Tiles", sku: "DCT005", stock: 0, price: 129.99, category: "clay", lastSold: "1 week ago", velocity: "slow" },
  ]);

  const [activeView, setActiveView] = useState<'urgent' | 'trending' | 'all'>('urgent');
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { status: 'out', color: 'bg-red-500', label: 'Out', urgent: true };
    if (stock <= 5) return { status: 'low', color: 'bg-orange-500', label: 'Low', urgent: true };
    if (stock <= 10) return { status: 'medium', color: 'bg-yellow-500', label: 'Medium', urgent: false };
    return { status: 'good', color: 'bg-green-500', label: 'Good', urgent: false };
  };

  const urgentItems = items.filter(item => getStockStatus(item.stock).urgent);
  const trendingItems = items.filter(item => item.velocity === 'fast');
  
  const filteredItems = searchQuery 
    ? items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  const getDisplayItems = () => {
    const baseItems = searchQuery ? filteredItems : items;
    
    switch (activeView) {
      case 'urgent': return baseItems.filter(item => getStockStatus(item.stock).urgent);
      case 'trending': return baseItems.filter(item => item.velocity === 'fast');
      default: return baseItems;
    }
  };

  const displayItems = getDisplayItems();

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

  return (
    <div className="min-h-screen bg-background">
      {/* Quick Stats Dashboard */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border/20">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Inventory Control</h2>
            <TouchTarget minHeight={40}>
              <Button variant="ghost" size="sm" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Sync
              </Button>
            </TouchTarget>
          </div>

          {/* Critical Alerts */}
          {urgentItems.length > 0 && (
            <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-xl">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  {urgentItems.length} item{urgentItems.length > 1 ? 's' : ''} need{urgentItems.length === 1 ? 's' : ''} attention
                </span>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-accent/30 rounded-xl">
              <div className="text-lg font-bold text-foreground">{items.length}</div>
              <div className="text-xs text-muted-foreground">Total Items</div>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-xl">
              <div className="text-lg font-bold text-red-600">{urgentItems.length}</div>
              <div className="text-xs text-muted-foreground">Need Attention</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-xl">
              <div className="text-lg font-bold text-green-600">{trendingItems.length}</div>
              <div className="text-xs text-muted-foreground">Fast Moving</div>
            </div>
          </div>

          {/* Smart Categories */}
          <div className="flex gap-2">
            {[
              { id: 'urgent', label: 'Urgent', count: urgentItems.length, icon: AlertTriangle },
              { id: 'trending', label: 'Trending', count: trendingItems.length, icon: TrendingUp },
              { id: 'all', label: 'All Items', count: items.length, icon: Package }
            ].map((category) => (
              <TouchTarget key={category.id} minHeight={40}>
                <Button
                  variant={activeView === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveView(category.id as any)}
                  className={cn(
                    "flex-1 gap-2 rounded-full",
                    activeView === category.id 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-background/60 hover:bg-accent/50"
                  )}
                >
                  <category.icon className="h-3 w-3" />
                  <span className="text-xs">{category.label}</span>
                  <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-xs">
                    {category.count}
                  </Badge>
                </Button>
              </TouchTarget>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
        {displayItems.length === 0 ? (
          <EmptyState
            icon={Package}
            title={searchQuery ? "No items found" : "No items in this category"}
            description={
              searchQuery 
                ? `No items match "${searchQuery}"`
                : activeView === 'urgent' 
                  ? "Great! No items need immediate attention."
                  : "No items in this category."
            }
          />
        ) : (
          <div className="space-y-3">
            {displayItems.map((item) => {
              const status = getStockStatus(item.stock);
              
              return (
                <div
                  key={item.id}
                  className="bg-background border border-border/40 rounded-xl p-4 hover:bg-accent/20 transition-all duration-200"
                >
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
                      
                      {/* Contextual Info */}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {status.label} Stock
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
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Price Info */}
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-lg font-bold text-primary">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Stock value: ${(item.stock * item.price).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
