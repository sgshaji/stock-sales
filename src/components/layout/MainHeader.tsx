import { memo } from "react";

// This component is now simplified since TodayHeader handles everything
interface MainHeaderProps {
  onSearch: (query: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MainHeader = memo<MainHeaderProps>(() => {
  // This component is no longer needed as TodayHeader handles all header functionality
  return null;
});

MainHeader.displayName = "MainHeader";