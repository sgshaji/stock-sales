import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus, ShoppingCart, Calendar, Receipt } from "lucide-react";

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
  time: string;
  items: SaleItem[];
  subtotal: number;
  totalDiscount: number;
  finalTotal: number;
}

const SalesEntry = () => {
  const [currentSale, setCurrentSale] = useState<SaleItem[]>([]);
  const [dailySales, setDailySales] = useState<Sale[]>([]);
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
    { name: "USB Cable", price: 12.99 },
    { name: "Power Bank", price: 45.99 },
    { name: "Phone Charger", price: 15.99 }
  ];

  const today = new Date().toLocaleDateString();
  const todaysSales = dailySales.filter(sale => sale.date === today);
  const todaysTotal = todaysSales.reduce((sum, sale) => sum + sale.finalTotal, 0);

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
      const { subtotal, totalDiscount, finalTotal } = calculateSaleTotal();
      const newSale: Sale = {
        id: Date.now().toString(),
        date: today,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        items: [...currentSale],
        subtotal,
        totalDiscount,
        finalTotal
      };
      
      setDailySales([newSale, ...dailySales]);
      setCurrentSale([]);
      alert("Sale completed successfully!");
    }
  };

  const { subtotal, totalDiscount, finalTotal } = calculateSaleTotal();

  return (
    <div className="space-y-4">
      {/* Today's Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            Today's Sales Summary - {today}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Sales:</span>
              <p className="font-semibold text-lg">{todaysSales.length}</p>
            </div>
            <div>
              <span className="text-gray-600">Revenue:</span>
              <p className="font-semibold text-lg text-green-600">${todaysTotal.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Sale Form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Sale - {today}
          </CardTitle>
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
            Add to Current Sale
          </Button>
        </CardContent>
      </Card>

      {/* Current Sale Items */}
      {currentSale.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm">Current Sale Items</CardTitle>
              <Button 
                onClick={completeSale} 
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                <ShoppingCart className="h-4 w-4" />
                Complete Sale
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentSale.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-2 bg-white rounded border">
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
                    className="p-1 h-auto text-red-600 hover:text-red-800"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="border-t pt-3 space-y-1 bg-white p-3 rounded">
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
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today's Completed Sales */}
      {todaysSales.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Today's Completed Sales ({todaysSales.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-64 overflow-y-auto">
            {todaysSales.map((sale) => (
              <div key={sale.id} className="p-3 bg-gray-50 rounded border">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-sm">Sale #{sale.id.slice(-4)}</p>
                    <p className="text-xs text-gray-600">{sale.time}</p>
                  </div>
                  <p className="font-semibold text-green-600">${sale.finalTotal.toFixed(2)}</p>
                </div>
                <div className="text-xs text-gray-600">
                  {sale.items.map((item, index) => (
                    <span key={item.id}>
                      {item.quantity}x {item.itemName}
                      {index < sale.items.length - 1 && ", "}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SalesEntry;
