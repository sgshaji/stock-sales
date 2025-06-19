import { Badge } from "@/components/ui/badge";
import { memo } from "react";

export const TodayHeader = memo(() => {
  // Format today's date
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  // Mock today's revenue - in real app this would come from your data source
  const todaysRevenue = "$1,247";

  return (
    <div className="bg-background/95 backdrop-blur-md shadow-sm border-b border-border/30 sticky top-0 z-20">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-body-medium font-medium text-foreground">
            {today}
          </span>
        </div>
        <Badge variant="secondary" className="bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-950/50 dark:text-primary-400 dark:border-primary-800 font-semibold text-xs">
          Today: {todaysRevenue}
        </Badge>
      </div>
    </div>
  );
});

TodayHeader.displayName = "TodayHeader";