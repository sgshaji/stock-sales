
import { SearchInput } from "@/components/ui/search";

interface SalesFiltersProps {
  searchQuery?: string;
  onSearch: (query: string) => void;
}

export const SalesFilters = ({ searchQuery, onSearch }: SalesFiltersProps) => {
  if (searchQuery !== undefined) {
    return null; // Don't show search if searchQuery prop is provided
  }

  return (
    <SearchInput
      placeholder="Search sales..."
      onSearch={onSearch}
    />
  );
};
