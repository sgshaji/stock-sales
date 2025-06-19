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
}

interface SalesEntryFormProps {
  inventory: InventoryItem[];
  onComplete: (saleData: any) => void;
  onCancel: () => void;
}

// Completion Popup Component
const CompletionPopup = memo<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (discount: number) => void;
  cart: CartItem[];
}>(({ isOpen, onClose, onConfirm, cart }) => {
  const [discount, setDiscount] = useState("0");
  
  const subtotal = useMemo(() => 
    cart.reduce((sum, item) => sum + item.total, 0), [cart]
  );
  
  const discountAmount = parseFloat(discount) || 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);
  
  const handleConfirm = () => {
    onConfirm(discountAmount);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[60] animate-fade-in" onClick={onClose} />
      
      {/* Popup */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[61] w-[90%] max-w-md bg-white rounded-2xl shadow-2xl animate-scale-in">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Complete Sale</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Sale Summary */}
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Items ({cart.length}):</span>
                <span className="font-medium">{cart.reduce((sum, item) => sum + item.quantity, 0)} units</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Discount Input */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Discount Amount (optional)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="pl-10 h-11 text-sm"
                  min="0"
                  max={subtotal}
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-gray-500">Enter discount amount in dollars</p>
            </div>

            {/* Final Total */}
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Final Total:</span>
                <span className="text-2xl font-bold text-primary-600">${finalTotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="text-sm text-success-600 mt-1">
                  Discount applied: -${discountAmount.toFixed(2)}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11 rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 h-11 bg-primary-600 hover:bg-primary-700 rounded-full font-semibold"
            >
              Complete Sale
            </Button>
          </div>
        </div>
      </div>
    </>
  );
});

CompletionPopup.displayName = "CompletionPopup";

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

  // Calculate total whenever inputs change
  const calculateTotal = useCallback((qty: number, price: number) => {
    return qty * price;
  }, []);

  const handleQuantityChange = useCallback((value: string) => {
    setQuantity(value);
    const qty = Math.max(1, parseInt(value) || 1);
    const price = parseFloat(pricePerUnit) || 0;
    const total = calculateTotal(qty, price);
    
    onUpdate(item.id, { 
      quantity: qty, 
      total 
    });
  }, [item.id, pricePerUnit, calculateTotal, onUpdate]);

  const handlePriceChange = useCallback((value: string) => {
    setPricePerUnit(value);
    const price = Math.max(0, parseFloat(value) || 0);
    const qty = parseInt(quantity) || 1;
    const total = calculateTotal(qty, price);
    
    onUpdate(item.id, { 
      pricePerUnit: price, 
      total 
    });
  }, [item.id, quantity, calculateTotal, onUpdate]);

  const handleQuantityAdjust = useCallback((change: number) => {
    const newQty = Math.max(1, (parseInt(quantity) || 1) + change);
    handleQuantityChange(newQty.toString());
  }, [quantity, handleQuantityChange]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3">
      {/* Item Header - Compact */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Package className="h-3 w-3 text-gray-600" />
          </div>
          <h3 className="font-medium text-gray-900 text-sm truncate">{item.name}</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.id)}
          className="h-6 w-6 p-0 rounded-full text-gray-400 hover:text-red-500 flex-shrink-0"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      {/* Input Fields - 3 column grid (removed discount) */}
      <div className="grid grid-cols-3 gap-3">
        {/* Quantity - Takes 1 column */}
        <div className="col-span-1">
          <Label className="text-xs font-medium text-gray-700 mb-1 block">Qty</Label>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityAdjust(-1)}
              className="h-7 w-6 rounded p-0 flex-shrink-0"
            >
              <Minus className="h-2 w-2" />
            </Button>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className="h-7 text-center text-xs font-medium min-w-0"
              min="1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityAdjust(1)}
              className="h-7 w-6 rounded p-0 flex-shrink-0"
            >
              <Plus className="h-2 w-2" />
            </Button>
          </div>
        </div>

        {/* Price Per Unit - Takes 1 column */}
        <div className="col-span-1">
          <Label className="text-xs font-medium text-gray-700 mb-1 block">Price</Label>
          <div className="relative">
            <DollarSign className="absolute left-1 top-1/2 h-2 w-2 -translate-y-1/2 text-gray-400" />
            <Input
              type="number"
              value={pricePerUnit}
              onChange={(e) => handlePriceChange(e.target.value)}
              className="pl-4 h-7 text-xs"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Total - Takes 1 column */}
        <div className="col-span-1">
          <Label className="text-xs font-medium text-gray-700 mb-1 block">Total</Label>
          <div className="h-7 px-2 bg-primary-50 border border-primary-200 rounded-lg flex items-center justify-center">
            <span className="text-xs font-bold text-primary-700">
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
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
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
        const total = newQuantity * existing.pricePerUnit;
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: newQuantity, total }
            : item
        );
      }
      const total = 1 * product.price;
      return [...prev, { 
        id: product.id,
        name: product.name,
        quantity: 1, 
        pricePerUnit: product.price,
        total
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
    
    return {
      finalTotal
    };
  }, [cart]);

  const handleCompleteClick = useCallback(() => {
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

    // Show completion popup
    setShowCompletionPopup(true);
  }, [cart, toast, inventory]);

  const handleCompleteSale = useCallback((discountAmount: number) => {
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    const finalTotal = Math.max(0, subtotal - discountAmount);

    const saleData = {
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.pricePerUnit,
        discount: 0, // Individual item discount is 0
        total: item.total
      })),
      subtotal,
      totalDiscount: discountAmount, // Overall sale discount
      finalTotal,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      status: 'completed'
    };

    onComplete(saleData);
    setShowCompletionPopup(false);
  }, [cart, onComplete]);

  return (
    <div className="flex flex-col h-full">
      {/* SEARCH BAR AT TOP */}
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

      {/* CART ITEMS - MAXIMUM SPACE */}
      <div className="flex-1 overflow-y-auto p-3 pb-20">
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
          </div>
        )}
      </div>

      {/* BUTTONS FIXED AT BOTTOM - ONLY SHOW WHEN CART HAS ITEMS */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-bottom">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-11 rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCompleteClick}
              className="flex-1 h-11 bg-primary-600 hover:bg-primary-700 rounded-full font-semibold"
            >
              Complete
            </Button>
          </div>
        </div>
      )}

      {/* Completion Popup */}
      <CompletionPopup
        isOpen={showCompletionPopup}
        onClose={() => setShowCompletionPopup(false)}
        onConfirm={handleCompleteSale}
        cart={cart}
      />
    </div>
  );
});

SalesEntryForm.displayName = "SalesEntryForm";