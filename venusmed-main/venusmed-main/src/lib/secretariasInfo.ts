// Información detallada de cada secretaría (icono + descripción + enlace oficial)
import type { LucideIcon } from "lucide-react";
import {
  Heart, GraduationCap, Bus, Wallet, Landmark, Shield, UserCheck, Music,
  HandHeart, Sparkles, Leaf, HardHat, Users, Megaphone, TrendingUp, Package,
  ClipboardCheck, MessagesSquare, MapPin, Lock, Building2, HeartHandshake,
  Cpu, FileSpreadsheet, AlertTriangle, Trees, Trophy, TrainFront, Zap, Home,
  BookOpen, CloudRain, Tv, BookMarked, Theater, Stethoscope,
} from "lucide-react";

export type SecretariaInfo = {
  slug: string;
  nombre: string;
  descripcion: string;
  icon: LucideIcon;
  enlace: string;
};

export const SECRETARIAS_INFO: SecretariaInfo[] = [
  { slug: "salud", nombre: "Secretaría de Salud", icon: Heart, enlace: "https://www.medellin.gov.co/es/secretaria-salud/", descripcion: "Garantiza el acceso a servicios de salud pública, promueve la prevención y vigila la calidad de la atención médica en la ciudad." },
  { slug: "educacion", nombre: "Secretaría de Educación", icon: GraduationCap, enlace: "https://www.medellin.gov.co/es/secretaria-educacion/", descripcion: "Lidera la política educativa, gestiona instituciones públicas y promueve la calidad académica desde la primera infancia hasta la media." },
  { slug: "movilidad", nombre: "Secretaría de Movilidad", icon: Bus, enlace: "https://www.medellin.gov.co/movilidad/", descripcion: "Regula el tránsito, promueve la movilidad sostenible y vela por la seguridad vial de peatones, ciclistas y conductores." },
  { slug: "hacienda", nombre: "Secretaría de Hacienda", icon: Wallet, enlace: "https://www.medellin.gov.co/es/secretaria-hacienda/", descripcion: "Administra los recursos financieros del Distrito, recauda impuestos y gestiona el presupuesto público con transparencia." },
  { slug: "gobierno", nombre: "Secretaría de Gobierno", icon: Landmark, enlace: "https://www.medellin.gov.co/es/secretaria-gobierno/", descripcion: "Coordina la convivencia ciudadana, las relaciones políticas y la gestión territorial del Distrito de Medellín." },
  { slug: "seguridad", nombre: "Secretaría de Seguridad y Convivencia", icon: Shield, enlace: "https://www.medellin.gov.co/es/secretaria-seguridad/", descripcion: "Diseña estrategias de prevención del delito y promueve una cultura de paz, denuncia y convivencia ciudadana." },
  { slug: "mujeres", nombre: "Secretaría de las Mujeres", icon: UserCheck, enlace: "https://www.medellin.gov.co/es/secretaria-mujeres/", descripcion: "Impulsa la equidad de género, previene la violencia contra las mujeres y promueve sus derechos y oportunidades." },
  { slug: "cultura", nombre: "Secretaría de Cultura Ciudadana", icon: Music, enlace: "https://www.medellin.gov.co/es/secretaria-cultura/", descripcion: "Fomenta el arte, la lectura, el patrimonio y las prácticas culturales que construyen ciudadanía y memoria colectiva." },
  { slug: "inclusion-social", nombre: "Secretaría de Inclusión Social", icon: HandHeart, enlace: "https://www.medellin.gov.co/es/secretaria-inclusion/", descripcion: "Atiende a poblaciones vulnerables, habitantes de calle, adultos mayores y personas con discapacidad." },
  { slug: "juventud", nombre: "Secretaría de la Juventud", icon: Sparkles, enlace: "https://www.medellin.gov.co/es/secretaria-juventud/", descripcion: "Promueve el desarrollo integral de los jóvenes con programas de empleabilidad, cultura y participación." },
  { slug: "medio-ambiente", nombre: "Secretaría de Medio Ambiente", icon: Leaf, enlace: "https://www.medellin.gov.co/es/secretaria-medio-ambiente/", descripcion: "Protege los ecosistemas urbanos, gestiona la calidad del aire y lidera proyectos de sostenibilidad ambiental." },
  { slug: "infraestructura", nombre: "Secretaría de Infraestructura Física", icon: HardHat, enlace: "https://www.medellin.gov.co/es/secretaria-infraestructura/", descripcion: "Construye y mantiene la infraestructura vial, peatonal y de equipamientos públicos de la ciudad." },
  { slug: "gestion-humana", nombre: "Secretaría de Gestión Humana", icon: Users, enlace: "https://www.medellin.gov.co/es/secretaria-gestion-humana/", descripcion: "Administra el talento humano de la Alcaldía y vela por el bienestar y desarrollo de los servidores públicos." },
  { slug: "comunicaciones", nombre: "Secretaría de Comunicaciones", icon: Megaphone, enlace: "https://www.medellin.gov.co/es/secretaria-comunicaciones/", descripcion: "Gestiona la comunicación pública, la información oficial y la relación con medios de comunicación." },
  { slug: "desarrollo-economico", nombre: "Secretaría de Desarrollo Económico", icon: TrendingUp, enlace: "https://www.medellin.gov.co/es/secretaria-desarrollo-economico/", descripcion: "Impulsa el emprendimiento, el empleo y la competitividad empresarial en Medellín." },
  { slug: "suministros", nombre: "Secretaría de Suministros y Servicios", icon: Package, enlace: "https://www.medellin.gov.co/es/secretaria-suministros/", descripcion: "Gestiona la contratación pública y los suministros de bienes y servicios para la administración municipal." },
  { slug: "evaluacion-control", nombre: "Secretaría de Evaluación y Control", icon: ClipboardCheck, enlace: "https://www.medellin.gov.co/es/secretaria-evaluacion-control/", descripcion: "Audita la gestión pública y evalúa el desempeño de las dependencias para asegurar transparencia." },
  { slug: "participacion", nombre: "Secretaría de Participación Ciudadana", icon: MessagesSquare, enlace: "https://www.medellin.gov.co/es/secretaria-participacion/", descripcion: "Fortalece las organizaciones sociales, juntas de acción comunal y mecanismos de participación democrática." },
  { slug: "gestion-territorial", nombre: "Secretaría de Gestión y Control Territorial", icon: MapPin, enlace: "https://www.medellin.gov.co/es/secretaria-gestion-territorial/", descripcion: "Controla el uso del suelo, las construcciones y el ordenamiento territorial del Distrito." },
  { slug: "privada", nombre: "Secretaría Privada", icon: Lock, enlace: "https://www.medellin.gov.co/", descripcion: "Apoya la agenda y las relaciones institucionales del despacho del Alcalde de Medellín." },
  { slug: "general", nombre: "Secretaría General", icon: Building2, enlace: "https://www.medellin.gov.co/es/secretaria-general/", descripcion: "Coordina la gestión documental, jurídica y administrativa de toda la Alcaldía." },
  { slug: "no-violencia", nombre: "Secretaría de No Violencia", icon: HeartHandshake, enlace: "https://www.medellin.gov.co/", descripcion: "Lidera la construcción de paz, la reconciliación y la prevención de violencias en los barrios." },
  { slug: "innovacion-digital", nombre: "Secretaría de Innovación Digital", icon: Cpu, enlace: "https://www.medellin.gov.co/es/secretaria-innovacion/", descripcion: "Impulsa la transformación digital, la ciudad inteligente y la innovación pública con tecnología." },
  { slug: "planeacion", nombre: "Departamento Administrativo de Planeación", icon: FileSpreadsheet, enlace: "https://www.medellin.gov.co/es/departamento-planeacion/", descripcion: "Formula el Plan de Desarrollo, ordena el territorio y proyecta la Medellín del futuro." },
  { slug: "dagrd", nombre: "Departamento Administrativo de Gestión del Riesgo (DAGRD)", icon: AlertTriangle, enlace: "https://www.medellin.gov.co/es/dagrd/", descripcion: "Atiende emergencias, previene desastres y coordina la respuesta ante riesgos naturales o antrópicos." },
  { slug: "app-paisaje", nombre: "Agencia para la Gestión del Paisaje (APP)", icon: Trees, enlace: "https://www.medellin.gov.co/", descripcion: "Cuida el paisaje urbano, los árboles y los espacios públicos verdes de la ciudad." },
  { slug: "inder", nombre: "INDER Medellín", icon: Trophy, enlace: "https://www.inder.gov.co/", descripcion: "Promueve el deporte, la recreación y la actividad física en todos los barrios de Medellín." },
  { slug: "metro", nombre: "Metro de Medellín", icon: TrainFront, enlace: "https://www.metrodemedellin.gov.co/", descripcion: "Sistema integrado de transporte masivo con metro, metrocable, tranvía y buses sostenibles." },
  { slug: "epm", nombre: "EPM", icon: Zap, enlace: "https://www.epm.com.co/", descripcion: "Empresas Públicas de Medellín: energía, agua, saneamiento, gas y telecomunicaciones." },
  { slug: "isvimed", nombre: "ISVIMED", icon: Home, enlace: "https://www.isvimed.gov.co/", descripcion: "Instituto Social de Vivienda y Hábitat: soluciones habitacionales para familias vulnerables." },
  { slug: "sapiencia", nombre: "Sapiencia", icon: BookOpen, enlace: "https://www.sapiencia.gov.co/", descripcion: "Agencia de educación superior y becas para jóvenes de Medellín." },
  { slug: "siata", nombre: "SIATA", icon: CloudRain, enlace: "https://siata.gov.co/", descripcion: "Sistema de alertas tempranas que monitorea clima, ríos y calidad del aire 24/7." },
  { slug: "telemedellin", nombre: "Telemedellín", icon: Tv, enlace: "https://telemedellin.tv/", descripcion: "Canal público de televisión que cuenta las historias y la cultura de la ciudad." },
  { slug: "casa-memoria", nombre: "Museo Casa de la Memoria", icon: BookMarked, enlace: "https://www.museocasadelamemoria.gov.co/", descripcion: "Espacio para la memoria, la verdad y la dignificación de las víctimas del conflicto." },
  { slug: "plaza-mayor", nombre: "Plaza Mayor", icon: Theater, enlace: "https://www.plazamayor.com.co/", descripcion: "Centro de convenciones, eventos y exposiciones que dinamiza la economía cultural." },
  { slug: "hgm", nombre: "Hospital General de Medellín", icon: Stethoscope, enlace: "https://www.hgm.gov.co/", descripcion: "Hospital público de alta complejidad al servicio de los habitantes de la ciudad." },
];

export const findSecretariaBySlug = (slug: string) =>
  SECRETARIAS_INFO.find((s) => s.slug === slug);
