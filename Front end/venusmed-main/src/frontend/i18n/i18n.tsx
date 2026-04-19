import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "es" | "en";

type Dict = Record<string, { es: string; en: string }>;

const DICT: Dict = {
  "nav.secretarias": { es: "Secretarías", en: "Departments" },
  "nav.radicar": { es: "Radicar PQRSDS", en: "Submit a request" },
  "nav.login": { es: "Iniciar sesión", en: "Sign in" },
  "nav.lang": { es: "Idioma", en: "Language" },
  "home.badge": { es: "Flor al alcance de todos", en: "Flor — within everyone's reach" },
  "home.title1": { es: "Tus PQRSDS,", en: "Your requests," },
  "home.title2": { es: "claras y a tiempo.", en: "clear and on time." },
  "home.subtitle": {
    es: "Consulta el estado de tu radicado en segundos o crea uno nuevo. Una plataforma ciudadana hecha para Medellín.",
    en: "Check your request status in seconds or create a new one. A citizen platform made for Medellín.",
  },
  "home.consult.title": { es: "Consulta tu radicado", en: "Track your request" },
  "home.consult.desc": { es: "Ingresa el ID que recibiste al radicar tu solicitud.", en: "Enter the ID you received when submitting." },
  "home.consult.btn": { es: "Consultar", en: "Search" },
  "home.consult.loading": { es: "Consultando…", en: "Searching…" },
  "home.consult.create": { es: "¿No tienes radicado? Crea uno aquí", en: "No request yet? Create one here" },
  "home.info.title": { es: "Información importante", en: "Important info" },
  "home.info.desc": { es: "Lo que todo ciudadano debe saber sobre PQRSDS.", en: "What every citizen should know about requests." },
  "home.info.1.t": { es: "Plazos legales", en: "Legal deadlines" },
  "home.info.1.d": { es: "Petición: 15 días · Queja/Reclamo: 15 días · Denuncia: prioritaria.", en: "Petition: 15 days · Complaint: 15 days · Report: priority." },
  "home.info.2.t": { es: "Tu radicado es tu llave", en: "Your ID is your key" },
  "home.info.2.d": { es: "Guárdalo. Te permite consultar el estado en cualquier momento.", en: "Save it. You can check status anytime." },
  "home.info.3.t": { es: "Atención prioritaria", en: "Priority care" },
  "home.info.3.d": { es: "Casos sobre menores, salud o seguridad se atienden de inmediato.", en: "Cases involving minors, health or safety get immediate attention." },
  "home.allies": { es: "Aliados de la ciudad", en: "City partners" },
  "home.allies.desc": { es: "Accesos rápidos a las entidades aliadas.", en: "Quick links to partner entities." },
  "home.secretarias": { es: "36 Secretarías y dependencias", en: "36 Departments" },
  "home.secretarias.desc": { es: "Conoce cada una y radica directamente.", en: "Get to know each one and submit directly." },
  "home.secretarias.cta": { es: "Ver detalle", en: "View details" },
  "footer.tag": {
    es: "Plataforma ciudadana para la gestión transparente de Peticiones, Quejas, Reclamos, Sugerencias y Denuncias.",
    en: "Citizen platform for transparent management of petitions, complaints, suggestions and reports.",
  },
  "footer.links": { es: "Enlaces", en: "Links" },
  "footer.allies": { es: "Aliados", en: "Partners" },
  "form.send": { es: "Enviar solicitud", en: "Send request" },
  "form.sending": { es: "Analizando con IA…", en: "Analyzing with AI…" },
  "form.unknown": { es: "No sé / No estoy seguro", en: "I don't know / Not sure" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: keyof typeof DICT) => string };
const I18nCtx = createContext<Ctx>({ lang: "es", setLang: () => {}, t: (k) => DICT[k]?.es ?? String(k) });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("lang")) as Lang | null;
    if (saved === "en" || saved === "es") setLangState(saved);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };
  const t = (key: keyof typeof DICT) => DICT[key]?.[lang] ?? String(key);
  return <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>;
}

export const useI18n = () => useContext(I18nCtx);
