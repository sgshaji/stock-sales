import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus, ShoppingCart, Calendar, Receipt } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

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

interface InventoryItem {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
}

const SalesEntry = () => {
  const { user } = useAuth();
  
  const [currentSale, setCurrentSale] = useState<SaleItem[]>([]);
  const [dailySales, setDailySales] = useState<Sale[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [newItem, setNewItem] = useState({
    itemName: "",
    quantity: 1,
    unitPrice: 0,
    discount: 0
  });

  const today = new Date().toLocaleDateString();
  const todaysSales = dailySales.filter(sale => sale.date === today);
  const todaysTotal = todaysSales.reduce((sum, sale) => sum + sale.finalTotal, 0);

  // Load inventory items and today's sales on component mount
  useEffect(() => {
    loadInventoryItems();
    loadTodaysSales();
  }, []);

  const loadInventoryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setInventoryItems(data || []);
    } catch (error) {
      console.error('Error loading inventory:', error);
      toast({
        title: "Error",
        description: "Failed to load inventory items",
        variant: "destructive",
      });
    }
  };

  const loadTodaysSales = async () => {
    try {
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select(`
          *,
          sale_items (*)
        `)
        .eq('sale_date', new Date().toISOString().split('T')[0])
        .order('created_at', { ascending: false });

      if (salesError) throw salesError;

      const formattedSales = salesData?.map(sale => ({
        id: sale.id,
        date: new Date(sale.sale_date).toLocaleDateString(),
        time: sale.sale_time,
        items: sale.sale_items.map((item: any) => ({
          id: item.id,
          itemName: item.item_name,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          discount: item.discount_percent,
          total: item.total
        })),
        subtotal: sale.subtotal,
        totalDiscount: sale.total_discount,
        finalTotal: sale.final_total
      })) || [];

      setDailySales(formattedSales);
    } catch (error) {
      console.error('Error loading sales:', error);
      toast({
        title: "Error",
        description: "Failed to load today's sales",
        variant: "destructive",
      });
    }
  };

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

  const completeSale = async () => {
    if (currentSale.length === 0 || !user) return;

    setLoading(true);
    try {
      const { subtotal, totalDiscount, finalTotal } = calculateSaleTotal();
      
      // Insert the sale record with user_id
      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .insert({
          user_id: user.id,
          subtotal,
          total_discount: totalDiscount,
          final_total: finalTotal
        })
        .select()
        .single();

      if (saleError) throw saleError;

      // Insert sale items
      const saleItems = currentSale.map(item => ({
        sale_id: saleData.id,
        item_name: item.itemName,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        discount_percent: item.discount,
        total: item.total
      }));

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems);

      if (itemsError) throw itemsError;

      // Update inventory stock quantities
      for (const item of currentSale) {
        const inventoryItem = inventoryItems.find(inv => inv.name === item.itemName);
        if (inventoryItem) {
          const { error: updateError } = await supabase
            .from('inventory_items')
            .update({ 
              stock_quantity: Math.max(0, inventoryItem.stock_quantity - item.quantity),
              updated_at: new Date().toISOString()
            })
            .eq('id', inventoryItem.id);

          if (updateError) throw updateError;
        }
      }

      setCurrentSale([]);
      await loadTodaysSales();
      await loadInventoryItems();
      
      toast({
        title: "Success",
        description: "Sale completed successfully!",
      });
    } catch (error) {
      console.error('Error completing sale:', error);
      toast({
        title: "Error",
        description: "Failed to complete sale",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
                  <SelectItem key={item.id} value={item.name}>
                    {item.name} - ${item.price} (Stock: {item.stock_quantity})
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
                disabled={loading}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                <ShoppingCart className="h-4 w-4" />
                {loading ? "Processing..." : "Complete Sale"}
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
                    <p className="font-medium text-sm">Sale #{sale.id.slice(-8)}</p>
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
