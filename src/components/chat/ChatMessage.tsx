import { ChatMessage as ChatMessageType, ChatOption, Product } from '@/types/chat';
import { ChatBubble } from './ChatBubble';
import { ChatOptions } from './ChatOptions';
import { ProductCard } from './ProductCard';
import { OrderStatusCard } from './OrderStatusCard';
import { ProductDetailCard } from './ProductDetailCard';
import { CartSummaryCard } from './CartSummaryCard';
import { SupportEmailCard } from './SupportEmailCard';
import { CartItem } from '@/hooks/useCart';

interface ChatMessageProps {
  message: ChatMessageType;
  onOptionSelect: (option: ChatOption) => void;
  onViewProductDetails?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
  onAddToCartFromDetail?: () => void;
  onBackFromDetail?: () => void;
  isAddingToCart?: boolean;
  // Cart props
  cartItems?: CartItem[];
  cartTotal?: number;
  onRemoveFromCart?: (cartItemId: string) => void;
  onUpdateCartQuantity?: (cartItemId: string, quantity: number) => void;
  onContinueShopping?: () => void;
  onCheckout?: () => void;
  // Support email props
  onSendSupportEmail?: (email: string) => void;
  onBackFromSupport?: () => void;
}

export const ChatMessage = ({ 
  message, 
  onOptionSelect,
  onViewProductDetails,
  onAddToCart,
  onAddToCartFromDetail,
  onBackFromDetail,
  isAddingToCart,
  cartItems = [],
  cartTotal = 0,
  onRemoveFromCart,
  onUpdateCartQuantity,
  onContinueShopping,
  onCheckout,
  onSendSupportEmail,
  onBackFromSupport,
}: ChatMessageProps) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex flex-col gap-3 ${isUser ? 'items-end' : 'items-start'}`}>
      {/* Main message bubble */}
      <ChatBubble content={message.content} sender={message.sender} />

      {/* Product results */}
      {message.type === 'product-results' && message.products && (
        <div className="w-full space-y-3 animate-message-in">
          {message.products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              onViewDetails={onViewProductDetails}
              onAddToCart={onAddToCart}
              isAddingToCart={isAddingToCart}
            />
          ))}
        </div>
      )}

      {/* Product detail view */}
      {message.type === 'product-detail' && message.productDetail && (
        <ProductDetailCard
          product={message.productDetail as any}
          onAddToCart={onAddToCartFromDetail || (() => {})}
          onBack={onBackFromDetail || (() => {})}
          isAddingToCart={isAddingToCart}
        />
      )}

      {/* Cart summary */}
      {message.type === 'cart-summary' && (
        <CartSummaryCard
          cartItems={cartItems}
          cartTotal={cartTotal}
          onRemoveItem={onRemoveFromCart || (() => {})}
          onUpdateQuantity={onUpdateCartQuantity || (() => {})}
          onContinueShopping={onContinueShopping || (() => {})}
          onCheckout={onCheckout || (() => {})}
        />
      )}

      {/* Support email composer */}
      {message.type === 'support-email' && message.supportEmail && (
        <SupportEmailCard
          subject={message.supportEmail.subject}
          body={message.supportEmail.body}
          issueType={message.supportEmail.issueType}
          onSendEmail={onSendSupportEmail || (() => {})}
          onBack={onBackFromSupport || (() => {})}
        />
      )}

      {/* Order status */}
      {message.type === 'order-status' && message.orderStatus && (
        <OrderStatusCard orderStatus={message.orderStatus} />
      )}

      {/* Options */}
      {message.options && message.options.length > 0 && (
        <ChatOptions
          options={message.options}
          onSelect={onOptionSelect}
          variant={message.type === 'quick-actions' ? 'grid' : 'default'}
        />
      )}
    </div>
  );
};
