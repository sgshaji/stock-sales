import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter,
  Package,
  AlertTriangle,
  CheckCircle2,
  Minus
} from "lucide-react";
import { MobileBottomSheet } from "./MobileBottomSheet";

const mockInventory = [
  { id: 1, name: "Premium Headphones", sku: "HD001", stock: 3, price: 99.99, reorderPoint: 20 },
  { id: 2, name: "Wireless Mouse", sku: "MS002", stock: 15, price: 29.99, reorderPoint: 15 },
  { id: 3, name: "Bluetooth Speaker", sku: "BS003", stock: 8, price: 45.99, reorderPoint: 12 },
  { id: 4, name: "USB Cable", sku: "USB004", stock: 25, price: 8.99, reorderPoint: 25 },
  { id: 5, name: "Phone Case", sku: "PC005", stock: 0, price: 12.99, reorderPoint: 10 },
];

export const MobileInventory = () => {
  const [showAddItem, setShowAddItem] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const getStockStatus = (stock: number, reorderPoint: number) => {
    if (stock === 0) return { color: "text-red-600", bg: "bg-red-100", label: "Out of Stock" };
    if (stock <= reorderPoint) return { color: "text-yellow-600", bg: "bg-yellow-100", label: "Low Stock" };
    return { color: "text-green-600", bg: "bg-green-100", label: "In Stock" };
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header Actions */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowSearch(!showSearch)}
            className="h-10 w-10 rounded-full"
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setShowAddItem(true)}
            className="flex-1 h-10 bg-green-600 hover:bg-green-700 rounded-full gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>

        {showSearch && (
          <div className="mt-3">
            <input
              type="search"
              placeholder="Search inventory..."
              className="w-full h-10 px-4 bg-gray-100 rounded-full border-0 focus:ring-2 focus:ring-primary-500 focus:bg-white"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Inventory List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {mockInventory.map((item) => {
          const status = getStockStatus(item.stock, item.reorderPoint);
          
          return (
            <Card key={item.id} className="bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {/* Item Icon */}
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Package className="h-6 w-6 text-gray-600" />
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                    <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`text-xs ${status.bg} ${status.color} border-0`}>
                        {status.label}
                      </Badge>
                      <span className="text-sm font-bold text-primary-600">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Stock Controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <div className="text-center min-w-[3rem]">
                      <div className="text-lg font-bold text-gray-900">{item.stock}</div>
                      <div className="text-xs text-gray-500">units</div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Low Stock Warning */}
                {item.stock <= item.reorderPoint && (
                  <div className="mt-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800">
                        {item.stock === 0 ? 'Out of stock' : `Low stock - Reorder at ${item.reorderPoint} units`}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

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