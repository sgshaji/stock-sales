
-- Add user_id column to sales table and set up RLS policies
ALTER TABLE public.sales ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Enable RLS on sales table
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sales table
CREATE POLICY "Users can view their own sales" 
  ON public.sales 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sales" 
  ON public.sales 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sales" 
  ON public.sales 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sales" 
  ON public.sales 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable RLS on sale_items table
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sale_items table (linked through sales table)
CREATE POLICY "Users can view their own sale items" 
  ON public.sale_items 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.sales 
    WHERE sales.id = sale_items.sale_id 
    AND sales.user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own sale items" 
  ON public.sale_items 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.sales 
    WHERE sales.id = sale_items.sale_id 
    AND sales.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own sale items" 
  ON public.sale_items 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.sales 
    WHERE sales.id = sale_items.sale_id 
    AND sales.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own sale items" 
  ON public.sale_items 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.sales 
    WHERE sales.id = sale_items.sale_id 
    AND sales.user_id = auth.uid()
  ));
