import { useState } from "react";
import { WhatsAppStyleInventoryList } from "@/components/inventory/WhatsAppStyleInventoryList";
import { useToast } from "@/hooks/use-toast";
import { MobileBottomSheet } from "./MobileBottomSheet";

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  stock: number;
  price: number;
  category?: string;
  lastSold?: string;
  velocity?: 'fast' | 'medium' | 'slow';
  reorderPoint?: number;
  purchasePrice?: number;
  lastRestocked?: string;
}

const mockInventory: InventoryItem[] = [
  { 
    id: 1, 
    name: "Premium Clay Tiles", 
    sku: "CT001", 
    stock: 3, 
    price: 99.99, 
    category: "clay", 
    lastSold: "14:46", 
    velocity: "medium", 
    reorderPoint: 10,
    purchasePrice: 75.00,
    lastRestocked: "2024-01-10"
  },
  { 
    id: 2, 
    name: "Plastic Outdoor Tiles", 
    sku: "PT002", 
    stock: 12, 
    price: 29.99, 
    category: "plastic", 
    lastSold: "13:27", 
    velocity: "fast", 
    reorderPoint: 15,
    purchasePrice: 18.50,
    lastRestocked: "2024-01-12"
  },
  { 
    id: 3, 
    name: "Cement Floor Tiles", 
    sku: "CF003", 
    stock: 8, 
    price: 45.99, 
    category: "cement", 
    lastSold: "Yesterday", 
    velocity: "slow", 
    reorderPoint: 12,
    purchasePrice: 32.00,
    lastRestocked: "2024-01-08"
  },
  { 
    id: 4, 
    name: "Tile Spacers", 
    sku: "TS004", 
    stock: 25, 
    price: 8.99, 
    category: "accessories", 
    lastSold: "17/06/2025", 
    velocity: "fast", 
    reorderPoint: 20,
    purchasePrice: 4.50,
    lastRestocked: "2024-01-15"
  },
  { 
    id: 5, 
    name: "Decorative Clay Tiles", 
    sku: "DCT005", 
    stock: 0, 
    price: 129.99, 
    category: "clay", 
    lastSold: "16/06/2025", 
    velocity: "slow", 
    reorderPoint: 8,
    purchasePrice: 95.00,
    lastRestocked: "2023-12-20"
  },
  { 
    id: 6, 
    name: "Ceramic Wall Tiles", 
    sku: "CWT006", 
    stock: 15, 
    price: 65.50, 
    category: "ceramic", 
    lastSold: "15/06/2025", 
    velocity: "medium", 
    reorderPoint: 10,
    purchasePrice: 42.00,
    lastRestocked: "2024-01-14"
  },
];

export const MobileInventory = () => {
  const [showAddItem, setShowAddItem] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const { toast } = useToast();

  const filteredItems = localSearch 
    ? mockInventory.filter(item => 
        item.name.toLowerCase().includes(localSearch.toLowerCase()) ||
        item.sku.toLowerCase().includes(localSearch.toLowerCase())
      )
    : mockInventory;

  const handleQuickAdjust = (item: InventoryItem, adjustment: number) => {
    const action = adjustment > 0 ? 'increased' : 'decreased';
    toast({
      title: "Stock Updated",
      description: `${item.name} stock ${action} by ${Math.abs(adjustment)}`,
    });
  };

  const handleEdit = (item: InventoryItem) => {
    toast({
      title: "Edit Item",
      description: `Opening edit form for ${item.name}`,
    });
  };

  const handleDelete = (item: InventoryItem) => {
    toast({
      title: "Item Deleted",
      description: `${item.name} has been removed from inventory`,
    });
  };

  return (
    <div className="h-full flex flex-col">
      <WhatsAppStyleInventoryList
        items={filteredItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onQuickAdjust={handleQuickAdjust}
        searchQuery={localSearch}
        onSearch={setLocalSearch}
      />

      {/* Add Item Bottom Sheet */}
      <MobileBottomSheet
        isOpen={showAddItem}
        onClose={() => setShowAddItem(false)}
        title="Add New Item"
      >
        <div className="p-4">
          <p className="text-gray-600">Add item form will go here...</p>
        </div>
      </MobileBottomSheet>
    </div>
  );
};
