# Frontend

Capa de presentación: componentes React, layout, i18n y assets de UI.

```
frontend/
├── components/   Componentes compartidos de la app (Header, Footer, etc.)
└── i18n/         Proveedor y diccionario de idiomas
```

Las páginas viven en `src/routes/` (lo exige TanStack Start) pero su contenido
debe importar lógica desde `@/backend/*` y UI desde `@/frontend/*`.
