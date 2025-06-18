
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { LoadingCard, LoadingTable } from "@/components/ui/loading-skeleton";
import { Package, Plus, Trash2, Edit, ArrowUpDown, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InventoryManagementProps {
  searchQuery?: string;
}

const EnhancedInventoryManagement = ({ searchQuery }: InventoryManagementProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [items] = useState([
    { id: 1, name: "Premium Headphones", sku: "HD001", stock: 3, price: 99.99 },
    { id: 2, name: "Wireless Mouse", sku: "MS002", stock: 1, price: 29.99 },
    { id: 3, name: "Bluetooth Speaker", sku: "BS003", stock: 15, price: 45.99 },
  ]);
  const { toast } = useToast();

  const handleDelete = async (itemId: number, itemName: string) => {
    setIsDeleting(itemId);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Item deleted",
        description: `${itemName} has been removed from inventory.`,
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleAddItem = async () => {
    setIsAdding(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Opening item form",
        description: "Add new item form is ready.",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const effectiveSearch = searchQuery || localSearch;
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
    item.sku.toLowerCase().includes(effectiveSearch.toLowerCase())
  );

  if (isLoading) {
    return <LoadingTable rows={5} />;
  }

  return (
    <div className="content-spacing-relaxed animate-fade-in">
      {/* Header with Clear Action Hierarchy */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-display-small text-foreground">Inventory Management</h2>
          <p className="text-body-medium text-muted-foreground mt-1">Manage your product inventory and stock levels</p>
        </div>
        
        {/* Primary Action - Most Important */}
        <Button 
          onClick={handleAddItem} 
          loading={isAdding}
          loadingText="Opening..."
          className="gap-2 shadow-md hover:shadow-lg"
          size="lg"
        >
          <Plus className="h-4 w-4" />
          Add New Item
        </Button>
      </div>

      {/* Secondary Actions Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {!searchQuery && (
          <div className="flex-1">
            <SearchInput
              placeholder="Search items by name or SKU..."
              onSearch={setLocalSearch}
            />
          </div>
        )}
        
        {/* Secondary action buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Sort
          </Button>
        </div>
      </div>

      {/* Content Area */}
      {filteredItems.length === 0 ? (
        <EmptyState
          icon={Package}
          title={effectiveSearch ? "No items found" : "No inventory items"}
          description={
            effectiveSearch 
              ? `No items match "${effectiveSearch}". Try adjusting your search terms.`
              : "Start building your inventory by adding your first product."
          }
          action={{
            label: "Add First Item",
            onClick: handleAddItem
          }}
        />
      ) : (
        <div className="content-spacing-normal">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-headline-medium text-foreground">{item.name}</h3>
                    <p className="text-body-small text-muted-foreground mt-1">SKU: {item.sku}</p>
                    <div className="mt-3 flex flex-wrap gap-4">
                      <span className={`text-body-small font-medium px-3 py-1 rounded-full ${
                        item.stock <= 5 
                          ? 'bg-error-50 text-error-700 border border-error-200 dark:bg-error-950/20 dark:text-error-400' 
                          : 'bg-success-50 text-success-700 border border-success-200 dark:bg-success-950/20 dark:text-success-400'
                      }`}>
                        Stock: {item.stock}
                      </span>
                      <span className="text-body-small font-medium text-primary-600 dark:text-primary-400 px-3 py-1 bg-primary-50 dark:bg-primary-950/20 rounded-full border border-primary-200 dark:border-primary-800">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons with Clear Hierarchy */}
                  <div className="flex gap-2 flex-shrink-0">
                    {/* Secondary action */}
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    
                    {/* Destructive action */}
                    <ConfirmationDialog
                      title="Delete Item"
                      description={`Are you sure you want to delete "${item.name}"? This action cannot be undone.`}
                      confirmText="Delete"
                      variant="destructive"
                      onConfirm={() => handleDelete(item.id, item.name)}
                    >
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 text-destructive hover:bg-destructive/10 hover:border-destructive/20"
                        loading={isDeleting === item.id}
                        loadingText="Deleting..."
                      >
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
