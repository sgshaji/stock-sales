
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Vendor {
  id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  notes?: string;
  status: 'active' | 'pending' | 'inactive';
  list_products: boolean;
  created_at: string;
  updated_at: string;
}

export interface VendorProduct {
  id: string;
  vendor_id: string;
  product_name: string;
  sku?: string;
  price?: number;
  minimum_order_quantity?: number;
  lead_time_days?: number;
  created_at: string;
}

export const useVendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Type assertion to ensure status field matches our interface
      const typedVendors: Vendor[] = (data || []).map(vendor => ({
        ...vendor,
        status: vendor.status as 'active' | 'pending' | 'inactive'
      }));

      setVendors(typedVendors);
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch vendors');
      toast({
        title: "Error",
        description: "Failed to load vendors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addVendor = async (vendorData: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('vendors')
        .insert([{ ...vendorData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      // Type assertion for the returned data
      const typedVendor: Vendor = {
        ...data,
        status: data.status as 'active' | 'pending' | 'inactive'
      };

      setVendors(prev => [typedVendor, ...prev]);
      toast({
        title: "Success",
        description: "Vendor added successfully",
      });
      
      return typedVendor;
    } catch (err) {
      console.error('Error adding vendor:', err);
      toast({
        title: "Error",
        description: "Failed to add vendor",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateVendor = async (id: string, updates: Partial<Vendor>) => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Type assertion for the returned data
      const typedVendor: Vendor = {
        ...data,
        status: data.status as 'active' | 'pending' | 'inactive'
      };

      setVendors(prev => 
        prev.map(vendor => vendor.id === id ? typedVendor : vendor)
      );
      
      toast({
        title: "Success",
        description: "Vendor updated successfully",
      });
      
      return typedVendor;
    } catch (err) {
      console.error('Error updating vendor:', err);
      toast({
        title: "Error",
        description: "Failed to update vendor",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteVendor = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setVendors(prev => prev.filter(vendor => vendor.id !== id));
      toast({
        title: "Success",
        description: "Vendor deleted successfully",
      });
    } catch (err) {
      console.error('Error deleting vendor:', err);
      toast({
        title: "Error",
        description: "Failed to delete vendor",
        variant: "destructive",
      });
      throw err;
    }
  };

  const getVendorProducts = async (vendorId: string): Promise<VendorProduct[]> => {
    try {
      const { data, error } = await supabase
        .from('vendor_products')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching vendor products:', err);
      toast({
        title: "Error",
        description: "Failed to load vendor products",
        variant: "destructive",
      });
      return [];
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return {
    vendors,
    loading,
    error,
    addVendor,
    updateVendor,
    deleteVendor,
    getVendorProducts,
    refetch: fetchVendors,
  };
};
