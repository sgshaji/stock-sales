
-- Create inventory_items table
CREATE TABLE public.inventory_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sales table
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  sale_time TIME NOT NULL DEFAULT CURRENT_TIME,
  subtotal DECIMAL(10,2) NOT NULL,
  total_discount DECIMAL(10,2) NOT NULL DEFAULT 0,
  final_total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sale_items table (individual items within each sale)
CREATE TABLE public.sale_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  discount_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the current inventory items from your app
INSERT INTO public.inventory_items (name, price) VALUES
  ('Bluetooth Speaker', 79.99),
  ('Wireless Mouse', 29.99),
  ('Phone Case', 19.99),
  ('USB Cable', 12.99),
  ('Power Bank', 45.99),
  ('Phone Charger', 15.99);

-- Enable Row Level Security (RLS) - for future user authentication if needed
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for now (since no authentication yet)
CREATE POLICY "Allow all operations on inventory_items" ON public.inventory_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on sales" ON public.sales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on sale_items" ON public.sale_items FOR ALL USING (true) WITH CHECK (true);
