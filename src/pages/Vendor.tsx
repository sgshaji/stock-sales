import { useState } from "react";
import { BottomTabs } from "@/components/navigation/BottomTabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search";
import { Plus, Phone, MapPin, Package, Edit, Trash2, Building2 } from "lucide-react";
import { useVendors, type Vendor } from "@/hooks/use-vendors";
import { VendorForm } from "@/components/vendors/VendorForm";

const Vendor = () => {
  const { vendors, loading, addVendor, updateVendor, deleteVendor } = useVendors();
  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVendor = async (data: any) => {
    await addVendor(data);
    setShowForm(false);
  };

  const handleEditVendor = async (data: any) => {
    if (editingVendor) {
      await updateVendor(editingVendor.id, data);
      setEditingVendor(null);
    }
  };

  const handleDeleteVendor = async (id: string) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      await deleteVendor(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (showForm || editingVendor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-brand-50/30 to-brand-100/40 dark:from-background dark:via-brand-950/30 dark:to-brand-900/40">
        <div className="container mx-auto px-4 py-6 pb-20 md:pb-6 max-w-4xl">
          <VendorForm
            vendor={editingVendor || undefined}
            onSubmit={editingVendor ? handleEditVendor : handleAddVendor}
            onCancel={() => {
              setShowForm(false);
              setEditingVendor(null);
            }}
          />
        </div>
        <BottomTabs />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brand-50/30 to-brand-100/40 dark:from-background dark:via-brand-950/30 dark:to-brand-900/40">
      <div className="container mx-auto px-4 py-6 pb-20 md:pb-6 max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-500">
              Vendors
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage your suppliers and vendors
            </p>
          </div>
          <Button size="sm" className="gap-2" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" />
            Add Vendor
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchInput
            placeholder="Search vendors..."
            onSearch={setSearchTerm}
            className="w-full"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-pulse">Loading vendors...</div>
          </div>
        )}

        {/* Empty State */}
        {!loading && vendors.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No vendors yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first vendor to manage your suppliers.
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Vendor
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Vendors List */}
        <div className="space-y-4">
          {filteredVendors.map((vendor) => (
            <Card key={vendor.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{vendor.name}</span>
                  <span className={`text-sm font-normal px-2 py-1 rounded ${getStatusColor(vendor.status)}`}>
                    {getStatusLabel(vendor.status)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {vendor.contact_person && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Contact:</span>
                      <span>{vendor.contact_person}</span>
                    </div>
                  )}
                  {vendor.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{vendor.phone}</span>
                    </div>
                  )}
                  {vendor.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Email:</span>
                      <span>{vendor.email}</span>
                    </div>
                  )}
                  {vendor.address && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{vendor.address}</span>
                    </div>
                  )}
                  {vendor.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Website:</span>
                      <a 
                        href={vendor.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {vendor.website}
                      </a>
                    </div>
                  )}
                  {vendor.notes && (
                    <div className="text-sm">
                      <span className="font-medium">Notes:</span>
                      <p className="mt-1 text-muted-foreground">{vendor.notes}</p>
                    </div>
                  )}
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingVendor(vendor)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteVendor(vendor.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                    <Button variant="outline" size="sm">
                      <Package className="h-4 w-4 mr-2" />
                      View Products
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No search results */}
        {!loading && vendors.length > 0 && filteredVendors.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                No vendors found matching "{searchTerm}"
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      <BottomTabs />
    </div>
  );
};

export default Vendor;
