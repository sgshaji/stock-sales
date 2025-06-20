
-- Add a column to vendors table to track if their products should be listed
ALTER TABLE public.vendors 
ADD COLUMN list_products BOOLEAN DEFAULT true;

-- Update the column to be not null with a default value
ALTER TABLE public.vendors 
ALTER COLUMN list_products SET NOT NULL;
