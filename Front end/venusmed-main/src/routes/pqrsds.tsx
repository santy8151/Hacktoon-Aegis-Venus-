import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Sparkles, Copy } from "lucide-react";
import { toast } from "sonner";
import { SECRETARIAS } from "@/backend/data/secretarias";

export const Route = createFileRoute("/pqrsds")({
  head: () => ({
    meta: [
      { title: "Radicar PQRSDS — Medellín" },
      { name: "description", content: "Radica tu Petición, Queja, Reclamo, Sugerencia o Denuncia ante la Alcaldía de Medellín." },
      { property: "og:title", content: "Radicar PQRSDS — Medellín" },
      { property: "og:description", content: "Formulario ciudadano con IA para clasificar y priorizar tu solicitud." },
    ],
  }),
  component: PQRSDSPage,
});

const TIPOS_DOCUMENTO = ["Cédula de ciudadanía", "Tarjeta de identidad", "Cédula de extranjería", "Pasaporte", "NIT"] as const;
const TIPOS_PERSONA = ["Natural", "Jurídica", "Servidor público", "Anónimo"] as const;
const GENEROS = ["Femenino", "Masculino", "No binario", "Prefiero no decirlo"] as const;
const LUGARES = [
  "Comuna 1 - Popular", "Comuna 2 - Santa Cruz", "Comuna 3 - Manrique", "Comuna 4 - Aranjuez",
  "Comuna 5 - Castilla", "Comuna 6 - Doce de Octubre", "Comuna 7 - Robledo", "Comuna 8 - Villa Hermosa",
  "Comuna 9 - Buenos Aires", "Comuna 10 - La Candelaria", "Comuna 11 - Laureles-Estadio",
  "Comuna 12 - La América", "Comuna 13 - San Javier", "Comuna 14 - El Poblado", "Comuna 15 - Guayabal",
  "Comuna 16 - Belén", "Corregimiento San Sebastián de Palmitas", "Corregimiento San Cristóbal",
  "Corregimiento Altavista", "Corregimiento San Antonio de Prado", "Corregimiento Santa Elena",
] as const;

const schema = z.object({
  nombre: z.string().trim().min(2, "Nombre demasiado corto").max(80),
  apellidos: z.string().trim().min(2, "Apellidos demasiado cortos").max(80),
  tipo_documento: z.enum(TIPOS_DOCUMENTO),
  documento: z.string().trim().min(5, "Documento inválido").max(30),
  fecha: z.string().min(1, "Selecciona la fecha"),
  tipo_persona: z.enum(TIPOS_PERSONA),
  correo: z.string().trim().email("Correo inválido").max(160),
  correo_confirm: z.string().trim().email("Correo inválido").max(160),
  secretaria: z.string().min(1, "Selecciona una secretaría"),
  lugar: z.string().min(1, "Selecciona un lugar"),
  genero: z.enum(GENEROS),
  telefono: z.string().trim().min(7, "Teléfono inválido").max(20),
  descripcion: z.string().trim().min(20, "Describe tu solicitud (mín 20 caracteres)").max(2000),
  acepta: z.boolean().refine((v) => v, { message: "Debes aceptar términos y condiciones" }),
}).refine((d) => d.correo === d.correo_confirm, {
  message: "Los correos no coinciden",
  path: ["correo_confirm"],
});


