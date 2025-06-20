
import { Header } from "@/components/navigation/Header";
import { BottomTabs } from "@/components/navigation/BottomTabs";
import { DailyProfitTile } from "@/components/dashboard/DailyProfitTile";
import { MonthlyProfitTile } from "@/components/dashboard/MonthlyProfitTile";
import { LowStockTile } from "@/components/dashboard/LowStockTile";
import { FastMovingTile } from "@/components/dashboard/FastMovingTile";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brand-50/30 to-brand-100/40 dark:from-background dark:via-brand-950/30 dark:to-brand-900/40">
      <Header />
      <div className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-500">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Overview of your inventory and sales performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <DailyProfitTile />
          <MonthlyProfitTile />
          <LowStockTile />
          <FastMovingTile />
        </div>
      </div>
      <BottomTabs />
    </div>
  );
};

export default Index;
