
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { LoadingCard } from "@/components/ui/loading-skeleton";
import { Package, Plus, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InventoryManagementProps {
  searchQuery?: string;
}

const EnhancedInventoryManagement = ({ searchQuery }: InventoryManagementProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [items] = useState([
    { id: 1, name: "Premium Headphones", sku: "HD001", stock: 3, price: 99.99 },
    { id: 2, name: "Wireless Mouse", sku: "MS002", stock: 1, price: 29.99 },
    { id: 3, name: "Bluetooth Speaker", sku: "BS003", stock: 15, price: 45.99 },
  ]);
  const { toast } = useToast();

  const handleDelete = (itemName: string) => {
    toast({
      title: "Item deleted",
      description: `${itemName} has been removed from inventory.`,
    });
  };

  const handleAddItem = () => {
    toast({
      title: "Add new item",
      description: "Opening item creation form...",
    });
  };

  const effectiveSearch = searchQuery || localSearch;
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
    item.sku.toLowerCase().includes(effectiveSearch.toLowerCase())
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
        <Button onClick={handleAddItem} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
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
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                    <div className="mt-2 flex gap-4">
                      <span className={`text-sm font-medium ${
                        item.stock <= 5 ? 'text-destructive' : 'text-success-600'
                      }`}>
                        Stock: {item.stock}
                      </span>
                      <span className="text-sm font-medium text-primary">
                        ${item.price}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedInventoryManagement;
