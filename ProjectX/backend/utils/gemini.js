import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate an image using external API (Pollinations.ai - free alternative)
 * @param {Object} params - Generation parameters
 * @param {string} params.title - Content title
 * @param {string} params.content - Content text (optional)
 * @param {string} params.userPrompt - User's custom prompt additions (optional)
 * @param {string} params.type - 'article' or 'daily-tech'
 * @param {string} params.style - Image style preference
 * @returns {Promise<Object>} Generated image data
 */
export async function generateImage({ title, content = '', userPrompt = '', type = 'article', style = 'professional' }) {
  try {
    // Build the prompt using Gemini for enhancement
    const enhancedPrompt = await enhancePromptWithGemini({ title, content, userPrompt, type, style });
    
    console.log('Generating image...');
    console.log('Enhanced Prompt:', enhancedPrompt);

    // Use Pollinations.ai free image generation API
    // This is a free, no-auth-required service that generates high-quality images
    const width = type === 'daily-tech' ? 720 : 1280;
    const height = type === 'daily-tech' ? 480 : 720;
    
    // Encode the prompt for URL
    const encodedPrompt = encodeURIComponent(enhancedPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&enhance=true`;
    
    console.log('Fetching generated image...');
    
    // Fetch the generated image
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Image generation failed: ${response.statusText}`);
    }
    
    // Get image as buffer
    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);
    
    // Upload to Cloudinary
    const folder = type === 'daily-tech' ? 'tech-grantha/updates' : 'tech-grantha/articles';
    const cloudinaryResult = await uploadImageFromBuffer(imageBuffer, folder);

    return {
      success: true,
      imageUrl: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id,
      prompt: enhancedPrompt
    };

  } catch (error) {
    console.error('Image generation error:', error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
}

/**
 * Use Gemini to enhance and optimize the image generation prompt
 */
async function enhancePromptWithGemini({ title, content, userPrompt, type, style }) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const styleDescriptions = {
      professional: 'photorealistic, professional photography, high-end stock photo quality, sharp focus, studio lighting',
      'with-text': 'professional banner design with bold typography, the title text prominently displayed, modern graphic design, clean layout, readable fonts',
      artistic: 'artistic photography, creative composition, dramatic lighting, visually striking, award-winning',
      minimalist: 'minimalist photography, clean composition, negative space, simple elegant design, modern aesthetic',
      vibrant: 'vibrant photography, bold saturated colors, energetic composition, dynamic lighting, eye-catching',
      tech: 'futuristic technology photography, sleek modern design, blue and purple tones, high-tech aesthetic, cinematic lighting',
      illustration: 'digital illustration, vector art style, clean modern graphics, flat design, professional quality'
    };

    const styleDesc = styleDescriptions[style] || styleDescriptions.professional;
    const contentSnippet = content ? content.substring(0, 300) : '';
    const includeText = style === 'with-text';
    
    const enhancementPrompt = `You are an expert at creating detailed image generation prompts for AI. Create a highly detailed${includeText ? ', text-inclusive' : ', photorealistic'} image prompt (max 150 words) for a technology blog banner.

Article Title: "${title}"
Article Context: ${contentSnippet}
Visual Style: ${styleDesc}
Image Type: ${type === 'daily-tech' ? 'Tech news thumbnail (3:2 ratio)' : 'Article hero banner (16:9 widescreen)'}
${userPrompt ? `User Requirements: ${userPrompt}` : ''}
${includeText ? `\nIMPORTANT: The image MUST include the title text "${title}" prominently displayed with clear, readable typography.` : ''}

Create a prompt that will generate a ${includeText ? 'professional banner with text' : 'realistic, professional banner image'}. Include:
1. Main subject/focal point related to the topic
2. Specific composition details (foreground, background, depth)
3. Lighting style (natural, studio, dramatic, soft)
4. Color palette and mood
5. Camera angle and perspective
6. Texture and material details
7. Professional photography keywords

Important:
- Make it ${includeText ? 'a professional graphic design with clear text' : 'photorealistic and professional'}
- ${includeText ? 'MUST include the title text clearly visible and readable' : 'NO text, logos, or watermarks in the image'}
- Focus on visual storytelling
- ${includeText ? 'Use graphic design and typography terms' : 'Use photography and cinematography terms'}
- Be specific about technical details

Output only the refined prompt, nothing else.`;

    const result = await model.generateContent(enhancementPrompt);
    const response = await result.response;
    let enhancedPrompt = response.text().trim();
    
    // Remove quotes if present
    enhancedPrompt = enhancedPrompt.replace(/^["']|["']$/g, '');
    
    // Add quality enhancers
    enhancedPrompt += ', professional photography, 8k uhd, high quality, realistic, detailed, sharp focus';
    
    return enhancedPrompt;
    
  } catch (error) {
    console.error('Prompt enhancement error:', error);
    // Fallback to enhanced basic prompt
    return buildEnhancedPrompt({ title, content, userPrompt, type, style });
  }
}

/**
 * Build an enhanced fallback prompt for image generation
 */
function buildEnhancedPrompt({ title, content, userPrompt, type, style }) {
  const stylePrompts = {
    professional: 'professional photography, corporate tech environment, modern office setting, clean aesthetic, natural lighting, sharp focus, high-end stock photo quality',
    'with-text': `professional banner design with bold text "${title}" prominently displayed, modern typography, clean graphic design layout, technology themed background, readable fonts, professional quality`,
    artistic: 'artistic photography, creative composition, dramatic lighting, abstract technology elements, visually striking, award-winning photography style',
    minimalist: 'minimalist photography, clean simple composition, lots of negative space, modern elegant design, soft lighting, professional quality',
    vibrant: 'vibrant photography, bold saturated colors, energetic dynamic composition, colorful tech elements, eye-catching, professional lighting',
    tech: 'futuristic technology photography, sleek modern devices, blue and purple neon lighting, high-tech aesthetic, cinematic composition, sci-fi inspired',
    illustration: 'digital illustration, modern vector art style, clean flat design, professional graphics, technology themed, vibrant colors'
  };

  const styleDesc = stylePrompts[style] || stylePrompts.professional;
  
  // Extract key concepts from title
  const titleLower = title.toLowerCase();
  let subject = 'technology';
  
  if (titleLower.includes('ai') || titleLower.includes('artificial intelligence')) {
    subject = 'artificial intelligence, neural networks, machine learning visualization';
  } else if (titleLower.includes('cloud')) {
    subject = 'cloud computing, data centers, server infrastructure';
  } else if (titleLower.includes('mobile') || titleLower.includes('app')) {
    subject = 'mobile devices, smartphones, modern applications';
  } else if (titleLower.includes('security') || titleLower.includes('cyber')) {
    subject = 'cybersecurity, digital security, encryption visualization';
  } else if (titleLower.includes('data')) {
    subject = 'data visualization, analytics, information technology';
  }
  
  let prompt = `Photorealistic ${styleDesc}, featuring ${subject} related to "${title}"`;
  
  if (userPrompt && userPrompt.trim()) {
    prompt += `, ${userPrompt.trim()}`;
  }
  
  prompt += ', professional photography, 8k uhd, high quality, realistic, detailed, sharp focus, no text, no watermarks, suitable for technology blog banner';

  return prompt;
}

/**
 * Upload image buffer to Cloudinary
 */
async function uploadImageFromBuffer(buffer, folder) {
  const cloudinary = (await import('cloudinary')).v2;
  
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'image',
        format: 'jpg',
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Generate a prompt suggestion based on title and content
 */
export async function generatePromptSuggestion({ title, content, type }) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Based on this ${type === 'daily-tech' ? 'tech news update' : 'article'}, suggest a concise image description (max 50 words) that would make a great visual:

Title: "${title}"
Content: ${content.substring(0, 300)}...

Provide only the image description, no explanations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestion = response.text().trim();

    return {
      success: true,
      suggestion
    };

  } catch (error) {
    console.error('Prompt suggestion error:', error);
    return {
      success: false,
      suggestion: 'A professional technology-themed image'
    };
  }
}

export default {
  generateImage,
  generatePromptSuggestion
};
