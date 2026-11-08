#!/usr/bin/env node
// Actualiza portal/assets/news.js con noticias relevantes a partir de feeds RSS.
// Sin dependencias: Node 18+ (fetch nativo). Uso: node scripts/update-news.mjs [--dry-run]
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG = JSON.parse(readFileSync(join(ROOT, "scripts/feeds.json"), "utf8"));
const OUT = join(ROOT, "portal/assets/news.js");
const DRY = process.argv.includes("--dry-run");
const DAY = 86400000;
const now = Date.now();

// ---------- Relevancia ----------
// Peso 3: claramente del tema. Peso 1: contexto. Umbral: 3 en feeds generales, 2 en feeds de búsqueda.
const KW = [
  [3, ["ciberataque", "hackeo", "ransomware", "cyber-attack", "cyberattack", "apagon", "blackout", "power outage", "power cut",
       "proteccion civil", "kit de emergencia", "mochila de emergencia", "emergency kit", "72 horas", "72 hours",
       "cadena de frio", "desabastecimiento", "infraestructura critica", "critical infrastructure", "corte electrico",
       "preparacion ante emergencias", "civil defence", "civil defense", "acaparamiento", "panic buying"]],
  [1, ["emergencia", "emergency", "supermercado", "supermarket", "suministro", "supply", "red electrica", "power grid",
       "inundacion", "flood", "terremoto", "earthquake", "huracan", "hurricane", "dana", "incendio forestal", "wildfire",
       "evacuacion", "evacuation", "alerta", "alert", "reservas", "agua potable", "racionamiento"]],
];
// Descartes: ruido habitual que contiene palabras clave por casualidad.
const EXCLUDE = ["horoscopo", "futbol", "liga ", "champions", "receta", "videojuego", "netflix", "serie de tv", "loteria",
  "golf", "tenis", "formula 1", "cripto", "bitcoin", "binance", "nft", "box office", "taquilla"];
const STRONG = KW[0][1];
const hasStrong = (text) => { const t = norm(text); return STRONG.some((k) => t.includes(k)); };

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function score(text) {
  const t = norm(text);
  if (EXCLUDE.some((x) => t.includes(x))) return 0;
  let s = 0;
  for (const [w, list] of KW) for (const k of list) if (t.includes(k)) s += w;
  return s;
}

function tema(text) {
  const t = norm(text);
  if (/ciberataque|hackeo|ransomware|cyber/.test(t)) return "Ciberataques";
  if (/apagon|blackout|power (outage|cut)|corte electrico|red electrica/.test(t)) return "Apagones";
  if (/desabastecimiento|cadena de frio|supermercado|supermarket|suministro|acaparamiento|panic buying/.test(t)) return "Suministro";
  if (/inundacion|flood|terremoto|earthquake|huracan|hurricane|dana|incendio|wildfire/.test(t)) return "Desastres naturales";
  return "Protección civil";
}

// ---------- RSS ----------
const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const decode = (s) => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m);
const strip = (s) => decode(decode(s)).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const tag = (xml, name) => { const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i")); return m ? m[1] : ""; };

function parse(xml, feed) {
  const items = [];
  for (const m of xml.matchAll(/<item[\s>][\s\S]*?<\/item>/gi)) {
    const it = m[0];
    let titulo = strip(tag(it, "title"));
    const enlace = strip(tag(it, "link"));
    const fecha = Date.parse(strip(tag(it, "pubDate")) || strip(tag(it, "dc:date")));
    const desc = strip(tag(it, "description")).slice(0, 400);
    let fuente = strip(tag(it, "source")) || feed.nombre;
    // Google Noticias añade " - Medio" al final del titular
    if (feed.busqueda && fuente && titulo.endsWith(" - " + fuente)) titulo = titulo.slice(0, -(fuente.length + 3));
    if (!titulo || !/^https?:\/\//.test(enlace) || !Number.isFinite(fecha)) continue;
    items.push({ titulo, enlace, fuente, fecha: new Date(fecha).toISOString(), zona: feed.zona || "global", _texto: titulo + " " + desc, _busqueda: !!feed.busqueda });
  }
  return items;
}

async function fetchFeed(feed) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 20000);
  try {
    const r = await fetch(feed.url, { signal: ctrl.signal, headers: { "User-Agent": "Mozilla/5.0 (compatible; Preparados72h-news/1.0)", Accept: "application/rss+xml, application/xml, text/xml" } });
    if (!r.ok) throw new Error("HTTP " + r.status);
    return parse(await r.text(), feed);
  } finally { clearTimeout(t); }
}

// ---------- Histórico ----------
function loadExisting() {
  if (!existsSync(OUT)) return [];
  const src = readFileSync(OUT, "utf8");
  try { return JSON.parse(src.slice(src.indexOf("{"), src.lastIndexOf("}") + 1)).items || []; } catch { return []; }
}
const key = (t) => norm(t).replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").slice(0, 90);

