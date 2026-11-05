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
- **Últimas noticias**, actualizadas a diario con GitHub Actions (ver abajo).
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

## Noticias automáticas
`scripts/update-news.mjs` (Node 18+, sin dependencias) lee los feeds RSS de `scripts/feeds.json` (búsquedas de Google Noticias, El País, 20minutos, El Financiero, BBC) y hace lo siguiente:
1. Se queda con las noticias de los últimos 14 días que contienen una palabra clave fuerte (ciberataque, apagón, protección civil, kit de emergencia, cadena de frío…) y descarta el ruido habitual (deporte, cripto…).
2. Agrupa los titulares casi iguales y limita a 2 noticias nuevas por medio y 4 por tema, con un máximo de 12 nuevas al día.
3. Las fusiona con las que ya había (histórico de 30 días, máximo 40) y escribe `portal/assets/news.js`.

`.github/workflows/update-news.yml` lo ejecuta cada día a las 06:00 UTC y hace commit si hay cambios. También se puede lanzar a mano desde la pestaña Actions.

```bash
node scripts/update-news.mjs --dry-run   # muestra el resultado sin escribir el archivo
```

Las recomendaciones de seguridad (`assets/data.js`) **no** se tocan automáticamente: solo cambian si alguien las edita.

## Siguientes pasos (fuera del MVP)
- CMS o Markdown para publicar artículos y alertas nuevas.
- Notificaciones push para el recordatorio de revisión y avisos oficiales.
- Inventario con fechas de caducidad y rotación (FIFO).
- Mapa de puntos de encuentro y recursos locales.
- Guías de bushcraft: fuego, potabilizar agua, refugio, nudos.
- Versiones en otros idiomas y adaptadas a cada país.
