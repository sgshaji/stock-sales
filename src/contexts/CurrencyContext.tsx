
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Currency {
  value: string;
  label: string;
  symbol: string;
}

export const currencies = [
  { value: "USD", label: "US Dollar ($)", symbol: "$" },
  { value: "EUR", label: "Euro (€)", symbol: "€" },
  { value: "GBP", label: "British Pound (£)", symbol: "£" },
  { value: "INR", label: "Indian Rupee (₹)", symbol: "₹" },
  { value: "CAD", label: "Canadian Dollar (C$)", symbol: "C$" },
  { value: "AUD", label: "Australian Dollar (A$)", symbol: "A$" },
];

interface CurrencyContextType {
  selectedCurrency: string;
  currentCurrency: Currency;
  setCurrency: (currency: string) => void;
  formatPrice: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  // Load currency from user preferences or localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem('user-currency');
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
    }
  }, []);

  const currentCurrency = currencies.find(c => c.value === selectedCurrency) || currencies[0];

  const setCurrency = (currency: string) => {
    setSelectedCurrency(currency);
    localStorage.setItem('user-currency', currency);
  };

  const formatPrice = (amount: number): string => {
    return `${currentCurrency.symbol}${amount.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{
      selectedCurrency,
      currentCurrency,
      setCurrency,
      formatPrice
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
