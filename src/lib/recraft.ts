import axios from 'axios';

const getRecraftClient = () => {
  return axios.create({
    baseURL: 'https://external.api.recraft.ai/v1',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_RECRAFT_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
};

export type ImageStyle = 'realistic_image' | 'digital_illustration' | 'vector_illustration' | 'icon';

export interface GenerateImageParams {
  prompt: string;
  style: ImageStyle;
}

export async function generateImage({ prompt, style }: GenerateImageParams) {
  try {
    const client = getRecraftClient();
    const response = await client.post('/images/generations', {
      prompt,
      size: '1024x1024',
      style,
      n: 1,
      response_format: 'url',
    });

    return response.data.data[0].url;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}
