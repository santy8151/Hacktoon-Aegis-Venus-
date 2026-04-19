import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, User } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Acceso empleados — Medellín PQRSDS" },
      { name: "description", content: "Portal de empleados para gestión de PQRSDS." },
    ],
  }),
  component: LoginPage,
});

// Mock de credenciales para demo de hackathon
const MOCK_USER = "admin";
const MOCK_PASS = "medellin2025";

function LoginPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === MOCK_USER && pass === MOCK_PASS) {
      sessionStorage.setItem("med_employee", "1");
      toast.success("Bienvenido, empleado");
      navigate({ to: "/dashboard" });
    } else {
      toast.error("Credenciales inválidas");
    }
  };

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12 md:px-6">
      <div className="w-full rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-elegant)]">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--gradient-brand)] text-primary-foreground">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold">Acceso empleados</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Demo: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">admin / medellin2025</code>
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Usuario</span>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="usuario"
              />
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Contraseña</span>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:bg-primary/90"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </section>
  );
}
