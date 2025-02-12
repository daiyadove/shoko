'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateImage, ImageStyle } from '@/lib/recraft';

const STYLE_OPTIONS: { value: ImageStyle; label: string }[] = [
  { value: 'realistic_image', label: 'リアル' },
  { value: 'digital_illustration', label: 'デジタルイラスト' },
  { value: 'vector_illustration', label: 'ベクターイラスト' },
  { value: 'icon', label: 'アイコン' },
];

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [style, setStyle] = useState<ImageStyle>('realistic_image');

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');

    try {
      const url = await generateImage({ prompt: prompt.trim(), style });
      if (url) {
        setImageUrl(url);
        setCountdown(30);
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
            <div className="space-y-4">
              <Input
                placeholder="画像の説明を入力してください"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
              />
              <Select
                value={style}
                onValueChange={(value) => setStyle(value as ImageStyle)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="スタイルを選択" />
                </SelectTrigger>
                <SelectContent>
                  {STYLE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading || !prompt.trim() || countdown > 0}>
              {loading ? '生成中...' : countdown > 0 ? `${countdown}秒後に生成可能` : '画像を生成'}
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
