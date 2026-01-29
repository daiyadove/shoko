export type ImageStyle = 'realistic' | 'digital_illustration' | 'vector' | 'icon';

export interface GenerateImageParams {
  prompt: string;
  style: ImageStyle;
}

export async function generateImage({ prompt, style }: GenerateImageParams): Promise<string> {
  try {
    const response = await fetch('/api/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, style }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate image');
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}
