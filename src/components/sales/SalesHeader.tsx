
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SalesHeaderProps {
  onAddSale: () => void;
  onExport: () => void;
}

export const SalesHeader = memo<SalesHeaderProps>(({ onAddSale, onExport }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-headline-large font-semibold">Sales Entry</h2>
        <p className="text-body-medium text-muted-foreground">Record and track your sales</p>
      </div>
      <div className="flex gap-space-1">
        <Button 
          variant="outline" 
          size="icon"
          onClick={onExport} 
          title="Export sales data"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button 
          onClick={onAddSale} 
          size="icon"
          title="Add new sale"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

SalesHeader.displayName = "SalesHeader";
