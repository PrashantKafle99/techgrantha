# AI Image Generation Setup Guide

## Overview

This feature allows admins to generate custom images for articles and daily tech updates using Google's Gemini AI (Imagen 3 model).

## Features

- ✨ AI-powered image generation based on content
- 🎨 Multiple style options (professional, artistic, minimalist, vibrant, tech, illustration)
- 📐 Automatic aspect ratio optimization (16:9 for articles, 3:2 for daily tech)
- 🤖 AI prompt suggestions based on content
- ☁️ Automatic upload to Cloudinary
- 🎯 Custom prompt support for fine-tuning

## Setup Instructions

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key

### 2. Install Dependencies

```bash
cd backend
npm install @google/generative-ai
```

### 3. Configure Environment Variables

Add your Gemini API key to `backend/.env`:

```env
# Gemini AI Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 4. Restart Backend Server

```bash
cd backend
npm run dev
```

## Usage

### In Article Management

1. Go to http://localhost:5173/admin/articles
2. Click "Create New Article"
3. Fill in the title and content
4. In the "Featured Image" section, you'll see the AI Image Generator
5. Select a style (professional, artistic, etc.)
6. Optionally add custom instructions
7. Click "Generate Image with AI"
8. Wait 10-30 seconds for generation
9. The image will be automatically uploaded and set as the featured image

### In Update Management

1. Go to http://localhost:5173/admin/updates
2. Click "Create New Update"
3. Fill in the title and summary
4. In the "Thumbnail Image" section, use the AI Image Generator
5. Follow the same steps as articles

## API Endpoints

### Generate Image

```
POST /api/ai-image/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Article or Update Title",
  "content": "Full content or summary",
  "userPrompt": "Optional custom instructions",
  "type": "article" | "daily-tech",
  "style": "professional" | "artistic" | "minimalist" | "vibrant" | "tech" | "illustration"
}

Response:
{
  "success": true,
  "imageUrl": "https://res.cloudinary.com/...",
  "publicId": "tech-grantha/articles/...",
  "prompt": "The full prompt used for generation"
}
```

### Suggest Prompt

```
POST /api/ai-image/suggest-prompt
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Article Title",
  "content": "Article content",
  "type": "article" | "daily-tech"
}

Response:
{
  "success": true,
  "suggestion": "AI-generated prompt suggestion"
}
```

## Image Specifications

### Articles
- **Aspect Ratio**: 16:9 (widescreen)
- **Typical Display Sizes**: 
  - Featured: 1024x576px
  - Card: 800x450px
  - List: 640x360px
- **Format**: JPG (auto-optimized by Cloudinary)

### Daily Tech Updates
- **Aspect Ratio**: 3:2
- **Display Size**: 240x160px
- **Format**: JPG (auto-optimized by Cloudinary)

## Style Options

1. **Professional**: Clean, modern, high-quality stock photo style
2. **Artistic**: Creative, abstract, visually striking
3. **Minimalist**: Simple, clean lines, lots of negative space
4. **Vibrant**: Energetic with bold colors
5. **Tech**: Futuristic, technological, digital aesthetic
6. **Illustration**: Digital art, vector style, clean graphics

## Custom Prompts

You can add custom instructions to refine the generated image:

**Examples:**
- "Include a laptop and coffee cup"
- "Use blue and purple color scheme"
- "Show people collaborating in an office"
- "Abstract geometric shapes"
- "Night time cityscape background"

## AI Prompt Suggestions

Click the "AI Suggest" button to get AI-generated prompt ideas based on your content. This uses Gemini to analyze your title and content and suggest relevant visual elements.

## How It Works

1. **User Input**: Admin provides title, content, style, and optional custom prompt
2. **Prompt Building**: System creates a detailed prompt combining all inputs
3. **AI Generation**: Gemini Imagen 3 generates the image (10-30 seconds)
4. **Upload**: Image is automatically uploaded to Cloudinary
5. **Optimization**: Cloudinary optimizes the image for web delivery
6. **Integration**: Image URL is set in the form, ready to save

## Troubleshooting

### "Failed to generate image"

**Possible causes:**
1. Invalid or missing Gemini API key
2. API quota exceeded
3. Content violates safety policies
4. Network timeout

**Solutions:**
1. Verify API key in `.env`
2. Check [Google AI Studio](https://makersuite.google.com/) for quota
3. Try different content or style
4. Wait and retry

### "Image generation is slow"

- Normal generation time: 10-30 seconds
- Complex prompts may take longer
- Network speed affects upload time
- Be patient, the UI shows progress

### "Generated image doesn't match expectations"

**Tips for better results:**
1. Use descriptive titles
2. Add custom prompt instructions
3. Try different styles
4. Use the "AI Suggest" feature
5. Be specific about what you want

### API Key Issues

```bash
# Test your API key
curl -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY"
```

## Cost Considerations

- Gemini API has free tier with limits
- Check current pricing at [Google AI Pricing](https://ai.google.dev/pricing)
- Monitor usage in Google AI Studio
- Consider implementing rate limiting for production

## Security Notes

- ✅ API key stored securely in `.env`
- ✅ Never exposed to frontend
- ✅ Requires authentication to use
- ✅ All requests go through backend
- ⚠️ Keep API key secret
- ⚠️ Don't commit `.env` to git

## Future Enhancements

Potential improvements:
- Image editing/refinement
- Multiple image generation
- Style transfer from existing images
- Batch generation
- Image variation generation
- Custom aspect ratios
- Advanced prompt templates

## Support

For issues or questions:
1. Check Gemini API documentation
2. Review error logs in backend console
3. Test API key validity
4. Check Cloudinary configuration
5. Verify network connectivity

## Resources

- [Google AI Studio](https://makersuite.google.com/)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Imagen Documentation](https://ai.google.dev/docs/imagen)
- [Cloudinary Docs](https://cloudinary.com/documentation)
