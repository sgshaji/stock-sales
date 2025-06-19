
import { useState } from "react";
import { WhatsAppStyleInventoryList } from "./WhatsAppStyleInventoryList";
import { useToast } from "@/hooks/use-toast";

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
}

interface InventoryManagementProps {
  searchQuery?: string;
}

export const InventoryManagement = ({ searchQuery }: InventoryManagementProps) => {
  const [items] = useState<InventoryItem[]>([
    { id: 1, name: "Premium Clay Tiles", sku: "CT001", stock: 3, price: 99.99, category: "clay", lastSold: "14:46", velocity: "medium", reorderPoint: 10 },
    { id: 2, name: "Plastic Outdoor Tiles", sku: "PT002", stock: 12, price: 29.99, category: "plastic", lastSold: "13:27", velocity: "fast", reorderPoint: 15 },
    { id: 3, name: "Cement Floor Tiles", sku: "CF003", stock: 8, price: 45.99, category: "cement", lastSold: "Yesterday", velocity: "slow", reorderPoint: 12 },
    { id: 4, name: "Tile Spacers", sku: "TS004", stock: 25, price: 8.99, category: "accessories", lastSold: "17/06/2025", velocity: "fast", reorderPoint: 20 },
    { id: 5, name: "Decorative Clay Tiles", sku: "DCT005", stock: 0, price: 129.99, category: "clay", lastSold: "16/06/2025", velocity: "slow", reorderPoint: 8 },
    { id: 6, name: "Ceramic Wall Tiles", sku: "CWT006", stock: 15, price: 65.50, category: "ceramic", lastSold: "15/06/2025", velocity: "medium", reorderPoint: 10 },
  ]);

  const [localSearch, setLocalSearch] = useState("");
  const { toast } = useToast();

  const effectiveSearch = searchQuery || localSearch;
  const filteredItems = effectiveSearch 
    ? items.filter(item => 
        item.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
        item.sku.toLowerCase().includes(effectiveSearch.toLowerCase())
      )
    : items;

  const handleQuickAdjust = (item: InventoryItem, adjustment: number) => {
    const action = adjustment > 0 ? 'added' : 'removed';
    toast({
      title: "Stock Updated",
      description: `${Math.abs(adjustment)} units ${action} to ${item.name}`,
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
    <WhatsAppStyleInventoryList
      items={filteredItems}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onQuickAdjust={handleQuickAdjust}
      searchQuery={effectiveSearch}
      onSearch={!searchQuery ? setLocalSearch : undefined}
    />
  );
};

export default InventoryManagement;
