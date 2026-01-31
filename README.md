# 🚀 Post Buddy

AI-powered social media post generator that transforms your ideas into platform-optimized content for X (Twitter), LinkedIn, and Facebook.

## ⚠️ CRITICAL: API Key Required

**You MUST configure a Gemini API key to get real AI-generated content.** Without it, you'll only see placeholder mock responses.

**Get your FREE key (30 seconds):**
1. Visit: https://makersuite.google.com/app/apikey
2. Create API key
3. Add to `backend/.env`: `GEMINI_API_KEY=your_key_here`
4. Restart backend

**See detailed instructions:** [SETUP_API_KEY.md](SETUP_API_KEY.md)

---

![Post Buddy](https://img.shields.io/badge/Status-Production%20Ready-success)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![React](https://img.shields.io/badge/React-18.3-61dafb)
![Express](https://img.shields.io/badge/Express-4.19-lightgrey)

## ✨ Features

- **🤖 AI-Powered Generation**: Uses Google Gemini to create engaging, platform-specific content
- **🎯 Smart Topic Detection**: Automatically classifies your ideas into topics (tech, politics, football, business, lifestyle)
- **📱 Multi-Platform Support**: Generates optimized posts for X, LinkedIn, and Facebook
- **🎨 Modern UI**: Beautiful, responsive interface with dark mode support
- **📲 PWA Ready**: Install as a mobile app for on-the-go content creation
- **🔧 Modular Architecture**: Easy to extend with new topics, platforms, or LLM providers
- **⚡ Fast & Efficient**: Concurrent generation for all platforms

## 🏗️ Architecture

```
post-buddy/
├── backend/                # Express + TypeScript API
│   ├── src/
│   │   ├── config/        # Configuration management
│   │   │   ├── topics.json         # Topic & platform rules
│   │   │   └── configManager.ts    # Config loader
│   │   ├── services/      # Core business logic
│   │   │   ├── topicDetector.ts    # Auto topic detection
│   │   │   ├── promptBuilder.ts    # LLM prompt generation
│   │   │   ├── llmAdapter.ts       # LLM interface (Gemini)
│   │   │   └── postGenerator.ts    # Main orchestrator
│   │   ├── routes/        # API endpoints
│   │   │   └── api.ts
│   │   └── server.ts      # Express server
│   └── package.json
│
└── frontend/              # React + TypeScript + Tailwind
    ├── src/
    │   ├── components/    # UI components
    │   │   └── PostCard.tsx
    │   ├── services/      # API client
    │   │   └── api.ts
    │   ├── App.tsx        # Main application
    │   └── main.tsx       # Entry point
    └── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Gemini API key (get free at [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone and setup**
```bash
cd post-buddy
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install
cp .env.example .env
# Edit .env if needed (default API URL works for local dev)
```

### Running the Application

**Option 1: Development Mode (Recommended)**

```bash
# Terminal 1 - Start backend
cd backend
npm run dev

# Terminal 2 - Start frontend
cd frontend
npm run dev
```

Access the app at: `http://localhost:3000`

**Option 2: Production Build**

```bash
# Build backend
cd backend
npm run build
npm start

# Build frontend
cd frontend
npm run build
npm run preview
```

## 📖 Usage

### Basic Usage

1. Open the app in your browser
2. Enter your idea in the text area
3. (Optional) Select a topic, or let the AI auto-detect it
4. Click "Generate Posts" or press `Cmd+Enter`
5. Copy generated posts for each platform

### Example Ideas

**Tech Topic:**
```
"Most software is just controlled data flow"
```

**Politics Topic:**
```
"Democracy requires active participation, not just voting"
```

**Football Topic:**
```
"That last-minute goal was absolutely incredible!"
```

### API Usage

**Generate Posts**
```bash
curl -X POST http://localhost:3001/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "idea": "AI is transforming software development",
    "topic": "tech"
  }'
```

**Get Topics**
```bash
curl http://localhost:3001/api/topics
```

## 🎨 Customization

### Adding New Topics

Edit `backend/src/config/topics.json`:

```json
{
  "topics": {
    "your_topic": {
      "platforms": ["x", "linkedin", "facebook"],
      "rules": {
        "x": {
          "tone": "casual, friendly",
          "format": "1-2 sentences",
          "style": "conversational"
        }
      }
    }
  },
  "keywords": {
    "your_topic": ["keyword1", "keyword2"]
  }
}
```

The system will automatically reload the configuration.

### Changing LLM Provider

The LLM adapter is designed for easy swapping. To use a different provider:

1. Implement the `LLMAdapter` interface in `backend/src/services/llmAdapter.ts`
2. Create your adapter class (e.g., `ClaudeAdapter`, `OpenAIAdapter`)
3. Update the `LLMService` constructor to use your adapter

Example:
```typescript
class ClaudeAdapter implements LLMAdapter {
  async generate(prompt: string): Promise<string> {
    // Your implementation
  }
  
  isAvailable(): boolean {
    return !!process.env.CLAUDE_API_KEY;
  }
}
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
GEMINI_API_KEY=your_api_key_here
PORT=3001
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:3001/api
```

### Platform Rules

Each topic can define custom rules per platform:
- **tone**: Writing style (professional, casual, analytical, etc.)
- **format**: Structure (sentences, paragraphs, hook + body, etc.)
- **style**: Content approach (educational, emotional, opinionated, etc.)

## 📱 PWA Installation

Post Buddy works as a Progressive Web App:

1. Open the app in your mobile browser
2. Look for "Add to Home Screen" or "Install App"
3. Access Post Buddy like a native app!

## 🎯 Future Enhancements

The modular architecture makes these extensions straightforward:

- [ ] **Multi-user support** - Add authentication and user profiles
- [ ] **Post scheduling** - Schedule posts to publish later
- [ ] **Analytics** - Track post performance
- [ ] **Image generation** - Create accompanying visuals
- [ ] **Post history** - Save and manage generated posts
- [ ] **Tone customization** - User-defined writing styles
- [ ] **Multi-language** - Generate posts in different languages
- [ ] **Platform preview** - See how posts look on each platform

## 🐛 Troubleshooting

**Backend won't start**
- Check if port 3001 is available
- Ensure GEMINI_API_KEY is set correctly
- Run `npm install` in backend directory

**Frontend can't connect to API**
- Verify backend is running on port 3001
- Check VITE_API_URL in frontend/.env
- Look for CORS errors in browser console

**Posts not generating**
- Verify Gemini API key is valid
- Check API quota/limits
- Review backend logs for errors

**Mock adapter being used**
- Ensure GEMINI_API_KEY is set in backend/.env
- Restart backend server after adding API key

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Areas to explore:
- New topic categories
- Additional platform support (Instagram, TikTok, etc.)
- Alternative LLM integrations
- UI/UX improvements
- Performance optimizations

## 🙏 Acknowledgments

- Powered by [Google Gemini](https://ai.google.dev/)
- Built with [React](https://react.dev/), [Express](https://expressjs.com/), and [TypeScript](https://www.typescriptlang.org/)
- UI components from [Lucide React](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Built with ❤️ for content creators**

Ready to transform your ideas into engaging social media posts? Get started now! 🚀
