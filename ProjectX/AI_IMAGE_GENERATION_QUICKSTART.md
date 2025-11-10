# AI Image Generation - Quick Start Guide

## ✅ Installation Complete!

You've successfully installed all dependencies. Now follow these steps to activate the AI image generation feature.

## Step 1: Get Your Gemini API Key

1. Go to **[Google AI Studio](https://makersuite.google.com/app/apikey)**
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Copy the API key (starts with `AIza...`)

## Step 2: Add API Key to Environment

Open `backend/.env` and update the Gemini API key:

```env
# Gemini AI Configuration
GEMINI_API_KEY=AIzaSyC...your_actual_key_here
```

**Important:** Replace `your_gemini_api_key_here` with your actual API key!

## Step 3: Restart Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 3000
```

## Step 4: Test the Feature

### For Articles:

1. Open http://localhost:5173/admin/login
2. Login with your admin credentials
3. Go to **Dashboard** → **Articles**
4. Click **"Create New Article"**
5. Fill in:
   - Title: "The Future of AI in Healthcare"
   - Content: "Artificial intelligence is revolutionizing healthcare..."
   - Excerpt: "AI transforms medical diagnosis and treatment"
6. Scroll to **"Featured Image"** section
7. You'll see the **AI Image Generator** with a purple gradient background
8. Select a style (e.g., "Professional")
9. Optionally click **"AI Suggest"** for prompt ideas
10. Click **"Generate Image with AI"**
11. Wait 10-30 seconds
12. The image will appear and be automatically set!

### For Daily Tech Updates:

1. Go to **Dashboard** → **Daily Tech**
2. Click **"Create New Update"**
3. Fill in title and summary
4. Use the AI Image Generator in the thumbnail section
5. Images will be generated in 3:2 ratio (240x160)

## Features Overview

### 🎨 Style Options

- **Professional**: Clean, modern stock photo style
- **Artistic**: Creative and visually striking
- **Minimalist**: Simple with clean lines
- **Vibrant**: Energetic with bold colors
- **Tech**: Futuristic and high-tech
- **Illustration**: Digital art style

### 🤖 AI Prompt Suggestions

Click **"AI Suggest"** to get AI-generated prompt ideas based on your content.

### ✏️ Custom Instructions

Add specific details like:
- "Include a laptop and coffee cup"
- "Use blue and purple color scheme"
- "Show people collaborating"
- "Abstract geometric shapes"

### 📐 Automatic Sizing

- **Articles**: 16:9 widescreen (perfect for hero images)
- **Daily Tech**: 3:2 ratio (optimized for 240x160 cards)

## How It Works

```
1. You enter title + content
2. Select style + add custom prompt (optional)
3. Click "Generate Image with AI"
4. Gemini AI creates the image (10-30 seconds)
5. Image uploads to Cloudinary automatically
6. Image URL is set in the form
7. Save your article/update!
```

## Troubleshooting

### ❌ "Failed to generate image"

**Check:**
1. Is your API key correct in `.env`?
2. Did you restart the backend after adding the key?
3. Do you have API quota remaining?

**Test your API key:**
```bash
curl -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY"
```

### ⏱️ "Taking too long"

- Normal time: 10-30 seconds
- Be patient, the UI shows "Generating..."
- Don't close the modal while generating

### 🖼️ "Image doesn't match expectations"

**Tips:**
1. Write descriptive titles
2. Add custom prompt instructions
3. Try different styles
4. Use "AI Suggest" feature
5. Be specific about what you want

### 🔑 "Invalid API Key"

1. Verify the key in `.env` is correct
2. Check for extra spaces or quotes
3. Make sure it starts with `AIza`
4. Restart backend server

## API Quota

- **Free Tier**: Limited requests per day
- **Check Usage**: [Google AI Studio](https://makersuite.google.com/)
- **Upgrade**: If you need more, check [pricing](https://ai.google.dev/pricing)

## Security Notes

✅ API key is stored securely in `.env`
✅ Never exposed to frontend
✅ Requires admin authentication
✅ All requests go through backend
⚠️ Keep your API key secret
⚠️ Don't commit `.env` to git

## Example Workflow

### Creating an Article with AI Image

1. **Title**: "Quantum Computing Breakthrough"
2. **Content**: "Scientists achieve quantum supremacy..."
3. **Excerpt**: "New quantum processor solves complex problems"
4. **Style**: "Tech"
5. **Custom Prompt**: "Show quantum computer with glowing circuits, blue and purple colors"
6. **Click**: "Generate Image with AI"
7. **Result**: Beautiful tech-themed image in 16:9 ratio
8. **Save**: Article with AI-generated featured image!

## What's Next?

- ✨ Generate images for existing articles
- 🎨 Experiment with different styles
- 🤖 Try AI prompt suggestions
- 📊 Monitor your API usage
- 🚀 Create stunning content faster!

## Support

**Documentation:**
- Full guide: `backend/AI_IMAGE_GENERATION_SETUP.md`
- Installation: `backend/INSTALL_AI_DEPENDENCIES.md`

**Resources:**
- [Google AI Studio](https://makersuite.google.com/)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Imagen Documentation](https://ai.google.dev/docs/imagen)

## Summary

You now have AI-powered image generation! 🎉

**What you can do:**
- Generate custom images for articles (16:9)
- Generate thumbnails for daily tech updates (3:2)
- Choose from 6 different styles
- Get AI prompt suggestions
- Add custom instructions
- Automatic Cloudinary upload

**Just remember:**
1. Add your Gemini API key to `.env`
2. Restart the backend
3. Start creating amazing content!

Happy generating! ✨
