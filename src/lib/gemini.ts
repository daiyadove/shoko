export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class ChatSession {
  private history: ChatMessage[] = [];

  async sendMessage(message: string): Promise<string> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: this.history,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      this.history.push({ role: 'user', content: message });
      this.history.push({ role: 'assistant', content: data.response });

      return data.response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}
