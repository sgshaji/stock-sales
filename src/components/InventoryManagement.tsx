
// This file now delegates to the enhanced version
import EnhancedInventoryManagement from "./inventory/EnhancedInventoryManagement";

interface InventoryManagementProps {
  searchQuery?: string;
}

const InventoryManagement = (props: InventoryManagementProps) => {
  return <EnhancedInventoryManagement {...props} />;
};

export default InventoryManagement;
