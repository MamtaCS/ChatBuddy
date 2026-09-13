import React, { useState, useRef, useEffect } from 'react';

export const ChatInput = ({ onSendMessage, isTyping }) => {
  const [inputText, setInputText] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    // Keep input focused after bot finishes typing
    if (!isTyping && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTyping]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form className="input-box-wrapper" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        className="chat-input-field"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isTyping ? "ChatBuddy is responding..." : "Type your message..."}
        disabled={isTyping}
        aria-label="Type your message"
      />

      <button
        type="submit"
        className="send-btn"
        disabled={!inputText.trim() || isTyping}
        title="Send message (Enter)"
        aria-label="Send message"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </form>
  );
};
