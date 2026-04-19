import { motion } from "framer-motion";
import { Bot, Check, Mail, FileSearch, ShieldCheck, ClipboardList, Sparkles } from "lucide-react";

type Step = {
  key: string;
  title: string;
  Icon: typeof Bot;
};

const STEPS: Step[] = [
  { key: "recopilar", title: "Agente IA recopilando datos del radicado", Icon: FileSearch },
  { key: "validar", title: "Validando información de la solicitud", Icon: ShieldCheck },
  { key: "formulario", title: "Llenando formulario PQRSDS", Icon: ClipboardList },
  { key: "resumen", title: "Generando radicado con resumen IA", Icon: Sparkles },
  { key: "enviar", title: "Enviando radicado al ciudadano", Icon: Mail },
];

const COMPLETED_COUNT = 4; // 4 completados, el 5° en proceso → 80%
const PROGRESS = 80;

export function WorkflowAnimation() {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-16 pt-4 md:px-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 text-secondary">
          <Bot className="h-6 w-6" />
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-wider md:text-3xl">
            Agente IA procesando radicado
          </h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Llenando formulario y enviando el radicado automáticamente…
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-border bg-card/95 p-6 shadow-[var(--shadow-elegant)] backdrop-blur-sm md:p-8">
        <ol className="relative space-y-5">
          {STEPS.map((step, i) => {
            const isDone = i < COMPLETED_COUNT;
            const isActive = i === COMPLETED_COUNT;
            return (
              <StepRow
                key={step.key}
                step={step}
                index={i}
                isDone={isDone}
                isActive={isActive}
                isLast={i === STEPS.length - 1}
              />
            );
          })}
        </ol>
      </div>

      {/* Progress bar */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-foreground">Progreso general</span>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.5 }}
            className="font-bold text-secondary"
          >
            {PROGRESS}%
          </motion.span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: "0%" }}
            whileInView={{ width: `${PROGRESS}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-secondary"
          />
        </div>
      </div>
    </section>
  );
}

function StepRow({
  step,
  index,
  isDone,
  isActive,
  isLast,
}: {
  step: Step;
  index: number;
  isDone: boolean;
  isActive: boolean;
  isLast: boolean;
}) {
  const { Icon, title } = step;
  return (
    <motion.li
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.4, delay: index * 0.25 }}
      className="relative flex items-start gap-4"
    >
      {/* Icon box */}
      <div className="relative">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-lg ring-1 ${
            isDone
              ? "bg-primary/15 text-primary ring-primary/40"
              : isActive
                ? "bg-secondary/15 text-secondary ring-secondary/50"
                : "bg-muted text-muted-foreground ring-border"
          }`}
        >
          {isDone ? (
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.25 + 0.2, type: "spring", stiffness: 300, damping: 15 }}
            >
              <Check className="h-5 w-5" strokeWidth={3} />
            </motion.div>
          ) : (
            <Icon className="h-5 w-5" />
          )}
          {isActive && (
            <motion.span
              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-lg ring-2 ring-secondary"
            />
          )}
        </div>

        {/* Connector line */}
        {!isLast && (
          <div
            className={`absolute left-1/2 top-11 h-[calc(100%+1.25rem)] w-px -translate-x-1/2 ${
              isDone ? "bg-primary/40" : "bg-border"
            }`}
          />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 pt-1">
        <div
          className={`font-display text-sm font-bold md:text-base ${
            isDone || isActive ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {title}
        </div>
        <div className="mt-0.5 text-xs">
          {isDone ? (
            <span className="font-semibold text-primary">Completado ✓</span>
          ) : isActive ? (
            <span className="inline-flex items-center gap-1.5 font-semibold text-secondary">
              <DotsLoader /> Procesando…
            </span>
          ) : (
            <span className="text-muted-foreground/70">En cola</span>
          )}
        </div>
      </div>
    </motion.li>
  );
}

function DotsLoader() {
  return (
    <span className="inline-flex gap-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          className="inline-block h-1 w-1 rounded-full bg-secondary"
        />
      ))}
    </span>
  );
}
