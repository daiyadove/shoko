import { GoogleGenerativeAI } from '@google/generative-ai';

const getGeminiClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not set');
  }
  return new GoogleGenerativeAI(apiKey);
};

export type ImageStyle = 'realistic' | 'digital_illustration' | 'vector' | 'icon';

const STYLE_PROMPTS: Record<ImageStyle, string> = {
  realistic: 'photorealistic style, high quality photograph, ',
  digital_illustration: 'digital illustration style, detailed artwork, ',
  vector: 'vector art style, clean lines, flat colors, ',
  icon: 'simple icon style, minimal, clean, ',
};

export interface GenerateImageParams {
  prompt: string;
  style: ImageStyle;
}

export async function generateImage({ prompt, style }: GenerateImageParams): Promise<string> {
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({
      model: 'gemini-2.0-flash-exp-image-generation',
      generationConfig: {
        responseModalities: ['image', 'text'],
      } as never,
    });

    const stylePrompt = STYLE_PROMPTS[style] || '';
    const fullPrompt = `${stylePrompt}${prompt}`;

    const response = await model.generateContent(fullPrompt);
    const result = response.response;

    for (const candidate of result.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData) {
          const { mimeType, data } = part.inlineData;
          return `data:${mimeType};base64,${data}`;
        }
      }
    }

    throw new Error('No image data in response');
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}
