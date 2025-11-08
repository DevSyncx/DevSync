import React, { useEffect, useRef, useState } from 'react';

const ChatAssistant = ({ open, onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I can summarize your DevSync activity and nudge your productivity. Ask me anything.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (open) {
      // Optionally fetch a nudge
      const token = localStorage.getItem('token');
      if (!token) return;
      fetch(`${import.meta.env.VITE_API_URL}/api/assistant/nudge`, {
        headers: { 'x-auth-token': token }
      }).then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
      }).catch(() => {});
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);

    const token = localStorage.getItem('token');
    if (!token) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Please log in to use the assistant.' }]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/assistant/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.errors?.[0]?.msg || 'Request failed');
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'assistant', content: e.message || 'Something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-[var(--card)] text-[var(--card-foreground)] w-full max-w-lg h-[70vh] rounded-2xl shadow-xl border border-[var(--border)] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <div className="font-semibold">DevSync Assistant</div>
          <button onClick={onClose} className="text-[var(--muted-foreground)] hover:text-[var(--primary)]">✕</button>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[85%] ${m.role === 'user' ? 'ml-auto bg-[var(--primary)] text-[var(--primary-foreground)]' : 'mr-auto bg-[var(--muted)] text-[var(--muted-foreground)]'} px-3 py-2 rounded-xl whitespace-pre-wrap`}>{m.content}</div>
          ))}
          {loading && <div className="mr-auto bg-[var(--muted)] text-[var(--muted-foreground)] px-3 py-2 rounded-xl">Thinking…</div>}
        </div>
        <div className="p-3 border-t border-[var(--border)] flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Ask about streaks, activity, goals…"
            className="flex-1 px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--input)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
          <button onClick={send} className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--accent)]">Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;


