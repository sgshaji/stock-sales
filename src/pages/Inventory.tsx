
import { BottomTabs } from "@/components/navigation/BottomTabs";
import InventoryManagement from "@/components/inventory/InventoryManagement";
import { FloatingAction } from "@/components/ui/floating-action";
import { useToast } from "@/hooks/use-toast";

const Inventory = () => {
  const { toast } = useToast();

  const handleAddStock = () => {
    toast({
      title: "Add Stock",
      description: "Opening stock addition form...",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brand-50/30 to-brand-100/40 dark:from-background dark:via-brand-950/30 dark:to-brand-900/40">
      <div className="container-content mx-auto px-space-4 py-space-6 pb-20 md:pb-6">
        <div className="mb-space-6">
          <h1 className="text-display-medium bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-500">
            Inventory Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your stock levels
          </p>
        </div>
        <InventoryManagement />
      </div>
      <FloatingAction variant="stock" onClick={handleAddStock} />
      <BottomTabs />
    </div>
  );
};

export default Inventory;
