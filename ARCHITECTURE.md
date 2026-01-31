# 🏗️ Post Buddy - Architecture Documentation

This document explains the technical architecture and design decisions behind Post Buddy.

## Table of Contents
- [System Overview](#system-overview)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Data Flow](#data-flow)
- [Extensibility](#extensibility)
- [Design Decisions](#design-decisions)

## System Overview

Post Buddy is a full-stack TypeScript application built with modularity and extensibility in mind.

```
┌─────────────┐
│   Browser   │
│  (React)    │
└──────┬──────┘
       │ HTTP/JSON
       ↓
┌─────────────┐
│   Vite Dev  │
│   Server    │
└──────┬──────┘
       │ Proxy /api
       ↓
┌─────────────┐      ┌──────────────┐
│  Express    │─────→│   Gemini     │
│  Backend    │←─────│   LLM API    │
└──────┬──────┘      └──────────────┘
       │
       ↓
┌─────────────┐
│   Config    │
│  (JSON)     │
└─────────────┘
```

## Backend Architecture

### Layer Structure

```
Presentation Layer (API)
    ↓
Service Layer (Business Logic)
    ↓
Integration Layer (External APIs)
    ↓
Configuration Layer (Data)
```

### Core Modules

#### 1. Configuration Manager (`config/configManager.ts`)

**Purpose**: Centralized configuration management for topics and platform rules.

**Key Features**:
- Hot-reloadable configuration
- Type-safe access to topic and platform rules
- Validation of topic/platform combinations

**Design Pattern**: Singleton

```typescript
// Usage example
const platforms = configManager.getAllowedPlatforms('tech');
const rules = configManager.getPlatformRules('tech', 'linkedin');
```

#### 2. Topic Detector (`services/topicDetector.ts`)

**Purpose**: Automatic classification of user ideas into topics.

**Algorithm**:
1. Tokenize and normalize input text
2. Score each topic based on keyword matches
3. Apply word boundary detection (exact matches score higher)
4. Return topic with highest score above threshold

**Extensibility**: Add keywords in `topics.json` without code changes

```typescript
// Auto-detection with confidence scoring
const topic = topicDetector.detectTopic(idea);
const confidence = topicDetector.getConfidenceScore(idea, topic);
```

#### 3. Prompt Builder (`services/promptBuilder.ts`)

**Purpose**: Construct optimized prompts for LLM generation.

**Strategy**:
- Platform-specific instructions
- Strict adherence to tone/format rules
- Context-aware prompt engineering

**Template**:
```
You are an expert social media content creator...
User's Idea: "{idea}"
Topic: {topic}
Platform: {platform}
Tone: {tone}
Format: {format}
Style: {style}

Instructions: [platform-specific guidelines]
Generate the post now:
```

#### 4. LLM Adapter (`services/llmAdapter.ts`)

**Purpose**: Abstraction layer for LLM providers.

**Interface**:
```typescript
interface LLMAdapter {
  generate(prompt: string): Promise<string>;
  isAvailable(): boolean;
}
```

**Implementations**:
- `GeminiAdapter`: Google Gemini integration
- `MockAdapter`: Fallback for development

**Swappability**: Easy to add Claude, OpenAI, or custom providers

#### 5. Post Generator (`services/postGenerator.ts`)

**Purpose**: Main orchestrator coordinating all services.

**Workflow**:
1. Topic detection (if not provided)
2. Retrieve allowed platforms
3. Build prompts for each platform
4. Generate posts concurrently
5. Aggregate and return results

**Error Handling**: Graceful degradation (continues even if one platform fails)

### API Design

**RESTful Endpoints**:

```
POST /api/generate
  - Generate posts from idea
  - Body: { idea: string, topic?: string }
  - Returns: { topic, posts: { x, linkedin, facebook } }

GET /api/topics
  - Retrieve all topics and configurations
  - Returns: { topics: [], topicsConfig: {} }

GET /api/health
  - Health check endpoint
  - Returns: { status, timestamp }
```

## Frontend Architecture

### Component Hierarchy

```
App
├── Header
├── InputSection
│   ├── IdeaTextarea
│   ├── TopicSelector
│   └── GenerateButton
└── ResultsSection
    ├── PostCard (X)
    ├── PostCard (LinkedIn)
    └── PostCard (Facebook)
```

### State Management

**Local State (useState)**:
- Form inputs (idea, selectedTopic)
- Loading states
- Error handling
- Generation results

**Why no Redux/Context?**
- Single-user MVP
- Minimal state complexity
- Easy to add later if needed

### API Service (`services/api.ts`)

**Pattern**: Service class with typed methods

```typescript
class ApiService {
  async generatePosts(request): Promise<GenerateResponse> { }
  async getTopics(): Promise<TopicsResponse> { }
}

export const apiService = new ApiService();
```

### Design System

**Typography**:
- Display: Cabinet Grotesk (distinctive, modern)
- Body: Inter (readable, professional)
- Mono: JetBrains Mono (code/data display)

**Color System**:
- Semantic colors via Tailwind
- Platform-specific gradients
- Dark mode support

**Animations**:
- Fade-in for results
- Shimmer effect for loading states
- Smooth transitions

## Data Flow

### Generation Request Flow

```
1. User enters idea
   ↓
2. Frontend validates input
   ↓
3. POST /api/generate
   ↓
4. Backend: Topic detection
   ↓
5. Backend: Retrieve platform rules
   ↓
6. Backend: Build prompts (parallel)
   ↓
7. Backend: Call Gemini API (parallel)
   ↓
8. Backend: Aggregate results
   ↓
9. Frontend: Display posts
   ↓
10. User copies to clipboard
```

### Configuration Loading

```
App Startup
   ↓
Backend reads topics.json
   ↓
ConfigManager validates & caches
   ↓
Available via API endpoints
   ↓
Frontend fetches on mount
   ↓
Populates topic selector
```

## Extensibility

### Adding New Topics

**File**: `backend/src/config/topics.json`

```json
{
  "topics": {
    "new_topic": {
      "platforms": ["x", "linkedin"],
      "rules": {
        "x": { "tone": "...", "format": "...", "style": "..." }
      }
    }
  },
  "keywords": {
    "new_topic": ["keyword1", "keyword2"]
  }
}
```

**Result**: Immediately available, no code changes

### Adding New Platforms

1. Update `topics.json` with platform rules
2. Add platform to `PostCard.tsx` config
3. Update API response type

### Swapping LLM Providers

**Example: Adding Claude**

```typescript
// In llmAdapter.ts
class ClaudeAdapter implements LLMAdapter {
  private client: Anthropic;
  
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY
    });
  }
  
  async generate(prompt: string): Promise<string> {
    const response = await this.client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    });
    return response.content[0].text;
  }
  
  isAvailable(): boolean {
    return !!process.env.CLAUDE_API_KEY;
  }
}

// In LLMService constructor
this.adapter = new ClaudeAdapter();
```

### Adding Multi-User Support

**Required Changes**:
1. Add authentication middleware
2. User model and database
3. Associate generated posts with users
4. Add user preferences/history
5. Update API to filter by user

**Recommended Stack**:
- Auth: JWT or session-based
- Database: PostgreSQL or MongoDB
- ORM: Prisma or TypeORM

### Adding Scheduling

**Architecture**:
```
┌──────────────┐
│   Scheduler  │
│   Service    │
└──────┬───────┘
       │
       ↓
┌──────────────┐      ┌──────────────┐
│   Job Queue  │─────→│   Platform   │
│   (Bull)     │      │   APIs       │
└──────────────┘      └──────────────┘
```

**Components Needed**:
- Job queue (Bull/BullMQ)
- Scheduled posts table
- Platform API integrations
- Webhook endpoints

## Design Decisions

### Why TypeScript?

- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Autocomplete, refactoring
- **Self-Documenting**: Types serve as inline documentation
- **Scalability**: Easier to maintain as project grows

### Why Gemini?

- **Free Tier**: Generous limits for MVP
- **Quality**: Excellent text generation
- **Swappable**: Easy to change via adapter pattern

### Why No Database?

**MVP Rationale**:
- Single-user reduces complexity
- No persistence required initially
- Faster development cycle

**Migration Path**:
```typescript
// Easy to add later
interface PostRepository {
  save(post: GeneratedPost): Promise<void>;
  findByUser(userId: string): Promise<GeneratedPost[]>;
}
```

### Why Concurrent Generation?

**Performance**:
```typescript
// Serial: ~6 seconds (3 platforms × 2s each)
for (const platform of platforms) {
  posts[platform] = await generate(platform);
}

// Concurrent: ~2 seconds (parallel execution)
await Promise.all(
  platforms.map(p => generate(p))
);
```

**Trade-off**: Higher API load vs. better UX

### Why PWA?

- **Mobile Experience**: Install as native app
- **Offline Capability**: Can add caching later
- **No App Store**: Deploy directly
- **Low Barrier**: Works on any device

## Performance Considerations

### Backend

- **Concurrent Generation**: Parallel API calls
- **Configuration Caching**: Load once, reuse
- **Stateless Design**: Easy horizontal scaling

### Frontend

- **Code Splitting**: Vite handles automatically
- **Lazy Loading**: Components load on demand
- **Optimistic Updates**: Show loading states immediately

### Future Optimizations

- **Response Caching**: Cache similar ideas
- **Request Debouncing**: Prevent duplicate calls
- **Streaming Responses**: Show posts as generated
- **CDN**: Serve static assets globally

## Security Considerations

### Current Implementation

- **CORS**: Configured for development
- **Input Validation**: Basic sanitization
- **API Key Security**: Environment variables only

### Production Requirements

- **CORS**: Restrict to production domain
- **Rate Limiting**: Prevent abuse
- **Input Sanitization**: XSS prevention
- **HTTPS**: Encrypt all traffic
- **API Key Rotation**: Regular updates
- **Logging**: Monitor suspicious activity

## Testing Strategy

### Recommended Approach

**Backend Unit Tests**:
```typescript
describe('TopicDetector', () => {
  it('should detect tech topic from keywords', () => {
    const topic = topicDetector.detectTopic('AI and machine learning');
    expect(topic).toBe('tech');
  });
});
```

**Integration Tests**:
```typescript
describe('POST /api/generate', () => {
  it('should generate posts for valid idea', async () => {
    const response = await request(app)
      .post('/api/generate')
      .send({ idea: 'Test idea' });
    expect(response.status).toBe(200);
    expect(response.body.posts).toBeDefined();
  });
});
```

**Frontend Tests**:
```typescript
describe('PostCard', () => {
  it('should copy content to clipboard', () => {
    render(<PostCard platform="x" content="Test" />);
    fireEvent.click(screen.getByText('Copy'));
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
```

## Deployment

### Recommended Platforms

**Backend**:
- Render (free tier available)
- Railway
- Fly.io
- Heroku

**Frontend**:
- Vercel (automatic deployments)
- Netlify
- Cloudflare Pages

**Environment Variables**:
```bash
# Backend
GEMINI_API_KEY=xxx
PORT=3001
NODE_ENV=production

# Frontend
VITE_API_URL=https://api.postbuddy.com
```

---

**This architecture balances simplicity with extensibility, making it easy to ship an MVP while maintaining a clear path for future enhancements.**
