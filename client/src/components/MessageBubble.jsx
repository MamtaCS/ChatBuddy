import React, { useState } from 'react';

export const MessageBubble = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to format simple markdown (**bold**, `code`, bullet points)
  const renderFormattedText = (text) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Bullet points
      if (line.trim().startsWith('• ') || line.trim().startsWith('- ')) {
        const content = line.trim().substring(2);
        return (
          <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(content) }} />
        );
      }
      // Numbered lists like "1. "
      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <div key={idx} style={{ margin: '4px 0 4px 12px' }} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
        );
      }
      return (
        <p key={idx} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
      );
    });
  };

  const formatInline = (str) => {
    if (!str) return '';
    return str
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Italics
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  };

  return (
    <div className={`message-row ${isUser ? 'user' : 'bot'}`}>
      {/* Bot Avatar */}
      {!isUser && (
        <div className="bot-avatar-small" title="ChatBuddy">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="10" rx="3" />
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7v4" />
            <circle cx="9" cy="16" r="1" fill="currentColor" />
            <circle cx="15" cy="16" r="1" fill="currentColor" />
          </svg>
        </div>
      )}

      {/* Bubble & Meta */}
      <div className="message-content-wrapper">
        <div className={isUser ? 'message-bubble-user' : 'message-bubble-bot'}>
          <div className="message-text">
            {isUser ? message.text : renderFormattedText(message.text)}
          </div>
        </div>

        {/* Message Meta (Timestamp & Copy) */}
        <div className="message-meta">
          <span className="message-timestamp">{message.timestamp}</span>
          {!isUser && (
            <button 
              className="copy-btn" 
              onClick={handleCopy}
              title={copied ? "Copied to clipboard!" : "Copy message"}
            >
              {copied ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
