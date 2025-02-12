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

export interface GenerateImageParams {
  prompt: string;
}

export async function generateImage({ prompt }: GenerateImageParams) {
  try {
    const client = getRecraftClient();
    const response = await client.post('/images/generations', {
      prompt,
      size: '1024x1024',
      style: 'realistic_image',
      n: 1,
      response_format: 'url',
    });

    return response.data.data[0].url;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}
