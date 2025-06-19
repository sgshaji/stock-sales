import { ReactNode } from "react";
import { MobileHeader } from "./MobileHeader";
import { MobileBottomNav } from "./MobileBottomNav";

interface MobileAppShellProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileAppShell = ({ children, activeTab, onTabChange }: MobileAppShellProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <MobileHeader activeTab={activeTab} onTabChange={onTabChange} />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <MobileBottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
};