// ---------- Main ----------
const results = await Promise.allSettled(CONFIG.feeds.map(fetchFeed));
let ok = 0;
const fresh = [];
results.forEach((r, i) => {
  const f = CONFIG.feeds[i];
  if (r.status === "fulfilled") { ok++; fresh.push(...r.value); console.log(`✓ ${f.nombre}: ${r.value.length} items`); }
  else console.warn(`✗ ${f.nombre}: ${r.reason?.message || r.reason}`);
});
if (ok === 0) { console.error("Ningún feed respondió; no se modifica nada."); process.exit(1); }

// Redes sociales: no son medios, se descartan aunque Google Noticias las enlace
const SOCIAL = /\b(instagram|facebook|tiktok|youtube|twitter|threads|linkedin)\b|^x$/i;
const relevant = fresh
  .filter((it) => !SOCIAL.test(it.fuente))
  .filter((it) => now - Date.parse(it.fecha) <= CONFIG.maxDiasNoticia * DAY && Date.parse(it.fecha) <= now + DAY)
  .map((it) => ({ ...it, _score: score(it._texto) }))
  // Feeds generales: palabra clave fuerte en el titular. Feeds de búsqueda: en titular o entradilla.
  .filter((it) => it._score >= 3 && hasStrong(it._busqueda ? it._texto : it.titulo));

const byKey = new Map();
// Las noticias ya publicadas conservan su zona; si no la tenían, se recupera por su enlace en los canales de hoy.
const zonaPorEnlace = new Map(fresh.map((it) => [it.enlace, it.zona]));
for (const it of loadExisting()) { if (SOCIAL.test(it.fuente)) continue; if (!it.zona && zonaPorEnlace.has(it.enlace)) it.zona = zonaPorEnlace.get(it.enlace); byKey.set(key(it.titulo), it); }
// Variedad: descarta titulares casi iguales (misma historia en distintos medios) y limita por medio y por tema.
const STOP = new Set("para como sobre tras ante desde entre sobre hasta pero porque cuando donde este esta estos estas that with from this have will their about after over into".split(" "));
const tokens = (t) => new Set(norm(t).replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 3 && !STOP.has(w)));
const similar = (a, b) => { let n = 0; for (const w of a) if (b.has(w)) n++; return n / Math.min(a.size, b.size || 1) >= 0.5; };
const seen = [...byKey.values()].map((it) => tokens(it.titulo));

// Límites por zona: así una zona con muchas noticias no deja sin hueco a la otra.
let nuevas = 0;
const porFuente = {}, porTema = {}, nuevasZona = {};
const MAX_NUEVAS = 12, MAX_POR_FUENTE = 2, MAX_POR_TEMA = 4;
relevant.sort((a, b) => b._score - a._score || Date.parse(b.fecha) - Date.parse(a.fecha));
for (const it of relevant) {
  if ((nuevasZona[it.zona] || 0) >= MAX_NUEVAS) continue;
  const k = key(it.titulo);
  if (byKey.has(k)) continue;
  const tk = tokens(it.titulo);
  if (tk.size < 3 || seen.some((s) => similar(tk, s))) continue;
  const tm = tema(it._texto);
  const tz = it.zona + "|" + tm;
  if ((porFuente[it.fuente] || 0) >= MAX_POR_FUENTE || (porTema[tz] || 0) >= MAX_POR_TEMA) continue;
  porFuente[it.fuente] = (porFuente[it.fuente] || 0) + 1;
  porTema[tz] = (porTema[tz] || 0) + 1;
  nuevasZona[it.zona] = (nuevasZona[it.zona] || 0) + 1;
  seen.push(tk);
  byKey.set(k, { titulo: it.titulo, enlace: it.enlace, fuente: it.fuente, fecha: it.fecha, tema: tm, zona: it.zona });
  nuevas++;
}
// Máximo de noticias publicadas por zona (las antiguas sin zona cuentan como «global»)
const porZona = {};
const items = [...byKey.values()]
  .filter((it) => now - Date.parse(it.fecha) <= CONFIG.maxDiasHistorico * DAY)
  .sort((a, b) => Date.parse(b.fecha) - Date.parse(a.fecha))
  .filter((it) => { const z = it.zona || "global"; porZona[z] = (porZona[z] || 0) + 1; return porZona[z] <= CONFIG.maxNoticias; });

console.log(`Relevantes hoy: ${relevant.length} · nuevas: ${nuevas} · total publicado: ${items.length} (${Object.entries(porZona).map(([z, n]) => `${z}: ${Math.min(n, CONFIG.maxNoticias)}`).join(", ")})`);
const payload = { actualizado: new Date(now).toISOString(), items };
const js = "// Generado automáticamente por scripts/update-news.mjs. No editar a mano.\nwindow.PREP_NEWS = " + JSON.stringify(payload, null, 2) + ";\n";
if (DRY) { items.slice(0, 15).forEach((i) => console.log(`- [${i.tema}] ${i.titulo} (${i.fuente}, ${i.fecha.slice(0, 10)})`)); }
else writeFileSync(OUT, js);
