
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { TouchTarget } from "@/components/ui/mobile-touch";
import { Edit, Trash2 } from "lucide-react";
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

interface InventoryTileViewProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
}

export const InventoryTileView = ({ items, onEdit, onDelete }: InventoryTileViewProps) => {
  const isMobile = useIsMobile();

  const getStockStatus = (stock: number) => {
    if (stock <= 5) return { variant: "danger" as const, label: "Low Stock" };
    if (stock <= 10) return { variant: "warning" as const, label: "Medium Stock" };
    return { variant: "success" as const, label: "In Stock" };
  };

  return (
    <div className={cn(
      "grid gap-4",
      isMobile ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    )}>
      {items.map((item) => {
        const status = getStockStatus(item.stock);
        
        return (
          <Card key={item.id} className="group hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Product Info */}
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    SKU: {item.sku}
                  </p>
                  {item.category && (
                    <p className="text-xs text-muted-foreground">
                      {item.category}
                    </p>
                  )}
                </div>

                {/* Status and Price */}
                <div className="flex items-center justify-between">
                  <StatusBadge variant={status.variant} className="text-xs">
                    {item.stock} units
                  </StatusBadge>
                  <span className="font-semibold text-primary">
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <TouchTarget minHeight={40} className="flex-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEdit(item)}
                      className="w-full gap-2"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                  </TouchTarget>
                  
                  <TouchTarget minHeight={40}>
                    <ConfirmationDialog
                      title="Delete Item"
                      description={`Are you sure you want to delete "${item.name}"?`}
                      confirmText="Delete"
                      variant="destructive"
                      onConfirm={() => onDelete(item)}
                    >
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="gap-2 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </ConfirmationDialog>
                  </TouchTarget>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
