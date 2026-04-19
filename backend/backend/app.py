"""
================================================================================
SISTEMA INTELIGENTE DE GESTIÓN PQRSD - ALCALDÍA DE MEDELLÍN
================================================================================
OmegaHack 2026 - Grupo NOVA - Universidad EAFIT

Descripción:
    Backend para clasificación automática de PQRSD usando IA (Gemini)
    y gestión de casos con Supabase como base de datos.

Estructura Modular:
    - services/supabase_client.py → Conexión a BD
    - services/gemini_client.py   → Clasificación con IA
    - services/utils.py           → Funciones auxiliares
    - prompts/system_prompt.py    → Prompt del sistema

Autores: [Tu Nombre] - [Nombre Compañero]
================================================================================
"""

# ============================================================================
# IMPORTACIONES
# ============================================================================

import os
import logging
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Importar módulos propios
from services.supabase_client import supabase
from services.gemini_client import clasificar_con_ia
from services.utils import obtener_dependencias_formateadas, validar_campos_requeridos
from prompts.system_prompt import SYSTEM_PROMPT

# ============================================================================
# CONFIGURACIÓN INICIAL
# ============================================================================

load_dotenv()

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Inicializar Flask
app = Flask(__name__)
CORS(app)

# ============================================================================
# ENDPOINTS API
# ============================================================================

@app.route('/', methods=['GET'])
def index():
    """Endpoint raíz - Información del servicio"""
    return jsonify({
        'servicio': 'Sistema Inteligente de Gestión PQRSD',
        'version': '2.0.0',
        'omegaHack': 2026,
        'status': 'operativo',
        'endpoints': {
            'POST /api/clasificar': 'Clasifica una PQRSD con IA',
            'POST /api/casos': 'Crea un nuevo caso',
            'GET /api/casos/panel': 'Obtiene casos para el panel',
            'PUT /api/casos/<id>/confirmar': 'Confirma clasificación',
            'PUT /api/casos/<id>/rechazar': 'Rechaza sugerencia de IA',
            'PUT /api/casos/<id>/aval': 'Registra aval jurídico',
            'GET /api/dependencias': 'Lista dependencias',
            'GET /api/tipos-solicitud': 'Lista tipos de solicitud',
            'GET /api/estadisticas': 'Estadísticas del sistema'
        }
    })


@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint para verificar que el servicio está vivo"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'supabase': 'connected'
    })


