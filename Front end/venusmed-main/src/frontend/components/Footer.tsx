import { Link } from "@tanstack/react-router";
import { useI18n } from "@/frontend/i18n/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-20 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
        <div>
          <div className="font-display text-lg font-bold">Medellín · PQRSDS</div>
          <p className="mt-2 text-sm text-primary-foreground/75">{t("footer.tag")}</p>
        </div>
        <div>
          <div className="text-sm font-semibold">{t("footer.links")}</div>
          <ul className="mt-2 space-y-1 text-sm text-primary-foreground/75">
            <li><Link to="/" className="hover:text-[color:var(--brand-yellow)]">{t("nav.secretarias") === "Departments" ? "Home" : "Inicio"}</Link></li>
            <li><Link to="/secretarias" className="hover:text-[color:var(--brand-yellow)]">{t("nav.secretarias")}</Link></li>
            <li><Link to="/pqrsds" className="hover:text-[color:var(--brand-yellow)]">{t("nav.radicar")}</Link></li>
            <li><Link to="/login" className="hover:text-[color:var(--brand-yellow)]">{t("nav.login")}</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">{t("footer.allies")}</div>
          <ul className="mt-2 space-y-1 text-sm text-primary-foreground/75">
            <li>Sapiencia · SIATA</li>
            <li>Metro de Medellín · EPM</li>
            <li>Alcaldía de Medellín</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-primary-foreground/70">
        © {new Date().getFullYear()} Alcaldía de Medellín — Flor al alcance de todos.
      </div>
    </footer>
  );
}
