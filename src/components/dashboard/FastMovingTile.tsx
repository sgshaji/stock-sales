
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays } from 'date-fns';

interface FastMovingItem {
  item_name: string;
  total_quantity: number;
}

export const FastMovingTile = () => {
  const [fastMovingItems, setFastMovingItems] = useState<FastMovingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFastMovingItems();
  }, []);

  const fetchFastMovingItems = async () => {
    try {
      setLoading(true);
      
      const sevenDaysAgo = subDays(new Date(), 7);
      
      const { data, error } = await supabase
        .from('sale_items')
        .select(`
          item_name,
          quantity,
          sales!inner (
            sale_date
          )
        `)
        .gte('sales.sale_date', format(sevenDaysAgo, 'yyyy-MM-dd'));

      if (error) throw error;

      // Group by item name and sum quantities
      const itemSales = new Map<string, number>();
      
      data?.forEach(item => {
        const currentTotal = itemSales.get(item.item_name) || 0;
        itemSales.set(item.item_name, currentTotal + item.quantity);
      });

      // Convert to array and sort by quantity
      const sortedItems = Array.from(itemSales.entries())
        .map(([item_name, total_quantity]) => ({ item_name, total_quantity }))
        .sort((a, b) => b.total_quantity - a.total_quantity)
        .slice(0, 5);

      setFastMovingItems(sortedItems);
    } catch (error) {
      console.error('Error fetching fast moving items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Fast Moving Items
        </CardTitle>
        <Zap className="h-4 w-4 text-blue-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-blue-600">
          {loading ? (
            <div className="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
          ) : (
            fastMovingItems.length
          )}
        </div>
        {!loading && fastMovingItems.length > 0 && (
          <div className="mt-2 space-y-1">
            {fastMovingItems.slice(0, 3).map(item => (
              <div key={item.item_name} className="text-xs text-muted-foreground">
                {item.item_name}: {item.total_quantity} sold
              </div>
            ))}
            {fastMovingItems.length > 3 && (
              <div className="text-xs text-muted-foreground">
                +{fastMovingItems.length - 3} more
              </div>
            )}
          </div>
        )}
        {!loading && fastMovingItems.length === 0 && (
          <p className="text-xs text-muted-foreground text-center">No sales in last 7 days</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
      </CardContent>
    </Card>
  );
};
