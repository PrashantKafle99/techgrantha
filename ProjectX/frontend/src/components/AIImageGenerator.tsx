import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface AIImageGeneratorProps {
  title: string;
  content: string;
  type: 'article' | 'daily-tech';
  onImageGenerated: (imageUrl: string, publicId: string) => void;
}

export function AIImageGenerator({ title, content, type, onImageGenerated }: AIImageGeneratorProps) {
  const { token } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  const [style, setStyle] = useState('professional');
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const styles = [
    { value: 'professional', label: 'Professional', desc: 'Clean, modern stock photo style' },
    { value: 'with-text', label: 'With Title Text', desc: 'Includes article title in the image' },
    { value: 'artistic', label: 'Artistic', desc: 'Creative and visually striking' },
    { value: 'minimalist', label: 'Minimalist', desc: 'Simple with clean lines' },
    { value: 'vibrant', label: 'Vibrant', desc: 'Energetic with bold colors' },
    { value: 'tech', label: 'Tech', desc: 'Futuristic and high-tech' },
    { value: 'illustration', label: 'Illustration', desc: 'Digital art style' }
  ];

  const handleSuggestPrompt = async () => {
    if (!title) {
      setError('Please enter a title first');
      return;
    }

    setIsSuggesting(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/ai-image/suggest-prompt`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          content,
          type
        })
      });

      const data = await response.json();

      if (data.success && data.suggestion) {
        setUserPrompt(data.suggestion);
      } else {
        setError('Failed to generate prompt suggestion');
      }
    } catch (err) {
      console.error('Suggest prompt error:', err);
      setError('An error occurred while generating suggestion');
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleGenerate = async () => {
    if (!title) {
      setError('Please enter a title first');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const response = await fetch(`${API_URL}/api/ai-image/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          content,
          userPrompt,
          type,
          style
        })
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedImage(data.imageUrl);
        onImageGenerated(data.imageUrl, data.publicId);
      } else {
        setError(data.error || 'Failed to generate image');
      }
    } catch (err) {
      console.error('Generate image error:', err);
      setError('An error occurred while generating the image');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-900">AI Image Generator</h3>
        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
          Powered by Gemini
        </span>
      </div>

      <p className="text-sm text-gray-600">
        Generate a custom image for your {type === 'daily-tech' ? 'tech update' : 'article'} using AI.
        {type === 'daily-tech' ? ' (3:2 ratio, 240x160)' : ' (16:9 widescreen)'}
      </p>

      {/* Style Selection */}
      <div className="space-y-2">
        <Label htmlFor="style">Image Style</Label>
        <Select value={style} onValueChange={setStyle}>
          <SelectTrigger id="style">
            <SelectValue placeholder="Select a style" />
          </SelectTrigger>
          <SelectContent>
            {styles.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                <div className="flex flex-col">
                  <span className="font-medium">{s.label}</span>
                  <span className="text-xs text-gray-500">{s.desc}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Custom Prompt */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="userPrompt">Custom Instructions (Optional)</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSuggestPrompt}
            disabled={isSuggesting || !title}
          >
            {isSuggesting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Suggesting...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                AI Suggest
              </>
            )}
          </Button>
        </div>
        <Textarea
          id="userPrompt"
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="e.g., Include a laptop, use blue tones, show people collaborating..."
          rows={3}
          disabled={isGenerating}
        />
        <p className="text-xs text-gray-500">
          Add specific details about what you want in the image
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {/* Generated Image Preview */}
      {generatedImage && (
        <div className="space-y-2">
          <Label>Generated Image</Label>
          <img
            src={generatedImage}
            alt="AI Generated"
            className="w-full rounded-lg border-2 border-green-200"
          />
          <p className="text-xs text-green-600 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Image generated successfully and uploaded to Cloudinary
          </p>
        </div>
      )}

      {/* Generate Button */}
      <Button
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating || !title}
        className="w-full"
        variant={generatedImage ? 'outline' : 'default'}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating Image... (may take 10-30 seconds)
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            {generatedImage ? 'Generate Another Image' : 'Generate Image with AI'}
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        AI-generated images are automatically optimized and uploaded to your media library
      </p>
    </div>
  );
}

export default AIImageGenerator;
