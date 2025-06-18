
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Phone, Mail, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  items: string[];
  notes: string;
}

const VendorManagement = () => {
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: "1",
      name: "Tech Solutions Ltd",
      contactPerson: "John Smith",
      email: "john@techsolutions.com",
      phone: "+1 (555) 123-4567",
      address: "123 Tech Street, Silicon Valley, CA 94000",
      items: ["Bluetooth Speakers", "Wireless Mouse", "USB Cables"],
      notes: "Reliable supplier with good prices on electronics. 30-day payment terms."
    },
    {
      id: "2",
      name: "Mobile Accessories Co",
      contactPerson: "Sarah Johnson",
      email: "sarah@mobileacc.com",
      phone: "+1 (555) 987-6543",
      address: "456 Commerce Ave, New York, NY 10001",
      items: ["Phone Cases", "Screen Protectors", "Chargers"],
      notes: "Fast shipping, excellent quality phone accessories."
    }
  ]);

  const [newVendor, setNewVendor] = useState<Partial<Vendor>>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddVendor = () => {
    if (newVendor.name && newVendor.contactPerson && newVendor.email) {
      const vendor: Vendor = {
        id: Date.now().toString(),
        name: newVendor.name,
        contactPerson: newVendor.contactPerson,
        email: newVendor.email,
        phone: newVendor.phone || "",
        address: newVendor.address || "",
        items: newVendor.items || [],
        notes: newVendor.notes || ""
      };
      setVendors([...vendors, vendor]);
      setNewVendor({});
      setIsAddDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Vendor Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="vendor-name">Company Name</Label>
                <Input
                  id="vendor-name"
                  placeholder="Enter company name"
                  value={newVendor.name || ""}
                  onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="contact-person">Contact Person</Label>
                <Input
                  id="contact-person"
                  placeholder="Enter contact person name"
                  value={newVendor.contactPerson || ""}
                  onChange={(e) => setNewVendor({...newVendor, contactPerson: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={newVendor.email || ""}
                  onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={newVendor.phone || ""}
                  onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter full address"
                  value={newVendor.address || ""}
                  onChange={(e) => setNewVendor({...newVendor, address: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="items">Items Supplied</Label>
                <Input
                  id="items"
                  placeholder="e.g., Electronics, Phone Cases (comma separated)"
                  value={Array.isArray(newVendor.items) ? newVendor.items.join(", ") : ""}
                  onChange={(e) => setNewVendor({...newVendor, items: e.target.value.split(",").map(item => item.trim()).filter(item => item)})}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes about this vendor"
                  value={newVendor.notes || ""}
                  onChange={(e) => setNewVendor({...newVendor, notes: e.target.value})}
                />
              </div>
              <Button onClick={handleAddVendor} className="w-full">
                Add Vendor
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {vendors.map((vendor) => (
          <Card key={vendor.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-sm">{vendor.name}</h3>
                  <p className="text-xs text-gray-600">{vendor.contactPerson}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Mail className="h-3 w-3 text-gray-500" />
                  <span>{vendor.email}</span>
                </div>
                {vendor.phone && (
                  <div className="flex items-center gap-2 text-xs">
                    <Phone className="h-3 w-3 text-gray-500" />
                    <span>{vendor.phone}</span>
                  </div>
                )}
                {vendor.address && (
                  <div className="flex items-start gap-2 text-xs">
                    <MapPin className="h-3 w-3 text-gray-500 mt-0.5" />
                    <span className="leading-relaxed">{vendor.address}</span>
                  </div>
                )}
              </div>

              {vendor.items.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">Items Supplied:</p>
                  <div className="flex flex-wrap gap-1">
                    {vendor.items.map((item, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {vendor.notes && (
                <div className="mt-3 p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-700">{vendor.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VendorManagement;
