
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard by default
    navigate("/sales");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-50/30 to-primary-100/40 dark:from-background dark:via-primary-950/30 dark:to-primary-900/40">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent dark:from-primary-400 dark:to-primary-500">
            StockFlow
          </h1>
          <p className="text-muted-foreground mt-2">
            Smart Inventory Management
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
