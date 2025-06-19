import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Scan, Search, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MobileSalesFormProps {
  onClose: () => void;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const mockProducts = [
  { id: "1", name: "Premium Headphones", price: 99.99 },
  { id: "2", name: "Wireless Mouse", price: 29.99 },
  { id: "3", name: "Bluetooth Speaker", price: 45.99 },
  { id: "4", name: "USB Cable", price: 8.99 },
  { id: "5", name: "Phone Case", price: 12.99 },
];

export const MobileSalesForm = ({ onClose }: MobileSalesFormProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [scanMode, setScanMode] = useState(false);
  const { toast } = useToast();

  const addToCart = (product: typeof mockProducts[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, change: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCompleteSale = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to complete the sale",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sale Completed",
      description: `Successfully recorded sale of $${getSubtotal().toFixed(2)}`,
    });
    onClose();
  };

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Search/Scan Toggle */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex gap-2 mb-3">
          <Button
            variant={!scanMode ? "default" : "outline"}
            onClick={() => setScanMode(false)}
            className="flex-1 h-10 rounded-full"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button
            variant={scanMode ? "default" : "outline"}
            onClick={() => setScanMode(true)}
            className="flex-1 h-10 rounded-full"
          >
            <Scan className="h-4 w-4 mr-2" />
            Scan
          </Button>
        </div>

        {scanMode ? (
          <div className="bg-gray-100 rounded-2xl p-4 text-center">
            <Scan className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Point camera at barcode</p>
          </div>
        ) : (
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 rounded-full bg-gray-100 border-0"
          />
        )}
      </div>

      {/* Product List */}
      {!scanMode && (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                    </div>
                    <Button
                      onClick={() => addToCart(product)}
                      size="sm"
                      className="h-8 w-8 rounded-full p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Cart */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingCart className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">
              Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
            </h3>
          </div>

          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Your cart is empty</p>
          ) : (
            <div className="space-y-2 max-h-32 overflow-y-auto mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="h-6 w-6 rounded-full"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="h-6 w-6 rounded-full"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Total and Complete Sale */}
          <div className="bg-white rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-primary-600">
                ${getSubtotal().toFixed(2)}
              </span>
            </div>
            <Button
              onClick={handleCompleteSale}
              disabled={cart.length === 0}
              className="w-full h-12 bg-primary-600 hover:bg-primary-700 rounded-full text-lg font-semibold"
            >
              Complete Sale
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};