import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Flower2, ArrowRight, ArrowDown, Clock, KeyRound, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { SECRETARIAS_INFO } from "@/lib/secretariasInfo";
import { WorkflowAnimation } from "@/components/WorkflowAnimation";
import heroImg from "@/assets/medellin-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Medellín PQRSDS — Flor al alcance de todos" },
      { name: "description", content: "Flor al alcance de todos. Consulta en tiempo real el estado de tu PQRSDS en Medellín." },
      { property: "og:title", content: "Medellín PQRSDS — Flor al alcance de todos" },
      { property: "og:description", content: "Plataforma ciudadana para la gestión de PQRSDS de Medellín." },
    ],
  }),
  component: HomePage,
});

type ConsultaResult = {
  radicado: string;
  estado: string;
  prioridad: string;
  tipo: string;
  secretaria: string;
  fecha_limite: string;
  ai_categoria: string | null;
} | null;

const ESTADOS = ["Pendiente", "En proceso", "Resuelto"] as const;

function diasRestantes(fechaIso: string) {
  const ms = new Date(fechaIso).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function HomePage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [radicado, setRadicado] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConsultaResult>(null);
  const [error, setError] = useState<string | null>(null);

  const consultar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!radicado.trim()) return;
    setLoading(true);
    const { data, error: dbError } = await supabase
      .from("pqrsds")
      .select("radicado,estado,prioridad,tipo,secretaria,fecha_limite,ai_categoria")
      .eq("radicado", radicado.trim().toUpperCase())
      .maybeSingle();
    setLoading(false);
    if (dbError) {
      setError("Error consultando. Intenta de nuevo.");
      return;
    }
    if (!data) {
      setError(`No encontramos el radicado "${radicado.trim().toUpperCase()}".`);
      return;
    }
    setResult(data as ConsultaResult);
  };

  const featured = SECRETARIAS_INFO.slice(0, 8);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Medellín, ciudad de la eterna primavera"
            className="h-full w-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24 lg:py-28">
          <div className="text-primary-foreground">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm"
            >
              <Flower2 className="h-3.5 w-3.5 text-[var(--brand-coral)]" /> {t("home.badge")}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl"
            >
              {t("home.title1")}<br />
              <span className="text-[color:var(--brand-coral)]">{t("home.title2")}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-4 max-w-md text-base text-white/90 md:text-lg"
            >
              {t("home.subtitle")}
            </motion.p>

          </div>

          {/* Consulta de radicado */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="rounded-2xl border border-white/20 bg-card/95 p-6 shadow-[var(--shadow-elegant)] backdrop-blur-md md:p-8"
          >
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">{t("home.consult.title")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("home.consult.desc")}</p>
            </div>
            <form onSubmit={consultar} className="mt-4 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={radicado}
                  onChange={(e) => setRadicado(e.target.value)}
                  placeholder="Ej: MED-2025-A1B2C3"
                  className="w-full rounded-lg border border-input bg-background px-9 py-3 text-sm uppercase outline-none ring-primary transition focus:ring-2"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:bg-primary/90 disabled:opacity-60"
              >
                {loading ? t("home.consult.loading") : t("home.consult.btn")}
              </button>
            </form>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="err"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                >
                  {error}
                </motion.div>
              )}
              {result && (
                <motion.div
                  key="ok"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-5 rounded-xl border border-border bg-[var(--gradient-card)] p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-sm font-bold text-primary">{result.radicado}</div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      result.prioridad === "Urgente" ? "bg-destructive/15 text-destructive" :
                      result.prioridad === "Alta" ? "bg-warning/20 text-warning-foreground" :
                      "bg-info/15 text-info"
                    }`}>{result.prioridad}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {result.tipo} · {result.secretaria}
                  </div>

                  <ProgressTracker estado={result.estado} />

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Plazo restante</span>
                    <span className={`font-semibold ${diasRestantes(result.fecha_limite) <= 3 ? "text-destructive" : "text-foreground"}`}>
                      {diasRestantes(result.fecha_limite)} días
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => navigate({ to: "/pqrsds" })}
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              {t("home.consult.create")} <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>

        {/* Animación scroll-down debajo del consultar radicado */}
        <motion.div
          aria-hidden
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 mx-auto -mt-2 mb-6 hidden w-fit flex-col items-center text-white/85 md:flex"
        >
          <span className="text-[11px] uppercase tracking-[0.3em]">Desliza</span>
          <ArrowDown className="mt-1 h-5 w-5" />
        </motion.div>
      </section>

      {/* FLUJO DE TRABAJO */}
      <WorkflowAnimation />

      {/* INFORMACIÓN IMPORTANTE */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-8 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
            Información importante
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
            {t("home.info.title")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("home.info.desc")}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { Icon: Clock, t: t("home.info.1.t"), d: t("home.info.1.d") },
            { Icon: KeyRound, t: t("home.info.2.t"), d: t("home.info.2.d") },
            { Icon: ShieldAlert, t: t("home.info.3.t"), d: t("home.info.3.d") },
          ].map(({ Icon, t: title, d }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-border bg-[var(--gradient-card)] p-6 shadow-[var(--shadow-soft)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/15 text-secondary ring-1 ring-secondary/30">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-3 font-display text-lg font-bold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECRETARÍAS DESTACADAS */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              {t("home.secretarias")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("home.secretarias.desc")}</p>
          </div>
          <Link to="/secretarias" className="hidden text-sm font-semibold text-primary hover:underline md:inline-flex">
            Ver todas →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.slug}
                to="/secretarias/$slug"
                params={{ slug: s.slug }}
                className="group rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="mt-3 font-display text-base font-bold leading-tight line-clamp-2">{s.nombre}</div>
                <div className="mt-3 inline-flex items-center text-xs font-semibold text-primary opacity-0 transition group-hover:opacity-100">
                  {t("home.secretarias.cta")} <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}

function ProgressTracker({ estado }: { estado: string }) {
  const idx = ESTADOS.indexOf(estado as (typeof ESTADOS)[number]);
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2">
        {ESTADOS.map((e, i) => (
          <div key={e} className="flex flex-1 items-center gap-2">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.15 }}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${
                i <= idx ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </motion.div>
            {i < ESTADOS.length - 1 && (
              <div className={`h-1 flex-1 rounded ${i < idx ? "bg-secondary" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wide text-muted-foreground">
        {ESTADOS.map((e) => <span key={e}>{e}</span>)}
      </div>
    </div>
  );
}
