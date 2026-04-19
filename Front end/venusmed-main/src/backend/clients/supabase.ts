// Cliente de base de datos ÚNICO de la aplicación.
// Toda la app importa desde aquí:
//   import { db } from "@/backend/clients/supabase";
// (alias "supabase" mantenido por compatibilidad con código existente)

import { createClient } from "@supabase/supabase-js";

const DB_URL = "https://urjvchjvvznvnvxlbsuy.supabase.co";
const DB_PUBLISHABLE_KEY = "sb_publishable_MXLrr5ti912RwwoJvEKU1Q_hzwU_Zvt";

export const db = createClient(DB_URL, DB_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== "undefined" ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    storageKey: "sb-app-auth",
  },
});

// Alias para no romper imports existentes
export const supabase = db;

export const DB_INFO = {
  url: DB_URL,
  scope: "app" as const,
};
