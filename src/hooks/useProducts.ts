import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DatabaseProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  specs: string[];
  description: string | null;
  availability: string | null;
  warranty: string | null;
}

export const useProducts = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getProductById = useCallback(async (productId: string): Promise<DatabaseProduct | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }, []);

  const getFilteredProducts = useCallback(async (
    category?: string,
    budget?: string,
    usage?: string
  ): Promise<DatabaseProduct[]> => {
    setIsLoading(true);
    try {
      let query = supabase.from('products').select('*');

      if (category) {
        query = query.eq('category', category.toLowerCase());
      }

      const { data, error } = await query;
      if (error) throw error;

      let filtered = data || [];

      // Apply budget filter
      if (budget) {
        const budgetRanges: Record<string, [number, number]> = {
          'under-500': [0, 500],
          '500-1000': [500, 1000],
          '1000-1500': [1000, 1500],
          'over-1500': [1500, Infinity],
        };
        const range = budgetRanges[budget];
        if (range) {
          filtered = filtered.filter((p) => p.price >= range[0] && p.price < range[1]);
        }
      }

      // Apply usage filter
      if (usage) {
        const usageKeywords: Record<string, string[]> = {
          student: ['Student', 'Budget', 'Air'],
          office: ['Pro', 'Elite', 'WorkStation', 'Ultra'],
          gaming: ['Game', 'Force', 'Max'],
          daily: ['Budget', 'Pixel', 'OnePlus'],
        };
        const keywords = usageKeywords[usage] || [];
        if (keywords.length > 0) {
          filtered = filtered.filter((p) =>
            keywords.some((kw) => p.name.toLowerCase().includes(kw.toLowerCase()))
          );
        }
      }

      return filtered.length > 0 ? filtered.slice(0, 3) : (data || []).slice(0, 3);
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAllProducts = useCallback(async (): Promise<DatabaseProduct[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all products:', error);
      return [];
    }
  }, []);

  return {
    isLoading,
    getProductById,
    getFilteredProducts,
    getAllProducts,
  };
};
