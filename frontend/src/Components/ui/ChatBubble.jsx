import React from 'react';

const ChatBubble = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Open chat assistant"
      className="fixed top-24 right-6 z-50 h-12 w-12 rounded-full shadow-lg flex items-center justify-center bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--accent)] transition-colors"
    >
      {/* Simple chat icon */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
        <path d="M12 3C6.477 3 2 6.94 2 11.8c0 2.3 1.111 4.383 2.92 5.914-.083.77-.36 1.86-1.096 2.915-.16.224-.038.543.23.586 1.71.279 3.105-.26 4.018-.856A11.31 11.31 0 0 0 12 20.6c5.523 0 10-3.94 10-8.8S17.523 3 12 3z" />
      </svg>
    </button>
  );
};

export default ChatBubble;


