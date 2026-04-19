# test_groq.py
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('GROQ_API_KEY')

if api_key:
    print(f"✅ GROQ_API_KEY encontrada: {api_key[:10]}...{api_key[-4:]}")
else:
    print("❌ GROQ_API_KEY NO encontrada en .env")
    exit(1)

try:
    from groq import Groq
    client = Groq(api_key=api_key)
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": "Responde solo con la palabra: OK"}],
        max_tokens=10
    )
    print(f"✅ Groq responde: {response.choices[0].message.content.strip()}")
except Exception as e:
    print(f"❌ Error: {e}")
