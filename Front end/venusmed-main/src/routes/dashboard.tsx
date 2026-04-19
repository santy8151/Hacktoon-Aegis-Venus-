import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Loader2, Clock, TrendingUp, CheckCircle2, AlertTriangle, Sparkles,
  Bell, X, Search, Brain,
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/medellin-logo.png";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Panel servidor público — Medellín PQRSDS" },
      { name: "description", content: "Panel del servidor público para gestionar PQRSDS con IA, filtros y seguimiento de plazos." },
    ],
  }),
  component: DashboardPage,
});

type Estado = "pendiente_clasificar" | "clasificado" | "respondido";
type Prioridad = "Baja" | "Media" | "Alta" | "Urgente";

type Row = {
  id: string;
  radicado: string;
  nombre: string;
  documento: string;
  tipo: string;
  secretaria: string;
  descripcion: string;
  estado: Estado;
  prioridad: Prioridad;
  ai_resumen?: string | null;
  ai_sugerencia?: string | null;
  ai_categoria?: string | null;
  fecha_limite: string;
  created_at: string;
  nombre_dependencia_sugerida?: string;
  titulo_ia?: string;
  resumen_ia?: string;
};

type Filtro = "todas" | "pendiente_clasificar" | "clasificado" | "respondido";

function estadoUI(estadoBD: Estado) {
  if (estadoBD === "pendiente_clasificar") return "Pendiente";
  if (estadoBD === "clasificado") return "En proceso";
  if (estadoBD === "respondido") return "Resuelto";
  return "Pendiente";
}

function diasHasta(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
}
function fmtFechaLarga(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
}
function calcularEdad(documento: string) {
  // Simulación amigable: deriva una edad estable a partir del documento
  const docStr = String(documento || "");
  const n = parseInt(docStr.replace(/\D/g, "").slice(-2) || "30", 10);
  return 25 + (n % 45);
}

function DashboardPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [busqueda, setBusqueda] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [respuesta, setRespuesta] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("med_employee")) {
      navigate({ to: "/login" });
    }
  }, [navigate]);

  const cargar = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/casos/panel");
      if (!res.ok) throw new Error("Error cargando panel.");
      const data = await res.json();
      setRows(data.casos as Row[]);
    } catch (e: any) {
      toast.error("Error cargando datos: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  /* KPIs */
  const kpis = useMemo(() => {
    const pendientes = rows.filter((r) => r.estado === "pendiente_clasificar").length;
    const enProceso = rows.filter((r) => r.estado === "clasificado").length;
    const resueltas = rows.filter((r) => r.estado === "respondido").length;
    const urgentes = rows.filter((r) => r.prioridad === "Urgente" && r.estado !== "respondido").length;
    const total = rows.length || 1;
    const pctResueltas = Math.round((resueltas / total) * 100);
    return { pendientes, enProceso, resueltas, urgentes, pctResueltas };
  }, [rows]);

  const proximosVencer = useMemo(
    () => rows.filter((r) => r.estado !== "respondido" && diasHasta(r.fecha_limite) <= 3).length,
    [rows],
  );

  /* Lista filtrada */
  const lista = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return rows.filter((r) => {
      if (filtro !== "todas" && r.estado !== filtro) return false;
      if (!q) return true;
      return (
        r.radicado.toLowerCase().includes(q) ||
        r.nombre.toLowerCase().includes(q) ||
        r.tipo.toLowerCase().includes(q) ||
        (r.nombre_dependencia_sugerida || r.secretaria || "").toLowerCase().includes(q)
      );
    });
  }, [rows, filtro, busqueda]);

  /* Acciones */
  const tomar = async (r: Row, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`http://localhost:5001/api/casos/${r.id}/confirmar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dependencia_id: 1, responsable: "empleado@medellin.gov.co" })
      });
      if (!res.ok) throw new Error("Error al asignar el caso.");
      
      setRows((prev) => prev.map((x) => x.id === r.id ? { ...x, estado: "clasificado" } : x));
      toast.success("Has tomado el caso " + r.radicado);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const eliminar = (r: Row, e: React.MouseEvent) => {
    e.stopPropagation();
    setRows((prev) => prev.filter((x) => x.id !== r.id));
    toast.success("Caso oculto de la vista localmente.");
  };

  const seedDemo = async () => {
    toast.error("Para seeding, usa la aplicación con la base de datos Supabase habilitada. La base en Aegis-Venus es local SQLite temporalmente o usa los scripts de testing del backend.");
  };


  const abrirResolver = (r: Row, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setOpenId(r.id);
    setRespuesta("");
  };

  const guardarCambios = async () => {
    if (!openId) return;
    if (respuesta.trim().length < 5) {
      toast.error("Escribe una respuesta antes de guardar.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5001/api/casos/${openId}/aval`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firmado_por: "Empleado", respuesta: respuesta.trim() })
      });
      if (!res.ok) throw new Error("Error resolviendo el caso.");
      toast.success("Caso resuelto correctamente.");
      setRows((prev) => prev.map((x) => x.id === openId ? { ...x, estado: "respondido" } : x));
      setOpenId(null); setRespuesta("");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("med_employee");
    navigate({ to: "/" });
  };

  const detalle = rows.find((r) => r.id === openId) ?? null;

  const ai = detalle
    ? {
        categoria: detalle.ai_categoria ?? "General",
        prioridad: detalle.prioridad,
        resumen: detalle.resumen_ia || detalle.ai_resumen || "Análisis no disponible",
        sugerencia: detalle.ai_sugerencia ?? "",
        motivo: "",
        fuente: "Aegis-Venus IA Integrada",
      }
    : null;

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-8 md:px-6">
      {/* Encabezado superior */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[color:var(--brand-green-deep)] md:text-4xl">
            Panel del servidor público
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona, prioriza y responde las PQRSDS de la ciudadanía.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 rounded-xl bg-[color:var(--brand-green-deep)] px-4 py-3 text-right shadow-[var(--shadow-soft)]">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-white/70">Procesos Cerrados</div>
              <div className="font-display text-2xl font-bold text-white leading-none">{kpis.resueltas}</div>
            </div>
            <span className="inline-block h-3 w-3 rounded-full bg-[color:var(--brand-yellow)]" />
          </div>
          <button onClick={logout} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-sm hover:bg-accent">
            <LogOut className="h-4 w-4" /> Salir
          </button>
        </div>
      </div>

      {/* Alerta de próximos a vencer */}
      {proximosVencer > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="mb-5 flex items-center gap-3 rounded-xl border border-[color:var(--brand-yellow)]/60 bg-[color:var(--brand-yellow)]/20 px-4 py-3 text-sm text-[color:var(--brand-green-deep)]"
        >
          <Bell className="h-4 w-4 shrink-0 text-[color:var(--brand-coral)]" />
          <span>
            <b>{proximosVencer} solicitud(es)</b> están a 3 días o menos de vencer. Atiéndelas con prioridad para no incumplir los plazos legales.
          </span>
        </motion.div>
      )}

      {/* KPIs */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Kpi label="Pendientes" value={kpis.pendientes} tone="sky" icon={<Clock className="h-4 w-4" />} />
        <Kpi label="En proceso" value={kpis.enProceso} tone="cream" icon={<TrendingUp className="h-4 w-4" />} />
        <Kpi label="Resueltas" value={kpis.resueltas} tone="green" icon={<CheckCircle2 className="h-4 w-4" />} />
        <Kpi label="Urgentes" value={kpis.urgentes} tone="coral" icon={<AlertTriangle className="h-4 w-4" />} />
        <Kpi label="% Resueltas" value={`${kpis.pctResueltas}%`} tone="yellow" icon={<Sparkles className="h-4 w-4" />} />
      </div>

      {/* Filtros + Búsqueda */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {(["todas", "pendiente_clasificar", "clasificado", "respondido"] as const).map((f) => {
            const active = filtro === f;
            return (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "bg-[color:var(--brand-green-deep)] text-white shadow-sm"
                    : "border border-[color:var(--brand-green-deep)]/20 bg-white text-[color:var(--brand-green-deep)] hover:bg-[color:var(--brand-cream)]"
                }`}
              >
                {f === "todas" ? "Todas" : estadoUI(f as Estado)}
              </button>
            );
          })}
        </div>
        <div className="relative flex items-center gap-2">
          <button
            onClick={seedDemo}
            className="hidden rounded-full border border-[color:var(--brand-green-deep)]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[color:var(--brand-green-deep)] hover:bg-[color:var(--brand-cream)] sm:inline-flex"
          >
            + PQRSDS de prueba
          </button>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por radicado, nombre, tipo..."
              className="w-full rounded-full border border-border bg-white py-2 pl-9 pr-4 text-sm focus:border-[color:var(--brand-green-deep)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-green-deep)]/15 sm:w-80"
            />
          </div>
        </div>
      </div>


      {/* LISTA */}
      {loading ? (
        <div className="flex items-center justify-center p-16 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Cargando…
        </div>
      ) : lista.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
          No hay solicitudes que coincidan con tu filtro.
        </div>
      ) : (
        <ul className="space-y-3">
          {lista.map((r) => (
            <RowItem
              key={r.id} r={r}
              onTomar={(e) => tomar(r, e)} onResolver={(e) => abrirResolver(r, e)}
              onAbrir={() => abrirResolver(r)}
              onEliminar={(e) => eliminar(r, e)}
            />
          ))}
        </ul>
      )}

      {/* Modal carta */}
      <AnimatePresence>
        {detalle && (
          <CartaModal
            row={detalle}
            ai={ai}
            respuesta={respuesta}
            setRespuesta={setRespuesta}
            saving={saving}
            onClose={() => { setOpenId(null); setRespuesta(""); }}
            onGuardar={guardarCambios}
            onLogout={logout}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------- Sub-componentes ---------- */

function Kpi({ label, value, tone, icon }: { label: string; value: number | string; tone: "sky" | "cream" | "green" | "coral" | "yellow"; icon: React.ReactNode }) {
  const tones = {
    sky: "bg-[color:var(--brand-sky)]/40 text-[color:var(--brand-green-deep)]",
    cream: "bg-[color:var(--brand-cream)] text-[color:var(--brand-green-deep)]",
    green: "bg-[color:var(--brand-green-deep)] text-white",
    coral: "bg-[color:var(--brand-coral)] text-white",
    yellow: "bg-[color:var(--brand-yellow)] text-[color:var(--brand-green-deep)]",
  }[tone];
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${tones}`}>{icon}</div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
      <div className="mt-3 font-display text-3xl font-bold text-[color:var(--brand-green-deep)] leading-none">{value}</div>
    </div>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone: "sky" | "cream" | "green" | "coral" | "yellow" | "muted" }) {
  const styles = {
    sky: "bg-[color:var(--brand-sky)]/60 text-[color:var(--brand-green-deep)]",
    cream: "bg-[color:var(--brand-cream)] text-[color:var(--brand-green-deep)] border border-[color:var(--brand-green-deep)]/15",
    green: "bg-[color:var(--brand-green)]/15 text-[color:var(--brand-green-deep)]",
    coral: "bg-[color:var(--brand-coral)]/15 text-[color:var(--brand-coral)]",
    yellow: "bg-[color:var(--brand-yellow)]/30 text-[color:var(--brand-green-deep)]",
    muted: "bg-muted text-muted-foreground",
  }[tone];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${styles}`}>{children}</span>;
}

function RowItem({
  r, onTomar, onResolver, onAbrir, onEliminar,
}: {
  r: Row;
  onTomar: (e: React.MouseEvent) => void;
  onResolver: (e: React.MouseEvent) => void;
  onAbrir: () => void;
  onEliminar: (e: React.MouseEvent) => void;
}) {
  const dias = diasHasta(r.fecha_limite);
  const estadoTone = r.estado === "pendiente_clasificar" ? "sky" : r.estado === "clasificado" ? "yellow" : "green";
  const prioTone = r.prioridad === "Urgente" ? "coral" : r.prioridad === "Alta" ? "yellow" : r.prioridad === "Baja" ? "muted" : "sky";

  const ai = (r.resumen_ia || r.ai_resumen)
    ? { resumen: r.resumen_ia || r.ai_resumen, sugerencia: r.ai_sugerencia ?? "" }
    : null;

  return (
    <li
      onClick={onAbrir}
      className="cursor-pointer rounded-2xl border border-border bg-white px-5 py-4 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[color:var(--brand-green-deep)]/30 hover:shadow-md"
    >
      <div className="flex flex-wrap items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-[color:var(--brand-green-deep)]">{r.radicado}</span>
            <Badge tone={prioTone}>{r.prioridad}</Badge>
            <Badge tone={estadoTone}>{estadoUI(r.estado)}</Badge>
            {r.estado !== "respondido" && dias <= 3 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--brand-coral)]/15 px-2 py-0.5 text-[10px] font-bold text-[color:var(--brand-coral)]">
                <Clock className="h-3 w-3" /> {dias <= 0 ? "Vencido" : `${dias}D`}
              </span>
            )}
          </div>

          <div className="mt-1.5 font-display text-base font-bold text-[color:var(--brand-green-deep)]">
            {r.titulo_ia || r.tipo} · {r.nombre_dependencia_sugerida || r.secretaria}
          </div>
          <div className="text-xs text-muted-foreground">{r.nombre}</div>

          {ai?.resumen && (
            <div className="mt-2 text-sm text-foreground/80">
              <span className="font-bold text-[color:var(--brand-coral)]">IA:</span>{" "}
              {ai.resumen}
            </div>
          )}

          {ai?.sugerencia && (
            <div className="mt-2 flex max-w-full items-start gap-2 rounded-lg border border-[color:var(--brand-coral)]/15 bg-[color:var(--brand-coral)]/8 px-3 py-2 text-xs text-foreground/80">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--brand-coral)]" />
              <span>
                <b className="text-[color:var(--brand-green-deep)]">Sugerencia:</b> {ai.sugerencia}
              </span>
            </div>
          )}
        </div>

        <div className="flex w-full shrink-0 flex-col items-stretch gap-2 sm:w-32">
          {r.estado === "pendiente_clasificar" && (
            <button onClick={onTomar} className="rounded-lg bg-[color:var(--brand-yellow)] px-5 py-1.5 text-xs font-bold text-[color:var(--brand-green-deep)] shadow-sm hover:opacity-90">
              Tomar
            </button>
          )}
          {r.estado !== "respondido" && (
            <button onClick={onResolver} className="rounded-lg bg-[color:var(--brand-coral)] px-5 py-1.5 text-xs font-bold text-white shadow-sm hover:opacity-90">
              Resolver
            </button>
          )}
          {r.estado === "respondido" && (
            <span className="inline-flex items-center justify-center gap-1 rounded-lg bg-[color:var(--brand-green-deep)] px-3 py-1.5 text-xs font-bold text-white">
              <CheckCircle2 className="h-3 w-3" /> Cerrado
            </span>
          )}
          <button onClick={onEliminar} className="rounded-lg border border-red-200 bg-red-50 px-5 py-1.5 text-xs font-bold text-red-600 shadow-sm hover:bg-red-100">
            Eliminar
          </button>
        </div>
      </div>
    </li>
  );
}

/* ---------- Modal estilo carta ---------- */

function CartaModal({
  row, ai, respuesta, setRespuesta, saving, onClose, onGuardar, onLogout,
}: {
  row: Row;
  ai: {categoria: string; prioridad: string; resumen: string; sugerencia: string; motivo: string; fuente: string} | null;
  respuesta: string;
  setRespuesta: (v: string) => void;
  saving: boolean;
  onClose: () => void;
  onGuardar: () => void;
  onLogout: () => void;
}) {
  const dias = diasHasta(row.fecha_limite);
  const codigoLargo = String(row.radicado).replace(/-/g, "").slice(0, 15);
  const codigoCorto = String(row.radicado).replace(/-/g, "").slice(0, 18).toUpperCase();
  const edad = calcularEdad(row.documento);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl overflow-hidden rounded-2xl bg-[color:var(--brand-cream)] shadow-[var(--shadow-elegant)]"
      >
        {/* TOP BAR (verde oscuro) */}
        <div className="flex items-center justify-between bg-[color:var(--brand-green-deep)] px-5 py-3">
          <img src={logo} alt="Medellín" className="h-8 w-auto brightness-0 invert" />
          <div className="flex items-center gap-3">
            <button onClick={onLogout} className="text-xs font-semibold text-white/85 hover:text-white">
              Cerrar sesión
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--brand-yellow)] font-display text-sm font-bold text-[color:var(--brand-green-deep)]">
              SP
            </div>
            <button onClick={onClose} className="ml-1 rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white" aria-label="Cerrar">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Cabecera radicado */}
        <div className="grid items-stretch gap-4 px-5 pt-5 sm:grid-cols-[1fr_auto]">
          <div className="rounded-2xl border-2 border-[color:var(--brand-green-deep)]/80 px-5 py-3">
            <div className="font-display text-2xl font-bold tracking-wider text-[color:var(--brand-green-deep)] md:text-3xl">
              {String(row.radicado || "").replace(/-/g, " ")}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-2xl border-2 border-[color:var(--brand-green-deep)]/80 px-5 py-3">
            <span className="font-display text-xl font-bold text-[color:var(--brand-green-deep)]">
              {dias <= 0 ? "Vencido" : `${dias} Días`}
            </span>
            <span className={`inline-block h-4 w-4 rounded-full ${dias <= 2 ? "bg-[color:var(--brand-coral)]" : dias <= 5 ? "bg-[color:var(--brand-yellow)]" : "bg-[color:var(--brand-green)]"}`} />
          </div>
        </div>

        {/* Cuerpo: dos columnas */}
        <div className="grid gap-5 p-5 lg:grid-cols-2">
          {/* CARTA gris izquierda */}
          <div className="relative overflow-hidden rounded-xl border border-[color:var(--brand-green-deep)]/20 bg-[#d9d9d9] p-5 text-sm shadow-inner">
            {/* sello + escudo */}
            <div className="mb-3 flex items-start justify-between gap-3">
              {/* Barcode */}
              <div className="rounded-md border-2 border-[color:var(--brand-green-deep)] bg-white p-2">
                <div className="flex h-12 items-end gap-[2px]">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <span key={i} className="block bg-black" style={{ width: 2, height: `${40 + ((i * 53) % 60)}%` }} />
                  ))}
                </div>
                <div className="mt-1 text-center font-mono text-[10px] tracking-wider text-black">{codigoLargo}</div>
              </div>
              {/* Escudo */}
              <div className="flex flex-col items-center">
                <div className="flex h-14 w-14 flex-col items-center justify-center rounded-full border-2 border-[color:var(--brand-green-deep)] bg-white">
                  <div className="text-[7px] font-bold leading-none text-[color:var(--brand-green-deep)]">ALCALDÍA</div>
                  <span className="mt-0.5 text-base text-[color:var(--brand-yellow)]">★</span>
                  <div className="text-[6px] leading-none text-[color:var(--brand-green-deep)]">de Medellín</div>
                </div>
                <div className="mt-1 font-mono text-[9px] font-bold text-black">Alcaldía de Medellín</div>
              </div>
            </div>

            <div className="mt-2 font-mono text-[11px] font-bold tracking-wider text-black">{codigoCorto}</div>

            <div className="mt-3 space-y-1 text-[12px] text-black">
              <div className="font-bold">Medellín, {fmtFechaLarga(row.created_at)}</div>
              <div className="mt-2 font-bold uppercase leading-tight">
                Señor<br />
                {String(row.nombre || "Ciudadano").toUpperCase()}<br />
                Peticionario<br />
                La Ciudad
              </div>
              <div className="mt-3 font-bold">ASUNTO: Respuesta a PQRS {row.radicado}</div>
              <div className="mt-3 font-bold">Respetado señor ciudadano:</div>
              <p className="mt-2 whitespace-pre-wrap text-[12px] font-semibold leading-relaxed">
                En atención a su petición, enviada vía PQRS a la alcaldía de Medellín, recibida el día {fmtFechaLarga(row.created_at)}, donde nos informa: "{row.descripcion}", me permito informarle lo siguiente:
              </p>
            </div>
          </div>

          {/* Formulario azul derecha */}
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-[color:var(--brand-sky)] bg-[color:var(--brand-sky)]/55 p-5">
              <div className="font-display text-lg font-bold text-[color:var(--brand-green-deep)]">
                Formulario del ciudadano.
              </div>

              <div className="mt-3 space-y-2 text-sm text-foreground/85">
                <p className="font-semibold">{row.tipo} · {row.nombre_dependencia_sugerida || row.secretaria}.</p>
                <p>
                  Creado el <b>{fmtFechaLarga(row.created_at)}</b>, por medio de Correo electrónico.
                </p>
                <p className="italic text-[color:var(--brand-green-deep)]">
                  &gt; Atendido por: Servidor Público.
                </p>
                <p className="pt-1">
                  <b>{row.nombre}</b>. {edad} años.
                </p>
                <p className="whitespace-pre-wrap leading-relaxed">{row.descripcion}</p>
              </div>
            </div>

            {/* IA Resumen */}
            <div className="rounded-xl border border-[color:var(--brand-green-deep)]/15 bg-white p-4 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[color:var(--brand-green-deep)] text-[color:var(--brand-yellow)]">
                  <Brain className="h-4 w-4" />
                </div>
                <div className="font-display text-sm font-bold text-[color:var(--brand-green-deep)]">Resumen IA</div>
                {ai && (
                  <Badge tone={ai.prioridad === "Urgente" ? "coral" : ai.prioridad === "Alta" ? "yellow" : "sky"}>
                    {ai.prioridad}
                  </Badge>
                )}
              </div>
              {ai ? (
                <div className="mt-2 space-y-2 text-xs text-foreground/80">
                  <p><b className="text-[color:var(--brand-green-deep)]">Categoría:</b> {ai.categoria}</p>
                  <p><b className="text-[color:var(--brand-green-deep)]">Resumen:</b> {ai.resumen}</p>
                  <p><b className="text-[color:var(--brand-green-deep)]">Sugerencia:</b> {ai.sugerencia}</p>
                </div>
              ) : (
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Analizando con IA…
                </div>
              )}
            </div>

            {/* Respuesta */}
            <div className="flex flex-col rounded-xl border border-[color:var(--brand-green-deep)]/15 bg-white p-4">
              <label className="text-xs font-semibold text-[color:var(--brand-green-deep)]">
                Tu respuesta como servidor público
              </label>
              <textarea
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                rows={5}
                placeholder="Escribe la respuesta, acciones realizadas y fundamentos legales…"
                className="mt-1 resize-none rounded-md border border-[color:var(--brand-green-deep)]/30 bg-[color:var(--brand-cream)]/40 p-3 text-sm focus:border-[color:var(--brand-green-deep)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-green-deep)]/20"
              />
              <div className="mt-3 flex justify-end">
                <button
                  onClick={onGuardar}
                  disabled={saving}
                  className="rounded-full bg-[color:var(--brand-sky)] px-6 py-2.5 text-sm font-bold text-[color:var(--brand-green-deep)] shadow-[var(--shadow-soft)] transition hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? "Guardando…" : "Guardar cambios"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
