import { DatabaseProduct } from '@/hooks/useProducts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Package, Shield, ShoppingCart } from 'lucide-react';

interface ProductDetailCardProps {
  product: DatabaseProduct;
  onAddToCart: () => void;
  onBack: () => void;
  isAddingToCart?: boolean;
}

export const ProductDetailCard = ({ 
  product, 
  onAddToCart, 
  onBack,
  isAddingToCart 
}: ProductDetailCardProps) => {
  const getAvailabilityBadge = () => {
    switch (product.availability) {
      case 'in-stock':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">In Stock</Badge>;
      case 'limited':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Limited Stock</Badge>;
      case 'pre-order':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Pre-order</Badge>;
      default:
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Out of Stock</Badge>;
    }
  };

  return (
    <div className="w-full bg-card rounded-xl border border-border/50 overflow-hidden animate-message-in">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-primary/10 to-transparent border-b border-border/30">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{product.image}</span>
            <div>
              <h3 className="font-semibold text-foreground">{product.name}</h3>
              <p className="text-2xl font-bold text-primary">${product.price}</p>
            </div>
          </div>
          {getAvailabilityBadge()}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">{product.rating}/5</span>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-muted-foreground">{product.description}</p>
        )}

        {/* Specifications */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            Specifications
          </h4>
          <div className="flex flex-wrap gap-2">
            {product.specs.map((spec, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {spec}
              </Badge>
            ))}
          </div>
        </div>

        {/* Warranty */}
        {product.warranty && (
          <div className="flex items-start gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <Shield className="h-4 w-4 text-green-400 mt-0.5" />
            <div>
              <span className="text-sm font-medium text-green-400">Warranty</span>
              <p className="text-xs text-muted-foreground">{product.warranty}</p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border/30 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex-1"
        >
          ← Back
        </Button>
        <Button
          size="sm"
          onClick={onAddToCart}
          disabled={isAddingToCart || product.availability === 'out-of-stock'}
          className="flex-1 gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
};
