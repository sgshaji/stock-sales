
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TouchTarget } from "@/components/ui/mobile-touch";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { SearchInput } from "@/components/ui/search";
import { 
  Package, 
  Edit,
  Trash2,
  MoreVertical,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { InventoryItem } from "@/types/inventory";

interface WhatsAppStyleInventoryListProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  onQuickAdjust: (item: InventoryItem, adjustment: number) => void;
  searchQuery?: string;
  onSearch?: (query: string) => void;
  onItemClick?: (item: InventoryItem) => void;
}

const getStockStatusIcon = (stock: number, reorderPoint?: number) => {
  if (stock === 0) {
    return { icon: AlertTriangle, color: "text-red-500", bgColor: "bg-red-500" };
  }
  if (reorderPoint && stock <= reorderPoint) {
    return { icon: Clock, color: "text-amber-500", bgColor: "bg-amber-500" };
  }
  return { icon: CheckCircle2, color: "text-green-500", bgColor: "bg-green-500" };
};

const getCategoryColor = (category?: string) => {
  const colors = {
    clay: "bg-orange-500",
    plastic: "bg-blue-500",
    cement: "bg-gray-500",
    accessories: "bg-purple-500",
    ceramic: "bg-teal-500",
    default: "bg-slate-500"
  };
  return colors[category as keyof typeof colors] || colors.default;
};

const formatTime = (lastSold?: string | null) => {
  if (!lastSold) return "Never";
  const date = new Date(lastSold);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)} hours ago`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  }
};

export const WhatsAppStyleInventoryList = ({ 
  items, 
  onEdit, 
  onDelete, 
  onQuickAdjust,
  searchQuery,
  onSearch,
  onItemClick
}: WhatsAppStyleInventoryListProps) => {
  const isMobile = useIsMobile();

  const handleItemClick = (item: InventoryItem) => {
    console.log("Item clicked:", item.name);
    if (onItemClick) {
      onItemClick(item);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header with Search */}
      <div className="p-4 border-b border-border/10 bg-background/95 backdrop-blur-md sticky top-0 z-10">
        <SearchInput
          placeholder="Search inventory items..."
          onSearch={onSearch}
          className="bg-accent/30 border-0 rounded-full pl-12 h-12 text-sm"
        />
      </div>

      {/* Filter Tabs (WhatsApp style) - Scrollable on mobile */}
      <div className="border-b border-border/5">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-1 px-4 py-2 w-max">
            <Badge variant="secondary" className="rounded-full px-4 py-1 bg-primary text-primary-foreground flex-shrink-0">
              All
            </Badge>
            <Badge variant="outline" className="rounded-full px-4 py-1 bg-transparent flex-shrink-0">
              Low Stock
            </Badge>
            <Badge variant="outline" className="rounded-full px-4 py-1 bg-transparent flex-shrink-0">
              Fast Moving
            </Badge>
            <Badge variant="outline" className="rounded-full px-4 py-1 bg-transparent flex-shrink-0">
              Categories
            </Badge>
            <Badge variant="outline" className="rounded-full px-4 py-1 bg-transparent flex-shrink-0">
              Out of Stock
            </Badge>
            <Badge variant="outline" className="rounded-full px-4 py-1 bg-transparent flex-shrink-0">
              Reorder Soon
            </Badge>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Inventory List - MATCHING SALES DESIGN */}
      <div className="flex-1 overflow-y-auto">
        {items.map((item, index) => {
          const status = getStockStatusIcon(item.stock, item.reorder_point || undefined);
          const categoryColor = getCategoryColor(item.category || undefined);
          
          return (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-4 p-4 hover:bg-accent/30 active:bg-accent/50 border-b border-border/5 transition-colors cursor-pointer group"
              )}
              onClick={() => handleItemClick(item)}
            >
              {/* Product Avatar - MATCHING SALES DESIGN */}
              <div className="relative flex-shrink-0">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm",
                  categoryColor
                )}>
                  {item.name.substring(0, 2).toUpperCase()}
                </div>
                {/* Status indicator */}
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center",
                  status.bgColor
                )}>
                  <status.icon className={cn("w-2.5 h-2.5 text-white")} />
                </div>
              </div>

              {/* Product Info - MATCHING SALES DESIGN */}
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-medium text-foreground text-base leading-tight line-clamp-1 pr-2 flex-1">
                    {item.name}
                  </h3>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-4">
                    {item.velocity === 'fast' && (
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-sm text-muted-foreground truncate">
                      {item.sku || 'No SKU'}
                    </span>
                    <span className="text-sm font-medium text-primary">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  
                  {/* Stock quantity - prominently displayed on right - MATCHING SALES DESIGN */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-lg font-bold text-foreground">
                        {item.stock}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        units
                      </div>
                    </div>
                    
                    {/* UP/DOWN ARROWS - show on hover - VERTICAL STACK */}
                    <div className="hidden group-hover:flex flex-col items-center gap-0.5 ml-2">
                      <TouchTarget minHeight={32}>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickAdjust(item, 1);
                          }}
                          className="h-6 w-6 rounded-md hover:bg-accent/50 p-0"
                          title="Increase stock"
                        >
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                      </TouchTarget>
                      
                      <TouchTarget minHeight={32}>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickAdjust(item, -1);
                          }}
                          className="h-6 w-6 rounded-md hover:bg-accent/50 p-0"
                          title="Decrease stock"
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </TouchTarget>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <TouchTarget minHeight={32}>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={(e) => e.stopPropagation()}
                              className="h-6 w-6 rounded-md hover:bg-accent/50 p-0 mt-0.5"
                              title="More options"
                            >
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </TouchTarget>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(item);
                            }} 
                            className="gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuickAdjust(item, 5);
                            }} 
                            className="gap-2"
                          >
                            <ChevronUp className="h-4 w-4" />
                            Quick Restock (+5)
                          </DropdownMenuItem>
                          <ConfirmationDialog
                            title="Delete Item"
                            description={`Are you sure you want to delete "${item.name}"?`}
                            confirmText="Delete"
                            variant="destructive"
                            onConfirm={() => onDelete(item)}
                          >
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive gap-2"
                              onSelect={(e) => e.preventDefault()}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete Item
                            </DropdownMenuItem>
                          </ConfirmationDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                {/* Additional info row - MATCHING SALES DESIGN */}
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Last sold: {formatTime(item.last_sold)}
                  </span>
                </div>

                {/* Low stock warning - MATCHING SALES DESIGN */}
                {item.stock <= (item.reorder_point || 5) && (
                  <div className="mt-2 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-xs text-orange-600 dark:text-orange-400">
                      {item.stock === 0 ? 'Out of stock' : `Low stock - Reorder at ${item.reorder_point || 5} units`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
