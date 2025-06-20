import { useState } from "react";
import { WhatsAppStyleInventoryList } from "./WhatsAppStyleInventoryList";
import { InventoryItemForm } from "./InventoryItemForm";
import { useInventory } from "@/hooks/use-inventory";
import { transformInventoryItem } from "@/types/inventory";
import { MobileBottomSheet } from "@/components/mobile/MobileBottomSheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-skeleton";
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Edit,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";

interface InventoryManagementProps {
  searchQuery?: string;
  showAddForm?: boolean;
  onCloseAddForm?: () => void;
  onAddSuccess?: () => void;
}

export const InventoryManagement = ({ 
  searchQuery, 
  showAddForm = false, 
  onCloseAddForm,
  onAddSuccess
}: InventoryManagementProps) => {
  const { items: dbItems, isLoading, error, updateItem, deleteItem, adjustStock } = useInventory();
  const [localSearch, setLocalSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<Tables<"inventory_items"> | null>(null);
  const [editingItem, setEditingItem] = useState<Tables<"inventory_items"> | null>(null);

  console.log("InventoryManagement - showAddForm:", showAddForm);
  console.log("InventoryManagement - dbItems count:", dbItems.length);

  // Transform database items to component format
  const items = dbItems.map(transformInventoryItem);

  const effectiveSearch = searchQuery || localSearch;
  const filteredItems = effectiveSearch 
    ? items.filter(item => 
        item.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
        (item.sku && item.sku.toLowerCase().includes(effectiveSearch.toLowerCase()))
      )
    : items;

  const handleQuickAdjust = (item: any, adjustment: number) => {
    console.log("Quick adjust:", item.name, adjustment);
    adjustStock({ id: item.id, adjustment });
  };

  const handleEdit = (item: any) => {
    console.log("Edit item:", item.name);
    setEditingItem(item);
    setSelectedItem(null);
  };

  const handleDelete = (item: any) => {
    console.log("Delete item:", item.name);
    deleteItem(item.id);
  };

  const handleItemClick = (item: any) => {
    console.log("Item clicked:", item.name);
    setSelectedItem(item);
  };

  const handleEditSuccess = () => {
    console.log("Edit success");
    setEditingItem(null);
  };

  const calculateMargin = (sellingPrice: number, purchasePrice: number) => {
    const margin = ((sellingPrice - purchasePrice) / sellingPrice) * 100;
    return margin.toFixed(1);
  };

  const getMarginColor = (margin: number) => {
    if (margin >= 40) return "text-green-600 bg-green-100";
    if (margin >= 20) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return "Never";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading inventory</p>
          <p className="text-sm text-gray-500">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <WhatsAppStyleInventoryList
        items={filteredItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onQuickAdjust={handleQuickAdjust}
        onItemClick={handleItemClick}
        searchQuery={effectiveSearch}
        onSearch={!searchQuery ? setLocalSearch : undefined}
      />

      {/* Add Item Form Bottom Sheet */}
      <MobileBottomSheet
        isOpen={showAddForm}
        onClose={onCloseAddForm || (() => {})}
        title="Add New Item"
        className="h-[90vh]"
      >
        <InventoryItemForm
          onClose={onCloseAddForm || (() => {})}
          onSuccess={() => {
            console.log("Item added successfully");
            onAddSuccess?.();
          }}
        />
      </MobileBottomSheet>

      {/* Edit Item Form Bottom Sheet */}
      <MobileBottomSheet
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title="Edit Item"
        className="h-[90vh]"
      >
        <InventoryItemForm
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={() => {
            console.log("Item updated successfully");
            handleEditSuccess();
          }}
        />
      </MobileBottomSheet>

      {/* Item Details Bottom Sheet */}
      <MobileBottomSheet
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.name}
        className="h-[80vh]"
      >
        {selectedItem && (
          <div className="p-4 space-y-6">
            {/* Basic Info Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Product Details
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(selectedItem)}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">SKU</p>
                    <p className="font-medium">{selectedItem.sku || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <Badge variant="secondary" className="capitalize">
                      {selectedItem.category || 'Uncategorized'}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Stock</p>
                    <p className="text-2xl font-bold text-primary">{selectedItem.stock_quantity || 0} units</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reorder Point</p>
                    <p className="text-lg font-semibold">{selectedItem.reorder_point || 'Not set'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Margin Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Pricing & Profitability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Purchase Price</p>
                    <p className="text-xl font-bold text-blue-700">
                      ${selectedItem.purchase_price?.toFixed(2) || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Selling Price</p>
                    <p className="text-xl font-bold text-green-700">
                      ${selectedItem.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                {selectedItem.purchase_price && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">Profit Margin</p>
                      <Badge 
                        className={cn(
                          "font-semibold",
                          getMarginColor(parseFloat(calculateMargin(selectedItem.price, selectedItem.purchase_price)))
                        )}
                      >
                        {calculateMargin(selectedItem.price, selectedItem.purchase_price)}%
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Profit per unit:</span>
                        <span className="font-medium text-green-600">
                          ${(selectedItem.price - selectedItem.purchase_price).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total potential profit:</span>
                        <span className="font-medium text-green-600">
                          ${((selectedItem.price - selectedItem.purchase_price) * (selectedItem.stock_quantity || 0)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Activity & History Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Activity & History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Last Sold</p>
                    <p className="font-medium">{formatTime(selectedItem.last_sold)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sales Velocity</p>
                    <Badge 
                      variant={
                        selectedItem.velocity === 'fast' ? 'default' : 
                        selectedItem.velocity === 'medium' ? 'secondary' : 'outline'
                      }
                      className="capitalize"
                    >
                      {selectedItem.velocity || 'Unknown'}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Last Restocked</p>
                  <p className="font-medium">
                    {selectedItem.last_restocked 
                      ? new Date(selectedItem.last_restocked).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'No restock history'
                    }
                  </p>
                </div>

                {/* Stock Status */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Stock Status</p>
                  {(selectedItem.stock_quantity || 0) === 0 ? (
                    <div className="flex items-center gap-2 text-red-600">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-sm font-medium">Out of Stock - Immediate reorder needed</span>
                    </div>
                  ) : (selectedItem.stock_quantity || 0) <= (selectedItem.reorder_point || 5) ? (
                    <div className="flex items-center gap-2 text-yellow-600">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <span className="text-sm font-medium">Low Stock - Consider reordering soon</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm font-medium">Stock levels are healthy</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </MobileBottomSheet>
    </>
  );
};

export default InventoryManagement;
