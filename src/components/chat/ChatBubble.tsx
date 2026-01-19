import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  content: string;
  sender: 'user' | 'bot';
}

export const ChatBubble = ({ content, sender }: ChatBubbleProps) => {
  const isUser = sender === 'user';

  // Parse markdown-like bold text
  const parseContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div
      className={cn(
        'max-w-[85%] rounded-2xl px-4 py-3 animate-message-in',
        isUser
          ? 'bg-primary text-primary-foreground ml-auto rounded-br-md'
          : 'bg-secondary text-secondary-foreground rounded-bl-md'
      )}
    >
      <div className="text-sm leading-relaxed whitespace-pre-line">
        {parseContent(content)}
      </div>
    </div>
  );
};
