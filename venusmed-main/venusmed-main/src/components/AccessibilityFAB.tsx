import { useEffect, useState } from "react";
import { Accessibility, Volume2, Type, Contrast, X } from "lucide-react";

type FontSize = "normal" | "large" | "xlarge";

export function AccessibilityFAB() {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<FontSize>("normal");
  const [contrast, setContrast] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("a11y-large", "a11y-xlarge");
    if (size === "large") html.classList.add("a11y-large");
    if (size === "xlarge") html.classList.add("a11y-xlarge");
    html.classList.toggle("a11y-contrast", contrast);
  }, [size, contrast]);

  const speak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Tu navegador no soporta lectura por voz.");
      return;
    }
    const text = document.querySelector("main")?.innerText?.slice(0, 600) ?? document.body.innerText.slice(0, 600);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-CO";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-64 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-elegant)] animate-float-up">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-display text-sm font-semibold">Accesibilidad</span>
            <button onClick={() => setOpen(false)} aria-label="Cerrar">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <div className="space-y-2">
            <button
              onClick={() =>
                setSize((s) => (s === "normal" ? "large" : s === "large" ? "xlarge" : "normal"))
              }
              className="flex w-full items-center justify-between rounded-md border border-border px-3 py-2 text-sm hover:bg-accent"
            >
              <span className="flex items-center gap-2"><Type className="h-4 w-4" /> Tamaño texto</span>
              <span className="text-xs font-semibold uppercase text-primary">{size}</span>
            </button>
            <button
              onClick={() => setContrast((c) => !c)}
              className="flex w-full items-center justify-between rounded-md border border-border px-3 py-2 text-sm hover:bg-accent"
            >
              <span className="flex items-center gap-2"><Contrast className="h-4 w-4" /> Alto contraste</span>
              <span className="text-xs font-semibold uppercase text-primary">{contrast ? "ON" : "OFF"}</span>
            </button>
            <button
              onClick={speak}
              className="flex w-full items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-accent"
            >
              <Volume2 className="h-4 w-4" /> Leer en voz alta
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Opciones de accesibilidad"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-[var(--shadow-elegant)] animate-pulse-ring transition-transform hover:scale-105"
      >
        <Accessibility className="h-6 w-6" />
      </button>
    </div>
  );
}
