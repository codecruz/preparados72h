// Tests de la calculadora de reservas: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const C = require("../portal/assets/calc.js");

const run = (inp) => C.compute(inp);
const grupo = (r, id) => r.grupos.find((g) => g.id === id);
const sum = (r, id) => r.suministros.find((s) => s.id === id)?.texto;

test("caso por defecto: 2 adultos + 1 niño, 72 h", () => {
  const r = run({ dias: 3, adultos: 2, ninos: 1 });
  assert.equal(r.personas, 3);
  // 2 adultos × 3 L + 1 niño × 2,5 L (bebida + cocina + higiene), 3 días
  assert.equal(r.agua.total, 25.5);
  assert.equal(r.agua.garrafas5L, 6);
  assert.equal(r.kcal.dia, 2 * 2200 + 1800);
  assert.equal(r.kcal.total, 6200 * 3);
  assert.equal(r.vacio, false);
});

test("horizonte inválido o en texto", () => {
  assert.equal(run({ dias: 5, adultos: 1 }).dias, 3);
  assert.equal(run({ dias: undefined, adultos: 1 }).dias, 3);
  assert.equal(run({ dias: "7", adultos: 1 }).dias, 7);
  assert.equal(run({ dias: 10, adultos: 1 }).dias, 10);
});

test("saneado de números: negativos, decimales, texto, límites", () => {
  const i = C.sanear({ adultos: -3, ninos: "2.7", bebes: 50, mayores: "abc", perrosMed: NaN, gatos: Infinity });
  assert.deepEqual([i.adultos, i.ninos, i.bebes, i.mayores, i.perros, i.gatos], [0, 2, 10, 0, 0, 0]); // Infinity no es un número válido → 0
  assert.equal(C.sanear({ adultos: 999 }).adultos, 20);
  assert.equal(C.sanear({ adultos: "" }).adultos, 0);
});

test("hogar vacío y hogar solo con mascotas", () => {
  const r = run({});
  assert.equal(r.vacio, true);
  assert.match(r.avisos[0].texto, /al menos una persona/);
  const m = run({ perros: 2 });
  assert.equal(m.vacio, true);
  assert.match(m.avisos[0].texto, /no solo para las mascotas/);
});

test("solo bebés: avisa de que no hay adultos y no rompe", () => {
  const r = run({ bebes: 1 });
  assert.equal(r.vacio, false);
  assert.ok(r.avisos.some((a) => /ningún adulto/.test(a.texto)));
  assert.equal(r.kcal.total, 0);
  assert.equal(r.grupos.length, 0);
  assert.equal(r.agua.total, 4.5); // 1,5 L/día por bebé (biberones y su limpieza)
  assert.match(sum(r, "panales"), /21 pañales/);
});

test("plurales correctos con una sola persona", () => {
  const r = run({ dias: 3, adultos: 1 });
  assert.match(sum(r, "luz"), /^1 linterna y 3 juegos/);
  assert.match(sum(r, "energia"), /1 batería externa$/);
  assert.match(sum(r, "abrigo"), /^1 manta térmica y 1 rollo de/);
  assert.match(sum(r, "efectivo"), /3 días/);
  const r7 = run({ dias: 7, adultos: 2 });
  assert.match(sum(r7, "abrigo"), /2 mantas térmicas y 5 rollos/);
});

test("mascotas: el agua del perro depende de su tamaño", () => {
  const r = run({ dias: 7, adultos: 1, perrosPeq: 1, perrosMed: 1, perrosGra: 1, gatos: 1 });
  assert.equal(r.entrada.perros, 3);
  assert.equal(r.agua.perros, (0.4 + 1 + 2) * 7);
  assert.equal(r.agua.gatos, 2.1);
  assert.equal(r.agua.total, 21 + 23.8 + 2.1);
  assert.match(sum(r, "gatos"), /2,1 L/);
  assert.match(sum(r, "perros"), /^Perros: .*23,8 L/);
});

test("compatibilidad: el antiguo campo «perros» cuenta como perro mediano", () => {
  const i = C.sanear({ adultos: 1, perros: 2 });
  assert.equal(i.perrosMed, 2);
  assert.equal(i.perros, 2);
  assert.equal(C.sanear({ adultos: 1, perros: 2, perrosMed: 1 }).perrosMed, 1);
});

