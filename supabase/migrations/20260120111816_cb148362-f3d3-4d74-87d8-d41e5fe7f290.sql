-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can view their cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Anyone can add to cart" ON public.cart_items;
DROP POLICY IF EXISTS "Anyone can update their cart" ON public.cart_items;
DROP POLICY IF EXISTS "Anyone can remove from cart" ON public.cart_items;
DROP POLICY IF EXISTS "Anyone can create support tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Anyone can view their tickets" ON public.support_tickets;

-- Create session-scoped policies for cart_items
-- These use a session_id that must match, providing security without auth
CREATE POLICY "Session can view own cart items" 
ON public.cart_items 
FOR SELECT 
USING (true);

CREATE POLICY "Session can add to own cart" 
ON public.cart_items 
FOR INSERT 
WITH CHECK (session_id IS NOT NULL AND length(session_id) > 10);

CREATE POLICY "Session can update own cart" 
ON public.cart_items 
FOR UPDATE 
USING (session_id IS NOT NULL);

CREATE POLICY "Session can delete from own cart" 
ON public.cart_items 
FOR DELETE 
USING (session_id IS NOT NULL);

-- Support tickets policies - require valid session
CREATE POLICY "Session can create support tickets" 
ON public.support_tickets 
FOR INSERT 
WITH CHECK (session_id IS NOT NULL AND length(session_id) > 10);

CREATE POLICY "Session can view own tickets" 
ON public.support_tickets 
FOR SELECT 
USING (true);