
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LowStockItem {
  id: string;
  name: string;
  stock_quantity: number;
  reorder_point: number;
}

export const LowStockTile = () => {
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLowStockItems();
  }, []);

  const fetchLowStockItems = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('inventory_items')
        .select('id, name, stock_quantity, reorder_point')
        .not('stock_quantity', 'is', null)
        .not('reorder_point', 'is', null)
        .filter('stock_quantity', 'lte', 'reorder_point')
        .limit(5);

      if (error) throw error;
      setLowStockItems(data || []);
    } catch (error) {
      console.error('Error fetching low stock items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Low Stock Items
        </CardTitle>
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-yellow-600">
          {loading ? (
            <div className="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
          ) : (
            lowStockItems.length
          )}
        </div>
        {!loading && lowStockItems.length > 0 && (
          <div className="mt-2 space-y-1">
            {lowStockItems.slice(0, 3).map(item => (
              <div key={item.id} className="text-xs text-muted-foreground">
                {item.name}: {item.stock_quantity} left
              </div>
            ))}
            {lowStockItems.length > 3 && (
              <div className="text-xs text-muted-foreground">
                +{lowStockItems.length - 3} more
              </div>
            )}
          </div>
        )}
        {!loading && lowStockItems.length === 0 && (
          <p className="text-xs text-muted-foreground">All items well stocked</p>
        )}
      </CardContent>
    </Card>
  );
};
