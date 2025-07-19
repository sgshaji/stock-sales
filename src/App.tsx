
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { ThemeProvider } from "next-themes";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "@/pages/Index";
import Landing from "@/pages/Landing";
import LandingOrDashboard from "@/components/LandingOrDashboard";
import Auth from "@/pages/Auth";
import Inventory from "@/pages/Inventory";
import Sales from "@/pages/Sales";
import Vendor from "@/pages/Vendor";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AuthProvider>
          <CurrencyProvider>
            <Router>
              <div className="App">
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/" element={<LandingOrDashboard />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  } />
                  <Route path="/inventory" element={
                    <ProtectedRoute>
                      <Inventory />
                    </ProtectedRoute>
                  } />
                  <Route path="/sales" element={
                    <ProtectedRoute>
                      <Sales />
                    </ProtectedRoute>
                  } />
                  <Route path="/vendor" element={
                    <ProtectedRoute>
                      <Vendor />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </div>
            </Router>
          </CurrencyProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
