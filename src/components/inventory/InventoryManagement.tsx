import { useState } from "react";
import { WhatsAppStyleInventoryList } from "./WhatsAppStyleInventoryList";
import { useToast } from "@/hooks/use-toast";
import { MobileBottomSheet } from "@/components/mobile/MobileBottomSheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Edit,
  X
} from "lucide-react";

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

interface InventoryManagementProps {
  searchQuery?: string;
}

export const InventoryManagement = ({ searchQuery }: InventoryManagementProps) => {
  const [items] = useState<InventoryItem[]>([
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
  ]);

  const [localSearch, setLocalSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
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

  const handleItemClick = (item: InventoryItem) => {
    setSelectedItem(item);
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
                    <p className="font-medium">{selectedItem.sku}</p>
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
                    <p className="text-2xl font-bold text-primary">{selectedItem.stock} units</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reorder Point</p>
                    <p className="text-lg font-semibold">{selectedItem.reorderPoint || 'Not set'}</p>
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
                      ${selectedItem.purchasePrice?.toFixed(2) || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Selling Price</p>
                    <p className="text-xl font-bold text-green-700">
                      ${selectedItem.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                {selectedItem.purchasePrice && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">Profit Margin</p>
                      <Badge 
                        className={cn(
                          "font-semibold",
                          getMarginColor(parseFloat(calculateMargin(selectedItem.price, selectedItem.purchasePrice)))
                        )}
                      >
                        {calculateMargin(selectedItem.price, selectedItem.purchasePrice)}%
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Profit per unit:</span>
                        <span className="font-medium text-green-600">
                          ${(selectedItem.price - selectedItem.purchasePrice).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total potential profit:</span>
                        <span className="font-medium text-green-600">
                          ${((selectedItem.price - selectedItem.purchasePrice) * selectedItem.stock).toFixed(2)}
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
                    <p className="font-medium">{selectedItem.lastSold || 'Never'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sales Velocity</p>
                    <Badge 
                      variant={
                        selectedItem.velocity === 'fast' ? 'success' : 
                        selectedItem.velocity === 'medium' ? 'warning' : 'secondary'
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
                    {selectedItem.lastRestocked 
                      ? new Date(selectedItem.lastRestocked).toLocaleDateString('en-US', {
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
                  {selectedItem.stock === 0 ? (
                    <div className="flex items-center gap-2 text-red-600">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-sm font-medium">Out of Stock - Immediate reorder needed</span>
                    </div>
                  ) : selectedItem.stock <= (selectedItem.reorderPoint || 5) ? (
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