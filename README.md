This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Netlifyでデプロイする

このNext.jsアプリケーションをNetlifyにデプロイする手順:

1. GitHubにリポジトリをプッシュ
2. Netlifyでアカウントを作成し、「New site from Git」を選択
3. GitHubリポジトリを選択
4. ビルド設定は自動的に`netlify.toml`から読み込まれます

### 環境変数の設定

以下の環境変数をNetlifyのサイト設定で設定してください:

```
GEMINI_API_KEY=your_gemini_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
RECRAFT_API_KEY=your_recraft_api_key
```

設定手順:
1. Netlifyダッシュボードでサイトを選択
2. Site settings > Build & deploy > Environment variables
3. 上記の環境変数を追加

これらの環境変数は`.env.example`を参考にしてください。
