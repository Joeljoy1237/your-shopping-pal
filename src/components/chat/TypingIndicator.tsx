export const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-secondary rounded-2xl rounded-bl-md w-fit animate-message-in">
      <div className="w-2 h-2 bg-muted-foreground/60 rounded-full typing-dot" />
      <div className="w-2 h-2 bg-muted-foreground/60 rounded-full typing-dot" />
      <div className="w-2 h-2 bg-muted-foreground/60 rounded-full typing-dot" />
    </div>
  );
};
