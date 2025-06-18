
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { EnhancedTable, Column } from "@/components/ui/enhanced-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Users, Plus, Trash2, Edit, Phone, Mail, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Vendor {
  id: number;
  name: string;
  contact: string;
  phone: string;
  status: "active" | "inactive";
  orders: number;
  lastOrder?: string;
}

interface VendorManagementProps {
  searchQuery?: string;
}

const VendorManagement = ({ searchQuery }: VendorManagementProps) => {
  const [localSearch, setLocalSearch] = useState("");
  const [selectedVendors, setSelectedVendors] = useState<Vendor[]>([]);
  const [vendors] = useState<Vendor[]>([
    { id: 1, name: "TechSupply Co.", contact: "john@techsupply.com", phone: "+1-555-0123", status: "active", orders: 15, lastOrder: "2024-01-10" },
    { id: 2, name: "Electronic Parts LLC", contact: "sales@electronicparts.com", phone: "+1-555-0456", status: "active", orders: 8, lastOrder: "2024-01-08" },
    { id: 3, name: "Global Components", contact: "info@globalcomp.com", phone: "+1-555-0789", status: "inactive", orders: 3, lastOrder: "2023-12-15" },
    { id: 4, name: "Premium Audio Supplies", contact: "orders@premiumaudio.com", phone: "+1-555-0321", status: "active", orders: 22, lastOrder: "2024-01-12" },
  ]);
  const { toast } = useToast();

  const handleDelete = (vendorName: string) => {
    toast({
      title: "Vendor deleted",
      description: `${vendorName} has been removed from your vendors.`,
    });
  };

  const handleBulkDelete = () => {
    toast({
      title: "Vendors deleted",
      description: `${selectedVendors.length} vendors have been removed.`,
    });
    setSelectedVendors([]);
  };

  const handleAddVendor = () => {
    toast({
      title: "Add new vendor",
      description: "Opening vendor creation form...",
    });
  };

  const handleEditVendor = (vendor: Vendor) => {
    toast({
      title: "Edit vendor",
      description: `Opening edit form for ${vendor.name}...`,
    });
  };

  const handleExport = () => {
    toast({
      title: "Export started",
      description: "Your vendor data is being exported...",
    });
  };

  const effectiveSearch = searchQuery || localSearch;
  const filteredVendors = vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
    vendor.contact.toLowerCase().includes(effectiveSearch.toLowerCase())
  );

  const getStatusVariant = (status: Vendor["status"]) => {
    return status === "active" ? "success" : "default";
  };

  const handleRowSelect = (vendor: Vendor, selected: boolean) => {
    if (selected) {
      setSelectedVendors(prev => [...prev, vendor]);
    } else {
      setSelectedVendors(prev => prev.filter(v => v.id !== vendor.id));
    }
  };

  const columns: Column<Vendor>[] = [
    {
      key: "name",
      label: "Vendor Name",
      sortable: true,
      render: (value, vendor) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <StatusBadge variant={getStatusVariant(vendor.status)}>
              {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
            </StatusBadge>
          </div>
        </div>
      )
    },
    {
      key: "contact",
      label: "Contact Info",
      sortable: true,
      render: (value, vendor) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-3 w-3" />
            <span>{value}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span>{vendor.phone}</span>
          </div>
        </div>
      )
    },
    {
      key: "orders",
      label: "Orders",
      sortable: true,
      render: (value, vendor) => (
        <div>
          <div className="font-medium">{value} orders</div>
          {vendor.lastOrder && (
            <div className="text-sm text-muted-foreground">
              Last: {new Date(vendor.lastOrder).toLocaleDateString()}
            </div>
          )}
        </div>
      )
    },
    {
      key: "id",
      label: "Actions",
      sortable: false,
      render: (_, vendor) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => handleEditVendor(vendor)}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <ConfirmationDialog
            title="Delete Vendor"
            description={`Are you sure you want to delete "${vendor.name}"? This action cannot be undone.`}
            confirmText="Delete"
            variant="destructive"
            onConfirm={() => handleDelete(vendor.name)}
          >
            <Button variant="outline" size="sm" className="gap-2 text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </ConfirmationDialog>
        </div>
      )
    }
  ];

  const bulkActions = (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
        <Download className="h-4 w-4" />
        Export Selected
      </Button>
      <ConfirmationDialog
        title="Delete Selected Vendors"
        description={`Are you sure you want to delete ${selectedVendors.length} selected vendors? This action cannot be undone.`}
        confirmText="Delete All"
        variant="destructive"
        onConfirm={handleBulkDelete}
      >
        <Button variant="destructive" size="sm" className="gap-2">
          <Trash2 className="h-4 w-4" />
          Delete Selected
        </Button>
      </ConfirmationDialog>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Vendor Management</h2>
          <p className="text-muted-foreground">Manage your supplier relationships</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleAddVendor} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Vendor
          </Button>
        </div>
      </div>

      {!searchQuery && (
        <SearchInput
          placeholder="Search vendors..."
          onSearch={setLocalSearch}
        />
      )}

      {filteredVendors.length === 0 ? (
        <EmptyState
          icon={Users}
          title={effectiveSearch ? "No vendors found" : "No vendors added"}
          description={
            effectiveSearch 
              ? `No vendors match "${effectiveSearch}". Try a different search term.`
              : "Start by adding your first vendor to manage supplier relationships."
          }
          action={{
            label: "Add First Vendor",
            onClick: handleAddVendor
          }}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Vendors ({filteredVendors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EnhancedTable
              data={filteredVendors}
              columns={columns}
              pageSize={10}
              selectedRows={selectedVendors}
              onRowSelect={handleRowSelect}
              bulkActions={bulkActions}
              onRowClick={handleEditVendor}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VendorManagement;
