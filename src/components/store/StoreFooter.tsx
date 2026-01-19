import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export const StoreFooter = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-background transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-background transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Shipping</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Returns</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-background transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Accessibility</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li>1-800-SHOP-HELP</li>
              <li>support@shophelp.com</li>
              <li className="pt-2">
                <div className="flex items-center gap-3">
                  <a href="#" className="hover:text-background transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="#" className="hover:text-background transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="hover:text-background transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="hover:text-background transition-colors">
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-background/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center">
              <span className="text-foreground font-bold">S</span>
            </div>
            <span className="font-bold text-lg">ShopSmart</span>
          </div>
          <p className="text-sm text-background/60 text-center">
            © 2026 ShopSmart. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" className="h-6 opacity-70" />
            <img src="https://img.icons8.com/color/48/mastercard-logo.png" alt="Mastercard" className="h-6 opacity-70" />
            <img src="https://img.icons8.com/color/48/paypal.png" alt="PayPal" className="h-6 opacity-70" />
          </div>
        </div>
      </div>
    </footer>
  );
};
