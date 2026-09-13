# 🤖 ChatBuddy - Modern AI Chatbot

A sleek, intelligent, and responsive full-stack AI chatbot application featuring multimodal vision support, dynamic code snippet rendering with copy actions, quick suggestion chips, and offline-capable smart responses alongside cloud AI integrations (Google Gemini & OpenAI). Designed with an eye-catching, high-contrast dark theme powered by rich violet and sunset orange accents.

---

## 📖 Short Description

**ChatBuddy** is designed to provide seamless, interactive conversational AI experiences. It features a robust Node.js/Express backend coupled with both a fast, lightweight vanilla web frontend (`public/`) and a modular React + Vite client (`client/`). It supports text and image prompts, works out-of-the-box with an intelligent offline engine, and easily connects to Google Gemini or OpenAI when API keys are configured.

---

## ✨ Features

- **Multimodal AI Support**: Upload and analyze images alongside conversational text prompts using base64 encoding.
- **Multi-Engine Intelligence**:
  - 🌟 **Google Gemini API** (Gemini 1.5 Flash multimodal vision support)
  - 🧠 **OpenAI API** (GPT-4o mini / GPT-3.5 Turbo)
  - ⚡ **Built-in Smart Engine** (Instant offline fallback for common queries, coding patterns, facts, and productivity tips)
- **Rich User Interface**:
  - High-contrast, zero-blue modern dark theme with purple and warm orange accents.
  - Real-time animated typing indicator and smooth auto-scroll.
  - Interactive quick suggestion chips for effortless discovery.
- **Code Block Formatting**: Syntax-highlighted code containers with one-click copy buttons.
- **Chat Management**: Clear conversation history with a confirmation modal.
- **Authentication & Security Ready**: Includes Mongoose User schema with Bcrypt password hashing and JWT access & refresh token management.
- **Dual Frontend Architecture**:
  - Instant Express-served web interface in `public/`.
  - Component-based React 19 + Vite frontend in `client/`.

---

## 🛠️ Technologies & Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (v5)
- **Database**: MongoDB with Mongoose ODM
- **Authentication / Security**: `bcryptjs`, `jsonwebtoken`
- **Utilities**: `dotenv`, `cors`, `morgan`, `body-parser`

### Frontend
- **Static App (`public/`)**: HTML5, Modern Vanilla CSS3 (Custom properties, Glassmorphism, Responsive Grid/Flexbox), JavaScript (ES6+)
- **React App (`client/`)**: React 19, Vite, Component Design System

### AI APIs
- **Google Gemini API** (`gemini-1.5-flash`)
- **OpenAI API** (`gpt-4o-mini` / `gpt-3.5-turbo`)

---

## 📁 Project Structure

```text
AIChatBot/
├── .env.example            # Environment variables template (safe to commit)
├── .gitignore              # Git ignore rules for Node, Vite, logs, and secrets
├── index.js                # Main Express server entry point & AI router
├── package.json            # Backend dependencies and scripts
├── package-lock.json       # Backend dependency lockfile
├── README.md               # Project documentation
│
├── config/                 # Database configuration
│   └── db.js
│
├── controllers/            # Controller logic (expandable)
├── middleware/             # Express middlewares (expandable)
├── models/                 # Mongoose schemas
│   └── userModel.js        # User model with Bcrypt & JWT methods
├── routes/                 # Express API routes (expandable)
├── utils/                  # Helper utilities (expandable)
│
├── public/                 # Express-served static frontend
│   ├── index.html          # Main HTML structure
│   ├── style.css           # Violet & orange dark theme styling
│   └── app.js              # Client chat interactions & API handler
│
└── client/                 # React + Vite frontend application
    ├── index.html          # Vite HTML template
    ├── package.json        # Client dependencies (React 19, Vite)
    ├── vite.config.js      # Vite configuration
    └── src/
        ├── App.jsx         # Main React root component
        ├── index.css       # Design tokens and global CSS styles
        ├── components/     # Reusable React components
        │   ├── ChatInput.jsx
        │   ├── MessageBubble.jsx
        │   ├── Navbar.jsx
        │   ├── QuickSuggestions.jsx
        │   └── TypingIndicator.jsx
        └── utils/
            └── botEngine.js # Client-side fallback response generator
```

---

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (Optional: Local MongoDB or MongoDB Atlas URI. The app runs even if MongoDB is not active.)

### 1. Clone the Repository
```bash
git clone https://github.com/MamtaCS/ChatBuddy.git
cd ChatBuddy
```

### 2. Install Dependencies
Install root backend dependencies:
```bash
npm install
```

Install client frontend dependencies:
```bash
cd client
npm install
cd ..
```

### 3. Configure Environment Variables
Copy the `.env.example` file to create your `.env`:
```bash
cp .env.example .env
```
*(On Windows PowerShell, use: `Copy-Item .env.example .env`)*

Configure your environment variables in `.env`:
```env
PORT=8080
DEV_MODE=development
MONGO_URL=mongodb://127.0.0.1:27017/aichatbot

# Optional: Add keys for live external AI models
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# JWT Authentication
JWT_ACCESS_SECRET=your_jwt_access_secret_here
JWT_ACCESS_EXPIRY=20min
JWT_REFRESH_TOKEN=your_jwt_refresh_token_here
JWT_REFRESH_EXPIRY=15days
```

> **Note:** If no external API keys are provided, ChatBuddy automatically runs in offline mode using its built-in smart response engine!

---

## 🚀 How to Run the Project

### Option A: Run the Backend & Static Frontend
Starts the Express server on `http://localhost:8080` (or the configured `PORT`), serving the interactive frontend directly:
```bash
npm start
```
Open your browser and navigate to:
```
http://localhost:8080
```

### Option B: Run the React Client Development Server
To develop or run the React + Vite frontend:
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📸 Screenshots

*(Add screenshots of ChatBuddy in action below)*

| Welcome Screen | Active Chat & Image Prompt |
|:---:|:---:|
| ![Welcome Screen Placeholder](https://via.placeholder.com/600x350/161224/8B5CF6?text=ChatBuddy+Welcome+Screen) | ![Active Chat Placeholder](https://via.placeholder.com/600x350/161224/F97316?text=ChatBuddy+Active+Conversation) |

---

## 🔮 Future Improvements

- [ ] Chat conversation persistence using MongoDB history sessions.
- [ ] User authentication flow (Sign up, Login, Profile dashboard).
- [ ] Voice input / speech-to-text integration.
- [ ] Export conversation history (PDF / Markdown / JSON).
- [ ] Dark / Light theme toggle support.
- [ ] Streaming response support (Server-Sent Events / WebSockets).

---

## 👥 Contributors

- **Mamta** ([@MamtaCS](https://github.com/MamtaCS)) - Developer & Maintainer

---

## 📄 License

This project is licensed under the ISC License.