test("personas mayores: 1.900 kcal, 2 L de bebida y medicación", () => {
  const r = run({ dias: 3, mayores: 2 });
  assert.equal(r.kcal.dia, 3800);
  assert.equal(r.agua.total, 2 * 3.5 * 3);
  assert.match(sum(r, "medicacion"), /10 días/);
});

test("lactancia: solo cuenta si hay bebés", () => {
  assert.equal(run({ adultos: 1, lactancia: true }).entrada.lactancia, false);
  const r = run({ dias: 3, adultos: 2, bebes: 1, lactancia: true });
  assert.equal(r.kcal.dia, 2 * 2200 + 500);
  assert.equal(r.agua.total, 2 * 3 * 3 + 1.5 * 3 + 0.7 * 3);
});

test("celiaquía en 1 de 3: versión segura solo para esa persona", () => {
  const r = run({ dias: 3, adultos: 2, ninos: 1, necesidades: { celiaco: 1 } });
  const g = grupo(r, "cereales");
  assert.equal(g.base.personas, 2);
  assert.equal(g.segura.personas, 1);
  assert.match(g.segura.texto, /sin gluten/);
  assert.doesNotMatch(g.base.texto, /sin gluten/);
  // los grupos que no afecta la celiaquía no se dividen
  assert.equal(grupo(r, "legumbres").segura, null);
  assert.ok(r.avisos.some((a) => a.necesidad === "celiaco"));
});

test("todo el hogar come la versión segura", () => {
  const r = run({ adultos: 3, necesidades: { celiaco: 1 }, todaLaFamilia: true });
  const g = grupo(r, "cereales");
  assert.equal(g.base, null);
  assert.equal(g.segura.personas, 3);
});

test("necesidades: se limitan al número de comensales y se ignoran sin comensales", () => {
  const r = run({ adultos: 2, necesidades: { lactosa: 9 } });
  assert.equal(grupo(r, "lacteos").segura.personas, 2);
  assert.equal(grupo(r, "lacteos").base, null);
  assert.deepEqual(C.sanear({ bebes: 1, necesidades: { celiaco: 1 } }).necesidades, {});
});

test("necesidades que se suman en un mismo grupo (sin saber si se solapan)", () => {
  const r = run({ adultos: 3, necesidades: { celiaco: 2, huevo: 2 } });
  const g = grupo(r, "cereales");
  assert.equal(g.segura.personas, 3);
  assert.match(g.segura.texto, /sin gluten.*sin huevo/);
});

test("combinaciones: celiaquía + vegana + soja", () => {
  const r = run({ adultos: 2, necesidades: { celiaco: 1, vegano: 1, soja: 1 } });
  const l = grupo(r, "lacteos").segura.texto;
  assert.match(l, /avena sin gluten/);
  assert.doesNotMatch(l, /soja/);
  const p = grupo(r, "proteina").segura.texto;
  assert.doesNotMatch(p, /soja texturizada/);
  assert.match(p, /legumbres/);
});

test("combinaciones: vegetariana + alergia a frutos secos", () => {
  const r = run({ adultos: 2, necesidades: { vegetariano: 1, frutosSecos: 1 } });
  assert.doesNotMatch(grupo(r, "proteina").segura.texto, /cacahuete/);
  assert.doesNotMatch(grupo(r, "grasas").segura.texto, /Frutos secos/);
  assert.match(grupo(r, "grasas").base.texto, /Frutos secos/);
});

test("alergia a la leche gana a la intolerancia a la lactosa", () => {
  const r = run({ adultos: 2, necesidades: { lactosa: 1, leche: 1 } });
  assert.match(grupo(r, "lacteos").segura.texto, /Bebida vegetal/);
  assert.doesNotMatch(grupo(r, "lacteos").segura.texto, /sin lactosa/);
});

test("pescado: sin atún ni sardinas", () => {
  const t = grupo(run({ adultos: 1, necesidades: { pescado: 1 } }), "proteina").segura.texto;
  assert.doesNotMatch(t, /atún|sardinas|caballa/i);
});

