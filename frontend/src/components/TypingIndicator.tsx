export const TypingIndicator = () => {
  return (
    <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-card text-card-foreground border border-border p-4 rounded-2xl rounded-tl-sm shadow-soft flex items-center gap-1.5">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce-dot animate-bounce-dot-1"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce-dot animate-bounce-dot-2"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce-dot"></div>
      </div>
    </div>
  );
};