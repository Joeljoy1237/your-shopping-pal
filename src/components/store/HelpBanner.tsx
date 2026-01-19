import { MessageCircle, Package, Truck, HelpCircle } from 'lucide-react';

export const HelpBanner = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
      <div className="container mx-auto px-4">
        <div className="text-center text-primary-foreground mb-10">
          <h2 className="text-3xl font-bold mb-3">Need Help? We're Here!</h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto">
            Our smart assistant can help you with anything – from finding products to tracking orders.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-5 text-center hover:bg-primary-foreground/20 transition-colors cursor-pointer group">
            <MessageCircle className="w-8 h-8 text-primary-foreground mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-primary-foreground text-sm">Find Products</h3>
            <p className="text-xs text-primary-foreground/70 mt-1">Get personalized recommendations</p>
          </div>

          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-5 text-center hover:bg-primary-foreground/20 transition-colors cursor-pointer group">
            <Package className="w-8 h-8 text-primary-foreground mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-primary-foreground text-sm">Track Orders</h3>
            <p className="text-xs text-primary-foreground/70 mt-1">Real-time delivery updates</p>
          </div>

          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-5 text-center hover:bg-primary-foreground/20 transition-colors cursor-pointer group">
            <Truck className="w-8 h-8 text-primary-foreground mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-primary-foreground text-sm">Shipping Info</h3>
            <p className="text-xs text-primary-foreground/70 mt-1">Delivery options & times</p>
          </div>

          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-5 text-center hover:bg-primary-foreground/20 transition-colors cursor-pointer group">
            <HelpCircle className="w-8 h-8 text-primary-foreground mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-primary-foreground text-sm">Returns & Warranty</h3>
            <p className="text-xs text-primary-foreground/70 mt-1">Easy returns process</p>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-primary-foreground/80 text-sm mb-4">
            💬 Click the chat icon in the bottom right to get started!
          </p>
        </div>
      </div>
    </section>
  );
};
