# Backend

Capa de datos, servicios y lógica que NO renderiza UI.

```
backend/
├── clients/      Conexiones a base de datos
│   └── supabase.ts          → Supabase a la medida (única fuente de datos)
├── data/         Catálogos estáticos
│   ├── secretarias.ts
│   └── secretariasInfo.ts
└── services/     Lógica de negocio / IA
    └── aiClient.ts
```

Reglas:
- Nada en `backend/` debe importar componentes de React ni archivos de `frontend/`.
- Toda la app importa el cliente Supabase desde `@/backend/clients/supabase`.
  No usar `@/integrations/supabase/client` (Lovable Cloud) en código de la app.
