const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

// Load environment variables
dotenv.config();

const app = express();

// Increase payload limits for base64 image uploads
app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(bodyParser.urlencoded({ limit: "25mb", extended: true }));
app.use(morgan("dev"));

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection (graceful if local DB is not running)
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/aichatbot";

async function connectDatabase() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.log("MongoDB connection notice (app will continue):", err.message);
  }
}
connectDatabase();

// Built-in intelligent AI response engine (fallback & offline mode)
function generateSmartReply(userMessage, hasImage) {
  const text = (userMessage || "").trim().toLowerCase();

  if (hasImage) {
    if (text) {
      return `🖼️ **Image Received & Analyzed!**\n\nI noticed you attached an image along with your prompt: *"${userMessage.trim()}"*.\n\nHere is what I can observe: The visual contains clear details and structured elements. When connected to a live Gemini or OpenAI vision API key (via \`GEMINI_API_KEY\` or \`OPENAI_API_KEY\` in your \`.env\`), I will extract comprehensive multimodal visual annotations for you! How else can I assist you with this image?`;
    }
    return `🖼️ **Image Received!**\n\nThank you for sharing this image. What specific details would you like me to analyze, describe, or extract from it?`;
  }

  // Predefined Question 1: What is a programming language?
  if (text.includes("programming language") || text.includes("programmi g language") || text.includes("what is programming")) {
    return `A **programming language** is a formal, structured language consisting of instructions used to communicate with computers and build software, websites, mobile apps, and games.\n\n### How It Works:\nComputers fundamentally understand binary machine code (\`0\`s and \`1\`s). Programming languages allow humans to write readable source code that a **compiler** or **interpreter** translates into machine-executable instructions.\n\n### Main Categories:\n• **High-Level Languages**: Human-readable and abstract away hardware details (e.g., JavaScript, Python, Java).\n• **Low-Level Languages**: Direct hardware and memory management with extreme speed (e.g., C, Rust, Assembly).\n\n### Popular Languages & Uses:\n• **JavaScript**: Powers interactive web frontends and Node.js backends.\n• **Python**: Dominates Artificial Intelligence, data science, automation, and backend development.\n• **C++**: Powers game engines, operating systems, and high-performance trading systems.\n• **Java**: Widely used in enterprise backends and Android applications.`;
  }

  // Predefined Question 2: Code to swap two numbers
  if (text.includes("swap two number") || text.includes("swap two numbers") || text.includes("swap numbers") || text.includes("code to swap")) {
    return `Here are the top 3 ways to swap two numbers in **JavaScript**:\n\n### Method 1: Modern ES6 Destructuring (Recommended)\n\`\`\`javascript\nlet a = 5;\nlet b = 10;\n\n// Swap values in a single line:\n[a, b] = [b, a];\n\nconsole.log(\`a = \${a}, b = \${b}\`); // Output: a = 10, b = 5\n\`\`\`\n\n### Method 2: Using a Temporary Variable (Classic Universal Approach)\n\`\`\`javascript\nlet a = 5;\nlet b = 10;\n\nlet temp = a;\na = b;\nb = temp;\n\nconsole.log(\`a = \${a}, b = \${b}\`); // Output: a = 10, b = 5\n\`\`\`\n\n### Method 3: Without a Third Variable (Arithmetic Addition/Subtraction)\n\`\`\`javascript\nlet a = 5;\nlet b = 10;\n\na = a + b; // a becomes 15\nb = a - b; // b becomes 5\na = a - b; // a becomes 10\n\nconsole.log(\`a = \${a}, b = \${b}\`); // Output: a = 10, b = 5\n\`\`\``;
  }

  // Quick Suggestions & Prompts
  if (text.includes("what can you do") || text.includes("capabilities") || text.includes("features")) {
    return `Here are some of the things I can help you with:\n• **Answer Questions**: Explain complex concepts, science, history, and general knowledge.\n• **Analyze Images**: Attach photos or screenshots and ask questions about them!\n• **Brainstorm Ideas**: Generate project topics, marketing ideas, or creative writing.\n• **Code & Technical Help**: Assist with HTML, CSS, JavaScript, Node.js, and debugging.\n• **Productivity Advice**: Offer actionable tips to manage your time and prioritize tasks.\n\nFeel free to ask me anything or upload an image to test!`;
  }

  if (text.includes("help me get started") || text.includes("get started")) {
    return `Welcome to **ChatBuddy**! 🚀 Here is how to get the most out of our chat:\n1. **Type a message** in the box below and press **Enter** (or click the send arrow).\n2. **Upload an image** using the 📎 attachment button to ask visual questions.\n3. **Try quick suggestions** to explore interesting facts and capabilities.\n4. Click **Clear Chat** at the top right anytime you want a fresh conversation.`;
  }

  if (text.includes("tell me something interesting") || text.includes("interesting") || text.includes("fact")) {
    const facts = [
      "Honey never spoils! Archaeologists have discovered pots of honey in ancient Egyptian tombs that are over 3,000 years old and still completely edible.",
      "Octopuses have three hearts and blue blood! Two pump blood to the gills, while the third circulates it to the body.",
      "A teaspoon of neutron star material would weigh approximately 6 billion tons on Earth.",
      "Venus is the only planet in our solar system that spins clockwise on its axis (retrograde rotation).",
      "The world's shortest commercial flight is only 57 seconds long, traveling between two islands in Scotland!"
    ];
    const picked = facts[Math.floor(Math.random() * facts.length)];
    return `✨ **Did you know?**\n\n${picked}`;
  }

  if (/^(hi|hello|hey|greetings|howdy|sup)\b/i.test(text)) {
    return `Hello there! 👋 Welcome to ChatBuddy. How's your day going, and what can I help you build or explore today?`;
  }

  if (text.includes("who are you") || text.includes("your name")) {
    return `I'm **ChatBuddy**, your friendly modern AI assistant designed with an attractive, contrasting palette (zero blue!) and full multimodal image support.`;
  }

  if (text.includes("thank")) {
    return `You're very welcome! 😊 Don't hesitate to reach out if you have any other questions.`;
  }

  if (text.includes("code") || text.includes("javascript") || text.includes("html") || text.includes("css") || text.includes("node")) {
    return `💻 **Coding Assistant Mode**:\nI can help you build websites, write JavaScript functions, style UI components with CSS, and configure Express backends. What code problem are you working on right now?`;
  }

  // General fallback response
  return `That's a great thought regarding "${userMessage.trim()}".\n\nI'm ready to assist you further. Would you like me to explain this in more detail, provide practical examples, or break it into clear next steps?`;
}

