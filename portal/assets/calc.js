// Cálculo de reservas del hogar. Módulo puro (sin DOM): se usa en el navegador (window.PrepCalc)
// y en Node para los tests (module.exports). Todas las cifras son orientativas.
(function (root) {
  "use strict";

  const HORIZONTES = [3, 7, 10];

  // ---------- Cifras de referencia (fuentes en FUENTES_CIFRAS, más abajo) ----------
  // kcal por persona y día. Adultos: 2.200, la cifra con la que planifica la BLE (Alemania) su reserva de 10 días.
  // Niños y mayores: media de chicos y chicas de los valores de referencia D-A-CH (actividad moderada), redondeada.
  const KCAL = { adulto: 2200, ninos: 1800, peques: 1300, mayor: 1900, extraLactancia: 500 };

  // Agua en litros por persona y día = bebida + cocina + higiene mínima.
  // Bebida: 1,5 L adultos, 2 L mayores de 65 y 1 L niños (BLE/DGE). Cocina: 0,5 L (BLE). Higiene: 1 L, el mínimo
  // para manos, dientes y utensilios (el Manual Esfera considera 2–6 L la higiene básica: si puedes, guarda más).
  const BEBIDA = { adulto: 1.5, mayor: 2, ninos: 1, peques: 1 };
  const COCINA = 0.5, HIGIENE = 1;
  const AGUA_BEBE = 1.5;         // ~1 L para preparar biberones y 0,5 L para lavarlos
  const EXTRA_LACTANCIA = 0.7;   // EFSA: +700 ml/día durante la lactancia
  const FACTOR_CALOR = 2;        // Ready.gov: con calor intenso se puede necesitar el doble de agua para beber
  // Mascotas: unos 50–60 ml por kg y día (referencia veterinaria habitual), con un peso típico por tamaño.
  const AGUA_MASCOTA = { perrosPeq: 0.4, perrosMed: 1, perrosGra: 2, gatos: 0.3 };
  // Comida de mascotas: peso típico por tamaño (kg) y energía de mantenimiento de un adulto, según FEDIAF:
  // perros 110 kcal × kg^0,75 (adulto medio; los muy sedentarios rondan 95) y gatos castrados o de interior
  // 75 kcal × kg^0,67 (rango 52–75: se toma el alto para tener margen). Pienso seco: ~3.500 kcal/kg el de perro
  // y ~3.700 el de gato (etiquetas habituales). La comida húmeda tiene unas 80–100 kcal/100 g: ~4 veces más peso.
  const PESO_MASCOTA = { perrosPeq: 7, perrosMed: 17, perrosGra: 35, gatos: 4 };
  const kcalMascota = (k) => k === "gatos" ? 75 * PESO_MASCOTA.gatos ** 0.67 : 110 * PESO_MASCOTA[k] ** 0.75;
  const PIENSO_G_DIA = Object.fromEntries(Object.keys(PESO_MASCOTA).map((k) =>
    [k, Math.ceil(kcalMascota(k) / (k === "gatos" ? 3.7 : 3.5) / 5) * 5])); // ≈ 140, 265, 455 y 55 g

  const LIMITES = {
    adultos: [0, 20], ninos: [0, 20], peques: [0, 20], bebes: [0, 10], mayores: [0, 10],
    perrosPeq: [0, 10], perrosMed: [0, 10], perrosGra: [0, 10], gatos: [0, 10],
  };
  const PERROS = ["perrosPeq", "perrosMed", "perrosGra"];

  const FORMULA_G_DIA = 110; // leche de fórmula en polvo por bebé que toma biberón (orientativo: unos 800 ml preparados)
  const PANALES_DIA = 7;     // de 8–10 en recién nacidos a 5–6 hacia los 2 años

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

  // Grupos de alimentos: reparto de las kcal y una unidad de compra con sus kcal y su peso neto (g).
  // kcal por unidad, de etiquetas habituales y de la BEDCA: pasta o arroz secos ~350 kcal/100 g; legumbre cocida
  // escurrida ~120 kcal/100 g (un bote de 400 g lleva unos 250 g escurridos); atún o sardinas en aceite escurridos
  // ~200 kcal por lata; frutos secos ~600 kcal/100 g; leche semidesnatada ~46 kcal/100 ml; fruta y verdura en
  // conserva, 100–250 kcal por lata.
  const sg = (s, p) => ({ s, p });
  const GRUPOS = [
    {
      id: "cereales", nombre: "Cereales y féculas", parte: 0.35, unidad: sg("paquete de 500 g", "paquetes de 500 g"), kcalUnidad: 1750, gUnidad: 500,
      texto(R) {
        let t;
        if (R.has("_sinFuego")) {
          // Sin hornillo: lo que se come tal cual o se ablanda en agua fría (copos y cuscús, en 30–60 minutos)
          t = R.has("celiaco")
            ? "Tortitas de arroz o maíz, copos de maíz y pan sin gluten certificados (se comen sin cocinar)"
            : "Picos de pan, pan tostado, tortitas de arroz o maíz, galletas, copos de avena y cuscús (se ablandan en agua fría)";
        } else {
          t = R.has("celiaco")
            ? "Arroz, copos de puré de patata, tortitas de arroz o maíz, y pasta o pan sin gluten certificados"
            : "Pasta, arroz, galletas o pan tostado";
        }
        const q = [];
        if (R.has("huevo")) q.push("pasta sin huevo");
        if (R.has("leche")) q.push("galletas y pan sin leche");
        if (R.has("soja")) q.push("revisa la soja en galletas y pan");
        return t + (q.length ? ` (${q.join("; ")})` : "");
      },
    },
    {
      id: "legumbres", nombre: "Legumbres", parte: 0.15, unidad: sg("bote de 400 g", "botes de 400 g"), kcalUnidad: 300, gUnidad: 400,
      texto(R) { return "Legumbres cocidas en bote (garbanzos, lentejas, alubias o frijoles)" + (R.has("hipertension") ? ", bajas en sal" : ""); },
    },
    {
      id: "proteina", nombre: "Proteína en conserva", parte: 0.15, unidad: sg("lata de unos 120 g", "latas de unos 120 g"), kcalUnidad: 200, gUnidad: 120,
      variante(R) {
        // Las dietas vegetariana y vegana cambian la unidad de compra
        if (R.has("vegano") || R.has("vegetariano")) return { unidad: sg("bote o ración de unos 200 g", "botes o raciones de unos 200 g"), kcalUnidad: 300, gUnidad: 200 };
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
      id: "grasas", nombre: "Grasas y frutos secos", parte: 0.15, unidad: sg("bolsa o botella de 200 g", "bolsas o botellas de 200 g"), kcalUnidad: 1200, gUnidad: 200,
      texto(R) {
        return R.has("frutosSecos")
          ? "Aceite de oliva y semillas de girasol o calabaza (revisa «puede contener trazas»)"
          : "Frutos secos, crema de cacahuete y aceite de oliva";
      },
    },
    {
      id: "lacteos", nombre: "Leche o bebida vegetal", parte: 0.10, unidad: sg("brik de 1 L", "briks de 1 L"), kcalUnidad: 460, gUnidad: 1030,
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
      id: "frutaVerdura", nombre: "Fruta y verdura en conserva", parte: 0.10, unidad: sg("lata o bote de unos 400 g", "latas o botes de unos 400 g"), kcalUnidad: 150, gUnidad: 400,
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
    // Compatibilidad: antes había un único campo «perros» (se toma como tamaño mediano)
    const src = { ...inp };
    if (src.perros != null && src.perrosMed == null) src.perrosMed = src.perros;
    for (const k of Object.keys(LIMITES)) o[k] = entero(src[k] ?? 0, LIMITES[k]);
    o.perros = PERROS.reduce((n, k) => n + o[k], 0);
    o.lactancia = !!inp.lactancia && o.bebes > 0;
    o.medicacion = !!inp.medicacion;
    o.calor = !!inp.calor;
    o.sinFuego = !!inp.sinFuego;
    o.todaLaFamilia = !!inp.todaLaFamilia;
    const comensales = o.adultos + o.ninos + o.peques + o.mayores;
    o.necesidades = {};
    for (const nd of NECESIDADES) {
      const c = entero(inp.necesidades?.[nd.id] ?? 0, [0, comensales]);
      if (c > 0) o.necesidades[nd.id] = c;
    }
    return o;
  }

  // Litros por persona y día según el grupo de edad (y el calor, que duplica la bebida)
  function aguaDia(grupo, calor) {
    if (grupo === "bebes") return AGUA_BEBE;
    return BEBIDA[grupo] * (calor ? FACTOR_CALOR : 1) + COCINA + HIGIENE;
  }

  function compute(input) {
    const i = sanear(input);
    const { dias } = i;
    const comensales = i.adultos + i.ninos + i.peques + i.mayores; // comen de la reserva general (los bebés aparte)
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
    const porGrupo = { adultos: "adulto", mayores: "mayor", ninos: "ninos", peques: "peques", bebes: "bebes" };
    let aguaPersonasDia = 0, bebidaDia = 0;
    for (const [k, g] of Object.entries(porGrupo)) {
      aguaPersonasDia += i[k] * aguaDia(g, i.calor);
      if (g !== "bebes") bebidaDia += i[k] * BEBIDA[g] * (i.calor ? FACTOR_CALOR : 1);
    }
    const nPersonasNoBebe = comensales;
    const aguaPersonas = aguaPersonasDia * dias;
    const aguaLactancia = i.lactancia ? EXTRA_LACTANCIA * dias : 0;
    const aguaPerros = PERROS.reduce((s, k) => s + i[k] * AGUA_MASCOTA[k], 0) * dias;
    const aguaGatos = i.gatos * AGUA_MASCOTA.gatos * dias;
    const aguaTotal = redondeo1(aguaPersonas + aguaLactancia + aguaPerros + aguaGatos);
    out.agua = {
      total: aguaTotal, personas: redondeo1(aguaPersonas), lactancia: redondeo1(aguaLactancia),
      perros: redondeo1(aguaPerros), gatos: redondeo1(aguaGatos), garrafas5L: Math.ceil(aguaTotal / 5),
      // desglose de lo que beben, cocinan y usan para higiene las personas (sin bebés), para todo el periodo
      bebida: redondeo1(bebidaDia * dias), cocina: redondeo1(nPersonasNoBebe * COCINA * dias), higiene: redondeo1(nPersonasNoBebe * HIGIENE * dias),
      bebes: redondeo1(i.bebes * AGUA_BEBE * dias),
    };

    // ---------- Energía ----------
    const kcalDia = i.adultos * KCAL.adulto + i.ninos * KCAL.ninos + i.peques * KCAL.peques + i.mayores * KCAL.mayor + (i.lactancia ? KCAL.extraLactancia : 0);
    out.kcal = { dia: kcalDia, total: kcalDia * dias };

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
        const cantidad = Math.ceil(kc / g.kcalUnidad);
        linea.base = { personas: nBase, cantidad, unidad: g.unidad, gramos: cantidad * g.gUnidad, texto: g.texto(new Set(i.sinFuego ? ["_sinFuego"] : [])) };
      }
      if (nSegura > 0 && kcalGrupo > 0) {
        const v = (g.variante && g.variante(activas)) || {};
        const unidad = v.unidad || g.unidad, kcalUnidad = v.kcalUnidad || g.kcalUnidad, gUnidad = v.gUnidad || g.gUnidad;
        const kc = kcalGrupo * (nSegura / comensales);
        const cantidad = Math.ceil(kc / kcalUnidad);
        const rTexto = new Set([...activas, ...(i.sinFuego ? ["_sinFuego"] : [])]);
        linea.segura = { personas: nSegura, cantidad, unidad, gramos: cantidad * gUnidad, texto: g.texto(rTexto), por: afectan.map((n) => n.id) };
      }
      if (linea.base || linea.segura) out.grupos.push(linea);
    }
    out.kcalMediaPersona = Math.round(kcalMedia);
    // Peso neto real de lo que sale en la lista (latas y botes con su líquido): sirve para saber cuánto espacio ocupa
    out.kgComida = redondeo1(out.grupos.reduce((s, g) => s + (g.base?.gramos || 0) + (g.segura?.gramos || 0), 0) / 1000);
    // Pienso seco de las mascotas para todo el periodo (aparte de la comida de las personas)
    const piensoPerros = PERROS.reduce((s, k) => s + i[k] * PIENSO_G_DIA[k], 0) * dias / 1000;
    const piensoGatos = i.gatos * PIENSO_G_DIA.gatos * dias / 1000;
    const arriba = (n) => (n > 0 ? Math.ceil(n * 10 - 1e-9) / 10 : 0); // redondeo hacia arriba: mejor que sobre
    out.pienso = { perros: arriba(piensoPerros), gatos: arriba(piensoGatos), total: arriba(piensoPerros) + arriba(piensoGatos) };

    // ---------- Otros suministros ----------
    const S = out.suministros;
    const linternas = Math.max(1, adultosCuidadores);
    const juegosPilas = 2 + Math.floor(dias / 3);
    const baterias = Math.max(1, Math.ceil(adultosCuidadores / 2));
    const rollos = Math.max(1, Math.ceil((personas * dias) / 3)); // un rollo dura unos 3 días por persona
    S.push({ id: "luz", texto: `${plural(linternas, "linterna", "linternas")} y ${plural(juegosPilas, "juego", "juegos")} de pilas de repuesto` });
    S.push({ id: "energia", texto: `1 radio de pilas o de manivela y ${plural(baterias, "batería externa", "baterías externas")}` });
    S.push({ id: "abrigo", texto: `${plural(personas, "manta térmica", "mantas térmicas")} y ${plural(rollos, "rollo", "rollos")} de papel higiénico` });
    S.push({ id: "efectivo", texto: `Efectivo en billetes pequeños para ${plural(dias, "día", "días")} de compras básicas` });
    if (i.bebes) {
      S.push({ id: "panales", texto: `${plural(i.bebes * PANALES_DIA * dias, "pañal", "pañales")} y toallitas` });
      S.push({ id: "formula", texto: `Si toma biberón: unos ${(i.bebes * FORMULA_G_DIA * dias / 1000).toLocaleString("es-ES", { maximumFractionDigits: 1 })} kg de leche de fórmula en polvo (comprueba la dosis de tu marca), preparada con agua embotellada. Si ya come, añade potitos o purés que no necesiten frío.` });
    }
    if (i.lactancia) S.push({ id: "lactancia", texto: `Lactancia materna: ya están sumadas ${KCAL.extraLactancia} kcal y ${String(EXTRA_LACTANCIA).replace(".", ",")} L de agua más al día para la madre` });
    if (i.mayores) S.push({ id: "mayores", texto: "Personas mayores: gafas de repuesto, pilas para los audífonos y ayudas técnicas" });
    if (i.medicacion || i.mayores || activas.has("diabetes")) S.push({ id: "medicacion", texto: `Medicación para ${plural(dias + 7, "día", "días")} (el horizonte más una semana de margen) y copia de las recetas` });
    const coma = (n) => String(n).replace(".", ",");
    if (i.perros) S.push({ id: "perros", texto: `${i.perros === 1 ? "Perro" : "Perros"}: ${coma(Math.max(0.1, out.pienso.perros))} kg de su pienso seco habitual (o unas 4 veces ese peso en latas de comida húmeda) y ${coma(out.agua.perros)} L de agua (ya sumados arriba). Además: comedero y bebedero, correa, bozal, bolsas, su medicación y la cartilla con las vacunas` });
    if (i.gatos) S.push({ id: "gatos", texto: `Gatos u otras mascotas pequeñas: ${coma(Math.max(0.1, out.pienso.gatos))} kg de su pienso seco habitual (o unas 4 veces ese peso en latas de comida húmeda) y ${coma(out.agua.gatos)} L de agua (ya sumados arriba). Además: arena y bandeja, ${i.gatos === 1 ? "transportín" : `un transportín por animal (${i.gatos})`}, comedero, su medicación y la cartilla. Si es otra especie (conejo, ave, roedor), guarda su comida propia` });
    if (out.mascotas) S.push({ id: "mascotasConsejo", texto: "Mascotas: no cambies de comida de golpe (les sienta mal), guarda el pienso en un recipiente hermético y rótalo, y lleva una foto tuya con ellas por si os separáis" });

    // ---------- Avisos ----------
    for (const id of activas) out.avisos.push({ tipo: "info", necesidad: id, texto: AVISOS[id] });
    const graves = ["celiaco", "frutosSecos", "leche"].filter((id) => activas.has(id));
    if (!i.todaLaFamilia && graves.some((id) => i.necesidades[id] < comensales)) {
      out.avisos.push({ tipo: "consejo", texto: "Con celiaquía o alergias graves, lo más seguro en una emergencia es que todo el hogar coma la versión segura: no habrá agua de sobra para lavar los utensilios. Puedes marcarlo arriba." });
    }
    if (i.calor) out.avisos.push({ tipo: "consejo", texto: `Con calor se ha duplicado el agua para beber. Guarda el agua a la sombra y bebe aunque no tengas sed: los mayores y los niños pequeños se deshidratan antes.` });
    if (i.sinFuego) out.avisos.push({ tipo: "consejo", texto: "Sin hornillo ni fuego: todo lo de la lista se come tal cual o se ablanda en agua fría. Las legumbres secas, el arroz y la pasta crudos no sirven (las alubias crudas son tóxicas): compra legumbres cocidas en bote." });
    else if (dias === 3) out.avisos.push({ tipo: "consejo", texto: "Para 72 horas, prioriza lo que se come sin cocinar: legumbres de bote, conservas, tortitas y frutos secos. El arroz y la pasta necesitan agua extra y un hornillo, que solo debe usarse con buena ventilación." });
    return out;
  }

  // ---------- Menú de ejemplo ----------
  // Cada plato tiene alternativas en orden de preferencia y unas etiquetas con lo que contiene:
  // G gluten · L proteína de la leche · LA lactosa · H huevo · FS frutos secos o cacahuete · P pescado o marisco
  // S soja · C carne · AN otro producto animal (lácteos, huevo) · AZ azúcar añadido · SAL muy salado.
  // Se elige la primera alternativa que no lleve nada prohibido para NINGUNA de las necesidades marcadas, así el
  // menú sirve para todo el hogar. La última alternativa de cada plato no lleva ninguna etiqueta: siempre hay opción.
  const PROHIBIDOS = {
    celiaco: ["G"], lactosa: ["LA"], leche: ["L", "LA"], frutosSecos: ["FS"], huevo: ["H"], pescado: ["P"], soja: ["S"],
    vegetariano: ["C", "P"], vegano: ["C", "P", "AN", "L", "LA", "H"], diabetes: ["AZ"], hipertension: ["SAL"],
  };
  const pl = (t, ...tags) => ({ t, tags });

  // ---------- Ejemplos concretos de compra ----------
  // Para lo que falta de cada grupo: qué productos comprar y cuántos de cada, en la MISMA unidad del grupo
  // (p. ej. «16 botes de 400 g» → 6 de garbanzos, 5 de lentejas y 5 de alubias). Etiquetas como en el menú:
  // se descarta lo que no sirve para alguna necesidad marcada, y lo que hay que cocinar si no hay hornillo.
  // u: envase [singular, plural] (por defecto, el del grupo); x: cuántos de ese envase equivalen a una unidad del grupo
  const ej = (t, o = {}) => ({ t, tags: o.tags || [], cocinar: !!o.cocinar, u: o.u, x: o.x || 1 });
  const U = { paquete: ["paquete", "paquetes"], bote: ["bote", "botes"], lata: ["lata", "latas"], brik: ["brik", "briks"],
    bolsa: ["bolsa", "bolsas"], botella: ["botella", "botellas"] };
  const EJEMPLOS = {
    cereales: { max: 3, u: U.paquete, l: [ej("arroz", { cocinar: true }), ej("pasta", { tags: ["G"], cocinar: true }), ej("galletas", { tags: ["G", "L", "AZ"] }),
      ej("picos o pan tostado", { tags: ["G"] }), ej("copos de avena", { tags: ["G"] }),
      ej("tortitas de arroz o maíz", { u: ["paquete pequeño", "paquetes pequeños"], x: 4 })] },
    legumbres: { max: 3, u: U.bote, l: [ej("garbanzos cocidos"), ej("lentejas cocidas"), ej("alubias cocidas")] },
    proteina: { max: 3, u: U.lata, l: [ej("sardinas en aceite", { tags: ["P", "C"] }), ej("caballa en aceite", { tags: ["P", "C"] }),
      ej("pollo o pavo en conserva", { tags: ["C"] }), ej("atún (de 80 g)", { tags: ["P", "C"], u: ["lata pequeña", "latas pequeñas"], x: 2 }),
      ej("hummus que no necesite nevera", { u: U.bote }), ej("soja texturizada (100 g)", { tags: ["S"], cocinar: true, u: U.bolsa }),
      ej("garbanzos o lentejas cocidos, de más", { u: U.bote })] },
    grasas: { max: 3, u: U.bolsa, l: [ej("frutos secos (almendras, nueces o cacahuetes)", { tags: ["FS"] }), ej("crema de cacahuete", { tags: ["FS"], u: U.bote }),
      ej("aceite de oliva (250 ml)", { u: U.botella }), ej("semillas de girasol o calabaza")] },
    lacteos: { max: 1, u: U.brik, l: [ej("leche UHT entera o semidesnatada", { tags: ["L", "LA", "AN"] }), ej("leche UHT sin lactosa", { tags: ["L", "AN"] }),
      ej("bebida de soja enriquecida en calcio", { tags: ["S"] }), ej("bebida de avena enriquecida en calcio", { tags: ["G"] }), ej("bebida de arroz enriquecida en calcio")] },
    frutaVerdura: { max: 4, u: U.lata, l: [ej("fruta en su jugo (melocotón o piña)"), ej("maíz dulce"), ej("judías verdes o menestra", { u: U.bote }), ej("tomate triturado", { u: U.bote })] },
  };
  const unir = (l) => (l.length > 1 ? l.slice(0, -1).join(", ") + " y " + l[l.length - 1] : l[0] || "");
  const coma = (n) => String(n).replace(".", ",");
  // Devuelve el texto «Por ejemplo» para lo que falta de un tipo, o "" si no hay ejemplo
  function ejemplos(id, falta, entrada = {}) {
    if (!(falta > 0)) return "";
    if (id === "agua") {
      const g = Math.ceil(falta / 5), b = Math.ceil(falta / 1.5);
      return `${plural(g, "garrafa", "garrafas")} de 5 L (o ${b} botellas de 1,5 L)`;
    }
    if (id === "mascotas") {
      const saco = [1.5, 3, 4].find((k) => k >= falta);
      const sacos = saco ? `1 saco de ${coma(saco)} kg` : `${Math.ceil(falta / 4)} sacos de 4 kg`;
      return `${sacos} de su pienso de siempre (o unas ${Math.ceil(falta * 10)} latas de 400 g de comida húmeda)`;
    }
    const E = EJEMPLOS[id];
    if (!E) return "";
    const prohib = new Set(Object.keys(entrada.necesidades || {}).flatMap((n) => PROHIBIDOS[n] || []));
    let l = E.l.filter((e) => !e.tags.some((t) => prohib.has(t)) && !(entrada.sinFuego && e.cocinar));
    if (!l.length) l = [E.l[E.l.length - 1]]; // la última opción de cada grupo no lleva etiquetas
    const n = Math.ceil(falta - 1e-9), k = Math.min(E.max, l.length, n);
    return unir(l.slice(0, k).map((e, j) => {
      const c = (Math.floor(n / k) + (j < n % k ? 1 : 0)) * e.x, [us, up] = e.u || E.u;
      return `${plural(c, us, up)} de ${e.t}`;
    }));
  }
  const SEGURO = {
    desayuno: pl("Bebida de arroz, tortitas de arroz o maíz con aceite de oliva y fruta en su jugo"),
    comida: pl("Garbanzos de bote enjuagados con maíz, pimiento asado y aceite de oliva"),
    merienda: pl("Semillas de girasol o de calabaza y fruta en su jugo"),
    cena: pl("Lentejas de bote enjuagadas con verduras en conserva y tortitas de maíz"),
  };
  // cocina: false = se come sin cocinar (días 1–3); true = con hornillo y buena ventilación (días 4–7)
  const MENU_DIAS = [
    { cocina: false, desayuno: [pl("Leche UHT con galletas y un zumo pequeño", "L", "LA", "AN", "G", "H", "AZ"), pl("Bebida de avena sin gluten enriquecida con copos de maíz y fruta en su jugo")],
      comida: [pl("Ensalada de garbanzos de bote con atún, maíz y aceite de oliva", "P")],
      merienda: [pl("Un puñado de frutos secos y pasas", "FS"), pl("Semillas de girasol y pasas")],
      cena: [pl("Sardinas en lata con picos de pan y tomate en conserva", "P", "G", "SAL"), pl("Hummus de bote con tortitas de arroz y pimientos asados")] },
    { cocina: false, desayuno: [pl("Pan tostado con crema de cacahuete y leche UHT", "G", "FS", "L", "LA", "AN"), pl("Tortitas de arroz con crema de semillas de girasol y bebida de arroz")],
      comida: [pl("Alubias blancas de bote con caballa en aceite y pimientos asados", "P"), pl("Alubias blancas de bote con pimientos asados, cebolla y aceite de oliva")],
      merienda: [pl("Barrita de cereales y fruta en conserva", "G", "AZ", "L", "LA", "AN", "FS", "S"), pl("Fruta en su jugo y tortitas de maíz")],
      cena: [pl("Pollo en conserva con maíz y pan de molde", "C", "G", "S"), pl("Garbanzos de bote con pimentón, aceite y verduras en conserva")] },
    { cocina: false, desayuno: [pl("Queso curado con picos de pan y leche UHT", "L", "AN", "G", "LA"), pl("Queso curado con tortitas de arroz y fruta en su jugo", "L", "AN"), pl("Copos de maíz sin gluten con bebida de arroz y fruta en su jugo")],
      comida: [pl("Ensalada de lentejas de bote con atún, tomate y aceite de oliva", "P"), pl("Ensalada de lentejas de bote con tomate, maíz y aceite de oliva")],
      merienda: [pl("Chocolate negro y almendras", "FS", "AZ", "L"), pl("Pasas y semillas de calabaza")],
      cena: [pl("Mejillones en escabeche con picos de pan", "P", "G", "SAL"), pl("Alubias de bote con verduras en conserva y tortitas de arroz")] },
    { cocina: true, desayuno: [pl("Copos de avena cocidos con leche UHT y pasas", "G", "L", "LA", "AN"), pl("Copos de arroz cocidos con bebida de arroz y pasas")],
      comida: [pl("Pasta con tomate frito y atún", "G", "P"), pl("Arroz con tomate frito y garbanzos de bote")],
      merienda: [pl("Frutos secos y fruta en su jugo", "FS"), pl("Semillas de girasol y fruta en su jugo")],
      cena: [pl("Sopa de sobre con fideos y pollo en conserva", "G", "C", "SAL"), pl("Arroz blanco con lentejas de bote y aceite de oliva")] },
    { cocina: true, desayuno: [pl("Leche UHT con galletas y fruta en su jugo", "L", "LA", "AN", "G", "H", "AZ"), pl("Bebida de arroz caliente con tortitas de maíz y fruta en su jugo")],
      comida: [pl("Arroz con lentejas de bote y verduras en conserva")],
      merienda: [pl("Galletas y un zumo pequeño", "G", "H", "AZ", "L", "LA", "AN"), pl("Tortitas de arroz con crema de semillas de girasol")],
      cena: [pl("Cuscús con garbanzos de bote y verduras en conserva", "G"), pl("Polenta (sémola de maíz) con tomate y garbanzos de bote")] },
    { cocina: true, desayuno: [pl("Pan tostado con aceite de oliva y leche UHT", "G", "L", "LA", "AN"), pl("Tortitas de maíz con aceite de oliva, tomate en conserva y bebida de arroz")],
      comida: [pl("Lentejas de bote calientes con salchichas en conserva", "C", "SAL", "G"), pl("Lentejas de bote calientes con arroz y verduras en conserva")],
      merienda: [pl("Crema de cacahuete con tortitas de arroz", "FS"), pl("Pasas y semillas de calabaza")],
      cena: [pl("Pasta con sardinas en aceite y ajo", "G", "P"), pl("Arroz salteado con maíz, pimiento y garbanzos de bote")] },
    { cocina: true, desayuno: [pl("Copos de avena cocidos con leche UHT y pasas", "G", "L", "LA", "AN"), pl("Copos de arroz cocidos con bebida de arroz y fruta en su jugo")],
      comida: [pl("Potaje rápido de garbanzos de bote con espinacas en conserva y pimentón")],
      merienda: [pl("Chocolate negro y fruta en su jugo", "AZ", "L"), pl("Fruta en su jugo y tortitas de maíz")],
      cena: [pl("Fideos con caldo de brik y atún", "G", "P", "SAL"), pl("Arroz caldoso con caldo de verduras sin gluten y alubias de bote")] },
    // Días extra sin cocinar, para quien no tiene hornillo ni fuego
    { cocina: false, desayuno: [pl("Copos de avena ablandados en leche UHT fría (desde la noche anterior) con pasas", "G", "L", "LA", "AN"), pl("Copos de maíz sin gluten con bebida de arroz y pasas")],
      comida: [pl("Cuscús hidratado en agua fría (30–60 min) con garbanzos de bote, tomate y aceite", "G"), pl("Ensalada de alubias de bote con maíz, tomate en conserva y aceite de oliva")],
      merienda: [pl("Frutos secos y orejones", "FS"), pl("Orejones y semillas de calabaza")],
      cena: [pl("Paté o atún en lata con picos de pan y pimientos asados", "P", "G", "SAL"), pl("Hummus de bote con tortitas de maíz y verduras en conserva")] },
    { cocina: false, desayuno: [pl("Galletas con crema de cacahuete y leche UHT", "G", "FS", "L", "LA", "AN", "H", "AZ"), pl("Tortitas de arroz con crema de semillas de girasol y fruta en su jugo")],
      comida: [pl("Ensalada de lentejas de bote con sardinas, cebolla y aceite", "P"), pl("Ensalada de lentejas de bote con pimiento asado, cebolla y aceite de oliva")],
      merienda: [pl("Barrita de cereales y un zumo pequeño", "G", "AZ", "L", "LA", "AN", "FS", "S"), pl("Fruta en su jugo y tortitas de arroz")],
      cena: [pl("Pollo en conserva con maíz, tomate y tortitas de maíz", "C"), pl("Garbanzos de bote con espinacas en conserva, pimentón y aceite")] },
  ];
  const MOMENTOS = [["desayuno", "Desayuno"], ["comida", "Comida"], ["merienda", "Merienda"], ["cena", "Cena"]];

  function menu(input) {
    const i = sanear(input);
    const activas = Object.keys(i.necesidades);
    const prohibido = new Set(activas.flatMap((id) => PROHIBIDOS[id] || []));
    const ok = (p) => !p.tags.some((t) => prohibido.has(t));
    // Días 1–3 sin cocinar; 4–7 con hornillo; para 10 días se repiten los días 1–3 al final.
    // Sin hornillo ni fuego: solo días sin cocinar, rotando 5 menús distintos.
    const SIN = [0, 1, 2, 7, 8];
    const orden = i.sinFuego
      ? Array.from({ length: i.dias }, (_, n) => SIN[n % SIN.length])
      : i.dias === 3 ? [0, 1, 2] : i.dias === 7 ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4, 5, 6, 0, 1, 2];
    const dias = orden.map((k, n) => {
      const d = MENU_DIAS[k];
      return {
        dia: n + 1, cocina: d.cocina,
        comidas: MOMENTOS.map(([id, nombre]) => ({ id, nombre, texto: ((d[id] || []).find(ok) || SEGURO[id]).t })),
      };
    });
    const notas = [];
    if (activas.length) notas.push("El menú respeta a la vez todas las necesidades marcadas, para que sirva a todo el hogar y no haga falta cocinar aparte.");
    if (activas.includes("celiaco")) notas.push("Celiaquía: todos los productos deben llevar «sin gluten» (también la avena, las tortitas y las conservas con salsa).");
    if (activas.includes("hipertension")) notas.push("Hipertensión: enjuaga las legumbres de bote y elige conservas «sin sal añadida».");
    if (i.sinFuego) notas.push("Todo el menú se come sin cocinar. Los copos de avena y el cuscús se ablandan en agua o leche fría: déjalos en remojo 30–60 minutos (o la noche anterior).");
    else if (i.dias > 3) notas.push("Los días con hornillo necesitan unos 0,5 L de agua por persona para cocinar (ya incluidos en la calculadora). Usa el hornillo solo con buena ventilación, nunca en un espacio cerrado.");
    if (i.bebes) notas.push("Los bebés van aparte: leche materna o de fórmula y potitos que no necesiten frío.");
    return { dias, notas, apto: activas };
  }

  // ---------- Distancia y rumbo entre dos coordenadas (para «Mis puntos», sin conexión) ----------
  const RUMBOS = ["norte", "noreste", "este", "sureste", "sur", "suroeste", "oeste", "noroeste"];
  function distanciaRumbo(lat1, lon1, lat2, lon2) {
    const rad = Math.PI / 180, R0 = 6371000; // radio medio de la Tierra en metros
    const φ1 = lat1 * rad, φ2 = lat2 * rad, dφ = (lat2 - lat1) * rad, dλ = (lon2 - lon1) * rad;
    const h = Math.sin(dφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(dλ / 2) ** 2;
    const metros = 2 * R0 * Math.asin(Math.min(1, Math.sqrt(h)));
    const y = Math.sin(dλ) * Math.cos(φ2), x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(dλ);
    const grados = (Math.atan2(y, x) / rad + 360) % 360;
    return { metros: Math.round(metros), grados: Math.round(grados), rumbo: RUMBOS[Math.round(grados / 45) % 8] };
  }
  // Acepta «40.4168, -3.7038», «40,4168 -3,7038» o «40.4168;-3.7038»
  function parseCoords(txt) {
    const m = String(txt || "").trim().match(/^(-?\d{1,2}(?:[.,]\d+)?)\s*[,; ]\s*(-?\d{1,3}(?:[.,]\d+)?)$/);
    if (!m) return null;
    const lat = Number(m[1].replace(",", ".")), lon = Number(m[2].replace(",", "."));
    return Math.abs(lat) <= 90 && Math.abs(lon) <= 180 ? { lat, lon } : null;
  }

  // ---------- Potabilizar con lejía ----------
  // CDC/EPA: lejía doméstica al 5–8 % sin perfume → 2 gotas por litro (4 si el agua está turbia o muy fría) y
  // esperar al menos 30 minutos. En España, solo lejía con la indicación «apta para la desinfección del agua de bebida».
  function gotasLejia(litros, turbia = false) {
    const l = Math.max(0, Number(litros) || 0);
    const gotas = Math.ceil(l * (turbia ? 4 : 2));
    return { litros: l, gotas, ml: Math.round(gotas * 0.05 * 10) / 10, esperaMin: 30 };
  }

  const AGUA = { BEBIDA, COCINA, HIGIENE, AGUA_BEBE, EXTRA_LACTANCIA, FACTOR_CALOR, AGUA_MASCOTA };
  const MASCOTAS = { PESO_MASCOTA, PIENSO_G_DIA };

  /* ---------- Código Morse (internacional, UIT-R M.1677-1, más la Ñ de uso en español) ---------- */
  const MORSE = {
    A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....", I: "..", J: ".---",
    K: "-.-", L: ".-..", M: "--", N: "-.", "Ñ": "--.--", O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...",
    T: "-", U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
    0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-", 5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----.",
    ".": ".-.-.-", ",": "--..--", "?": "..--..", "/": "-..-.", "-": "-....-", "@": ".--.-.", "=": "-...-",
  };
  // Orden de la tabla (las claves numéricas de un objeto se recorren antes que las letras)
  const MORSE_ORDEN = [..."ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789", ".", ",", "?", "/", "-", "@", "="];
  const DEMORSE = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));
  const SOS = "...---..."; // señal de socorro: se transmite seguida, sin pausa entre letras

  // Texto → Morse: letras separadas por espacio y palabras por " / ". Las tildes se quitan (salvo la Ñ).
  function aMorse(texto) {
    const desconocidos = new Set();
    const palabras = String(texto || "").toUpperCase().replace(/Ñ/g, "\u0000").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\u0000/g, "Ñ")
      .trim().split(/\s+/).filter(Boolean)
      .map((w) => [...w].map((ch) => { if (MORSE[ch]) return MORSE[ch]; desconocidos.add(ch); return null; }).filter(Boolean).join(" "))
      .filter(Boolean);
    return { codigo: palabras.join(" / "), desconocidos: [...desconocidos] };
  }

  // Morse → texto. Acepta "." y "-" (también "·", "•", "_", "—", "–") y separa palabras con "/" o con 3+ espacios.
  function deMorse(codigo) {
    const limpio = String(codigo || "").replace(/[·•∙]/g, ".").replace(/[_—–−]/g, "-");
    return limpio.trim().split(/\s*\/\s*|\s{3,}/).map((w) => w.trim().split(/\s+/).filter(Boolean)
      .map((l) => DEMORSE[l] || (l === SOS ? "SOS" : "?")).join("")).filter(Boolean).join(" ");
  }

  // Código → secuencia de [encendido, unidades]: punto 1, raya 3, entre señales 1, entre letras 3, entre palabras 7.
  function secuenciaMorse(codigo) {
    const sec = [];
    const pausa = (u) => { if (!sec.length) return; const ult = sec[sec.length - 1]; if (ult[0]) sec.push([false, u]); else ult[1] = Math.max(ult[1], u); };
    for (const ch of String(codigo || "")) {
      if (ch === "." || ch === "-") { pausa(1); sec.push([true, ch === "." ? 1 : 3]); }
      else if (ch === " ") pausa(3);
      else if (ch === "/") pausa(7);
    }
    if (sec.length && !sec[sec.length - 1][0]) sec.pop();
    return sec;
  }

  const api = { MASCOTAS, ejemplos, EJEMPLOS, compute, sanear, aguaDia, menu, gotasLejia, distanciaRumbo, parseCoords, aMorse, deMorse, secuenciaMorse, MORSE, MORSE_ORDEN, SOS, HORIZONTES, KCAL, AGUA, LIMITES, PERROS, NECESIDADES, GRUPOS, AVISOS, MENU_DIAS, PROHIBIDOS };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.PrepCalc = api;
})(typeof window !== "undefined" ? window : globalThis);
