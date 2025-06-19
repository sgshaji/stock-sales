
import { memo, useMemo } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { WhatsAppStyleSalesList } from "./WhatsAppStyleSalesList";
import { ShoppingCart } from "lucide-react";

interface Sale {
  id: number;
  item: string;
  quantity: number;
  price: number;
  date: string;
  status: "completed" | "pending" | "cancelled";
  customer?: string;
}

interface SalesTableViewProps {
  sales: Sale[];
  selectedSales: Sale[];
  effectiveSearch: string;
  onRowSelect: (sale: Sale, selected: boolean) => void;
  onViewSale: (sale: Sale) => void;
  onExport: () => void;
  onAddSale: () => void;
}

export const SalesTableView = memo<SalesTableViewProps>(({
  sales,
  selectedSales,
  effectiveSearch,
  onRowSelect,
  onViewSale,
  onExport,
  onAddSale
}) => {
  const filteredSales = useMemo(() => 
    sales.filter(sale => 
      sale.item.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      (sale.customer && sale.customer.toLowerCase().includes(effectiveSearch.toLowerCase()))
    ), [sales, effectiveSearch]
  );

  if (filteredSales.length === 0) {
    return (
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
          onClick: onAddSale
        }}
      />
    );
  }

  return (
    <div className="h-[600px] rounded-xl border border-border/20 overflow-hidden card-elevated">
      <WhatsAppStyleSalesList
        sales={filteredSales}
        onView={onViewSale}
        onExport={onExport}
        selectedSales={selectedSales}
        onRowSelect={onRowSelect}
      />
    </div>
  );
});

SalesTableView.displayName = "SalesTableView";
