
import { useState } from "react";
import { BottomTabs } from "@/components/navigation/BottomTabs";
import SalesEntry from "@/components/SalesEntry";
import { FloatingAction } from "@/components/ui/floating-action";
import { SalesQuickAdd } from "@/components/sales/SalesQuickAdd";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Sales = () => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const isMobile = useIsMobile();

  const handleNewSale = () => {
    setShowQuickAdd(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brand-50/30 to-brand-100/40 dark:from-background dark:via-brand-950/30 dark:to-brand-900/40">
      <div className="container-content mx-auto px-space-4 py-space-6 pb-20 md:pb-6">
        <div className="mb-space-6 flex justify-between items-center">
          <div>
            <h1 className="text-display-medium bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-500">
              Sales Entry
            </h1>
            <p className="text-muted-foreground mt-1">
              Record and manage your sales transactions
            </p>
          </div>
          {!isMobile && (
            <Button onClick={handleNewSale} size="icon" title="Add sale">
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
        <SalesEntry />
      </div>
      {isMobile && <FloatingAction variant="sale" onClick={handleNewSale} />}
      <SalesQuickAdd 
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
      />
      <BottomTabs />
    </div>
  );
};

export default Sales;
