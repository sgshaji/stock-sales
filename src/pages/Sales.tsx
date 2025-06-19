
import { useState, memo } from "react";
import { BottomTabs } from "@/components/navigation/BottomTabs";
import SalesEntry from "@/components/SalesEntry";
import { FloatingAction } from "@/components/ui/floating-action";
import { SalesQuickAdd } from "@/components/sales/SalesQuickAdd";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Sales = memo(() => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const isMobile = useIsMobile();

  const handleNewSale = () => {
    setShowQuickAdd(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-50/30 to-primary-100/40 dark:from-background dark:via-primary-950/30 dark:to-primary-900/40">
      <div className="container-content mx-auto px-space-4 py-space-6 pb-20 md:pb-6">
        <div className="mb-space-6 flex justify-between items-center">
          <div>
            <h1 className="text-display-medium bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent dark:from-primary-400 dark:to-primary-500">
              Sales Entry
            </h1>
            <p className="text-body-medium text-muted-foreground mt-1">
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
});

Sales.displayName = "Sales";

export default Sales;
