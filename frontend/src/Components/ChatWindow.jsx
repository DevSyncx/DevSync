// frontend/src/components/ChatWindow.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaPaperPlane } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import ChatMessage from "./ChatMessage";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  // create/restore userId
  useEffect(() => {
    let id = localStorage.getItem("devsync_userId");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("devsync_userId", id);
    }

    // load local history if any
    const saved = localStorage.getItem("devsync_messages");
    if (saved) {
      try { setMessages(JSON.parse(saved)); } catch (e) {}
    }

    // optional: try to fetch history from backend if implemented
    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/chatbot/${id}`);
        if (res?.data?.messages) setMessages(res.data.messages);
      } catch (err) {
        // ignore; backend history optional
      }
    })();
  }, []);

  // persist + autoscroll
  useEffect(() => {
    localStorage.setItem("devsync_messages", JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    const message = text.trim();
    if (!message) return;
    const userId = localStorage.getItem("devsync_userId");

    // optimistic UX
    const userMsg = { sender: "user", text: message, timestamp: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    setText("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/chatbot`, { userId, message }, { timeout: 60000 });
      const botText = res?.data?.reply || res?.data?.botMessage || "No reply.";
      const botMsg = { sender: "bot", text: botText, timestamp: new Date().toISOString() };
      setMessages((m) => [...m, botMsg]);
    } catch (err) {
      console.error("Chat send error:", err?.response?.data || err?.message);
      setMessages((m) => [...m, { sender: "bot", text: "⚠️ Server error. Try again later.", timestamp: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-80 max-w-xs h-[28rem] bg-white shadow-xl rounded-lg flex flex-col overflow-hidden">
      {/* header */}
      <div className="flex items-center justify-between bg-blue-600 text-white px-3 py-2">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M12 3C7 3 3.5 6.5 3.5 10.5C3.5 12.7 4.6 14.7 6.4 16L6 19L9.2 17.9C10.5 18.3 11.7 18.5 13 18.5C18 18.5 21.5 15 21.5 11C21.5 6.5 18 3 13 3H12Z" fill="white"/></svg>
          <span className="font-semibold">DevSync Chatbot</span>
        </div>
        <button onClick={onClose} className="text-sm px-2 py-1">Close</button>
      </div>

      {/* messages */}
      <div ref={scrollRef} className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
        {messages.length === 0 && <div className="text-sm text-gray-500">Hi — ask me about your commits, problems solved, or streaks.</div>}
        {messages.map((m, i) => <ChatMessage key={i} sender={m.sender} text={m.text} />)}
      </div>

      {/* input */}
      <div className="p-2 border-t bg-white">
        <div className="flex gap-2">
          <textarea
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a message..."
            className="flex-1 border rounded-md px-2 py-1 text-sm resize-none focus:outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            aria-label="Send message"
            className="bg-blue-600 text-white px-3 py-1 rounded-md disabled:opacity-60 flex items-center gap-2"
          >
            <FaPaperPlane />
          </button>
        </div>
        {loading && <div className="text-xs text-gray-500 mt-1">Thinking…</div>}
      </div>
    </div>
  );
}
