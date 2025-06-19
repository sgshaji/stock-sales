
import { useState } from "react";
import { ActionableInventoryDashboard } from "./ActionableInventoryDashboard";
import { IntelligentSearch } from "./IntelligentSearch";
import { FloatingActionButton } from "./FloatingActionButton";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface EnhancedInventoryManagementProps {
  searchQuery?: string;
}

export const EnhancedInventoryManagement = ({ searchQuery }: EnhancedInventoryManagementProps) => {
  const [localSearch, setLocalSearch] = useState("");
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleAddItem = () => {
    toast({
      title: "Add new item",
      description: "Opening item creation form...",
    });
  };

  const effectiveSearch = searchQuery || localSearch;

  return (
    <div className={cn(
      "min-h-screen bg-background",
      isMobile ? "pb-20" : "pb-16"
    )}>
      {/* Search - Only show if not passed from parent */}
      {!searchQuery && (
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/20">
          <div className="p-4">
            <IntelligentSearch
              placeholder="Search products, SKUs..."
              onSearch={setLocalSearch}
            />
          </div>
        </div>
      )}
      
      {/* Main Dashboard */}
      <ActionableInventoryDashboard searchQuery={effectiveSearch} />

      {/* Floating Action Button */}
      <FloatingActionButton onClick={handleAddItem} />
    </div>
  );
};

export default EnhancedInventoryManagement;
