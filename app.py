import streamlit as st
from openai import OpenAI
from dotenv import load_dotenv
import os

# 環境変数の読み込み
load_dotenv()

# OpenAI クライアントの初期化
api_key = os.getenv("OPENAI_API_KEY")
if not api_key and 'OPENAI_API_KEY' in st.secrets:
    api_key = st.secrets['OPENAI_API_KEY']

client = OpenAI(api_key=api_key)

def generate_html_game(prompt: str) -> str:
    """
    OpenAI GPT-4を使用してHTMLゲームを生成する関数
    
    Args:
        prompt (str): ユーザーからの入力プロンプト
    
    Returns:
        str: 生成されたHTMLゲームのコード
    """
    try:
        # システムプロンプトの設定
        system_prompt = """
        あなたは単一のHTMLファイルでゲームを生成するエキスパートです。
        以下の制約条件で実装してください：

        1. 技術要件：
        - すべてのコード（HTML/CSS/JavaScript）は1つのファイルに含める
        - 外部ライブラリはCDN経由でのみ使用可能（推奨：Phaser.js, Three.js, Pixi.js等）
        - モバイルデバイスでも動作するレスポンシブデザイン
        - タッチ操作とマウス操作の両方に対応

        2. ゲーム要件：
        - ゲームの目的と操作方法を画面上に表示
        - スコアやライフなどの基本的なゲーム要素を含める
        - ゲームオーバー時のリスタート機能
        - 効果音や背景音楽（CDN経由のオーディオファイル）

        3. コーディング規約：
        - コードは適切にコメント化し、セクションごとに分ける
        - 変数名や関数名は意味のある命名を使用
        - エラーハンドリングを適切に実装
        - パフォーマンスを考慮した実装

        必ずゲームとして完全に機能する単一のHTMLファイルを生成してください。
        """

        # OpenAI APIの呼び出し
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=4000
        )
        
        # 生成されたコードを取得
        generated_code = response.choices[0].message.content
        
        # コードブロックから純粋なHTMLコードを抽出
        if "```html" in generated_code:
            generated_code = generated_code.split("```html")[1].split("```")[0].strip()
        elif "```" in generated_code:
            generated_code = generated_code.split("```")[1].split("```")[0].strip()
            
        return generated_code
    
    except Exception as e:
        st.error(f"エラーが発生しました: {str(e)}")
        return None

def generate_game_image(prompt: str) -> str:
    """
    OpenAI DALL-E 3を使用してゲーム用の画像を生成する関数
    
    Args:
        prompt (str): ユーザーからの入力プロンプト
    
    Returns:
        str: 生成された画像のURL
    """
    try:
        response = client.images.generate(
            model="dall-e-3",
            prompt=f"ゲーム用の画像: {prompt}",
            size="1024x1024",
            quality="standard",
            n=1,
        )
        return response.data[0].url
    except Exception as e:
        st.error(f"画像生成でエラーが発生しました: {str(e)}")
        return None

def show_game_generator():
    """ゲーム生成タブの内容を表示する関数"""
    with st.form("game_generator_form"):
        user_prompt = st.text_area(
            "ゲームの説明や要望を入力してください",
            height=150,
            placeholder="例：シンプルな2Dブロック崩しゲーム。マウスで操作できるパドルでボールを打ち返してブロックを壊すゲーム。"
        )
        submitted = st.form_submit_button("ゲームを生成")
    
    if submitted and user_prompt:
        with st.spinner("ゲームを生成中..."):
            generated_html = generate_html_game(user_prompt)
            if generated_html:
                st.subheader("生成されたゲーム")
                st.components.v1.html(generated_html, height=600)

def show_image_generator():
    """画像生成タブの内容を表示する関数"""
    with st.form("image_generator_form"):
        image_prompt = st.text_area(
            "生成したい画像の説明を入力してください",
            height=150,
            placeholder="例：ピクセルアート風のゲームキャラクター。青い帽子をかぶった冒険者。"
        )
        submitted = st.form_submit_button("画像を生成")
    
    if submitted and image_prompt:
        with st.spinner("画像を生成中..."):
            image_url = generate_game_image(image_prompt)
            if image_url:
                st.image(image_url, caption="生成された画像", use_column_width=True)

def main():
    # ページ設定
    st.set_page_config(
        page_title="ゲームコンテンツジェネレーター",
        page_icon="🎮",
        layout="wide"
    )
    
    # タイトル
    st.title("🎮 ゲームコンテンツジェネレーター")
    
    # APIキーチェック
    if not api_key:
        st.error("""
        OpenAI APIキーが設定されていません。以下のいずれかの方法で設定してください：
        1. ローカル開発: .envファイルにOPENAI_API_KEYを設定
        2. Netlifyデプロイ: Netlify環境変数にOPENAI_API_KEYを設定
        """)
        return
    
    # タブの作成
    tab1, tab2 = st.tabs(["🎮 ゲーム生成", "🎨 画像生成"])
    
    # タブの内容
    with tab1:
        show_game_generator()
        with st.expander("💡 ゲーム生成の使い方"):
            st.markdown("""
            1. テキストエリアに作成したいゲームの説明や要望を入力します
            2. 「ゲームを生成」ボタンをクリックします
            3. 生成されたゲームが表示され、すぐにプレイできます
            
            **ヒント**: 具体的な要望を入力するとより良いゲームが生成されます。
            """)
    
    with tab2:
        show_image_generator()
        with st.expander("💡 画像生成の使い方"):
            st.markdown("""
            1. テキストエリアに生成したい画像の説明を入力します
            2. 「画像を生成」ボタンをクリックします
            3. 生成された画像が表示されます
            
            **ヒント**: 詳細な説明を入力すると、より意図に近い画像が生成されます。
            """)

if __name__ == "__main__":
    main()
