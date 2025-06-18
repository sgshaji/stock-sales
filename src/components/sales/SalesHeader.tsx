
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

interface SalesHeaderProps {
  onAddSale: () => void;
  onExport: () => void;
}

export const SalesHeader = ({ onAddSale, onExport }: SalesHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">Sales Entry</h2>
        <p className="text-muted-foreground">Record and track your sales</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button onClick={onAddSale} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Sale
        </Button>
      </div>
    </div>
  );
};
