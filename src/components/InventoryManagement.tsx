
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Package, Search, Filter, TrendingDown, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface InventoryItem {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  category?: string;
  lowStockThreshold?: number;
}

const InventoryManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load inventory items on component mount
  useEffect(() => {
    if (user) {
      loadInventoryItems();
    }
  }, [user]);

  // Filter items based on search term
  useEffect(() => {
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [items, searchTerm]);

  const loadInventoryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading inventory:', error);
      toast({
        title: "Error",
        description: "Failed to load inventory items",
        variant: "destructive",
      });
    }
  };

  const handleAddItem = async () => {
    if (newItem.name && newItem.price && user) {
      setLoading(true);
      try {
        const { error } = await supabase
          .from('inventory_items')
          .insert({
            user_id: user.id,
            name: newItem.name,
            price: newItem.price,
            stock_quantity: newItem.stock_quantity || 0
          });

        if (error) throw error;

        await loadInventoryItems();
        setNewItem({});
        setIsAddDialogOpen(false);
        
        toast({
          title: "Success",
          description: "Item added successfully!",
        });
      } catch (error) {
        console.error('Error adding item:', error);
        toast({
          title: "Error",
          description: "Failed to add item",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { status: 'out', color: 'destructive', icon: AlertCircle };
    if (quantity <= 5) return { status: 'low', color: 'secondary', icon: TrendingDown };
    return { status: 'good', color: 'default', icon: Package };
  };

  const lowStockCount = items.filter(item => item.stock_quantity <= 5).length;
  const outOfStockCount = items.filter(item => item.stock_quantity === 0).length;
  const totalValue = items.reduce((sum, item) => sum + (item.stock_quantity * item.price), 0);

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Inventory Overview</h2>
            <p className="text-blue-100">Manage your product inventory</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-blue-600 hover:bg-gray-100 gap-2">
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
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="quantity">Initial Stock</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="0"
                      value={newItem.stock_quantity || ""}
                      onChange={(e) => setNewItem({...newItem, stock_quantity: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newItem.price || ""}
                      onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <Button onClick={handleAddItem} className="w-full" disabled={loading}>
                  {loading ? "Adding..." : "Add Item"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-blue-100 text-sm">Total Items</p>
            <p className="text-2xl font-bold">{items.length}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-blue-100 text-sm">Low Stock</p>
            <p className="text-2xl font-bold text-yellow-300">{lowStockCount}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-blue-100 text-sm">Total Value</p>
            <p className="text-2xl font-bold">${totalValue.toFixed(0)}</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Items */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const stockInfo = getStockStatus(item.stock_quantity);
          const StockIcon = stockInfo.icon;
          
          return (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-500">SKU: {item.id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={stockInfo.color as any} className="gap-1">
                      <StockIcon className="h-3 w-3" />
                      {item.stock_quantity} units
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-600 mb-1">Stock Quantity</p>
                    <p className="font-bold text-lg">{item.stock_quantity}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-600 mb-1">Unit Price</p>
                    <p className="font-bold text-lg">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="mt-3 bg-blue-50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Value:</span>
                    <span className="font-bold text-blue-600">
                      ${(item.stock_quantity * item.price).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {filteredItems.length === 0 && items.length > 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600">Try adjusting your search terms.</p>
            </CardContent>
          </Card>
        )}
        
        {items.length === 0 && (
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8 text-center">
              <Package className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Start Your Inventory</h3>
              <p className="text-gray-600 mb-6">Add your first product to begin managing your inventory efficiently.</p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Item
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;
