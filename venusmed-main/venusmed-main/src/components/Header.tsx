import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import { SECRETARIAS_INFO } from "@/lib/secretariasInfo";
import { useI18n } from "@/lib/i18n";
import logo from "@/assets/medellin-logo.png";

export function Header() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [secOpen, setSecOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="absolute inset-x-0 top-0 h-1 bg-[var(--gradient-brand)]" />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Logo Alcaldía de Medellín"
            className="h-10 w-auto md:h-12 transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <div
            className="relative"
            onMouseEnter={() => setSecOpen(true)}
            onMouseLeave={() => setSecOpen(false)}
          >
            <button className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground">
              {t("nav.secretarias")} <ChevronDown className="h-4 w-4" />
            </button>
            {secOpen && (
              <div className="absolute right-0 top-full z-50 w-[620px] rounded-xl border border-border bg-popover p-3 shadow-[var(--shadow-elegant)]">
                <div className="mb-2 flex items-center justify-between px-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    36 dependencias
                  </span>
                  <Link to="/secretarias" className="text-xs font-semibold text-primary hover:underline">
                    Ver todas →
                  </Link>
                </div>
                <div className="grid max-h-[60vh] grid-cols-2 gap-1 overflow-auto">
                  {SECRETARIAS_INFO.map((s) => {
                    const Icon = s.icon;
                    return (
                      <Link
                        key={s.slug}
                        to="/secretarias/$slug"
                        params={{ slug: s.slug }}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-accent hover:text-accent-foreground"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-primary" />
                        <span className="truncate">{s.nombre}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Link
            to="/pqrsds"
            className="rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-[1.02]"
          >
            {t("nav.radicar")}
          </Link>
          <Link
            to="/login"
            className="rounded-md border border-primary/30 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            {t("nav.login")}
          </Link>

          {/* Idioma */}
          <div className="relative ml-2" onMouseLeave={() => setLangOpen(false)}>
            <button
              onClick={() => setLangOpen((v) => !v)}
              onMouseEnter={() => setLangOpen(true)}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-2 text-xs font-semibold uppercase text-foreground/80 hover:bg-accent"
              aria-label={t("nav.lang")}
            >
              <Globe className="h-4 w-4" /> {lang}
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-32 rounded-lg border border-border bg-popover p-1 shadow-[var(--shadow-elegant)]">
                {(["es", "en"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setLangOpen(false); }}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm hover:bg-accent ${lang === l ? "font-bold text-primary" : ""}`}
                  >
                    {l === "es" ? "Español" : "English"}
                    <span className="text-xs uppercase opacity-60">{l}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        <button
          className="md:hidden rounded-md p-2 text-foreground hover:bg-accent"
          aria-label="Abrir menú"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="flex flex-col p-3">
            <details className="rounded-md">
              <summary className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">
                {t("nav.secretarias")} (36)
              </summary>
              <div className="mt-1 max-h-72 overflow-auto rounded-md border border-border">
                {SECRETARIAS_INFO.map((s) => (
                  <Link
                    key={s.slug}
                    to="/secretarias/$slug"
                    params={{ slug: s.slug }}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 text-sm hover:bg-accent"
                  >
                    {s.nombre}
                  </Link>
                ))}
              </div>
            </details>
            <Link
              to="/pqrsds"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-secondary px-4 py-2 text-center text-sm font-semibold text-secondary-foreground"
            >
              {t("nav.radicar")}
            </Link>
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md border border-primary/30 px-4 py-2 text-center text-sm font-semibold text-primary"
            >
              {t("nav.login")}
            </Link>
            <div className="mt-3 flex items-center justify-center gap-2">
              {(["es", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`rounded-md border border-border px-3 py-1 text-xs uppercase ${lang === l ? "bg-primary text-primary-foreground" : ""}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
