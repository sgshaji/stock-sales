import { BarChart3, ShoppingCart, Package, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "dashboard", label: "Home", icon: BarChart3 },
  { id: "sales", label: "Sales", icon: ShoppingCart },
  { id: "inventory", label: "Stock", icon: Package },
  { id: "profile", label: "Profile", icon: User }
];

export const MobileBottomNav = ({ activeTab, onTabChange }: MobileBottomNavProps) => {
  return (
    <nav className="bg-white border-t border-gray-200 px-2 py-2 safe-bottom">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 rounded-xl transition-all duration-200",
                isActive 
                  ? "text-primary-600 bg-primary-50" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-lg transition-all duration-200",
                isActive ? "bg-primary-100 scale-110" : "scale-100"
              )}>
                <tab.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium mt-1 truncate">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};