import streamlit as st
import os
import time
from dotenv import load_dotenv
from openai import OpenAI
from PIL import Image
import requests
from io import BytesIO

# セッションステートの初期化
if 'last_generation_time' not in st.session_state:
    st.session_state.last_generation_time = 0
if 'is_generating' not in st.session_state:
    st.session_state.is_generating = False
if 'generated_image_url' not in st.session_state:
    st.session_state.generated_image_url = None

# 環境変数の読み込み
load_dotenv()

# Recraftクライアントの設定
client = OpenAI(
    base_url='https://external.api.recraft.ai/v1',
    api_key=os.getenv('RECRAFT_API_KEY')
)

# ページ設定
st.set_page_config(page_title="Recraft Image Generator", layout="wide")
st.title("Recraft 画像生成")

# サイドバーの設定
with st.sidebar:
    st.header("生成設定")
    
    # プロンプト入力
    prompt = st.text_area("プロンプト", help="生成したい画像の説明を入力してください")
    
    # サイズ選択
    size = st.selectbox(
        "サイズ",
        [
            "1024x1024",
            "1024x1792",
            "1792x1024"
        ]
    )

# クールタイム関連の変数
COOLDOWN_SECONDS = 30

# メイン画面
# クールダウンタイマーの表示用コンテナ
timer_container = st.empty()

# 生成ボタン（生成中は無効化）
if st.button("画像を生成", disabled=st.session_state.is_generating):
    if prompt:
        try:
            st.session_state.is_generating = True
            with st.spinner("画像を生成中..."):
                # 画像生成リクエスト
                response = client.images.generate(
                    prompt=prompt,
                    style="digital_illustration",
                    size=size,
                )
                
                # 画像URLの取得と保存
                image_url = response.data[0].url
                st.session_state.generated_image_url = image_url
                st.session_state.last_generation_time = time.time()
                
        except Exception as e:
            st.error(f"エラーが発生しました: {str(e)}")
            st.session_state.is_generating = False
    else:
        st.warning("プロンプトを入力してください")

# 画像の表示
if st.session_state.generated_image_url:
    st.image(st.session_state.generated_image_url, caption="生成された画像", use_column_width=True)
    st.code(st.session_state.generated_image_url, language="text")

# クールダウンの処理
if st.session_state.is_generating:
    current_time = time.time()
    time_since_last_generation = current_time - st.session_state.last_generation_time
    cooldown_remaining = max(0, COOLDOWN_SECONDS - time_since_last_generation)
    
    if cooldown_remaining > 0:
        timer_container.warning(f"次の生成まで {int(cooldown_remaining)} 秒待ってください")
        time.sleep(0.1)  # 短い待機時間を入れてカウントダウンを更新
        st.rerun()
    else:
        st.session_state.is_generating = False
        timer_container.empty()

# 使い方の説明
with st.expander("使い方"):
    st.markdown("""
    1. サイドバーでプロンプト（画像の説明）を入力します
    2. 画像サイズを選択します
    3. 「画像を生成」ボタンをクリックします
    """)
