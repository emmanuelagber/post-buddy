# ⚠️ CRITICAL: API Key Setup Required

## The Problem You're Experiencing

If you're seeing generic, templated responses like:

```
"You know what I realized recently? [your idea]
It's funny how we often overlook these simple truths..."
```

**This means the backend is using the MOCK adapter instead of real AI.**

## Why This Happens

The backend has NO GEMINI API KEY configured, so it falls back to placeholder text that just templates your input.

## The Solution (2 minutes)

### Step 1: Get Your FREE Gemini API Key

1. Go to: **https://makersuite.google.com/app/apikey**
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)

**This is 100% FREE** with generous limits (15 requests/minute).

### Step 2: Add the Key to Your Backend

1. Open `post-buddy/backend/.env`
2. Replace this line:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   With your actual key:
   ```
   GEMINI_API_KEY=AIzaSyC...your_actual_key_here
   ```
3. **Save the file**

### Step 3: Restart the Backend

```bash
# Stop the backend (Ctrl+C in that terminal)
# Then restart:
cd backend
npm run dev
```

You should now see:
```
✓ Gemini API key configured
```

Instead of:
```
⚠ Gemini API key not found - using mock adapter
```

## Test It Works

1. Try your input again: "Manchester United to beat Fulham today"
2. You should now get REAL AI-generated content like:

**Facebook (Football topic):**
```
Big match today! Manchester United taking on Fulham, and I'm feeling 
confident about this one. 

United's been showing some real form lately, and their attacking play 
has been sharp. Fulham's defense has been shaky on the road, and I 
think we're going to capitalize on that.

Calling it now - United takes all three points today! Who else is 
watching? What's your prediction? ⚽🔴

#MUFC #PremierLeague
```

## Common Issues

### "I added the key but still see mock content"

**Solution**: Did you restart the backend server?
```bash
# Stop it (Ctrl+C)
# Start it again
npm run dev
```

### "How do I know if it's working?"

**Check the startup logs:**
```
✓ Gemini API key configured    ← Good!
⚠ Using mock adapter           ← Bad! Key not found
```

### "The key doesn't work"

**Verify:**
1. No extra spaces in the .env file
2. No quotes around the key: `GEMINI_API_KEY=AIza...` (not `"AIza..."`)
3. The key is valid at https://makersuite.google.com/app/apikey

### "I don't want to get an API key"

Then you'll only get placeholder mock content. The mock adapter exists so you can test the **structure** of the app, but for real content generation, you MUST use a real LLM API.

## Why Not Include a Default Key?

Including API keys in code is a **major security risk**. Everyone gets their own free key - it takes 30 seconds.

## Free Tier Limits

Gemini's free tier is very generous:
- **15 requests per minute**
- **1,500 requests per day**
- **1 million tokens per month**

Perfect for development and personal use!

---

**After fixing this, you'll get professional, contextual, platform-optimized posts instead of generic templates!**
