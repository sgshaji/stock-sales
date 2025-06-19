import { useState, memo } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface SalesDateFilterProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  onClose: () => void;
}

export const SalesDateFilter = memo<SalesDateFilterProps>(({ 
  selectedDate, 
  onDateChange, 
  onClose 
}) => {
  const [tempDate, setTempDate] = useState(selectedDate);

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

  const quickDates = [
    { label: "Today", value: today },
    { label: "Yesterday", value: yesterday },
    { label: "Last 7 days", value: weekAgo },
  ];

  const handleApply = () => {
    onDateChange(tempDate);
    onClose();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Quick Date Options */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Quick Select</h3>
        <div className="space-y-2">
          {quickDates.map((option) => (
            <Button
              key={option.value}
              variant={tempDate === option.value ? "default" : "outline"}
              onClick={() => setTempDate(option.value)}
              className="w-full justify-start h-12 rounded-xl"
            >
              <Calendar className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(option.value)}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Date Picker */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Custom Date</h3>
        <input
          type="date"
          value={tempDate}
          onChange={(e) => setTempDate(e.target.value)}
          max={today}
          className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Selected Date Preview */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="font-medium text-gray-900 mb-1">Selected Date</h4>
        <p className="text-sm text-gray-600">{formatDate(tempDate)}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          variant="outline"
          onClick={onClose}
          className="flex-1 h-12 rounded-full"
        >
          Cancel
        </Button>
        <Button
          onClick={handleApply}
          className="flex-1 h-12 bg-primary-600 hover:bg-primary-700 rounded-full"
        >
          Apply
        </Button>
      </div>
    </div>
  );
});

SalesDateFilter.displayName = "SalesDateFilter";