
import type { Tables } from "@/integrations/supabase/types";

// Use the exact database structure with string IDs
export type InventoryItem = Tables<"inventory_items"> & {
  // Add computed properties for backward compatibility with existing components
  stock: number;
};

// Transform function to convert database format to component format
export const transformInventoryItem = (dbItem: Tables<"inventory_items">): InventoryItem => ({
  ...dbItem,
  stock: dbItem.stock_quantity || 0,
});

// Transform function to convert component format to database format
export const transformToDatabase = (item: Partial<InventoryItem>) => {
  const { stock, ...dbItem } = item;
  return {
    ...dbItem,
    stock_quantity: stock ?? dbItem.stock_quantity,
  };
};
