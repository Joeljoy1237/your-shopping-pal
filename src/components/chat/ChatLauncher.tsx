import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatLauncherProps {
  onClick: () => void;
  hasUnread?: boolean;
}

export const ChatLauncher = ({ onClick, hasUnread = false }: ChatLauncherProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground',
        'flex items-center justify-center shadow-chat',
        'hover:scale-105 active:scale-95 transition-all duration-200',
        'focus:outline-none focus:ring-4 focus:ring-primary/30'
      )}
      aria-label="Open chat"
    >
      <MessageCircle className="w-6 h-6" />
      {hasUnread && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center animate-pulse-soft">
          1
        </span>
      )}
    </button>
  );
};
