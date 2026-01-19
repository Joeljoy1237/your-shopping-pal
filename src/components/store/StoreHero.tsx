import { ShoppingBag, Truck, Shield, Headphones } from 'lucide-react';

export const StoreHero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/30">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.05)_0%,transparent_50%)]" />
      
      <div className="container mx-auto px-4 py-16 lg:py-24 relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            <ShoppingBag className="w-4 h-4" />
            <span>Your Trusted Shopping Destination</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Shop Smarter with
            <span className="text-primary"> 24/7 Support</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Discover amazing products with confidence. Our AI-powered assistant is always here to help you find the perfect item, track your orders, and answer any questions.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-soft hover:shadow-elevated active:scale-[0.98]">
              Start Shopping
            </button>
            <button className="px-8 py-3 bg-card text-foreground border border-border rounded-xl font-semibold hover:border-primary hover:text-primary transition-all shadow-soft active:scale-[0.98]">
              View Deals
            </button>
          </div>
        </div>
        
        {/* Trust badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="flex flex-col items-center p-4 bg-card rounded-xl border border-border shadow-soft">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground text-sm">Free Shipping</h3>
            <p className="text-xs text-muted-foreground text-center">On orders over $50</p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-card rounded-xl border border-border shadow-soft">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground text-sm">Secure Checkout</h3>
            <p className="text-xs text-muted-foreground text-center">100% protected</p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-card rounded-xl border border-border shadow-soft">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
              <Headphones className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground text-sm">24/7 Support</h3>
            <p className="text-xs text-muted-foreground text-center">Always here to help</p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-card rounded-xl border border-border shadow-soft">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-3">
              <span className="text-xl">↩️</span>
            </div>
            <h3 className="font-semibold text-foreground text-sm">Easy Returns</h3>
            <p className="text-xs text-muted-foreground text-center">30-day guarantee</p>
          </div>
        </div>
      </div>
    </section>
  );
};
