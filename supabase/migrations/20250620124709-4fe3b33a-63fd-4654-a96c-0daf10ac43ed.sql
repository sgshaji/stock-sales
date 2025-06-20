
-- Create vendors table for storing vendor information
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  website TEXT,
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendor_products table to link products to vendors
CREATE TABLE public.vendor_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  product_name TEXT NOT NULL,
  sku TEXT,
  price DECIMAL(10,2),
  minimum_order_quantity INTEGER DEFAULT 1,
  lead_time_days INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on vendors table
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for vendors table
CREATE POLICY "Users can view their own vendors" 
  ON public.vendors 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own vendors" 
  ON public.vendors 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vendors" 
  ON public.vendors 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vendors" 
  ON public.vendors 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable RLS on vendor_products table
ALTER TABLE public.vendor_products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for vendor_products table (linked through vendors table)
CREATE POLICY "Users can view their own vendor products" 
  ON public.vendor_products 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.vendors 
    WHERE vendors.id = vendor_products.vendor_id 
    AND vendors.user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own vendor products" 
  ON public.vendor_products 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.vendors 
    WHERE vendors.id = vendor_products.vendor_id 
    AND vendors.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own vendor products" 
  ON public.vendor_products 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.vendors 
    WHERE vendors.id = vendor_products.vendor_id 
    AND vendors.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own vendor products" 
  ON public.vendor_products 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.vendors 
    WHERE vendors.id = vendor_products.vendor_id 
    AND vendors.user_id = auth.uid()
  ));

-- Insert some sample data for testing
INSERT INTO public.vendors (name, contact_person, email, phone, address, status, user_id)
SELECT 
  'TechSupplier Co.',
  'John Smith',
  'john@techsupplier.com',
  '+1 (555) 123-4567',
  '123 Tech Street, Silicon Valley, CA',
  'active',
  auth.uid()
WHERE auth.uid() IS NOT NULL;

INSERT INTO public.vendors (name, contact_person, email, phone, address, status, user_id)
SELECT 
  'Mobile World Inc.',
  'Sarah Johnson',
  'sarah@mobileworld.com',
  '+1 (555) 987-6543',
  '456 Mobile Ave, New York, NY',
  'active',
  auth.uid()
WHERE auth.uid() IS NOT NULL;

INSERT INTO public.vendors (name, contact_person, email, phone, address, status, user_id)
SELECT 
  'ElectroMax Ltd.',
  'Mike Wilson',
  'mike@electromax.com',
  '+1 (555) 456-7890',
  '789 Electronics Blvd, Austin, TX',
  'pending',
  auth.uid()
WHERE auth.uid() IS NOT NULL;
