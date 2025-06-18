
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search";
import { EmptyState } from "@/components/ui/empty-state";
import { EnhancedTable, Column } from "@/components/ui/enhanced-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ShoppingCart, Plus, Eye, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [sales] = useState<Sale[]>([
    { id: 1, item: "Premium Headphones", quantity: 2, price: 199.98, date: "2024-01-15", status: "completed", customer: "John Doe" },
    { id: 2, item: "Wireless Mouse", quantity: 1, price: 29.99, date: "2024-01-15", status: "completed", customer: "Jane Smith" },
    { id: 3, item: "Bluetooth Speaker", quantity: 3, price: 137.97, date: "2024-01-14", status: "pending", customer: "Bob Wilson" },
    { id: 4, item: "USB Cable", quantity: 5, price: 44.95, date: "2024-01-14", status: "completed" },
    { id: 5, item: "Phone Case", quantity: 2, price: 25.98, date: "2024-01-13", status: "cancelled", customer: "Alice Brown" },
  ]);
  const { toast } = useToast();

  const handleAddSale = () => {
    toast({
      title: "Sale recorded",
      description: "New sale has been added successfully.",
    });
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

  const effectiveSearch = searchQuery || localSearch;
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

  const handleRowSelect = (sale: Sale, selected: boolean) => {
    if (selected) {
      setSelectedSales(prev => [...prev, sale]);
    } else {
      setSelectedSales(prev => prev.filter(s => s.id !== sale.id));
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
          size="sm" 
          className="gap-2"
          onClick={(e) => {
            e.stopPropagation();
            handleViewSale(sale);
          }}
        >
          <Eye className="h-4 w-4" />
          View
        </Button>
      )
    }
  ];

  const bulkActions = (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
        <Download className="h-4 w-4" />
        Export Selected
      </Button>
    </div>
  );

  // Calculate totals for selected sales
  const selectedTotal = selectedSales.reduce((sum, sale) => sum + sale.price, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Sales Entry</h2>
          <p className="text-muted-foreground">Record and track your sales</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleAddSale} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Sale
          </Button>
        </div>
      </div>

      {!searchQuery && (
        <SearchInput
          placeholder="Search sales..."
          onSearch={setLocalSearch}
        />
      )}

      {selectedSales.length > 0 && (
        <Card className="bg-primary-50 border-primary-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {selectedSales.length} sale{selectedSales.length !== 1 ? 's' : ''} selected
              </span>
              <span className="font-bold text-primary">
                Total: ${selectedTotal.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
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
              onRowSelect={handleRowSelect}
              bulkActions={bulkActions}
              onRowClick={handleViewSale}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SalesEntry;
