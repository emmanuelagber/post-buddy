# 🔧 Troubleshooting: API Key Not Loading

## Issue: "Gemini API key not found" but I added it to .env

If you see this in your logs:
```
⚠ Gemini API key not found, using mock adapter
✓ Gemini API key configured
```

You have the key in `.env` but it's loading **after** the LLM service initializes.

## Solution 1: Verify .env File Location (Most Common Issue)

Your `.env` file MUST be in the `backend/` directory, NOT the root `post-buddy/` directory.

**Correct location:**
```
post-buddy/
  backend/
    .env          ← HERE!
    src/
    package.json
  frontend/
```

**Wrong location:**
```
post-buddy/
  .env            ← NOT here!
  backend/
  frontend/
```

## Solution 2: Check .env File Format

Open `backend/.env` and verify:

**✅ CORRECT:**
```env
GEMINI_API_KEY=AIzaSyC...your_key_here
PORT=3001
```

**❌ WRONG (no quotes, no spaces):**
```env
GEMINI_API_KEY = "AIzaSyC...your_key_here"
GEMINI_API_KEY: AIzaSyC...your_key_here
GEMINI_API_KEY=AIzaSyC...your_key_here 
```

## Solution 3: Restart Backend Properly

```bash
# Stop the current process (Ctrl+C)
# Clear any cached processes
taskkill /F /IM node.exe     # Windows
# or
pkill -9 node                # Mac/Linux

# Start fresh
cd backend
npm run dev
```

## Solution 4: Windows-Specific Path Issue

If on Windows, make sure you're in the right directory:

```bash
# Navigate to backend
cd C:\Users\Emmanuel\OneDrive\Documents\Nuel\post-buddy\post-buddy\backend

# Verify .env exists
dir .env

# Should show the file. If not, create it:
copy .env.example .env
# Then edit .env with your API key
```

## Solution 5: Test Environment Variables

Create a test file to verify:

**backend/test-env.js:**
```javascript
require('dotenv').config();
console.log('API Key:', process.env.GEMINI_API_KEY ? 'Found ✓' : 'Not found ✗');
console.log('First 10 chars:', process.env.GEMINI_API_KEY?.substring(0, 10));
```

Run it:
```bash
cd backend
node test-env.js
```

Should output:
```
API Key: Found ✓
First 10 chars: AIzaSyC...
```

## Solution 6: Use the Fixed Code

I've updated the code to load environment variables BEFORE any imports. 

Download the latest version where `server.ts` starts with:
```typescript
// CRITICAL: Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();
```

## Verify It's Working

When properly configured, you should see **ONLY** this message:
```
✓ Gemini API key configured
```

**NOT** both messages together.

## Testing Real Generation

Try this idea:
```
Manchester United will beat Fulham today
```

**With mock adapter (broken):**
```
Manchester united will beat fulham today  What do you think?
```

**With real Gemini (working):**
```
Big day at Old Trafford! 🔴⚽

Manchester United hosting Fulham, and I'm feeling confident about this one. 
The Reds have been in strong form at home, and with Bruno pulling the strings 
and Rashford looking sharp, I reckon we'll see a comfortable victory.

Fulham's been decent this season, but their away record tells a different 
story. Calling it now - United 3, Fulham 1.

Who else is watching? What's your prediction? 

GGMU!
```

See the difference? Real AI creates natural, engaging content. Mock just templates your words.

## Still Not Working?

1. Share your `.env` file content (REMOVE the actual API key)
2. Share the full terminal output
3. Verify API key works at: https://aistudio.google.com/app/apikey

## Quick Fix Checklist

- [ ] .env file is in `backend/` folder
- [ ] No quotes around API key
- [ ] No spaces before/after `=`
- [ ] Backend fully restarted (killed old process)
- [ ] Using updated code with early dotenv.config()
- [ ] API key is valid and active

After fixing, you should get intelligent, context-aware posts! 🚀
