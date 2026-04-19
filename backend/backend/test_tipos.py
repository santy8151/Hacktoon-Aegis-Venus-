# test_tipos.py
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

supabase = create_client(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_KEY')
)

# Probar consulta
try:
    result = supabase.table('tipos_solicitud').select('*').execute()
    print(f"✅ Datos: {result.data}")
except Exception as e:
    print(f"❌ Error: {e}")
    
    # Intentar con otro nombre de tabla
    try:
        result = supabase.table('tipo_solicitud').select('*').execute()
        print(f"✅ Con 'tipo_solicitud': {result.data}")
    except:
        pass