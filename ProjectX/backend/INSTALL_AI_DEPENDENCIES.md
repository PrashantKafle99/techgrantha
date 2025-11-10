# Install AI Image Generation Dependencies

## Quick Install

Run this command in the backend directory:

```bash
npm install @google/generative-ai
```

## What This Installs

- `@google/generative-ai` - Google's Generative AI SDK for Node.js
  - Provides access to Gemini models
  - Includes Imagen 3 for image generation
  - Handles API authentication and requests

## Verify Installation

After installing, verify it worked:

```bash
npm list @google/generative-ai
```

You should see:
```
tech-insights-backend@1.0.0
└── @google/generative-ai@x.x.x
```

## Next Steps

1. Get your Gemini API key from https://makersuite.google.com/app/apikey
2. Add it to `backend/.env`:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
3. Restart the backend server:
   ```bash
   npm run dev
   ```
4. Test the AI image generation in the admin panel!

## Troubleshooting

### Installation fails

Try:
```bash
npm cache clean --force
npm install @google/generative-ai
```

### Module not found error

Make sure you're in the `backend` directory:
```bash
cd backend
npm install @google/generative-ai
```

### API key not working

1. Verify the key is correct in `.env`
2. Check it's not expired
3. Ensure you have API quota remaining
4. Test at https://makersuite.google.com/
