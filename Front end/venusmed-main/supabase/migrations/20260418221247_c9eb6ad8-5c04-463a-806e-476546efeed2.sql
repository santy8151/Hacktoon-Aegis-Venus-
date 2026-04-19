
-- Tabla de PQRSDS (sin auth, datos públicos para demo de hackathon)
CREATE TABLE public.pqrsds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  radicado TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  documento TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('Petición','Queja','Reclamo','Sugerencia','Denuncia','Solicitud')),
  secretaria TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente','En proceso','Resuelto')),
  prioridad TEXT NOT NULL DEFAULT 'Media' CHECK (prioridad IN ('Baja','Media','Alta','Urgente')),
  ai_categoria TEXT,
  ai_resumen TEXT,
  ai_sugerencia TEXT,
  fecha_limite TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '15 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pqrsds ENABLE ROW LEVEL SECURITY;

-- Demo: lectura/escritura pública (es una plataforma ciudadana sin auth real en v1)
CREATE POLICY "Lectura pública de PQRSDS" ON public.pqrsds FOR SELECT USING (true);
CREATE POLICY "Cualquier ciudadano puede radicar" ON public.pqrsds FOR INSERT WITH CHECK (true);
CREATE POLICY "Empleados (mock) pueden actualizar" ON public.pqrsds FOR UPDATE USING (true);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_pqrsds_updated_at
BEFORE UPDATE ON public.pqrsds
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_pqrsds_radicado ON public.pqrsds(radicado);
CREATE INDEX idx_pqrsds_estado ON public.pqrsds(estado);
