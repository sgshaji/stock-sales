
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export const MonthlyProfitTile = () => {
  const [monthlyProfit, setMonthlyProfit] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonthlyProfit();
  }, []);

  const fetchMonthlyProfit = async () => {
    try {
      setLoading(true);
      
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const today = new Date();
      
      // Get sales data for the current month
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select(`
          final_total,
          sale_items (
            item_name,
            quantity,
            unit_price
          )
        `)
        .gte('sale_date', format(startOfMonth, 'yyyy-MM-dd'))
        .lte('sale_date', format(today, 'yyyy-MM-dd'));

      if (salesError) throw salesError;

      // Get inventory items to calculate purchase prices
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('inventory_items')
        .select('name, purchase_price');

      if (inventoryError) throw inventoryError;

      // Create a map of item names to purchase prices
      const purchasePriceMap = new Map(
        inventoryData?.map(item => [item.name, item.purchase_price || 0]) || []
      );

      // Calculate profit
      let totalRevenue = 0;
      let totalCost = 0;

      salesData?.forEach(sale => {
        totalRevenue += Number(sale.final_total);
        
        sale.sale_items?.forEach(item => {
          const purchasePrice = purchasePriceMap.get(item.item_name) || 0;
          totalCost += purchasePrice * item.quantity;
        });
      });

      setMonthlyProfit(totalRevenue - totalCost);
    } catch (error) {
      console.error('Error fetching monthly profit:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Monthly Profit (MTD)
        </CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? (
            <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
          ) : (
            <span className={monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
              ${monthlyProfit.toFixed(2)}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {format(new Date(), 'MMMM yyyy')} to date
        </p>
      </CardContent>
    </Card>
  );
};
