"""
Cliente de Supabase - Conexión a la base de datos
"""

import os
import sys
import logging
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
logger = logging.getLogger(__name__)

# Configuración
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    logger.error("❌ SUPABASE_URL y SUPABASE_KEY son requeridas")
    sys.exit(1)

# Cliente global
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    logger.info("✅ Cliente Supabase inicializado")
except Exception as e:
    logger.error(f"❌ Error conectando a Supabase: {e}")
    sys.exit(1)