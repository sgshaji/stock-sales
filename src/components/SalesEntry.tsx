
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { SalesFilters } from "./sales/SalesFilters";
import { SalesSelectionSummary } from "./sales/SalesSelectionSummary";
import { SalesTableView } from "./sales/SalesTableView";
import { SalesQuickAdd } from "./sales/SalesQuickAdd";

interface Sale {
  id: number;
  item: string;
  quantity: number;
  price: number;
  date: string;
  status: "completed" | "pending" | "cancelled";
  customer?: string;
}

interface SalesEntryProps {
  searchQuery?: string;
}

const SalesEntry = ({ searchQuery }: SalesEntryProps) => {
  const [localSearch, setLocalSearch] = useState("");
  const [selectedSales, setSelectedSales] = useState<Sale[]>([]);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [sales] = useState<Sale[]>([
    { id: 1, item: "Premium Headphones", quantity: 2, price: 199.98, date: "2024-01-15", status: "completed", customer: "John Doe" },
    { id: 2, item: "Wireless Mouse", quantity: 1, price: 29.99, date: "2024-01-15", status: "completed", customer: "Jane Smith" },
    { id: 3, item: "Bluetooth Speaker", quantity: 3, price: 137.97, date: "2024-01-14", status: "pending", customer: "Bob Wilson" },
    { id: 4, item: "USB Cable", quantity: 5, price: 44.95, date: "2024-01-14", status: "completed" },
    { id: 5, item: "Phone Case", quantity: 2, price: 25.98, date: "2024-01-13", status: "cancelled", customer: "Alice Brown" },
  ]);
  const { toast } = useToast();

  const handleAddSale = () => {
    setShowQuickAdd(true);
  };

  const handleViewSale = (sale: Sale) => {
    toast({
      title: "View Sale",
      description: `Opening details for sale #${sale.id}`,
    });
  };

  const handleExport = () => {
    toast({
      title: "Export started",
      description: "Your sales data is being exported...",
    });
  };

  const handleRowSelect = (sale: Sale, selected: boolean) => {
    if (selected) {
      setSelectedSales(prev => [...prev, sale]);
    } else {
      setSelectedSales(prev => prev.filter(s => s.id !== sale.id));
    }
  };

  const effectiveSearch = searchQuery || localSearch;

  return (
    <div className="space-y-6 animate-fade-in">
      <SalesFilters 
        searchQuery={searchQuery}
        onSearch={setLocalSearch}
      />

      <SalesSelectionSummary selectedSales={selectedSales} />

      <SalesTableView
        sales={sales}
        selectedSales={selectedSales}
        effectiveSearch={effectiveSearch}
        onRowSelect={handleRowSelect}
        onViewSale={handleViewSale}
        onExport={handleExport}
        onAddSale={handleAddSale}
      />

      <SalesQuickAdd 
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
      />
    </div>
  );
};

export default SalesEntry;
