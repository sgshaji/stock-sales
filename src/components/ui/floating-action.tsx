
import { Plus, ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingActionProps {
  variant: "sale" | "stock";
  onClick?: () => void;
  className?: string;
}

export const FloatingAction = ({ variant, onClick, className }: FloatingActionProps) => {
  const config = {
    sale: {
      icon: ShoppingCart,
      label: "New Sale",
      bgColor: "bg-brand-600 hover:bg-brand-700",
    },
    stock: {
      icon: Package,
      label: "Add Stock",
      bgColor: "bg-success-600 hover:bg-success-700",
    },
  };

  const { icon: Icon, label, bgColor } = config[variant];

  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full shadow-lg transition-all duration-200 hover:scale-105 md:bottom-6",
        bgColor,
        "text-white border-0 font-semibold",
        className
      )}
      size="icon"
    >
      <div className="flex flex-col items-center justify-center">
        <Plus className="h-5 w-5 mb-0.5" />
        <Icon className="h-3 w-3 opacity-80" />
      </div>
      <span className="sr-only">{label}</span>
    </Button>
  );
};
