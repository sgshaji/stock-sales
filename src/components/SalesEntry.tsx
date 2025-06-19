import { memo } from "react";
import { MobileSalesEntry } from "./sales/MobileSalesEntry";

interface SalesEntryProps {
  searchQuery?: string;
}

const SalesEntry = memo<SalesEntryProps>(({ searchQuery }) => {
  return <MobileSalesEntry searchQuery={searchQuery} />;
});

SalesEntry.displayName = "SalesEntry";

export default SalesEntry;