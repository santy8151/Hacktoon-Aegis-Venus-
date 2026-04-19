import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-20 border-t border-border bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
        <div>
          <div className="font-display text-lg font-bold">Medellín · PQRSDS</div>
          <p className="mt-2 text-sm text-muted-foreground">{t("footer.tag")}</p>
        </div>
        <div>
          <div className="text-sm font-semibold">{t("footer.links")}</div>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary">{t("nav.secretarias") === "Departments" ? "Home" : "Inicio"}</Link></li>
            <li><Link to="/secretarias" className="hover:text-primary">{t("nav.secretarias")}</Link></li>
            <li><Link to="/pqrsds" className="hover:text-primary">{t("nav.radicar")}</Link></li>
            <li><Link to="/login" className="hover:text-primary">{t("nav.login")}</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">{t("footer.allies")}</div>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>Sapiencia · SIATA</li>
            <li>Metro de Medellín · EPM</li>
            <li>Alcaldía de Medellín</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Alcaldía de Medellín — Flor al alcance de todos.
      </div>
    </footer>
  );
}
