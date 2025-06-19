import { useState, useMemo, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchInput } from "@/components/ui/search";
import { 
  Plus, 
  Minus, 
  ShoppingCart,
  DollarSign,
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
  discount: number; // absolute dollar amount
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
    <div 
      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow cursor-pointer"
      onClick={handleAdd}
    >
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm text-gray-900 truncate">
          {highlightText(product.name, searchQuery)}
        </h3>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-semibold text-primary-600">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500">
            {product.stock} in stock
          </span>
        </div>
      </div>
      <Button size="sm" className="h-6 w-6 rounded-full p-0 ml-2">
        <Plus className="h-3 w-3" />
      </Button>
    </div>
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
  const calculateTotal = useCallback((qty: number, price: number, discountAmount: number) => {
    const subtotal = qty * price;
    return Math.max(0, subtotal - discountAmount); // Ensure total doesn't go negative
  }, []);

  const handleQuantityChange = useCallback((value: string) => {
    setQuantity(value);
    const qty = Math.max(1, parseInt(value) || 1);
    const price = parseFloat(pricePerUnit) || 0;
    const discountAmount = parseFloat(discount) || 0;
    const total = calculateTotal(qty, price, discountAmount);
    
    onUpdate(item.id, { 
      quantity: qty, 
      total 
    });
  }, [item.id, pricePerUnit, discount, calculateTotal, onUpdate]);

  const handlePriceChange = useCallback((value: string) => {
    setPricePerUnit(value);
    const price = Math.max(0, parseFloat(value) || 0);
    const qty = parseInt(quantity) || 1;
    const discountAmount = parseFloat(discount) || 0;
    const total = calculateTotal(qty, price, discountAmount);
    
    onUpdate(item.id, { 
      pricePerUnit: price, 
      total 
    });
  }, [item.id, quantity, discount, calculateTotal, onUpdate]);

  const handleDiscountChange = useCallback((value: string) => {
    setDiscount(value);
    const discountAmount = Math.max(0, parseFloat(value) || 0);
    const qty = parseInt(quantity) || 1;
    const price = parseFloat(pricePerUnit) || 0;
    const total = calculateTotal(qty, price, discountAmount);
    
    onUpdate(item.id, { 
      discount: discountAmount, 
      total 
    });
  }, [item.id, quantity, pricePerUnit, calculateTotal, onUpdate]);

  const handleQuantityAdjust = useCallback((change: number) => {
    const newQty = Math.max(1, (parseInt(quantity) || 1) + change);
    handleQuantityChange(newQty.toString());
  }, [quantity, handleQuantityChange]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 space-y-3">
      {/* Item Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
            <Package className="h-3 w-3 text-gray-600" />
          </div>
          <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.id)}
          className="h-6 w-6 p-0 rounded-full text-gray-400 hover:text-red-500"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      {/* Input Fields - 2x2 Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Quantity */}
        <div>
          <Label className="text-xs font-medium text-gray-700 mb-1 block">Quantity</Label>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityAdjust(-1)}
              className="h-7 w-7 rounded-full p-0"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className="flex-1 h-7 text-center text-sm font-medium"
              min="1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityAdjust(1)}
              className="h-7 w-7 rounded-full p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Price Per Unit */}
        <div>
          <Label className="text-xs font-medium text-gray-700 mb-1 block">Price Per Unit</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
            <Input
              type="number"
              value={pricePerUnit}
              onChange={(e) => handlePriceChange(e.target.value)}
              className="pl-6 h-7 text-sm"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Discount - Now absolute amount */}
        <div>
          <Label className="text-xs font-medium text-gray-700 mb-1 block">Discount</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
            <Input
              type="number"
              value={discount}
              onChange={(e) => handleDiscountChange(e.target.value)}
              className="pl-6 h-7 text-sm"
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Total */}
        <div>
          <Label className="text-xs font-medium text-gray-700 mb-1 block">Total</Label>
          <div className="h-7 px-2 bg-primary-50 border border-primary-200 rounded-lg flex items-center">
            <span className="text-sm font-bold text-primary-700">
              ${item.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

CartItemComponent.displayName = "CartItemComponent";

export const SalesEntryForm = memo<SalesEntryFormProps>(({ inventory, onComplete, onCancel }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Filter products based on search with smart suggestions
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return []; // Show nothing when no search
    
    return inventory.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 8); // Limit results for performance
  }, [inventory, searchQuery]);

  const addToCart = useCallback((product: InventoryItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        const newQuantity = existing.quantity + 1;
        const total = newQuantity * existing.pricePerUnit - existing.discount;
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: newQuantity, total: Math.max(0, total) }
            : item
        );
      }
      const total = 1 * product.price - 0; // No discount initially
      return [...prev, { 
        id: product.id,
        name: product.name,
        quantity: 1, 
        pricePerUnit: product.price,
        total,
        discount: 0 // Start with no discount
      }];
    });
    
    // Clear search after adding
    setSearchQuery("");
  }, []);

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
    const totalDiscount = cart.reduce((sum, item) => sum + item.discount, 0);
    
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
        discount: item.discount, // Now absolute amount
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
      {/* SEARCH BAR AT TOP - NO HEADING, MAXIMUM WIDTH */}
      <div className="p-4 border-b border-gray-100 bg-white">
        <SearchInput
          placeholder="Search products to add..."
          value={searchQuery}
          onSearch={setSearchQuery}
          className="h-12 rounded-full bg-gray-100 border-0 text-sm w-full"
        />
        
        {/* Cart summary when items exist */}
        {cart.length > 0 && (
          <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-3 w-3" />
              <span>{cart.length} items</span>
            </div>
            <span className="font-semibold">${calculations.finalTotal.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Search Results - Only show when searching */}
      {searchQuery && (
        <div className="max-h-[20%] p-3 border-b border-gray-100 bg-gray-50 overflow-y-auto">
          {filteredProducts.length > 0 ? (
            <div className="space-y-2">
              {filteredProducts.map((product) => (
                <ProductSearchItem
                  key={product.id}
                  product={product}
                  onAdd={addToCart}
                  searchQuery={searchQuery}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">No products found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}

      {/* CART ITEMS - MAXIMUM SPACE ALLOCATED HERE */}
      <div className="flex-1 overflow-y-auto p-3">
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ShoppingCart className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Start adding products</h3>
            <p className="text-gray-500 text-sm mb-4">Use the search bar above to find and add products to your sale</p>
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
            
            {/* FLOATING ACTION BUTTONS - FIXED AT BOTTOM OF CART */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4 -mx-3 mt-6">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 h-11 rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCompleteSale}
                  className="flex-1 h-11 bg-primary-600 hover:bg-primary-700 rounded-full font-semibold"
                >
                  Complete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

SalesEntryForm.displayName = "SalesEntryForm";