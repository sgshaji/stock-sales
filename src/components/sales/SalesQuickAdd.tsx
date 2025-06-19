import { memo } from "react";
import { MobileBottomSheet } from "@/components/mobile/MobileBottomSheet";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingCart } from "lucide-react";

interface SalesQuickAddProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SalesQuickAdd = memo<SalesQuickAddProps>(({ isOpen, onClose }) => {
  return (
    <MobileBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Quick Add Sale"
      className="h-[60vh]"
    >
      <div className="p-4 space-y-6">
        <div className="text-center py-8">
          <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <ShoppingCart className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Quick Sale Entry</h3>
          <p className="text-gray-500 text-sm mb-6">
            This feature is coming soon. Use the main sales entry for now.
          </p>
          <Button onClick={onClose} className="gap-2">
            <Plus className="h-4 w-4" />
            Go to Sales Entry
          </Button>
        </div>
      </div>
    </MobileBottomSheet>
  );
});

SalesQuickAdd.displayName = "SalesQuickAdd";