test("diabetes e hipertensión", () => {
  const r = run({ adultos: 1, necesidades: { diabetes: 1, hipertension: 1 } });
  assert.match(grupo(r, "frutaVerdura").segura.texto, /sin almíbar.*sin sal/);
  assert.match(grupo(r, "legumbres").segura.texto, /bajas en sal/);
  assert.ok(sum(r, "medicacion"));
});

test("consejo de versión segura para todos: solo si hace falta", () => {
  const tiene = (r) => r.avisos.some((a) => /todo el hogar coma la versión segura/.test(a.texto));
  assert.equal(tiene(run({ adultos: 3, necesidades: { celiaco: 1 } })), true);
  assert.equal(tiene(run({ adultos: 3, necesidades: { celiaco: 3 } })), false);
  assert.equal(tiene(run({ adultos: 3, necesidades: { celiaco: 1 }, todaLaFamilia: true })), false);
  assert.equal(tiene(run({ adultos: 3, necesidades: { lactosa: 1 } })), false);
});

test("una necesidad solo cuenta donde el alimento por defecto no es seguro", () => {
  // celiaquía: la leche normal es segura
  assert.equal(grupo(run({ adultos: 2, necesidades: { celiaco: 1 } }), "lacteos").segura, null);
  // soja y frutos secos: el atún por defecto es seguro
  assert.equal(grupo(run({ adultos: 2, necesidades: { soja: 1 } }), "proteina").segura, null);
  assert.equal(grupo(run({ adultos: 2, necesidades: { frutosSecos: 1 } }), "proteina").segura, null);
  assert.equal(grupo(run({ adultos: 2, necesidades: { soja: 1 } }), "lacteos").segura, null);
  // pero si coinciden con una dieta vegana, la versión segura sí las respeta
  const r = run({ adultos: 3, necesidades: { vegano: 1, soja: 1, frutosSecos: 1 } });
  assert.equal(grupo(r, "proteina").segura.personas, 1);
  assert.doesNotMatch(grupo(r, "proteina").segura.texto, /soja|cacahuete/);
});

test("todas las necesidades tienen aviso", () => {
  for (const n of C.NECESIDADES) assert.ok(C.AVISOS[n.id], n.id);
});

test("las 2.048 combinaciones de necesidades generan textos válidos", () => {
  const ids = C.NECESIDADES.map((n) => n.id);
  for (let mask = 0; mask < 1 << ids.length; mask++) {
    const R = new Set(ids.filter((_, k) => mask & (1 << k)));
    for (const g of C.GRUPOS) {
      const t = g.texto(R);
      assert.equal(typeof t, "string");
      assert.ok(t.length > 10 && !/undefined|NaN|null/.test(t), `${g.id} ${[...R]}: ${t}`);
      // reglas de seguridad
      if (R.has("celiaco") && g.id === "cereales") assert.match(t, /sin gluten/);
      if (R.has("frutosSecos")) assert.doesNotMatch(t, /cacahuete|Frutos secos/, `${g.id} ${[...R]}`);
      if (R.has("pescado") || R.has("vegano") || R.has("vegetariano")) assert.doesNotMatch(t, /atún|sardinas/i);
      if (R.has("soja") && g.id !== "cereales") assert.doesNotMatch(t, /soja/, `${g.id} ${[...R]}`);
      if ((R.has("leche") || R.has("vegano")) && g.id === "lacteos") assert.doesNotMatch(t, /^Leche/);
      if ((R.has("vegano") || R.has("vegetariano")) && g.id === "proteina") assert.doesNotMatch(t, /carne/i);
    }
  }
});

