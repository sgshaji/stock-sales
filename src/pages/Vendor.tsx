
import { BottomTabs } from "@/components/navigation/BottomTabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Phone, MapPin, Package } from "lucide-react";

const Vendor = () => {
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
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Vendor
          </Button>
        </div>

        <div className="space-y-4">
          {/* Sample Vendor Cards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>TechSupplier Co.</span>
                <span className="text-sm font-normal text-green-600 bg-green-100 px-2 py-1 rounded">Active</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>123 Tech Street, Silicon Valley, CA</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>Smartphones, Tablets, Accessories</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">View Products</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Mobile World Inc.</span>
                <span className="text-sm font-normal text-green-600 bg-green-100 px-2 py-1 rounded">Active</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>+1 (555) 987-6543</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>456 Mobile Ave, New York, NY</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>Phone Cases, Screen Protectors, Chargers</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">View Products</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>ElectroMax Ltd.</span>
                <span className="text-sm font-normal text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Pending</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>+1 (555) 456-7890</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>789 Electronics Blvd, Austin, TX</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>Laptops, Headphones, Gaming Accessories</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">View Products</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <BottomTabs />
    </div>
  );
};

export default Vendor;
