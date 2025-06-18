
import { useState, useEffect } from "react";
import { Search, Clock, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchSuggestion {
  type: 'recent' | 'sku' | 'product' | 'category';
  value: string;
  label: string;
}

interface IntelligentSearchProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  suggestions?: SearchSuggestion[];
  className?: string;
}

export const IntelligentSearch = ({ 
  placeholder = "Search products, SKUs, categories...", 
  onSearch, 
  suggestions = [],
  className 
}: IntelligentSearchProps) => {
  const [value, setValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([]);

  // Mock recent searches and suggestions
  const mockSuggestions: SearchSuggestion[] = [
    { type: 'recent', value: 'clay tiles', label: 'clay tiles' },
    { type: 'recent', value: 'PT002', label: 'PT002' },
    { type: 'sku', value: 'CT001', label: 'CT001 - Premium Clay Tiles' },
    { type: 'product', value: 'Premium Clay Tiles', label: 'Premium Clay Tiles' },
    { type: 'category', value: 'plastic', label: 'Plastic category' },
    ...suggestions
  ];

  useEffect(() => {
    if (value.length > 0) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.value.toLowerCase().includes(value.toLowerCase()) ||
        suggestion.label.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 6));
    } else {
      setFilteredSuggestions(mockSuggestions.filter(s => s.type === 'recent').slice(0, 3));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearch(newValue);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setValue(suggestion.value);
    onSearch(suggestion.value);
    setShowSuggestions(false);
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'recent': return <Clock className="h-3 w-3" />;
      case 'sku': return <Hash className="h-3 w-3" />;
      case 'product': return <Search className="h-3 w-3" />;
      case 'category': return <Search className="h-3 w-3" />;
      default: return <Search className="h-3 w-3" />;
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          className="flex h-11 w-full rounded-xl border border-border/40 bg-background/60 backdrop-blur-sm pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:border-primary-300 transition-all duration-200"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
      </div>

      {/* Search Suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-md border border-border/40 rounded-xl shadow-lg z-50 animate-slide-up">
          <div className="p-2">
            {value.length === 0 && (
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border/40">
                Recent searches
              </div>
            )}
            {filteredSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 h-8 text-left hover:bg-accent/50"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <span className="text-muted-foreground">
                  {getSuggestionIcon(suggestion.type)}
                </span>
                <span className="truncate">{suggestion.label}</span>
                {suggestion.type === 'category' && (
                  <span className="ml-auto text-xs text-muted-foreground">Category</span>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
