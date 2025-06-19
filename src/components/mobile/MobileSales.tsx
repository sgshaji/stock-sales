import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  User
} from "lucide-react";
import { MobileBottomSheet } from "./MobileBottomSheet";
import { MobileSalesForm } from "./MobileSalesForm";

const mockSales = [
  { id: 1, item: "Premium Headphones", quantity: 2, price: 199.98, date: "2024-01-15", status: "completed", customer: "John Doe" },
  { id: 2, item: "Wireless Mouse", quantity: 1, price: 29.99, date: "2024-01-15", status: "completed", customer: "Jane Smith" },
  { id: 3, item: "Bluetooth Speaker", quantity: 3, price: 137.97, date: "2024-01-14", status: "pending", customer: "Bob Wilson" },
  { id: 4, item: "USB Cable", quantity: 5, price: 44.95, date: "2024-01-14", status: "completed" },
  { id: 5, item: "Phone Case", quantity: 2, price: 25.98, date: "2024-01-13", status: "cancelled", customer: "Alice Brown" },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return { icon: CheckCircle2, color: "text-green-500", bgColor: "bg-green-500" };
    case "pending":
      return { icon: Clock, color: "text-yellow-500", bgColor: "bg-yellow-500" };
    case "cancelled":
      return { icon: AlertTriangle, color: "text-red-500", bgColor: "bg-red-500" };
    default:
      return { icon: CheckCircle2, color: "text-gray-500", bgColor: "bg-gray-500" };
  }
};

export const MobileSales = () => {
  const [showNewSale, setShowNewSale] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header Actions */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowSearch(!showSearch)}
            className="h-10 w-10 rounded-full"
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setShowNewSale(true)}
            className="flex-1 h-10 bg-primary-600 hover:bg-primary-700 rounded-full gap-2"
          >
            <Plus className="h-4 w-4" />
            New Sale
          </Button>
        </div>

        {showSearch && (
          <div className="mt-3">
            <input
              type="search"
              placeholder="Search sales..."
              className="w-full h-10 px-4 bg-gray-100 rounded-full border-0 focus:ring-2 focus:ring-primary-500 focus:bg-white"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Sales List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {mockSales.map((sale) => {
          const status = getStatusIcon(sale.status);
          
          return (
            <Card key={sale.id} className="bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {/* Sale Avatar */}
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${status.bgColor}`}>
                      #{sale.id}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <status.icon className={`w-2.5 h-2.5 ${status.color}`} />
                    </div>
                  </div>

                  {/* Sale Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{sale.item}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">Qty: {sale.quantity}</span>
                      {sale.customer && (
                        <>
                          <span className="text-gray-300">•</span>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-500 truncate">{sale.customer}</span>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{new Date(sale.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary-600">
                      ${sale.price.toFixed(2)}
                    </div>
                    <Badge 
                      variant={sale.status === 'completed' ? 'success' : sale.status === 'pending' ? 'warning' : 'destructive'}
                      className="text-xs"
                    >
                      {sale.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* New Sale Bottom Sheet */}
      <MobileBottomSheet
        isOpen={showNewSale}
        onClose={() => setShowNewSale(false)}
        title="New Sale"
      >
        <MobileSalesForm onClose={() => setShowNewSale(false)} />
      </MobileBottomSheet>
    </div>
  );
};