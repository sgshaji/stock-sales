
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TouchTarget } from "@/components/ui/mobile-touch";
import { ShoppingCart, Users, BarChart3, User, Package } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const TabNavigation = () => {
  const isMobile = useIsMobile();

  const tabs = [
    { value: "dashboard", icon: BarChart3, label: "Dashboard" },
    { value: "sales", icon: ShoppingCart, label: "Sales" },
    { value: "inventory", icon: Package, label: "Inventory" },
    { value: "vendors", icon: Users, label: "Vendors" },
    { value: "profile", icon: User, label: "Profile" }
  ];

  return (
    <TabsList className={cn(
      "w-full bg-background/95 backdrop-blur-sm shadow-lg border border-border/40 rounded-2xl p-space-2 h-auto",
      isMobile 
        ? "hidden" 
        : "grid grid-cols-5 mb-space-8"
    )}>
      {tabs.map((tab) => (
        <TouchTarget key={tab.value} minHeight={isMobile ? 56 : 64}>
          <TabsTrigger 
            value={tab.value}
            className={cn(
              "flex flex-col gap-space-2 rounded-xl animate-quick data-[state=active]:bg-brand-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-brand-50 dark:data-[state=active]:bg-brand-600 dark:hover:bg-brand-950/20 font-medium w-full",
              isMobile ? "py-space-2 px-space-2" : "py-space-4 px-space-3"
            )}
          >
            <tab.icon className={cn(
              isMobile ? "h-4 w-4" : "h-5 w-5"
            )} />
            <span className={cn(
              "font-medium",
              isMobile ? "text-label-small leading-tight" : "text-label-medium"
            )}>
              {isMobile ? tab.label.split(' ')[0] : tab.label}
            </span>
          </TabsTrigger>
        </TouchTarget>
      ))}
    </TabsList>
  );
};
