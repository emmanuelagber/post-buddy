# ⚡ Post Buddy - Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

- ✅ Node.js 18 or higher
- ✅ npm (comes with Node.js)
- ✅ A code editor (VS Code recommended)
- ✅ Terminal/Command Line access

## Step 1: Get a Gemini API Key (2 minutes)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (you'll need it in Step 3)

💡 **Free tier includes**: 15 requests per minute, perfect for development!

## Step 2: Setup the Project (2 minutes)

### Option A: Automated Setup (Recommended)

```bash
cd post-buddy
chmod +x setup.sh
./setup.sh
```

The script will:
- Install all dependencies
- Create .env files
- Guide you through configuration

### Option B: Manual Setup

**Backend:**
```bash
cd post-buddy/backend
npm install
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

**Frontend:**
```bash
cd post-buddy/frontend
npm install
cp .env.example .env
# Default settings work for local dev
```

## Step 3: Add Your API Key (30 seconds)

Edit `backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

Replace `your_gemini_api_key_here` with the key from Step 1.

## Step 4: Start the Application (30 seconds)

Open **two terminals**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Post Buddy API Server
📍 Server running on http://localhost:3001
✓ Gemini API key configured
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

## Step 5: Test It Out! (1 minute)

1. Open http://localhost:3000 in your browser
2. Type an idea: `"AI is transforming software development"`
3. (Optional) Select topic: `tech`
4. Click **"Generate Posts"** or press `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows)
5. Watch as posts are generated for X, LinkedIn, and Facebook!
6. Click **"Copy"** on any post to copy to clipboard

## 🎉 Success!

You should now see three generated posts, each optimized for its platform.

## Common Issues & Solutions

### ❌ "Backend won't start"

**Problem**: Port 3001 already in use

**Solution**: 
```bash
# Kill the process using port 3001
lsof -ti:3001 | xargs kill -9

# Or change the port in backend/.env
PORT=3002
```

### ❌ "Frontend can't connect to API"

**Problem**: CORS or proxy issue

**Solution**:
1. Verify backend is running on port 3001
2. Check `frontend/vite.config.ts` proxy settings:
   ```typescript
   proxy: {
     '/api': {
       target: 'http://localhost:3001',
       changeOrigin: true
     }
   }
   ```

### ❌ "Gemini API key not configured"

**Problem**: API key not set or invalid

**Solution**:
1. Verify key is in `backend/.env`
2. No quotes needed: `GEMINI_API_KEY=AIza...`
3. Restart backend server after adding key
4. Test key at [Google AI Studio](https://makersuite.google.com/app/apikey)

### ❌ "Mock adapter being used"

**Problem**: Backend using fallback mock responses

**Solution**:
```bash
# Verify .env file exists
ls backend/.env

# Check if key is set
cat backend/.env | grep GEMINI_API_KEY

# If missing, add it
echo "GEMINI_API_KEY=your_key_here" >> backend/.env

# Restart backend
cd backend && npm run dev
```

### ❌ "TypeError: Cannot read property..."

**Problem**: Dependencies not installed

**Solution**:
```bash
# Reinstall dependencies
cd backend && rm -rf node_modules && npm install
cd ../frontend && rm -rf node_modules && npm install
```

## Next Steps

### Try Different Ideas

**Tech:**
```
"Most bugs happen at integration boundaries"
"Code comments are a code smell"
"Premature optimization is the root of all evil"
```

**Business:**
```
"Customer retention is 10x more valuable than acquisition"
"The best marketing is a great product"
"Profit is a lagging indicator of value creation"
```

**Politics:**
```
"Democracy requires active participation"
"Policy should be evidence-based, not ideology-driven"
```

### Customize Topics

Edit `backend/src/config/topics.json` to add your own topics:

```json
{
  "topics": {
    "cooking": {
      "platforms": ["facebook", "linkedin"],
      "rules": {
        "facebook": {
          "tone": "warm, inviting",
          "format": "story-like, 2-3 paragraphs",
          "style": "personal, descriptive"
        }
      }
    }
  },
  "keywords": {
    "cooking": ["recipe", "food", "cooking", "baking", "chef"]
  }
}
```

Restart the backend, and "cooking" will be available!

### Build for Production

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- **Backend**: Changes auto-restart server
- **Frontend**: Changes instantly reflect in browser

### VS Code Extensions
Recommended extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

### Debug Mode
```bash
# Backend with debug logs
DEBUG=* npm run dev

# Frontend with verbose output
npm run dev -- --debug
```

## Deploy to Production

Quick deploy options:

**Backend → Render**
1. Push to GitHub
2. Connect to Render
3. Add GEMINI_API_KEY environment variable
4. Deploy!

**Frontend → Vercel**
1. Push to GitHub
2. Import to Vercel
3. Add VITE_API_URL environment variable
4. Deploy!

See [README.md](README.md) for detailed deployment instructions.

## Get Help

- 📖 [Full Documentation](README.md)
- 💡 [Usage Examples](EXAMPLES.md)
- 🏗️ [Architecture Guide](ARCHITECTURE.md)
- 📁 [File Structure](FILE_STRUCTURE.md)

## Keyboard Shortcuts

- `Cmd/Ctrl + Enter`: Generate posts
- `Cmd/Ctrl + /`: Focus idea input
- `Escape`: Clear error messages

---

**Happy posting! 🚀**

Questions? Check the [README](README.md) or [create an issue](https://github.com/yourusername/post-buddy/issues).
