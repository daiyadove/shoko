# ゲームコンテンツジェネレーター

AIを使用してHTMLゲームと関連画像を生成するStreamlitアプリケーション。

## 機能

- 🎮 HTMLゲーム生成
  - GPT-4を使用して単一HTMLファイルのゲームを生成
  - レスポンシブデザイン対応
  - その場でプレイ可能

- 🎨 ゲーム画像生成
  - DALL-E 3を使用してゲーム用の画像を生成
  - 1024x1024サイズの高品質画像

## ローカル開発

1. リポジトリのクローン:
```bash
git clone [リポジトリURL]
cd [リポジトリ名]
```

2. 依存関係のインストール:
```bash
pip install -r requirements.txt
```

3. 環境変数の設定:
```bash
cp .env.example .env
```
`.env`ファイルを編集し、OpenAI APIキーを設定:
```
OPENAI_API_KEY=your-api-key-here
```

4. アプリケーションの起動:
```bash
streamlit run app.py
```

## Netlifyへのデプロイ

1. GitHubリポジトリの作成とプッシュ

2. Netlifyでの設定:
   - リポジトリを連携
   - 環境変数`OPENAI_API_KEY`を設定
   - デプロイ設定は`netlify.toml`で定義済み

3. デプロイ完了後、提供されたURLでアプリケーションにアクセス可能

## 技術スタック

- Python 3.9
- Streamlit
- OpenAI API (GPT-4, DALL-E 3)
- HTML/CSS/JavaScript (生成されるゲーム)
