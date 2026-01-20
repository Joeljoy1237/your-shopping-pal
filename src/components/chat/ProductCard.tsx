import { Product } from '@/types/chat';
import { Star, Eye, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
  isAddingToCart?: boolean;
}

export const ProductCard = ({ 
  product, 
  onViewDetails, 
  onAddToCart,
  isAddingToCart 
}: ProductCardProps) => {
  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-soft hover:shadow-elevated transition-shadow duration-200">
      <div className="flex items-start gap-3">
        <div className="text-3xl">{product.image}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate">{product.name}</h4>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3.5 h-3.5 fill-accent text-accent" />
            <span className="text-xs text-muted-foreground">{product.rating}</span>
          </div>
          <p className="text-lg font-bold text-primary mt-1">${product.price}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {product.specs.slice(0, 3).map((spec, index) => (
          <span
            key={index}
            className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md"
          >
            {spec}
          </span>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        {onViewDetails && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => onViewDetails(product.id)}
          >
            <Eye className="w-3.5 h-3.5" />
            Details
          </Button>
        )}
        {onAddToCart && (
          <Button
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => onAddToCart(product.id)}
            disabled={isAddingToCart}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {isAddingToCart ? 'Adding...' : 'Add'}
          </Button>
        )}
      </div>
    </div>
  );
};
