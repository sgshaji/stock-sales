
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchInput } from "@/components/ui/search";
import { EmptyState } from "@/components/ui/empty-state";
import { ShoppingCart, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SalesEntryProps {
  searchQuery?: string;
}

const SalesEntry = ({ searchQuery }: SalesEntryProps) => {
  const [localSearch, setLocalSearch] = useState("");
  const [sales] = useState([
    { id: 1, item: "Premium Headphones", quantity: 2, price: 199.98, date: "2024-01-15" },
    { id: 2, item: "Wireless Mouse", quantity: 1, price: 29.99, date: "2024-01-15" },
  ]);
  const { toast } = useToast();

  const handleAddSale = () => {
    toast({
      title: "Sale recorded",
      description: "New sale has been added successfully.",
    });
  };

  const effectiveSearch = searchQuery || localSearch;
  const filteredSales = sales.filter(sale => 
    sale.item.toLowerCase().includes(effectiveSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Sales Entry</h2>
          <p className="text-muted-foreground">Record and track your sales</p>
        </div>
        <Button onClick={handleAddSale} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Sale
        </Button>
      </div>

      {!searchQuery && (
        <SearchInput
          placeholder="Search sales..."
          onSearch={setLocalSearch}
        />
      )}

      {filteredSales.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title={effectiveSearch ? "No sales found" : "No sales recorded"}
          description={
            effectiveSearch 
              ? `No sales match "${effectiveSearch}". Try a different search term.`
              : "Start recording your first sale to track revenue."
          }
          action={{
            label: "Record First Sale",
            onClick: handleAddSale
          }}
        />
      ) : (
        <div className="space-y-4">
          {filteredSales.map((sale) => (
            <Card key={sale.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{sale.item}</h3>
                    <p className="text-sm text-muted-foreground">Quantity: {sale.quantity}</p>
                    <p className="text-sm text-muted-foreground">Date: {sale.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-primary">${sale.price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SalesEntry;
