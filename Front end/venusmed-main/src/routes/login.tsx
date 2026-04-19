import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import parrotIcon from "@/assets/loro.jpeg";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Acceso servidores públicos — Medellín PQRSDS" },
      { name: "description", content: "Portal de servidores públicos para gestión de PQRSDS." },
    ],
  }),
  component: LoginPage,
});

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
      toast.success("Bienvenido, servidor público");
      navigate({ to: "/dashboard" });
    } else {
      toast.error("Credenciales inválidas");
    }
  };

  return (
    <section className="relative -mx-4 flex min-h-[80vh] items-center justify-center overflow-hidden bg-[#F5F1E5] px-4 py-16 md:-mx-6 md:px-6">
      {/* Decorative large organic flower on bottom right */}
      <svg
        className="pointer-events-none absolute -bottom-[15%] -right-[15%] h-[800px] w-[800px] text-[#E0DBC4] opacity-80 md:-right-[5%] md:h-[1000px] md:w-[1000px]"
        viewBox="0 0 200 200"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M100 20 C120 0, 160 20, 150 50 C180 40, 200 80, 170 100 C200 120, 180 160, 150 150 C160 180, 120 200, 100 180 C80 200, 40 180, 50 150 C20 160, 0 120, 30 100 C0 80, 20 40, 50 50 C40 20, 80 0, 100 20 Z" />
      </svg>

      <div className="relative z-10 w-full max-w-[420px] rounded-[18px] bg-[#DAFAAB] p-10 pt-12 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1)] md:p-12 md:pt-14">
        {/* Circle with parrot */}
        <div className="mb-10 flex justify-center">
          <div className="relative flex h-[130px] w-[130px] items-center justify-center overflow-hidden rounded-full border border-[#253D35]/80 bg-[#F5F1E5]">
            <img
              src={parrotIcon}
              alt="Mascota del sistema Aegis-Venus"
              loading="lazy"
              className="h-full w-full object-contain p-2 mix-blend-multiply"
            />
          </div>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label htmlFor="usuario" className="mb-2 block font-display text-[19px] font-bold tracking-tight text-[#253D35]">
              Usuario
            </label>
            <input
              id="usuario"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full rounded-md border-[1.5px] border-[#253D35]/20 bg-[#F5F1E5] px-4 py-2.5 text-sm font-medium text-[#253D35] shadow-[0_2px_4px_rgba(0,0,0,0.05)] outline-none transition placeholder:text-[#253D35]/50 focus:border-[#253D35]/50 focus:ring-1 focus:ring-[#253D35]/30"
              placeholder="Usuario"
            />
          </div>
          <div>
            <label htmlFor="contrasena" className="mb-2 block font-display text-[19px] font-bold tracking-tight text-[#253D35]">
              Contraseña
            </label>
            <input
              id="contrasena"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full rounded-md border-[1.5px] border-[#253D35]/20 bg-[#F5F1E5] px-4 py-2.5 text-sm font-medium text-[#253D35] shadow-[0_2px_4px_rgba(0,0,0,0.05)] outline-none transition placeholder:text-[#253D35]/50 focus:border-[#253D35]/50 focus:ring-1 focus:ring-[#253D35]/30"
              placeholder="Contraseña"
            />
          </div>
          <div className="flex justify-center pt-6 pb-2">
            <button
              type="submit"
              className="rounded-full bg-[#253D35] px-12 py-2.5 font-display text-[15px] font-medium tracking-wide text-white shadow-[0_4px_10px_rgba(37,61,53,0.3)] transition hover:-translate-y-0.5 hover:bg-[#1a2b25] hover:shadow-[0_6px_14px_rgba(37,61,53,0.4)]"
            >
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

