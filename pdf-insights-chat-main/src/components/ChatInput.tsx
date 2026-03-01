import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatInputProps {
  disabled: boolean;
  onSend: (message: string) => void;
  isLoading: boolean;
}

const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    <div className="h-2 w-2 rounded-full bg-muted-foreground typing-dot" />
    <div className="h-2 w-2 rounded-full bg-muted-foreground typing-dot" />
    <div className="h-2 w-2 rounded-full bg-muted-foreground typing-dot" />
  </div>
);

export const ChatBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in-up`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card text-card-foreground shadow-[var(--chat-shadow)]"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export const ChatMessages = ({
  messages,
  isLoading,
}: {
  messages: ChatMessage[];
  isLoading: boolean;
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col gap-3 overflow-y-auto px-1 py-4" style={{ maxHeight: "50vh" }}>
      {messages.map((msg, i) => (
        <ChatBubble key={i} message={msg} />
      ))}
      {isLoading && (
        <div className="flex justify-start animate-fade-in-up">
          <div className="rounded-2xl bg-card shadow-[var(--chat-shadow)]">
            <TypingIndicator />
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

const ChatInput = ({ disabled, onSend, isLoading }: ChatInputProps) => {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled || isLoading) return;
    onSend(trimmed);
    setValue("");
  };

  return (
    <div
      className={`flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-[var(--chat-shadow)] transition-opacity ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder={disabled ? "Upload a PDF to start chatting…" : "Ask about your PDFs…"}
        disabled={disabled}
        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || isLoading || !value.trim()}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:opacity-90 active:scale-95 disabled:opacity-30"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ChatInput;
export type { ChatMessage };
