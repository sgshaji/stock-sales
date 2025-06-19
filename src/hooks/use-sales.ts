
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Sale = Database['public']['Tables']['sales']['Row'];
type SaleItem = Database['public']['Tables']['sale_items']['Row'];
type SaleInsert = Database['public']['Tables']['sales']['Insert'];
type SaleItemInsert = Database['public']['Tables']['sale_items']['Insert'];

export interface SaleWithItems extends Sale {
  items: SaleItem[];
  customerName?: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface NewSaleData {
  customerName?: string;
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    discount: number;
  }[];
  subtotal: number;
  totalDiscount: number;
  finalTotal: number;
}

export const useSales = () => {
  const [sales, setSales] = useState<SaleWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch sales from database
  const fetchSales = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select(`
          *,
          sale_items (*)
        `)
        .order('created_at', { ascending: false });

      if (salesError) throw salesError;

      // Transform data to match expected format
      const transformedSales: SaleWithItems[] = (salesData || []).map(sale => ({
        ...sale,
        items: sale.sale_items || [],
        status: 'completed' as const, // Default status, could be enhanced later
      }));

      setSales(transformedSales);
    } catch (err) {
      console.error('Error fetching sales:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch sales');
      toast({
        title: "Error",
        description: "Failed to load sales data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create new sale
  const createSale = async (saleData: NewSaleData) => {
    try {
      setLoading(true);
      setError(null);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create sale record
      const saleInsert: SaleInsert = {
        user_id: user.id,
        sale_date: new Date().toISOString().split('T')[0],
        sale_time: new Date().toTimeString().split(' ')[0],
        subtotal: saleData.subtotal,
        total_discount: saleData.totalDiscount,
        final_total: saleData.finalTotal,
      };

      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert(saleInsert)
        .select()
        .single();

      if (saleError) throw saleError;

      // Create sale items
      const saleItemsInsert: SaleItemInsert[] = saleData.items.map(item => ({
        sale_id: sale.id,
        item_name: item.name,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        discount_percent: item.discount,
        total: (item.unitPrice * item.quantity) * (1 - item.discount / 100),
      }));

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItemsInsert);

      if (itemsError) throw itemsError;

      // Refresh sales list
      await fetchSales();

      toast({
        title: "Success",
        description: `Sale recorded successfully - $${saleData.finalTotal.toFixed(2)}`,
      });

      return { success: true };
    } catch (err) {
      console.error('Error creating sale:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create sale';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Get sales by date
  const getSalesByDate = (date: string) => {
    return sales.filter(sale => sale.sale_date === date);
  };

  // Get sales stats for a date
  const getSalesStats = (date: string) => {
    const dateSales = getSalesByDate(date).filter(sale => sale.status === 'completed');
    const totalRevenue = dateSales.reduce((sum, sale) => sum + sale.final_total, 0);
    const totalItems = dateSales.reduce((sum, sale) => 
      sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    const totalTransactions = dateSales.length;
    
    return { totalRevenue, totalItems, totalTransactions };
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return {
    sales,
    loading,
    error,
    createSale,
    getSalesByDate,
    getSalesStats,
    refetch: fetchSales,
  };
};
