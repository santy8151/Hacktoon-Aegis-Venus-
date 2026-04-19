import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ChevronLeft, ChevronRight, Coffee, Download } from "lucide-react";
import { useI18n } from "@/frontend/i18n/i18n";
import { SECRETARIAS_INFO } from "@/backend/data/secretariasInfo";
import { toast } from "sonner";
import heroImg from "@/assets/medellin-hero.jpg";
import conoceMasYohan from "@/assets/conoce-mas-yohan.jpg";
import imgGobierno from "@/assets/sec-gobierno.jpg";
import imgEducacion from "@/assets/sec-educacion.jpg";
import imgHacienda from "@/assets/sec-hacienda.jpg";
import imgSeguridad from "@/assets/sec-seguridad.jpg";
import imgGeneral from "@/assets/sec-general.jpg";
import logoSiata from "@/assets/entidad-siata.png";
import logoSapiencia from "@/assets/entidad-sapiencia.png";
import logoFlores from "@/assets/entidad-flores.png";
import logoEpm from "@/assets/entidad-epm.png";
import logoMetro from "@/assets/entidad-metro.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Medellín PQRSC — Fácil y rápido" },
      { name: "description", content: "Consulta o radica tus PQRSC en Medellín de forma fácil, rápida y segura." },
      { property: "og:title", content: "Medellín PQRSC — Fácil y rápido" },
      { property: "og:description", content: "Plataforma ciudadana para la gestión de PQRSC de Medellín." },
    ],
  }),
  component: HomePage,
});

type Pqrsd = {
  radicado: string;
  tipo_solicitud?: string;
  tipo?: string;
  estado: string;
  descripcion?: string;
  prioridad: string;
  fecha_vencimiento?: string;
  nombre_dependencia_sugerida?: string;
};

function diasHasta(iso: string) {
  if (!iso) return 0;
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
}

