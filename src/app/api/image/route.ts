import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

type ImageStyle = 'realistic' | 'digital_illustration' | 'vector' | 'icon';

const STYLE_PROMPTS: Record<ImageStyle, string> = {
  realistic: 'photorealistic style, high quality photograph, ',
  digital_illustration: 'digital illustration style, detailed artwork, ',
  vector: 'vector art style, clean lines, flat colors, ',
  icon: 'simple icon style, minimal, clean, ',
};

export async function POST(request: NextRequest) {
  try {
    const { prompt, style } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp-image-generation',
      generationConfig: {
        responseModalities: ['image', 'text'],
      } as never,
    });

    const stylePrompt = STYLE_PROMPTS[style as ImageStyle] || '';
    const fullPrompt = `${stylePrompt}${prompt}`;

    const response = await model.generateContent(fullPrompt);
    const result = response.response;

    for (const candidate of result.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData) {
          const { mimeType, data } = part.inlineData;
          return NextResponse.json({ imageUrl: `data:${mimeType};base64,${data}` });
        }
      }
    }

    return NextResponse.json({ error: 'No image data in response' }, { status: 500 });
  } catch (error) {
    console.error('Image API error:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
