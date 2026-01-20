import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DatabaseOrder {
  id: string;
  order_id: string;
  status: string;
  estimated_delivery: string | null;
  last_update: string | null;
  location: string | null;
  total_amount: number | null;
}

export const useOrders = () => {
  const getOrderByOrderId = useCallback(async (orderId: string): Promise<DatabaseOrder | null> => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_id', orderId.toUpperCase())
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  }, []);

  return {
    getOrderByOrderId,
  };
};
