import { Star } from 'lucide-react';
import { products } from '@/data/products';

export const FeaturedProducts = () => {
  const featuredProducts = products.slice(0, 6);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">Featured Products</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Handpicked selections from our top-rated categories. Need help choosing? Ask our chat assistant!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-card rounded-2xl border border-border p-6 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-6xl mb-4 text-center">{product.image}</div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full capitalize">
                  {product.category}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="text-sm text-muted-foreground">{product.rating}</span>
                </div>
              </div>
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {product.specs.slice(0, 2).map((spec, index) => (
                  <span
                    key={index}
                    className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md"
                  >
                    {spec}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">${product.price}</span>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors active:scale-[0.98]">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="px-8 py-3 bg-secondary text-secondary-foreground rounded-xl font-semibold hover:bg-secondary/80 transition-all border border-border active:scale-[0.98]">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};