function PQRSDSPage() {
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    tipo_documento: "" as (typeof TIPOS_DOCUMENTO)[number] | "",
    documento: "",
    fecha: new Date().toISOString().slice(0, 10),
    tipo_persona: "" as (typeof TIPOS_PERSONA)[number] | "",
    correo: "",
    correo_confirm: "",
    secretaria: "",
    lugar: "",
    genero: "" as (typeof GENEROS)[number] | "",
    telefono: "",
    descripcion: "",
    acepta: false,
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

    try {
      // 1. Clasificar el caso usando la IA del backend
      const fullDescripcion = `[${parsed.data.lugar}] [${parsed.data.fecha}] [${parsed.data.correo}] [Tel: ${parsed.data.telefono}] [Género: ${parsed.data.genero}] ${parsed.data.descripcion}`;
      const resClasificar = await fetch("http://localhost:5001/api/clasificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descripcion: fullDescripcion }),
      });
      
      if (!resClasificar.ok) throw new Error("Error conectando con la inteligencia artificial.");
      const clasificacion = await resClasificar.json();

      // 2. Crear el radicado oficial
      const resCasos = await fetch("http://localhost:5001/api/casos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo_documento: parsed.data.tipo_documento,
          numero_documento: parsed.data.documento,
          nombre_solicitante: `${parsed.data.nombre} ${parsed.data.apellidos}`,
          tipo_solicitud: "Petición",
          descripcion: fullDescripcion,
          dependencia_id: clasificacion.dependencia_id,
          titulo: clasificacion.titulo,
          resumen: clasificacion.resumen
        }),
      });

      if (!resCasos.ok) throw new Error("Error radicando la PQRSDS en el servidor.");
      const casoGenerado = await resCasos.json();

      setSuccess({
        radicado: casoGenerado.radicado || "MED-NUEVO",
        prioridad: casoGenerado.prioridad || "Media",
        categoria: clasificacion.titulo,
        motivo: clasificacion.justificacion,
        fuente: "Groq (Aegis-Venus)",
      });
    } catch (err: any) {
      toast.error(err.message || "Error procesando el radicado.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 md:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-border bg-[color:var(--brand-cream)] p-8 text-center shadow-[var(--shadow-elegant)]"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[color:var(--brand-green-deep)] text-white"
          >
            <CheckCircle2 className="h-10 w-10" />
          </motion.div>
          <h1 className="mt-5 font-display text-3xl font-bold text-[color:var(--brand-green-deep)]">¡Radicado con éxito!</h1>
          <p className="mt-2 text-sm text-muted-foreground">Guarda este número para consultar el estado de tu solicitud.</p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[color:var(--brand-coral)]/40 bg-[color:var(--brand-coral)]/10 px-5 py-3 font-mono text-xl font-bold tracking-wider text-[color:var(--brand-coral)]">
            {success.radicado}
            <button
              onClick={() => { navigator.clipboard.writeText(success.radicado); toast.success("Radicado copiado"); }}
              aria-label="Copiar"
              className="text-muted-foreground hover:text-[color:var(--brand-coral)]"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-card p-4 text-left">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--brand-green-deep)]">
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
                  success.prioridad === "Alta" ? "text-[color:var(--brand-coral)]" : "text-foreground"
                }`}>{success.prioridad}</div>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground"><strong>Motivo:</strong> {success.motivo}</p>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link to="/" className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-accent">
              Volver al inicio
            </Link>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <div className="mb-6 text-center">
        <h1 className="font-display text-3xl font-extrabold text-[color:var(--brand-green-deep)] md:text-4xl">
          Solicitud de petición <span className="text-[color:var(--brand-coral)]">✻</span>
        </h1>
      </div>

      <form
        onSubmit={submit}
        className="space-y-5 rounded-2xl bg-[color:var(--brand-sky)]/85 p-6 shadow-[var(--shadow-elegant)] md:p-8"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nombre">
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              maxLength={80}
              className="input"
              placeholder="Nombre"
            />
          </Field>
          <Field label="Apellidos">
            <input
              value={form.apellidos}
              onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
              maxLength={80}
              className="input"
              placeholder="Apellidos"
            />
          </Field>

          <Field label="Tipo de documento">
            <select
              value={form.tipo_documento}
              onChange={(e) => setForm({ ...form, tipo_documento: e.target.value as (typeof TIPOS_DOCUMENTO)[number] })}
              className="input"
            >
              <option value="">No seleccionado</option>
              {TIPOS_DOCUMENTO.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Numero de documento">
            <input
              value={form.documento}
              onChange={(e) => setForm({ ...form, documento: e.target.value.replace(/[^0-9A-Za-z-]/g, "") })}
              maxLength={30}
              className="input"
              placeholder="Número de documento"
            />
          </Field>

          <Field label="Fecha">
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              className="input"
              placeholder="DD/MM/AAAA"
            />
          </Field>
          <Field label="tipo de persona">
            <select
              value={form.tipo_persona}
              onChange={(e) => setForm({ ...form, tipo_persona: e.target.value as (typeof TIPOS_PERSONA)[number] })}
              className="input"
            >
              <option value="">No seleccionado</option>
              {TIPOS_PERSONA.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>

          <Field label="Correo electrónico">
            <input
              type="email"
              value={form.correo}
              onChange={(e) => setForm({ ...form, correo: e.target.value })}
              maxLength={160}
              className="input"
              placeholder="Ejemplo@gmail.com"
            />
          </Field>
          <Field label="Confirmar correo electrónico">
            <input
              type="email"
              value={form.correo_confirm}
              onChange={(e) => setForm({ ...form, correo_confirm: e.target.value })}
              maxLength={160}
              className="input"
              placeholder="Ejemplo@gmail.com"
            />
          </Field>

          <Field label="Secretaría">
            <select
              value={form.secretaria}
              onChange={(e) => setForm({ ...form, secretaria: e.target.value })}
              className="input"
            >
              <option value="">No seleccionado</option>
              {SECRETARIAS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Lugar de la solicitud">
            <select
              value={form.lugar}
              onChange={(e) => setForm({ ...form, lugar: e.target.value })}
              className="input"
            >
              <option value="">No seleccionado</option>
              {LUGARES.map((l) => <option key={l}>{l}</option>)}
            </select>
          </Field>

          <Field label="Genero">
            <select
              value={form.genero}
              onChange={(e) => setForm({ ...form, genero: e.target.value as (typeof GENEROS)[number] })}
              className="input"
            >
              <option value="">No seleccionado</option>
              {GENEROS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="Telefono">
            <input
              type="tel"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value.replace(/[^0-9+\s-]/g, "") })}
              maxLength={20}
              className="input"
              placeholder="(Ex. 3001234567)"
            />
          </Field>
        </div>

        <Field label="Descripción">
          <textarea
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            rows={7}
            maxLength={2000}
            className="input resize-y"
            placeholder="Descripción del hecho"
          />
        </Field>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setForm({ ...form, acepta: !form.acepta })}
            role="switch"
            aria-checked={form.acepta}
            className={`relative h-6 w-11 rounded-full transition ${form.acepta ? "bg-[color:var(--brand-green-deep)]" : "bg-white/70"}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all ${form.acepta ? "left-[22px]" : "left-0.5"}`}
            />
          </button>
          <span className="text-sm text-[color:var(--brand-green-deep)]">
            Acepta{" "}
            <a href="#" className="font-semibold text-[color:var(--brand-coral)] underline">
              términos, condiciones y política
            </a>
          </span>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-md bg-[color:var(--brand-green-deep)] px-10 py-3 font-display text-base font-semibold text-white shadow-[var(--shadow-soft)] transition hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Enviando…</> : "Enviar"}
          </button>
        </div>
      </form>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid color-mix(in oklab, var(--brand-green-deep) 25%, transparent);
          background: color-mix(in oklab, var(--brand-cream) 75%, white);
          padding: 0.55rem 0.75rem;
          font-size: 0.875rem;
          color: var(--brand-green-deep);
          outline: none;
          transition: box-shadow 0.15s, border-color 0.15s;
        }
        .input:focus {
          border-color: var(--brand-green-deep);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--brand-green-deep) 20%, transparent);
        }
      `}</style>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-[color:var(--brand-green-deep)]">{label}</span>
      {children}
    </label>
  );
}
