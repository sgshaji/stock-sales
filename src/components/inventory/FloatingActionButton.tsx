
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onClick: () => void;
  loading?: boolean;
  className?: string;
}

export const FloatingActionButton = ({ onClick, loading, className }: FloatingActionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      loading={loading}
      size="lg"
      className={cn(
        "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50",
        "bg-primary-600 hover:bg-primary-700 text-white",
        "animate-scale-in",
        className
      )}
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};
