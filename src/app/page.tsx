'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageGenerator } from '@/components/image-generator';
import { TextGenerator } from '@/components/text-generator';

export default function Home() {
  return (
    <main className="container mx-auto p-4 min-h-screen">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>AI生成ツール</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="text" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">文章生成</TabsTrigger>
              <TabsTrigger value="image">画像生成</TabsTrigger>
            </TabsList>
            <TabsContent value="text">
              <TextGenerator />
            </TabsContent>
            <TabsContent value="image">
              <ImageGenerator />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
