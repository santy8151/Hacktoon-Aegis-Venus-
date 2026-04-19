import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Bell, CheckCircle2, Clock, LogOut, Sparkles, TrendingUp, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard empleado — Medellín PQRSDS" },
      { name: "description", content: "Panel de gestión de PQRSDS con métricas, alertas de vencimiento y sugerencias de IA." },
    ],
  }),
  component: DashboardPage,
});

type Row = {
  id: string;
  radicado: string;
  nombre: string;
  tipo: string;
  secretaria: string;
  estado: "Pendiente" | "En proceso" | "Resuelto";
  prioridad: "Baja" | "Media" | "Alta" | "Urgente";
  ai_categoria: string | null;
  ai_resumen: string | null;
  ai_sugerencia: string | null;
  fecha_limite: string;
  created_at: string;
};

function diasHasta(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
}

function DashboardPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"todas" | "Pendiente" | "En proceso" | "Resuelto">("todas");

  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("med_employee")) {
      navigate({ to: "/login" });
    }
  }, [navigate]);

  const cargar = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pqrsds")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    setLoading(false);
    if (error) toast.error("Error cargando datos: " + error.message);
    else setRows((data ?? []) as Row[]);
  };

  useEffect(() => { cargar(); }, []);

  const stats = useMemo(() => {
    const pen = rows.filter((r) => r.estado === "Pendiente").length;
    const proc = rows.filter((r) => r.estado === "En proceso").length;
    const res = rows.filter((r) => r.estado === "Resuelto").length;
    const urgentes = rows.filter((r) => r.prioridad === "Urgente").length;
    const venciendo = rows.filter((r) => r.estado !== "Resuelto" && diasHasta(r.fecha_limite) <= 3).length;
    const total = rows.length || 1;
    return { pen, proc, res, urgentes, venciendo, pctRes: Math.round((res / total) * 100) };
  }, [rows]);

  const visibles = filter === "todas" ? rows : rows.filter((r) => r.estado === filter);

  const cambiarEstado = async (id: string, nuevo: Row["estado"]) => {
    const { error } = await supabase.from("pqrsds").update({ estado: nuevo }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Estado → ${nuevo}`);
    cargar();
  };

  const logout = () => {
    sessionStorage.removeItem("med_employee");
    navigate({ to: "/" });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-secondary">Panel del empleado</div>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Gestión de PQRSDS</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Recibirás notificaciones automáticas cuando el tiempo de respuesta esté por finalizar.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={cargar} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm hover:bg-accent">
            <RefreshCw className="h-4 w-4" /> Actualizar
          </button>
          <button onClick={logout} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm hover:bg-accent">
            <LogOut className="h-4 w-4" /> Salir
          </button>
        </div>
      </div>

      {stats.venciendo > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm">
          <Bell className="mt-0.5 h-5 w-5 text-warning-foreground" />
          <div>
            <strong>{stats.venciendo} solicitud(es)</strong> están a 3 días o menos de vencer.
            Atiéndelas con prioridad para no incumplir los plazos legales.
          </div>
        </motion.div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <Kpi Icon={Clock} color="info" label="Pendientes" value={stats.pen} />
        <Kpi Icon={TrendingUp} color="warning" label="En proceso" value={stats.proc} />
        <Kpi Icon={CheckCircle2} color="success" label="Resueltas" value={stats.res} />
        <Kpi Icon={AlertTriangle} color="destructive" label="Urgentes" value={stats.urgentes} />
        <Kpi Icon={Sparkles} color="secondary" label="% Resueltas" value={`${stats.pctRes}%`} />
      </div>

      {/* Filtros */}
      <div className="mt-8 mb-3 flex flex-wrap items-center gap-2">
        {(["todas", "Pendiente", "En proceso", "Resuelto"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              filter === f ? "bg-primary text-primary-foreground" : "border border-border hover:bg-accent"
            }`}
          >
            {f === "todas" ? "Todas" : f}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Cargando…
          </div>
        ) : visibles.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No hay solicitudes. Radica una desde <a href="/pqrsds" className="font-semibold text-primary underline">/pqrsds</a> para verla aquí.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {visibles.map((r) => {
              const dias = diasHasta(r.fecha_limite);
              const venciendo = r.estado !== "Resuelto" && dias <= 3;
              return (
                <li key={r.id} className="p-4 md:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-primary">{r.radicado}</span>
                        <Badge color={
                          r.prioridad === "Urgente" ? "destructive" :
                          r.prioridad === "Alta" ? "warning" : r.prioridad === "Media" ? "info" : "muted"
                        }>{r.prioridad}</Badge>
                        <Badge color={
                          r.estado === "Resuelto" ? "success" : r.estado === "En proceso" ? "warning" : "info"
                        }>{r.estado}</Badge>
                        {venciendo && <Badge color="destructive">⏰ {dias <= 0 ? "Vencido" : `${dias}d`}</Badge>}
                      </div>
                      <div className="mt-1 font-display text-base font-semibold">{r.tipo} · {r.secretaria}</div>
                      <div className="text-sm text-muted-foreground">{r.nombre}</div>
                      {r.ai_resumen && (
                        <p className="mt-2 line-clamp-2 text-sm text-foreground/80"><strong className="text-secondary">IA:</strong> {r.ai_resumen}</p>
                      )}
                      {r.ai_sugerencia && (
                        <p className="mt-1 rounded-md bg-secondary/10 p-2 text-xs text-foreground/80">
                          <Sparkles className="mr-1 inline h-3 w-3 text-secondary" />
                          <strong>Sugerencia:</strong> {r.ai_sugerencia}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {r.estado !== "En proceso" && r.estado !== "Resuelto" && (
                        <button onClick={() => cambiarEstado(r.id, "En proceso")}
                          className="rounded-md bg-warning px-3 py-1.5 text-xs font-semibold text-warning-foreground hover:opacity-90">
                          Tomar
                        </button>
                      )}
                      {r.estado !== "Resuelto" && (
                        <button onClick={() => cambiarEstado(r.id, "Resuelto")}
                          className="rounded-md bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground hover:opacity-90">
                          Resolver
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

function Kpi({ Icon, label, value, color }: { Icon: any; label: string; value: number | string; color: string }) {
  const colorMap: Record<string, string> = {
    info: "bg-info/15 text-info",
    warning: "bg-warning/20 text-warning-foreground",
    success: "bg-success/15 text-success",
    destructive: "bg-destructive/15 text-destructive",
    secondary: "bg-secondary/15 text-secondary",
  };
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-[var(--gradient-card)] p-4 shadow-[var(--shadow-soft)]">
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ${colorMap[color]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="font-display text-2xl font-bold leading-none">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </motion.div>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  const map: Record<string, string> = {
    info: "bg-info/15 text-info",
    warning: "bg-warning/20 text-warning-foreground",
    success: "bg-success/15 text-success",
    destructive: "bg-destructive/15 text-destructive",
    muted: "bg-muted text-muted-foreground",
  };
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${map[color]}`}>{children}</span>;
}
