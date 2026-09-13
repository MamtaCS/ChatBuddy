import React from 'react';

export const TypingIndicator = () => {
  return (
    <div className="message-row bot" aria-label="ChatBuddy is typing">
      {/* Bot Avatar */}
      <div className="bot-avatar-small" title="ChatBuddy">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="10" rx="3" />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4" />
          <circle cx="9" cy="16" r="1" fill="currentColor" />
          <circle cx="15" cy="16" r="1" fill="currentColor" />
        </svg>
      </div>

      <div className="message-content-wrapper">
        <div className="typing-bubble">
          <span className="typing-dot"></span>
          <span className="typing-dot"></span>
          <span className="typing-dot"></span>
        </div>
      </div>
    </div>
  );
};
