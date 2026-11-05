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

  /* ---------- Calculadora ---------- */
  const form = $("#calc-form");
  const savedCalc = store.get("calc", null);
  if (savedCalc) {
    for (const [k, v] of Object.entries(savedCalc)) {
      const el = form.elements[k];
      if (!el) continue;
      if (k === "dias") $$('input[name="dias"]', form).forEach((r) => (r.checked = r.value === String(v)));
      else if (el.type === "checkbox") el.checked = !!v;
      else el.value = v;
    }
  }
  const num = (name) => Math.max(0, Math.min(99, parseInt(form.elements[name].value, 10) || 0));

  function calc() {
    const dias = parseInt($('input[name="dias"]:checked', form).value, 10);
    const a = num("adultos"), n = num("ninos"), b = num("bebes"), m = num("mayores"), p = num("mascotas");
    const med = form.elements.medicacion.checked;
    const personas = a + n + b + m;
    store.set("calc", { dias, adultos: a, ninos: n, bebes: b, mayores: m, mascotas: p, medicacion: med });

    const aguaPersonas = personas * 3 * dias;
    const aguaMascotas = p * 1 * dias;
    const agua = aguaPersonas + aguaMascotas;
    const kcal = ((a + m) * 2000 + n * 1400) * dias;
    const kgComida = kcal / 2500; // mezcla de conservas y alimentos secos ≈ 2,5 kcal/g
    const latas = Math.ceil(kcal / 400); // ración equivalente ≈ 400 kcal

    $("#calc-title").textContent = `Para ${dias === 3 ? "72 horas" : dias + " días"} · ${personas} ${personas === 1 ? "persona" : "personas"}${p ? ` y ${p} ${p === 1 ? "mascota" : "mascotas"}` : ""}`;
    $("#calc-big").innerHTML = `
      <div><strong>${fmt(agua)} L</strong><span>de agua (${fmt(Math.ceil(agua / 5))} garrafas de 5 L)</span></div>
      <div><strong>${fmt(kcal)}</strong><span>kcal en total (unos ${fmt(kgComida, 1)} kg de comida)</span></div>`;

    const items = [];
    if (personas === 0 && p === 0) items.push("Añade al menos una persona para calcular.");
    else {
      items.push(`<b>${fmt(latas)}</b> raciones no perecederas (conservas, legumbres, barras… de unas 400 kcal cada una)`);
      items.push(`<b>${Math.max(1, a + m)}</b> ${a + m === 1 ? "linterna" : "linternas"} y <b>${2 + Math.floor(dias / 3)}</b> juegos de pilas de repuesto`);
      items.push(`<b>1</b> radio de pilas o de manivela y <b>${Math.max(1, Math.ceil((a + m) / 2))}</b> ${Math.ceil((a + m) / 2) > 1 ? "baterías externas" : "batería externa"}`);
      items.push(`<b>${personas}</b> ${personas === 1 ? "manta térmica" : "mantas térmicas"} y <b>${Math.max(1, Math.ceil((personas * dias) / 4))}</b> rollos de papel higiénico`);
      items.push(`Efectivo en billetes pequeños para <b>${dias}</b> días de compras básicas`);
      if (b) items.push(`<b>${fmt(b * 7 * dias)}</b> pañales y leche de fórmula para ${dias} días (prepárala con agua embotellada)`);
      if (m) items.push(`Personas mayores: gafas de repuesto, audífonos con pilas y ayudas técnicas`);
      if (med || m) items.push(`Medicación para <b>${dias + 7}</b> días (horizonte + 1 semana de margen) y copia de las recetas`);
      if (p) items.push(`Mascotas: <b>${fmt(aguaMascotas)} L</b> de agua (incluidos arriba), comida para ${dias} días, correa y transportín`);
    }
    $("#calc-list").innerHTML = items.map((i) => `<li>${i}</li>`).join("");
  }
  form.addEventListener("input", calc);
  form.addEventListener("change", calc);
  form.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-step]");
    if (!btn) return;
    const input = form.elements[btn.dataset.for];
    const v = (parseInt(input.value, 10) || 0) + parseInt(btn.dataset.step, 10);
    input.value = Math.max(+input.min, Math.min(+input.max, v));
    calc();
  });
  calc();

  /* ---------- Checklist ---------- */
  let checked = store.get("checklist", {});
  const showExtra = $("#show-extra");
  showExtra.checked = store.get("showExtra", false);

  function renderChecklist() {
    const cats = D.checklist.filter((c) => !c.extra || showExtra.checked);
    $("#checklist").innerHTML = cats.map((c) => `
      <article class="card check-card${c.extra ? " extra" : ""}">
        <h3><span aria-hidden="true">${c.icono}</span> ${esc(c.categoria)}</h3>
        <ul>${c.items.map((it) => `
          <li><label class="check"><input type="checkbox" data-id="${it.id}"${checked[it.id] ? " checked" : ""}> <span>${esc(it.texto)}</span></label></li>`).join("")}
        </ul>
      </article>`).join("");
    updateProgress();
  }
  function updateProgress() {
    const ids = D.checklist.filter((c) => !c.extra || showExtra.checked).flatMap((c) => c.items.map((i) => i.id));
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
  $("#review-btn").addEventListener("click", () => { store.set("lastReview", new Date().toISOString()); renderReview(); });
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
    const cats = D.checklist.filter((c) => !c.extra || showExtra.checked);
    return `<h1>Mochila de 72 horas: checklist</h1>` + cats.map((c) => `<h2>${esc(c.categoria)}</h2><ul class="print-check">${
      c.items.map((i) => `<li>${checked[i.id] ? "☑" : "☐"} ${esc(i.texto)}</li>`).join("")}</ul>`).join("") +
      `<p>Revisar cada 6 meses. Impreso el ${new Date().toLocaleDateString("es-ES")}.</p>`;
  }
  function buildCalcPrint() {
    return `<h1>Reservas del hogar</h1><h2>${esc($("#calc-title").textContent)}</h2>${$("#calc-big").outerHTML}<ul>${$("#calc-list").innerHTML}</ul>`;
  }
  // Dentro de un iframe aislado (p. ej. un artifact) no se puede imprimir: se copia el texto.
  let embedded = false;
  try { embedded = window.top !== window.self; } catch { embedded = true; }
  if (embedded) $$("[data-print]").forEach((b) => (b.textContent = "Copiar texto"));

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
    if (!embedded && "serviceWorker" in navigator && location.protocol.startsWith("http")) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  } catch { /* sin service worker */ }
})();
