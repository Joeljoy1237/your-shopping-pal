import { Product } from '@/types/chat';

export const products: Product[] = [
  // Laptops
  {
    id: 'laptop-1',
    name: 'ProBook Elite 15',
    price: 899,
    image: '💻',
    category: 'laptop',
    rating: 4.7,
    specs: ['Intel i7', '16GB RAM', '512GB SSD', '15.6" FHD'],
  },
  {
    id: 'laptop-2',
    name: 'StudentBook Air',
    price: 549,
    image: '💻',
    category: 'laptop',
    rating: 4.5,
    specs: ['Intel i5', '8GB RAM', '256GB SSD', '14" HD'],
  },
  {
    id: 'laptop-3',
    name: 'GameForce X17',
    price: 1499,
    image: '🎮',
    category: 'laptop',
    rating: 4.9,
    specs: ['RTX 4070', '32GB RAM', '1TB SSD', '17.3" 165Hz'],
  },
  {
    id: 'laptop-4',
    name: 'UltraSlim Pro',
    price: 1199,
    image: '💻',
    category: 'laptop',
    rating: 4.8,
    specs: ['Apple M2', '16GB RAM', '512GB SSD', '13.3" Retina'],
  },
  {
    id: 'laptop-5',
    name: 'WorkStation Max',
    price: 1899,
    image: '🖥️',
    category: 'laptop',
    rating: 4.6,
    specs: ['Intel i9', '64GB RAM', '2TB SSD', '16" 4K'],
  },
  // Phones
  {
    id: 'phone-1',
    name: 'Galaxy Ultra S24',
    price: 1199,
    image: '📱',
    category: 'phone',
    rating: 4.8,
    specs: ['6.8" AMOLED', '256GB', '200MP Camera', '5000mAh'],
  },
  {
    id: 'phone-2',
    name: 'iPhone 15 Pro',
    price: 999,
    image: '📱',
    category: 'phone',
    rating: 4.9,
    specs: ['6.1" Super Retina', '128GB', 'A17 Pro', '48MP Camera'],
  },
  {
    id: 'phone-3',
    name: 'Pixel 8 Pro',
    price: 899,
    image: '📱',
    category: 'phone',
    rating: 4.7,
    specs: ['6.7" LTPO', '128GB', 'Tensor G3', 'Best-in-class AI'],
  },
  {
    id: 'phone-4',
    name: 'OnePlus 12',
    price: 799,
    image: '📱',
    category: 'phone',
    rating: 4.6,
    specs: ['6.82" AMOLED', '256GB', 'Snapdragon 8 Gen 3', '100W Charging'],
  },
  {
    id: 'phone-5',
    name: 'Budget Pro A54',
    price: 349,
    image: '📱',
    category: 'phone',
    rating: 4.3,
    specs: ['6.4" AMOLED', '128GB', '50MP Camera', '5000mAh'],
  },
];

export const getFilteredProducts = (
  category?: string,
  budget?: string,
  usage?: string
): Product[] => {
  let filtered = [...products];

  if (category) {
    filtered = filtered.filter((p) => p.category === category.toLowerCase());
  }

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

  return filtered.length > 0 ? filtered.slice(0, 3) : products.slice(0, 3);
};
