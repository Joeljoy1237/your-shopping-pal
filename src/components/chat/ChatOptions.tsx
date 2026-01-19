import { ChatOption } from '@/types/chat';
import { cn } from '@/lib/utils';

interface ChatOptionsProps {
  options: ChatOption[];
  onSelect: (option: ChatOption) => void;
  variant?: 'default' | 'grid' | 'inline';
}

export const ChatOptions = ({ options, onSelect, variant = 'default' }: ChatOptionsProps) => {
  return (
    <div
      className={cn(
        'animate-message-in',
        variant === 'grid' && 'grid grid-cols-2 gap-2',
        variant === 'inline' && 'flex flex-wrap gap-2',
        variant === 'default' && 'flex flex-col gap-2'
      )}
    >
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option)}
          className={cn(
            'px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200',
            'bg-card border border-border hover:border-primary hover:bg-primary/5',
            'text-foreground hover:text-primary',
            'shadow-soft hover:shadow-elevated',
            'active:scale-[0.98]'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
