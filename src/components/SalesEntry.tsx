
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus, ShoppingCart } from "lucide-react";

interface SaleItem {
  id: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

interface Sale {
  id: string;
  date: string;
  items: SaleItem[];
  subtotal: number;
  totalDiscount: number;
  finalTotal: number;
}

const SalesEntry = () => {
  const [currentSale, setCurrentSale] = useState<SaleItem[]>([]);
  const [newItem, setNewItem] = useState({
    itemName: "",
    quantity: 1,
    unitPrice: 0,
    discount: 0
  });

  const inventoryItems = [
    { name: "Bluetooth Speaker", price: 79.99 },
    { name: "Wireless Mouse", price: 29.99 },
    { name: "Phone Case", price: 19.99 },
    { name: "USB Cable", price: 12.99 }
  ];

  const handleItemSelect = (itemName: string) => {
    const selectedItem = inventoryItems.find(item => item.name === itemName);
    if (selectedItem) {
      setNewItem({
        ...newItem,
        itemName: selectedItem.name,
        unitPrice: selectedItem.price
      });
    }
  };

  const calculateItemTotal = (quantity: number, unitPrice: number, discount: number) => {
    const subtotal = quantity * unitPrice;
    const discountAmount = (subtotal * discount) / 100;
    return subtotal - discountAmount;
  };

  const addItemToSale = () => {
    if (newItem.itemName && newItem.quantity > 0) {
      const total = calculateItemTotal(newItem.quantity, newItem.unitPrice, newItem.discount);
      const saleItem: SaleItem = {
        id: Date.now().toString(),
        itemName: newItem.itemName,
        quantity: newItem.quantity,
        unitPrice: newItem.unitPrice,
        discount: newItem.discount,
        total: total
      };
      setCurrentSale([...currentSale, saleItem]);
      setNewItem({
        itemName: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0
      });
    }
  };

  const removeItemFromSale = (id: string) => {
    setCurrentSale(currentSale.filter(item => item.id !== id));
  };

  const calculateSaleTotal = () => {
    const subtotal = currentSale.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalDiscount = currentSale.reduce((sum, item) => sum + ((item.quantity * item.unitPrice * item.discount) / 100), 0);
    const finalTotal = subtotal - totalDiscount;
    return { subtotal, totalDiscount, finalTotal };
  };

  const completeSale = () => {
    if (currentSale.length > 0) {
      // Here you would typically save the sale to your database
      alert("Sale completed successfully!");
      setCurrentSale([]);
    }
  };

  const { subtotal, totalDiscount, finalTotal } = calculateSaleTotal();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">New Sale</h2>
        <Button 
          onClick={completeSale} 
          disabled={currentSale.length === 0}
          className="gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Complete Sale
        </Button>
      </div>

      {/* Add Item Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Add Item to Sale</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="item-select">Select Item</Label>
            <Select value={newItem.itemName} onValueChange={handleItemSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an item" />
              </SelectTrigger>
              <SelectContent>
                {inventoryItems.map((item) => (
                  <SelectItem key={item.name} value={item.name}>
                    {item.name} - ${item.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={newItem.quantity}
                onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
              />
            </div>
            <div>
              <Label htmlFor="unit-price">Unit Price ($)</Label>
              <Input
                id="unit-price"
                type="number"
                step="0.01"
                value={newItem.unitPrice}
                onChange={(e) => setNewItem({...newItem, unitPrice: parseFloat(e.target.value) || 0})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="discount">Discount (%)</Label>
            <Input
              id="discount"
              type="number"
              min="0"
              max="100"
              value={newItem.discount}
              onChange={(e) => setNewItem({...newItem, discount: parseFloat(e.target.value) || 0})}
            />
          </div>

          <div className="text-sm text-gray-600">
            Item Total: ${calculateItemTotal(newItem.quantity, newItem.unitPrice, newItem.discount).toFixed(2)}
          </div>

          <Button onClick={addItemToSale} className="w-full gap-2">
            <Plus className="h-4 w-4" />
            Add to Sale
          </Button>
        </CardContent>
      </Card>

      {/* Current Sale Items */}
      {currentSale.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Current Sale Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentSale.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.itemName}</p>
                  <p className="text-xs text-gray-600">
                    {item.quantity} × ${item.unitPrice.toFixed(2)}
                    {item.discount > 0 && ` (${item.discount}% off)`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">${item.total.toFixed(2)}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItemFromSale(item.id)}
                    className="p-1 h-auto"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="border-t pt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Total Discount:</span>
                  <span>-${totalDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SalesEntry;
