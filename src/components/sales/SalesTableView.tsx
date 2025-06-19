import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { EnhancedTable, Column } from "@/components/ui/enhanced-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ShoppingCart, Eye, Download } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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

export const SalesTableView = ({
  sales,
  selectedSales,
  effectiveSearch,
  onRowSelect,
  onViewSale,
  onExport,
  onAddSale
}: SalesTableViewProps) => {
  const isMobile = useIsMobile();
  
  const filteredSales = sales.filter(sale => 
    sale.item.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
    (sale.customer && sale.customer.toLowerCase().includes(effectiveSearch.toLowerCase()))
  );

  const getStatusVariant = (status: Sale["status"]) => {
    switch (status) {
      case "completed": return "success";
      case "pending": return "warning";
      case "cancelled": return "danger";
      default: return "default";
    }
  };

  const columns: Column<Sale>[] = [
    {
      key: "id",
      label: "Sale ID",
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm">#{value}</span>
      )
    },
    {
      key: "item",
      label: "Item",
      sortable: true,
      render: (value, sale) => (
        <div>
          <div className="font-medium">{value}</div>
          {sale.customer && (
            <div className="text-sm text-muted-foreground">Customer: {sale.customer}</div>
          )}
        </div>
      )
    },
    {
      key: "quantity",
      label: "Qty",
      sortable: true,
      render: (value) => (
        <span className="font-medium">{value}</span>
      )
    },
    {
      key: "price",
      label: "Total",
      sortable: true,
      render: (value) => (
        <span className="font-bold text-primary">${value.toFixed(2)}</span>
      )
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (value) => (
        <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
      )
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value) => (
        <StatusBadge variant={getStatusVariant(value)}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </StatusBadge>
      )
    },
    {
      key: "id",
      label: "Actions",
      sortable: false,
      render: (_, sale) => (
        <Button 
          variant="outline" 
          size={isMobile ? "icon-sm" : "sm"}
          className={isMobile ? "" : "gap-2"}
          onClick={(e) => {
            e.stopPropagation();
            onViewSale(sale);
          }}
        >
          <Eye className="h-4 w-4" />
          {!isMobile && <span>View</span>}
        </Button>
      )
    }
  ];

  const bulkActions = (
    <div className="flex gap-1">
      <Button 
        variant="outline" 
        size={isMobile ? "icon-sm" : "sm"}
        className={isMobile ? "" : "gap-2"}
        onClick={onExport}
      >
        <Download className="h-4 w-4" />
        {!isMobile && <span>Export Selected</span>}
      </Button>
    </div>
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Sales Records ({filteredSales.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EnhancedTable
          data={filteredSales}
          columns={columns}
          pageSize={10}
          selectedRows={selectedSales}
          onRowSelect={onRowSelect}
          bulkActions={bulkActions}
          onRowClick={onViewSale}
        />
      </CardContent>
    </Card>
  );
};
