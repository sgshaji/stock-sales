
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingCard } from "@/components/ui/loading-skeleton";
import { EnhancedTable, Column } from "@/components/ui/enhanced-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { CategoryTabs } from "./CategoryTabs";
import { ViewToggle } from "./ViewToggle";
import { InventoryTileView } from "./InventoryTileView";
import { Package, Plus, Download, Edit, Trash2 } from "lucide-react";
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

type ViewType = "list" | "tile";

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
  const [viewType, setViewType] = useState<ViewType>("list");
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

  // Load saved view preference
  useEffect(() => {
    const savedView = localStorage.getItem("inventory-view-preference") as ViewType;
    if (savedView) {
      setViewType(savedView);
    } else {
      // Default to tile view on mobile for better touch experience
      setViewType(isMobile ? "tile" : "list");
    }
  }, [isMobile]);

  // Save view preference
  const handleViewChange = (view: ViewType) => {
    setViewType(view);
    localStorage.setItem("inventory-view-preference", view);
  };

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

  const handleExport = () => {
    toast({
      title: "Export started",
      description: "Your inventory data is being exported...",
    });
  };

  const getStockStatus = (stock: number) => {
    if (stock <= 5) return { variant: "danger" as const, label: "Low Stock" };
    if (stock <= 10) return { variant: "warning" as const, label: "Medium Stock" };
    return { variant: "success" as const, label: "In Stock" };
  };

  const handleRowSelect = (item: InventoryItem, selected: boolean) => {
    if (selected) {
      setSelectedItems(prev => [...prev, item]);
    } else {
      setSelectedItems(prev => prev.filter(i => i.id !== item.id));
    }
  };

  // Table columns for list view
  const columns: Column<InventoryItem>[] = [
    {
      key: "name",
      label: "Product",
      sortable: true,
      render: (value, item) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">SKU: {item.sku}</div>
        </div>
      )
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (value) => {
        const category = predefinedCategories.find(cat => cat.id === value);
        return (
          <span className="text-sm text-muted-foreground">
            {category?.name || "Uncategorized"}
          </span>
        );
      }
    },
    {
      key: "stock",
      label: "Stock",
      sortable: true,
      render: (value) => {
        const status = getStockStatus(value);
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{value}</span>
            <StatusBadge variant={status.variant} size="sm">
              {status.label}
            </StatusBadge>
          </div>
        );
      }
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (value) => (
        <span className="font-medium text-primary">${value.toFixed(2)}</span>
      )
    },
    {
      key: "id",
      label: "Actions",
      sortable: false,
      render: (_, item) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button variant="outline" size="sm" onClick={() => handleEdit(item)} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <ConfirmationDialog
            title="Delete Item"
            description={`Are you sure you want to delete "${item.name}"?`}
            confirmText="Delete"
            variant="destructive"
            onConfirm={() => handleDelete(item)}
          >
            <Button variant="outline" size="sm" className="gap-2 text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </ConfirmationDialog>
        </div>
      )
    }
  ];

  if (isLoading) {
    return <LoadingCard count={3} />;
  }

  return (
    <div className={cn("space-y-6 animate-fade-in", isMobile && "space-y-4")}>
      {/* Header */}
      <div className={cn(
        "flex justify-between items-start gap-4",
        isMobile ? "flex-col space-y-3" : "flex-row items-center"
      )}>
        <div>
          <h2 className={cn(
            "font-bold text-foreground",
            isMobile ? "text-xl" : "text-2xl"
          )}>
            Inventory Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your product inventory and stock levels
          </p>
        </div>
        
        <div className={cn(
          "flex gap-2",
          isMobile ? "w-full" : ""
        )}>
          <Button 
            variant="outline" 
            onClick={handleExport} 
            className={cn("gap-2", isMobile ? "flex-1" : "")}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button 
            onClick={handleAddItem} 
            className={cn("gap-2", isMobile ? "flex-1" : "")}
          >
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="space-y-4">
        {!searchQuery && (
          <SearchInput
            placeholder="Search inventory items..."
            onSearch={setLocalSearch}
          />
        )}
        
        <div className={cn(
          "flex justify-between items-center gap-4",
          isMobile ? "flex-col space-y-3" : "flex-row"
        )}>
          <CategoryTabs
            categories={categoriesWithCounts}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            className={isMobile ? "w-full" : "flex-1"}
          />
          
          <ViewToggle
            view={viewType}
            onViewChange={handleViewChange}
          />
        </div>
      </div>

      {/* Content */}
      {filteredItems.length === 0 ? (
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
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>
                {activeCategory === "all" 
                  ? `All Items (${filteredItems.length})`
                  : `${categoriesWithCounts.find(cat => cat.id === activeCategory)?.name} (${filteredItems.length})`
                }
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viewType === "list" ? (
              <EnhancedTable
                data={filteredItems}
                columns={columns}
                pageSize={20}
                selectedRows={selectedItems}
                onRowSelect={handleRowSelect}
              />
            ) : (
              <InventoryTileView
                items={filteredItems}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedInventoryManagement;
