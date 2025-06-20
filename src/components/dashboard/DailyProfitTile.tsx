
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export const DailyProfitTile = () => {
  const [dailyProfit, setDailyProfit] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyProfit();
  }, []);

  const fetchDailyProfit = async () => {
    try {
      setLoading(true);
      
      const today = new Date();
      const todayString = format(today, 'yyyy-MM-dd');
      
      // Get sales data for today
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
        .eq('sale_date', todayString);

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

      // Calculate profit for today
      let totalRevenue = 0;
      let totalCost = 0;

      salesData?.forEach(sale => {
        totalRevenue += Number(sale.final_total);
        
        sale.sale_items?.forEach(item => {
          const purchasePrice = purchasePriceMap.get(item.item_name) || 0;
          totalCost += purchasePrice * item.quantity;
        });
      });

      setDailyProfit(totalRevenue - totalCost);
    } catch (error) {
      console.error('Error fetching daily profit:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Daily Profit
        </CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? (
            <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
          ) : (
            <span className={dailyProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
              ${dailyProfit.toFixed(2)}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {format(new Date(), 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
};
