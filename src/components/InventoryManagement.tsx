
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { LoadingCard } from "@/components/ui/loading-skeleton";
import { EnhancedTable, Column } from "@/components/ui/enhanced-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Package, Plus, Trash2, Edit, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  stock: number;
  price: number;
  category?: string;
}

interface InventoryManagementProps {
  searchQuery?: string;
}

const InventoryManagement = ({ searchQuery }: InventoryManagementProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState<InventoryItem[]>([]);
  const [items] = useState<InventoryItem[]>([
    { id: 1, name: "Premium Headphones", sku: "HD001", stock: 3, price: 99.99, category: "Audio" },
    { id: 2, name: "Wireless Mouse", sku: "MS002", stock: 1, price: 29.99, category: "Accessories" },
    { id: 3, name: "Bluetooth Speaker", sku: "BS003", stock: 15, price: 45.99, category: "Audio" },
    { id: 4, name: "USB Cable", sku: "UC004", stock: 25, price: 8.99, category: "Accessories" },
    { id: 5, name: "Phone Case", sku: "PC005", stock: 8, price: 12.99, category: "Accessories" },
  ]);
  const { toast } = useToast();

  const handleDelete = (itemName: string) => {
    toast({
      title: "Item deleted",
      description: `${itemName} has been removed from inventory.`,
    });
  };

  const handleBulkDelete = () => {
    toast({
      title: "Items deleted",
      description: `${selectedItems.length} items have been removed from inventory.`,
    });
    setSelectedItems([]);
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

  const effectiveSearch = searchQuery || localSearch;
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
    item.sku.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(effectiveSearch.toLowerCase()))
  );

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

  const columns: Column<InventoryItem>[] = [
    {
      key: "name",
      label: "Product Name",
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
      render: (value) => (
        <span className="text-sm text-muted-foreground">{value || "Uncategorized"}</span>
      )
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
            <StatusBadge variant={status.variant}>
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
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <ConfirmationDialog
            title="Delete Item"
            description={`Are you sure you want to delete "${item.name}"? This action cannot be undone.`}
            confirmText="Delete"
            variant="destructive"
            onConfirm={() => handleDelete(item.name)}
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

  const bulkActions = (
    <div className="flex gap-2">
      <ConfirmationDialog
        title="Delete Selected Items"
        description={`Are you sure you want to delete ${selectedItems.length} selected items? This action cannot be undone.`}
        confirmText="Delete All"
        variant="destructive"
        onConfirm={handleBulkDelete}
      >
        <Button variant="destructive" size="sm" className="gap-2">
          <Trash2 className="h-4 w-4" />
          Delete Selected
        </Button>
      </ConfirmationDialog>
    </div>
  );

  if (isLoading) {
    return <LoadingCard count={3} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Inventory Management</h2>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleAddItem} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {!searchQuery && (
        <SearchInput
          placeholder="Search inventory items..."
          onSearch={setLocalSearch}
        />
      )}

      {filteredItems.length === 0 ? (
        <EmptyState
          icon={Package}
          title={effectiveSearch ? "No items found" : "No inventory items"}
          description={
            effectiveSearch 
              ? `No items match "${effectiveSearch}". Try a different search term.`
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
            <CardTitle className="text-lg">
              Inventory Items ({filteredItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EnhancedTable
              data={filteredItems}
              columns={columns}
              pageSize={10}
              selectedRows={selectedItems}
              onRowSelect={handleRowSelect}
              bulkActions={bulkActions}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InventoryManagement;
