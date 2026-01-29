import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateImage, ImageStyle } from '@/lib/gemini-image';

const STYLE_OPTIONS: { value: ImageStyle; label: string }[] = [
  { value: 'realistic', label: 'リアル' },
  { value: 'digital_illustration', label: 'デジタルイラスト' },
  { value: 'vector', label: 'ベクターイラスト' },
  { value: 'icon', label: 'アイコン' },
];

export function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [style, setStyle] = useState<ImageStyle>('realistic');
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCooldown && cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime((prev) => {
          if (prev <= 1) {
            setIsCooldown(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isCooldown, cooldownTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');

    try {
      const url = await generateImage({ prompt: prompt.trim(), style });
      if (url) {
        setImageUrl(url);
        setIsCooldown(true);
        setCooldownTime(10);
      }
    } catch (err) {
      setError('画像の生成に失敗しました。もう一度お試しください。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <Textarea
          placeholder="画像の説明を入力してください"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
          rows={3}
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
      <Button type="submit" disabled={loading || !prompt.trim() || isCooldown}>
        {loading ? '生成中...' : isCooldown ? `クールダウン中 (${cooldownTime}秒)` : '画像を生成'}
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
  );
}
