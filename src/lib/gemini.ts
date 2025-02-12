import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class ChatSession {
  private chat;

  constructor() {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    this.chat = model.startChat({
      history: [],
    });
  }

  async sendMessage(message: string) {
    try {
      const result = await this.chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}
