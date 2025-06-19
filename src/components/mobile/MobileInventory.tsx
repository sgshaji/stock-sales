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
  Minus,
  Calendar
} from "lucide-react";
import { MobileBottomSheet } from "./MobileBottomSheet";
import { cn } from "@/lib/utils";

const mockInventory = [
  { id: 1, name: "Premium Clay Tiles", sku: "CT001", stock: 3, price: 99.99, category: "clay", lastSold: "14:46", velocity: "medium", reorderPoint: 10 },
  { id: 2, name: "Plastic Outdoor Tiles", sku: "PT002", stock: 12, price: 29.99, category: "plastic", lastSold: "13:27", velocity: "fast", reorderPoint: 15 },
  { id: 3, name: "Cement Floor Tiles", sku: "CF003", stock: 8, price: 45.99, category: "cement", lastSold: "Yesterday", velocity: "slow", reorderPoint: 12 },
  { id: 4, name: "Tile Spacers", sku: "TS004", stock: 25, price: 8.99, category: "accessories", lastSold: "17/06/2025", velocity: "fast", reorderPoint: 20 },
  { id: 5, name: "Decorative Clay Tiles", sku: "DCT005", stock: 0, price: 129.99, category: "clay", lastSold: "16/06/2025", velocity: "slow", reorderPoint: 8 },
  { id: 6, name: "Ceramic Wall Tiles", sku: "CWT006", stock: 15, price: 65.50, category: "ceramic", lastSold: "15/06/2025", velocity: "medium", reorderPoint: 10 },
];

const getStockStatus = (stock: number, reorderPoint: number) => {
  if (stock === 0) return { color: "text-red-600", bg: "bg-red-500", label: "Out of Stock", icon: AlertTriangle };
  if (stock <= reorderPoint) return { color: "text-yellow-600", bg: "bg-yellow-500", label: "Low Stock", icon: AlertTriangle };
  return { color: "text-green-600", bg: "bg-green-500", label: "In Stock", icon: CheckCircle2 };
};

const getCategoryColor = (category?: string) => {
  const colors = {
    clay: "bg-orange-500",
    plastic: "bg-blue-500",
    cement: "bg-gray-500",
    accessories: "bg-purple-500",
    ceramic: "bg-teal-500",
    default: "bg-slate-500"
  };
  return colors[category as keyof typeof colors] || colors.default;
};

export const MobileInventory = () => {
  const [showAddItem, setShowAddItem] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

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

      {/* Inventory List - MATCHING SALES DESIGN */}
      <div className="flex-1 overflow-y-auto">
        {mockInventory.map((item) => {
          const status = getStockStatus(item.stock, item.reorderPoint);
          const categoryColor = getCategoryColor(item.category);
          
          return (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              {/* Item Avatar - MATCHING SALES DESIGN */}
              <div className="relative flex-shrink-0">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm",
                  categoryColor
                )}>
                  {item.name.substring(0, 2).toUpperCase()}
                </div>
                {/* Status indicator */}
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center",
                  status.bg
                )}>
                  <status.icon className={cn("w-2.5 h-2.5", status.color)} />
                </div>
              </div>

              {/* Item Info - MATCHING SALES DESIGN */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-medium text-gray-900 text-base leading-tight line-clamp-1 pr-2 flex-1">
                    {item.name}
                  </h3>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-4">
                    {item.velocity === 'fast' && (
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-sm text-gray-500 truncate">
                      {item.sku}
                    </span>
                    <span className="text-sm font-medium text-primary-600">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  
                  {/* Stock quantity - prominently displayed on right */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {item.stock}
                      </div>
                      <div className="text-xs text-gray-500">
                        units
                      </div>
                    </div>
                    
                    {/* Quick adjust buttons - show on hover */}
                    <div className="hidden group-hover:flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-7 w-7 rounded-full hover:bg-gray-200"
                        title="Decrease stock"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-7 w-7 rounded-full hover:bg-gray-200"
                        title="Increase stock"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Additional info row */}
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    Last sold: {item.lastSold}
                  </span>
                </div>

                {/* Low Stock Warning - MATCHING SALES DESIGN */}
                {item.stock <= item.reorderPoint && (
                  <div className="mt-2 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-xs text-orange-600">
                      {item.stock === 0 ? 'Out of stock' : `Low stock - Reorder at ${item.reorderPoint} units`}
                    </span>
                  </div>
                )}
              </div>
            </div>
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