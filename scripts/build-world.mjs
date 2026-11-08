// Genera portal/assets/world.js: contornos de países ya proyectados (Natural Earth I)
// para dibujar el mapa del mundo sin conexión ni librerías.
//
// Uso: node scripts/build-world.mjs ruta/countries-110m.json
// Datos: world-atlas@2.0.2 (Natural Earth 1:110m, dominio público).
import { readFileSync, writeFileSync } from "node:fs";

const src = process.argv[2];
if (!src) { console.error("Uso: node scripts/build-world.mjs countries-110m.json"); process.exit(1); }
const topo = JSON.parse(readFileSync(src, "utf8"));

const W = 1000;
const S = W / (2 * Math.PI * 0.8707); // escala para que el ancho total sea W
// Proyección Natural Earth I (Šavrič et al.), misma fórmula que usa app.js para los marcadores.
const proj = (lon, lat) => {
  const l = (lon * Math.PI) / 180, p = (lat * Math.PI) / 180, p2 = p * p, p4 = p2 * p2;
  const x = l * (0.8707 - 0.131979 * p2 + p4 * (-0.013791 + p4 * (0.003971 * p2 - 0.001529 * p4)));
  const y = p * (1.007226 + p2 * (0.015085 + p4 * (-0.044475 + 0.028874 * p2 - 0.005916 * p4)));
  return [W / 2 + x * S, -y * S];
};

// Decodifica los arcos cuantizados (delta) de TopoJSON a lon/lat.
const [sx, sy] = topo.transform.scale, [tx, ty] = topo.transform.translate;
const arcs = topo.arcs.map((a) => { let x = 0, y = 0; return a.map(([dx, dy]) => { x += dx; y += dy; return [x * sx + tx, y * sy + ty]; }); });
const arco = (i) => (i >= 0 ? arcs[i] : arcs[~i].slice().reverse());

let minY = Infinity, maxY = -Infinity;
const anillo = (idx) => {
  const pts = [];
  idx.forEach((i, k) => { const a = arco(i); pts.push(...(k ? a.slice(1) : a)); });
  let d = "", prev = "", last = null;
  for (let [lon, lat] of pts) {
    // Anillos que cruzan el antimeridiano (Rusia, Fiyi): se "desenrollan" para que no
    // atraviesen el mapa de lado a lado; lo que sobresale queda fuera del viewBox.
    if (last != null) { while (lon - last > 180) lon -= 360; while (last - lon > 180) lon += 360; }
    last = lon;
    const [x, y] = proj(lon, lat);
    const s = `${x.toFixed(1)} ${y.toFixed(1)}`;
    if (s === prev) continue;
    d += (d ? "L" : "M") + s; prev = s;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  return d + "Z";
};

const paises = {};
for (const g of topo.objects.countries.geometries) {
  if (g.id === "010" || !g.arcs) continue; // Antártida fuera: ocupa mucho y no aporta
  const polys = g.type === "Polygon" ? [g.arcs] : g.arcs;
  paises[g.id || g.properties.name] = polys.map((p) => p.map(anillo).join("")).join("");
}

const out = `// Generado por scripts/build-world.mjs a partir de Natural Earth 1:110m (dominio público). No editar a mano.
window.PREP_WORLD = ${JSON.stringify({ w: W, y0: Math.floor(minY), h: Math.ceil(maxY - Math.floor(minY)), s: S, paises })};
`;
writeFileSync(new URL("../portal/assets/world.js", import.meta.url), out);
console.log(`world.js: ${Object.keys(paises).length} países, ${(out.length / 1024).toFixed(0)} KB, viewBox y ${Math.floor(minY)}..${Math.ceil(maxY)}`);
