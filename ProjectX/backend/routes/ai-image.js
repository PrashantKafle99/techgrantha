import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { generateImage, generatePromptSuggestion } from '../utils/gemini.js';

const router = express.Router();

/**
 * POST /api/ai-image/generate
 * Generate an image using Gemini AI
 * Requires authentication
 */
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      content = '',
      userPrompt = '',
      type = 'article', // 'article' or 'daily-tech'
      style = 'professional' // 'professional', 'artistic', 'minimalist', 'vibrant', 'tech', 'illustration'
    } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }

    // Validate type
    if (!['article', 'daily-tech'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Type must be either "article" or "daily-tech"'
      });
    }

    console.log(`Generating ${type} image for: "${title}"`);

    // Generate image
    const result = await generateImage({
      title,
      content,
      userPrompt,
      type,
      style
    });

    res.json({
      success: true,
      message: 'Image generated successfully',
      imageUrl: result.imageUrl,
      publicId: result.publicId,
      prompt: result.prompt
    });

  } catch (error) {
    console.error('AI image generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate image'
    });
  }
});

/**
 * POST /api/ai-image/suggest-prompt
 * Get AI-generated prompt suggestion based on content
 * Requires authentication
 */
router.post('/suggest-prompt', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      content = '',
      type = 'article'
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }

    const result = await generatePromptSuggestion({
      title,
      content,
      type
    });

    res.json(result);

  } catch (error) {
    console.error('Prompt suggestion error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate prompt suggestion'
    });
  }
});

export default router;
