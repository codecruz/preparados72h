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
  assert.equal(r.agua.total, 27);
  assert.equal(r.agua.garrafas5L, 6);
  assert.equal(r.kcal.dia, 5400);
  assert.equal(r.kcal.total, 16200);
  assert.equal(r.vacio, false);
});

test("horizonte inválido o en texto", () => {
  assert.equal(run({ dias: 5, adultos: 1 }).dias, 3);
  assert.equal(run({ dias: undefined, adultos: 1 }).dias, 3);
  assert.equal(run({ dias: "7", adultos: 1 }).dias, 7);
  assert.equal(run({ dias: 10, adultos: 1 }).dias, 10);
});

test("saneado de números: negativos, decimales, texto, límites", () => {
  const i = C.sanear({ adultos: -3, ninos: "2.7", bebes: 50, mayores: "abc", perros: NaN, gatos: Infinity });
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
  assert.equal(r.agua.total, 9);
  assert.match(sum(r, "panales"), /21 pañales/);
});

test("plurales correctos con una sola persona", () => {
  const r = run({ dias: 3, adultos: 1 });
  assert.match(sum(r, "luz"), /^1 linterna y 3 juegos/);
  assert.match(sum(r, "energia"), /1 batería externa$/);
  assert.match(sum(r, "abrigo"), /^1 manta térmica y 1 rollo de/);
  assert.match(sum(r, "efectivo"), /3 días/);
  const r7 = run({ dias: 7, adultos: 2 });
  assert.match(sum(r7, "abrigo"), /2 mantas térmicas y 4 rollos/);
});

test("mascotas: perros y gatos beben distinto", () => {
  const r = run({ dias: 7, adultos: 1, perros: 2, gatos: 1 });
  assert.equal(r.agua.perros, 21);
  assert.equal(r.agua.gatos, 2.1);
  assert.equal(r.agua.total, 21 + 21 + 2.1);
  assert.match(sum(r, "gatos"), /2,1 L/);
});

test("personas mayores: 1.800 kcal y medicación", () => {
  const r = run({ dias: 3, mayores: 2 });
  assert.equal(r.kcal.dia, 3600);
  assert.match(sum(r, "medicacion"), /10 días/);
});

test("lactancia: solo cuenta si hay bebés", () => {
  assert.equal(run({ adultos: 1, lactancia: true }).entrada.lactancia, false);
  const r = run({ dias: 3, adultos: 2, bebes: 1, lactancia: true });
  assert.equal(r.kcal.dia, 4500);
  assert.equal(r.agua.total, 3 * 3 * 3 + 2.1);
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
      dias: [3, 7, 10, 4][rnd(4)], adultos: rnd(25) - 2, ninos: rnd(8), bebes: rnd(4), mayores: rnd(4),
      perros: rnd(3), gatos: rnd(3), lactancia: !!rnd(2), medicacion: !!rnd(2), todaLaFamilia: !rnd(4),
      necesidades: Object.fromEntries(ids.filter(() => !rnd(4)).map((id) => [id, rnd(5)])),
    };
    const r = run(inp);
    const json = JSON.stringify(r);
    assert.ok(!/NaN|undefined|Infinity/.test(json), json);
    const i = r.entrada;
    if (r.vacio) { assert.equal(r.personas, 0); continue; }
    // agua = personas·3·días + lactancia + mascotas
    const esperado = (r.personas * 3 + (i.lactancia ? 0.7 : 0) + i.perros * 1.5 + i.gatos * 0.3) * i.dias;
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