test("prueba aleatoria: invariantes en 20.000 hogares", () => {
  let seed = 42;
  const rnd = (n) => { seed = (seed * 1103515245 + 12345) % 2 ** 31; return seed % n; };
  const ids = C.NECESIDADES.map((n) => n.id);
  for (let k = 0; k < 20000; k++) {
    const inp = {
      dias: [3, 7, 10, 4][rnd(4)], adultos: rnd(25) - 2, ninos: rnd(8), peques: rnd(4), bebes: rnd(4), mayores: rnd(4),
      perrosPeq: rnd(2), perrosMed: rnd(3), perrosGra: rnd(2), gatos: rnd(3), calor: !rnd(3),
      lactancia: !!rnd(2), medicacion: !!rnd(2), todaLaFamilia: !rnd(4),
      necesidades: Object.fromEntries(ids.filter(() => !rnd(4)).map((id) => [id, rnd(5)])),
    };
    const r = run(inp);
    const json = JSON.stringify(r);
    assert.ok(!/NaN|undefined|Infinity/.test(json), json);
    const i = r.entrada;
    if (r.vacio) { assert.equal(r.personas, 0); continue; }
    // agua = (bebida·calor + 0,5 cocina + 1 higiene) por persona + 1,5 por bebé + lactancia + mascotas
    const f = i.calor ? 2 : 1;
    const dia = i.adultos * (1.5 * f + 1.5) + i.mayores * (2 * f + 1.5) + (i.ninos + i.peques) * (1 * f + 1.5) + i.bebes * 1.5 +
      (i.lactancia ? 0.7 : 0) + i.perrosPeq * 0.4 + i.perrosMed * 1 + i.perrosGra * 2 + i.gatos * 0.3;
    const esperado = dia * i.dias;
    assert.ok(Math.abs(r.agua.total - esperado) < 0.11, `agua ${r.agua.total} vs ${esperado}`);
    assert.equal(r.agua.garrafas5L, Math.ceil(r.agua.total / 5));
    for (const g of r.grupos) {
      const pb = g.base?.personas || 0, ps = g.segura?.personas || 0;
      assert.equal(pb + ps, r.comensales, `personas en ${g.id}`);
      for (const p of [g.base, g.segura].filter(Boolean)) assert.ok(Number.isInteger(p.cantidad) && p.cantidad > 0);
    }
    // la comida comprada cubre las kcal de cada grupo
    if (r.comensales) for (const gdef of C.GRUPOS) {
      const g = r.grupos.find((x) => x.id === gdef.id);
      const kcalComprada = [g.base, g.segura].filter(Boolean).reduce((s, p) => {
        const ku = p === g.segura && gdef.variante?.(new Set(Object.keys(i.necesidades)))?.kcalUnidad || gdef.kcalUnidad;
        return s + p.cantidad * ku;
      }, 0);
      assert.ok(kcalComprada >= r.kcal.total * gdef.parte - 1e-6, `${gdef.id}: ${kcalComprada} < ${r.kcal.total * gdef.parte}`);
    }
  }
});

test("el reparto de kcal entre grupos suma el 100 %", () => {
  const total = C.GRUPOS.reduce((s, g) => s + g.parte, 0);
  assert.ok(Math.abs(total - 1) < 1e-9);
});

test("niños por edades: 1.300 kcal (3–6 años) y 1.800 kcal (7–13 años)", () => {
  const r = run({ dias: 3, adultos: 1, peques: 1, ninos: 1 });
  assert.equal(r.kcal.dia, 2200 + 1300 + 1800);
  assert.equal(r.comensales, 3);
  assert.equal(r.agua.total, (3 + 2.5 + 2.5) * 3);
});

test("clima caluroso: duplica solo el agua para beber", () => {
  const frio = run({ dias: 3, adultos: 2 }), calor = run({ dias: 3, adultos: 2, calor: true });
  assert.equal(calor.agua.total - frio.agua.total, 2 * 1.5 * 3);
  assert.equal(calor.agua.bebida, 2 * frio.agua.bebida);
  assert.equal(calor.agua.cocina, frio.agua.cocina);
  assert.ok(calor.avisos.some((a) => /calor/.test(a.texto)));
});

test("desglose del agua: bebida + cocina + higiene + bebés + lactancia + mascotas = total", () => {
  const r = run({ dias: 7, adultos: 2, mayores: 1, ninos: 1, bebes: 1, lactancia: true, perrosGra: 1, gatos: 1 });
  const a = r.agua;
  assert.ok(Math.abs(a.bebida + a.cocina + a.higiene + a.bebes + a.lactancia + a.perros + a.gatos - a.total) < 0.11);
});

