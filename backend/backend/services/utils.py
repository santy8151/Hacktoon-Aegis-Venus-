"""
Funciones auxiliares para el sistema PQRSD
"""

import logging
from .supabase_client import supabase

logger = logging.getLogger(__name__)


def obtener_dependencias_formateadas() -> str:
    """
    Obtiene dependencias de Supabase y las formatea para el prompt
    
    Returns:
        str: Lista formateada de dependencias
    """
    try:
        result = supabase.table('dependencias').select('id', 'nombre', 'competencias').execute()
        
        if not result.data:
            logger.warning("⚠️ No se encontraron dependencias")
            return "No hay dependencias registradas"
        
        lineas = []
        for dep in result.data:
            competencias = ', '.join(dep['competencias']) if dep['competencias'] else 'General'
            lineas.append(f"- ID {dep['id']}: {dep['nombre']} | Competencias: {competencias}")
        
        return '\n'.join(lineas)
        
    except Exception as e:
        logger.error(f"Error obteniendo dependencias: {e}")
        return "Error cargando dependencias"


def validar_campos_requeridos(data: dict, campos: list) -> tuple:
    """
    Valida que los campos requeridos estén presentes
    
    Args:
        data: Diccionario con los datos
        campos: Lista de campos requeridos
    
    Returns:
        tuple: (es_valido, mensaje_error)
    """
    for campo in campos:
        if campo not in data or not data[campo]:
            return False, f"El campo '{campo}' es requerido"
    return True, None