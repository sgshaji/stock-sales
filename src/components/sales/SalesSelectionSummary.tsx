
import { Card, CardContent } from "@/components/ui/card";

interface Sale {
  id: number;
  item: string;
  quantity: number;
  price: number;
  date: string;
  status: "completed" | "pending" | "cancelled";
  customer?: string;
}

interface SalesSelectionSummaryProps {
  selectedSales: Sale[];
}

export const SalesSelectionSummary = ({ selectedSales }: SalesSelectionSummaryProps) => {
  if (selectedSales.length === 0) {
    return null;
  }

  const selectedTotal = selectedSales.reduce((sum, sale) => sum + sale.price, 0);

  return (
    <Card className="bg-primary-50 border-primary-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">
            {selectedSales.length} sale{selectedSales.length !== 1 ? 's' : ''} selected
          </span>
          <span className="font-bold text-primary">
            Total: ${selectedTotal.toFixed(2)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