test("kilos de comida: suma real del peso de lo que hay en la lista", () => {
  const r = run({ dias: 10, adultos: 1 });
  const g = r.grupos.reduce((s, x) => s + (x.base?.gramos || 0) + (x.segura?.gramos || 0), 0);
  assert.equal(r.kgComida, Math.round(g / 100) / 10);
  // Orden de magnitud de la tabla oficial BLE (≈14 kg por persona y 10 días); con conservas en su líquido pesa algo más
  assert.ok(r.kgComida >= 12 && r.kgComida <= 25, `${r.kgComida} kg`);
});

test("menú: días según el horizonte, sin cocinar las primeras 72 h", () => {
  assert.equal(C.menu({ dias: 3, adultos: 1 }).dias.length, 3);
  const m7 = C.menu({ dias: 7, adultos: 1 });
  assert.equal(m7.dias.length, 7);
  assert.deepEqual(m7.dias.map((d) => d.cocina), [false, false, false, true, true, true, true]);
  const m10 = C.menu({ dias: 10, adultos: 1 });
  assert.equal(m10.dias.length, 10);
  assert.equal(m10.dias[9].cocina, false);
  for (const d of m10.dias) assert.equal(d.comidas.length, 4);
});

test("menú: las 2.048 combinaciones de necesidades respetan todas las restricciones", () => {
  const ids = C.NECESIDADES.map((n) => n.id);
  const todos = C.MENU_DIAS.flatMap((d) => ["desayuno", "comida", "merienda", "cena"].flatMap((m) => d[m]));
  const tagsDe = new Map(todos.map((p) => [p.t, p.tags]));
  for (let mask = 0; mask < 1 << ids.length; mask++) {
    const act = ids.filter((_, k) => mask & (1 << k));
    const prohib = new Set(act.flatMap((id) => C.PROHIBIDOS[id]));
    const m = C.menu({ dias: 7, adultos: act.length + 1, necesidades: Object.fromEntries(act.map((id) => [id, 1])) });
    for (const d of m.dias) for (const c of d.comidas) {
      assert.ok(c.texto && c.texto.length > 10);
      const tags = tagsDe.get(c.texto) || [];
      assert.ok(!tags.some((t) => prohib.has(t)), `${act} → ${c.texto}`);
    }
  }
});

test("menú: sin necesidades se usa la primera opción de cada plato", () => {
  const m = C.menu({ dias: 3, adultos: 2 });
  assert.equal(m.dias[0].comidas[0].texto, C.MENU_DIAS[0].desayuno[0].t);
  assert.equal(m.notas.length, 0);
});

test("todas las necesidades tienen ingredientes prohibidos definidos", () => {
  for (const n of C.NECESIDADES) assert.ok(C.PROHIBIDOS[n.id]?.length, n.id);
});

test("lejía: 2 gotas por litro, 4 si está turbia, y 30 minutos de espera", () => {
  assert.deepEqual(C.gotasLejia(1), { litros: 1, gotas: 2, ml: 0.1, esperaMin: 30 });
  assert.equal(C.gotasLejia(5, true).gotas, 20);
  assert.equal(C.gotasLejia(1.5).gotas, 3);
  assert.equal(C.gotasLejia(-2).gotas, 0);
  assert.equal(C.gotasLejia("abc").gotas, 0);
});

test("sin hornillo ni fuego: el menú no cocina ningún día y la lista avisa", () => {
  for (const dias of [3, 7, 10]) {
    const m = C.menu({ dias, adultos: 2, sinFuego: true });
    assert.equal(m.dias.length, dias);
    assert.ok(m.dias.every((d) => !d.cocina), `${dias} días`);
  }
  const r = run({ dias: 7, adultos: 2, sinFuego: true });
  assert.match(grupo(r, "cereales").base.texto, /agua fría/);
  assert.doesNotMatch(grupo(r, "cereales").base.texto, /Pasta, arroz/);
  assert.ok(r.avisos.some((a) => /Sin hornillo ni fuego/.test(a.texto)));
  const c = run({ dias: 7, adultos: 2, sinFuego: true, necesidades: { celiaco: 2 } });
  assert.match(grupo(c, "cereales").segura.texto, /sin gluten.*sin cocinar/);
});

