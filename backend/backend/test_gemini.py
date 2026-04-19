# test_gemini.py
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('GEMINI_API_KEY')

if api_key:
    print(f"✅ API Key encontrada: {api_key[:10]}...{api_key[-5:]}")
else:
    print("❌ API Key NO encontrada en .env")
    exit(1)

try:
    from google import genai
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model='gemini-2.0-flash-lite',
        contents="Responde solo con la palabra: OK"
    )
    print(f"✅ Gemini responde: {response.text.strip()}")
except Exception as e:
    print(f"❌ Error: {e}")