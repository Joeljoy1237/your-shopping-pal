import { CartItem } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';

interface CartSummaryCardProps {
  cartItems: CartItem[];
  cartTotal: number;
  onRemoveItem: (cartItemId: string) => void;
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onContinueShopping: () => void;
  onCheckout: () => void;
  isUpdating?: boolean;
}

export const CartSummaryCard = ({
  cartItems,
  cartTotal,
  onRemoveItem,
  onUpdateQuantity,
  onContinueShopping,
  onCheckout,
  isUpdating,
}: CartSummaryCardProps) => {
  if (cartItems.length === 0) {
    return (
      <div className="w-full bg-card rounded-xl border border-border/50 p-6 text-center animate-message-in">
        <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="font-semibold text-foreground mb-2">Your cart is empty</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Start shopping to add items to your cart!
        </p>
        <Button onClick={onContinueShopping} size="sm">
          🔍 Find Products
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-card rounded-xl border border-border/50 overflow-hidden animate-message-in">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-primary/10 to-transparent border-b border-border/30">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Your Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
          </h3>
        </div>
      </div>

      {/* Cart Items */}
      <div className="divide-y divide-border/30">
        {cartItems.map((item) => (
          <div key={item.id} className="p-4 flex items-center gap-3">
            <span className="text-2xl">{item.product?.image}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm truncate">
                {item.product?.name}
              </p>
              <p className="text-primary font-semibold">
                ${(item.product?.price || 0).toFixed(2)}
              </p>
            </div>
            
            {/* Quantity controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={isUpdating}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                disabled={isUpdating}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => onRemoveItem(item.id)}
              disabled={isUpdating}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="p-4 bg-muted/30 border-t border-border/30">
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-xl font-bold text-foreground">${cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onContinueShopping}
            className="flex-1"
          >
            Continue Shopping
          </Button>
          <Button
            size="sm"
            onClick={onCheckout}
            className="flex-1"
          >
            Checkout →
          </Button>
        </div>
      </div>
    </div>
  );
};
