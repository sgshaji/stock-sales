
-- Enable RLS on inventory_items table and create policies for user access
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own inventory items
CREATE POLICY "Users can view their own inventory items" 
ON public.inventory_items 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to insert their own inventory items
CREATE POLICY "Users can insert their own inventory items" 
ON public.inventory_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own inventory items
CREATE POLICY "Users can update their own inventory items" 
ON public.inventory_items 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow users to delete their own inventory items
CREATE POLICY "Users can delete their own inventory items" 
ON public.inventory_items 
FOR DELETE 
USING (auth.uid() = user_id);
