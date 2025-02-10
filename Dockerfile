# Python 3.9のベースイメージを使用
FROM python:3.9-slim

# 作業ディレクトリを設定
WORKDIR /app

# 必要なパッケージをインストール
COPY requirements.txt .
RUN pip install -r requirements.txt

# アプリケーションファイルをコピー
COPY . .

# Streamlitの設定
ENV STREAMLIT_SERVER_PORT=8080
ENV STREAMLIT_SERVER_ADDRESS=0.0.0.0

# ポートを公開
EXPOSE 8080

# アプリケーションを実行
CMD ["streamlit", "run", "app.py"]
