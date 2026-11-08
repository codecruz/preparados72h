# Preparados72h: preparacionismo y supervivencia

Basado en el informe `hackeos_supermercados_preparacion_72h.pdf` (5 nov 2026): ciberataques a la refrigeración de supermercados europeos y recomendaciones oficiales para preparar la mochila de 72 horas.

## Funcionalidades
Pensado para preparacionistas y survivalistas. Cada sección es una vista propia (`#calculadora`, `#material`, `#habilidades`…) con navegación agrupada (Reservas, Equipo, Saber, Emergencias) y barra inferior en el móvil; el inicio es un panel con tu estado de preparación.

- **Material por niveles**: equipo para ir guardando, de lo básico (72 h–1 semana) a la autonomía prolongada (más de 1 mes), con vida útil y uso seguro de cada cosa.
- **Código Morse**: tabla, traductor de texto a Morse y de Morse a texto, y emisión (SOS incluido) con la pantalla, el sonido o la vibración del móvil; sin conexión.
- **Habilidades**: regla de los 3, primeros auxilios y RCP (ERC 2021), fuego, refugio, nudos, orientación sin GPS, señales de socorro y agua en el campo, con ilustraciones que funcionan sin conexión (nudos de Wikimedia Commons con licencia libre; el resto, SVG propias en `assets/figuras.js`).
- **Calculadora de reservas** con cifras de fuentes oficiales: agua desglosada (bebida, cocina, higiene mínima), cinco tramos de edad, perros por tamaño, clima caluroso, opción «sin hornillo ni fuego», alergias, intolerancias y dietas, y los kilos reales de lo que hay que comprar.
- **Menú de ejemplo** de 3, 7 o 10 días generado con la reserva: sin cocinar las primeras 72 h (o todo el periodo) y adaptado a todas las necesidades marcadas.
- **Inventario y caducidades**: lo que ya tienes, cuánto te falta respecto a la calculadora y qué caduca pronto. Exportar e importar copia.
- **Guías por emergencia**: apagón, sin luz ni fuego, corte de agua, ola de calor, ola de frío, inundación, evacuación y ciberataque.
- **Agua potable**: cómo guardarla y potabilizarla, con calculadora de gotas de lejía.
- **Mapas sin conexión**: cómo descargar mapas y «Mis puntos», que guarda tus puntos de encuentro y calcula distancia y dirección con el GPS, sin datos.
- **Checklist de la mochila de 72 h**, bolsa para volver a casa y **recordatorio de revisión** cada 6 meses.
- **Plan familiar** imprimible, **consejos**, lecciones de la comunidad y **mapa del mundo con las recomendaciones oficiales por país** (cifra, fuente y botón para llevarla a la calculadora; vista ampliada de Europa).
- **De dónde salen los números**: la fuente de cada cifra.
- **Modo apagón**: negro puro y sin animaciones para ahorrar batería (pantallas OLED), con accesos rápidos.
- **Últimas noticias**, actualizadas cada 6 horas con GitHub Actions (ver abajo).
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
    ├── data.js         # contenido (alerta, checklist, guías, agua, mapas, fuentes de las cifras…)
    ├── calc.js         # cálculos puros con tests: reservas, menú, lejía, distancias, Morse
    ├── news.js         # noticias (generado cada 6 horas)
    ├── figuras.js      # ilustraciones de las habilidades (SVG)
    ├── img/            # imágenes de nudos (Wikimedia Commons, créditos en Fuentes)
    ├── world.js        # contornos del mapa del mundo (generado con scripts/build-world.mjs, Natural Earth 1:110m)
    ├── app.js          # interfaz
    ├── styles.css
    └── icon.svg
```

## Noticias automáticas
`scripts/update-news.mjs` (Node 18+, sin dependencias) lee los feeds RSS de `scripts/feeds.json` (búsquedas de Google Noticias, El País, 20minutos, El Financiero, BBC) y hace lo siguiente:
1. Se queda con las noticias de los últimos 14 días que contienen una palabra clave fuerte (ciberataque, apagón, protección civil, kit de emergencia, cadena de frío…) y descarta el ruido habitual (deporte, cripto…).
2. Agrupa los titulares casi iguales y limita a 2 noticias nuevas por medio y 4 por tema, con un máximo de 12 nuevas al día.
3. Las fusiona con las que ya había (histórico de 30 días, máximo 40) y escribe `portal/assets/news.js`.

`.github/workflows/update-news.yml` lo ejecuta cada 6 horas (00, 06, 12 y 18 UTC) y hace commit si hay cambios; GitHub puede retrasar las ejecuciones programadas. También se puede lanzar a mano desde la pestaña Actions.

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
