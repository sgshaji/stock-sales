
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { List, Grid3X3, Filter, X } from "lucide-react";
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
  const activeCategoryName = categories.find(cat => cat.id === activeCategory)?.name || "All Items";
  
  return (
    <div className={cn(
      "sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border/40 py-3",
      className
    )}>
      {/* Context Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 animate-fade-in">
          <h3 className="font-semibold text-foreground">
            {activeCategory === "all" ? "All Items" : activeCategoryName}
          </h3>
          <Badge variant="secondary" className="text-xs">
            {filteredCount} of {totalItems}
          </Badge>
          {searchQuery && (
            <div className="flex items-center gap-1 px-2 py-1 bg-primary-50 dark:bg-primary-950/20 rounded-full text-xs">
              <span className="text-primary-600 dark:text-primary-400">"{searchQuery}"</span>
              {onClearSearch && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 hover:bg-primary-100 dark:hover:bg-primary-900/20"
                  onClick={onClearSearch}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </div>
        
        {/* View Toggle */}
        <ToggleGroup 
          type="single" 
          value={view} 
          onValueChange={(value) => value && onViewChange(value as ViewType)}
          className="border border-border/40 bg-background/60 rounded-lg"
        >
          <ToggleGroupItem 
            value="list" 
            aria-label="List view" 
            size="sm"
            className="data-[state=on]:bg-primary-600 data-[state=on]:text-white"
          >
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="tile" 
            aria-label="Tile view" 
            size="sm"
            className="data-[state=on]:bg-primary-600 data-[state=on]:text-white"
          >
            <Grid3X3 className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Smart Filter Chips */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-2 p-1">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange("all")}
            className={cn(
              "flex-shrink-0 gap-2 transition-all duration-200",
              activeCategory === "all" 
                ? "bg-primary-600 text-white shadow-md" 
                : "hover:bg-accent/50"
            )}
          >
            All Items
            <Badge variant="secondary" className="ml-1 bg-white/20 text-current">
              {categories.reduce((total, cat) => total + cat.count, 0)}
            </Badge>
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "flex-shrink-0 gap-2 transition-all duration-200",
                activeCategory === category.id 
                  ? "bg-primary-600 text-white shadow-md" 
                  : "hover:bg-accent/50"
              )}
            >
              {category.name}
              <Badge variant="secondary" className={cn(
                "ml-1",
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
    </div>
  );
};