@app.route('/api/clasificar', methods=['POST'])
def clasificar():
    """
    Clasifica una PQRSD con IA (Gemini)
    
    Request Body:
        {
            "descripcion": "Texto completo de la PQRSD"
        }
    
    Response:
        {
            "dependencia_id": 1,
            "titulo": "Título generado por IA",
            "resumen": "Resumen ejecutivo"
        }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Se requiere cuerpo JSON'}), 400
        
        descripcion = data.get('descripcion', '').strip()
        
        if not descripcion:
            return jsonify({'error': 'El campo descripcion es requerido'}), 400
        
        if len(descripcion) < 10:
            return jsonify({'error': 'La descripción debe tener al menos 10 caracteres'}), 400
        
        logger.info(f"📨 Solicitud de clasificación ({len(descripcion)} caracteres)")
        
        # Obtener dependencias formateadas
        dependencias_str = obtener_dependencias_formateadas()
        
        # Clasificar con IA
        resultado = clasificar_con_ia(descripcion, dependencias_str, SYSTEM_PROMPT)
        
        return jsonify(resultado)
        
    except Exception as e:
        logger.error(f"❌ Error en /api/clasificar: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/casos', methods=['POST'])
def crear_caso():
    """
    Crea un nuevo caso de PQRSD
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Se requiere cuerpo JSON'}), 400
        
        # Validar campos requeridos
        campos_requeridos = ['tipo_solicitud', 'descripcion', 'dependencia_id']
        for campo in campos_requeridos:
            if campo not in data:
                return jsonify({'error': f'El campo {campo} es requerido'}), 400
        
        # 🔥 GENERAR RADICADO MANUALMENTE
        from datetime import datetime
        import random
        
        año = datetime.now().year
        
        # Obtener último ID para la secuencia
        result = supabase.table('casos').select('id').order('id', desc=True).limit(1).execute()
        ultimo_id = result.data[0]['id'] if result.data else 0
        secuencia = str(ultimo_id + 1).zfill(5)
        
        radicado = f"PQRSD-{año}-{secuencia}"
        
        # Calcular fecha de vencimiento
        dias_por_tipo = {
            'Petición': 15,
            'Queja': 15,
            'Reclamo': 15,
            'Sugerencia': 10,
            'Denuncia': 15,
            'Solicitud de Información': 10
        }
        dias = dias_por_tipo.get(data['tipo_solicitud'], 15)
        from datetime import timedelta
        fecha_vencimiento = datetime.now() + timedelta(days=dias)
        
        # Construir objeto para insertar
        nuevo_caso = {
            'radicado': radicado,  # 🔥 AHORA SÍ SE ENVÍA
            'fecha_creacion': datetime.now().isoformat(),
            'tipo_documento': data.get('tipo_documento', 'CC'),
            'numero_documento': data.get('numero_documento', ''),
            'nombre_solicitante': data.get('nombre_solicitante', 'Anónimo'),
            'apellidos_solicitante': data.get('apellidos_solicitante', ''),
            'tipo_persona': data.get('tipo_persona', 'Natural'),
            'correo_electronico': data.get('correo_electronico', ''),
            'lugar_solicitud': data.get('lugar_solicitud', ''),
            'genero': data.get('genero', 'No especificado'),
            'telefono': data.get('telefono', ''),
            'tipo_solicitud': data['tipo_solicitud'],
            'descripcion': data['descripcion'],
            'dependencia_sugerida_ia': data['dependencia_id'],
            'titulo_ia': data.get('titulo', 'Sin título'),
            'resumen_ia': data.get('resumen', 'Sin resumen'),
            'fecha_vencimiento': fecha_vencimiento.isoformat(),
            'estado': 'pendiente_clasificar',
            'aval_juridico': False,
            'es_multidependencia': False
        }
        
        logger.info(f"💾 Creando caso con radicado: {radicado}")
        
        # Insertar en Supabase
        result = supabase.table('casos').insert(nuevo_caso).execute()
        
        if result.data:
            caso_creado = result.data[0]
            logger.info(f"✅ Caso creado: {radicado}")
            
            return jsonify({
                'success': True,
                'mensaje': 'Caso creado exitosamente',
                'radicado': radicado,
                'caso': caso_creado
            }), 201
        else:
            raise Exception("No se recibió confirmación de inserción")
            
    except Exception as e:
        logger.error(f"❌ Error creando caso: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/casos/panel', methods=['GET'])
def panel_casos():
    """
    Obtiene todos los casos activos para el panel del secretario
    Usa la vista vista_casos_panel que calcula días restantes y prioridad
    """
    try:
        logger.info("📊 Consultando panel de casos...")
        
        # Usar la vista que ya creamos en Supabase
        result = supabase.table('vista_casos_panel').select('*').execute()
        
        casos = result.data if result.data else []
        logger.info(f"✅ {len(casos)} casos encontrados")
        
        return jsonify({
            'total': len(casos),
            'casos': casos
        })
        
    except Exception as e:
        logger.error(f"❌ Error consultando panel: {e}")
        
        # Fallback: consulta directa
        try:
            result = supabase.table('casos')\
                .select('*')\
                .neq('estado', 'respondido')\
                .order('id', desc=True)\
                .execute()
            
            return jsonify({
                'total': len(result.data) if result.data else 0,
                'casos': result.data if result.data else []
            })
        except Exception as fallback_error:
            return jsonify({'error': str(fallback_error)}), 500


@app.route('/api/casos/<int:caso_id>', methods=['GET'])
def obtener_caso(caso_id):
    """Obtiene un caso específico por ID"""
    try:
        result = supabase.table('casos').select('*').eq('id', caso_id).execute()
        
        if result.data:
            return jsonify(result.data[0])
        else:
            return jsonify({'error': 'Caso no encontrado'}), 404
            
    except Exception as e:
        logger.error(f"❌ Error obteniendo caso {caso_id}: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/casos/radicado/<string:radicado>', methods=['GET'])
def obtener_caso_por_radicado(radicado):
    """Obtiene un caso específico por radicado usando la vista que incluye nombres de dependencias"""
    try:
        result = supabase.table('vista_casos_panel').select('*').eq('radicado', radicado).execute()
        
        if result.data:
            return jsonify(result.data[0])
        else:
            return jsonify({'error': 'Caso no encontrado'}), 404
            
    except Exception as e:
        logger.error(f"❌ Error obteniendo caso {radicado}: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/casos/<int:caso_id>/confirmar', methods=['PUT'])
def confirmar_clasificacion(caso_id):
    """
    Secretario confirma que la clasificación de IA es correcta
    
    Request Body:
        {
            "dependencia_id": 1,
            "responsable": "nombre@medellin.gov.co"
        }
    """
    try:
        data = request.get_json()
        
        if not data or 'dependencia_id' not in data:
            return jsonify({'error': 'Se requiere dependencia_id'}), 400
        
        update_data = {
            'dependencia_seleccionada_manual': data['dependencia_id'],
            'estado': 'clasificado',
            'responsable_gestion': data.get('responsable', 'Sistema')
        }
        
        logger.info(f"✅ Confirmando clasificación caso {caso_id}")
        
        result = supabase.table('casos').update(update_data).eq('id', caso_id).execute()
        
        if result.data:
            return jsonify({
                'success': True,
                'mensaje': 'Clasificación confirmada',
                'caso': result.data[0]
            })
        else:
            return jsonify({'error': 'Caso no encontrado'}), 404
            
    except Exception as e:
        logger.error(f"❌ Error confirmando: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/casos/<int:caso_id>/rechazar', methods=['PUT'])
def rechazar_clasificacion(caso_id):
    """
    Secretario rechaza la sugerencia de IA
    
    Request Body (opcional):
        {
            "motivo": "Razón del rechazo"
        }
    """
    try:
        data = request.get_json() or {}
        
        update_data = {
            'dependencia_sugerida_ia': None,
            'estado': 'pendiente_clasificar'
        }
        
        logger.info(f"🔄 Rechazando clasificación caso {caso_id}")
        
        result = supabase.table('casos').update(update_data).eq('id', caso_id).execute()
        
        if result.data:
            return jsonify({
                'success': True,
                'mensaje': 'Clasificación rechazada. Pendiente reclasificación manual.',
                'motivo': data.get('motivo', 'No especificado')
            })
        else:
            return jsonify({'error': 'Caso no encontrado'}), 404
            
    except Exception as e:
        logger.error(f"❌ Error rechazando: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/casos/<int:caso_id>/aval', methods=['PUT'])
def aval_juridico(caso_id):
    """
    Asesor Jurídico aprueba la respuesta final
    
    Request Body:
        {
            "firmado_por": "Dr. Carlos Méndez - Asesor Jurídico"
        }
    """
    try:
        data = request.get_json()
        
        update_data = {
            'aval_juridico': True,
            'firmado_por': data.get('firmado_por', 'Asesor Jurídico'),
            'estado': 'respondido',
            'fecha_respuesta': datetime.now().isoformat()
        }
        
        logger.info(f"⚖️ Registrando aval jurídico caso {caso_id}")
        
        result = supabase.table('casos').update(update_data).eq('id', caso_id).execute()
        
        if result.data:
            return jsonify({
                'success': True,
                'mensaje': 'Aval jurídico registrado. Caso cerrado.'
            })
        else:
            return jsonify({'error': 'Caso no encontrado'}), 404
            
    except Exception as e:
        logger.error(f"❌ Error en aval: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/dependencias', methods=['GET'])
def listar_dependencias():
    """Lista todas las dependencias registradas"""
    try:
        result = supabase.table('dependencias').select('id', 'nombre', 'competencias').execute()
        return jsonify(result.data if result.data else [])
    except Exception as e:
        logger.error(f"❌ Error listando dependencias: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/tipos-solicitud', methods=['GET'])
def listar_tipos_solicitud():
    """Lista tipos de solicitud con sus días de respuesta"""
    try:
        result = supabase.table('tipos_solicitud').select('*').execute()
        return jsonify(result.data if result.data else [])
    except Exception as e:
        logger.error(f"❌ Error listando tipos: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/estadisticas', methods=['GET'])
def estadisticas():
    """Estadísticas para el dashboard"""
    try:
        # Casos por estado
        estados_result = supabase.table('casos').select('estado').execute()
        
        estados = {}
        if estados_result.data:
            for caso in estados_result.data:
                estado = caso['estado']
                estados[estado] = estados.get(estado, 0) + 1
        
        # Casos urgentes/vencidos desde la vista
        try:
            panel = supabase.table('vista_casos_panel').select('prioridad').execute()
            urgentes = sum(1 for c in panel.data if c['prioridad'] in ['urgente', 'vencido']) if panel.data else 0
        except:
            urgentes = 0
        
        return jsonify({
            'total_casos': sum(estados.values()),
            'casos_urgentes': urgentes,
            'casos_por_estado': estados,
            'tasa_acierto_ia': 85  # Placeholder - se puede calcular después
        })
        
    except Exception as e:
        logger.error(f"❌ Error en estadísticas: {e}")
        return jsonify({'error': str(e)}), 500


# ============================================================================
# MANEJO DE ERRORES
# ============================================================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint no encontrado'}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Error interno del servidor'}), 500


# ============================================================================
# INICIAR SERVIDOR
# ============================================================================

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV', 'development') == 'development'
    
    print(f"""
    ╔══════════════════════════════════════════════════════════╗
    ║     SISTEMA PQRSD INTELIGENTE - ALCALDÍA DE MEDELLÍN     ║
    ╠══════════════════════════════════════════════════════════╣
    ║  🚀 Servidor: http://localhost:{port}                      ║
    ║  📡 Supabase: Conectado                                  ║
    ║  🤖 Gemini IA: Configurado                               ║
    ╠══════════════════════════════════════════════════════════╣
    ║  Endpoints disponibles:                                  ║
    ║  POST /api/clasificar      - Clasificar con IA           ║
    ║  POST /api/casos           - Crear nuevo caso            ║
    ║  GET  /api/casos/panel     - Panel del secretario        ║
    ║  PUT  /api/casos/<id>/aval - Aval jurídico               ║
    ╚══════════════════════════════════════════════════════════╝
    """)
    
    app.run(host='0.0.0.0', port=port, debug=debug)