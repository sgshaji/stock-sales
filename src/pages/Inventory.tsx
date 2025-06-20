
import { BottomTabs } from "@/components/navigation/BottomTabs";
import { InventoryManagement } from "@/components/inventory/InventoryManagement";

const Inventory = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brand-50/30 to-brand-100/40 dark:from-background dark:via-brand-950/30 dark:to-brand-900/40">
      <div className="container mx-auto px-4 py-6 pb-20 md:pb-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-500">
            Inventory
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your products and track stock levels
          </p>
        </div>
        <InventoryManagement />
      </div>
      <BottomTabs />
    </div>
  );
};

export default Inventory;
