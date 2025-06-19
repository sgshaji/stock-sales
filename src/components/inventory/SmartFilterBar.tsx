
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { List, Grid3X3, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  count: number;
  color?: string;
}

type ViewType = "list" | "tile";

interface SmartFilterBarProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  totalItems: number;
  filteredCount: number;
  searchQuery?: string;
  onClearSearch?: () => void;
  className?: string;
}

export const SmartFilterBar = ({
  categories,
  activeCategory,
  onCategoryChange,
  view,
  onViewChange,
  totalItems,
  filteredCount,
  searchQuery,
  onClearSearch,
  className
}: SmartFilterBarProps) => {
  return (
    <div className={cn("pb-2", className)}>
      {/* Categories - Horizontal scroll on mobile */}
      <ScrollArea className="w-full">
        <div className="flex gap-2 px-4 py-2">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange("all")}
            className={cn(
              "flex-shrink-0 h-9 rounded-full",
              activeCategory === "all" 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "bg-background hover:bg-accent/50 border-border/40"
            )}
          >
            All
            <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs bg-white/20 text-current border-0">
              {totalItems}
            </Badge>
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "flex-shrink-0 h-9 rounded-full",
                activeCategory === category.id 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "bg-background hover:bg-accent/50 border-border/40"
              )}
            >
              {category.name}
              <Badge variant="secondary" className={cn(
                "ml-2 h-5 px-1.5 text-xs border-0",
                activeCategory === category.id 
                  ? "bg-white/20 text-current" 
                  : "bg-secondary"
              )}>
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>

      {/* Results count and view toggle */}
      <div className="flex items-center justify-between px-4 pt-2">
        <div className="text-sm text-muted-foreground">
          {filteredCount} {filteredCount === 1 ? 'item' : 'items'}
          {searchQuery && (
            <span className="ml-1">
              for "{searchQuery}"
            </span>
          )}
        </div>
        
        {/* Compact View Toggle */}
        <ToggleGroup 
          type="single" 
          value={view} 
          onValueChange={(value) => value && onViewChange(value as ViewType)}
          className="bg-background border border-border/40 rounded-lg h-8"
        >
          <ToggleGroupItem 
            value="list" 
            aria-label="List view" 
            size="sm"
            className="h-7 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            <List className="h-3.5 w-3.5" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="tile" 
            aria-label="Grid view" 
            size="sm"
            className="h-7 w-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            <Grid3X3 className="h-3.5 w-3.5" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};
