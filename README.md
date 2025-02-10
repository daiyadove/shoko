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

## Google Cloud Runへのデプロイ

1. 前提条件:
- Google Cloud CLIのインストール
- プロジェクトの作成と設定
```bash
# Google Cloud CLIのインストール（まだの場合）
curl https://sdk.cloud.google.com | bash
gcloud init

# プロジェクトの設定
gcloud config set project [YOUR_PROJECT_ID]
```

2. 必要なAPIと権限の設定:
```bash
# 必要なAPIの有効化
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable run.googleapis.com

# Cloud Build Service Accountに必要な権限を付与
PROJECT_NUMBER=$(gcloud projects describe $GOOGLE_CLOUD_PROJECT --format='value(projectNumber)')
PROJECT_ID=$(gcloud config get-value project)

# Cloud Build Service Accountに権限を付与
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com" \
    --role="roles/artifactregistry.admin"

# Service Account User権限を付与
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"
```

3. Dockerイメージのビルドとプッシュ:
```bash
# Artifact Registryリポジトリの作成
gcloud artifacts repositories create game-generator \
    --repository-format=docker \
    --location=asia-northeast1 \
    --description="Game Generator Container Repository"

# Dockerイメージのビルドとプッシュ
gcloud builds submit --tag asia-northeast1-docker.pkg.dev/$PROJECT_ID/game-generator/app:latest
```

3. Cloud Runへのデプロイ:
```bash
gcloud run deploy game-generator \
  --image asia-northeast1-docker.pkg.dev/[PROJECT_ID]/game-generator/app:latest \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated \
  --set-env-vars "OPENAI_API_KEY=[YOUR_API_KEY]"
```

4. デプロイの確認:
- 提供されたURLでアプリケーションにアクセス
- ログの確認:
```bash
gcloud run services logs read game-generator
```

5. トラブルシューティング:
- Cloud Runのログでエラーを確認
- 環境変数が正しく設定されているか確認
- コンテナのヘルスチェック状態を確認

## 技術スタック

- Python 3.9
- Streamlit
- OpenAI API (GPT-4, DALL-E 3)
- HTML/CSS/JavaScript (生成されるゲーム)
