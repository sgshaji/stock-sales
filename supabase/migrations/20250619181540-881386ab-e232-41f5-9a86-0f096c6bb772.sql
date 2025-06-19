
-- Add missing columns to inventory_items table to match the mock data structure
ALTER TABLE public.inventory_items 
ADD COLUMN IF NOT EXISTS sku TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS last_sold TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS velocity TEXT CHECK (velocity IN ('fast', 'medium', 'slow')),
ADD COLUMN IF NOT EXISTS reorder_point INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS purchase_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS last_restocked DATE;

-- Drop existing policy if it exists and recreate it
DROP POLICY IF EXISTS "Users can manage their own inventory" ON public.inventory_items;

-- Create RLS policies for inventory_items
CREATE POLICY "Users can manage their own inventory" 
  ON public.inventory_items 
  FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS on inventory_items table
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

-- Insert sample data with all the fields (only if authenticated)
DO $$
BEGIN
  IF auth.uid() IS NOT NULL THEN
    INSERT INTO public.inventory_items (
      name, sku, price, stock_quantity, category, last_sold, velocity, 
      reorder_point, purchase_price, last_restocked, user_id
    ) VALUES 
    (
      'Premium Clay Tiles', 'CT001', 99.99, 3, 'clay', 
      NOW() - INTERVAL '2 hours', 'medium', 10, 75.00, '2024-01-10', 
      auth.uid()
    ),
    (
      'Plastic Outdoor Tiles', 'PT002', 29.99, 12, 'plastic',
      NOW() - INTERVAL '3 hours', 'fast', 15, 18.50, '2024-01-12',
      auth.uid()
    ),
    (
      'Cement Floor Tiles', 'CF003', 45.99, 8, 'cement',
      NOW() - INTERVAL '1 day', 'slow', 12, 32.00, '2024-01-08',
      auth.uid()
    ),
    (
      'Tile Spacers', 'TS004', 8.99, 25, 'accessories',
      NOW() - INTERVAL '1 hour', 'fast', 20, 4.50, '2024-01-15',
      auth.uid()
    ),
    (
      'Decorative Clay Tiles', 'DCT005', 129.99, 0, 'clay',
      NOW() - INTERVAL '2 days', 'slow', 8, 95.00, '2023-12-20',
      auth.uid()
    ),
    (
      'Ceramic Wall Tiles', 'CWT006', 65.50, 15, 'ceramic',
      NOW() - INTERVAL '3 days', 'medium', 10, 42.00, '2024-01-14',
      auth.uid()
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;
