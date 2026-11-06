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

  // App Android (Capacitor): los plugins nativos se exponen en window.Capacitor.Plugins
  const Cap = window.Capacitor;
  const NATIVE = !!(Cap && typeof Cap.isNativePlatform === "function" && Cap.isNativePlatform());
  const plugin = (name) => (NATIVE && Cap.Plugins && Cap.Plugins[name]) || null;
  if (NATIVE) document.documentElement.classList.add("native");

  /* ---------- SOS ---------- */
  const sosBtn = $("#sos-btn"), sosMenu = $("#sos-menu");
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
    ["3 L", "de agua por persona y día"],
    ["72 h", "es el mínimo recomendado"],
    ["10 días", "recomienda Alemania"],
    ["6 meses", "entre revisiones"],
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
  const temas = ["Todas", ...new Set(newsItems.map((n) => n.tema))];
  let temaSel = "Todas";
  function renderNews() {
    $("#news-chips").innerHTML = temas.length > 2 ? temas.map((t) => `<button type="button" class="chip" aria-pressed="${t === temaSel}" data-tema="${esc(t)}">${esc(t)}</button>`).join("") : "";
    const list = newsItems.filter((n) => temaSel === "Todas" || n.tema === temaSel);
    $("#news-list").innerHTML = list.length ? list.map((n) => `
      <li><a href="${esc(n.enlace)}" target="_blank" rel="noopener noreferrer">
        <span class="meta"><span class="tag">${esc(n.tema)}</span><span>${esc(n.fuente)}</span><span>· ${rel(n.fecha)}</span></span>
        <span class="t">${esc(n.titulo)}</span>
      </a></li>`).join("") : `<li class="news-empty">Aún no hay noticias recopiladas.</li>`;
  }
  $("#news-chips").addEventListener("click", (e) => { const b = e.target.closest("[data-tema]"); if (b) { temaSel = b.dataset.tema; renderNews(); } });
  renderNews();

  /* ---------- Calculadora (lógica en assets/calc.js, con tests) ---------- */
  const C = window.PrepCalc;
  const form = $("#calc-form");
  const PERSONAS = ["adultos", "ninos", "bebes", "mayores", "perros", "gatos"];
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
    v.todaLaFamilia = form.elements.todaLaFamilia.checked;
    v.necesidades = {};
    for (const n of C.NECESIDADES) {
      if ($(`[data-need-check="${n.id}"]`, form).checked) v.necesidades[n.id] = $(`[data-need-n="${n.id}"]`, form).value;
    }
    return v;
  }

  function writeForm(v) {
    const dias = C.HORIZONTES.includes(Number(v.dias)) ? String(v.dias) : "3";
    $$('input[name="dias"]', form).forEach((r) => (r.checked = r.value === dias));
    // Solo se escriben los campos presentes: lo que falte conserva el valor por defecto del formulario
    for (const k of PERSONAS) if (v[k] != null && v[k] !== "") form.elements[k].value = C.sanear({ [k]: v[k] })[k];
    form.elements.lactancia.checked = !!v.lactancia;
    form.elements.medicacion.checked = !!v.medicacion;
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
    const max = Math.max(1, s.adultos + s.ninos + s.mayores);
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

  function calc() {
    const raw = readForm();
    const r = C.compute(raw);
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
      return;
    }
    const mascotas = [i.perros && plural(i.perros, "perro", "perros"), i.gatos && plural(i.gatos, "gato", "gatos")].filter(Boolean).join(" y ");
    $("#calc-title").textContent = `Para ${r.dias === 3 ? "72 horas" : r.dias + " días"} · ${plural(r.personas, "persona", "personas")}${mascotas ? " y " + mascotas : ""}`;
    $("#calc-big").innerHTML = `
      <div><strong>${fmt(r.agua.total, 1)} L</strong><span>de agua (${plural(r.agua.garrafas5L, "garrafa", "garrafas")} de 5 L)</span></div>
      ${r.kcal.total ? `<div><strong>${fmt(r.kcal.total)}</strong><span>kcal en total (unos ${fmt(r.kgComida, 1)} kg de comida)</span></div>`
                     : `<div><strong>Bebés</strong><span>su alimentación va aparte (más abajo)</span></div>`}`;

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
  }

  form.addEventListener("input", calc);
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
  calc();

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
    $(".progress").setAttribute("aria-valuenow", pct);
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

  $("#paises-body").innerHTML = D.paises.map((p) => `
    <tr data-dias="${p.dias}" tabindex="0"><td>${esc(p.region)}</td><td><span class="pill d${p.dias}">${esc(p.horizonte)}</span></td><td class="go">Calcular →</td></tr>`).join("");
  const useCountry = (tr) => {
    $$('input[name="dias"]', form).forEach((r) => (r.checked = r.value === tr.dataset.dias));
    calc();
    $("#calculadora").scrollIntoView({ behavior: "smooth" });
  };
  $("#paises-body").addEventListener("click", (e) => { const tr = e.target.closest("tr"); if (tr) useCountry(tr); });
  $("#paises-body").addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); const tr = e.target.closest("tr"); if (tr) useCountry(tr); } });

  $("#lessons").innerHTML = D.comunidad.map((l) => `
    <article class="lesson"><span class="lesson-i" aria-hidden="true">${l.icono}</span><div><h3>${esc(l.titulo)}</h3><p>${esc(l.texto)}</p></div></article>`).join("");
  $("#myths").innerHTML = D.mitos.map((m) => `
    <article class="myth"><p class="myth-m"><span class="badge badge-myth">Mito</span> ${esc(m.mito)}</p><p class="myth-r"><span class="badge badge-real">Realidad</span> ${esc(m.realidad)}</p></article>`).join("");

  $("#fuentes-list").innerHTML = D.fuentes.map((f) => `<li>${esc(f)}</li>`).join("");

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
      <p>Emergencias: 112 (UE) · 911 (México). Impreso el ${new Date().toLocaleDateString("es-ES")}.</p>`;
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
  // Dentro de un iframe aislado (p. ej. un artifact) no se puede imprimir: se copia el texto.
  let embedded = false;
  try { embedded = window.top !== window.self; } catch { embedded = true; }
  if (NATIVE) $$("[data-print]").forEach((b) => (b.textContent = "Compartir"));
  else if (embedded) $$("[data-print]").forEach((b) => (b.textContent = "Copiar texto"));
  const SHARE_TITLES = { plan: "Plan familiar de emergencia", mochila: "Checklist de la mochila de 72 h", calculadora: "Reservas del hogar" };

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
    const html = which === "plan" ? buildPlanPrint() : which === "mochila" ? buildChecklistPrint() : buildCalcPrint();
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

  /* ---------- Offline (PWA) ---------- */
  try {
    if (!embedded && !NATIVE && "serviceWorker" in navigator && location.protocol.startsWith("http")) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  } catch { /* sin service worker */ }
})();
