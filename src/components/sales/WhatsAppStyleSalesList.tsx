
import { useState, memo, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TouchTarget } from "@/components/ui/mobile-touch";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { 
  ShoppingCart, 
  Eye,
  MoreVertical,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  Calendar
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Sale {
  id: number;
  item: string;
  quantity: number;
  price: number;
  date: string;
  status: "completed" | "pending" | "cancelled";
  customer?: string;
}

interface WhatsAppStyleSalesListProps {
  sales: Sale[];
  onView: (sale: Sale) => void;
  onExport: () => void;
  selectedSales: Sale[];
  onRowSelect: (sale: Sale, selected: boolean) => void;
}

const getStatusIcon = (status: Sale["status"]) => {
  switch (status) {
    case "completed":
      return { icon: CheckCircle2, color: "text-success-500", bgColor: "bg-success-500/10" };
    case "pending":
      return { icon: Clock, color: "text-warning-500", bgColor: "bg-warning-500/10" };
    case "cancelled":
      return { icon: AlertTriangle, color: "text-error-500", bgColor: "bg-error-500/10" };
    default:
      return { icon: CheckCircle2, color: "text-gray-500", bgColor: "bg-gray-500/10" };
  }
};

const getStatusColor = (status: Sale["status"]) => {
  const colors = {
    completed: "bg-success-500",
    pending: "bg-warning-500",
    cancelled: "bg-error-500",
    default: "bg-gray-500"
  };
  return colors[status] || colors.default;
};

// Memoized sale item component for better performance
const SaleItem = memo<{
  sale: Sale;
  isSelected: boolean;
  onView: (sale: Sale) => void;
  onExport: () => void;
  onRowSelect: (sale: Sale, selected: boolean) => void;
}>(({ sale, isSelected, onView, onExport, onRowSelect }) => {
  const status = useMemo(() => getStatusIcon(sale.status), [sale.status]);
  const statusColor = useMemo(() => getStatusColor(sale.status), [sale.status]);
  
  const handleView = useCallback(() => onView(sale), [onView, sale]);
  const handleRowSelect = useCallback(() => onRowSelect(sale, !isSelected), [onRowSelect, sale, isSelected]);

  return (
    <div
      className={cn(
        "flex items-center gap-space-4 p-space-4 hover:bg-accent/30 active:bg-accent/50 border-b border-border/5 transition-colors cursor-pointer group animate-smooth",
        isSelected && "bg-accent/20"
      )}
      onClick={handleView}
    >
      {/* Sale Avatar */}
      <div className="relative flex-shrink-0">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-label-medium",
          statusColor
        )}>
          #{sale.id}
        </div>
        {/* Status indicator */}
        <div className={cn(
          "absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center",
          status.bgColor
        )}>
          <status.icon className={cn("w-2.5 h-2.5", status.color)} />
        </div>
      </div>

      {/* Sale Info - Main Content */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-headline-small font-medium text-foreground leading-tight line-clamp-1 pr-2 flex-1">
            {sale.item}
          </h3>
          <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-4">
            <div className="text-title-large font-bold text-primary-600">
              ${sale.price.toFixed(2)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-body-small text-muted-foreground">
              Qty: {sale.quantity}
            </span>
            {sale.customer && (
              <>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center gap-1 text-body-small text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span className="truncate">{sale.customer}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-label-small text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{new Date(sale.date).toLocaleDateString()}</span>
          </div>
          
          {/* Quick action buttons - show on hover */}
          <div className="hidden group-hover:flex items-center gap-1 ml-2">
            <TouchTarget minHeight={32}>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(sale);
                }}
                className="h-7 w-7 rounded-full hover:bg-accent/50 button-press"
                title="View sale details"
              >
                <Eye className="h-3 w-3" />
              </Button>
            </TouchTarget>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TouchTarget minHeight={32}>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => e.stopPropagation()}
                    className="h-7 w-7 rounded-full hover:bg-accent/50 button-press"
                    title="More options"
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </TouchTarget>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-md">
                <DropdownMenuItem onClick={handleView} className="gap-2">
                  <Eye className="h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onExport} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Sale
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleRowSelect} className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {isSelected ? 'Deselect' : 'Select'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
});

SaleItem.displayName = "SaleItem";

export const WhatsAppStyleSalesList = memo<WhatsAppStyleSalesListProps>(({ 
  sales, 
  onView, 
  onExport,
  selectedSales,
  onRowSelect
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Sales List - Full height */}
      <div className="flex-1 overflow-y-auto scroll-smooth">
        {sales.map((sale) => {
          const isSelected = selectedSales.some(s => s.id === sale.id);
          
          return (
            <SaleItem
              key={sale.id}
              sale={sale}
              isSelected={isSelected}
              onView={onView}
              onExport={onExport}
              onRowSelect={onRowSelect}
            />
          );
        })}
      </div>
    </div>
  );
});

WhatsAppStyleSalesList.displayName = "WhatsAppStyleSalesList";
