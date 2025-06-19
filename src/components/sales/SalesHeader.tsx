
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SalesHeaderProps {
  onAddSale: () => void;
  onExport: () => void;
}

export const SalesHeader = ({ onAddSale, onExport }: SalesHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">Sales Entry</h2>
        <p className="text-muted-foreground">Record and track your sales</p>
      </div>
      <div className="flex gap-1">
        <Button 
          variant="outline" 
          onClick={onExport} 
          size={isMobile ? "icon" : "default"}
          className={isMobile ? "" : "gap-2"}
        >
          <Download className="h-4 w-4" />
          {!isMobile && <span>Export</span>}
        </Button>
        <Button 
          onClick={onAddSale} 
          size={isMobile ? "icon" : "default"}
          className={isMobile ? "" : "gap-2"}
        >
          <Plus className="h-4 w-4" />
          {!isMobile && <span>Add Sale</span>}
        </Button>
      </div>
    </div>
  );
};
