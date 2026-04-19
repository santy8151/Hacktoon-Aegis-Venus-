import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, FileText, Scale, Eye, Users, BarChart3, Download, ExternalLink, CheckCircle2, Clock } from "lucide-react";
import { supabase } from "@/backend/clients/supabase";
import heroImg from "@/assets/medellin-hero.jpg";

export const Route = createFileRoute("/transparencia")({
  head: () => ({
    meta: [
      { title: "Transparencia — Alcaldía de Medellín PQRSDS" },
      { name: "description", content: "Datos abiertos, indicadores de gestión, marco legal y acceso a información pública de PQRSDS de la Alcaldía de Medellín." },
      { property: "og:title", content: "Transparencia — Alcaldía de Medellín" },
      { property: "og:description", content: "Conoce nuestros indicadores, datos abiertos y el marco legal que rige la atención de PQRSDS." },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: TransparenciaPage,
});

function TransparenciaPage() {
  const [stats, setStats] = useState({ total: 0, resueltas: 0, enProceso: 0, pendientes: 0 });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("pqrsds").select("estado").limit(1000);
      if (!data) return;
      const total = data.length;
      const resueltas = data.filter((r) => r.estado === "Resuelto").length;
      const enProceso = data.filter((r) => r.estado === "En proceso").length;
      const pendientes = data.filter((r) => r.estado === "Pendiente").length;
      setStats({ total, resueltas, enProceso, pendientes });
    })();
  }, []);

  const cumplimiento = stats.total > 0 ? Math.round((stats.resueltas / stats.total) * 100) : 0;

  return (
    <div className="bg-[color:var(--brand-cream)]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[color:var(--brand-green-deep)] text-white">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `url(${heroImg})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--brand-green-deep)] via-[color:var(--brand-green-deep)]/85 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-yellow)]">
              <ShieldCheck className="h-3.5 w-3.5" /> Espacio de Transparencia
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-6xl">
              Información pública,<br />
              <span className="text-[color:var(--brand-yellow)]">cuentas claras.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base text-white/85 md:text-lg">
              Datos abiertos, indicadores en tiempo real y marco legal que rige la atención
              de Peticiones, Quejas, Reclamos, Sugerencias y Denuncias en la Alcaldía de Medellín.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#indicadores" className="rounded-lg bg-[color:var(--brand-yellow)] px-5 py-3 text-sm font-bold text-[color:var(--brand-green-deep)] shadow-[var(--shadow-soft)] hover:opacity-90">
                Ver indicadores
              </a>
              <a href="#marco-legal" className="rounded-lg border border-white/30 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15">
                Marco legal
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* INDICADORES en vivo */}
      <section id="indicadores" className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="mb-8 flex items-end justify-between gap-4 border-b-2 border-dashed border-[color:var(--brand-green-deep)]/20 pb-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-coral)]">En vivo</div>
            <h2 className="mt-1 font-display text-3xl font-bold text-[color:var(--brand-green-deep)]">Indicadores de gestión</h2>
          </div>
          <BarChart3 className="h-10 w-10 text-[color:var(--brand-green-deep)]/40" />
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <KpiBig label="Solicitudes recibidas" value={stats.total} sub="Acumulado total" tone="cream" icon={<FileText className="h-5 w-5" />} />
          <KpiBig label="Resueltas" value={stats.resueltas} sub={`${cumplimiento}% de cumplimiento`} tone="green" icon={<CheckCircle2 className="h-5 w-5" />} />
          <KpiBig label="En proceso" value={stats.enProceso} sub="Activas hoy" tone="yellow" icon={<Clock className="h-5 w-5" />} />
          <KpiBig label="Pendientes" value={stats.pendientes} sub="Por asignar" tone="coral" icon={<Eye className="h-5 w-5" />} />
        </div>

        {/* barra de cumplimiento */}
        <div className="mt-8 rounded-2xl border border-[color:var(--brand-green-deep)]/15 bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[color:var(--brand-green-deep)]">Cumplimiento global de respuesta</div>
              <div className="text-xs text-muted-foreground">Porcentaje de PQRSDS resueltas dentro del término legal</div>
            </div>
            <div className="font-display text-3xl font-bold text-[color:var(--brand-green-deep)]">{cumplimiento}%</div>
          </div>
          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-[color:var(--brand-cream)]">
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${cumplimiento}%` }} transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-[color:var(--brand-green)] to-[color:var(--brand-yellow)]"
            />
          </div>
        </div>
      </section>

      {/* PILARES */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-10 text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-coral)]">Nuestros pilares</div>
            <h2 className="mt-2 font-display text-3xl font-bold text-[color:var(--brand-green-deep)] md:text-4xl">
              Transparencia que se vive
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
              Cuatro principios que guían cómo gestionamos la información pública de la ciudad.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {PILARES.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-[color:var(--brand-green-deep)]/10 bg-[color:var(--brand-cream)] p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
              >
                <div className="absolute right-0 top-0 h-24 w-24 -translate-y-1/2 translate-x-1/2 rounded-full bg-[color:var(--brand-yellow)]/30 blur-2xl transition group-hover:bg-[color:var(--brand-yellow)]/50" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--brand-green-deep)] text-[color:var(--brand-yellow)]">
                  <p.icon className="h-6 w-6" />
                </div>
                <h3 className="relative mt-4 font-display text-lg font-bold text-[color:var(--brand-green-deep)]">{p.title}</h3>
                <p className="relative mt-2 text-sm text-foreground/75">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DATOS ABIERTOS */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-[color:var(--brand-green-deep)] p-8 text-white shadow-[var(--shadow-elegant)]">
            <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-yellow)]">Datos abiertos</div>
            <h3 className="mt-2 font-display text-2xl font-bold md:text-3xl">Descarga la información pública</h3>
            <p className="mt-3 text-sm text-white/80">
              Conjuntos de datos sobre PQRSDS, tiempos de respuesta y secretarías,
              disponibles para periodistas, investigadores y ciudadanía.
            </p>
            <div className="mt-6 space-y-3">
              {DATASETS.map((d) => (
                <button key={d.name} className="flex w-full items-center justify-between rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-left text-sm transition hover:bg-white/10">
                  <div>
                    <div className="font-semibold">{d.name}</div>
                    <div className="text-xs text-white/60">{d.size} · {d.format}</div>
                  </div>
                  <Download className="h-4 w-4 text-[color:var(--brand-yellow)]" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-[color:var(--brand-green-deep)]/15 bg-white p-7 shadow-[var(--shadow-soft)]">
              <Scale className="h-8 w-8 text-[color:var(--brand-coral)]" />
              <h3 className="mt-3 font-display text-xl font-bold text-[color:var(--brand-green-deep)]">Acceso a información pública</h3>
              <p className="mt-2 text-sm text-foreground/75">
                Toda persona tiene derecho a acceder a la información pública en posesión de la Alcaldía,
                conforme a la Ley 1712 de 2014.
              </p>
              <Link to="/pqrsds" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--brand-coral)] hover:underline">
                Solicitar información <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="rounded-2xl border border-[color:var(--brand-green-deep)]/15 bg-[color:var(--brand-sky)]/40 p-7 shadow-[var(--shadow-soft)]">
              <Users className="h-8 w-8 text-[color:var(--brand-green-deep)]" />
              <h3 className="mt-3 font-display text-xl font-bold text-[color:var(--brand-green-deep)]">Participación ciudadana</h3>
              <p className="mt-2 text-sm text-foreground/75">
                Espacios formales para que la ciudadanía vigile, evalúe y proponga sobre la gestión pública.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MARCO LEGAL */}
      <section id="marco-legal" className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-8 text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-coral)]">Marco normativo</div>
            <h2 className="mt-2 font-display text-3xl font-bold text-[color:var(--brand-green-deep)] md:text-4xl">
              Lo que respalda nuestra gestión
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {LEYES.map((l) => (
              <div key={l.titulo} className="group rounded-xl border-2 border-[color:var(--brand-green-deep)]/10 bg-[color:var(--brand-cream)] p-5 transition hover:border-[color:var(--brand-coral)]/40">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-[color:var(--brand-green-deep)] px-2 py-0.5 text-[10px] font-bold text-[color:var(--brand-yellow)]">{l.ano}</div>
                  <div className="font-mono text-xs text-muted-foreground">{l.codigo}</div>
                </div>
                <h4 className="mt-2 font-display text-base font-bold text-[color:var(--brand-green-deep)]">{l.titulo}</h4>
                <p className="mt-1 text-xs text-foreground/70">{l.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[color:var(--brand-coral)] to-[color:var(--brand-coral-soft)] p-10 text-white shadow-[var(--shadow-elegant)] md:p-14">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[color:var(--brand-yellow)]/30 blur-3xl" />
          <div className="relative max-w-2xl">
            <h3 className="font-display text-3xl font-bold md:text-4xl">¿Tienes una solicitud?</h3>
            <p className="mt-3 text-white/90">
              Radica tu PQRSD y haz parte activa del control social.
              Cada solicitud queda registrada con su radicado para seguimiento público.
            </p>
            <Link to="/pqrsds" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-[color:var(--brand-coral)] shadow-md hover:bg-[color:var(--brand-cream)]">
              Radicar PQRSD <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function KpiBig({ label, value, sub, tone, icon }: { label: string; value: number; sub: string; tone: "cream" | "green" | "yellow" | "coral"; icon: React.ReactNode }) {
  const tones = {
    cream: "bg-[color:var(--brand-cream)] text-[color:var(--brand-green-deep)] border-[color:var(--brand-green-deep)]/15",
    green: "bg-[color:var(--brand-green-deep)] text-white border-[color:var(--brand-green-deep)]",
    yellow: "bg-[color:var(--brand-yellow)] text-[color:var(--brand-green-deep)] border-[color:var(--brand-yellow)]",
    coral: "bg-[color:var(--brand-coral)] text-white border-[color:var(--brand-coral)]",
  }[tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className={`relative overflow-hidden rounded-2xl border p-6 shadow-[var(--shadow-soft)] ${tones}`}
    >
      <div className="flex items-start justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-wider opacity-80">{label}</div>
        <div className="opacity-70">{icon}</div>
      </div>
      <div className="mt-3 font-display text-4xl font-bold leading-none">{value}</div>
      <div className="mt-2 text-xs opacity-75">{sub}</div>
    </motion.div>
  );
}

const PILARES = [
  { icon: Eye, title: "Visibilidad", desc: "Información pública accesible en formatos abiertos y comprensibles para todos." },
  { icon: ShieldCheck, title: "Integridad", desc: "Acciones públicas guiadas por principios éticos y rendición de cuentas." },
  { icon: Users, title: "Participación", desc: "Canales abiertos para que la ciudadanía vigile, proponga y decida." },
  { icon: Scale, title: "Legalidad", desc: "Cumplimiento estricto de la Ley 1712 y normas de transparencia." },
];

const DATASETS = [
  { name: "PQRSDS por secretaría · 2024-2026", size: "1.2 MB", format: "CSV" },
  { name: "Tiempos de respuesta promedio", size: "640 KB", format: "CSV" },
  { name: "Solicitudes resueltas vs. pendientes", size: "320 KB", format: "JSON" },
  { name: "Datos demográficos de peticionarios", size: "880 KB", format: "CSV" },
];

const LEYES = [
  { ano: "2014", codigo: "Ley 1712", titulo: "Transparencia y acceso a la información", desc: "Regula el derecho de acceso a la información pública nacional." },
  { ano: "2015", codigo: "Ley 1755", titulo: "Derecho fundamental de petición", desc: "Reglamenta el ejercicio del derecho de petición ante autoridades." },
  { ano: "2011", codigo: "Ley 1474", titulo: "Estatuto Anticorrupción", desc: "Normas para fortalecer mecanismos de prevención y sanción de corrupción." },
  { ano: "2019", codigo: "Decreto 1499", titulo: "Modelo Integrado de Planeación", desc: "Articula el sistema de gestión con el control interno." },
  { ano: "2020", codigo: "Resolución 1519", titulo: "Estándares de publicación web", desc: "Lineamientos para publicación de información en sitios oficiales." },
  { ano: "2022", codigo: "CONPES 4070", titulo: "Lineamientos de gobierno abierto", desc: "Política nacional de transparencia y participación ciudadana." },
];
