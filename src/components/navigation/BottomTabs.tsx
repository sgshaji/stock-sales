import { useState, useEffect, memo } from "react";
import { Tab } from "@headlessui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { BarChart3, ShoppingCart, Package, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

// Removed Settings from bottom navigation - now only accessible via top header
const tabs = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, path: "/" },
  { id: "sales", label: "Sales", icon: ShoppingCart, path: "/sales" },
  { id: "inventory", label: "Inventory", icon: Package, path: "/inventory" },
  { id: "analytics", label: "Analytics", icon: TrendingUp, path: "/analytics" }
];

export const BottomTabs = memo(() => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Get active tab index based on current path
  const activeTabIndex = tabs.findIndex(tab => {
    if (tab.path === "/" && location.pathname === "/") return true;
    if (tab.path !== "/" && location.pathname.startsWith(tab.path)) return true;
    return false;
  });

  const selectedIndex = activeTabIndex >= 0 ? activeTabIndex : 0;

  // Handle scroll detection with improved performance
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          if (currentScrollY < 10) {
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsVisible(false);
          } else if (currentScrollY < lastScrollY) {
            setIsVisible(true);
          }
          
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleTabChange = (index: number) => {
    const selectedTab = tabs[index];
    navigate(selectedTab.path);
  };

  return (
    <div 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border/30 transition-transform duration-300 ease-out md:hidden safe-bottom",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <Tab.Group selectedIndex={selectedIndex} onChange={handleTabChange}>
        <Tab.List className="flex">
          {tabs.map((tab, index) => (
            <Tab
              key={tab.id}
              className={({ selected }) =>
                cn(
                  "flex-1 flex flex-col items-center justify-center py-3 px-2 min-h-[68px] focus:outline-none transition-all duration-200 relative",
                  selected
                    ? "text-primary-600 bg-primary-50/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                )
              }
            >
              {({ selected }) => (
                <>
                  <div className={cn(
                    "p-2 rounded-xl transition-all duration-200",
                    selected ? "bg-primary-100 scale-110" : "scale-100"
                  )}>
                    <tab.icon 
                      className={cn(
                        "h-5 w-5 transition-all duration-200",
                        selected ? "text-primary-600" : "text-current"
                      )} 
                    />
                  </div>
                  <span className={cn(
                    "text-xs font-medium leading-none mt-1 transition-all duration-200",
                    selected ? "text-primary-600" : "text-current"
                  )}>
                    {tab.label}
                  </span>
                  {selected && (
                    <div 
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-primary-600 rounded-full transition-all duration-200"
                    />
                  )}
                </>
              )}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>
    </div>
  );
});

BottomTabs.displayName = "BottomTabs";