
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { TouchTarget } from "@/components/ui/mobile-touch";
import { Edit, Trash2, MoreVertical, Package } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  stock: number;
  price: number;
  category?: string;
}

interface FlatInventoryListProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  selectedItems?: InventoryItem[];
  onSelect?: (item: InventoryItem, selected: boolean) => void;
}

export const FlatInventoryList = ({ 
  items, 
  onEdit, 
  onDelete,
  selectedItems = [],
  onSelect
}: FlatInventoryListProps) => {
  const isMobile = useIsMobile();
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const getStockStatus = (stock: number) => {
    if (stock <= 5) return { variant: "danger" as const, label: "Low Stock" };
    if (stock <= 10) return { variant: "warning" as const, label: "Medium Stock" };
    return { variant: "success" as const, label: "In Stock" };
  };

  const isSelected = (item: InventoryItem) => {
    return selectedItems.some(selected => selected.id === item.id);
  };

  return (
    <div className="space-y-1">
      {items.map((item) => {
        const status = getStockStatus(item.stock);
        const selected = isSelected(item);
        
        return (
          <div
            key={item.id}
            className={cn(
              "group relative flex items-center gap-4 p-4 rounded-lg border border-transparent hover:border-border/40 hover:bg-accent/30 transition-all duration-200 cursor-pointer",
              selected && "bg-primary-50 dark:bg-primary-950/20 border-primary-200 dark:border-primary-800",
              "animate-fade-in"
            )}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => onSelect?.(item, !selected)}
          >
            {/* Selection Checkbox */}
            {onSelect && (
              <div className="flex-shrink-0">
                <div className={cn(
                  "w-4 h-4 rounded border-2 transition-all duration-200",
                  selected 
                    ? "bg-primary-600 border-primary-600" 
                    : "border-border hover:border-primary-300"
                )}>
                  {selected && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-sm" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Product Icon */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-accent/50 flex items-center justify-center">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">SKU: {item.sku}</p>
                </div>
                
                <div className="flex items-center gap-4 ml-4">
                  {/* Stock Status */}
                  <div className="text-right">
                    <div className="font-medium text-sm">{item.stock} units</div>
                    <StatusBadge variant={status.variant} className="text-xs">
                      {status.label}
                    </StatusBadge>
                  </div>

                  {/* Price */}
                  <div className="text-right min-w-0">
                    <div className="font-semibold text-primary">${item.price.toFixed(2)}</div>
                  </div>

                  {/* Actions */}
                  <div className={cn(
                    "flex items-center transition-opacity duration-200",
                    isMobile ? "opacity-100" : hoveredItem === item.id ? "opacity-100" : "opacity-0"
                  )}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <TouchTarget minHeight={40}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </TouchTarget>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Item
                        </DropdownMenuItem>
                        <ConfirmationDialog
                          title="Delete Item"
                          description={`Are you sure you want to delete "${item.name}"?`}
                          confirmText="Delete"
                          variant="destructive"
                          onConfirm={() => onDelete(item)}
                        >
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Item
                          </DropdownMenuItem>
                        </ConfirmationDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
