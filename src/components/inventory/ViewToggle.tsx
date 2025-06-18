
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { List, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewType = "list" | "tile";

interface ViewToggleProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  className?: string;
}

export const ViewToggle = ({ view, onViewChange, className }: ViewToggleProps) => {
  return (
    <ToggleGroup 
      type="single" 
      value={view} 
      onValueChange={(value) => value && onViewChange(value as ViewType)}
      className={cn("", className)}
    >
      <ToggleGroupItem value="list" aria-label="List view" size="sm">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="tile" aria-label="Tile view" size="sm">
        <Grid3X3 className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
