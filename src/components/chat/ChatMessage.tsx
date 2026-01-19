import { ChatMessage as ChatMessageType, ChatOption } from '@/types/chat';
import { ChatBubble } from './ChatBubble';
import { ChatOptions } from './ChatOptions';
import { ProductCard } from './ProductCard';
import { OrderStatusCard } from './OrderStatusCard';

interface ChatMessageProps {
  message: ChatMessageType;
  onOptionSelect: (option: ChatOption) => void;
}

export const ChatMessage = ({ message, onOptionSelect }: ChatMessageProps) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex flex-col gap-3 ${isUser ? 'items-end' : 'items-start'}`}>
      {/* Main message bubble */}
      <ChatBubble content={message.content} sender={message.sender} />

      {/* Product results */}
      {message.type === 'product-results' && message.products && (
        <div className="w-full space-y-3 animate-message-in">
          {message.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
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
