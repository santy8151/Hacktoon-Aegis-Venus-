import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { useI18n } from "@/frontend/i18n/i18n";
import logo from "@/assets/medellin-logo.png";

export function Header() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[var(--brand-yellow)]/40" />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="rounded-md bg-white px-2 py-1">
            <img
              src={logo}
              alt="Logo Alcaldía de Medellín"
              className="h-9 w-auto md:h-10 transition-transform group-hover:scale-105"
            />
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            to="/secretarias"
            className="rounded-md px-3 py-2 text-sm font-medium text-primary-foreground/85 transition-all duration-200 hover:bg-[var(--brand-yellow)]/25 hover:text-[var(--brand-yellow)] hover:-translate-y-0.5"
          >
            Servicios a la ciudadanía
          </Link>
          <Link
            to="/transparencia"
            className="rounded-md px-3 py-2 text-sm font-medium text-primary-foreground/85 transition-all duration-200 hover:bg-[var(--brand-yellow)]/25 hover:text-[var(--brand-yellow)] hover:-translate-y-0.5"
          >
            Transparencia
          </Link>

          <Link
            to="/login"
            className="rounded-md border border-white/40 px-4 py-2 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-[var(--brand-yellow)]/25 hover:text-[var(--brand-yellow)] hover:border-[var(--brand-yellow)]/60"
          >
            {t("nav.login")}
          </Link>

          {/* Idioma */}
          <div className="relative ml-2" onMouseLeave={() => setLangOpen(false)}>
            <button
              onClick={() => setLangOpen((v) => !v)}
              onMouseEnter={() => setLangOpen(true)}
              className="inline-flex items-center gap-1 rounded-md border border-white/30 px-2.5 py-2 text-xs font-semibold uppercase text-primary-foreground/90 hover:bg-white/10"
              aria-label={t("nav.lang")}
            >
              <Globe className="h-4 w-4" /> {lang}
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-32 rounded-lg border border-border bg-popover p-1 text-foreground shadow-[var(--shadow-elegant)]">
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
          className="md:hidden rounded-md p-2 text-primary-foreground hover:bg-white/10"
          aria-label="Abrir menú"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-primary text-primary-foreground md:hidden">
          <div className="flex flex-col p-3">
            <Link
              to="/secretarias"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10"
            >
              Servicios a la ciudadanía
            </Link>
            <Link
              to="/transparencia"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10"
            >
              Transparencia
            </Link>
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md border border-white/40 px-4 py-2 text-center text-sm font-semibold text-primary-foreground"
            >
              {t("nav.login")}
            </Link>
            <div className="mt-3 flex items-center justify-center gap-2">
              {(["es", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`rounded-md border border-white/40 px-3 py-1 text-xs uppercase ${lang === l ? "bg-[var(--brand-yellow)] text-[color:var(--brand-green-deep)] border-transparent" : ""}`}
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
