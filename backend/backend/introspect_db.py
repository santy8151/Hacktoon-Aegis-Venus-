import os
import json
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))

try:
    res = supabase.table('vista_casos_panel').select('*').limit(1).execute()
    print("VISTA_CASOS_PANEL:")
    print(json.dumps(res.data, indent=2))
except Exception as e:
    print("Error vista_casos_panel:", e)

try:
    res = supabase.table('casos').select('*').limit(1).execute()
    print("CASOS:")
    print(json.dumps(res.data, indent=2))
except Exception as e:
    print("Error casos:", e)

try:
    res = supabase.table('pqrsds').select('*').limit(1).execute()
    print("PQRSDS:")
    print(json.dumps(res.data, indent=2))
except Exception as e:
    print("Error pqrsds:", e)
