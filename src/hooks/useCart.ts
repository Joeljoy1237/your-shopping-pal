import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getSessionId } from '@/lib/sessionId';

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
  };
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  const sessionId = getSessionId();

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          product:products (
            id,
            name,
            price,
            image,
            category
          )
        `)
        .eq('session_id', sessionId);

      if (error) throw error;

      const items = (data || []).map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        product: item.product,
      }));

      setCartItems(items);
      setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
      setCartTotal(items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0));
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const addToCart = useCallback(async (productId: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Check if item already exists
      const { data: existing } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('session_id', sessionId)
        .eq('product_id', productId)
        .maybeSingle();

      if (existing) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + 1 })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Insert new item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            session_id: sessionId,
            product_id: productId,
            quantity: 1,
          });

        if (error) throw error;
      }

      await fetchCart();
      return { success: true, message: 'Product added to cart!' };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, message: 'Failed to add to cart' };
    }
  }, [sessionId, fetchCart]);

  const removeFromCart = useCallback(async (cartItemId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)
        .eq('session_id', sessionId);

      if (error) throw error;
      await fetchCart();
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  }, [sessionId, fetchCart]);

  const updateQuantity = useCallback(async (cartItemId: string, quantity: number): Promise<boolean> => {
    try {
      if (quantity <= 0) {
        return removeFromCart(cartItemId);
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)
        .eq('session_id', sessionId);

      if (error) throw error;
      await fetchCart();
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      return false;
    }
  }, [sessionId, fetchCart, removeFromCart]);

  const clearCart = useCallback(async (): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('session_id', sessionId);

      if (error) throw error;
      await fetchCart();
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  }, [sessionId, fetchCart]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cartItems,
    cartCount,
    cartTotal,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    fetchCart,
  };
};