function HomePage() {
  const { t } = useI18n();

  const [carouselIndex, setCarouselIndex] = useState(0);
  const itemsPerView = 5;
  const maxIndex = Math.max(0, SECRETARIAS_INFO.length - itemsPerView);

  // Slider "Conoce más"
  const conoceSlides = [
    {
      titulo: "Empezar por casa: la historia de Yohan, un ejemplo del acompañamiento familiar para personas de…",
      tag: "Diversidad",
      bajada: "En la casa de la familia Úsuga Escudero, ubicada en la comuna 13…",
      imagen: conoceMasYohan,
    },
    {
      titulo: "Seguridad y convivencia: operativos articulados que protegen a los barrios de Medellín",
      tag: "Seguridad",
      bajada: "Equipos del Gaula y la Policía Metropolitana presentaron resultados conjuntos…",
      imagen: imgSeguridad,
    },
    {
      titulo: "Centro Administrativo La Alpujarra: el corazón de la gestión pública del Distrito",
      tag: "Gobierno",
      bajada: "Un recorrido por el complejo donde se toman las grandes decisiones de la ciudad…",
      imagen: imgHacienda,
    },
    {
      titulo: "Educación con sentido de ciudad: la apuesta por una Medellín que aprende",
      tag: "Educación",
      bajada: "Desde las laderas hasta el centro, la educación pública conecta y transforma…",
      imagen: imgEducacion,
    },
    {
      titulo: "Plaza Botero y el centro vivo: cultura y memoria en el corazón de Medellín",
      tag: "Cultura",
      bajada: "El Palacio de la Cultura y la plaza siguen siendo punto de encuentro ciudadano…",
      imagen: imgGobierno,
    },
  ];
  const [conoceIndex, setConoceIndex] = useState(0);

  const [radicado, setRadicado] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Pqrsd | null>(null);

  const consultar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!radicado.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5001/api/casos/radicado/${encodeURIComponent(radicado.trim().toUpperCase())}`);
      if (!res.ok) throw new Error("No encontrado");
      const data = await res.json();
      setResult(data as Pqrsd);
    } catch (err) {
      toast.error("No encontramos ese radicado.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const getStep = (estado: string) => {
    if (estado === "clasificado") return 2;
    if (estado === "respondido") return 3;
    return 1;
  };

  const getPrioridadStyle = (prio: string) => {
    const p = (prio || "").toLowerCase();
    if (p === "urgente" || p === "vencido" || p === "alta") return "bg-[color:var(--brand-coral)] text-white";
    if (p === "baja") return "bg-gray-200 text-gray-700";
    return "bg-[color:var(--brand-sky)]/60 text-[color:var(--brand-green-deep)]";
  };

  const getPrioridadText = (prio: string) => {
    if (!prio) return "Media";
    const p = prio.toLowerCase();
    if (p === "vencido") return "Vencido";
    if (p === "urgente") return "Urgente";
    if (p === "alta") return "Alta";
    if (p === "baja") return "Baja";
    return "Media";
  };

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
          <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--brand-cream)]/30 via-[color:var(--brand-cream)]/10 to-[color:var(--brand-cream)]/40" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28 lg:py-32">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-[color:var(--brand-green-deep)] drop-shadow-sm md:text-6xl lg:text-7xl"
          >
            Tus PQRSC,<br />fácil y rápido.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-10 max-w-md rounded-2xl border border-white/60 bg-[color:var(--brand-cream)]/95 p-6 shadow-[var(--shadow-elegant)] backdrop-blur md:p-7"
          >
            <p className="text-sm leading-relaxed text-[color:var(--brand-green-deep)]/85">
              Bienvenidos a la página Eniaza, aquí nos encargamos de mover tus
              procesos de forma eficiente a las autoridades encargadas para que
              tus PQRS sean atendidas de forma eficiente y segura.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="text-xs font-semibold leading-snug text-[color:var(--brand-green-deep)]">
                  ¿Ya tienes un<br />proceso abierto?
                </div>
                <a
                  href="#revisa"
                  className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-[color:var(--brand-green-deep)] px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition hover:bg-[color:var(--brand-green-deep)]/90"
                >
                  Consultalo aquí
                </a>
              </div>
              <div>
                <div className="text-xs font-semibold leading-snug text-[color:var(--brand-green-deep)]">
                  ¿Quieres abrir un<br />proceso nuevo?
                </div>
                <Link
                  to="/pqrsds"
                  className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-[color:var(--brand-coral)] px-4 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-soft)] transition hover:scale-[1.02] hover:bg-[color:var(--brand-coral)]/90"
                >
                  Radicar PQRSDS
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            aria-hidden
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="mt-10 hidden w-fit flex-col items-center text-[color:var(--brand-green-deep)]/70 md:flex"
          >
            <span className="text-[11px] uppercase tracking-[0.3em]">Desliza</span>
            <ArrowDown className="mt-1 h-5 w-5" />
          </motion.div>
        </div>
      </section>

      {/* CONOCE MÁS — banda crema con carrusel */}
      <section className="bg-[color:var(--brand-cream)] pt-14 pb-20">
        <div className="mx-auto max-w-7xl px-4 text-center md:px-6">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-[color:var(--brand-green-deep)] md:text-4xl">
            Conoce más…
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-[color:var(--brand-green-deep)]/80">
            {t("home.secretarias.desc")}
          </p>
        </div>

        {/* SLIDER tipo "Conoce más" — tarjeta turquesa con foto a la derecha */}
        <div className="mx-auto mt-10 max-w-6xl px-4 md:px-6">
          <div className="overflow-hidden rounded-2xl shadow-[var(--shadow-elegant)]">
            <AnimatePresence mode="wait">
              <motion.article
                key={conoceIndex}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="grid min-h-[280px] grid-cols-1 md:grid-cols-2"
              >
                <div className="flex flex-col justify-center gap-4 bg-[color:var(--brand-sky)] p-8 text-white md:p-10">
                  <h3 className="font-display text-2xl font-bold leading-tight md:text-3xl">
                    {conoceSlides[conoceIndex].titulo}
                  </h3>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-white/85">
                      Contenido asociado a
                    </div>
                    <div className="mt-1 inline-flex items-center gap-2 text-sm font-semibold">
                      <span className="h-2.5 w-2.5 rounded-full bg-white" />
                      {conoceSlides[conoceIndex].tag}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-white/95">
                    {conoceSlides[conoceIndex].bajada}
                  </p>
                  <div className="mt-2 flex items-center gap-4">
                    <button className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-[color:var(--brand-coral)] shadow-md transition hover:scale-[1.03]">
                      Conoce más
                    </button>
                    <div className="flex items-center gap-1.5">
                      {conoceSlides.map((_, i) => (
                        <button
                          key={i}
                          aria-label={`Ir al slide ${i + 1}`}
                          onClick={() => setConoceIndex(i)}
                          className={`h-2.5 rounded-full transition-all ${
                            i === conoceIndex
                              ? "w-6 bg-[color:var(--brand-coral)]"
                              : "w-2.5 bg-white/70 hover:bg-white"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="relative h-64 md:h-auto">
                  <img
                    src={conoceSlides[conoceIndex].imagen}
                    alt={conoceSlides[conoceIndex].titulo}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setConoceIndex((i) => (i === 0 ? conoceSlides.length - 1 : i - 1))}
              aria-label="Slide anterior"
              className="rounded-full bg-[color:var(--brand-green-deep)] p-2 text-white shadow-md transition hover:scale-110"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setConoceIndex((i) => (i + 1) % conoceSlides.length)}
              aria-label="Slide siguiente"
              className="rounded-full bg-[color:var(--brand-green-deep)] p-2 text-white shadow-md transition hover:scale-110"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* CARRUSEL DE SECRETARÍAS — abajo del slider */}
        <div className="mx-auto mt-12 mb-2 max-w-7xl px-4 text-center md:px-6">
          <h3 className="font-display text-2xl font-bold text-[color:var(--brand-green-deep)] md:text-3xl">
            Secretarías y dependencias
          </h3>
        </div>

        <div className="relative mx-auto mt-6 max-w-7xl px-4 md:px-6">
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: `calc(-${carouselIndex} * (100% / ${itemsPerView}))` }}
              transition={{ type: "spring", stiffness: 80, damping: 18 }}
              className="flex"
              style={{ width: `${(SECRETARIAS_INFO.length / itemsPerView) * 100}%` }}
            >
              {SECRETARIAS_INFO.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.slug}
                    className="px-2"
                    style={{ width: `calc(100% / ${SECRETARIAS_INFO.length})` }}
                  >
                    <Link
                      to="/secretarias/$slug"
                      params={{ slug: s.slug }}
                      className="group flex h-full flex-col rounded-2xl bg-[color:var(--brand-coral)] p-3 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
                    >
                      <div className="relative h-28 w-full overflow-hidden rounded-xl bg-[color:var(--brand-cream)]/60">
                        {s.imagen ? (
                          <img
                            src={s.imagen}
                            alt={s.nombre}
                            loading="lazy"
                            width={512}
                            height={512}
                            className="h-full w-full object-cover transition group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Icon className="h-10 w-10 text-[color:var(--brand-green-deep)]" />
                          </div>
                        )}
                      </div>
                      <div className="mt-3 line-clamp-2 px-1 text-center text-xs font-semibold leading-tight text-white">
                        {s.nombre}.
                      </div>
                    </Link>
                  </div>
                );
              })}
            </motion.div>
          </div>

          <button
            onClick={() => setCarouselIndex((i) => Math.max(0, i - 1))}
            disabled={carouselIndex === 0}
            aria-label="Anterior"
            className="absolute -left-2 top-1/2 -translate-y-1/2 rounded-full bg-[color:var(--brand-green-deep)] p-2 text-white shadow-md transition hover:scale-110 disabled:opacity-30 md:-left-4"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCarouselIndex((i) => Math.min(maxIndex, i + 1))}
            disabled={carouselIndex >= maxIndex}
            aria-label="Siguiente"
            className="absolute -right-2 top-1/2 -translate-y-1/2 rounded-full bg-[color:var(--brand-green-deep)] p-2 text-white shadow-md transition hover:scale-110 disabled:opacity-30 md:-right-4"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="mt-8 flex items-center justify-center gap-3 text-2xl text-[color:var(--brand-coral)]">
            <span>✻</span><span>✻</span><span>✻</span><span>✻</span>
          </div>
        </div>
      </section>

      {/* REVISA TU SOLICITUD */}
      <section id="revisa" className="bg-[color:var(--brand-coral)] py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="font-display text-3xl font-extrabold text-[color:var(--brand-green-deep)] md:text-4xl">
            Revisa tu solicitud
          </h2>
          <p className="mt-2 text-sm text-[color:var(--brand-green-deep)]/80">
            Ingresa el número de radicado de tu PQRSD
          </p>

          <form onSubmit={consultar} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={radicado}
              onChange={(e) => setRadicado(e.target.value)}
              placeholder="EJ: MED#2026#ABC000"
              className="w-full max-w-md rounded-md border border-white/60 bg-white/95 px-4 py-3 text-sm text-[color:var(--brand-green-deep)] outline-none focus:ring-2 focus:ring-[color:var(--brand-green-deep)]"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[color:var(--brand-green-deep)] px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] disabled:opacity-60"
            >
              {loading ? "Consultando…" : "Consultar"}
            </button>
          </form>

          <p className="mt-3 text-xs font-semibold text-[color:var(--brand-green-deep)]">
            ¿No tienes radicado?{" "}
            <Link to="/pqrsds" className="underline hover:text-white">
              Crea uno aquí →
            </Link>
          </p>

          <div className="mt-8 max-w-xl mx-auto">
            {result ? (
              <div className="rounded-[2rem] border border-white/60 bg-white/95 p-6 sm:p-8 shadow-sm text-left">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg sm:text-xl font-bold tracking-wider text-[color:var(--brand-green-deep)]">
                    {result.radicado}
                  </h3>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-wide ${getPrioridadStyle(result.prioridad)}`}>
                    {getPrioridadText(result.prioridad)}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-[color:var(--brand-green-deep)]/70">
                  {result.tipo_solicitud || result.tipo || "Petición"} · {result.nombre_dependencia_sugerida || "Secretaría"}
                </p>

                {/* Timeline Horizontal */}
                <div className="mt-10 mb-8 relative">
                  <div className="absolute top-[15px] left-[10%] w-[80%] h-[2px] bg-[#e5efe9]" />
                  <div 
                    className="absolute top-[15px] left-[10%] h-[2px] bg-[color:var(--brand-coral)] transition-all duration-500" 
                    style={{ width: getStep(result.estado) === 1 ? '0%' : getStep(result.estado) === 2 ? '50%' : '100%' }} 
                  />
                  
                  <div className="relative flex justify-between px-2 sm:px-4">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-colors duration-300 ${getStep(result.estado) >= 1 ? 'bg-[color:var(--brand-coral)] text-white' : 'bg-[#e5efe9] text-[color:var(--brand-green-deep)]'}`}>
                        1
                      </div>
                      <div className={`mt-3 text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${getStep(result.estado) >= 1 ? 'text-[color:var(--brand-green-deep)]' : 'text-[color:var(--brand-green-deep)]/40'}`}>
                        PENDIENTE
                      </div>
                    </div>
                    {/* Step 2 */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-colors duration-300 ${getStep(result.estado) >= 2 ? 'bg-[color:var(--brand-green-deep)]/10 text-[color:var(--brand-green-deep)]' : 'bg-[#e5efe9] text-[color:var(--brand-green-deep)]/60'}`}>
                        2
                      </div>
                      <div className={`mt-3 text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${getStep(result.estado) >= 2 ? 'text-[color:var(--brand-green-deep)]' : 'text-[color:var(--brand-green-deep)]/40'}`}>
                        EN PROCESO
                      </div>
                    </div>
                    {/* Step 3 */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-colors duration-300 ${getStep(result.estado) >= 3 ? 'bg-[color:var(--brand-green-deep)]/10 text-[color:var(--brand-green-deep)]' : 'bg-[#e5efe9] text-[color:var(--brand-green-deep)]/60'}`}>
                        3
                      </div>
                      <div className={`mt-3 text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${getStep(result.estado) >= 3 ? 'text-[color:var(--brand-green-deep)]' : 'text-[color:var(--brand-green-deep)]/40'}`}>
                        RESUELTO
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-[color:var(--brand-green-deep)]/10 pt-5">
                  <span className="text-sm font-semibold text-[color:var(--brand-green-deep)]/70">Plazo restante</span>
                  <span className="font-display text-sm font-bold text-[color:var(--brand-green-deep)]">
                    {result.fecha_vencimiento ? `${diasHasta(result.fecha_vencimiento)} días` : "Calculando..."}
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-white/40 bg-[color:var(--brand-cream)] p-6 shadow-[var(--shadow-soft)] min-h-[220px] flex items-center justify-center text-center text-sm text-[color:var(--brand-green-deep)]/60">
                Ingresa tu número de radicado para ver el detalle de tu solicitud.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CARRUSEL DE ENTIDADES — sitios oficiales */}
      <section className="bg-[color:var(--brand-cream)] py-16">
        <div className="mx-auto max-w-7xl px-4 text-center md:px-6">
          <h2 className="font-display text-3xl font-extrabold text-[color:var(--brand-green-deep)] md:text-4xl">
            Páginas oficiales
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-[color:var(--brand-green-deep)]/75">
            Visita los sitios web de las principales entidades y programas del Distrito de Medellín.
          </p>
        </div>

        <div className="relative mx-auto mt-10 max-w-6xl overflow-hidden px-4 md:px-6">
          <motion.div
            className="flex gap-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          >
            {[
              { nombre: "SIATA", logo: logoSiata, url: "https://siata.gov.co/", color: "var(--brand-sky)" },
              { nombre: "Sapiencia", logo: logoSapiencia, url: "https://www.sapiencia.gov.co/", color: "var(--brand-green-deep)" },
              { nombre: "Feria de las Flores", logo: logoFlores, url: "https://www.medellin.gov.co/feriadelasflores/", color: "var(--brand-coral)" },
              { nombre: "EPM", logo: logoEpm, url: "https://www.epm.com.co/", color: "var(--brand-sky)" },
              { nombre: "Metro de Medellín", logo: logoMetro, url: "https://www.metrodemedellin.gov.co/", color: "var(--brand-green-deep)" },
              { nombre: "SIATA", logo: logoSiata, url: "https://siata.gov.co/", color: "var(--brand-sky)" },
              { nombre: "Sapiencia", logo: logoSapiencia, url: "https://www.sapiencia.gov.co/", color: "var(--brand-green-deep)" },
              { nombre: "Feria de las Flores", logo: logoFlores, url: "https://www.medellin.gov.co/feriadelasflores/", color: "var(--brand-coral)" },
              { nombre: "EPM", logo: logoEpm, url: "https://www.epm.com.co/", color: "var(--brand-sky)" },
              { nombre: "Metro de Medellín", logo: logoMetro, url: "https://www.metrodemedellin.gov.co/", color: "var(--brand-green-deep)" },
            ].map((ent, i) => (
              <a
                key={`${ent.nombre}-${i}`}
                href={ent.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-[220px] shrink-0 flex-col items-center gap-3 rounded-2xl border border-[color:var(--brand-green-deep)]/15 bg-white p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
                style={{ borderTop: `4px solid ${ent.color}` }}
              >
                <div className="flex h-24 w-full items-center justify-center">
                  <img
                    src={ent.logo}
                    alt={`Logo ${ent.nombre}`}
                    loading="lazy"
                    width={512}
                    height={512}
                    className="h-full w-auto object-contain transition group-hover:scale-105"
                  />
                </div>
                <div className="text-center text-sm font-bold text-[color:var(--brand-green-deep)]">
                  {ent.nombre}
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--brand-coral)] opacity-0 transition group-hover:opacity-100">
                  Visitar →
                </span>
              </a>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
