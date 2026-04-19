import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Sparkles, Copy } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SECRETARIAS, TIPOS_PQRSDS } from "@/lib/secretarias";
import { analizarPQRSDS, aiBackendInfo } from "@/lib/aiClient";

export const Route = createFileRoute("/pqrsds")({
  head: () => ({
    meta: [
      { title: "Radicar PQRSDS — Medellín" },
      { name: "description", content: "Radica tu Petición, Queja, Reclamo, Sugerencia o Denuncia ante la Alcaldía de Medellín. La IA analiza y prioriza tu caso." },
      { property: "og:title", content: "Radicar PQRSDS — Medellín" },
      { property: "og:description", content: "Formulario ciudadano con IA para clasificar y priorizar tu solicitud." },
    ],
  }),
  component: PQRSDSPage,
});

const schema = z.object({
  nombre: z.string().trim().min(2, "Nombre demasiado corto").max(120),
  documento: z.string().trim().min(5, "Documento inválido").max(30),
  tipo: z.enum(TIPOS_PQRSDS),
  secretaria: z.string().min(1, "Selecciona una secretaría o 'No sé'"),
  descripcion: z.string().trim().min(20, "Describe tu solicitud (mín 20 caracteres)").max(2000),
});

const SIN_DEFINIR = "No sé / No estoy seguro";

function generarRadicado() {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `MED-${year}-${rand}`;
}

function PQRSDSPage() {
  const ai = aiBackendInfo();
  const [form, setForm] = useState({
    nombre: "",
    documento: "",
    tipo: "Petición" as (typeof TIPOS_PQRSDS)[number],
    secretaria: "",
    descripcion: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ radicado: string; prioridad: string; categoria: string; motivo: string; fuente: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Datos inválidos");
      return;
    }
    setLoading(true);

    // 1) Análisis IA (no bloquea si falla)
    const analysis = await analizarPQRSDS(parsed.data.descripcion, parsed.data.secretaria);

    // 2) Plazo según prioridad
    const dias = analysis.prioridad === "Urgente" ? 3 : analysis.prioridad === "Alta" ? 7 : 15;
    const fecha_limite = new Date(Date.now() + dias * 24 * 60 * 60 * 1000).toISOString();

    const radicado = generarRadicado();

    const { error } = await supabase.from("pqrsds").insert({
      radicado,
      nombre: parsed.data.nombre,
      documento: parsed.data.documento,
      tipo: parsed.data.tipo,
      secretaria: parsed.data.secretaria,
      descripcion: parsed.data.descripcion,
      prioridad: analysis.prioridad,
      ai_categoria: analysis.categoria,
      ai_resumen: analysis.resumen,
      ai_sugerencia: analysis.sugerencia,
      fecha_limite,
    });
    setLoading(false);
    if (error) {
      toast.error("No se pudo radicar: " + error.message);
      return;
    }
    setSuccess({
      radicado,
      prioridad: analysis.prioridad,
      categoria: analysis.categoria,
      motivo: analysis.motivo,
      fuente: analysis.fuente,
    });
  };

  if (success) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 md:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-border bg-[var(--gradient-card)] p-8 text-center shadow-[var(--shadow-elegant)]"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-secondary-foreground animate-pulse-ring"
          >
            <CheckCircle2 className="h-10 w-10" />
          </motion.div>
          <h1 className="mt-5 font-display text-3xl font-bold">¡Radicado con éxito!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Guarda este número para consultar el estado de tu solicitud.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-5 py-3 font-mono text-xl font-bold tracking-wider text-primary">
            {success.radicado}
            <button
              onClick={() => {
                navigator.clipboard.writeText(success.radicado);
                toast.success("Radicado copiado");
              }}
              aria-label="Copiar"
              className="text-muted-foreground hover:text-primary"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-card p-4 text-left">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-secondary">
              <Sparkles className="h-3.5 w-3.5" /> Análisis de IA · {success.fuente}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-muted-foreground">Categoría</div>
                <div className="font-semibold">{success.categoria}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Prioridad</div>
                <div className={`font-semibold ${
                  success.prioridad === "Urgente" ? "text-destructive" :
                  success.prioridad === "Alta" ? "text-warning-foreground" : "text-foreground"
                }`}>{success.prioridad}</div>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground"><strong>Motivo:</strong> {success.motivo}</p>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link to="/" className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-accent">
              Volver al inicio
            </Link>
            <button
              onClick={() => { setSuccess(null); setForm({ nombre: "", documento: "", tipo: "Petición", secretaria: "", descripcion: "" }); }}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Radicar otra
            </button>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">Radicar PQRSDS</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tu solicitud será analizada por IA ({ai.mode === "ollama" ? `Ollama → ${ai.url}` : "reglas locales"}) para
          asignar prioridad y categoría automáticamente.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] md:p-8">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nombre completo">
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="input"
              placeholder="Ej: María Restrepo"
            />
          </Field>
          <Field label="Documento">
            <input
              value={form.documento}
              onChange={(e) => setForm({ ...form, documento: e.target.value })}
              className="input"
              placeholder="Cédula o NIT"
            />
          </Field>
          <Field label="Tipo de solicitud">
            <select
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value as (typeof TIPOS_PQRSDS)[number] })}
              className="input"
            >
              {TIPOS_PQRSDS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Secretaría / Dependencia">
            <select
              value={form.secretaria}
              onChange={(e) => setForm({ ...form, secretaria: e.target.value })}
              className="input"
            >
              <option value="">Selecciona…</option>
              <option value={SIN_DEFINIR}>🤔 {SIN_DEFINIR} (la IA la asignará)</option>
              <optgroup label="Secretarías">
                {SECRETARIAS.map((s) => <option key={s}>{s}</option>)}
              </optgroup>
            </select>
          </Field>
        </div>

        <Field label="Descripción">
          <textarea
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            rows={6}
            className="input resize-y"
            placeholder="Describe tu solicitud con el mayor detalle posible…"
          />
        </Field>

        <AnimatePresence>
          {form.descripcion.length >= 20 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-2 rounded-lg border border-secondary/30 bg-secondary/10 p-3 text-xs text-secondary-foreground/80"
            >
              <Sparkles className="mt-0.5 h-4 w-4 text-secondary" />
              <span>La IA analizará tu descripción al enviar y asignará prioridad. Plazo Urgente: 3 días · Alta: 7 días · Normal: 15 días.</span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--gradient-brand)] px-6 py-3.5 font-display text-base font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition hover:scale-[1.01] disabled:opacity-60"
        >
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analizando con IA…</> : "Enviar solicitud"}
        </button>
      </form>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.625rem;
          border: 1px solid var(--color-input);
          background: var(--color-background);
          padding: 0.65rem 0.85rem;
          font-size: 0.875rem;
          color: var(--color-foreground);
          outline: none;
          transition: box-shadow 0.15s, border-color 0.15s;
        }
        .input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px oklch(0.45 0.18 245 / 0.15);
        }
      `}</style>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground">{label}</span>
      {children}
    </label>
  );
}
