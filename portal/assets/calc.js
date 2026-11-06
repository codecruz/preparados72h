// Cálculo de reservas del hogar. Módulo puro (sin DOM): se usa en el navegador (window.PrepCalc)
// y en Node para los tests (module.exports). Todas las cifras son orientativas.
(function (root) {
  "use strict";

  const HORIZONTES = [3, 7, 10];

  // kcal por persona y día (referencias generales de la EFSA, redondeadas)
  const KCAL = { adulto: 2000, nino: 1400, mayor: 1800, extraLactancia: 500 };

  // Litros por día. Personas: 3 L (beber + higiene básica, según protección civil).
  const AGUA = { persona: 3, perro: 1.5, gato: 0.3, extraLactancia: 0.7 };

  const LIMITES = { adultos: [0, 20], ninos: [0, 20], bebes: [0, 10], mayores: [0, 10], perros: [0, 10], gatos: [0, 10] };

  const FORMULA_G_DIA = 110; // leche de fórmula en polvo por bebé que toma biberón (orientativo)
  const PANALES_DIA = 7;

  // Necesidades alimentarias. "grupos": grupos cuyo alimento POR DEFECTO deja de ser seguro para esa persona
  // (cuentan para la versión segura). El texto de la versión segura tiene en cuenta TODAS las necesidades
  // activas: p. ej. con celiaquía + dieta vegana, la bebida vegetal será de avena sin gluten.
  const NECESIDADES = [
    { id: "celiaco", etiqueta: "Celiaquía o sensibilidad al gluten", grupos: ["cereales"] },
    { id: "lactosa", etiqueta: "Intolerancia a la lactosa", grupos: ["lacteos"] },
    { id: "leche", etiqueta: "Alergia a la proteína de la leche", grupos: ["lacteos", "cereales"] },
    { id: "frutosSecos", etiqueta: "Alergia a frutos secos o cacahuete", grupos: ["grasas"] },
    { id: "huevo", etiqueta: "Alergia al huevo", grupos: ["cereales"] },
    { id: "pescado", etiqueta: "Alergia a pescado o marisco", grupos: ["proteina"] },
    { id: "soja", etiqueta: "Alergia a la soja", grupos: ["cereales"] },
    { id: "vegetariano", etiqueta: "Dieta vegetariana", grupos: ["proteina"] },
    { id: "vegano", etiqueta: "Dieta vegana", grupos: ["proteina", "lacteos"] },
    { id: "diabetes", etiqueta: "Diabetes", grupos: ["frutaVerdura"] },
    { id: "hipertension", etiqueta: "Hipertensión (poca sal)", grupos: ["legumbres", "proteina", "frutaVerdura"] },
  ];

  const AVISOS = {
    celiaco: "Celiaquía: compra solo productos con el símbolo de la espiga barrada o con «sin gluten». La avena, solo si está certificada. Las barritas, las sopas de sobre, las salsas, los embutidos y algunas conservas pueden llevar gluten. Guarda estos alimentos aparte y etiquetados, y ten cubiertos y platos propios: en una emergencia habrá poca agua para limpiar y evitar la contaminación cruzada.",
    lactosa: "Intolerancia a la lactosa: leche UHT sin lactosa o bebida vegetal. Los quesos muy curados apenas tienen lactosa. Lleva comprimidos de lactasa si los usas.",
    leche: "Alergia a la proteína de la leche: revisa también la leche como ingrediente (suero, caseína, lactosa) en galletas, chocolate, pan de molde y embutidos. Si quien la tiene es un bebé, guarda la fórmula especial que le hayan recetado para todo el periodo y con margen.",
    frutosSecos: "Alergia a frutos secos o cacahuete: nada de frutos secos, cacahuete ni sus cremas. Revisa «puede contener trazas» en barritas, galletas y chocolate. Si hay riesgo de anafilaxia, lleva 2 autoinyectores de adrenalina sin caducar y el informe médico en la mochila.",
    huevo: "Alergia al huevo: revisa la pasta al huevo, las galletas, la bollería, la mayonesa y las salsas.",
    pescado: "Alergia a pescado o marisco: sustituye el atún y las sardinas por carne en conserva o legumbres, y revisa los caldos y las salsas.",
    soja: "Alergia a la soja: revisa las barritas, las bebidas vegetales, las salsas, el pan de molde y las galletas. En las bebidas vegetales, elige avena o arroz.",
    vegetariano: "Dieta vegetariana: la proteína viene de las legumbres, la soja texturizada, el hummus y la crema de cacahuete (si no hay alergias).",
    vegano: "Dieta vegana: además, sustituye la leche por bebida vegetal enriquecida en calcio. Si tomas suplemento de vitamina B12, inclúyelo en la reserva.",
    diabetes: "Diabetes: lleva glucosa de acción rápida (tabletas o zumos pequeños) para las hipoglucemias, y tiras, lancetas y glucómetro con pilas de repuesto. La insulina en uso suele aguantar unas 4 semanas a temperatura ambiente (consulta el prospecto): ten una funda o una nevera isotérmica por si se corta la luz. Prioriza legumbres, frutos secos y cereales integrales frente a los dulces.",
    hipertension: "Hipertensión: elige conservas «bajas en sal» o «sin sal añadida». Escurrir y enjuagar las legumbres de bote les quita bastante sal (si te sobra agua).",
  };

  // Grupos de alimentos: reparto de las kcal y una unidad de compra con sus kcal aproximadas.
  const sg = (s, p) => ({ s, p });
  const GRUPOS = [
    {
      id: "cereales", nombre: "Cereales y féculas", parte: 0.35, unidad: sg("paquete de 500 g", "paquetes de 500 g"), kcalUnidad: 1750,
      texto(R) {
        let t = R.has("celiaco")
          ? "Arroz, copos de puré de patata, tortitas de arroz o maíz, y pasta o pan sin gluten certificados"
          : "Pasta, arroz, galletas o pan tostado";
        const q = [];
        if (R.has("huevo")) q.push("pasta sin huevo");
        if (R.has("leche")) q.push("galletas y pan sin leche");
        if (R.has("soja")) q.push("revisa la soja en galletas y pan");
        return t + (q.length ? ` (${q.join("; ")})` : "");
      },
    },
    {
      id: "legumbres", nombre: "Legumbres", parte: 0.15, unidad: sg("bote de 400 g", "botes de 400 g"), kcalUnidad: 300,
      texto(R) { return "Legumbres cocidas en bote (garbanzos, lentejas, alubias)" + (R.has("hipertension") ? ", bajas en sal" : ""); },
    },
    {
      id: "proteina", nombre: "Proteína en conserva", parte: 0.15, unidad: sg("lata de unos 120 g", "latas de unos 120 g"), kcalUnidad: 250,
      variante(R) {
        // Las dietas vegetariana y vegana cambian la unidad de compra
        if (R.has("vegano") || R.has("vegetariano")) return { unidad: sg("bote o ración", "botes o raciones"), kcalUnidad: 300 };
        return null;
      },
      texto(R) {
        let t;
        if (R.has("vegano") || R.has("vegetariano")) {
          const o = ["más legumbres en bote", "hummus o garbanzos en conserva"];
          if (!R.has("soja")) o.push("soja texturizada");
          if (!R.has("frutosSecos")) o.push("crema de cacahuete");
          t = o.join(", ");
          t = t[0].toUpperCase() + t.slice(1);
        } else if (R.has("pescado")) t = "Carne en conserva (pollo, pavo o cerdo)";
        else t = "Atún, sardinas, caballa o carne en conserva";
        return t + (R.has("hipertension") ? ", en versión baja en sal" : "");
      },
    },
    {
      id: "grasas", nombre: "Grasas y frutos secos", parte: 0.15, unidad: sg("bolsa o botella de 200 g", "bolsas o botellas de 200 g"), kcalUnidad: 1200,
      texto(R) {
        return R.has("frutosSecos")
          ? "Aceite de oliva y semillas de girasol o calabaza (revisa «puede contener trazas»)"
          : "Frutos secos, crema de cacahuete y aceite de oliva";
      },
    },
    {
      id: "lacteos", nombre: "Leche o bebida vegetal", parte: 0.10, unidad: sg("brik de 1 L", "briks de 1 L"), kcalUnidad: 500,
      variante(R) {
        if (R.has("leche") || R.has("vegano")) return { kcalUnidad: 400 };
        return null;
      },
      texto(R) {
        if (R.has("leche") || R.has("vegano")) {
          const b = [];
          if (!R.has("soja")) b.push("soja");
          b.push(R.has("celiaco") ? "avena sin gluten" : "avena", "arroz");
          return `Bebida vegetal enriquecida en calcio (${b.join(", ")})`;
        }
        if (R.has("lactosa")) return "Leche UHT sin lactosa o bebida vegetal enriquecida";
        return "Leche UHT entera o semidesnatada";
      },
    },
    {
      id: "frutaVerdura", nombre: "Fruta y verdura en conserva", parte: 0.10, unidad: sg("lata o bote", "latas o botes"), kcalUnidad: 150,
      texto(R) {
        return (R.has("diabetes") ? "Fruta en su jugo (sin almíbar)" : "Fruta en almíbar o en su jugo") +
          " y " + (R.has("hipertension") ? "verduras y tomate sin sal añadida" : "verduras y tomate en conserva");
      },
    },
  ];

  // ---------- Utilidades ----------
  const entero = (v, [min, max]) => {
    const n = Math.trunc(Number(v));
    return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;
  };
  const plural = (n, s, p) => `${n} ${n === 1 ? s : p}`;
  const redondeo1 = (x) => Math.round(x * 10) / 10;

  function sanear(inp = {}) {
    const o = {};
    o.dias = HORIZONTES.includes(Number(inp.dias)) ? Number(inp.dias) : 3;
    for (const k of Object.keys(LIMITES)) o[k] = entero(inp[k] ?? 0, LIMITES[k]);
    o.lactancia = !!inp.lactancia && o.bebes > 0;
    o.medicacion = !!inp.medicacion;
    o.todaLaFamilia = !!inp.todaLaFamilia;
    const comensales = o.adultos + o.ninos + o.mayores;
    o.necesidades = {};
    for (const nd of NECESIDADES) {
      const c = entero(inp.necesidades?.[nd.id] ?? 0, [0, comensales]);
      if (c > 0) o.necesidades[nd.id] = c;
    }
    return o;
  }

  function compute(input) {
    const i = sanear(input);
    const { dias } = i;
    const comensales = i.adultos + i.ninos + i.mayores; // comen de la reserva general (los bebés aparte)
    const personas = comensales + i.bebes;
    const adultosCuidadores = i.adultos + i.mayores;
    const out = { entrada: i, dias, personas, comensales, mascotas: i.perros + i.gatos, avisos: [], grupos: [], suministros: [], vacio: false };

    if (personas === 0) {
      out.vacio = true;
      out.avisos.push({ tipo: "error", texto: i.perros + i.gatos > 0 ? "Añade al menos una persona: la reserva se calcula para el hogar, no solo para las mascotas." : "Añade al menos una persona para calcular." });
      return out;
    }
    if (adultosCuidadores === 0) out.avisos.push({ tipo: "error", texto: "No hay ningún adulto en el hogar. Revisa los datos: los niños y los bebés necesitan a alguien que los cuide." });

    // ---------- Agua ----------
    const aguaPersonas = personas * AGUA.persona * dias;
    const aguaLactancia = i.lactancia ? AGUA.extraLactancia * dias : 0;
    const aguaPerros = i.perros * AGUA.perro * dias;
    const aguaGatos = i.gatos * AGUA.gato * dias;
    const aguaTotal = redondeo1(aguaPersonas + aguaLactancia + aguaPerros + aguaGatos);
    out.agua = { total: aguaTotal, personas: aguaPersonas, lactancia: redondeo1(aguaLactancia), perros: redondeo1(aguaPerros), gatos: redondeo1(aguaGatos), garrafas5L: Math.ceil(aguaTotal / 5) };

    // ---------- Energía ----------
    const kcalDia = i.adultos * KCAL.adulto + i.ninos * KCAL.nino + i.mayores * KCAL.mayor + (i.lactancia ? KCAL.extraLactancia : 0);
    out.kcal = { dia: kcalDia, total: kcalDia * dias };
    out.kgComida = redondeo1(out.kcal.total / 2500); // mezcla de conservas y secos ≈ 2,5 kcal/g

    // ---------- Lista de compra por grupos ----------
    const activas = new Set(Object.keys(i.necesidades));
    const kcalMedia = comensales ? out.kcal.total / comensales : 0; // por persona en todo el periodo
    for (const g of GRUPOS) {
      const kcalGrupo = out.kcal.total * g.parte;
      // Personas que necesitan la versión segura de este grupo: suma de las necesidades que lo afectan
      // (si no sabemos si se solapan, la suma garantiza comida segura suficiente para todos).
      const afectan = NECESIDADES.filter((n) => activas.has(n.id) && n.grupos.includes(g.id));
      let nSegura = 0;
      if (afectan.length) nSegura = i.todaLaFamilia ? comensales : Math.min(comensales, afectan.reduce((s, n) => s + i.necesidades[n.id], 0));
      const nBase = comensales - nSegura;

      const linea = { id: g.id, nombre: g.nombre, base: null, segura: null };
      if (nBase > 0 && kcalGrupo > 0) {
        const kc = kcalGrupo * (nBase / comensales);
        linea.base = { personas: nBase, cantidad: Math.ceil(kc / g.kcalUnidad), unidad: g.unidad, texto: g.texto(new Set()) };
      }
      if (nSegura > 0 && kcalGrupo > 0) {
        const v = (g.variante && g.variante(activas)) || {};
        const unidad = v.unidad || g.unidad, kcalUnidad = v.kcalUnidad || g.kcalUnidad;
        const kc = kcalGrupo * (nSegura / comensales);
        linea.segura = { personas: nSegura, cantidad: Math.ceil(kc / kcalUnidad), unidad, texto: g.texto(activas), por: afectan.map((n) => n.id) };
      }
      if (linea.base || linea.segura) out.grupos.push(linea);
    }
    out.kcalMediaPersona = Math.round(kcalMedia);

    // ---------- Otros suministros ----------
    const S = out.suministros;
    const linternas = Math.max(1, adultosCuidadores);
    const juegosPilas = 2 + Math.floor(dias / 3);
    const baterias = Math.max(1, Math.ceil(adultosCuidadores / 2));
    const rollos = Math.max(1, Math.ceil((personas * dias) / 4));
    S.push({ id: "luz", texto: `${plural(linternas, "linterna", "linternas")} y ${plural(juegosPilas, "juego", "juegos")} de pilas de repuesto` });
    S.push({ id: "energia", texto: `1 radio de pilas o de manivela y ${plural(baterias, "batería externa", "baterías externas")}` });
    S.push({ id: "abrigo", texto: `${plural(personas, "manta térmica", "mantas térmicas")} y ${plural(rollos, "rollo", "rollos")} de papel higiénico` });
    S.push({ id: "efectivo", texto: `Efectivo en billetes pequeños para ${plural(dias, "día", "días")} de compras básicas` });
    if (i.bebes) {
      S.push({ id: "panales", texto: `${plural(i.bebes * PANALES_DIA * dias, "pañal", "pañales")} y toallitas` });
      S.push({ id: "formula", texto: `Si toma biberón: unos ${(i.bebes * FORMULA_G_DIA * dias / 1000).toLocaleString("es-ES", { maximumFractionDigits: 1 })} kg de leche de fórmula en polvo (comprueba la dosis de tu marca), preparada con agua embotellada. Si ya come, añade potitos o purés que no necesiten frío.` });
    }
    if (i.lactancia) S.push({ id: "lactancia", texto: `Lactancia materna: ya están sumadas ${KCAL.extraLactancia} kcal y ${String(AGUA.extraLactancia).replace(".", ",")} L de agua más al día para la madre` });
    if (i.mayores) S.push({ id: "mayores", texto: "Personas mayores: gafas de repuesto, pilas para los audífonos y ayudas técnicas" });
    if (i.medicacion || i.mayores || activas.has("diabetes")) S.push({ id: "medicacion", texto: `Medicación para ${plural(dias + 7, "día", "días")} (el horizonte más una semana de margen) y copia de las recetas` });
    if (i.perros) S.push({ id: "perros", texto: `Perros: comida para ${plural(dias, "día", "días")}, ${String(out.agua.perros).replace(".", ",")} L de agua (ya sumados arriba), correa y bolsas` });
    if (i.gatos) S.push({ id: "gatos", texto: `Gatos u otras mascotas pequeñas: comida para ${plural(dias, "día", "días")}, ${String(out.agua.gatos).replace(".", ",")} L de agua (ya sumados arriba), arena y transportín` });

    // ---------- Avisos ----------
    for (const id of activas) out.avisos.push({ tipo: "info", necesidad: id, texto: AVISOS[id] });
    const graves = ["celiaco", "frutosSecos", "leche"].filter((id) => activas.has(id));
    if (!i.todaLaFamilia && graves.some((id) => i.necesidades[id] < comensales)) {
      out.avisos.push({ tipo: "consejo", texto: "Con celiaquía o alergias graves, lo más seguro en una emergencia es que todo el hogar coma la versión segura: no habrá agua de sobra para lavar los utensilios. Puedes marcarlo arriba." });
    }
    if (dias === 3) out.avisos.push({ tipo: "consejo", texto: "Para 72 horas, prioriza lo que se come sin cocinar: legumbres de bote, conservas, tortitas y frutos secos. El arroz y la pasta necesitan agua extra y un hornillo, que solo debe usarse con buena ventilación." });
    return out;
  }

  const api = { compute, sanear, HORIZONTES, KCAL, AGUA, LIMITES, NECESIDADES, GRUPOS, AVISOS };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.PrepCalc = api;
})(typeof window !== "undefined" ? window : globalThis);