test("sin fuego + todas las necesidades: textos válidos y restricciones respetadas", () => {
  const ids = C.NECESIDADES.map((n) => n.id);
  for (let mask = 0; mask < 1 << ids.length; mask++) {
    const R = new Set([...ids.filter((_, k) => mask & (1 << k)), "_sinFuego"]);
    const t = C.GRUPOS.find((g) => g.id === "cereales").texto(R);
    if (R.has("celiaco")) assert.match(t, /sin gluten/);
    assert.doesNotMatch(t, /Pasta|arroz,/);
  }
});

test("distancia y rumbo: Madrid → Barcelona ≈ 505 km hacia el este", () => {
  const d = C.distanciaRumbo(40.4168, -3.7038, 41.3874, 2.1686);
  assert.ok(Math.abs(d.metros - 505000) < 3000, d.metros);
  assert.equal(d.rumbo, "este");
  assert.equal(C.distanciaRumbo(40, -3, 41, -3).rumbo, "norte");
  assert.equal(C.distanciaRumbo(40, -3, 39, -3).rumbo, "sur");
  assert.equal(C.distanciaRumbo(40, -3, 40, -3).metros, 0);
  // 1° de latitud ≈ 111,2 km
  assert.ok(Math.abs(C.distanciaRumbo(0, 0, 1, 0).metros - 111195) < 50);
});

test("coordenadas: formatos aceptados y rechazados", () => {
  assert.deepEqual(C.parseCoords("40.4168, -3.7038"), { lat: 40.4168, lon: -3.7038 });
  assert.deepEqual(C.parseCoords("40,4168 -3,7038"), { lat: 40.4168, lon: -3.7038 });
  assert.deepEqual(C.parseCoords("19.4326;-99.1332"), { lat: 19.4326, lon: -99.1332 });
  assert.equal(C.parseCoords("95, 10"), null);
  assert.equal(C.parseCoords("hola"), null);
  assert.equal(C.parseCoords(""), null);
});

test("morse: texto a código, con Ñ, tildes y palabras", () => {
  assert.equal(C.aMorse("sos").codigo, "... --- ...");
  assert.equal(C.aMorse("Año").codigo, ".- --.-- ---");
  assert.equal(C.aMorse("acción").codigo, C.aMorse("ACCION").codigo);
  assert.equal(C.aMorse("hola  mundo").codigo, ".... --- .-.. .- / -- ..- -. -.. ---");
  assert.deepEqual(C.aMorse("hola!").desconocidos, ["!"]);
  assert.equal(C.aMorse("").codigo, "");
});

test("morse: ida y vuelta para todos los símbolos", () => {
  for (const k of Object.keys(C.MORSE)) assert.equal(C.deMorse(C.aMorse(k).codigo), k);
  assert.equal(C.deMorse(C.aMorse("Necesito agua 2").codigo), "NECESITO AGUA 2");
  assert.equal(C.deMorse("··· ——— ···"), "SOS");
  assert.equal(C.deMorse("...---..."), "SOS");
  assert.equal(C.deMorse(".... ..   .-"), "HI A");
  assert.equal(C.deMorse("........"), "?");
});

test("morse: tiempos estándar (1, 3, 1, 3 y 7 unidades)", () => {
  assert.deepEqual(C.secuenciaMorse(".-"), [[true, 1], [false, 1], [true, 3]]);
  assert.deepEqual(C.secuenciaMorse(". -"), [[true, 1], [false, 3], [true, 3]]);
  assert.deepEqual(C.secuenciaMorse(". / -"), [[true, 1], [false, 7], [true, 3]]);
  // "PARIS " = 50 unidades: referencia para medir palabras por minuto
  const u = C.secuenciaMorse(C.aMorse("PARIS").codigo).reduce((t, [, n]) => t + n, 0) + 7;
  assert.equal(u, 50);
  assert.deepEqual(C.secuenciaMorse(""), []);
});
