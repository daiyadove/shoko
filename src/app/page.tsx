'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateImage } from '@/lib/recraft';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');

    try {
      const url = await generateImage({ prompt: prompt.trim() });
      if (url) {
        setImageUrl(url);
      }
    } catch (err) {
      setError('画像の生成に失敗しました。もう一度お試しください。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4 min-h-screen">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Recraft 画像生成</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="画像の説明を入力してください"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading || !prompt.trim()}>
              {loading ? '生成中...' : '画像を生成'}
            </Button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {imageUrl !== null && (
              <div className="mt-4">
                <img
                  src={imageUrl}
                  alt={prompt}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
