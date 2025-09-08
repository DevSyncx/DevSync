// src/Components/ChatLauncher.jsx
import React, { useState } from "react";
import ChatWindow from "./ChatWindow";
import { FaComments } from "react-icons/fa";

export default function ChatLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Bubble Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition z-50"
        >
          <FaComments size={24} />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50">
          <ChatWindow onClose={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
