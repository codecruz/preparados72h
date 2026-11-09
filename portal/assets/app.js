(function () {
  "use strict";
  const D = window.PREP_DATA;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (n, d = 0) => n.toLocaleString("es-ES", { maximumFractionDigits: d, minimumFractionDigits: 0 });

  // Persistencia local tolerante a fallos (modo privado, cuota llena…)
  const store = {
    get(k, def) { try { const v = localStorage.getItem("prep72." + k); return v == null ? def : JSON.parse(v); } catch { return def; } },
    set(k, v) { try { localStorage.setItem("prep72." + k, JSON.stringify(v)); } catch { /* sin persistencia */ } },
  };

  /* ---------- Mi país y zona ---------- */
  // El país elegido define la zona (noticias, países, productos) y los teléfonos de emergencias.
  const Z = D.zonas;
  const paisDe = (id) => Z.paises.find((p) => p.id === id);
  let pais = paisDe(store.get("pais", ""));
  if (!pais) {
    let tz = "";
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch { /* sin zona horaria */ }
    pais = paisDe(Z.husos[tz]) || paisDe(tz.startsWith("Europe/") ? "ue" : tz.startsWith("America/") ? "latam" : "otro");
  }
  const ZONA = pais.zona; // "europa" | "latam" | "todas"
  const EMERG = pais.tel || Z.sinNumero;
  const SOS_LISTA = pais.sos.length ? pais.sos : [["112", "Emergencias (UE y muchos países)"], ["911", "Emergencias (México, EE. UU. y muchos países)"]];
  const telTexto = SOS_LISTA.map(([n, t]) => `${n} (${t})`).join(" · ");
  // Textos con el número de emergencias del país y nombres locales de los productos
  (function adaptar(o) { for (const k in o) { const v = o[k]; if (typeof v === "string") o[k] = v.replace(/\{EMERG\}/g, EMERG); else if (v && typeof v === "object") adaptar(v); } })(D);
  if (ZONA === "latam") { D.despensa.productos.forEach((x) => x.latam && Object.assign(x, x.latam)); D.agua.avisos.unshift(Z.aguaLatam); }
  D.despensa.productos = D.despensa.productos.filter((x) => !x.zona || ZONA === "todas" || x.zona === ZONA);

  // App Android (Capacitor): los plugins nativos se exponen en window.Capacitor.Plugins
  const Cap = window.Capacitor;
  const NATIVE = !!(Cap && typeof Cap.isNativePlatform === "function" && Cap.isNativePlatform());
  const plugin = (name) => (NATIVE && Cap.Plugins && Cap.Plugins[name]) || null;
  if (NATIVE) document.documentElement.classList.add("native");

  /* ---------- SOS ---------- */
  const sosBtn = $("#sos-btn"), sosMenu = $("#sos-menu");
  sosMenu.innerHTML = SOS_LISTA.map(([n, t]) => `<a href="tel:${n}"><strong>${n}</strong> ${esc(t)}</a>`).join("")
    + `<a href="#mi-pais" class="sos-pais">${pais.tel ? "" : "Comprueba el número de tu país · "}${esc(pais.nombre)}: cambiar</a>`;
  $$("[data-emerg]").forEach((el) => (el.textContent = EMERG));
  { const t = $('textarea[name="contactos"]'); if (t) t.placeholder = t.placeholder.replace("112", pais.tel || "…"); }
  $("#nav-pais").textContent = `📍 Mi país: ${pais.nombre}`;
  { const c = $("#pais-chip"); c.textContent = `📍 ${({ latam: "LATAM", otro: "🌐" })[pais.id] || pais.id.toUpperCase()}`; c.setAttribute("aria-label", `Mi país: ${pais.nombre}. Cambiar`); c.title = `Mi país: ${pais.nombre}`; }
  $("#pais-sel").innerHTML = ["europa", "latam", "todas"].map((z) => `<optgroup label="${esc(Z.nombres[z])}">${Z.paises.filter((p) => p.zona === z).map((p) => `<option value="${p.id}"${p.id === pais.id ? " selected" : ""}>${esc(p.nombre)}</option>`).join("")}</optgroup>`).join("");
  $("#pais-info").textContent = `Zona: ${Z.nombres[ZONA]} · Emergencias: ${pais.tel ? SOS_LISTA.map(([n]) => n).join(", ") : "comprueba el número de tu país"}. Adapta las noticias, los teléfonos, las recomendaciones por país y los nombres de los productos.`;
  $("#pais-sel").addEventListener("change", (e) => { store.set("pais", e.target.value); location.reload(); });
  sosBtn.addEventListener("click", () => {
    const open = sosMenu.hidden;
    sosMenu.hidden = !open;
    sosBtn.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", (e) => { if (!e.target.closest("#sos")) { sosMenu.hidden = true; sosBtn.setAttribute("aria-expanded", "false"); } });

  /* ---------- Navegación ---------- */
  const menuBtn = $(".menu-btn"), nav = $("#nav");
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", (e) => { if (e.target.tagName === "A") { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); } });

  const net = $("#net");
  const updateNet = () => { net.textContent = navigator.onLine ? "En línea" : "Sin conexión"; net.classList.toggle("off", !navigator.onLine); };
  addEventListener("online", updateNet); addEventListener("offline", updateNet); updateNet();

  /* ---------- Hero ---------- */
  $("#hero-stats").innerHTML = [
    ["3 niveles", "de material, de 72 h a meses"],
    [`${D.habilidades.length}`, "habilidades de supervivencia"],
    [`${D.guias.length}`, "guías de emergencia"],
    ["100 %", "funciona sin conexión"],
  ].map(([n, t]) => `<div class="stat"><strong>${n}</strong><span>${t}</span></div>`).join("");

  /* ---------- Alerta ---------- */
  $("#alerta-fecha").textContent = D.alerta.fecha;
  $("#alerta-titulo").textContent = D.alerta.titulo;
  $("#alerta-resumen").textContent = D.alerta.resumen;
  $("#alerta-datos").innerHTML = D.alerta.datos.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("");

  /* ---------- Noticias ---------- */
  const NEWS = window.PREP_NEWS || { items: [] };
  const newsItems = (NEWS.items || []).filter((n) => /^https?:\/\//.test(n.enlace));
  const rel = (iso) => {
    const day = (t) => { const x = new Date(t); x.setHours(0, 0, 0, 0); return x.getTime(); };
    const d = Math.round((day(Date.now()) - day(Date.parse(iso))) / 86400000);
    return d <= 0 ? "hoy" : d === 1 ? "ayer" : `hace ${d} días`;
  };
  if (NEWS.actualizado) $("#news-updated").textContent = `Última actualización: ${new Date(NEWS.actualizado).toLocaleString("es-ES", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}.`;
  // Zona: cada noticia lleva la de su canal; las internacionales («global») salen en todas.
  let zonaNews = ZONA;
  const enZona = (n) => zonaNews === "todas" || !n.zona || n.zona === "global" || n.zona === zonaNews;
  let temaSel = "Todas";
  function renderNews() {
    $("#news-zona").innerHTML = ZONA === "todas" ? "" : [[ZONA, Z.nombres[ZONA]], ["todas", "Todas las zonas"]].map(([z, t]) => `<button type="button" class="chip" aria-pressed="${z === zonaNews}" data-nzona="${z}">${esc(t)}</button>`).join("");
    const deZona = newsItems.filter(enZona);
    const temas = ["Todas", ...new Set(deZona.map((n) => n.tema))];
    if (!temas.includes(temaSel)) temaSel = "Todas";
    $("#news-chips").innerHTML = temas.length > 2 ? temas.map((t) => `<button type="button" class="chip" aria-pressed="${t === temaSel}" data-tema="${esc(t)}">${esc(t)}</button>`).join("") : "";
    const list = deZona.filter((n) => temaSel === "Todas" || n.tema === temaSel);
    $("#news-list").innerHTML = list.length ? list.map((n) => `
      <li><a href="${esc(n.enlace)}" target="_blank" rel="noopener noreferrer">
        <span class="meta"><span class="tag">${esc(n.tema)}</span><span>${esc(n.fuente)}</span><span>· ${rel(n.fecha)}</span></span>
        <span class="t">${esc(n.titulo)}</span>
      </a></li>`).join("") : `<li class="news-empty">Aún no hay noticias recopiladas.</li>`;
  }
  $("#news-chips").addEventListener("click", (e) => { const b = e.target.closest("[data-tema]"); if (b) { temaSel = b.dataset.tema; renderNews(); } });
  $("#news-zona").addEventListener("click", (e) => { const b = e.target.closest("[data-nzona]"); if (b) { zonaNews = b.dataset.nzona; renderNews(); } });
  renderNews();

  /* ---------- Calculadora (lógica en assets/calc.js, con tests) ---------- */
  const C = window.PrepCalc;
  const form = $("#calc-form");
  const PERSONAS = ["adultos", "mayores", "ninos", "peques", "bebes", "perrosPeq", "perrosMed", "perrosGra", "gatos"];
  const plural = (n, s, p) => `${n} ${n === 1 ? s : p}`;

  $("#necesidades").innerHTML = C.NECESIDADES.map((n) => `
    <div class="need" data-need="${n.id}">
      <label class="check"><input type="checkbox" data-need-check="${n.id}"> <span>${esc(n.etiqueta)}</span></label>
      <label class="need-n" hidden><span>Personas</span> <input type="number" data-need-n="${n.id}" min="1" max="20" value="1" inputmode="numeric" aria-label="Personas con ${esc(n.etiqueta.toLowerCase())}"></label>
    </div>`).join("");

  function readForm() {
    const v = { dias: Number(($('input[name="dias"]:checked', form) || {}).value) };
    for (const k of PERSONAS) v[k] = form.elements[k].value;
    v.lactancia = form.elements.lactancia.checked;
    v.medicacion = form.elements.medicacion.checked;
    v.calor = form.elements.calor.checked;
    v.sinFuego = form.elements.sinFuego.checked;
    v.todaLaFamilia = form.elements.todaLaFamilia.checked;
    v.necesidades = {};
    for (const n of C.NECESIDADES) {
      if ($(`[data-need-check="${n.id}"]`, form).checked) v.necesidades[n.id] = $(`[data-need-n="${n.id}"]`, form).value;
    }
    return v;
  }

  function writeForm(v) {
    const dias = C.HORIZONTES.includes(Number(v.dias)) ? String(v.dias) : "3";
    if (v.perros != null && v.perrosMed == null) v = { ...v, perrosMed: v.perros }; // datos guardados de la versión anterior
    $$('input[name="dias"]', form).forEach((r) => (r.checked = r.value === dias));
    // Solo se escriben los campos presentes: lo que falte conserva el valor por defecto del formulario
    for (const k of PERSONAS) if (v[k] != null && v[k] !== "") form.elements[k].value = C.sanear({ [k]: v[k] })[k];
    form.elements.lactancia.checked = !!v.lactancia;
    form.elements.medicacion.checked = !!v.medicacion;
    form.elements.calor.checked = !!v.calor;
    form.elements.sinFuego.checked = !!v.sinFuego;
    form.elements.todaLaFamilia.checked = !!v.todaLaFamilia;
    for (const n of C.NECESIDADES) {
      const on = !!(v.necesidades && v.necesidades[n.id] != null);
      $(`[data-need-check="${n.id}"]`, form).checked = on;
      if (on) $(`[data-need-n="${n.id}"]`, form).value = v.necesidades[n.id];
    }
  }

  // Ajusta lo que se ve a lo que se calcula (negativos, decimales, límites) sin pelearse con el usuario mientras escribe
  function normalizar() {
    const s = C.sanear(readForm());
    for (const k of PERSONAS) if (String(form.elements[k].value) !== String(s[k])) form.elements[k].value = s[k];
    const max = Math.max(1, s.adultos + s.ninos + s.peques + s.mayores);
    for (const n of C.NECESIDADES) {
      const inp = $(`[data-need-n="${n.id}"]`, form);
      inp.max = max;
      const val = Math.trunc(Number(inp.value));
      inp.value = Number.isFinite(val) ? Math.min(max, Math.max(1, val)) : 1;
    }
  }

  const saved = store.get("calc", null);
  if (saved && typeof saved === "object") { try { writeForm(saved); } catch { /* estado guardado no válido */ } }
  normalizar();

  let lastRaw = null, lastResult = null;
  function calc() {
    const raw = readForm();
    const r = C.compute(raw);
    lastRaw = raw; lastResult = r;
    const i = r.entrada;
    // Guardamos lo que el usuario marcó (incluidas necesidades aunque ahora no haya comensales)
    store.set("calc", { ...raw, ...Object.fromEntries(PERSONAS.map((k) => [k, i[k]])), dias: i.dias });

    $("#lactancia-row").hidden = i.bebes === 0;
    for (const n of C.NECESIDADES) $(`[data-need="${n.id}"] .need-n`, form).hidden = !$(`[data-need-check="${n.id}"]`, form).checked;

    const errores = r.avisos.filter((a) => a.tipo === "error");
    $("#calc-errores").innerHTML = errores.map((a) => `<p class="calc-error" role="alert">${esc(a.texto)}</p>`).join("");

    if (r.vacio) {
      $("#calc-title").textContent = "¿Quién vive en casa?";
      $("#calc-big").innerHTML = "";
      for (const id of ["#calc-compra-wrap", "#calc-sum-wrap", "#calc-avisos-wrap"]) $(id).hidden = true;
      $("#calc-agua-split").textContent = "";
      renderMenu(); renderInventory();
      return;
    }
    const mascotas = [i.perros && plural(i.perros, "perro", "perros"), i.gatos && plural(i.gatos, "gato", "gatos")].filter(Boolean).join(" y ");
    const a = r.agua;
    const partes = [[a.bebida, "para beber"], [a.cocina, "para cocinar"], [a.higiene, "de higiene"], [a.bebes, "para los bebés"], [a.lactancia, "por la lactancia"], [a.perros + a.gatos, "para las mascotas"]]
      .filter(([n]) => n > 0).map(([n, t]) => `${fmt(n, 1)} L ${t}`);
    $("#calc-agua-split").textContent = `Agua: ${partes.join(" + ")}.`;
    $("#calc-title").textContent = `Para ${r.dias === 3 ? "72 horas" : r.dias + " días"} · ${plural(r.personas, "persona", "personas")}${mascotas ? " y " + mascotas : ""}`;
    $("#calc-big").innerHTML = `
      <div><strong>${fmt(r.agua.total, 1)} L</strong><span>de agua (${plural(r.agua.garrafas5L, "garrafa", "garrafas")} de 5 L)</span></div>
      ${r.kcal.total ? `<div><strong>${fmt(r.kgComida, 1)} kg</strong><span>de comida (peso neto de la lista, ${fmt(r.kcal.total)} kcal)</span></div>`
                     : `<div><strong>Bebés</strong><span>su alimentación va aparte (más abajo)</span></div>`}
      ${r.pienso.total ? `<div><strong>${fmt(Math.max(0.1, r.pienso.total), 1)} kg</strong><span>de pienso para ${esc(mascotas)} (aparte)</span></div>` : ""}`;

    $("#calc-compra-wrap").hidden = r.grupos.length === 0;
    $("#calc-grupos").innerHTML = r.grupos.map((g) => {
      const fila = (p, segura) => `
        <div class="grp-row${segura ? " safe" : ""}">
          <span class="qty">${p.cantidad}</span>
          <span><span class="u">${esc(p.cantidad === 1 ? p.unidad.s : p.unidad.p)}</span> · ${segura ? '<span class="tag-safe">Versión segura</span> ' : ""}${esc(p.texto)}${g.base && g.segura ? ` <em>(para ${plural(p.personas, "persona", "personas")})</em>` : ""}</span>
        </div>`;
      return `<li class="grp"><strong class="grp-h">${esc(g.nombre)}</strong>${g.base ? fila(g.base, false) : ""}${g.segura ? fila(g.segura, true) : ""}</li>`;
    }).join("");

    $("#calc-sum-wrap").hidden = false;
    $("#calc-list").innerHTML = r.suministros.map((x) => `<li>${esc(x.texto).replace(/(^|\s)(\d[\d.,]*)(?=\s)/g, "$1<b>$2</b>")}</li>`).join("");

    const info = r.avisos.filter((a) => a.tipo !== "error");
    $("#calc-avisos-wrap").hidden = info.length === 0;
    $("#calc-avisos").innerHTML = info.map((a) => {
      const t = esc(a.texto), k = t.indexOf(":");
      return `<li class="${a.tipo}">${a.necesidad && k > 0 ? `<strong>${t.slice(0, k)}:</strong>${t.slice(k + 1)}` : t}</li>`;
    }).join("");
    renderMenu();
    renderInventory();
  }

  /* ---------- Menú de ejemplo (usa los datos de la calculadora) ---------- */
  function renderMenu() {
    if (!lastRaw) return;
    const r = lastResult;
    if (r.vacio || r.comensales === 0) {
      $("#menu-meta").textContent = r.vacio ? "Indica en la calculadora quién vive en casa." : "Solo hay bebés: su alimentación va aparte (leche y potitos).";
      $("#menu-days").innerHTML = ""; $("#menu-notas").innerHTML = "";
      return;
    }
    const m = C.menu(lastRaw);
    const nombres = m.apto.map((id) => C.NECESIDADES.find((n) => n.id === id).etiqueta.toLowerCase());
    $("#menu-meta").textContent = `${m.dias.length} días para ${plural(r.comensales, "persona", "personas")}` + (nombres.length ? `, apto para: ${nombres.join(", ")}.` : ".");
    $("#menu-days").innerHTML = m.dias.map((d) => `
      <article class="card menu-day">
        <h3>Día ${d.dia} <span class="pill ${d.cocina ? "d7" : "d3"}">${d.cocina ? "Con hornillo" : "Sin cocinar"}</span></h3>
        <dl>${d.comidas.map((c) => `<dt>${esc(c.nombre)}</dt><dd>${esc(c.texto)}</dd>`).join("")}</dl>
      </article>`).join("");
    $("#menu-notas").innerHTML = m.notas.map((t) => `<li class="consejo">${esc(t)}</li>`).join("");
  }

  form.addEventListener("input", calc);
  // (el primer cálculo se hace al final de la sección de inventario, cuando ya existen el menú y el inventario)
  form.addEventListener("change", (e) => { if (e.target.type === "number") normalizar(); calc(); });
  form.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-step]");
    if (!btn) return;
    const input = form.elements[btn.dataset.for];
    const v = (Math.trunc(Number(input.value)) || 0) + Number(btn.dataset.step);
    input.value = Math.max(+input.min, Math.min(+input.max, v));
    normalizar();
    calc();
  });

  /* ---------- Barra fija: Mi lista y Mi despensa ---------- */
  function contarReservas() {
    const nl = (store.get("despensaLista", []) || []).length;
    let nd = 0;
    try { nd = inv.length; } catch { /* el inventario aún no se ha cargado */ }
    $("#rb-lista-n").textContent = nl; $("#rb-desp-n").textContent = nd;
    $("#rb-lista").setAttribute("aria-label", `Mi lista de la compra: ${plural(nl, "producto", "productos")}`);
    $("#rb-desp").setAttribute("aria-label", `Mi despensa (inventario): ${plural(nd, "producto", "productos")}`);
  }

  /* ---------- Inventario y caducidades ---------- */
  const TIPOS = [
    { id: "agua", nombre: "Agua", unidad: "litros" },
    ...C.GRUPOS.map((g) => ({ id: g.id, nombre: g.nombre, unidad: g.unidad.p })),
    { id: "medicacion", nombre: "Medicación", unidad: "envases" },
    { id: "otros", nombre: "Otros (pilas, higiene, bebés…)", unidad: "unidades" },
  ];
  const tipo = (id) => TIPOS.find((t) => t.id === id) || TIPOS[TIPOS.length - 1];
  const invForm = $("#inv-form");
  $("#inv-tipo").innerHTML = TIPOS.map((t) => `<option value="${t.id}">${esc(t.nombre)}</option>`).join("");
  const syncUnit = () => ($("#inv-unit").textContent = tipo(invForm.elements.tipo.value).unidad);
  invForm.elements.tipo.addEventListener("change", syncUnit); syncUnit();

  const validItem = (x) => x && typeof x.nombre === "string" && x.nombre.trim() && TIPOS.some((t) => t.id === x.tipo) && Number.isFinite(Number(x.cantidad)) && Number(x.cantidad) >= 0 && (!x.caduca || /^\d{4}-\d{2}-\d{2}$/.test(x.caduca));
  let inv = store.get("inventario", []);
  if (!Array.isArray(inv)) inv = [];
  inv = inv.filter(validItem);
  const saveInv = () => store.set("inventario", inv);
  const hoy0 = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const diasHasta = (iso) => (iso ? Math.round((new Date(iso + "T00:00:00") - hoy0()) / 86400000) : null);
  function estado(it) {
    const d = diasHasta(it.caduca);
    if (d == null) return { cls: "none", txt: "Sin fecha" };
    if (d < 0) return { cls: "bad", txt: `Caducado hace ${plural(-d, "día", "días")}` };
    if (d <= 30) return { cls: "soon", txt: d === 0 ? "Caduca hoy" : `Caduca en ${plural(d, "día", "días")}: consúmelo y repón` };
    if (d <= 90) return { cls: "warn", txt: `Caduca en ${plural(d, "día", "días")}` };
    return { cls: "ok", txt: `Hasta el ${new Date(it.caduca + "T00:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}` };
  }

  function necesario(r, id) {
    if (!r || r.vacio) return 0;
    if (id === "agua") return r.agua.total;
    const g = r.grupos.find((x) => x.id === id);
    return g ? (g.base?.cantidad || 0) + (g.segura?.cantidad || 0) : 0;
  }
  function renderInventory() {
    contarReservas();
    const r = lastResult;
    const vigente = (it) => { const d = diasHasta(it.caduca); return d == null || d >= 0; };
    // Cobertura frente a la calculadora (solo lo que no ha caducado)
    const filas = TIPOS.filter((t) => t.id !== "medicacion" && t.id !== "otros").map((t) => {
      const need = necesario(r, t.id);
      const have = inv.filter((it) => it.tipo === t.id && vigente(it)).reduce((s, it) => s + Number(it.cantidad), 0);
      return { t, need, have };
    }).filter((f) => f.need > 0);
    const horizonte = r && !r.vacio ? (r.dias === 3 ? "72 horas" : `${r.dias} días`) : "";
    $("#inv-cob-head").textContent = filas.length ? `Comparado con la calculadora (${horizonte}, ${plural(r.personas, "persona", "personas")}). No cuenta lo caducado.` : "Rellena la calculadora para ver cuánto te falta.";
    $("#inv-cob").innerHTML = filas.map(({ t, need, have }) => {
      const pct = Math.min(100, Math.round((have / need) * 100));
      const falta = Math.max(0, need - have);
      return `<li><div class="cob-h"><span>${esc(t.nombre)}</span><span class="${pct >= 100 ? "ok" : ""}">${fmt(have, 1)} / ${fmt(need, 1)} ${esc(t.unidad)}</span></div>
        <div class="progress"><div style="width:${pct}%"${pct >= 100 ? ' class="complete"' : ""}></div></div>
        ${falta > 0 ? `<span class="small muted">Faltan ${fmt(falta, 1)} ${esc(t.unidad)}</span>` : `<span class="small ok">Cubierto ✓</span>`}</li>`;
    }).join("");
    // Lista ordenada por caducidad (sin fecha, al final)
    const orden = inv.map((it, idx) => ({ it, idx })).sort((a, b) => (a.it.caduca || "9999") .localeCompare(b.it.caduca || "9999"));
    const caducados = inv.filter((it) => (diasHasta(it.caduca) ?? 1) < 0).length;
    const pronto = inv.filter((it) => { const d = diasHasta(it.caduca); return d != null && d >= 0 && d <= 30; }).length;
    $("#inv-alert").textContent = !inv.length ? "Todavía no has apuntado nada." :
      [caducados && `${plural(caducados, "producto caducado", "productos caducados")}`, pronto && `${plural(pronto, "producto caduca", "productos caducan")} en menos de 30 días`].filter(Boolean).join(" · ") || "Nada caduca en los próximos 30 días.";
    $("#inv-list").innerHTML = orden.map(({ it, idx }) => {
      const e = estado(it);
      return `<li class="inv-item ${e.cls}"><div><strong>${esc(it.nombre)}</strong> <span class="muted small">· ${fmt(Number(it.cantidad), 1)} ${esc(tipo(it.tipo).unidad)} · ${esc(tipo(it.tipo).nombre)}</span><br><span class="small inv-st">${esc(e.txt)}</span></div>
        <div class="inv-btns"><button type="button" class="btn btn-ghost btn-xs" data-inv-dec="${idx}" aria-label="Gastar una unidad de ${esc(it.nombre)}">−1</button><button type="button" class="btn btn-ghost btn-xs" data-inv-del="${idx}" aria-label="Quitar ${esc(it.nombre)}">Quitar</button></div></li>`;
    }).join("");
  }
  invForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const it = { nombre: invForm.elements.nombre.value.trim(), tipo: invForm.elements.tipo.value, cantidad: Number(invForm.elements.cantidad.value), caduca: invForm.elements.caduca.value || "" };
    if (!validItem(it)) { invForm.reportValidity(); return; }
    inv.push(it); saveInv(); renderInventory();
    invForm.elements.nombre.value = ""; invForm.elements.cantidad.value = 1; invForm.elements.caduca.value = "";
    invForm.elements.nombre.focus();
  });
  $("#inv-list").addEventListener("click", (e) => {
    const dec = e.target.closest("[data-inv-dec]"), del = e.target.closest("[data-inv-del]");
    if (dec) { const it = inv[+dec.dataset.invDec]; if (!it) return; it.cantidad = Math.max(0, Number(it.cantidad) - 1); if (it.cantidad === 0) inv.splice(+dec.dataset.invDec, 1); }
    else if (del) inv.splice(+del.dataset.invDel, 1);
    else return;
    saveInv(); renderInventory();
  });
  $("#inv-export").addEventListener("click", async () => {
    const json = JSON.stringify({ app: "preparados72h", version: 1, fecha: new Date().toISOString(), inventario: inv }, null, 2);
    const Share = plugin("Share");
    if (Share) { try { await Share.share({ title: "Inventario Preparados72h", text: json }); } catch { /* cancelado */ } return; }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    a.download = `preparados72h-inventario-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  $("#inv-import").addEventListener("change", async (e) => {
    const f = e.target.files[0]; e.target.value = "";
    if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      const items = (Array.isArray(data) ? data : data.inventario || []).filter(validItem).map((x) => ({ nombre: x.nombre.trim().slice(0, 80), tipo: x.tipo, cantidad: Number(x.cantidad), caduca: x.caduca || "" }));
      if (!items.length) throw new Error("vacío");
      inv = items; saveInv(); renderInventory();
      $("#inv-alert").textContent = `Importados ${plural(items.length, "producto", "productos")}.`;
    } catch { $("#inv-alert").textContent = "No se pudo importar: el archivo no es una copia válida del inventario."; }
  });

  /* ---------- Guías por emergencia ---------- */
  let guiaSel = store.get("guia", D.guias[0].id);
  if (!D.guias.some((g) => g.id === guiaSel)) guiaSel = D.guias[0].id;
  const cifraTxt = (k) => { const c = D.cifras[k]; return c ? `<li><strong>${esc(c.dato)}:</strong> ${esc(c.valor)} <span class="muted">(${esc(c.fuente)})</span></li>` : ""; };
  function renderGuias() {
    $("#guide-tabs").innerHTML = D.guias.map((g) => `<button type="button" role="tab" class="chip" id="tab-${g.id}" aria-selected="${g.id === guiaSel}" tabindex="${g.id === guiaSel ? 0 : -1}" aria-controls="guide-panel" data-guia="${g.id}"><span aria-hidden="true">${g.icono}</span> ${esc(g.titulo)}</button>`).join("");
    const g = D.guias.find((x) => x.id === guiaSel);
    const lista = (t, items) => items.length ? `<div class="guide-col"><h4>${t}</h4><ol>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ol></div>` : "";
    $("#guide-panel").setAttribute("aria-labelledby", `tab-${g.id}`);
    $("#guide-panel").innerHTML = `<article class="card guide" id="guia-${g.id}">
      <h3><span aria-hidden="true">${g.icono}</span> ${esc(g.titulo)}</h3>
      <p class="muted">${esc(g.resumen)}</p>
      <div class="guide-cols">${lista("Antes", g.antes)}${lista("Durante", g.durante)}${lista("Después", g.despues)}</div>
      ${g.cifras.length ? `<ul class="guide-src small">${g.cifras.map(cifraTxt).join("")}</ul>` : ""}
      <button type="button" class="btn btn-ghost btn-sm" data-print="guia">Imprimir esta guía</button>
    </article>`;
  }
  $("#guide-tabs").addEventListener("click", (e) => { const b = e.target.closest("[data-guia]"); if (b) { guiaSel = b.dataset.guia; store.set("guia", guiaSel); renderGuias(); } });
  $("#guide-tabs").addEventListener("keydown", (e) => {
    const k = D.guias.findIndex((g) => g.id === guiaSel), n = D.guias.length;
    const sig = { ArrowRight: (k + 1) % n, ArrowLeft: (k + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (sig == null) return;
    e.preventDefault();
    guiaSel = D.guias[sig].id; store.set("guia", guiaSel);
    renderGuias(); $(`#tab-${guiaSel}`).focus();
  });
  renderGuias();
  // Los enlaces #guia-<id> (p. ej. desde el modo apagón) abren esa guía
  function openGuideFromHash() {
    const m = /^#guia-(.+)$/.exec(location.hash);
    if (m && D.guias.some((g) => g.id === m[1])) { guiaSel = m[1]; renderGuias(); }
  }
  addEventListener("hashchange", openGuideFromHash); openGuideFromHash();

  /* ---------- Agua potable ---------- */
  $("#agua-guardar").innerHTML = D.agua.guardar.map((t) => `<li>${esc(t)}</li>`).join("");
  $("#agua-pasos").innerHTML = D.agua.pasos.map((p) => `<div class="water-step"><strong>${esc(p.titulo)}</strong><p>${esc(p.texto)}</p></div>`).join("");
  $("#agua-avisos").innerHTML = D.agua.avisos.map((t) => `<li class="consejo">${esc(t)}</li>`).join("");
  const bleachForm = $("#bleach-form");
  function renderBleach() {
    const g = C.gotasLejia(bleachForm.elements.litros.value, bleachForm.elements.turbia.checked);
    $("#bleach-out").innerHTML = g.litros > 0
      ? `<strong class="bleach-n">${g.gotas}</strong> <span>gotas de lejía (unos ${fmt(g.ml, 1)} ml) para ${fmt(g.litros, 1)} L.</span>
         <p class="small">Remueve y espera <strong>${g.esperaMin} minutos</strong> antes de beber. Debe oler un poco a cloro; si no, repite la dosis y espera 15 minutos más.</p>`
      : `<span class="muted">Indica cuántos litros quieres potabilizar.</span>`;
  }
  bleachForm.addEventListener("input", renderBleach);
  bleachForm.addEventListener("submit", (e) => e.preventDefault());
  renderBleach();

  /* ---------- Mapas sin conexión y «Mis puntos» ---------- */
  $("#mapas-descargar").innerHTML = D.mapas.descargar.map((p) => `<div class="water-step"><strong>${esc(p.titulo)}</strong><p>${esc(p.texto)}</p></div>`).join("");
  $("#mapas-consejos").innerHTML = D.mapas.consejos.map((t) => `<li>${esc(t)}</li>`).join("");
  const ptForm = $("#pt-form"), ptMsg = $("#pt-msg");
  const validPt = (p) => p && typeof p.nombre === "string" && p.nombre.trim() && Number.isFinite(p.lat) && Number.isFinite(p.lon) && Math.abs(p.lat) <= 90 && Math.abs(p.lon) <= 180;
  let puntos = store.get("puntos", []);
  if (!Array.isArray(puntos)) puntos = [];
  puntos = puntos.filter(validPt);
  let aqui = null; // última posición leída (solo en memoria)
  const fmtDist = (m) => (m < 1000 ? `${fmt(Math.round(m / 10) * 10)} m` : `${fmt(m / 1000, m < 10000 ? 1 : 0)} km`);
  // Una sola lectura del GPS (sin seguimiento continuo) para gastar poca batería
  function leerPosicion() {
    return new Promise((ok, ko) => {
      if (!("geolocation" in navigator)) return ko(new Error("Este dispositivo no permite leer la posición."));
      navigator.geolocation.getCurrentPosition(
        (p) => ok({ lat: p.coords.latitude, lon: p.coords.longitude, prec: Math.round(p.coords.accuracy) }),
        (e) => ko(new Error(e.code === 1 ? "No has dado permiso para usar la ubicación." : "No se pudo leer la posición. Sal al exterior y vuelve a intentarlo.")),
        { enableHighAccuracy: true, timeout: 120000, maximumAge: 60000 });
    });
  }
  const mapLink = (p) => NATIVE || /Android/i.test(navigator.userAgent)
    ? `geo:${p.lat},${p.lon}?q=${p.lat},${p.lon}(${encodeURIComponent(p.nombre)})`
    : `https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lon}#map=17/${p.lat}/${p.lon}`;
  function renderPuntos() {
    $("#pt-list").innerHTML = puntos.length ? puntos.map((p, idx) => {
      const d = aqui ? C.distanciaRumbo(aqui.lat, aqui.lon, p.lat, p.lon) : null;
      return `<li class="inv-item"><div><strong>${esc(p.nombre)}</strong>${p.nota ? ` <span class="muted small">· ${esc(p.nota)}</span>` : ""}<br>
        <span class="small muted">${p.lat.toFixed(5)}, ${p.lon.toFixed(5)}</span>
        ${d ? `<br><span class="pt-dist">${fmtDist(d.metros)} hacia el ${d.rumbo} <span class="muted small">(${d.grados}°)</span></span>` : ""}</div>
        <div class="inv-btns"><a class="btn btn-ghost btn-xs" href="${esc(mapLink(p))}" target="_blank" rel="noopener noreferrer">Abrir en mapa</a><button type="button" class="btn btn-ghost btn-xs" data-pt-del="${idx}" aria-label="Quitar ${esc(p.nombre)}">Quitar</button></div></li>`;
    }).join("") : `<li class="muted small">Todavía no has guardado ningún punto.</li>`;
  }
  $("#pt-here").addEventListener("click", async () => {
    ptMsg.textContent = "Buscando la señal GPS… (al aire libre tarda menos)";
    try { const p = await leerPosicion(); aqui = p; ptForm.elements.coords.value = `${p.lat.toFixed(5)}, ${p.lon.toFixed(5)}`; ptMsg.textContent = `Posición leída con una precisión de unos ${fmt(p.prec)} m.`; renderPuntos(); }
    catch (e) { ptMsg.textContent = e.message; }
  });
  ptForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const c = C.parseCoords(ptForm.elements.coords.value);
    if (!c) { ptMsg.textContent = "Escribe las coordenadas como «40.4168, -3.7038» o pulsa «Usar mi posición»."; return; }
    const p = { nombre: ptForm.elements.nombre.value.trim().slice(0, 60), nota: ptForm.elements.nota.value.trim().slice(0, 120), ...c };
    if (!validPt(p)) { ptForm.reportValidity(); return; }
    puntos.push(p); store.set("puntos", puntos); renderPuntos();
    ptForm.reset(); ptMsg.textContent = "Punto guardado ✓";
  });
  $("#pt-locate").addEventListener("click", async () => {
    $("#pt-pos").textContent = "Buscando la señal GPS…";
    try { aqui = await leerPosicion(); $("#pt-pos").textContent = `Estás en ${aqui.lat.toFixed(5)}, ${aqui.lon.toFixed(5)} (±${fmt(aqui.prec)} m).`; renderPuntos(); }
    catch (e) { $("#pt-pos").textContent = e.message; }
  });
  $("#pt-list").addEventListener("click", (e) => {
    const b = e.target.closest("[data-pt-del]");
    if (!b) return;
    puntos.splice(+b.dataset.ptDel, 1); store.set("puntos", puntos); renderPuntos();
  });
  renderPuntos();

  /* ---------- De dónde salen los números ---------- */
  $("#cifras-body").innerHTML = Object.values(D.cifras).map((c) => `<tr><td><strong>${esc(c.dato)}</strong></td><td>${esc(c.valor)}</td><td>${c.url ? `<a href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">${esc(c.fuente)}</a>` : esc(c.fuente)}</td></tr>`).join("");

  /* ---------- Modo apagón: pantalla oscura, sin animaciones (ahorra batería en pantallas OLED) ---------- */
  const modeBtn = $("#mode-btn");
  function setMode(on) {
    if (on) document.documentElement.dataset.theme = "apagon";
    if (!on) delete document.documentElement.dataset.theme; // sin atributo: vuelve el tema claro u oscuro del sistema
    modeBtn.setAttribute("aria-pressed", String(on));
    modeBtn.textContent = on ? "Modo normal" : "Modo apagón";
    const meta = $('meta[name="theme-color"]'); if (meta) meta.content = on ? "#000000" : "#2f3d2c";
    store.set("apagon", on);
  }
  modeBtn.addEventListener("click", () => setMode(document.documentElement.dataset.theme !== "apagon"));
  setMode(!!store.get("apagon", false));

  calc(); // primer cálculo: también pinta el menú y la cobertura del inventario

  /* ---------- Checklist ---------- */
  let checked = store.get("checklist", {});
  const showExtra = $("#show-extra");
  showExtra.checked = store.get("showExtra", false);
  const showGetHome = $("#show-gethome");
  showGetHome.checked = store.get("showGetHome", false);
  const visibleCats = () => D.checklist.filter((c) => (!c.extra || showExtra.checked) && (!c.gethome || showGetHome.checked));

  function renderChecklist() {
    const cats = visibleCats();
    $("#checklist").innerHTML = cats.map((c) => `
      <article class="card check-card${c.extra || c.gethome ? " extra" : ""}">
        <h3><span aria-hidden="true">${c.icono}</span> ${esc(c.categoria)}</h3>
        <ul>${c.items.map((it) => `
          <li><label class="check"><input type="checkbox" data-id="${it.id}"${checked[it.id] ? " checked" : ""}> <span>${esc(it.texto)}</span></label></li>`).join("")}
        </ul>
      </article>`).join("");
    updateProgress();
  }
  function updateProgress() {
    const ids = visibleCats().flatMap((c) => c.items.map((i) => i.id));
    const done = ids.filter((id) => checked[id]).length;
    const pct = ids.length ? Math.round((done / ids.length) * 100) : 0;
    $("#progress-bar").style.width = pct + "%";
    $("#mochila-progress").setAttribute("aria-valuenow", pct);
    $("#progress-txt").textContent = `${pct}% · ${done}/${ids.length}`;
    $("#progress-bar").classList.toggle("complete", pct === 100);
  }
  $("#checklist").addEventListener("change", (e) => {
    const id = e.target.dataset.id;
    if (!id) return;
    if (e.target.checked) checked[id] = true; else delete checked[id];
    store.set("checklist", checked);
    updateProgress();
  });
  showExtra.addEventListener("change", () => { store.set("showExtra", showExtra.checked); renderChecklist(); });
  showGetHome.addEventListener("change", () => { store.set("showGetHome", showGetHome.checked); renderChecklist(); });
  // Confirmación en dos toques (confirm() no está disponible en todos los entornos)
  const resetBtn = $("#reset-checklist");
  let resetTimer;
  resetBtn.addEventListener("click", () => {
    if (!resetBtn.dataset.armed) {
      resetBtn.dataset.armed = "1";
      resetBtn.textContent = "¿Seguro? Pulsa otra vez";
      resetTimer = setTimeout(() => { delete resetBtn.dataset.armed; resetBtn.textContent = "Reiniciar"; }, 3000);
      return;
    }
    clearTimeout(resetTimer); delete resetBtn.dataset.armed; resetBtn.textContent = "Reiniciar";
    checked = {}; store.set("checklist", checked); renderChecklist();
  });
  renderChecklist();

  /* ---------- Recordatorio de revisión (6 meses) ---------- */
  function renderReview() {
    const last = store.get("lastReview", null);
    const el = $("#review-status");
    el.classList.remove("warn", "ok");
    if (!last) { el.textContent = "Todavía no has registrado ninguna revisión. Recomendamos revisar cada 6 meses."; return; }
    const lastD = new Date(last);
    const next = new Date(lastD); next.setMonth(next.getMonth() + 6);
    const daysLeft = Math.ceil((next - new Date()) / 86400000);
    const f = (d) => d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
    if (daysLeft < 0) { el.textContent = `Última revisión: ${f(lastD)}. ¡Ya toca revisar! Han pasado ${-daysLeft} días desde la fecha prevista.`; el.classList.add("warn"); }
    else { el.textContent = `Última revisión: ${f(lastD)}. Próxima: ${f(next)} (dentro de ${daysLeft} días).`; el.classList.add("ok"); }
  }
  $("#review-btn").addEventListener("click", async () => {
    const now = new Date();
    store.set("lastReview", now.toISOString());
    renderReview();
    // En la app: notificación local dentro de 6 meses (sustituye a la anterior)
    const LN = plugin("LocalNotifications");
    if (!LN) return;
    try {
      const perm = await LN.requestPermissions();
      if (perm.display !== "granted") { $("#review-status").textContent += " Activa las notificaciones de la app para recibir el aviso."; return; }
      const at = new Date(now); at.setMonth(at.getMonth() + 6); at.setHours(10, 0, 0, 0);
      await LN.cancel({ notifications: [{ id: 1 }] }).catch(() => {});
      await LN.schedule({ notifications: [{
        id: 1,
        title: "Toca revisar la mochila de 72 h",
        body: "Han pasado 6 meses: rota los alimentos, revisa las caducidades y cambia las pilas.",
        schedule: { at, allowWhileIdle: true },
      }] });
      $("#review-status").textContent += " Te avisaremos con una notificación.";
    } catch { /* sin notificaciones */ }
  });
  renderReview();

  /* ---------- Plan familiar ---------- */
  const planForm = $("#plan-form");
  const plan = store.get("plan", {});
  for (const [k, v] of Object.entries(plan)) if (planForm.elements[k]) planForm.elements[k].value = v;
  let planTimer;
  planForm.addEventListener("input", () => {
    clearTimeout(planTimer);
    planTimer = setTimeout(() => {
      const data = {};
      $$("input, textarea", planForm).forEach((el) => { if (el.name) data[el.name] = el.value; });
      store.set("plan", data);
      $("#plan-saved").textContent = "Guardado ✓";
      setTimeout(() => ($("#plan-saved").textContent = "Se guarda automáticamente en este dispositivo."), 1500);
    }, 300);
  });

  /* ---------- Consejos y países ---------- */
  $("#tips").innerHTML = D.consejos.map((c, i) => `
    <article class="tip"><span class="tip-n">${String(i + 1).padStart(2, "0")}</span><h3>${esc(c.titulo)}</h3><p>${esc(c.texto)}</p></article>`).join("");

  /* ---------- Recomendaciones por país: mapa del mundo sin conexión ---------- */
  const useDias = (dias) => {
    $$('input[name="dias"]', form).forEach((r) => (r.checked = r.value === String(dias)));
    calc();
    location.hash = "calculadora";
  };
  const calcTxt = (d) => (d === 3 ? "72 horas" : d + " días");
  $("#paises-ue").innerHTML = `🇪🇺 ${esc(D.paisesUE.texto)} <a href="${esc(D.paisesUE.url)}" target="_blank" rel="noopener">Comisión Europea</a>`;
  // Zona de cada país del mapa (por código ISO numérico)
  const ISO_LATAM = new Set(["484", "032", "076", "152", "170", "218", "858", "604", "068", "600", "862", "320", "340", "222", "558", "188", "591", "214", "192"]);
  const ISO_EUROPA = new Set(["276", "040", "752", "578", "756", "233", "246", "208", "428", "616", "528", "056", "372", "250", "826", "724", "440", "203", "191", "620", "380", "300", "642", "348", "703", "705", "100", "442", "470", "196", "352"]);
  const zonaPais = (p) => (ISO_LATAM.has(p.iso) ? "latam" : ISO_EUROPA.has(p.iso) ? "europa" : "otras");
  let paisesTodos = ZONA === "todas";
  function renderPaisesTabla() {
    const filas = D.paises.map((p, i) => [p, i]).filter(([p]) => paisesTodos || zonaPais(p) === ZONA);
    $("#paises-body").innerHTML = filas.map(([p, i]) => `
    <tr data-i="${i}" tabindex="0"><td>${esc(p.pais)}</td><td><span class="pill d${p.nivel}">${esc(p.horizonte)}</span><br><span class="muted small">${esc(p.nota)}</span></td><td class="small"><a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.fuente)}</a></td><td class="go">Calcular →</td></tr>`).join("");
    const resto = D.paises.length - filas.length;
    const b = $("#paises-todos");
    b.hidden = ZONA === "todas";
    b.textContent = paisesTodos ? `Ver solo ${Z.nombres[ZONA]}` : `Ver también el resto del mundo (${resto} países más)`;
  }
  renderPaisesTabla();
  $("#paises-todos").addEventListener("click", () => { paisesTodos = !paisesTodos; renderPaisesTabla(); });
  const usarFila = (e) => {
    const tr = e.target.closest("tr[data-i]");
    if (!tr || e.target.closest("a")) return;
    useDias(D.paises[tr.dataset.i].dias);
  };
  $("#paises-body").addEventListener("click", usarFila);
  $("#paises-body").addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && !e.target.closest("a")) { e.preventDefault(); usarFila(e); } });

  const W = window.PREP_WORLD;
  const mapa = $("#world-map"), tip = $("#world-tip");
  if (W && mapa) {
    // Misma proyección (Natural Earth I) que scripts/build-world.mjs
    const proj = (lon, lat) => {
      const l = (lon * Math.PI) / 180, ph = (lat * Math.PI) / 180, p2 = ph * ph, p4 = p2 * p2;
      const x = l * (0.8707 - 0.131979 * p2 + p4 * (-0.013791 + p4 * (0.003971 * p2 - 0.001529 * p4)));
      const y = ph * (1.007226 + p2 * (0.015085 + p4 * (-0.044475 + 0.028874 * p2 - 0.005916 * p4)));
      return [W.w / 2 + x * W.s, -y * W.s];
    };
    const porIso = Object.fromEntries(D.paises.map((p, i) => [p.iso, i]));
    const tierras = Object.entries(W.paises).map(([iso, d]) => {
      const i = porIso[iso];
      return i == null ? `<path class="c" d="${d}"/>` : `<path class="c lv${D.paises[i].nivel}" data-i="${i}" d="${d}"/>`;
    }).join("");
    const pins = D.paises.map((p, i) => {
      const [x, y] = proj(p.lon, p.lat);
      return `<g class="pin lv${p.nivel}" data-i="${i}" tabindex="0" role="button" aria-label="${esc(p.pais)}: ${esc(p.horizonte)}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}"/></g>`;
    }).join("");
    mapa.innerHTML = `<rect class="sea" x="-50" y="${W.y0 - 50}" width="${W.w + 100}" height="${W.h + 100}"/>${tierras}${pins}`;

    // Vistas: mundo entero o Europa ampliada (allí se concentran casi todas las recomendaciones).
    const [ex0, ey0] = proj(-25, 72), [ex1, ey1] = proj(45, 34);
    const [ax0, ay0] = proj(-125, 34), [ax1, ay1] = proj(-30, -57);
    const ZOOM = { mundo: [0, W.y0, W.w, W.h], europa: [ex0, ey0, ex1 - ex0, ey1 - ey0], america: [ax0, ay0, ax1 - ax0, ay1 - ay0] };
    const verZona = (z) => {
      const vb = ZOOM[z];
      mapa.setAttribute("viewBox", vb.map((n) => n.toFixed(1)).join(" "));
      mapa.style.setProperty("--pr", (4.5 * vb[2] / W.w).toFixed(2)); // marcadores del mismo tamaño en pantalla
      $$("[data-zona]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.zona === z)));
    };
    $$("[data-zona]").forEach((b) => b.addEventListener("click", () => verZona(b.dataset.zona)));
    verZona(ZONA === "europa" ? "europa" : ZONA === "latam" ? "america" : "mundo");

    const marcar = (i) => $$("[data-i]", mapa).forEach((el) => el.classList.toggle("on", el.dataset.i === String(i)));
    const mostrar = (i) => {
      const p = D.paises[i];
      marcar(i);
      tip.innerHTML = `
        <button type="button" class="world-x" aria-label="Cerrar">×</button>
        <strong>${esc(p.pais)}</strong>
        <span class="pill d${p.nivel}">${esc(p.horizonte)}</span>
        <p>${esc(p.nota)}</p>
        <p class="small">Fuente: <a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.fuente)}</a></p>
        <button type="button" class="btn btn-primary btn-xs" data-calc="${p.dias}">Calcular para ${calcTxt(p.dias)} →</button>`;
      tip.hidden = false;
    };
    const cerrar = () => { tip.hidden = true; marcar(-1); };
    mapa.addEventListener("click", (e) => {
      const t = e.target.closest("[data-i]");
      if (t) mostrar(Number(t.dataset.i)); else cerrar();
    });
    mapa.addEventListener("keydown", (e) => {
      const t = e.target.closest(".pin");
      if (t && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); mostrar(Number(t.dataset.i)); }
      if (e.key === "Escape") cerrar();
    });
    tip.addEventListener("click", (e) => {
      if (e.target.closest(".world-x")) cerrar();
      const b = e.target.closest("[data-calc]");
      if (b) useDias(Number(b.dataset.calc));
    });
  }

  $("#lessons").innerHTML = D.comunidad.map((l) => `
    <article class="lesson"><span class="lesson-i" aria-hidden="true">${l.icono}</span><div><h3>${esc(l.titulo)}</h3><p>${esc(l.texto)}</p></div></article>`).join("");
  $("#myths").innerHTML = D.mitos.map((m) => `
    <article class="myth"><p class="myth-m"><span class="badge badge-myth">Mito</span> ${esc(m.mito)}</p><p class="myth-r"><span class="badge badge-real">Realidad</span> ${esc(m.realidad)}</p></article>`).join("");

  $("#fuentes-list").innerHTML = D.fuentes.map((f) => typeof f === "string" ? `<li>${esc(f)}</li>`
    : `<li><a href="${esc(f.url)}"${f.url.startsWith("#") ? "" : ' target="_blank" rel="noopener"'}>${esc(f.texto)}</a></li>`).join("");

  /* ---------- Habilidades ---------- */
  // Ilustraciones (assets/figuras.js): SVG propias o imágenes con licencia libre, incluidas en la web.
  const FIG = window.PREP_FIGURAS || {};
  // Cada figura va dentro del paso al que ilustra (f.paso = índice en h.pasos); sin paso, al final.
  const figuras = (lista) => lista.length ? `<div class="figs">${lista.map((f) => `
        <figure class="fig">${f.svg ? f.svg.replace("<svg ", `<svg role="img" aria-label="${esc(f.alt)}" `) : `<img src="${esc(f.img)}" alt="${esc(f.alt)}" loading="lazy">`}
          ${f.pie || f.credito ? `<figcaption>${f.pie ? esc(f.pie) : ""}${f.credito ? `<span class="fig-cred">${esc(f.credito)}</span>` : ""}</figcaption>` : ""}
        </figure>`).join("")}</div>` : "";
  const figsPaso = (id, i) => figuras((FIG[id] || []).filter((f) => f.paso === i));
  $("#skills").innerHTML = D.habilidades.map((h) => `
    <details class="card skill" id="hab-${h.id}">
      <summary><span class="skill-i" aria-hidden="true">${h.icono}</span><span><strong>${esc(h.titulo)}</strong> <span class="pill d7">${esc(h.nivel)}</span><br><span class="muted small">${esc(h.resumen)}</span></span></summary>
      <ol>${h.pasos.map((p, i) => `<li>${esc(p)}${figsPaso(h.id, i)}</li>`).join("")}</ol>
      ${figuras((FIG[h.id] || []).filter((f) => !(f.paso >= 0 && f.paso < h.pasos.length)))}
      ${h.seguridad.length ? `<ul class="calc-avisos">${h.seguridad.map((t) => `<li class="consejo">${esc(t)}</li>`).join("")}</ul>` : ""}
      ${h.id === "senales" ? `<p><a class="btn btn-xs" href="#morse">📡 Abrir el código Morse: tabla y emisor de SOS →</a></p>` : ""}
      <p class="small muted">Fuente: ${esc(h.fuente)}</p>
    </details>`).join("");

  /* ---------- Código Morse ---------- */
  const mIn = $("#morse-in"), mOut = $("#morse-out"), mFlash = $("#morse-flash");
  const verMorse = (c) => c.replace(/\./g, "·").replace(/-/g, "–");
  // Puntos y rayas dibujados (más legibles que los caracteres · y –); el texto accesible va en aria-label.
  // Cada letra va en un bloque que no se parte entre líneas; las palabras se separan con «/».
  const dibMorse = (c) => c.trim().split(/\s+/).map((l) => l === "/" ? '<i class="mw">/</i>'
    : `<span class="ml">${[...l].map((ch) => (ch === "." ? '<i class="md"></i>' : '<i class="mr"></i>')).join("")}</span>`).join("");
  $("#morse-table").innerHTML = C.MORSE_ORDEN.map((k) => { const v = C.MORSE[k]; return `<button type="button" class="morse-cell" data-m="${v}" aria-label="${esc(k)}: ${esc(v.replace(/\./g, "punto ").replace(/-/g, "raya ").trim())}"><b>${esc(k)}</b><span class="msym" aria-hidden="true">${dibMorse(v)}</span></button>`; }).join("");
  const traducir = () => {
    const r = C.aMorse(mIn.value);
    mOut.innerHTML = r.codigo ? `<span class="msym" aria-hidden="true">${dibMorse(r.codigo)}</span><span class="sr-only">${verMorse(r.codigo)}</span>` : " ";
    const w = $("#morse-warn");
    w.hidden = !r.desconocidos.length;
    w.textContent = r.desconocidos.length ? `Sin equivalente en Morse (se omite): ${r.desconocidos.join(" ")}` : "";
  };
  mIn.addEventListener("input", traducir);
  $("#morse-dec").addEventListener("input", (e) => ($("#morse-dec-out").textContent = C.deMorse(e.target.value) || " "));
  traducir();

  // Emisión: luz (pantalla completa), sonido (Web Audio) o vibración. Un solo emisor a la vez.
  let mTimers = [], mAudio = null, mOsc = null, mVibra = false;
  if (!("vibrate" in navigator)) $("#morse-vib").hidden = true;
  function pararMorse() {
    mTimers.forEach(clearTimeout); mTimers = [];
    if (mVibra) { navigator.vibrate(0); mVibra = false; }
    if (mOsc) { try { mOsc.stop(); } catch {} mOsc = null; }
    mFlash.hidden = true; mFlash.classList.remove("on");
    $("#morse-stop").hidden = true;
  }
  function emitir(modo, codigo, repetir) {
    pararMorse();
    const sec = C.secuenciaMorse(codigo);
    if (!sec.length) { mIn.focus(); return; }
    // Con luz, mínimo 200 ms por unidad: como mucho 2,5 destellos por segundo (WCAG 2.3.1 pide menos de 3).
    const u = Math.max(Number($("#morse-vel").value) || 200, modo === "luz" ? 200 : 0);
    const total = sec.reduce((t, [, n]) => t + n, 0) + 7; // + pausa de palabra antes de repetir
    $("#morse-stop").hidden = false;
    let set = () => {};
    if (modo === "luz") {
      $("#morse-flash-txt").textContent = verMorse(codigo);
      mFlash.hidden = false;
      set = (on) => mFlash.classList.toggle("on", on);
    } else if (modo === "sonido") {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      mAudio = mAudio || new AC();
      mAudio.resume();
      const g = mAudio.createGain(); g.gain.value = 0; g.connect(mAudio.destination);
      mOsc = mAudio.createOscillator(); mOsc.frequency.value = 650; mOsc.connect(g); mOsc.start();
      set = (on) => g.gain.setTargetAtTime(on ? 0.35 : 0, mAudio.currentTime, 0.004);
    } else if (modo === "vibrar") {
      const patron = sec.map(([, n]) => n * u);
      mVibra = true;
      const ciclo = () => { navigator.vibrate(patron); if (repetir) mTimers.push(setTimeout(ciclo, total * u)); else mTimers.push(setTimeout(pararMorse, (total - 7) * u)); };
      ciclo();
      return;
    }
    const ciclo = () => {
      let t = 0;
      for (const [on, n] of sec) { mTimers.push(setTimeout(() => set(on), t * u)); t += n; }
      mTimers.push(setTimeout(() => set(false), t * u));
      mTimers.push(setTimeout(repetir ? ciclo : pararMorse, (repetir ? total : t) * u));
    };
    ciclo();
  }
  $$("[data-emitir]").forEach((b) => b.addEventListener("click", () => {
    const sos = b.dataset.emitir === "sos";
    emitir(sos ? "luz" : b.dataset.emitir, sos ? C.SOS : C.aMorse(mIn.value).codigo, sos || $("#morse-rep").checked);
  }));
  $("#morse-table").addEventListener("click", (e) => {
    const c = e.target.closest("[data-m]");
    if (c) { mOut.innerHTML = `<span class="msym" aria-hidden="true">${dibMorse(c.dataset.m)}</span><span class="sr-only">${verMorse(c.dataset.m)}</span>`; emitir("sonido", c.dataset.m, false); }
  });
  $("#morse-stop").addEventListener("click", pararMorse);
  mFlash.addEventListener("click", pararMorse);
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#morse-stop").hidden) pararMorse(); });
  addEventListener("hashchange", () => { if (location.hash !== "#morse") pararMorse(); });

  /* ---------- Despensa: productos concretos ---------- */
  const DS = D.despensa;
  let despCat = "todo";
  let despLista = store.get("despensaLista", []);
  if (!Array.isArray(despLista)) despLista = [];
  despLista = despLista.filter((id) => DS.productos.some((x) => x.id === id));
  $("#desp-reglas").innerHTML = DS.reglas.map(([ic, t, txt]) => `<article class="desp-regla"><span aria-hidden="true">${ic}</span><div><h3>${esc(t)}</h3><p>${esc(txt)}</p></div></article>`).join("");
  $("#desp-cats").innerHTML = [["todo", "🛒", "Todo"], ...DS.categorias].map(([id, ic, n]) => `<button type="button" class="chip" data-dcat="${id}" aria-pressed="${id === despCat}"><span aria-hidden="true">${ic}</span> ${esc(n)}</button>`).join("");
  const catNombre = (id) => (DS.categorias.find((c) => c[0] === id) || [, , ""])[2];
  function renderDespensa() {
    const sinFuego = $("#desp-sinfuego").checked;
    const lista = DS.productos.filter((x) => (despCat === "todo" || x.cat === despCat) && (!sinFuego || !x.cocinar));
    $("#desp-count").textContent = `${plural(lista.length, "producto", "productos")}${sinFuego ? " que se comen sin cocinar" : ""}.`;
    $("#desp-grid").innerHTML = lista.map((x) => {
      const en = despLista.includes(x.id);
      return `<article class="card desp-item">
        <p class="desp-cat small muted">${esc(catNombre(x.cat))}</p>
        <h3>${esc(x.nombre)}</h3>
        <p class="desp-formato">${esc(x.formato)}</p>
        <p class="desp-tags"><span class="pill d7">⏳ ${esc(x.dura)}</span> <span class="pill ${x.cocinar ? "d3" : "d0"}">${x.cocinar ? "Hay que cocinar" : "Sin cocinar"}</span></p>
        ${x.al ? `<p class="small muted">Contiene: ${esc(x.al)}</p>` : ""}
        ${x.nota ? `<p class="small">${esc(x.nota)}</p>` : ""}
        <div class="desp-acc">
          <button type="button" class="btn btn-sm ${en ? "btn-primary" : "btn-ghost"}" data-dlista="${x.id}" aria-pressed="${en}">${en ? "✓ En la lista" : "＋ A la lista"}</button>
          <button type="button" class="btn btn-ghost btn-sm" data-dinv="${x.id}">Al inventario</button>
        </div>
      </article>`;
    }).join("") || `<p class="muted">No hay productos con ese filtro.</p>`;
    $("#desp-lista").innerHTML = despLista.map((id) => { const x = DS.productos.find((p) => p.id === id); return `<li><span><strong>${esc(x.nombre)}</strong> · ${esc(x.formato)}</span> <button type="button" class="btn-xs btn btn-ghost" data-dlista="${x.id}" aria-label="Quitar ${esc(x.nombre)} de la lista">Quitar</button></li>`; }).join("");
    $("#desp-lista-vacia").hidden = despLista.length > 0;
    contarReservas();
    $("#desp-vaciar").hidden = !despLista.length;
  }
  $("#desp-cats").addEventListener("click", (e) => {
    const b = e.target.closest("[data-dcat]");
    if (!b) return;
    despCat = b.dataset.dcat;
    $$("#desp-cats [data-dcat]").forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.dcat === despCat)));
    renderDespensa();
  });
  $("#desp-sinfuego").addEventListener("change", renderDespensa);
  $("#despensa").addEventListener("click", (e) => {
    const l = e.target.closest("[data-dlista]");
    if (l) {
      const id = l.dataset.dlista;
      despLista = despLista.includes(id) ? despLista.filter((x) => x !== id) : [...despLista, id];
      store.set("despensaLista", despLista);
      const enGrid = l.closest("#desp-grid");
      renderDespensa();
      if (enGrid) { const nb = $(`#desp-grid [data-dlista="${id}"]`); if (nb) nb.focus(); }
      return;
    }
    const v = e.target.closest("[data-dinv]");
    if (v) {
      // Rellena el formulario del inventario: solo falta la cantidad y la fecha de la etiqueta
      const x = DS.productos.find((p) => p.id === v.dataset.dinv);
      invForm.elements.nombre.value = `${x.nombre} (${x.formato})`.slice(0, 80);
      invForm.elements.tipo.value = TIPOS.some((t) => t.id === x.tipo) ? x.tipo : "otros";
      syncUnit();
      location.hash = "inventario";
      setTimeout(() => { invForm.elements.cantidad.focus(); invForm.elements.cantidad.select(); }, 50);
    }
  });
  // «Mi lista»: va siempre a la lista, también si ya estás en la Despensa (sin depender del cambio de #)
  $("#rb-lista").addEventListener("click", (e) => {
    const c = $("#desp-lista-card");
    if (c.offsetParent === null) return; // fuera de la Despensa: el router abre la vista y baja hasta la lista
    e.preventDefault();
    c.scrollIntoView({ block: "start" });
    const h = $("h3", c); h.tabIndex = -1; h.focus({ preventScroll: true });
  });
  $("#desp-vaciar").addEventListener("click", () => { despLista = []; store.set("despensaLista", despLista); renderDespensa(); });
  renderDespensa();

  /* ---------- Material por niveles ---------- */
  const M = D.material;
  let matHave = store.get("material", {});
  if (!matHave || typeof matHave !== "object") matHave = {};
  let matNivel = Number(store.get("materialNivel", 1));
  if (!M.niveles.some((n) => n.n === matNivel)) matNivel = 1;
  const matPct = (n) => { const it = M.items.filter((x) => x.nivel === n); return it.length ? Math.round(it.filter((x) => matHave[x.id]).length / it.length * 100) : 0; };
  function renderMaterial() {
    $("#mat-levels").innerHTML = M.niveles.map((l) => `<button type="button" role="tab" class="level" id="lvl-${l.n}" aria-selected="${l.n === matNivel}" tabindex="${l.n === matNivel ? 0 : -1}" aria-controls="mat-panel" data-nivel="${l.n}">
      <strong>${esc(l.nombre)}</strong><span>${esc(l.horizonte)}</span>
      <span class="progress" aria-hidden="true"><span style="width:${matPct(l.n)}%"></span></span><span class="small">${matPct(l.n)} %</span></button>`).join("");
    const nivel = M.niveles.find((l) => l.n === matNivel);
    const items = M.items.filter((x) => x.nivel === matNivel);
    $("#mat-panel").setAttribute("aria-labelledby", `lvl-${matNivel}`);
    $("#mat-panel").innerHTML = `<p class="mat-intro">${esc(nivel.texto)}</p>
      <div class="grid-cards">${M.categorias.map(([cid, ic, nombre]) => {
        const lista = items.filter((x) => x.cat === cid);
        return lista.length ? `<article class="card check-card"><h3><span aria-hidden="true">${ic}</span> ${esc(nombre)}</h3><ul>${lista.map((x) => `
          <li><label class="check"><input type="checkbox" data-mat="${x.id}"${matHave[x.id] ? " checked" : ""}> <span>${esc(x.texto)}${x.vida ? `<span class="mat-vida">⏳ ${esc(x.vida)}</span>` : ""}${x.nota ? `<span class="mat-nota">${esc(x.nota)}</span>` : ""}</span></label></li>`).join("")}</ul></article>` : "";
      }).join("")}</div>`;
  }
  $("#mat-levels").addEventListener("click", (e) => { const b = e.target.closest("[data-nivel]"); if (b) { matNivel = Number(b.dataset.nivel); store.set("materialNivel", matNivel); renderMaterial(); } });
  $("#mat-levels").addEventListener("keydown", (e) => {
    const n = M.niveles.length, k = matNivel - 1;
    const sig = { ArrowRight: (k + 1) % n, ArrowLeft: (k + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (sig == null) return;
    e.preventDefault();
    matNivel = sig + 1;
    store.set("materialNivel", matNivel); renderMaterial(); $(`#lvl-${matNivel}`).focus();
  });
  $("#mat-panel").addEventListener("change", (e) => {
    const id = e.target.dataset.mat;
    if (!id) return;
    if (e.target.checked) matHave[id] = true; else delete matHave[id];
    store.set("material", matHave);
    $$("#mat-levels .level").forEach((b) => { const p = matPct(Number(b.dataset.nivel)); b.querySelector(".progress span").style.width = p + "%"; b.querySelector(".small").textContent = p + " %"; });
  });
  renderMaterial();

  /* ---------- Panel de inicio ---------- */
  const TILES = [
    ["calculadora", "🧮", "Calculadora", "Agua, comida y suministros para tu hogar, con cifras oficiales."],
    ["despensa", "🥫", "Despensa: qué comprar", "Latas, embutidos curados y otros productos que aguantan sin nevera."],
    ["menu", "🍽️", "Menú de ejemplo", "Cómo comerse la reserva, con o sin hornillo."],
    ["inventario", "📦", "Inventario", "Lo que tienes, lo que falta y lo que caduca."],
    ["mochila", "🎒", "Mochilas", "La de 72 horas y la bolsa para volver a casa."],
    ["material", "🧰", "Material por niveles", "Linternas, pilas, hornillo, filtros, comida deshidratada…"],
    ["habilidades", "🔥", "Habilidades", "Fuego, refugio, nudos, orientación, primeros auxilios, señales."],
    ["guias", "📘", "Guías", "Qué hacer en un apagón, inundación, ola de calor…"],
    ["agua", "💧", "Agua potable", "Guardarla y potabilizarla sin equivocarse."],
    ["mapas", "🧭", "Mapas sin conexión", "Tus puntos de encuentro con el GPS, sin datos."],
    ["plan", "👪", "Plan familiar", "Puntos de encuentro, contactos y qué hacer sin teléfono."],
    ["aprende", "🧠", "Consejos y comunidad", "Lecciones de preparacionistas y mitos."],
    ["morse", "📡", "Código Morse", "Tabla, traductor y SOS con luz, sonido o vibración."],
    ["paises", "🌍", "Recomendaciones por país", "Mapa del mundo: cuántos días pide cada gobierno, con su fuente."],
    ["noticias", "📰", "Noticias", "Actualidad sobre emergencias, recopilada cada 6 horas."],
  ];
  $("#tiles").innerHTML = TILES.map(([id, ic, t, d]) => `<a class="tile" href="#${id}"><span class="tile-i" aria-hidden="true">${ic}</span><strong>${esc(t)}</strong><span>${esc(d)}</span></a>`).join("");
  function renderPanel() {
    const baseIds = D.checklist.filter((c) => !c.extra && !c.gethome).flatMap((c) => c.items.map((i) => i.id));
    const mochila = Math.round(baseIds.filter((id) => checked[id]).length / baseIds.length * 100);
    const caducan = inv.filter((it) => { const d = diasHasta(it.caduca); return d != null && d <= 30; }).length;
    const last = store.get("lastReview", null);
    let revision = "Sin registrar", revCls = "warn";
    if (last) { const n = new Date(last); n.setMonth(n.getMonth() + 6); const dl = Math.ceil((n - new Date()) / 86400000); revision = dl < 0 ? "¡Toca revisar!" : `En ${plural(dl, "día", "días")}`; revCls = dl < 0 ? "warn" : "ok"; }
    const planData = store.get("plan", {});
    const planHechos = Object.values(planData).filter((v) => String(v).trim()).length;
    const planTotal = $$("input[name], textarea[name]", planForm).length;
    const r = lastResult;
    const stats = [
      ["calculadora", "Reserva calculada", r && !r.vacio ? `${fmt(r.agua.total, 1)} L · ${fmt(r.kgComida, 1)} kg` : "Sin calcular", r && !r.vacio ? `${r.dias === 3 ? "72 horas" : r.dias + " días"}, ${plural(r.personas, "persona", "personas")}` : "Empieza por aquí", ""],
      ["mochila", "Mochila de 72 h", `${mochila} %`, "de lo esencial", mochila === 100 ? "ok" : ""],
      ["inventario", "Inventario", plural(inv.length, "producto", "productos"), caducan ? `${caducan} caducan o han caducado` : "Nada caduca en 30 días", caducan ? "warn" : ""],
      ["material", "Material", `Nivel ${[1, 2, 3].find((n) => matPct(n) < 100) || 3}`, `${matPct(1)} % · ${matPct(2)} % · ${matPct(3)} % por nivel`, matPct(1) === 100 ? "ok" : ""],
      ["mochila", "Próxima revisión", revision, "cada 6 meses", revCls],
      ["plan", "Plan familiar", `${planHechos}/${planTotal}`, "apartados rellenados", planHechos === planTotal ? "ok" : ""],
      ["mapas", "Mis puntos", String(puntos.length), puntos.length ? "guardados para orientarte" : "Guarda tus puntos de encuentro", ""],
    ];
    $("#panel-stats").innerHTML = stats.map(([id, t, v, sub, cls]) => `<a class="pstat ${cls}" href="#${id}"><span class="pstat-t">${esc(t)}</span><strong>${esc(v)}</strong><span class="pstat-s">${esc(sub)}</span></a>`).join("");
  }

  /* ---------- Navegación por secciones (una vista cada vez) ---------- */
  const VISTAS = new Set($$("[data-view]").map((el) => el.dataset.view));
  const TITULOS = { inicio: "Inicio", calculadora: "Calculadora", despensa: "Despensa: qué comprar", menu: "Menú de ejemplo", inventario: "Inventario", mochila: "Mochilas", material: "Material por niveles", habilidades: "Habilidades", guias: "Guías", agua: "Agua potable", mapas: "Mapas sin conexión", plan: "Plan familiar", aprende: "Consejos y comunidad", paises: "Recomendaciones por país", morse: "Código Morse", noticias: "Noticias", fuentes: "Fuentes" };
  const tituloBase = document.title;
  const vistaH1 = $("#vista-h1");
  let vistaActual = null;
  function vistaDe(hash) {
    if (!hash) return { vista: "inicio", el: null };
    if (/^guia-/.test(hash)) return { vista: "guias", el: null };
    const el = document.getElementById(hash);
    const sec = el && el.closest("[data-view]");
    if (sec) return { vista: sec.dataset.view, el: sec === el && sec.dataset.view === hash ? null : el };
    if (VISTAS.has(hash)) return { vista: hash, el: null };
    return null; // enlaces internos sin vista (p. ej. #main): no cambian de pantalla
  }
  function route() {
    const hash = decodeURIComponent(location.hash.slice(1));
    const v = vistaDe(hash);
    if (!v) return;
    const cambio = v.vista !== vistaActual;
    vistaActual = v.vista;
    $$("[data-view]").forEach((el) => (el.hidden = el.dataset.view !== v.vista));
    $$("[data-nav]").forEach((a) => { if (a.dataset.nav === v.vista) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    document.title = v.vista === "inicio" ? tituloBase : `${TITULOS[v.vista] || ""} · Preparados72h`;
    // Encabezado principal de la vista (oculto a la vista; las secciones usan h2)
    vistaH1.hidden = v.vista === "inicio";
    vistaH1.textContent = TITULOS[v.vista] || "";
    if (v.vista === "inicio") renderPanel();
    $("#reservas-bar").hidden = !["despensa", "inventario", "calculadora", "menu"].includes(v.vista);
    if (v.vista === "inventario") $("#rb-desp").setAttribute("aria-current", "page"); else $("#rb-desp").removeAttribute("aria-current");
    nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); $("#tab-more").setAttribute("aria-expanded", "false");
    // Primer elemento de la vista para el foco (lectores de pantalla) y posición de la página
    if (v.el && !(v.el.matches("section"))) v.el.scrollIntoView();
    else if (cambio) { scrollTo(0, 0); const h = v.vista === "inicio" ? $(".hero h1") : vistaH1; if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); } }
  }
  document.documentElement.classList.add("router");
  addEventListener("hashchange", route);
  $("#tab-more").addEventListener("click", (e) => {
    e.stopPropagation();
    const open = nav.classList.toggle("open");
    $("#tab-more").setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", (e) => { if (nav.classList.contains("open") && !e.target.closest("#nav, .menu-btn, #tab-more")) { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); $("#tab-more").setAttribute("aria-expanded", "false"); } });

  /* ---------- Impresión por sección ---------- */
  const printArea = $("#print-area");
  function buildPlanPrint() {
    const v = (n) => esc(planForm.elements[n].value.trim() || "—").replace(/\n/g, "<br>");
    return `<h1>Plan familiar de emergencia</h1>
      <table class="print-table">
        <tr><th>Punto de encuentro cercano</th><td>${v("encuentro1")}</td></tr>
        <tr><th>Punto de encuentro fuera del barrio</th><td>${v("encuentro2")}</td></tr>
        <tr><th>Contacto fuera de la zona</th><td>${v("contactoFuera")}</td></tr>
        <tr><th>Centro de salud u hospital</th><td>${v("hospital")}</td></tr>
        <tr><th>Recogida de los niños</th><td>${v("ninos")}</td></tr>
        <tr><th>Mascotas</th><td>${v("mascotas")}</td></tr>
        <tr><th>Contactos de emergencia</th><td>${v("contactos")}</td></tr>
        <tr><th>Si no hay teléfono</th><td>${v("sinTelefono")}</td></tr>
        <tr><th>Necesidades médicas y alergias</th><td>${v("medico")}</td></tr>
      </table>
      <p>Emergencias: ${esc(telTexto)}. Impreso el ${new Date().toLocaleDateString("es-ES")}.</p>`;
  }
  function buildChecklistPrint() {
    const cats = visibleCats();
    return `<h1>Mochila de 72 horas: checklist</h1>` + cats.map((c) => `<h2>${esc(c.categoria)}</h2><ul class="print-check">${
      c.items.map((i) => `<li>${checked[i.id] ? "☑" : "☐"} ${esc(i.texto)}</li>`).join("")}</ul>`).join("") +
      `<p>Revisar cada 6 meses. Impreso el ${new Date().toLocaleDateString("es-ES")}.</p>`;
  }
  function buildCalcPrint() {
    const r = $("#calc-result").cloneNode(true);
    r.querySelectorAll("[hidden]").forEach((el) => el.parentNode.removeChild(el));
    const h = r.querySelector("#calc-title"); if (h) h.outerHTML = `<h2>${esc(h.textContent)}</h2>`;
    return `<h1>Reservas del hogar</h1>${r.innerHTML}<p>Estimación orientativa de Preparados72h · ${new Date().toLocaleDateString("es-ES")}</p>`;
  }
  function buildMenuPrint() {
    const m = C.menu(lastRaw || {});
    return `<h1>Menú de ejemplo · ${m.dias.length} días</h1>` + m.dias.map((d) => `<h2>Día ${d.dia} (${d.cocina ? "con hornillo" : "sin cocinar"})</h2><ul>${
      d.comidas.map((c) => `<li><strong>${esc(c.nombre)}:</strong> ${esc(c.texto)}</li>`).join("")}</ul>`).join("") +
      m.notas.map((t) => `<p>${esc(t)}</p>`).join("") + `<p>Preparados72h · ${new Date().toLocaleDateString("es-ES")}</p>`;
  }
  function buildInventoryPrint() {
    const rows = [...inv].sort((a, b) => (a.caduca || "9999").localeCompare(b.caduca || "9999"))
      .map((it) => `<tr><td>${esc(it.nombre)}</td><td>${fmt(Number(it.cantidad), 1)} ${esc(tipo(it.tipo).unidad)}</td><td>${esc(estado(it).txt)}</td></tr>`).join("");
    return `<h1>Inventario de la reserva</h1><table class="print-table"><tr><th>Producto</th><th>Cantidad</th><th>Caducidad</th></tr>${rows || '<tr><td colspan="3">Sin productos</td></tr>'}</table>
      <p>Impreso el ${new Date().toLocaleDateString("es-ES")}. Revisa las caducidades cada 6 meses.</p>`;
  }
  function buildGuidePrint() {
    const g = D.guias.find((x) => x.id === guiaSel);
    const l = (t, items) => items.length ? `<h2>${t}</h2><ol>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>` : "";
    return `<h1>${esc(g.titulo)}</h1><p>${esc(g.resumen)}</p>${l("Antes", g.antes)}${l("Durante", g.durante)}${l("Después", g.despues)}<p>Emergencias: ${esc(telTexto)}.</p>`;
  }
  function buildMaterialPrint() {
    const l = M.niveles.find((x) => x.n === matNivel);
    return `<h1>Material · ${esc(l.nombre)}</h1><p>${esc(l.horizonte)}. ${esc(l.texto)}</p>` + M.categorias.map(([cid, , nombre]) => {
      const lista = M.items.filter((x) => x.nivel === matNivel && x.cat === cid);
      return lista.length ? `<h2>${esc(nombre)}</h2><ul class="print-check">${lista.map((x) => `<li>${matHave[x.id] ? "☑" : "☐"} ${esc(x.texto)}${x.vida ? ` (${esc(x.vida)})` : ""}</li>`).join("")}</ul>` : "";
    }).join("") + `<p>Impreso el ${new Date().toLocaleDateString("es-ES")}.</p>`;
  }
  function buildPuntosPrint() {
    const rows = puntos.map((p) => `<tr><td>${esc(p.nombre)}</td><td>${p.lat.toFixed(5)}, ${p.lon.toFixed(5)}</td><td>${esc(p.nota || "")}</td></tr>`).join("");
    return `<h1>Mis puntos</h1><table class="print-table"><tr><th>Punto</th><th>Coordenadas</th><th>Notas</th></tr>${rows || '<tr><td colspan="3">Sin puntos</td></tr>'}</table>
      <p>Las coordenadas se pueden escribir en cualquier app de mapas o GPS. Impreso el ${new Date().toLocaleDateString("es-ES")}.</p>`;
  }
  function buildDespensaPrint() {
    const items = despLista.map((id) => DS.productos.find((p) => p.id === id));
    return `<h1>Lista de la compra para la despensa</h1>` + (items.length
      ? DS.categorias.map(([cid, , nombre]) => { const l = items.filter((x) => x.cat === cid); return l.length ? `<h2>${esc(nombre)}</h2><ul class="print-check">${l.map((x) => `<li>☐ ${esc(x.nombre)}: ${esc(x.formato)} (dura ${esc(x.dura)})</li>`).join("")}</ul>` : ""; }).join("")
      : "<p>La lista está vacía.</p>") + `<p>Compra solo lo que coméis y rótalo. Las cantidades, en la calculadora. Impreso el ${new Date().toLocaleDateString("es-ES")}.</p>`;
  }
  const BUILDERS = { despensa: buildDespensaPrint, plan: buildPlanPrint, mochila: buildChecklistPrint, calculadora: buildCalcPrint, menu: buildMenuPrint, inventario: buildInventoryPrint, guia: buildGuidePrint, puntos: buildPuntosPrint, material: buildMaterialPrint };

  // Dentro de un iframe aislado (p. ej. un artifact) no se puede imprimir: se copia el texto.
  let embedded = false;
  try { embedded = window.top !== window.self; } catch { embedded = true; }
  if (NATIVE) $$("[data-print]").forEach((b) => (b.textContent = "Compartir"));
  else if (embedded) $$("[data-print]").forEach((b) => (b.textContent = "Copiar texto"));
  const SHARE_TITLES = { despensa: "Lista de la compra para la despensa", plan: "Plan familiar de emergencia", mochila: "Checklist de la mochila de 72 h", calculadora: "Reservas del hogar", menu: "Menú de ejemplo", inventario: "Inventario de la reserva", guia: "Guía de emergencia", puntos: "Mis puntos", material: "Material por niveles" };
  // Los botones de imprimir que se pintan después (guías) también deben cambiar de texto
  const printLabel = NATIVE ? "Compartir" : embedded ? "Copiar texto" : null;
  if (printLabel) new MutationObserver(() => $$("[data-print]").forEach((b) => { if (!b.dataset.labeled) { b.dataset.labeled = "1"; b.textContent = printLabel; } })).observe(document.body, { childList: true, subtree: true });

  function htmlToText(html) {
    const tmp = document.createElement("div");
    tmp.style.cssText = "position:fixed;left:-9999px;top:0;width:600px";
    tmp.innerHTML = html;
    document.body.appendChild(tmp);
    const txt = tmp.innerText.replace(/\n{3,}/g, "\n\n").trim();
    document.body.removeChild(tmp);
    return txt;
  }
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-print]");
    if (!btn) return;
    const which = btn.dataset.print;
    const html = (BUILDERS[which] || buildCalcPrint)();
    const Share = plugin("Share");
    if (Share) {
      // En la app: menú de compartir de Android (WhatsApp, correo, Drive, notas…)
      try { await Share.share({ title: SHARE_TITLES[which], text: htmlToText(html), dialogTitle: "Compartir " + SHARE_TITLES[which].toLowerCase() }); }
      catch { /* el usuario canceló */ }
      return;
    }
    if (embedded) {
      const label = btn.textContent;
      try { await navigator.clipboard.writeText(htmlToText(html)); btn.textContent = "Copiado ✓"; }
      catch { btn.textContent = "No se pudo copiar"; }
      setTimeout(() => (btn.textContent = label), 1800);
      return;
    }
    printArea.innerHTML = html;
    document.body.classList.add("printing");
    window.print();
  });
  addEventListener("afterprint", () => { document.body.classList.remove("printing"); printArea.innerHTML = ""; });

  route(); // primera vista según la dirección (#calculadora, #guias…)

  /* ---------- Offline (PWA) ---------- */
  try {
    if (!embedded && !NATIVE && "serviceWorker" in navigator && location.protocol.startsWith("http")) {
      const sw = navigator.serviceWorker;
      const reg = sw.register("sw.js").catch(() => null);
      // El navegador solo busca una versión nueva al cargar la página. En el móvil la pestaña se queda abierta
      // días enteros: se comprueba también al volver a ella y al recuperar la conexión.
      const buscar = () => reg.then((r) => r && r.update()).catch(() => {});
      addEventListener("visibilitychange", () => { if (!document.hidden) buscar(); });
      addEventListener("online", buscar);
      // Cuando se activa la versión nueva, la página abierta sigue con el código antiguo: se recarga una vez.
      // Si estás escribiendo, espera a que salgas del campo o de la pestaña (lo escrito ya está guardado).
      if (sw.controller) {
        let hecho = false;
        const recargar = () => {
          if (hecho) return;
          if (!document.hidden && document.activeElement?.matches("input, textarea, select")) {
            document.activeElement.addEventListener("blur", recargar, { once: true });
            return;
          }
          hecho = true; location.reload();
        };
        sw.addEventListener("controllerchange", recargar);
      }
    }
  } catch { /* sin service worker */ }
})();
