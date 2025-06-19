import { useState } from "react";
import { MobileAppShell } from "@/components/mobile/MobileAppShell";
import { MobileDashboard } from "@/components/mobile/MobileDashboard";
import { MobileSales } from "@/components/mobile/MobileSales";
import { MobileInventory } from "@/components/mobile/MobileInventory";
import { MobileProfile } from "@/components/mobile/MobileProfile";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <MobileDashboard />;
      case "sales":
        return <MobileSales />;
      case "inventory":
        return <MobileInventory />;
      case "profile":
        return <MobileProfile />;
      default:
        return <MobileDashboard />;
    }
  };

  return (
    <MobileAppShell activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </MobileAppShell>
  );
};

export default Index;