import { Product } from '@/types/chat';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
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
      <button className="w-full mt-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors active:scale-[0.98]">
        View Details
      </button>
    </div>
  );
};
