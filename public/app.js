// ChatBuddy Frontend Application Logic (HTML/CSS/JS)

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const chatWindow = document.getElementById('chat-window');
  const welcomeScreen = document.getElementById('welcome-screen');
  const messageStream = document.getElementById('message-stream');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const btnSend = document.getElementById('btn-send');
  const btnAttach = document.getElementById('btn-attach');
  const imageFileInput = document.getElementById('image-file-input');
  const imagePreviewPill = document.getElementById('image-preview-pill');
  const previewImageImg = document.getElementById('preview-image-img');
  const previewFileName = document.getElementById('preview-file-name');
  const btnRemoveImage = document.getElementById('btn-remove-image');
  const clearChatBtn = document.getElementById('clear-chat-btn');
  const clearModal = document.getElementById('clear-modal');
  const btnModalCancel = document.getElementById('btn-modal-cancel');
  const btnModalConfirm = document.getElementById('btn-modal-confirm');
  const engineBadge = document.getElementById('engine-badge');
  const suggestionsRow = document.getElementById('suggestions-row');

  // Application State
  let messages = [];
  let attachedImageBase64 = null;
  let isTyping = false;

  // Initialize: Check backend status
  fetchStatus();

  // Scroll Chat to Bottom
  function scrollToBottom() {
    requestAnimationFrame(() => {
      chatWindow.scrollTo({
        top: chatWindow.scrollHeight,
        behavior: 'smooth'
      });
    });
  }

  // Fetch backend engine status
  async function fetchStatus() {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        if (data.aiEngine) {
          engineBadge.textContent = data.aiEngine;
        }
      }
    } catch (e) {
      console.log('Status fetch notice:', e.message);
    }
  }

  // Format markdown with code blocks, headings, lists, bold, and inline code
  function formatMarkdown(text) {
    if (!text) return '';

    // Handle code blocks (```language ... ```)
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    let processed = text.replace(codeBlockRegex, (match, lang, code) => {
      const language = lang.trim() || 'code';
      const cleanCode = escapeHTML(code.trim());
      return `__CODE_BLOCK_START__<div class="code-card"><div class="code-card-header"><span class="code-lang-tag">${language}</span><button type="button" class="btn-copy-code" data-code="${escapeAttr(code.trim())}">Copy Code</button></div><pre><code>${cleanCode}</code></pre></div>__CODE_BLOCK_END__`;
    });

    const segments = processed.split(/(__CODE_BLOCK_START__[\s\S]*?__CODE_BLOCK_END__)/);

    return segments.map(segment => {
      if (segment.startsWith('__CODE_BLOCK_START__') && segment.endsWith('__CODE_BLOCK_END__')) {
        return segment.replace('__CODE_BLOCK_START__', '').replace('__CODE_BLOCK_END__', '');
      }

      const lines = segment.split('\n');
      return lines.map(line => {
        const trimmed = line.trim();

        // Headings: ### or ##
        if (trimmed.startsWith('### ')) {
          return `<h4 class="bubble-subheading">${applyInlineStyles(trimmed.substring(4))}</h4>`;
        }
        if (trimmed.startsWith('## ')) {
          return `<h3 class="bubble-heading">${applyInlineStyles(trimmed.substring(3))}</h3>`;
        }

        // Bullet points
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const itemContent = trimmed.substring(2);
          return `<li class="bubble-list-item">${applyInlineStyles(itemContent)}</li>`;
        }

        // Empty line
        if (!trimmed) {
          return '<div style="height: 6px;"></div>';
        }

        return `<p>${applyInlineStyles(line)}</p>`;
      }).join('');
    }).join('');
  }

  function applyInlineStyles(str) {
    return str
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Inline Code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Italics
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }

  // Render a Single Message Bubble
  function appendMessageBubble({ sender, text, image, timestamp }) {
    // Hide welcome screen if this is the first message
    if (welcomeScreen.style.display !== 'none') {
      welcomeScreen.style.display = 'none';
      clearChatBtn.disabled = false;
    }

    const isUser = sender === 'user';
    const messageRow = document.createElement('div');
    messageRow.className = `message-row ${isUser ? 'user' : 'bot'}`;

    // Bot Avatar
    let botAvatarHTML = '';
    if (!isUser) {
      botAvatarHTML = `
        <div class="bot-avatar-badge" title="ChatBuddy">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="10" rx="3" />
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7v4" />
            <circle cx="9" cy="16" r="1.2" fill="currentColor" />
            <circle cx="15" cy="16" r="1.2" fill="currentColor" />
          </svg>
        </div>
      `;
    }

    // Image HTML if attached
    let imageHTML = '';
    if (image) {
      imageHTML = `
        <div class="bubble-image-container">
          <img src="${image}" alt="Attached image" />
        </div>
      `;
    }

    // Body Text
    const formattedBody = isUser 
      ? (text ? `<p>${escapeHTML(text)}</p>` : '') 
      : formatMarkdown(text);

    // Copy button for bot
    let copyButtonHTML = '';
    if (!isUser) {
      copyButtonHTML = `
        <button class="btn-copy" title="Copy message" data-text="${escapeAttr(text)}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>Copy</span>
        </button>
      `;
    }

    messageRow.innerHTML = `
      ${botAvatarHTML}
      <div class="message-content-wrapper">
        <div class="${isUser ? 'message-bubble-user' : 'message-bubble-bot'}">
          ${imageHTML}
          <div>${formattedBody}</div>
        </div>
        <div class="message-meta">
          <span class="message-time">${timestamp || getCurrentTime()}</span>
          ${copyButtonHTML}
        </div>
      </div>
    `;

    messageStream.appendChild(messageRow);
    scrollToBottom();

    // Attach Copy Handler
    if (!isUser) {
      // Copy message button
      const copyBtn = messageRow.querySelector('.btn-copy');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(text);
          copyBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Copied!</span>
          `;
          setTimeout(() => {
            copyBtn.innerHTML = `
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>Copy</span>
            `;
          }, 2000);
        });
      }

      // Copy code snippet buttons
      const copyCodeBtns = messageRow.querySelectorAll('.btn-copy-code');
      copyCodeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const codeToCopy = btn.getAttribute('data-code');
          if (codeToCopy) {
            navigator.clipboard.writeText(codeToCopy);
            btn.textContent = 'Copied!';
            setTimeout(() => {
              btn.textContent = 'Copy Code';
            }, 2000);
          }
        });
      });
    }
  }

  // Show Typing Indicator
  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'message-row bot';
    indicator.id = 'typing-indicator';
    indicator.innerHTML = `
      <div class="bot-avatar-badge" title="ChatBuddy">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="10" rx="3" />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4" />
          <circle cx="9" cy="16" r="1.2" fill="currentColor" />
          <circle cx="15" cy="16" r="1.2" fill="currentColor" />
        </svg>
      </div>
      <div class="message-content-wrapper">
        <div class="typing-bubble">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    `;
    messageStream.appendChild(indicator);
    scrollToBottom();
  }

  // Remove Typing Indicator
  function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  // Get Current Formatted Time (e.g. 1:15 PM)
  function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Helper string sanitizers
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  function escapeAttr(str) {
    return str.replace(/"/g, '&quot;');
  }

  // Image Upload Handling
  btnAttach.addEventListener('click', () => {
    imageFileInput.click();
  });

  imageFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP, etc.).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      attachedImageBase64 = event.target.result;
      previewImageImg.src = attachedImageBase64;
      previewFileName.textContent = file.name;
      imagePreviewPill.style.display = 'flex';
      chatInput.placeholder = "Add an image prompt (optional) and send...";
      chatInput.removeAttribute('required');
      chatInput.focus();
    };
    reader.readAsDataURL(file);
  });

  // Remove Attached Image
  btnRemoveImage.addEventListener('click', () => {
    removeAttachedImage();
  });

  function removeAttachedImage() {
    attachedImageBase64 = null;
    imageFileInput.value = '';
    imagePreviewPill.style.display = 'none';
    chatInput.placeholder = "Type your message...";
    chatInput.setAttribute('required', 'true');
  }

  // Send Message Logic
  async function handleSendMessage(text) {
    const userText = text !== undefined ? text : chatInput.value.trim();
    const currentImage = attachedImageBase64;

    // Must have either text or image
    if (!userText && !currentImage) return;
    if (isTyping) return;

    // Append User Message Bubble
    const userMessage = {
      sender: 'user',
      text: userText,
      image: currentImage,
      timestamp: getCurrentTime()
    };
    messages.push(userMessage);
    appendMessageBubble(userMessage);

    // Reset input fields
    chatInput.value = '';
    removeAttachedImage();
    setInputsDisabled(true);

    // Show AI Typing indicator
    isTyping = true;
    showTypingIndicator();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          image: currentImage
        })
      });

      // Artificial small delay for natural rhythm
      await new Promise(r => setTimeout(r, 650));

      hideTypingIndicator();

      if (response.ok) {
        const data = await response.json();
        const botMessage = {
          sender: 'bot',
          text: data.reply || "I'm here to help!",
          timestamp: data.timestamp || getCurrentTime()
        };
        messages.push(botMessage);
        appendMessageBubble(botMessage);
      } else {
        const errData = await response.json();
        appendMessageBubble({
          sender: 'bot',
          text: `⚠️ **Notice**: ${errData.error || "Could not generate response. Please try again."}`,
          timestamp: getCurrentTime()
        });
      }
    } catch (err) {
      hideTypingIndicator();
      console.error('Chat error:', err);
      appendMessageBubble({
        sender: 'bot',
        text: `⚠️ **Network Notice**: Unable to reach the server. Please verify your connection.`,
        timestamp: getCurrentTime()
      });
    } finally {
      isTyping = false;
      setInputsDisabled(false);
      chatInput.focus();
    }
  }

  function setInputsDisabled(disabled) {
    chatInput.disabled = disabled;
    btnSend.disabled = disabled;
    btnAttach.disabled = disabled;
  }

  // Chat Form Submit
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSendMessage();
  });

  // Quick Suggestion Chips Click
  suggestionsRow.addEventListener('click', (e) => {
    const chip = e.target.closest('.suggestion-chip');
    if (!chip || isTyping) return;
    const query = chip.getAttribute('data-query');
    if (query) {
      handleSendMessage(query);
    }
  });

  // Clear Chat Modal Handlers
  clearChatBtn.addEventListener('click', () => {
    if (messages.length > 0) {
      clearModal.style.display = 'flex';
    }
  });

  btnModalCancel.addEventListener('click', () => {
    clearModal.style.display = 'none';
  });

  clearModal.addEventListener('click', (e) => {
    if (e.target === clearModal) {
      clearModal.style.display = 'none';
    }
  });

  btnModalConfirm.addEventListener('click', () => {
    messages = [];
    messageStream.innerHTML = '';
    welcomeScreen.style.display = 'flex';
    clearChatBtn.disabled = true;
    clearModal.style.display = 'none';
    removeAttachedImage();
    chatInput.focus();
  });

  // Focus Input Initially
  chatInput.focus();
});
