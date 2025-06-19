
import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { BarChart3, ShoppingCart, Package, TrendingUp, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { BASE } from "@/lib/utils/motion";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, path: "/" },
  { id: "sales", label: "Sales", icon: ShoppingCart, path: "/sales" },
  { id: "inventory", label: "Inventory", icon: Package, path: "/inventory" },
  { id: "analytics", label: "Analytics", icon: TrendingUp, path: "/analytics" },
  { id: "settings", label: "Settings", icon: Settings, path: "/settings" }
];

export const BottomTabs = () => {
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

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
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
        "fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border/40 transition-transform duration-300 ease-out md:hidden",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <Tab.Group selectedIndex={selectedIndex} onChange={handleTabChange}>
        <Tab.List className="flex">
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              className={({ selected }) =>
                cn(
                  "flex-1 flex flex-col items-center justify-center py-space-2 px-space-1 min-h-[64px] focus:outline-none transition-all",
                  `duration-[${BASE}ms]`,
                  selected
                    ? "text-brand-600 bg-brand-50/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )
              }
            >
              {({ selected }) => (
                <>
                  <tab.icon 
                    className={cn(
                      "h-5 w-5 mb-1 transition-transform",
                      `duration-[${BASE}ms]`,
                      selected ? "scale-110" : "scale-100"
                    )} 
                  />
                  <span className="text-xs font-medium leading-none">
                    {tab.label}
                  </span>
                  {selected && (
                    <div 
                      className={cn(
                        "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-brand-600 rounded-full transition-all",
                        `duration-[${BASE}ms]`
                      )}
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
};
