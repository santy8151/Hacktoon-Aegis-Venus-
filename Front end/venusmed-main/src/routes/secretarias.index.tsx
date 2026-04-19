import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SECRETARIAS_INFO } from "@/backend/data/secretariasInfo";
import heroImg from "@/assets/medellin-hero.jpg";

export const Route = createFileRoute("/secretarias/")({
  head: () => ({
    meta: [
      { title: "Secretarías y dependencias — Medellín" },
      { name: "description", content: "Las 36 secretarías y dependencias de la Alcaldía de Medellín. Conoce cada una y radica directamente." },
      { property: "og:title", content: "Secretarías y dependencias — Medellín" },
      { property: "og:description", content: "Conoce las 36 secretarías y dependencias de la Alcaldía de Medellín." },
    ],
  }),
  component: SecretariasIndex,
});

function SecretariasIndex() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" aria-hidden className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20 text-primary-foreground">
          <div className="text-xs uppercase tracking-[0.25em] text-white/70">Alcaldía de Medellín</div>
          <h1 className="mt-2 font-display text-4xl font-extrabold md:text-5xl">
            36 Secretarías y dependencias
          </h1>
          <p className="mt-3 max-w-2xl text-white/90">
            Cada una con un propósito al servicio de la ciudad. Conoce sus funciones y radica tu solicitud al equipo correcto.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SECRETARIAS_INFO.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.slug}
                to="/secretarias/$slug"
                params={{ slug: s.slug }}
                className="group rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--gradient-brand)] text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="mt-3 font-display text-lg font-bold leading-tight">{s.nombre}</div>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{s.descripcion}</p>
                <div className="mt-3 inline-flex items-center text-xs font-semibold text-primary">
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
