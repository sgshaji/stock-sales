
import { Badge } from "@/components/ui/badge";

export const TodayHeader = () => {
  // Format today's date
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  // Mock today's revenue - in real app this would come from your data source
  const todaysRevenue = "$2,847.50";

  return (
    <div className="bg-background/95 backdrop-blur-md shadow-sm border-b border-border/40 sticky top-0 z-20">
      <div className="flex items-center justify-between px-space-4 py-space-3">
        <div className="flex items-center gap-space-2">
          <span className="text-body-medium font-medium text-foreground">
            {today}
          </span>
        </div>
        <Badge variant="secondary" className="bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-950/50 dark:text-brand-400 dark:border-brand-800 font-semibold">
          {todaysRevenue}
        </Badge>
      </div>
    </div>
  );
};
