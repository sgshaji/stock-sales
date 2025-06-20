
import { BottomTabs } from "@/components/navigation/BottomTabs";
import { BusinessProfile } from "@/components/settings/BusinessProfile";
import { ConfigurationSettings } from "@/components/settings/ConfigurationSettings";
import { InventoryCategories } from "@/components/settings/InventoryCategories";

const Settings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brand-50/30 to-brand-100/40 dark:from-background dark:via-brand-950/30 dark:to-brand-900/40">
      <div className="container-content mx-auto px-space-4 py-space-6 pb-20 md:pb-6">
        <div className="mb-space-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-500">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your business profile and configurations
          </p>
        </div>

        <div className="space-y-6">
          <BusinessProfile />
          <ConfigurationSettings />
          <InventoryCategories />
        </div>
      </div>
      <BottomTabs />
    </div>
  );
};

export default Settings;
