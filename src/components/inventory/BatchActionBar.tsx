
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Download, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  stock: number;
  price: number;
  category?: string;
}

interface BatchActionBarProps {
  selectedItems: InventoryItem[];
  onClearSelection: () => void;
  onBatchEdit: () => void;
  onBatchDelete: () => void;
  onBatchExport: () => void;
  className?: string;
}

export const BatchActionBar = ({
  selectedItems,
  onClearSelection,
  onBatchEdit,
  onBatchDelete,
  onBatchExport,
  className
}: BatchActionBarProps) => {
  if (selectedItems.length === 0) return null;

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/40 p-4 z-40 animate-slide-up",
      className
    )}>
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="font-medium">
            {selectedItems.length} selected
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onBatchExport}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onBatchEdit}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onBatchDelete}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
