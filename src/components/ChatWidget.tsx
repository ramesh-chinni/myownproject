import { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";

// Simple direct-from-browser setup for local preview/testing only.
// The API key is read from .env (VITE_ANTHROPIC_API_KEY) and IS visible in
// browser devtools — fine for you to test locally, NOT safe for a public
// deployed site. See the note in .env.example for details.
const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;
const MODEL = "claude-sonnet-4-5-20250929";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const { products, orders, user, profile } = useApp();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi! I'm your MyShop assistant. Ask me about products, sizing, stock, or your order status. 🙂",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, loading]);

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    if (!ANTHROPIC_API_KEY) {
      setError("No API key found. Add VITE_ANTHROPIC_API_KEY to your .env file and restart the dev server.");
      setLoading(false);
      return;
    }

    try {
      const productBlock = products
        .slice(0, 60)
        .map((p) => `#${p.id} ${p.name} — $${p.price} — ${p.category} — ${p.inStock ? "In stock" : "Out of stock"}`)
        .join("\n");

      const orderBlock = orders.length
        ? orders
            .slice(0, 10)
            .map(
              (o) =>
                `Order ${o.id} — status: ${o.status} — total: $${o.total} — items: ${(o.items || [])
                  .map((i) => `${i.quantity}x ${i.product_name}`)
                  .join(", ")}`
            )
            .join("\n")
        : "The customer is not logged in, or has no orders yet.";

      const userName = profile?.full_name || user?.user_metadata?.full_name || null;

      const systemPrompt = `You are the friendly customer-support assistant for "MyShop", an online store.
Help customers with product questions, sizing/availability, order status, and general shopping help.

Rules:
- Only recommend or reference products from the catalog below — never invent products, prices, or stock status.
- If asked about an order, use the order history below. If you don't see the order, say so.
- Keep answers short, warm, and to the point (2-4 sentences unless asked for detail).
${userName ? `- The customer's name is ${userName}; you may greet them by name.` : ""}

CURRENT PRODUCT CATALOG:
${productBlock}

CUSTOMER'S RECENT ORDERS:
${orderBlock}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 500,
          system: systemPrompt,
          messages: nextMessages.slice(-20),
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        console.error("Anthropic API error:", res.status, errBody);
        throw new Error("API request failed");
      }

      const data = await res.json();
      const reply =
        data.content
          ?.map((block: any) => (block.type === "text" ? block.text : ""))
          .filter(Boolean)
          .join("\n") || "Sorry, I couldn't come up with a response.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err: any) {
      console.error("Chat assistant error:", err);
      setError("Sorry, the assistant is unavailable right now. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
        className="fixed bottom-5 right-5 z-[60] w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white cursor-pointer transition-transform hover:scale-105"
        style={{ background: "var(--primary)" }}
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-5 z-[60] w-[92vw] max-w-sm h-[70vh] max-h-[560px] bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden"
          style={{ borderColor: "var(--border)" }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 text-white flex items-center gap-2 flex-shrink-0"
            style={{ background: "var(--primary)" }}
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
              M
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                MyShop Assistant
              </p>
              <p className="text-xs text-white/80 leading-tight">Ask about products or orders</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap ${
                    m.role === "user" ? "text-white rounded-br-sm" : "bg-white border rounded-bl-sm text-gray-800"
                  }`}
                  style={
                    m.role === "user"
                      ? { background: "var(--primary)" }
                      : { borderColor: "var(--border)" }
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm text-gray-400" style={{ borderColor: "var(--border)" }}>
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce" style={{ animationDelay: "0ms" }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: "150ms" }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: "300ms" }}>●</span>
                  </span>
                </div>
              </div>
            )}

            {error && <p className="text-xs text-red-500 text-center pt-1">{error}</p>}
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="flex items-center gap-2 p-2.5 border-t flex-shrink-0" style={{ borderColor: "var(--border)" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              disabled={loading}
              className="flex-1 text-sm px-3.5 py-2.5 rounded-full border outline-none"
              style={{ borderColor: "var(--border)" }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-10 h-10 flex-shrink-0 rounded-full text-white flex items-center justify-center disabled:opacity-40 cursor-pointer"
              style={{ background: "var(--primary)" }}
              aria-label="Send message"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
