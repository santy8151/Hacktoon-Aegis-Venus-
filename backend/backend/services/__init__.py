"""
Módulo de servicios para el sistema PQRSD

Este paquete contiene los servicios de conexión a Supabase,
clasificación con IA y utilidades auxiliares.
"""

# Importar funciones principales para facilitar su uso
from .supabase_client import supabase
from .gemini_client import clasificar_con_ia
from .utils import obtener_dependencias_formateadas

__all__ = [
    'supabase',
    'clasificar_con_ia',
    'obtener_dependencias_formateadas'
]