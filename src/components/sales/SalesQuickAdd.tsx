
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Search, Scan, Minus, Plus, ShoppingCart, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SaleItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  barcode?: string;
}

interface SalesQuickAddProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SalesQuickAdd = ({ isOpen, onClose }: SalesQuickAddProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [basket, setBasket] = useState<SaleItem[]>([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [scanMode, setScanMode] = useState<boolean>(true);
  const { toast } = useToast();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Mock product data - in real app this would come from your inventory
  const mockProducts = [
    { id: "1", name: "Premium Headphones", price: 99.99, barcode: "123456789" },
    { id: "2", name: "Wireless Mouse", price: 29.99, barcode: "987654321" },
    { id: "3", name: "Bluetooth Speaker", price: 45.99, barcode: "456789123" },
    { id: "4", name: "USB Cable", price: 8.99, barcode: "789123456" },
    { id: "5", name: "Phone Case", price: 12.99, barcode: "321654987" },
  ];

  // Auto-focus barcode scanner when modal opens
  useEffect(() => {
    if (isOpen) {
      if (scanMode && barcodeInputRef.current) {
        barcodeInputRef.current.focus();
      } else if (!scanMode && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }
  }, [isOpen, scanMode]);

  // Listen for online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleBarcodeSearch = (barcode: string) => {
    const product = mockProducts.find(p => p.barcode === barcode);
    if (product) {
      addToBasket(product);
      setSearchQuery("");
    } else {
      toast({
        title: "Product not found",
        description: "No product found with this barcode",
        variant: "destructive",
      });
    }
  };

  const handleTextSearch = () => {
    const results = mockProducts.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (results.length === 1) {
      addToBasket(results[0]);
      setSearchQuery("");
    } else if (results.length > 1) {
      toast({
        title: "Multiple matches",
        description: "Please be more specific in your search",
      });
    } else {
      toast({
        title: "No matches",
        description: "No products found matching your search",
        variant: "destructive",
      });
    }
  };

  const addToBasket = (product: { id: string; name: string; price: number; barcode?: string }) => {
    setBasket(prev => {
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
    setBasket(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as SaleItem[];
    });
  };

  const getSubtotal = () => {
    return basket.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleRecordSale = () => {
    if (basket.length === 0) {
      toast({
        title: "Empty basket",
        description: "Please add items to your basket first",
        variant: "destructive",
      });
      return;
    }

    if (isOffline) {
      toast({
        title: "Saved locally – syncing",
        description: "Sale recorded offline and will sync when connection is restored",
      });
    } else {
      toast({
        title: "Sale recorded",
        description: `Successfully recorded sale of $${getSubtotal().toFixed(2)}`,
      });
    }

    // Reset basket and close modal
    setBasket([]);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent, isBarcode: boolean) => {
    if (e.key === 'Enter') {
      if (isBarcode) {
        handleBarcodeSearch(searchQuery);
      } else {
        handleTextSearch();
      }
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] md:h-[80vh]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Quick Sale
            {isOffline && (
              <Badge variant="secondary" className="bg-warning-50 text-warning-700 border-warning-200">
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 flex flex-col gap-4 mt-4">
          {/* Scanner/Search Toggle */}
          <div className="flex gap-2">
            <Button
              variant={scanMode ? "default" : "outline"}
              size="sm"
              onClick={() => setScanMode(true)}
              className="flex-1"
            >
              <Scan className="h-4 w-4 mr-2" />
              Scan
            </Button>
            <Button
              variant={!scanMode ? "default" : "outline"}
              size="sm"
              onClick={() => setScanMode(false)}
              className="flex-1"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Input Section */}
          <div className="space-y-2">
            <Label htmlFor={scanMode ? "barcode" : "search"}>
              {scanMode ? "Barcode Scanner" : "Product Search"}
            </Label>
            <div className="flex gap-2">
              <Input
                ref={scanMode ? barcodeInputRef : searchInputRef}
                id={scanMode ? "barcode" : "search"}
                placeholder={scanMode ? "Scan or enter barcode..." : "Search products..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, scanMode)}
                inputMode={scanMode ? "decimal" : "text"}
                className="flex-1"
              />
              <Button
                onClick={scanMode ? () => handleBarcodeSearch(searchQuery) : handleTextSearch}
                disabled={!searchQuery.trim()}
              >
                {scanMode ? <Scan className="h-4 w-4" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Basket */}
          <div className="flex-1 space-y-4">
            <Label>Basket ({basket.length} {basket.length === 1 ? 'item' : 'items'})</Label>
            
            {basket.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">Your basket is empty</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {basket.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <span className="w-16 text-right font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Basket Strip */}
          <Card className="bg-brand-50 border-brand-200 dark:bg-brand-950/50 dark:border-brand-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold">Subtotal:</span>
                <span className="text-xl font-bold text-brand-600 dark:text-brand-400">
                  ${getSubtotal().toFixed(2)}
                </span>
              </div>
              <Button
                onClick={handleRecordSale}
                disabled={basket.length === 0}
                className="w-full"
                size="lg"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Record Sale
              </Button>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};
