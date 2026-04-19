## Funcionalidades propuestas (fase futura)

Durante el desarrollo del MVP se definieron componentes adicionales que no se implementaron por tiempo, pero cuya arquitectura y viabilidad quedaron planteadas para una fase posterior.

---

## Integración con sistema actual (Mercurio)

Se propone la integración con la plataforma existente mediante una API RESTful:

- Crear un servicio intermediario que consuma los datos desde Mercurio
- Exponer endpoints para:
  - Obtener PQRSDs
  - Enviar actualizaciones
  - Consultar estados
- Conectar este servicio a Supabase para:
  - Persistencia estructurada
  - Trazabilidad
  - Analítica

### Flujo propuesto

Mercurio → API REST → Supabase → Plataforma de gestión

Esto permite modernizar sin reemplazar el sistema actual.

---

## Módulo de Inteligencia Artificial (IA)

Se plantean tres alternativas para implementar clasificación y resumen automático de PQRSDs:

---

### Opción 1: Uso de modelos locales con Ollama

**Descripción:**
Implementar modelos open-source ejecutados localmente usando Ollama.

**Ventajas:**
- Sin costos por uso (tokens)
- Control total de los datos (cumple mejor privacidad)
- Posibilidad de personalización

**Desventajas:**
- Requiere infraestructura (CPU/GPU)
- Menor precisión frente a modelos comerciales
- Necesidad de mantenimiento técnico

**Costo estimado:**
- Infraestructura: 0 - 200 USD/mes (dependiendo servidor)
- Desarrollo: medio

---

### Opción 2: Fine-tuning con Python (modelo personalizado)

**Descripción:**
Descargar un modelo (ej: LLaMA, Mistral o Gemma) y entrenarlo con datos de PQRSDs.

**Ventajas:**
- Alta personalización al dominio
- Mejor desempeño en clasificación específica
- Independencia de proveedores externos

**Desventajas:**
- Complejidad técnica alta
- Requiere dataset etiquetado
- Tiempo de entrenamiento

**Costo estimado:**
- Entrenamiento inicial: 50 - 300 USD (GPU cloud)
- Infraestructura mensual: 50 - 150 USD

---

### Opción 3: Uso de GPT (API comercial)

**Descripción:**
Integrar modelos como GPT mediante API para clasificación y resumen.

**Ejemplo de rol del modelo:**
Eres un asistente de la Alcaldía de Medellín.
Tu tarea es:

Clasificar la PQRSD según la dependencia correspondiente
Generar un resumen claro en máximo 3 líneas
Identificar la solicitud principal del ciudadano

**Ventajas:**
- Alta precisión
- Implementación rápida
- No requiere infraestructura propia

**Desventajas:**
- Costo por uso (tokens)
- Dependencia de proveedor externo
- Consideraciones de privacidad

**Costo estimado:**
- Bajo volumen: 20 - 50 USD/mes
- Medio volumen: 100 - 300 USD/mes
- Alto volumen: 500+ USD/mes

---

### Alternativa: Modelo Gemma personalizado

**Descripción:**
Uso de modelos como Gemma (Google) ajustados al contexto.

**Ventajas:**
- Balance entre costo y rendimiento
- Open source
- Buen rendimiento en tareas NLP

**Desventajas:**
- Requiere ajuste técnico
- Menor precisión que GPT en algunos casos

---

## Comparativa general

| Opción        | Costo       | Precisión | Complejidad | Escalabilidad |
|--------------|------------|----------|------------|--------------|
| Ollama       | Bajo       | Media    | Media      | Alta         |
| Fine-tuning  | Medio      | Alta     | Alta       | Alta         |
| GPT API      | Variable   | Muy alta | Baja       | Muy alta     |
| Gemma        | Bajo-Medio | Media    | Media      | Alta         |

---

## Estimación de costos del sistema completo

### Desarrollo

- Diseño UI/UX (Figma): 100 - 300 USD
- Frontend: 300 - 800 USD
- Backend: 400 - 1000 USD
- Integración IA: 200 - 600 USD

**Total desarrollo estimado: 1000 - 2700 USD**

---

### Infraestructura mensual

- Supabase: 0 - 25 USD
- Backend (hosting): 10 - 50 USD
- IA:
  - Ollama: 0 - 200 USD
  - GPT: 20 - 300 USD

**Total mensual estimado: 30 - 400 USD**

---

## Conclusión técnica

La solución es escalable y adaptable a diferentes presupuestos:

- Bajo presupuesto: Ollama + Supabase
- Balance: Gemma + backend propio
- Alto rendimiento: GPT + arquitectura serverless

La arquitectura permite evolucionar sin necesidad de rehacer el sistema.
