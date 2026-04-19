"""
Cliente de IA - Clasificación de PQRSD
Usa Groq (ultra rápido, tier gratuito generoso)
"""

import os
import sys
import json
import logging
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
logger = logging.getLogger(__name__)

GROQ_API_KEY = os.getenv('GROQ_API_KEY')

if not GROQ_API_KEY:
    logger.error("❌ GROQ_API_KEY es requerida")
    sys.exit(1)

try:
    client = Groq(api_key=GROQ_API_KEY)
    MODEL = 'llama-3.3-70b-versatile'
    logger.info(f"✅ Cliente Groq inicializado (modelo: {MODEL})")
except Exception as e:
    logger.error(f"❌ Error configurando Groq: {e}")
    sys.exit(1)


def clasificar_con_ia(descripcion: str, dependencias_str: str, prompt_template: str) -> dict:
    """Llama a Groq IA para clasificar la PQRSD"""

    prompt_completo = prompt_template.format(
        dependencias=dependencias_str,
        descripcion=descripcion
    )

    # Modelos de fallback en orden de preferencia
    modelos = [
        'llama-3.3-70b-versatile',
        'llama-3.1-8b-instant',
        'mixtral-8x7b-32768',
    ]

    ultimo_error = None
    for modelo in modelos:
        try:
            logger.info(f"🤖 Clasificando con Groq ({modelo})...")

            response = client.chat.completions.create(
                model=modelo,
                messages=[
                    {
                        "role": "system",
                        "content": "Eres un asistente especializado en clasificar PQRSD. Responde SIEMPRE con JSON válido únicamente."
                    },
                    {
                        "role": "user",
                        "content": prompt_completo
                    }
                ],
                temperature=0.1,
                max_tokens=300,
                response_format={"type": "json_object"}
            )

            texto = response.choices[0].message.content.strip()
            resultado = json.loads(texto)
            logger.info(f"✅ Clasificación exitosa con {modelo}")
            return resultado

        except json.JSONDecodeError:
            logger.error(f"❌ JSON inválido: {texto}")
            raise Exception("La IA no devolvió un JSON válido")
        except Exception as e:
            logger.warning(f"⚠️ Modelo {modelo} falló: {e}")
            ultimo_error = e
            continue

    raise Exception(f"Todos los modelos fallaron. Último error: {ultimo_error}")