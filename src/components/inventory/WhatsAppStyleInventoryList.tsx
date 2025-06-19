
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
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react";
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
  reorderPoint?: number;
}

interface WhatsAppStyleInventoryListProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  onQuickAdjust: (item: InventoryItem, adjustment: number) => void;
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

const getStockStatusIcon = (stock: number, reorderPoint?: number) => {
  if (stock === 0) {
    return { icon: AlertTriangle, color: "text-red-500", bgColor: "bg-red-500/10" };
  }
  if (reorderPoint && stock <= reorderPoint) {
    return { icon: Clock, color: "text-amber-500", bgColor: "bg-amber-500/10" };
  }
  return { icon: CheckCircle2, color: "text-green-500", bgColor: "bg-green-500/10" };
};

const getCategoryColor = (category?: string) => {
  const colors = {
    clay: "bg-orange-500",
    plastic: "bg-blue-500",
    cement: "bg-gray-500",
    accessories: "bg-purple-500",
    default: "bg-slate-500"
  };
  return colors[category as keyof typeof colors] || colors.default;
};

const formatTime = (lastSold?: string) => {
  if (!lastSold) return "Never";
  return lastSold;
};

export const WhatsAppStyleInventoryList = ({ 
  items, 
  onEdit, 
  onDelete, 
  onQuickAdjust,
  searchQuery,
  onSearch
}: WhatsAppStyleInventoryListProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header with Search */}
      <div className="p-4 border-b border-border/10 bg-background/95 backdrop-blur-md sticky top-0 z-10">
        <SearchInput
          placeholder="Ask Meta AI or Search"
          onSearch={onSearch}
          className="bg-accent/30 border-0 rounded-full pl-12 h-12 text-sm"
        />
      </div>

      {/* Filter Tabs (WhatsApp style) */}
      <div className="flex gap-1 px-4 py-2 border-b border-border/5">
        <Badge variant="secondary" className="rounded-full px-4 py-1 bg-primary text-primary-foreground">
          All
        </Badge>
        <Badge variant="outline" className="rounded-full px-4 py-1 bg-transparent">
          Low Stock
        </Badge>
        <Badge variant="outline" className="rounded-full px-4 py-1 bg-transparent">
          Fast Moving
        </Badge>
        <Badge variant="outline" className="rounded-full px-4 py-1 bg-transparent">
          Categories
        </Badge>
      </div>

      {/* Inventory List */}
      <div className="flex-1 overflow-y-auto">
        {items.map((item, index) => {
          const status = getStockStatusIcon(item.stock, item.reorderPoint);
          const categoryColor = getCategoryColor(item.category);
          
          return (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-3 p-4 hover:bg-accent/30 active:bg-accent/50 border-b border-border/5 transition-colors",
                "group cursor-pointer"
              )}
              onClick={() => onEdit(item)}
            >
              {/* Product Avatar */}
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
                  <status.icon className={cn("w-2.5 h-2.5", status.color)} />
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-foreground truncate text-base">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {formatTime(item.lastSold)}
                    </span>
                    {item.velocity === 'fast' && (
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {item.sku}
                    </span>
                    <span className="text-sm font-medium">
                      Stock: {item.stock}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-primary">
                      ${item.price.toFixed(2)}
                    </span>
                    {item.stock <= (item.reorderPoint || 5) && (
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions (shown on hover/mobile) */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <TouchTarget minHeight={32}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickAdjust(item, -1);
                    }}
                    className="h-8 w-8 p-0 rounded-full hover:bg-accent/50"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                </TouchTarget>
                
                <TouchTarget minHeight={32}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickAdjust(item, 1);
                    }}
                    className="h-8 w-8 p-0 rounded-full hover:bg-accent/50"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </TouchTarget>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <TouchTarget minHeight={32}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                        className="h-8 w-8 p-0 rounded-full hover:bg-accent/50"
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </TouchTarget>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onEdit(item)} className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onQuickAdjust(item, 5)} className="gap-2">
                      <Plus className="h-4 w-4" />
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
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Item
                      </DropdownMenuItem>
                    </ConfirmationDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-20">
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg bg-green-500 hover:bg-green-600 text-white"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};
