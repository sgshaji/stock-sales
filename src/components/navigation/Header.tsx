
import { Link } from "react-router-dom";
import { UserMenu } from "./UserMenu";
import { Package } from "lucide-react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Package className="h-6 w-6 text-brand-600" />
            <span className="font-bold text-xl bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent">
              StockFlow
            </span>
          </Link>
        </div>
        
        <UserMenu />
      </div>
    </header>
  );
};
