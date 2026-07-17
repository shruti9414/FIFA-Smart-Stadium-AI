export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 rounded-md rounded-tl-xs border-l-2 border-l-accent-cyan bg-accent-cyan/5 px-3.5 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-accent-cyan animate-pulse-glow"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}
