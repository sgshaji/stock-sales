
import { useState } from "react";
import { WhatsAppStyleInventoryList } from "@/components/inventory/WhatsAppStyleInventoryList";
import { InventoryItemForm } from "@/components/inventory/InventoryItemForm";
import { useInventory } from "@/hooks/use-inventory";
import { transformInventoryItem } from "@/types/inventory";
import { MobileBottomSheet } from "./MobileBottomSheet";
import { FloatingAction } from "@/components/ui/floating-action";
import { LoadingSpinner } from "@/components/ui/loading-skeleton";

export const MobileInventory = () => {
  const { items: dbItems, isLoading, error, updateItem, deleteItem, adjustStock } = useInventory();
  const [showAddItem, setShowAddItem] = useState(false);
  const [localSearch, setLocalSearch] = useState("");

  // Transform database items to component format
  const items = dbItems.map(transformInventoryItem);

  const filteredItems = localSearch 
    ? items.filter(item => 
        item.name.toLowerCase().includes(localSearch.toLowerCase()) ||
        (item.sku && item.sku.toLowerCase().includes(localSearch.toLowerCase()))
      )
    : items;

  const handleQuickAdjust = (item: any, adjustment: number) => {
    adjustStock({ id: item.id, adjustment });
  };

  const handleEdit = (item: any) => {
    console.log("Edit item:", item);
    // TODO: Implement edit form
  };

  const handleDelete = (item: any) => {
    deleteItem(item.id);
  };

  const handleAddStock = () => {
    console.log("Add stock button clicked");
    setShowAddItem(true);
  };

  const handleCloseAddForm = () => {
    console.log("Closing add form");
    setShowAddItem(false);
  };

  const handleAddSuccess = () => {
    console.log("Add success - closing form");
    setShowAddItem(false);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading inventory</p>
          <p className="text-sm text-gray-500">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative">
      <WhatsAppStyleInventoryList
        items={filteredItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onQuickAdjust={handleQuickAdjust}
        searchQuery={localSearch}
        onSearch={setLocalSearch}
      />

      {/* Floating Action Button for Adding Stock */}
      <FloatingAction variant="stock" onClick={handleAddStock} />

      {/* Add Item Bottom Sheet */}
      <MobileBottomSheet
        isOpen={showAddItem}
        onClose={handleCloseAddForm}
        title="Add New Item"
        className="h-[90vh]"
      >
        <InventoryItemForm
          onClose={handleCloseAddForm}
          onSuccess={handleAddSuccess}
        />
      </MobileBottomSheet>
    </div>
  );
};
