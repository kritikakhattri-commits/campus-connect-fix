import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Bot, Menu, Send, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { askCampusFix } from "@/lib/campus-assistant.functions";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/", label: "How it Works", hash: "how-it-works" },
  { to: "/updates", label: "Campus Pulse" },
  { to: "/my-issues", label: "My Issues" },
] as const;

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <span className="relative grid size-8 grid-cols-2 gap-1 rounded-full border border-foreground/15 p-1.5">
        <span className="rounded-full bg-foreground" />
        <span className="rounded-full bg-accent" />
        <span className="rounded-full bg-foreground/45" />
        <span className="rounded-full bg-foreground" />
      </span>
      <span className="text-[13px] font-medium uppercase tracking-[0.08em]">Campus-Fix</span>
    </span>
  );
}

export function StudentShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="relative sticky top-0 z-40 bg-background/92 backdrop-blur">
        <div className="mx-auto flex h-[4.5rem] max-w-[1500px] items-center gap-8 px-5 sm:px-8">
          <Link to="/" className="shrink-0">
            <Wordmark />
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-border bg-card px-1.5 py-1.5 lg:flex">
            {NAV.map((item) => (
              <Link
                key={`${item.to}-${item.label}`}
                to={item.to}
                hash={"hash" in item ? item.hash : undefined}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-full px-4 py-2 text-[13px] text-muted-foreground hover:text-foreground"
                activeProps={
                  item.label === "Home" ? { className: "bg-muted text-foreground" } : undefined
                }
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/report"
              reloadDocument
              className="rounded-full border border-foreground/20 px-4 py-2 text-[13px] text-foreground hover:border-foreground"
            >
              Report
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/report"
              reloadDocument
              className="group hidden h-11 items-center gap-2 rounded-full bg-foreground px-5 text-[13px] font-medium text-background sm:inline-flex"
            >
              Report Issue
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <button
              type="button"
              onClick={() => setAssistantOpen((value) => !value)}
              className="hidden size-9 place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted sm:grid"
              aria-label="Open Campus-Fix Assistant"
              aria-expanded={assistantOpen}
              aria-controls="campus-fix-assistant"
            >
              <Bot className="size-4" />
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              className="grid size-10 place-items-center rounded-full border border-border bg-card lg:hidden"
              aria-label="Toggle navigation"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="border-t border-border bg-background px-5 py-3 lg:hidden">
            {[...NAV, { to: "/report", label: "Report Issue" } as const].map((item) => (
              <Link
                key={`${item.to}-${item.label}`}
                to={item.to}
                hash={"hash" in item ? item.hash : undefined}
                reloadDocument={item.to === "/report"}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                activeProps={
                  item.label === "Home"
                    ? { className: "bg-muted text-foreground font-medium" }
                    : undefined
                }
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {assistantOpen && <CampusAssistantPanel onClose={() => setAssistantOpen(false)} />}
      </header>

      <main>{children}</main>

      <footer className="py-8">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-1 px-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>Campus-Fix — Report. Route. Resolve.</span>
          <span>Serving 20,000+ students across campus</span>
        </div>
      </footer>
    </div>
  );
}

type AssistantMessage = {
  role: "user" | "assistant";
  text: string;
  action?: "report" | "status" | null;
};

const assistantQuickActions = [
  "Report an issue",
  "Check issue status",
  "Which department handles this?",
  "How does Campus-Fix work?",
];

function CampusAssistantPanel({ onClose }: { onClose: () => void }) {
  const askAssistant = useServerFn(askCampusFix);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    { role: "assistant", text: "Hi! How can I help with your campus issue?" },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  const sendMessage = async (rawMessage: string) => {
    const message = rawMessage.trim();
    if (!message || pending) return;

    setInput("");
    setMessages((current) => [...current, { role: "user", text: message }]);
    setPending(true);

    try {
      const response = await askAssistant({ data: { message } });
      setMessages((current) => [
        ...current,
        { role: "assistant", text: response.reply, action: response.action },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "I’m having trouble connecting right now. You can still use Report Issue to submit a campus problem.",
          action: "report",
        },
      ]);
    } finally {
      setPending(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  return (
    <section
      id="campus-fix-assistant"
      className="assistant-panel absolute right-5 top-[4.75rem] z-50 flex max-h-[min(550px,calc(100vh-6rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[1.35rem] border border-border bg-card text-foreground shadow-xl"
      aria-label="Campus-Fix Assistant"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full bg-accent text-foreground">
            <Bot className="size-4" />
          </span>
          <div>
            <p className="text-sm font-medium">Campus-Fix Assistant</p>
            <p className="text-xs text-muted-foreground">Here to help</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close Campus-Fix Assistant"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4 text-sm">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={cn("flex", message.role === "user" && "justify-end")}
          >
            <div
              className={cn(
                "max-w-[88%] rounded-2xl px-3.5 py-2.5 leading-5",
                message.role === "user"
                  ? "rounded-br-md bg-foreground text-background"
                  : "rounded-bl-md bg-muted text-foreground",
              )}
            >
              <p>{message.text}</p>
              {message.action === "report" && (
                <Link
                  to="/report"
                  reloadDocument
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium underline underline-offset-4"
                >
                  Start Report <ArrowRight className="size-3" />
                </Link>
              )}
              {message.action === "status" && (
                <Link
                  to="/my-issues"
                  reloadDocument
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium underline underline-offset-4"
                >
                  View My Issues <ArrowRight className="size-3" />
                </Link>
              )}
            </div>
          </div>
        ))}
        {pending && (
          <div className="flex">
            <div
              className="rounded-2xl rounded-bl-md bg-muted px-3.5 py-3"
              aria-label="Assistant is typing"
            >
              <span className="assistant-dot" />
              <span className="assistant-dot animation-delay-150" />
              <span className="assistant-dot animation-delay-300" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 border-t border-border px-5 py-3">
          {assistantQuickActions.map((action) => (
            <button
              key={action}
              type="button"
              onClick={() => void sendMessage(action)}
              className="rounded-full border border-border px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-muted hover:text-foreground"
            >
              {action}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border p-3">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask Campus-Fix anything…"
          className="h-10 min-w-0 flex-1 rounded-full bg-muted px-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-accent"
          aria-label="Ask Campus-Fix anything"
        />
        <button
          type="submit"
          disabled={!input.trim() || pending}
          className="grid size-10 shrink-0 place-items-center rounded-full bg-foreground text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Send message"
        >
          <Send className="size-4" />
        </button>
      </form>
    </section>
  );
}
