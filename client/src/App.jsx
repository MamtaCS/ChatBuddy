import { useState, useEffect } from 'react';
import './App.css';
import { Navbar } from './components/Navbar.jsx';
import { QuickSuggestions } from './components/QuickSuggestions.jsx';
import { MessageBubble } from './components/MessageBubble.jsx';
import { ChatInput } from './components/ChatInput.jsx';
import { TypingIndicator } from './components/TypingIndicator.jsx';

function App() { console.log('App rendered');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [engineBadge, setEngineBadge] = useState('');

  // Fetch backend engine status on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/status');
        if (res.ok) {
          const data = await res.json();
          if (data.aiEngine) setEngineBadge(data.aiEngine);
        }
      } catch (e) {
        console.error('Status fetch error:', e);
      }
    })();
  }, []);

  const clearChat = () => {
    setMessages([]);
  };

  const handleSendMessage = async (text) => {
    if (!text && !isTyping) return;
    if (isTyping) return;

    const userMessage = { sender: 'user', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      if (response.ok) {
        const data = await response.json();
        const botMessage = { sender: 'bot', text: data.reply || 'I am here to help!', timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const err = await response.json();
        const botMessage = { sender: 'bot', text: `⚠️ Notice: ${err.error || 'Something went wrong.'}`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (e) {
      console.error('Chat error:', e);
      const botMessage = { sender: 'bot', text: '⚠️ Network error: Unable to reach the server.', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar onClearChat={clearChat} hasMessages={messages.length > 0} />
      <div className="chat-window" id="chat-window">
        <div className="chat-inner">
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
        </div>
      </div>
      <div className="input-area-wrapper">
        <div className="input-container">
          <QuickSuggestions onSelectSuggestion={handleSendMessage} isTyping={isTyping} />
          <ChatInput onSendMessage={handleSendMessage} isTyping={isTyping} />
        </div>
      </div>
    </div>
  );
}

export default App
