
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Users, Plus, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VendorManagementProps {
  searchQuery?: string;
}

const VendorManagement = ({ searchQuery }: VendorManagementProps) => {
  const [localSearch, setLocalSearch] = useState("");
  const [vendors] = useState([
    { id: 1, name: "TechSupply Co.", contact: "john@techsupply.com", phone: "+1-555-0123" },
    { id: 2, name: "Electronic Parts LLC", contact: "sales@electronicparts.com", phone: "+1-555-0456" },
  ]);
  const { toast } = useToast();

  const handleDelete = (vendorName: string) => {
    toast({
      title: "Vendor deleted",
      description: `${vendorName} has been removed from your vendors.`,
    });
  };

  const handleAddVendor = () => {
    toast({
      title: "Add new vendor",
      description: "Opening vendor creation form...",
    });
  };

  const effectiveSearch = searchQuery || localSearch;
  const filteredVendors = vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
    vendor.contact.toLowerCase().includes(effectiveSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Vendor Management</h2>
          <p className="text-muted-foreground">Manage your supplier relationships</p>
        </div>
        <Button onClick={handleAddVendor} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Vendor
        </Button>
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
        <div className="space-y-4">
          {filteredVendors.map((vendor) => (
            <Card key={vendor.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="font-semibold">{vendor.name}</h3>
                    <p className="text-sm text-muted-foreground">{vendor.contact}</p>
                    <p className="text-sm text-muted-foreground">{vendor.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorManagement;
