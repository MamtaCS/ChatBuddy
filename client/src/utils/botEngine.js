// Intelligent built-in response engine for ChatBuddy

const INTERESTING_FACTS = [
  "Honey never spoils! Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still completely edible.",
  "Octopuses have three hearts and blue blood! Two hearts pump blood to the gills, while the third circulates blood to the rest of the body.",
  "A single teaspoon of a neutron star would weigh about 6 billion tons on Earth!",
  "Bananas are naturally radioactive! They contain high levels of potassium-40, though you'd have to eat 10 million bananas at once to get radiation sickness.",
  "Venus is the only planet in our solar system that spins clockwise (retrograde rotation) on its axis.",
  "The shortest commercial flight in the world takes only 57 seconds! It flies between Westray and Papa Westray in the Orkney Islands of Scotland."
];

const PRODUCTIVITY_TIPS = [
  "**The 2-Minute Rule**: If a task takes less than two minutes to accomplish, do it immediately rather than postponing it.",
  "**Timeblocking & Pomodoro**: Focus in 25-minute uninterrupted sprints followed by a 5-minute breather to maintain peak mental clarity.",
  "**Eat the Frog First**: Tackle your most challenging or high-priority task first thing in the morning when your willpower is fresh.",
  "**The Eisenhower Matrix**: Divide your tasks into *Urgent vs. Important* to avoid getting trapped by reactive busywork."
];

export const generateBotReply = (userMessage) => {
  const clean = userMessage.trim().toLowerCase();

  // Quick Suggestion 1: What can you do?
  if (clean.includes("what can you do") || clean.includes("capabilities") || clean.includes("features")) {
    return `Here are a few things I can help you with:
• **Answer Questions**: Explain concepts, science, history, and general knowledge.
• **Brainstorm Ideas**: Generate project ideas, creative writing, or business concepts.
• **Productivity Advice**: Provide tips on time management, organization, and focus.
• **Drafting & Writing**: Help craft messages, summaries, or structured outlines.
• **Engaging Conversation**: Try asking me to *"Tell me something interesting"* or ask any question!`;
  }

  // Quick Suggestion 2: Help me get started
  if (clean.includes("help me get started") || clean.includes("get started") || clean.includes("onboarding")) {
    return `Welcome to **ChatBuddy**! 🚀 Getting started is super easy:
1. **Type anything** in the message box below and press **Enter** (or click the orange send arrow).
2. **Try the quick suggestions** above the input bar to see instant demonstrations.
3. You can clear the conversation anytime using the **Clear Chat** button on the top right.
What topic would you like to explore today?`;
  }

  // Quick Suggestion 3: Tell me something interesting
  if (clean.includes("tell me something interesting") || clean.includes("interesting") || clean.includes("fact")) {
    const randomFact = INTERESTING_FACTS[Math.floor(Math.random() * INTERESTING_FACTS.length)];
    return `✨ **Did you know?**\n\n${randomFact}`;
  }

  // Productivity tip
  if (clean.includes("productivity") || clean.includes("tip") || clean.includes("focus")) {
    const randomTip = PRODUCTIVITY_TIPS[Math.floor(Math.random() * PRODUCTIVITY_TIPS.length)];
    return `⚡ **Productivity Boost**:\n\n${randomTip}`;
  }

  // Greetings
  if (/^(hi|hello|hey|greetings|howdy|sup|hola)\b/i.test(clean)) {
    return `Hello there! 👋 Great to see you. How's your day going, and what can I assist you with?`;
  }

  // Identity
  if (clean.includes("who are you") || clean.includes("your name")) {
    return `I'm **ChatBuddy**! Your friendly, modern AI companion designed with a warm, clean aesthetic to help answer questions and brainstorm ideas.`;
  }

  // Thank you
  if (clean.includes("thank") || clean.includes("thanks")) {
    return `You're very welcome! 😊 Let me know whenever you have more questions.`;
  }

  // Code / Programming
  if (clean.includes("code") || clean.includes("javascript") || clean.includes("react") || clean.includes("python")) {
    return `I love coding! 💻 Whether you're working with \`React\`, \`JavaScript\`, or \`Python\`, feel free to ask about syntax, component architecture, debugging tips, or best practices.`;
  }

  // Jokes
  if (clean.includes("joke") || clean.includes("funny")) {
    return `Why do programmers prefer dark mode?\n\n*Because light attracts bugs!* 🐛 😄`;
  }

  // General Fallback with conversational warmth
  return `That's an interesting thought about "${userMessage.trim()}"! 

I'm ready to dive deeper into this with you. Would you like me to brainstorm more details, break it down into steps, or explore a specific angle?`;
};
