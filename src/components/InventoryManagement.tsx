
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Package } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentQuantity: number;
  purchasePrice: number;
  sellingPrice: number;
  lowStockThreshold: number;
}

const InventoryManagement = () => {
  const [items, setItems] = useState<InventoryItem[]>([
    {
      id: "1",
      name: "Bluetooth Speaker",
      category: "Electronics",
      currentQuantity: 25,
      purchasePrice: 45.00,
      sellingPrice: 79.99,
      lowStockThreshold: 5
    },
    {
      id: "2",
      name: "Wireless Mouse",
      category: "Electronics",
      currentQuantity: 1,
      purchasePrice: 15.00,
      sellingPrice: 29.99,
      lowStockThreshold: 3
    }
  ]);

  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddItem = () => {
    if (newItem.name && newItem.purchasePrice && newItem.sellingPrice) {
      const item: InventoryItem = {
        id: Date.now().toString(),
        name: newItem.name,
        category: newItem.category || "General",
        currentQuantity: newItem.currentQuantity || 0,
        purchasePrice: newItem.purchasePrice,
        sellingPrice: newItem.sellingPrice,
        lowStockThreshold: newItem.lowStockThreshold || 5
      };
      setItems([...items, item]);
      setNewItem({});
      setIsAddDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Inventory Items</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  placeholder="Enter item name"
                  value={newItem.name || ""}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="Enter category"
                  value={newItem.category || ""}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="quantity">Current Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="0"
                    value={newItem.currentQuantity || ""}
                    onChange={(e) => setNewItem({...newItem, currentQuantity: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="threshold">Low Stock Alert</Label>
                  <Input
                    id="threshold"
                    type="number"
                    placeholder="5"
                    value={newItem.lowStockThreshold || ""}
                    onChange={(e) => setNewItem({...newItem, lowStockThreshold: parseInt(e.target.value) || 5})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="purchase">Purchase Price ($)</Label>
                  <Input
                    id="purchase"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newItem.purchasePrice || ""}
                    onChange={(e) => setNewItem({...newItem, purchasePrice: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="selling">Selling Price ($)</Label>
                  <Input
                    id="selling"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newItem.sellingPrice || ""}
                    onChange={(e) => setNewItem({...newItem, sellingPrice: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
              <Button onClick={handleAddItem} className="w-full">
                Add Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} className={item.currentQuantity <= item.lowStockThreshold ? "border-orange-200 bg-orange-50" : ""}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-600">{item.category}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-gray-600">Quantity</p>
                  <p className={`font-medium ${item.currentQuantity <= item.lowStockThreshold ? "text-orange-600" : ""}`}>
                    {item.currentQuantity} units
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Selling Price</p>
                  <p className="font-medium">${item.sellingPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Purchase Price</p>
                  <p className="font-medium">${item.purchasePrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Profit Margin</p>
                  <p className="font-medium text-green-600">
                    {(((item.sellingPrice - item.purchasePrice) / item.purchasePrice) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InventoryManagement;
