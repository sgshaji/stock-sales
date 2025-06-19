import { useState, useMemo, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search";
import { 
  Plus, 
  Minus, 
  Search, 
  ShoppingCart,
  DollarSign,
  Percent,
  X,
  Package
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface InventoryItem {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  pricePerUnit: number;
  total: number;
  discount: number; // percentage
}

interface SalesEntryFormProps {
  inventory: InventoryItem[];
  onComplete: (saleData: any) => void;
  onCancel: () => void;
}

const ProductSearchItem = memo<{
  product: InventoryItem;
  onAdd: (product: InventoryItem) => void;
  searchQuery: string;
}>(({ product, onAdd, searchQuery }) => {
  const handleAdd = useCallback(() => onAdd(product), [onAdd, product]);
  
  // Highlight matching text
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? <mark key={index} className="bg-yellow-200">{part}</mark> : part
    );
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleAdd}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">
              {highlightText(product.name, searchQuery)}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-semibold text-primary-600">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs text-gray-500">
                {product.stock} in stock
              </span>
            </div>
          </div>
          <Button size="sm" className="h-8 w-8 rounded-full p-0 ml-2">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

ProductSearchItem.displayName = "ProductSearchItem";

const CartItemComponent = memo<{
  item: CartItem;
  onUpdate: (id: number, updates: Partial<CartItem>) => void;
  onRemove: (id: number) => void;
}>(({ item, onUpdate, onRemove }) => {
  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [pricePerUnit, setPricePerUnit] = useState(item.pricePerUnit.toString());
  const [discount, setDiscount] = useState(item.discount.toString());

  // Calculate total whenever inputs change
  const calculateTotal = useCallback((qty: number, price: number, disc: number) => {
    const subtotal = qty * price;
    const discountAmount = subtotal * (disc / 100);
    return subtotal - discountAmount;
  }, []);

  const handleQuantityChange = useCallback((value: string) => {
    setQuantity(value);
    const qty = Math.max(1, parseInt(value) || 1);
    const price = parseFloat(pricePerUnit) || 0;
    const disc = parseFloat(discount) || 0;
    const total = calculateTotal(qty, price, disc);
    
    onUpdate(item.id, { 
      quantity: qty, 
      total 
    });
  }, [item.id, pricePerUnit, discount, calculateTotal, onUpdate]);

  const handlePriceChange = useCallback((value: string) => {
    setPricePerUnit(value);
    const price = Math.max(0, parseFloat(value) || 0);
    const qty = parseInt(quantity) || 1;
    const disc = parseFloat(discount) || 0;
    const total = calculateTotal(qty, price, disc);
    
    onUpdate(item.id, { 
      pricePerUnit: price, 
      total 
    });
  }, [item.id, quantity, discount, calculateTotal, onUpdate]);

  const handleDiscountChange = useCallback((value: string) => {
    setDiscount(value);
    const disc = Math.max(0, Math.min(100, parseFloat(value) || 0));
    const qty = parseInt(quantity) || 1;
    const price = parseFloat(pricePerUnit) || 0;
    const total = calculateTotal(qty, price, disc);
    
    onUpdate(item.id, { 
      discount: disc, 
      total 
    });
  }, [item.id, quantity, pricePerUnit, calculateTotal, onUpdate]);

  const handleQuantityAdjust = useCallback((change: number) => {
    const newQty = Math.max(1, (parseInt(quantity) || 1) + change);
    handleQuantityChange(newQty.toString());
  }, [quantity, handleQuantityChange]);

  return (
    <Card className="bg-white">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Package className="h-5 w-5 text-gray-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium text-gray-900 truncate pr-2">{item.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(item.id)}
                className="h-6 w-6 p-0 rounded-full text-gray-400 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Quantity */}
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Quantity</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityAdjust(-1)}
                    className="h-8 w-8 rounded-full p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    className="w-16 h-8 text-center text-sm"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityAdjust(1)}
                    className="h-8 w-8 rounded-full p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Price Per Unit */}
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Price Per Unit</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="number"
                    value={pricePerUnit}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    className="pl-7 h-8 text-sm"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Discount */}
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Discount</Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={discount}
                    onChange={(e) => handleDiscountChange(e.target.value)}
                    className="pr-7 h-8 text-sm"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <Percent className="absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Total */}
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Total</Label>
                <div className="h-8 px-3 bg-gray-50 rounded-lg flex items-center">
                  <span className="text-sm font-semibold text-primary-600">
                    ${item.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

CartItemComponent.displayName = "CartItemComponent";

export const SalesEntryForm = memo<SalesEntryFormProps>(({ inventory, onComplete, onCancel }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Filter products based on search with smart suggestions
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return inventory.slice(0, 5); // Show top 5 when no search
    
    return inventory.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 10); // Limit results for performance
  }, [inventory, searchQuery]);

  const addToCart = useCallback((product: InventoryItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        const newQuantity = existing.quantity + 1;
        const total = newQuantity * existing.pricePerUnit * (1 - existing.discount / 100);
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: newQuantity, total }
            : item
        );
      }
      const total = 1 * product.price * (1 - 0 / 100);
      return [...prev, { 
        id: product.id,
        name: product.name,
        quantity: 1, 
        pricePerUnit: product.price,
        total,
        discount: 0 
      }];
    });
    
    // Clear search after adding
    setSearchQuery("");
    
    toast({
      title: "Added to cart",
      description: `${product.name} added to cart`,
    });
  }, [toast]);

  const updateCartItem = useCallback((id: number, updates: Partial<CartItem>) => {
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  // Calculate totals
  const calculations = useMemo(() => {
    const finalTotal = cart.reduce((sum, item) => sum + item.total, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.pricePerUnit), 0);
    const totalDiscount = subtotal - finalTotal;
    
    return {
      subtotal,
      totalDiscount,
      finalTotal
    };
  }, [cart]);

  const handleCompleteSale = useCallback(() => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to complete the sale",
        variant: "destructive",
      });
      return;
    }

    // Check stock availability
    const stockIssues = cart.filter(item => {
      const inventoryItem = inventory.find(inv => inv.id === item.id);
      return !inventoryItem || item.quantity > inventoryItem.stock;
    });
    
    if (stockIssues.length > 0) {
      toast({
        title: "Insufficient Stock",
        description: `Not enough stock for: ${stockIssues.map(item => item.name).join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    const saleData = {
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.pricePerUnit,
        discount: item.discount,
        total: item.total
      })),
      subtotal: calculations.subtotal,
      totalDiscount: calculations.totalDiscount,
      finalTotal: calculations.finalTotal,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      status: 'completed'
    };

    onComplete(saleData);
  }, [cart, calculations, onComplete, toast, inventory]);

  return (
    <div className="flex flex-col h-full">
      {/* Search Section */}
      <div className="p-4 border-b border-gray-100">
        <SearchInput
          placeholder="Search products to add to cart..."
          value={searchQuery}
          onSearch={setSearchQuery}
          className="h-12 rounded-full bg-gray-100 border-0"
        />
      </div>

      {/* Product Search Results */}
      {searchQuery && (
        <div className="p-4 border-b border-gray-100">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductSearchItem
                  key={product.id}
                  product={product}
                  onAdd={addToCart}
                  searchQuery={searchQuery}
                />
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No products found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cart */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">
              Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
            </h3>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-8">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">Your cart is empty</p>
              <p className="text-sm text-gray-400">Search for products to add them to your cart</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <CartItemComponent
                  key={item.id}
                  item={item}
                  onUpdate={updateCartItem}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Total and Complete Sale */}
      {cart.length > 0 && (
        <div className="border-t border-gray-200 bg-white p-4">
          {/* Price Summary */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${calculations.subtotal.toFixed(2)}</span>
                </div>
                {calculations.totalDiscount > 0 && (
                  <div className="flex justify-between text-sm text-success-600">
                    <span>Total Discount:</span>
                    <span>-${calculations.totalDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Final Total:</span>
                  <span className="text-primary-600">${calculations.finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-12 rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCompleteSale}
              className="flex-1 h-12 bg-primary-600 hover:bg-primary-700 rounded-full text-lg font-semibold"
            >
              Complete Sale
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});

SalesEntryForm.displayName = "SalesEntryForm";