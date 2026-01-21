import { ShoppingCart, Search, User, Menu, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const StoreHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, isAuthenticated } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Sign out failed');
    } else {
      toast.success('Signed out successfully');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-xl text-foreground">ShopSmart</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Products
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Deals
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Support
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:block text-sm text-muted-foreground truncate max-w-[120px]">
                  {user?.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                title="Sign in"
              >
                <User className="w-5 h-5" />
              </Link>
            )}
            
            <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-2">
              <Link to="/" className="px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-lg">
                Home
              </Link>
              <a href="#" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg">
                Products
              </a>
              <a href="#" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg">
                Deals
              </a>
              <a href="#" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg">
                Support
              </a>
              {!isAuthenticated && (
                <Link to="/auth" className="px-4 py-2 text-sm font-medium text-primary hover:bg-secondary rounded-lg">
                  Sign In
                </Link>
              )}
              {isAuthenticated && (
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg text-left"
                >
                  Sign Out
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
