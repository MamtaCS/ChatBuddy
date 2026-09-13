import React from 'react';

export const Navbar = ({ onClearChat, hasMessages }) => {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        {/* Glowing Brand Icon */}
        <div className="brand-icon-wrapper" title="ChatBuddy AI">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="10" rx="3" />
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7v4" />
            <line x1="8" y1="16" x2="8" y2="16.01" strokeWidth="3" />
            <line x1="16" y1="16" x2="16.01" strokeWidth="3" />
          </svg>
        </div>

        {/* Brand Information */}
        <div className="brand-info">
          <div className="brand-title-row">
            <h1 className="brand-name">ChatBuddy</h1>
            <span className="brand-badge">AI Assistant</span>
          </div>
          <div className="status-badge">
            <span className="status-dot"></span>
            <span>Online</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="navbar-actions">
        <button 
          className="clear-btn" 
          onClick={onClearChat}
          disabled={!hasMessages}
          title={hasMessages ? "Clear all conversation history" : "Conversation is already empty"}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          <span>Clear Chat</span>
        </button>
      </div>
    </header>
  );
};