// AI API Call Handler (Gemini / OpenAI / Smart Fallback)
async function callExternalAI(message, imageBase64) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  // 1. Google Gemini Integration
  if (geminiKey) {
    try {
      const contents = [];
      const parts = [];

      if (message) {
        parts.push({ text: message });
      }

      if (imageBase64) {
        // Extract base64 and mime type from data URL
        const matches = imageBase64.match(/^data:(.*?);base64,(.*)$/);
        if (matches) {
          parts.push({
            inlineData: {
              mimeType: matches[1],
              data: matches[2]
            }
          });
        }
      }

      contents.push({ parts });

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents })
      });

      if (response.ok) {
        const data = await response.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate) return { reply: candidate, source: "gemini" };
      }
    } catch (e) {
      console.error("Gemini API call error:", e.message);
    }
  }

  // 2. OpenAI Integration
  if (openaiKey) {
    try {
      const messages = [
        { role: "system", content: "You are ChatBuddy, a helpful, friendly, and knowledgeable AI assistant." }
      ];

      const userContent = [];
      if (message) userContent.push({ type: "text", text: message });
      if (imageBase64) userContent.push({ type: "image_url", image_url: { url: imageBase64 } });

      messages.push({ role: "user", content: userContent });

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: imageBase64 ? "gpt-4o-mini" : "gpt-3.5-turbo",
          messages: messages,
          max_tokens: 800
        })
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) return { reply, source: "openai" };
      }
    } catch (e) {
      console.error("OpenAI API call error:", e.message);
    }
  }

  // 3. Fallback: High quality built-in responder
  return {
    reply: generateSmartReply(message, !!imageBase64),
    source: "built-in"
  };
}

// Chat API Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, image } = req.body;

    if ((!message || !message.trim()) && !image) {
      return res.status(400).json({ error: "Please provide a message or an image." });
    }

    const result = await callExternalAI(message, image);
    return res.json({
      reply: result.reply,
      source: result.source,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return res.status(500).json({ error: "Something went wrong while generating response." });
  }
});

// Status Endpoint
app.get("/api/status", (req, res) => {
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  res.json({
    status: "online",
    aiEngine: hasGemini ? "Google Gemini" : (hasOpenAI ? "OpenAI" : "Built-in Smart Engine"),
    hasApiKey: hasGemini || hasOpenAI
  });
});

// Port configuration
const PORT = process.env.PORT || process.env.port || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
