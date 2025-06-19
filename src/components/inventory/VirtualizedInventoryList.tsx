import { FixedSizeList as List } from 'react-window';
import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TouchTarget } from "@/components/ui/mobile-touch";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { 
  Package, 
  Edit,
  Trash2,
  MoreVertical,
  Plus,
  Minus
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

interface VirtualizedInventoryListProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  onQuickAdjust: (item: InventoryItem, adjustment: number) => void;
  height?: number;
}

interface ItemRendererProps {
  index: number;
  style: React.CSSProperties;
  data: {
    items: InventoryItem[];
    onEdit: (item: InventoryItem) => void;
    onDelete: (item: InventoryItem) => void;
    onQuickAdjust: (item: InventoryItem, adjustment: number) => void;
    isMobile: boolean;
  };
}

const getStockStatus = (stock: number, reorderPoint?: number) => {
  if (stock === 0) {
    return { 
      status: 'out', 
      bgColor: 'bg-red-50 dark:bg-red-950/20', 
      borderColor: 'border-red-200 dark:border-red-800',
      textColor: 'text-red-800 dark:text-red-200',
      label: 'Out of Stock',
      dotColor: 'bg-red-500'
    };
  }
  
  if (reorderPoint && stock < reorderPoint) {
    return { 
      status: 'low', 
      bgColor: 'bg-amber-50 dark:bg-amber-950/20', 
      borderColor: 'border-amber-200 dark:border-amber-800',
      textColor: 'text-amber-800 dark:text-amber-200',
      label: 'Low Stock',
      dotColor: 'bg-amber-500'
    };
  }
  
  return { 
    status: 'good', 
    bgColor: 'bg-green-50 dark:bg-green-950/20', 
    borderColor: 'border-green-200 dark:border-green-800',
    textColor: 'text-green-800 dark:text-green-200',
    label: 'In Stock',
    dotColor: 'bg-green-500'
  };
};

const ItemRenderer = ({ index, style, data }: ItemRendererProps) => {
  const { items, onEdit, onDelete, onQuickAdjust, isMobile } = data;
  const item = items[index];
  const status = getStockStatus(item.stock, item.reorderPoint);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || !isDragging) return;
    const touch = e.touches[0];
    const startX = touch.clientX;
    // Simple swipe detection - in real implementation you'd track the delta
    setSwipeOffset(startX > window.innerWidth / 2 ? 0 : -80);
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;
    setIsDragging(false);
    setSwipeOffset(0);
  };

  return (
    <div style={style} className="px-4">
      <div
        className={cn(
          "relative bg-background border rounded-xl transition-all duration-200 overflow-hidden",
          status.bgColor,
          status.borderColor,
          "hover:shadow-md"
        )}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Swipe Actions Background */}
        {isMobile && swipeOffset < 0 && (
          <div className="absolute right-0 top-0 bottom-0 flex items-center gap-2 pr-4 bg-red-500/10">
            <TouchTarget minHeight={40}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(item)}
                className="h-8 w-8 p-0 rounded-full bg-blue-500 text-white hover:bg-blue-600"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TouchTarget>
            <ConfirmationDialog
              title="Delete Item"
              description={`Are you sure you want to delete "${item.name}"?`}
              confirmText="Delete"
              variant="destructive"
              onConfirm={() => onDelete(item)}
            >
              <TouchTarget minHeight={40}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full bg-red-500 text-white hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TouchTarget>
            </ConfirmationDialog>
          </div>
        )}

        <div className="p-4">
          <div className="flex items-center gap-3">
            {/* Visual Stock Health Indicator */}
            <div className="flex-shrink-0">
              <div className={cn("w-3 h-12 rounded-full", status.dotColor)} />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-foreground truncate leading-tight">
                {item.name}
              </h3>
              <p className="text-sm text-muted-foreground">{item.sku}</p>
              
              {/* Status and velocity info */}
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className={cn("text-xs", status.textColor)}>
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
                  onClick={() => onQuickAdjust(item, -1)}
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <Minus className="h-3 w-3" />
                </Button>
              </TouchTarget>
              
              <TouchTarget minHeight={40}>
                <Button
                  variant="ghost"
                  className="min-w-[3rem] h-8 font-bold text-lg px-2"
                  onClick={() => onEdit(item)}
                >
                  {item.stock}
                </Button>
              </TouchTarget>
              
              <TouchTarget minHeight={40}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onQuickAdjust(item, 1)}
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
                  <DropdownMenuItem onClick={() => onEdit(item)} className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onQuickAdjust(item, 5)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Quick Restock (+5)
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
        </div>
      </div>
    </div>
  );
};

export const VirtualizedInventoryList = ({ 
  items, 
  onEdit, 
  onDelete, 
  onQuickAdjust,
  height = 600 
}: VirtualizedInventoryListProps) => {
  const isMobile = useIsMobile();
  
  const itemData = useMemo(() => ({
    items,
    onEdit,
    onDelete,
    onQuickAdjust,
    isMobile
  }), [items, onEdit, onDelete, onQuickAdjust, isMobile]);

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No items found</p>
        </div>
      </div>
    );
  }

  return (
    <List
      height={height}
      width="100%"
      itemCount={items.length}
      itemSize={isMobile ? 140 : 160}
      itemData={itemData}
      className="w-full"
      overscanCount={5}
    >
      {ItemRenderer}
    </List>
  );
};
