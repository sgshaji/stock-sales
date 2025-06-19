
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { TouchTarget } from "@/components/ui/mobile-touch";
import { Edit, Trash2, MoreVertical, Package, CheckCircle2 } from "lucide-react";
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

  const getStockStatus = (stock: number) => {
    if (stock <= 5) return { variant: "danger" as const, label: "Low" };
    if (stock <= 10) return { variant: "warning" as const, label: "Medium" };
    return { variant: "success" as const, label: "Good" };
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
              "relative bg-background border border-transparent rounded-xl transition-all duration-200",
              selected && "bg-primary/5 border-primary/20",
              !selected && "hover:bg-accent/30 active:bg-accent/50"
            )}
          >
            <div className="p-4">
              <div className="flex items-center gap-3">
                {/* Selection Indicator */}
                {onSelect && (
                  <TouchTarget
                    minHeight={40}
                    onClick={() => onSelect(item, !selected)}
                    className="flex-shrink-0"
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center",
                      selected 
                        ? "bg-primary border-primary" 
                        : "border-border hover:border-primary/40"
                    )}>
                      {selected && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                    </div>
                  </TouchTarget>
                )}

                {/* Product Icon */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-accent/50 flex items-center justify-center">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base text-foreground truncate leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {item.sku}
                  </p>
                  
                  {/* Mobile-optimized meta info */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{item.stock}</span>
                      <StatusBadge variant={status.variant} className="text-xs px-2 py-0.5">
                        {status.label}
                      </StatusBadge>
                    </div>
                    <div className="text-lg font-bold text-primary">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Actions Menu */}
                <div className="flex-shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <TouchTarget minHeight={44}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 rounded-full hover:bg-accent/50"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </TouchTarget>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end" 
                      className="w-48 bg-background/95 backdrop-blur-md border border-border/40"
                    >
                      <DropdownMenuItem 
                        onClick={() => onEdit(item)}
                        className="gap-3 py-3"
                      >
                        <Edit className="h-4 w-4" />
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
                          className="text-destructive focus:text-destructive gap-3 py-3"
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
            </div>
          </div>
        );
      })}
    </div>
  );
};
