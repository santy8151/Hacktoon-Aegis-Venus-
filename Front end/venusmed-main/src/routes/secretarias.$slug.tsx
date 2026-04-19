import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink, FilePlus2 } from "lucide-react";
import { findSecretariaBySlug, SECRETARIAS_INFO } from "@/backend/data/secretariasInfo";
import heroImg from "@/assets/medellin-hero.jpg";

export const Route = createFileRoute("/secretarias/$slug")({
  loader: ({ params }) => {
    const sec = findSecretariaBySlug(params.slug);
    if (!sec) throw notFound();
    return { sec };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.sec.nombre} — Medellín` },
          { name: "description", content: loaderData.sec.descripcion },
          { property: "og:title", content: loaderData.sec.nombre },
          { property: "og:description", content: loaderData.sec.descripcion },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-display text-3xl font-bold">Secretaría no encontrada</h1>
      <Link to="/secretarias" className="mt-4 inline-flex text-primary hover:underline">
        Ver todas las secretarías
      </Link>
    </div>
  ),
  component: SecretariaDetail,
});

function SecretariaDetail() {
  const { sec } = Route.useLoaderData();
  const Icon = sec.icon;
  const others = SECRETARIAS_INFO.filter((s) => s.slug !== sec.slug).slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" aria-hidden className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-28 text-primary-foreground">
          <Link
            to="/secretarias"
            className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Volver a Secretarías
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-6 flex items-center gap-5"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm shadow-[var(--shadow-elegant)]">
              <Icon className="h-10 w-10" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-white/70">
                Alcaldía de Medellín
              </div>
              <h1 className="mt-1 font-display text-3xl font-extrabold leading-tight md:text-5xl">
                {sec.nombre}
              </h1>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-3xl text-lg text-white/90"
          >
            {sec.descripcion}
          </motion.p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/pqrsds"
              className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground shadow-[var(--shadow-elegant)] transition hover:scale-[1.02]"
            >
              <FilePlus2 className="h-4 w-4" /> Radicar PQRSDS a esta dependencia
            </Link>
            <a
              href={sec.enlace}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20"
            >
              Sitio oficial <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 md:px-6">
        <h2 className="font-display text-xl font-bold">Otras dependencias</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((o) => {
            const OIcon = o.icon;
            return (
              <Link
                key={o.slug}
                to="/secretarias/$slug"
                params={{ slug: o.slug }}
                className="group rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:border-primary/40"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--gradient-brand)] text-primary-foreground">
                  <OIcon className="h-5 w-5" />
                </div>
                <div className="mt-3 line-clamp-2 font-display text-sm font-bold">{o.nombre}</div>
                <div className="mt-2 inline-flex items-center text-xs font-semibold text-primary">
                  Ver detalle <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
