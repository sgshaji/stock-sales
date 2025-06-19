
import { useState, useEffect } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingCard } from "@/components/ui/loading-skeleton";
import { SmartFilterBar } from "./SmartFilterBar";
import { IntelligentSearch } from "./IntelligentSearch";
import { FlatInventoryList } from "./FlatInventoryList";
import { FloatingActionButton } from "./FloatingActionButton";
import { BatchActionBar } from "./BatchActionBar";
import { Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

interface EnhancedInventoryManagementProps {
  searchQuery?: string;
}

// Predefined categories with ability to customize
const predefinedCategories = [
  { id: "clay", name: "Clay", count: 0, color: "#8B4513" },
  { id: "plastic", name: "Plastic", count: 0, color: "#4169E1" },
  { id: "cement", name: "Cement Tile", count: 0, color: "#696969" },
  { id: "accessories", name: "Accessories", count: 0, color: "#32CD32" },
];

export const EnhancedInventoryManagement = ({ searchQuery }: EnhancedInventoryManagementProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItems, setSelectedItems] = useState<InventoryItem[]>([]);
  
  const [items] = useState<InventoryItem[]>([
    { id: 1, name: "Premium Clay Tiles", sku: "CT001", stock: 3, price: 99.99, category: "clay" },
    { id: 2, name: "Plastic Outdoor Tiles", sku: "PT002", stock: 12, price: 29.99, category: "plastic" },
    { id: 3, name: "Cement Floor Tiles", sku: "CF003", stock: 8, price: 45.99, category: "cement" },
    { id: 4, name: "Tile Spacers", sku: "TS004", stock: 25, price: 8.99, category: "accessories" },
    { id: 5, name: "Decorative Clay Tiles", sku: "DCT005", stock: 5, price: 129.99, category: "clay" },
  ]);

  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Calculate category counts
  const categoriesWithCounts = predefinedCategories.map(cat => ({
    ...cat,
    count: items.filter(item => item.category === cat.id).length
  }));

  const effectiveSearch = searchQuery || localSearch;
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
                         item.sku.toLowerCase().includes(effectiveSearch.toLowerCase());
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (item: InventoryItem) => {
    toast({
      title: "Edit Item",
      description: `Opening edit form for ${item.name}`,
    });
  };

  const handleDelete = (item: InventoryItem) => {
    toast({
      title: "Item deleted",
      description: `${item.name} has been removed from inventory.`,
    });
  };

  const handleAddItem = () => {
    toast({
      title: "Add new item",
      description: "Opening item creation form...",
    });
  };

  const handleRowSelect = (item: InventoryItem, selected: boolean) => {
    if (selected) {
      setSelectedItems(prev => [...prev, item]);
    } else {
      setSelectedItems(prev => prev.filter(i => i.id !== item.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  const handleBatchEdit = () => {
    toast({
      title: "Batch Edit",
      description: `Editing ${selectedItems.length} items...`,
    });
  };

  const handleBatchDelete = () => {
    toast({
      title: "Batch Delete",
      description: `Deleting ${selectedItems.length} items...`,
    });
    setSelectedItems([]);
  };

  const handleBatchExport = () => {
    toast({
      title: "Export Started",
      description: `Exporting ${selectedItems.length} items...`,
    });
  };

  const handleClearSearch = () => {
    setLocalSearch("");
  };

  if (isLoading) {
    return <LoadingCard count={3} />;
  }

  return (
    <div className={cn(
      "min-h-screen bg-background",
      isMobile ? "pb-28" : "pb-20"
    )}>
      {/* Mobile-first Header - Compact and clean */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border/20">
        <div className="px-4 py-3">
          <h2 className="text-lg font-semibold text-foreground">Inventory</h2>
        </div>
        
        {/* Search - Only show if not passed from parent */}
        {!searchQuery && (
          <div className="px-4 pb-3">
            <IntelligentSearch
              placeholder="Search products, SKUs..."
              onSearch={setLocalSearch}
            />
          </div>
        )}
        
        {/* Smart Filter Bar */}
        <SmartFilterBar
          categories={categoriesWithCounts}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          totalItems={items.length}
          filteredCount={filteredItems.length}
          searchQuery={effectiveSearch}
          onClearSearch={effectiveSearch ? handleClearSearch : undefined}
        />
      </div>

      {/* Content Area - Mobile optimized spacing */}
      <div className="px-4 py-4">
        {filteredItems.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <EmptyState
              icon={Package}
              title={effectiveSearch || activeCategory !== "all" ? "No items found" : "No inventory items"}
              description={
                effectiveSearch || activeCategory !== "all"
                  ? "No items match your current filters. Try adjusting your search or category selection."
                  : "Start by adding your first inventory item to track stock levels."
              }
              action={{
                label: "Add First Item",
                onClick: handleAddItem
              }}
            />
          </div>
        ) : (
          <div className="space-y-0">
            <FlatInventoryList
              items={filteredItems}
              onEdit={handleEdit}
              onDelete={handleDelete}
              selectedItems={selectedItems}
              onSelect={handleRowSelect}
            />
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={handleAddItem} />

      {/* Batch Action Bar */}
      <BatchActionBar
        selectedItems={selectedItems}
        onClearSelection={handleClearSelection}
        onBatchEdit={handleBatchEdit}
        onBatchDelete={handleBatchDelete}
        onBatchExport={handleBatchExport}
      />
    </div>
  );
};

export default EnhancedInventoryManagement;
