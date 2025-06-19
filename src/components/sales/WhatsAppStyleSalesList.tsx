
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TouchTarget } from "@/components/ui/mobile-touch";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { SearchInput } from "@/components/ui/search";
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
  searchQuery?: string;
  onSearch?: (query: string) => void;
  selectedSales: Sale[];
  onRowSelect: (sale: Sale, selected: boolean) => void;
}

const getStatusIcon = (status: Sale["status"]) => {
  switch (status) {
    case "completed":
      return { icon: CheckCircle2, color: "text-green-500", bgColor: "bg-green-500/10" };
    case "pending":
      return { icon: Clock, color: "text-amber-500", bgColor: "bg-amber-500/10" };
    case "cancelled":
      return { icon: AlertTriangle, color: "text-red-500", bgColor: "bg-red-500/10" };
    default:
      return { icon: CheckCircle2, color: "text-gray-500", bgColor: "bg-gray-500/10" };
  }
};

const getStatusColor = (status: Sale["status"]) => {
  const colors = {
    completed: "bg-green-500",
    pending: "bg-amber-500",
    cancelled: "bg-red-500",
    default: "bg-gray-500"
  };
  return colors[status] || colors.default;
};

export const WhatsAppStyleSalesList = ({ 
  sales, 
  onView, 
  onExport,
  searchQuery,
  onSearch,
  selectedSales,
  onRowSelect
}: WhatsAppStyleSalesListProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header with Search */}
      <div className="p-4 border-b border-border/10 bg-background/95 backdrop-blur-md sticky top-0 z-10">
        <SearchInput
          placeholder="Search sales records..."
          onSearch={onSearch}
          className="bg-accent/30 border-0 rounded-full pl-12 h-12 text-sm"
        />
      </div>

      {/* Filter Tabs (WhatsApp style) - Scrollable on mobile */}
      <div className="border-b border-border/5">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-1 px-4 py-2 w-max">
            <Badge variant="secondary" className="rounded-full px-4 py-1 bg-primary text-primary-foreground flex-shrink-0">
              All
            </Badge>
            <Badge variant="outline" className="rounded-full px-4 py-1 bg-transparent flex-shrink-0">
              Completed
            </Badge>
            <Badge variant="outline" className="rounded-full px-4 py-1 bg-transparent flex-shrink-0">
              Pending
            </Badge>
            <Badge variant="outline" className="rounded-full px-4 py-1 bg-transparent flex-shrink-0">
              Today
            </Badge>
            <Badge variant="outline" className="rounded-full px-4 py-1 bg-transparent flex-shrink-0">
              This Week
            </Badge>
            <Badge variant="outline" className="rounded-full px-4 py-1 bg-transparent flex-shrink-0">
              High Value
            </Badge>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Sales List */}
      <div className="flex-1 overflow-y-auto">
        {sales.map((sale, index) => {
          const status = getStatusIcon(sale.status);
          const statusColor = getStatusColor(sale.status);
          const isSelected = selectedSales.some(s => s.id === sale.id);
          
          return (
            <div
              key={sale.id}
              className={cn(
                "flex items-center gap-4 p-4 hover:bg-accent/30 active:bg-accent/50 border-b border-border/5 transition-colors cursor-pointer group",
                isSelected && "bg-accent/20"
              )}
              onClick={() => onView(sale)}
            >
              {/* Sale Avatar */}
              <div className="relative flex-shrink-0">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm",
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
                  <h3 className="font-medium text-foreground text-base leading-tight line-clamp-1 pr-2 flex-1">
                    {sale.item}
                  </h3>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-4">
                    <div className="text-lg font-bold text-primary">
                      ${sale.price.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-sm text-muted-foreground">
                      Qty: {sale.quantity}
                    </span>
                    {sale.customer && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span className="truncate">{sale.customer}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
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
                        className="h-7 w-7 rounded-full hover:bg-accent/50"
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
                            className="h-7 w-7 rounded-full hover:bg-accent/50"
                            title="More options"
                          >
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </TouchTarget>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => onView(sale)} className="gap-2">
                          <Eye className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onExport()} className="gap-2">
                          <Download className="h-4 w-4" />
                          Export Sale
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onRowSelect(sale, !isSelected)} 
                          className="gap-2"
                        >
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
        })}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-20">
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg bg-green-500 hover:bg-green-600 text-white"
          title="Export sales"
          onClick={onExport}
        >
          <Download className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};
