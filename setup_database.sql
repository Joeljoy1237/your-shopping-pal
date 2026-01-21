-- Consolidated Database Setup Script for Your Shopping Pal
-- Run this entire script in the Supabase SQL Editor

-- 1. Create Tables
-- Products table with full details
CREATE TABLE IF NOT EXISTS public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  specs TEXT[] DEFAULT '{}',
  description TEXT,
  availability TEXT DEFAULT 'in-stock',
  warranty TEXT DEFAULT '1 year manufacturer warranty',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Cart items table (session-based)
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(session_id, product_id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  session_id TEXT,
  status TEXT NOT NULL DEFAULT 'processing',
  estimated_delivery TEXT,
  last_update TEXT,
  location TEXT,
  total_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Support tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  ticket_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  order_id TEXT,
  product_name TEXT,
  email TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies

-- Products: Publicly readable
CREATE POLICY "Products are publicly readable" 
ON public.products FOR SELECT USING (true);

-- Orders: Publicly readable (for tracking demo)
CREATE POLICY "Orders are publicly readable" 
ON public.orders FOR SELECT USING (true);

-- Cart Items: Session-based security
CREATE POLICY "Session can view own cart items" 
ON public.cart_items FOR SELECT USING (true);

CREATE POLICY "Session can add to own cart" 
ON public.cart_items FOR INSERT 
WITH CHECK (session_id IS NOT NULL AND length(session_id) > 0);

CREATE POLICY "Session can update own cart" 
ON public.cart_items FOR UPDATE USING (session_id IS NOT NULL);

CREATE POLICY "Session can delete from own cart" 
ON public.cart_items FOR DELETE USING (session_id IS NOT NULL);

-- Support Tickets: Session-based security
CREATE POLICY "Session can create support tickets" 
ON public.support_tickets FOR INSERT 
WITH CHECK (session_id IS NOT NULL AND length(session_id) > 0);

CREATE POLICY "Session can view own tickets" 
ON public.support_tickets FOR SELECT USING (true);

-- 4. Create Triggers for Updated At
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_cart_items_updated_at ON public.cart_items;
CREATE TRIGGER update_cart_items_updated_at
BEFORE UPDATE ON public.cart_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Seed Initial Data (Optional but recommended for starting)
-- Only insert if table is empty
INSERT INTO public.products (name, price, image, category, rating, specs, description, availability, warranty)
SELECT name, price, image, category, rating, specs, description, availability, warranty 
FROM (VALUES 
  ('ProBook Elite 15', 899.00, '💻', 'laptop', 4.7, ARRAY['Intel i7', '16GB RAM', '512GB SSD', '15.6" FHD'], 'Professional laptop perfect for business and productivity tasks. Features a stunning display and all-day battery life.', 'in-stock', '2 year manufacturer warranty'),
  ('StudentBook Air', 549.00, '💻', 'laptop', 4.5, ARRAY['Intel i5', '8GB RAM', '256GB SSD', '14" HD'], 'Lightweight and affordable laptop ideal for students. Great for note-taking, research, and everyday computing.', 'in-stock', '1 year manufacturer warranty'),
  ('GameForce X17', 1499.00, '🎮', 'laptop', 4.9, ARRAY['RTX 4070', '32GB RAM', '1TB SSD', '17.3" 165Hz'], 'Ultimate gaming laptop with desktop-class performance. Dominate any game with smooth framerates.', 'limited', '2 year manufacturer warranty + accidental damage'),
  ('UltraSlim Pro', 1199.00, '💻', 'laptop', 4.8, ARRAY['Apple M2', '16GB RAM', '512GB SSD', '13.3" Retina'], 'Sleek and powerful ultrabook for creative professionals. Industry-leading performance in a thin design.', 'in-stock', '1 year manufacturer warranty'),
  ('WorkStation Max', 1899.00, '🖥️', 'laptop', 4.6, ARRAY['Intel i9', '64GB RAM', '2TB SSD', '16" 4K'], 'High-performance workstation for demanding professional applications. Perfect for video editing and 3D rendering.', 'pre-order', '3 year manufacturer warranty'),
  ('Galaxy Ultra S24', 1199.00, '📱', 'phone', 4.8, ARRAY['6.8" AMOLED', '256GB', '200MP Camera', '5000mAh'], 'Flagship smartphone with the best camera system. AI-powered photography and all-day battery.', 'in-stock', '2 year manufacturer warranty'),
  ('iPhone 15 Pro', 999.00, '📱', 'phone', 4.9, ARRAY['6.1" Super Retina', '128GB', 'A17 Pro', '48MP Camera'], 'Premium Apple smartphone with titanium design and powerful A17 chip. Pro camera system for stunning photos.', 'in-stock', '1 year AppleCare warranty'),
  ('Pixel 8 Pro', 899.00, '📱', 'phone', 4.7, ARRAY['6.7" LTPO', '128GB', 'Tensor G3', 'Best-in-class AI'], 'Google flagship with the smartest AI features. Magic Eraser, Best Take, and 7 years of updates.', 'in-stock', '2 year manufacturer warranty'),
  ('OnePlus 12', 799.00, '📱', 'phone', 4.6, ARRAY['6.82" AMOLED', '256GB', 'Snapdragon 8 Gen 3', '100W Charging'], 'Fast and smooth flagship killer. Full charge in 25 minutes with the fastest charging in the industry.', 'in-stock', '1 year manufacturer warranty'),
  ('Budget Pro A54', 349.00, '📱', 'phone', 4.3, ARRAY['6.4" AMOLED', '128GB', '50MP Camera', '5000mAh'], 'Affordable smartphone with premium features. Great display and camera at an unbeatable price.', 'in-stock', '1 year manufacturer warranty')
) AS v(name, price, image, category, rating, specs, description, availability, warranty)
WHERE NOT EXISTS (SELECT 1 FROM public.products);
