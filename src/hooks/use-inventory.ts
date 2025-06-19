
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type InventoryItem = Tables<"inventory_items">;
type InventoryItemInsert = TablesInsert<"inventory_items">;
type InventoryItemUpdate = TablesUpdate<"inventory_items">;

export const useInventory = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all inventory items
  const {
    data: items = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["inventory-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as InventoryItem[];
    },
  });

  // Add new inventory item
  const addItemMutation = useMutation({
    mutationFn: async (newItem: InventoryItemInsert) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("inventory_items")
        .insert({ ...newItem, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      toast({
        title: "Item Added",
        description: "New inventory item has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add item: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update inventory item
  const updateItemMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: InventoryItemUpdate }) => {
      const { data, error } = await supabase
        .from("inventory_items")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update item: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete inventory item
  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("inventory_items")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      toast({
        title: "Item Deleted",
        description: "Inventory item has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete item: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Quick stock adjustment
  const adjustStockMutation = useMutation({
    mutationFn: async ({ id, adjustment }: { id: string; adjustment: number }) => {
      // First get current stock
      const { data: currentItem, error: fetchError } = await supabase
        .from("inventory_items")
        .select("stock_quantity, name")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      const newStock = Math.max(0, (currentItem.stock_quantity || 0) + adjustment);
      
      const { data, error } = await supabase
        .from("inventory_items")
        .update({ 
          stock_quantity: newStock,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { ...data, adjustment, itemName: currentItem.name };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      const action = data.adjustment > 0 ? 'added' : 'removed';
      toast({
        title: "Stock Updated",
        description: `${Math.abs(data.adjustment)} units ${action} to ${data.itemName}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to adjust stock: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    items,
    isLoading,
    error,
    addItem: addItemMutation.mutate,
    updateItem: updateItemMutation.mutate,
    deleteItem: deleteItemMutation.mutate,
    adjustStock: adjustStockMutation.mutate,
    isAddingItem: addItemMutation.isPending,
    isUpdatingItem: updateItemMutation.isPending,
    isDeletingItem: deleteItemMutation.isPending,
    isAdjustingStock: adjustStockMutation.isPending,
  };
};
