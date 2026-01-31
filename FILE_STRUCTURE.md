# 📁 Post Buddy - Complete File Structure

```
post-buddy/
│
├── README.md                      # Main documentation
├── EXAMPLES.md                    # Usage examples with sample outputs
├── ARCHITECTURE.md                # Technical architecture documentation
├── setup.sh                       # Automated setup script
├── .gitignore                     # Git ignore rules
│
├── backend/                       # Express + TypeScript backend
│   ├── package.json              # Backend dependencies
│   ├── tsconfig.json             # TypeScript configuration
│   ├── .env.example              # Environment variables template
│   │
│   └── src/
│       ├── server.ts             # Express server entry point
│       │
│       ├── config/               # Configuration management
│       │   ├── topics.json       # Topic & platform rules (EDITABLE)
│       │   └── configManager.ts  # Configuration loader
│       │
│       ├── services/             # Core business logic
│       │   ├── topicDetector.ts  # Auto topic classification
│       │   ├── promptBuilder.ts  # LLM prompt generation
│       │   ├── llmAdapter.ts     # LLM provider abstraction
│       │   └── postGenerator.ts  # Main orchestration service
│       │
│       └── routes/               # API endpoints
│           └── api.ts            # REST API routes
│
├── frontend/                      # React + TypeScript + Tailwind frontend
│   ├── package.json              # Frontend dependencies
│   ├── tsconfig.json             # TypeScript configuration
│   ├── tsconfig.node.json        # Node TypeScript config
│   ├── vite.config.ts            # Vite + PWA configuration
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   ├── postcss.config.js         # PostCSS configuration
│   ├── index.html                # HTML entry point
│   ├── .env.example              # Environment variables template
│   │
│   └── src/
│       ├── main.tsx              # React entry point
│       ├── App.tsx               # Main application component
│       ├── index.css             # Global styles + Tailwind
│       │
│       ├── components/           # React components
│       │   └── PostCard.tsx      # Platform post display card
│       │
│       └── services/             # API client
│           └── api.ts            # Backend API service
│
└── [Generated during build]
    ├── backend/dist/             # Compiled backend (production)
    ├── frontend/dist/            # Built frontend (production)
    └── node_modules/             # Dependencies (both)
```

## Key Files Explained

### Configuration Files

**`backend/src/config/topics.json`** 🔧
- Central configuration for all topics and platforms
- Defines allowed platforms per topic
- Specifies tone, format, and style rules
- Easy to extend without code changes

**`backend/.env`** 🔐
- Stores sensitive configuration
- `GEMINI_API_KEY`: Your Gemini API key
- `PORT`: Backend server port

**`frontend/.env`** 🔐
- `VITE_API_URL`: Backend API endpoint

### Backend Core Files

**`server.ts`** 🚀
- Express server initialization
- CORS configuration
- Route mounting
- Error handling

**`configManager.ts`** ⚙️
- Loads topics.json
- Provides type-safe access to config
- Hot-reload capability

**`topicDetector.ts`** 🎯
- Keyword-based topic classification
- Confidence scoring algorithm
- Extensible via topics.json

**`promptBuilder.ts`** 📝
- Creates LLM-optimized prompts
- Injects platform-specific rules
- Context-aware instructions

**`llmAdapter.ts`** 🤖
- LLM provider abstraction
- Gemini integration
- Mock adapter for dev/testing
- Swappable interface

**`postGenerator.ts`** 🎬
- Main orchestration logic
- Concurrent post generation
- Error handling & aggregation

**`api.ts`** 🌐
- REST API endpoints
- Request validation
- Response formatting

### Frontend Core Files

**`App.tsx`** 💻
- Main application UI
- State management
- User interaction handling

**`PostCard.tsx`** 🎴
- Platform-specific post display
- Copy-to-clipboard functionality
- Loading states & animations

**`api.ts` (frontend)** 📡
- Backend communication
- Type-safe API calls
- Error handling

**`vite.config.ts`** ⚡
- Vite configuration
- PWA setup
- API proxy for dev

### Documentation Files

**`README.md`** 📖
- Quick start guide
- Installation instructions
- Usage overview
- Troubleshooting

**`EXAMPLES.md`** 💡
- Real-world usage examples
- Sample inputs/outputs
- Best practices
- API usage examples

**`ARCHITECTURE.md`** 🏗️
- Technical architecture
- Design decisions
- Extensibility guide
- Performance considerations

## File Relationships

```
User Request
    ↓
App.tsx ──→ api.ts (frontend)
    ↓           ↓
    └─────── HTTP ────────┐
                          ↓
                    api.ts (backend)
                          ↓
                   postGenerator.ts
                          ↓
        ┌─────────────────┼─────────────────┐
        ↓                 ↓                 ↓
  topicDetector     promptBuilder     llmAdapter
        ↓                 ↓                 ↓
        └────── configManager ──────┘
                      ↓
                  topics.json
```

## Modular Design Benefits

### Easy Topic Addition
1. Edit `topics.json`
2. Add new topic with platforms & rules
3. Restart server
✅ No code changes required

### Easy LLM Swap
1. Implement `LLMAdapter` interface
2. Update `LLMService` constructor
3. Add API key to `.env`
✅ Clean separation of concerns

### Easy Platform Addition
1. Add platform to `topics.json`
2. Update `PostCard.tsx` config
3. Optionally add platform-specific UI
✅ Isolated changes

### Easy Feature Extension
- **Scheduling**: Add job queue service
- **Multi-user**: Add auth middleware
- **Analytics**: Add tracking service
- **History**: Add database layer
✅ Well-defined extension points

## Build Artifacts (Not in Repo)

```
backend/dist/              # Compiled TypeScript
frontend/dist/             # Production build
  ├── assets/             # Bundled CSS/JS
  ├── index.html          # Generated HTML
  └── manifest.json       # PWA manifest

node_modules/             # Dependencies
.env                      # Local environment (gitignored)
```

## Development Workflow

```
1. Edit Code
   ├── Backend: src/**/*.ts
   └── Frontend: src/**/*.tsx

2. Auto-Compile
   ├── Backend: ts-node-dev watches & reloads
   └── Frontend: Vite HMR updates instantly

3. Test Changes
   ├── Backend: http://localhost:3001
   └── Frontend: http://localhost:3000

4. Build for Production
   ├── npm run build (both)
   └── Outputs to dist/
```

## Quick Navigation Guide

**Want to...**

- 📝 **Add a topic?** → `backend/src/config/topics.json`
- 🎨 **Change UI?** → `frontend/src/App.tsx`, `frontend/src/components/PostCard.tsx`
- 🤖 **Switch LLM?** → `backend/src/services/llmAdapter.ts`
- 📊 **Modify prompts?** → `backend/src/services/promptBuilder.ts`
- 🎯 **Improve detection?** → `backend/src/services/topicDetector.ts`
- ⚙️ **Configure server?** → `backend/src/server.ts`
- 🔧 **Update API?** → `backend/src/routes/api.ts`

---

**All files are well-commented and follow TypeScript best practices. Ready for immediate development!**
