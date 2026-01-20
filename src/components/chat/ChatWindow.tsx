import { useRef, useEffect } from 'react';
import { MessageCircle, X, Minus, ShoppingCart } from 'lucide-react';
import { useEnhancedChat } from '@/hooks/useEnhancedChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { cn } from '@/lib/utils';

interface ChatWindowProps {
  isOpen: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

export const ChatWindow = ({ isOpen, isMinimized, onClose, onMinimize }: ChatWindowProps) => {
  const {
    messages,
    isTyping,
    state,
    isAddingToCart,
    handleOptionSelect,
    handleTextInput,
    handleViewProductDetails,
    handleAddToCart,
    handleAddToCartFromDetail,
    handleBackFromDetail,
    cartItems,
    cartCount,
    cartTotal,
    handleRemoveFromCart,
    handleUpdateCartQuantity,
    handleContinueShopping,
    handleCheckout,
    handleSendSupportEmail,
    handleBackFromSupport,
  } = useEnhancedChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 flex flex-col bg-card rounded-2xl shadow-chat border border-border overflow-hidden transition-all duration-300',
        isMinimized ? 'w-72 h-14' : 'w-[380px] h-[600px] max-h-[85vh]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-foreground/20 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Shopping Assistant</h3>
            <p className="text-xs text-primary-foreground/80">Always here to help</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {cartCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-primary-foreground/20 rounded-full mr-2">
              <ShoppingCart className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{cartCount}</span>
            </div>
          )}
          <button
            onClick={onMinimize}
            className="p-1.5 hover:bg-primary-foreground/10 rounded-lg transition-colors"
            aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-primary-foreground/10 rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat body */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scrollbar bg-background">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onOptionSelect={handleOptionSelect}
                onViewProductDetails={handleViewProductDetails}
                onAddToCart={handleAddToCart}
                onAddToCartFromDetail={handleAddToCartFromDetail}
                onBackFromDetail={handleBackFromDetail}
                isAddingToCart={isAddingToCart}
                cartItems={cartItems}
                cartTotal={cartTotal}
                onRemoveFromCart={handleRemoveFromCart}
                onUpdateCartQuantity={handleUpdateCartQuantity}
                onContinueShopping={handleContinueShopping}
                onCheckout={handleCheckout}
                onSendSupportEmail={handleSendSupportEmail}
                onBackFromSupport={handleBackFromSupport}
              />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatInput
            onSend={handleTextInput}
            placeholder={
              state.flow === 'order-input'
                ? 'Enter Order ID (e.g., ORD-12345)'
                : state.flow === 'support-compose'
                ? 'Describe your issue...'
                : 'Type a message...'
            }
            disabled={!['order-input', 'support-compose', 'human-support', 'initial'].includes(state.flow)}
          />
        </>
      )}
    </div>
  );
};
