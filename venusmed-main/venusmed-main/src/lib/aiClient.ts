/**
 * Cliente de IA abstraído para PQRSDS.
 *
 * Por defecto usa reglas locales (rápido, sin red). Si configuras
 * VITE_OLLAMA_URL (ej. https://abc123.ngrok-free.app) y VITE_OLLAMA_MODEL
 * (ej. llama3.1), el cliente intentará llamar a tu Ollama local.
 *
 * Diseño pensado para hackathon: el demo NUNCA falla, y al activar Ollama
 * la IA real toma decisiones más finas.
 */

export type AIAnalysis = {
  categoria: string;          // Ej: "Salud", "Movilidad", "Seguridad"
  prioridad: "Baja" | "Media" | "Alta" | "Urgente";
  resumen: string;            // 1-2 frases
  sugerencia: string;         // Respuesta sugerida al empleado
  motivo: string;             // Por qué la IA decidió esa prioridad
  fuente: "ollama" | "reglas";
};

const URGENCIA_KEYWORDS = [
  "riesgo", "peligro", "salud", "vida", "muerte", "menor", "niño", "niña",
  "violencia", "amenaza", "urgente", "emergencia", "accidente", "agresión",
  "abuso", "robo", "incendio", "inundación", "derrumbe", "discapacidad",
];

const ALTA_KEYWORDS = [
  "demora", "vencido", "incumplimiento", "corrupción", "sin agua",
  "sin luz", "sin servicio", "tiempo", "respuesta", "acoso",
];

function clasificarPorReglas(descripcion: string, secretaria: string): AIAnalysis {
  const lower = descripcion.toLowerCase();
  const matchedUrg = URGENCIA_KEYWORDS.filter((k) => lower.includes(k));
  const matchedAlta = ALTA_KEYWORDS.filter((k) => lower.includes(k));

  let prioridad: AIAnalysis["prioridad"] = "Media";
  let motivo = "Sin palabras clave de urgencia detectadas.";

  if (matchedUrg.length > 0) {
    prioridad = "Urgente";
    motivo = `Detectadas palabras críticas: ${matchedUrg.slice(0, 3).join(", ")}.`;
  } else if (matchedAlta.length > 0) {
    prioridad = "Alta";
    motivo = `Detectadas palabras de impacto: ${matchedAlta.slice(0, 3).join(", ")}.`;
  } else if (descripcion.length < 60) {
    prioridad = "Baja";
    motivo = "Solicitud breve sin indicadores de urgencia.";
  }

  const categoria = secretaria.replace(/^Secretaría de\s+/i, "").trim() || "General";
  const resumen =
    descripcion.length > 140 ? descripcion.slice(0, 137).trim() + "…" : descripcion;

  const sugerencia =
    prioridad === "Urgente"
      ? `Escalar inmediatamente al equipo de ${categoria}. Contactar al ciudadano en menos de 24h y abrir caso prioritario.`
      : prioridad === "Alta"
      ? `Asignar a un gestor de ${categoria} dentro de 48h. Confirmar recepción al ciudadano y ofrecer plazo de respuesta.`
      : `Procesar dentro del flujo estándar (${categoria}). Enviar acuse de recibo automático y plazo de 15 días hábiles.`;

  return { categoria, prioridad, resumen, sugerencia, motivo, fuente: "reglas" };
}

async function analizarConOllama(
  descripcion: string,
  secretaria: string,
  url: string,
  model: string,
): Promise<AIAnalysis | null> {
  try {
    const prompt = `Eres un clasificador de PQRSDS de la Alcaldía de Medellín. Analiza la siguiente solicitud y responde SOLO en JSON válido con esta forma exacta:
{"categoria":"...","prioridad":"Baja|Media|Alta|Urgente","resumen":"...","sugerencia":"...","motivo":"..."}

Secretaría destinataria: ${secretaria}
Descripción del ciudadano: """${descripcion}"""

Marca como Urgente si hay riesgo a la vida, salud, menores o seguridad.`;

    const res = await fetch(`${url.replace(/\/$/, "")}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt, stream: false, format: "json" }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const parsed = JSON.parse(json.response);
    return {
      categoria: String(parsed.categoria ?? "General"),
      prioridad: ["Baja", "Media", "Alta", "Urgente"].includes(parsed.prioridad)
        ? parsed.prioridad
        : "Media",
      resumen: String(parsed.resumen ?? "").slice(0, 240),
      sugerencia: String(parsed.sugerencia ?? ""),
      motivo: String(parsed.motivo ?? ""),
      fuente: "ollama",
    };
  } catch (e) {
    console.warn("[aiClient] Ollama falló, usando reglas:", e);
    return null;
  }
}

export async function analizarPQRSDS(
  descripcion: string,
  secretaria: string,
): Promise<AIAnalysis> {
  const ollamaUrl = import.meta.env.VITE_OLLAMA_URL as string | undefined;
  const ollamaModel = (import.meta.env.VITE_OLLAMA_MODEL as string | undefined) ?? "llama3.1";

  if (ollamaUrl) {
    const result = await analizarConOllama(descripcion, secretaria, ollamaUrl, ollamaModel);
    if (result) return result;
  }
  return clasificarPorReglas(descripcion, secretaria);
}

export function aiBackendInfo() {
  const url = import.meta.env.VITE_OLLAMA_URL as string | undefined;
  return url
    ? { mode: "ollama" as const, url }
    : { mode: "reglas" as const, url: null };
}
