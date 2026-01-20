-- Products table with full details
CREATE TABLE public.products (
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

-- Cart items table (session-based, no auth required)
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(session_id, product_id)
);

-- Orders table for tracking
CREATE TABLE public.orders (
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

-- Support tickets table for automated emails
CREATE TABLE public.support_tickets (
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

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Products are public (readable by everyone)
CREATE POLICY "Products are publicly readable" 
ON public.products 
FOR SELECT 
USING (true);

-- Cart items - anyone can manage their session cart
CREATE POLICY "Anyone can view their cart items" 
ON public.cart_items 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can add to cart" 
ON public.cart_items 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update their cart" 
ON public.cart_items 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can remove from cart" 
ON public.cart_items 
FOR DELETE 
USING (true);

-- Orders - public read for tracking
CREATE POLICY "Orders are publicly readable" 
ON public.orders 
FOR SELECT 
USING (true);

-- Support tickets - anyone can create
CREATE POLICY "Anyone can create support tickets" 
ON public.support_tickets 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view their tickets" 
ON public.support_tickets 
FOR SELECT 
USING (true);

-- Seed initial products
INSERT INTO public.products (name, price, image, category, rating, specs, description, availability, warranty) VALUES
-- Laptops
('ProBook Elite 15', 899.00, '💻', 'laptop', 4.7, ARRAY['Intel i7', '16GB RAM', '512GB SSD', '15.6" FHD'], 'Professional laptop perfect for business and productivity tasks. Features a stunning display and all-day battery life.', 'in-stock', '2 year manufacturer warranty'),
('StudentBook Air', 549.00, '💻', 'laptop', 4.5, ARRAY['Intel i5', '8GB RAM', '256GB SSD', '14" HD'], 'Lightweight and affordable laptop ideal for students. Great for note-taking, research, and everyday computing.', 'in-stock', '1 year manufacturer warranty'),
('GameForce X17', 1499.00, '🎮', 'laptop', 4.9, ARRAY['RTX 4070', '32GB RAM', '1TB SSD', '17.3" 165Hz'], 'Ultimate gaming laptop with desktop-class performance. Dominate any game with smooth framerates.', 'limited', '2 year manufacturer warranty + accidental damage'),
('UltraSlim Pro', 1199.00, '💻', 'laptop', 4.8, ARRAY['Apple M2', '16GB RAM', '512GB SSD', '13.3" Retina'], 'Sleek and powerful ultrabook for creative professionals. Industry-leading performance in a thin design.', 'in-stock', '1 year manufacturer warranty'),
('WorkStation Max', 1899.00, '🖥️', 'laptop', 4.6, ARRAY['Intel i9', '64GB RAM', '2TB SSD', '16" 4K'], 'High-performance workstation for demanding professional applications. Perfect for video editing and 3D rendering.', 'pre-order', '3 year manufacturer warranty'),
-- Phones
('Galaxy Ultra S24', 1199.00, '📱', 'phone', 4.8, ARRAY['6.8" AMOLED', '256GB', '200MP Camera', '5000mAh'], 'Flagship smartphone with the best camera system. AI-powered photography and all-day battery.', 'in-stock', '2 year manufacturer warranty'),
('iPhone 15 Pro', 999.00, '📱', 'phone', 4.9, ARRAY['6.1" Super Retina', '128GB', 'A17 Pro', '48MP Camera'], 'Premium Apple smartphone with titanium design and powerful A17 chip. Pro camera system for stunning photos.', 'in-stock', '1 year AppleCare warranty'),
('Pixel 8 Pro', 899.00, '📱', 'phone', 4.7, ARRAY['6.7" LTPO', '128GB', 'Tensor G3', 'Best-in-class AI'], 'Google flagship with the smartest AI features. Magic Eraser, Best Take, and 7 years of updates.', 'in-stock', '2 year manufacturer warranty'),
('OnePlus 12', 799.00, '📱', 'phone', 4.6, ARRAY['6.82" AMOLED', '256GB', 'Snapdragon 8 Gen 3', '100W Charging'], 'Fast and smooth flagship killer. Full charge in 25 minutes with the fastest charging in the industry.', 'in-stock', '1 year manufacturer warranty'),
('Budget Pro A54', 349.00, '📱', 'phone', 4.3, ARRAY['6.4" AMOLED', '128GB', '50MP Camera', '5000mAh'], 'Affordable smartphone with premium features. Great display and camera at an unbeatable price.', 'in-stock', '1 year manufacturer warranty');

-- Seed sample orders for testing
INSERT INTO public.orders (order_id, status, estimated_delivery, last_update, location, total_amount) VALUES
('ORD-12345', 'in-transit', 'January 22, 2026', 'Package departed Chicago distribution center', 'Chicago, IL', 1099.00),
('ORD-67890', 'out-for-delivery', 'January 20, 2026', 'Out for delivery - arriving today by 8 PM', 'Your City', 549.00),
('ORD-11111', 'delivered', 'January 18, 2026', 'Delivered - Left at front door', 'Your Address', 899.00),
('ORD-22222', 'processing', 'January 25, 2026', 'Order confirmed - preparing for shipment', 'Warehouse', 1499.00);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for cart items
CREATE TRIGGER update_cart_items_updated_at
BEFORE UPDATE ON public.cart_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();