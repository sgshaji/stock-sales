
import { useState } from "react";
import { BottomTabs } from "@/components/navigation/BottomTabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { SalesEntryForm } from "@/components/sales/SalesEntryForm";
import { SalesQuickAdd } from "@/components/sales/SalesQuickAdd";
import { useSales } from "@/hooks/use-sales";
import { useInventory } from "@/hooks/use-inventory";
import { format } from "date-fns";
import { SalesDateFilter } from "@/components/sales/SalesDateFilter";

const Sales = () => {
  const [showFullForm, setShowFullForm] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { sales, loading, createSale } = useSales();
  const { inventory } = useInventory();

  // Filter sales by selected date
  const filteredSales = sales.filter(sale => 
    format(new Date(sale.sale_date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  const todayTotal = filteredSales.reduce((sum, sale) => sum + Number(sale.final_total), 0);

  const handleSaleComplete = async (saleData: any) => {
    const result = await createSale(saleData);
    if (result.success) {
      setShowFullForm(false);
    }
  };

  const handleDateChange = (dateString: string) => {
    setSelectedDate(new Date(dateString));
  };

  if (showFullForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-brand-50/30 to-brand-100/40 dark:from-background dark:via-brand-950/30 dark:to-brand-900/40">
        <div className="container mx-auto px-4 py-6 pb-20 md:pb-6 max-w-4xl">
          <SalesEntryForm 
            inventory={inventory}
            onComplete={handleSaleComplete}
            onCancel={() => setShowFullForm(false)} 
          />
        </div>
        <BottomTabs />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brand-50/30 to-brand-100/40 dark:from-background dark:via-brand-950/30 dark:to-brand-900/40">
      <div className="container mx-auto px-4 py-6 pb-20 md:pb-6 max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-500">
              Sales
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Record and track your sales transactions
            </p>
          </div>
          <Button size="sm" className="gap-2" onClick={() => setShowFullForm(true)}>
            <Plus className="h-4 w-4" />
            New Sale
          </Button>
        </div>

        {/* Date Filter */}
        <div className="mb-6">
          <SalesDateFilter 
            selectedDate={format(selectedDate, 'yyyy-MM-dd')} 
            onDateChange={handleDateChange} 
          />
        </div>

        {/* Daily Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sales Today
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredSales.length}</div>
              <p className="text-xs text-muted-foreground">
                {format(selectedDate, 'MMM d, yyyy')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${todayTotal.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {format(selectedDate, 'MMM d, yyyy')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Sale
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${filteredSales.length > 0 ? (todayTotal / filteredSales.length).toFixed(2) : '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">
                Per transaction
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Add Component */}
        <SalesQuickAdd 
          isOpen={showQuickAdd} 
          onClose={() => setShowQuickAdd(false)} 
        />

        {/* Recent Sales */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Sales - {format(selectedDate, 'MMM d, yyyy')}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-pulse">Loading sales...</div>
              </div>
            ) : filteredSales.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No sales recorded for {format(selectedDate, 'MMM d, yyyy')}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSales.slice(0, 5).map((sale) => (
                  <div key={sale.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Sale #{sale.id.slice(-8)}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(`${sale.sale_date}T${sale.sale_time}`), 'h:mm a')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${Number(sale.final_total).toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">
                        {sale.items?.length || 0} items
                      </div>
                    </div>
                  </div>
                ))}
                {filteredSales.length > 5 && (
                  <div className="text-center py-4">
                    <Button variant="outline" onClick={() => setShowFullForm(true)}>
                      View All Sales
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <BottomTabs />
    </div>
  );
};

export default Sales;
