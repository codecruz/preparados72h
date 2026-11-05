# Preparados72h: MVP de portal de supervivencia y preparación familiar

Basado en el informe `hackeos_supermercados_preparacion_72h.pdf` (5 nov 2026): ciberataques a la refrigeración de supermercados europeos y recomendaciones oficiales para preparar la mochila de 72 horas.

## Funcionalidades del MVP
- **Alerta de actualidad**: resumen y datos clave del incidente.
- **Calculadora de reservas**: agua (3 L/persona/día), calorías, raciones, pilas, pañales, mascotas y medicación para 72 h, 1 semana o 10 días.
- **Checklist interactiva de la mochila de 72 h**, con barra de progreso, artículos opcionales para una semana e impresión.
- **Recordatorio de revisión** cada 6 meses.
- **Plan familiar**: puntos de encuentro, contactos y qué hacer sin teléfono. Se guarda automáticamente y se puede imprimir.
- **Consejos prácticos** y guía para cortes de luz.
- **Recomendaciones por país** (de 72 h a 10 días), enlazadas con la calculadora.
- **PWA offline**: tras la primera visita funciona sin conexión. Los datos se quedan en `localStorage`.

Sin dependencias ni paso de compilación: HTML, CSS y JS puros.

## Ejecutar
```bash
cd portal && python3 -m http.server 8080
# abre http://localhost:8080
```
(Abrir `index.html` directamente también funciona, pero sin modo offline.)

## Estructura
```
portal/
├── index.html
├── manifest.webmanifest
├── sw.js               # caché offline
└── assets/
    ├── data.js         # contenido (alerta, checklist, países, consejos, fuentes)
    ├── app.js          # lógica
    ├── styles.css
    └── icon.svg
```

## Siguientes pasos (fuera del MVP)
- CMS o Markdown para publicar artículos y alertas nuevas.
- Notificaciones push para el recordatorio de revisión y avisos oficiales.
- Inventario con fechas de caducidad y rotación (FIFO).
- Mapa de puntos de encuentro y recursos locales.
- Guías de bushcraft: fuego, potabilizar agua, refugio, nudos.
- Versiones en otros idiomas y adaptadas a cada país.
