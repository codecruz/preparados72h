// Contenido del portal. Alerta y fuentes revisadas el 8 nov 2026; cada cifra lleva su fuente.
window.PREP_DATA = {
  alerta: {
    fecha: "Revisado el 8 de noviembre de 2026",
    titulo: "Ciberataques a la refrigeración de supermercados en Europa",
    resumen:
      "El 2 de noviembre, una segunda oleada de ciberataques contra la refrigeración de supermercados rompió la cadena de frío en tiendas de al menos siete países europeos, un mes después del ataque en Francia. Es un buen recordatorio de por qué conviene tener en casa una reserva para al menos 72 horas.",
    datos: [
      ["Alcance", "Al menos siete países el 2 de noviembre; en octubre ya se atacó a cientos de supermercados en Francia."],
      ["Países", "Bélgica, Luxemburgo, Países Bajos, Irlanda, Finlandia, Suecia y Estonia."],
      ["Cadenas afectadas", "Delhaize (unas 40 tiendas), Carrefour (15 en Bélgica), Colruyt, Spar, ICA y Coop, SuperValu (13 en Irlanda) y Selver (Estonia), entre otras."],
      ["Cómo", "Controladores de refrigeración gestionados a distancia: los evaporadores pasaron a modo descongelación y las cámaras se calentaron."],
      ["Impacto", "Hasta 50 °C en una cámara de Estonia; un Delhaize de Hoeilaart (Bélgica) calcula 100.000 € en alimentos perdidos."],
      ["Autoría", "Sin atribución oficial. Hay reivindicaciones de grupos prorrusos que las autoridades no han confirmado."],
    ],
  },

  // Recomendaciones oficiales a los hogares, por país. iso = código numérico ISO 3166 (contorno del mapa),
  // lat/lon = capital (marcador). dias = horizonte que se lleva a la calculadora (3, 7 o 10).
  // nivel: 3 = 72 horas, 7 = una semana, 10 = diez días o más, 0 = pide prepararse sin cifra recogida. Revisado en noviembre de 2026.
  paises: [
    { iso: "276", pais: "Alemania", lat: 52.52, lon: 13.40, nivel: 10, dias: 10, horizonte: "Hasta 10 días", nota: "Lo ideal son 10 días; 3 días ya ayudan mucho y se puede ir ampliando.", fuente: "BBK (Oficina Federal de Protección Civil)", url: "https://www.bbk.bund.de/DE/Warnung-Vorsorge/Vorsorge/Ratgeber-Checkliste/ratgeber-checkliste_node.html" },
    { iso: "040", pais: "Austria", lat: 48.21, lon: 16.37, nivel: 10, dias: 10, horizonte: "10 a 14 días", nota: "El Tirol pide reservas para al menos 14 días; el portal del Gobierno austriaco habla de 10 a 14.", fuente: "Land Tirol · Protección civil", url: "https://www.tirol.gv.at/leicht-lesen/sicherheit-zivilschutz-und-hilfe-bei-gewalt/zivilschutz-selbstschutz-bevorratung" },
    { iso: "752", pais: "Suecia", lat: 59.33, lon: 18.07, nivel: 7, dias: 7, horizonte: "Al menos una semana", nota: "Folleto «Si llega la crisis o la guerra», enviado a todos los hogares.", fuente: "MCF (antes MSB)", url: "https://www.mcf.se/sv/rad-till-privatpersoner/" },
    { iso: "578", pais: "Noruega", lat: 59.91, lon: 10.75, nivel: 7, dias: 7, horizonte: "Una semana", nota: "Amplió la recomendación de 3 días a una semana.", fuente: "DSB · Sikker hverdag", url: "https://www.sikkerhverdag.no/" },
    { iso: "756", pais: "Suiza", lat: 46.95, lon: 7.45, nivel: 7, dias: 7, horizonte: "Una semana", nota: "Comida para una semana y 9 L de agua por persona (un pack de seis botellas).", fuente: "BWL (Abastecimiento Económico del País)", url: "https://www.bwl.admin.ch/de/notvorrat" },
    { iso: "233", pais: "Estonia", lat: 59.44, lon: 24.75, nivel: 7, dias: 7, horizonte: "Una semana", nota: "Reserva para una semana, empezando por 21 L de agua por persona.", fuente: "Gobierno de Estonia · kriis.ee", url: "https://kriis.ee/en/security-situation-europe/preparing-possible-crises/how-can-i-prepare-possible-crises" },
    { iso: "158", pais: "Taiwán", lat: 25.03, lon: 121.56, nivel: 7, dias: 7, horizonte: "Una semana", nota: "Guía nacional de seguridad «In Case of Crisis», repartida en 2025 a todos los hogares.", fuente: "Agencia de Movilización para la Defensa", url: "https://prepare.mnd.gov.tw/" },
    { iso: "392", pais: "Japón", lat: 35.68, lon: 139.69, nivel: 3, dias: 3, horizonte: "Mínimo 3 días, mejor una semana", nota: "Agua, comida e inodoro de emergencia para al menos 3 días; idealmente una semana.", fuente: "FDMA (Agencia de Gestión de Incendios y Desastres)", url: "https://www.fdma.go.jp/relocation/bousai_manual/e/pre/preparation081.html" },
    { iso: "246", pais: "Finlandia", lat: 60.17, lon: 24.94, nivel: 3, dias: 3, horizonte: "Al menos 72 horas", nota: "Campaña «72 tuntia»: cada hogar debe valerse por sí mismo al menos 72 horas.", fuente: "SPEK · Agencia Nacional de Abastecimiento", url: "https://72tuntia.fi/en/" },
    { iso: "208", pais: "Dinamarca", lat: 55.68, lon: 12.57, nivel: 3, dias: 3, horizonte: "3 días", nota: "Folleto «Forberedt på kriser»: unos 9 L de agua por persona para 3 días.", fuente: "Beredskabsstyrelsen", url: "https://www.brs.dk/da/borger/" },
    { iso: "428", pais: "Letonia", lat: 56.95, lon: 24.11, nivel: 3, dias: 3, horizonte: "72 horas (mejor 3 a 7 días)", nota: "Folleto de las primeras 72 horas; aconseja reservas para 3 a 7 días.", fuente: "Ministerio de Defensa de Letonia", url: "https://www.mod.gov.lv/sites/mod/files/document/72H%20buklets_ENG_WEB_2024.pdf" },
    { iso: "616", pais: "Polonia", lat: 52.23, lon: 21.01, nivel: 3, dias: 3, horizonte: "3 días", nota: "«Poradnik bezpieczeństwa», guía enviada a todos los hogares.", fuente: "Gobierno de Polonia", url: "https://www.gov.pl/web/poradnikbezpieczenstwa" },
    { iso: "528", pais: "Países Bajos", lat: 52.37, lon: 4.90, nivel: 3, dias: 3, horizonte: "72 horas", nota: "Campaña «Denk vooruit»: 72 horas sin agua, luz ni internet.", fuente: "Gobierno de los Países Bajos", url: "https://www.denkvooruit.nl/" },
    { iso: "056", pais: "Bélgica", lat: 50.85, lon: 4.35, nivel: 3, dias: 3, horizonte: "72 horas", nota: "Kit para 72 horas sin agua, electricidad, gas ni internet.", fuente: "Centro Nacional de Crisis (NCCN)", url: "https://crisiscentrum.be/" },
    { iso: "372", pais: "Irlanda", lat: 53.35, lon: -6.26, nivel: 3, dias: 3, horizonte: "72 horas", nota: "Folleto «Be Emergency Ready»: 2 a 3 L de agua por persona y día.", fuente: "Oficina de Planificación de Emergencias", url: "https://www.gov.ie/en/department-of-the-taoiseach/publications/guidance-from-the-office-of-emergency-planning/" },
    { iso: "250", pais: "Francia", lat: 48.86, lon: 2.35, nivel: 3, dias: 3, horizonte: "72 horas", nota: "Guía «Tous responsables»: kit para 72 horas en casa.", fuente: "SGDSN", url: "https://www.sgdsn.gouv.fr/" },
    { iso: "826", pais: "Reino Unido", lat: 51.51, lon: -0.13, nivel: 3, dias: 3, horizonte: "3 días", nota: "Campaña «Prepare»: 3 L de agua por persona y día.", fuente: "Gobierno del Reino Unido", url: "https://prepare.campaign.gov.uk/" },
    { iso: "724", pais: "España", lat: 40.42, lon: -3.70, nivel: 3, dias: 3, horizonte: "72 horas", nota: "Plan familiar de emergencias con kit básico para 72 horas (2025).", fuente: "Dirección General de Protección Civil", url: "https://www.proteccioncivil.es/" },
    { iso: "124", pais: "Canadá", lat: 45.42, lon: -75.70, nivel: 3, dias: 3, horizonte: "Al menos 72 horas", nota: "Kit para valerse por sí mismo al menos 72 horas, con unos 4 L de agua por persona y día (2 para beber).", fuente: "Gobierno de Canadá · Get Prepared", url: "https://www.canada.ca/en/services/policing/emergencies/preparedness/get-prepared/emergency-kits.html" },
    { iso: "840", pais: "Estados Unidos", lat: 38.90, lon: -77.04, nivel: 3, dias: 3, horizonte: "Varios días", nota: "Ready.gov pide suministros para varios días; 1 galón (3,8 L) de agua por persona y día.", fuente: "Ready.gov (FEMA)", url: "https://www.ready.gov/kit" },
    { iso: "484", pais: "México", lat: 19.43, lon: -99.13, nivel: 3, dias: 3, horizonte: "72 horas", nota: "Mochila de emergencia para las primeras 72 horas, también en Ciudad de México.", fuente: "CENAPRED · Protección Civil", url: "https://www.gob.mx/cenapred" },
    { iso: "554", pais: "Nueva Zelanda", lat: -41.29, lon: 174.78, nivel: 3, dias: 3, horizonte: "Al menos 3 días", nota: "Al menos 3 días; para la comida, plantéate hasta 2 semanas.", fuente: "Gobierno de Nueva Zelanda", url: "https://www.govt.nz/browse/housing-and-property/home-emergency-checklist/" },
    // Sin guía oficial revisada aquí: recogidos en la recopilación de Newsweek (2026).
    { iso: "710", pais: "Sudáfrica", lat: -33.92, lon: 18.42, nivel: 3, dias: 3, horizonte: "Al menos 3 días (Ciudad del Cabo)", nota: "El Ayuntamiento de Ciudad del Cabo pide reservas para al menos 3 días.", fuente: "Ciudad del Cabo, recogido por Newsweek", url: "https://www.newsweek.com/map-shows-countries-urging-residents-to-stockpile-food-12629524" },
    { iso: "440", pais: "Lituania", lat: 54.69, lon: 25.28, nivel: 0, dias: 3, horizonte: "Pide prepararse, sin cifra recogida", nota: "Guía de supervivencia con mochila de emergencia.", fuente: "Newsweek (recopilación)", url: "https://www.newsweek.com/map-shows-countries-urging-residents-to-stockpile-food-12629524" },
    { iso: "203", pais: "Chequia", lat: 50.08, lon: 14.44, nivel: 0, dias: 3, horizonte: "Pide prepararse, sin cifra recogida", nota: "Ha pedido a los hogares tener reservas de emergencia.", fuente: "Newsweek (recopilación)", url: "https://www.newsweek.com/map-shows-countries-urging-residents-to-stockpile-food-12629524" },
    { iso: "191", pais: "Croacia", lat: 45.81, lon: 15.98, nivel: 0, dias: 3, horizonte: "Pide prepararse, sin cifra recogida", nota: "Ha pedido a los hogares tener reservas de emergencia.", fuente: "Newsweek (recopilación)", url: "https://www.newsweek.com/map-shows-countries-urging-residents-to-stockpile-food-12629524" },
    { iso: "376", pais: "Israel", lat: 31.78, lon: 35.22, nivel: 0, dias: 3, horizonte: "Pide prepararse, sin cifra recogida", nota: "El Mando del Frente Interior pide tener suministros en casa.", fuente: "Newsweek (recopilación)", url: "https://www.newsweek.com/map-shows-countries-urging-residents-to-stockpile-food-12629524" },
    { iso: "356", pais: "India", lat: 28.61, lon: 77.21, nivel: 0, dias: 3, horizonte: "Pide prepararse, sin cifra recogida", nota: "La NDMA recomienda un kit de emergencia, sin plazo fijo.", fuente: "Newsweek (recopilación)", url: "https://www.newsweek.com/map-shows-countries-urging-residents-to-stockpile-food-12629524" },
    { iso: "608", pais: "Filipinas", lat: 14.60, lon: 120.98, nivel: 0, dias: 3, horizonte: "Pide prepararse, sin cifra recogida", nota: "Ha pedido a los hogares tener reservas de emergencia.", fuente: "Newsweek (recopilación)", url: "https://www.newsweek.com/map-shows-countries-urging-residents-to-stockpile-food-12629524" },
    { iso: "702", pais: "Singapur", lat: 1.35, lon: 103.82, nivel: 0, dias: 3, horizonte: "Pide prepararse, sin cifra recogida", nota: "Ha pedido a los hogares tener reservas de emergencia.", fuente: "Newsweek (recopilación)", url: "https://www.newsweek.com/map-shows-countries-urging-residents-to-stockpile-food-12629524" },
    { iso: "036", pais: "Australia", lat: -35.28, lon: 149.13, nivel: 0, dias: 3, horizonte: "Pide prepararse, sin cifra recogida", nota: "Recomendaciones por estado; en Australia Occidental, para zonas de ciclones.", fuente: "Newsweek (recopilación)", url: "https://www.newsweek.com/map-shows-countries-urging-residents-to-stockpile-food-12629524" },
    { iso: "170", pais: "Colombia", lat: 4.71, lon: -74.07, nivel: 0, dias: 3, horizonte: "Pide prepararse, sin cifra recogida", nota: "Ha pedido a los hogares tener reservas de emergencia.", fuente: "Newsweek (recopilación)", url: "https://www.newsweek.com/map-shows-countries-urging-residents-to-stockpile-food-12629524" },
    { iso: "076", pais: "Brasil", lat: -15.79, lon: -47.88, nivel: 0, dias: 3, horizonte: "Pide prepararse, sin cifra recogida", nota: "Ha pedido a los hogares tener reservas de emergencia.", fuente: "Newsweek (recopilación)", url: "https://www.newsweek.com/map-shows-countries-urging-residents-to-stockpile-food-12629524" },
    { iso: "152", pais: "Chile", lat: -33.45, lon: -70.67, nivel: 0, dias: 3, horizonte: "Pide prepararse, sin cifra recogida", nota: "Ha pedido a los hogares tener reservas de emergencia.", fuente: "Newsweek (recopilación)", url: "https://www.newsweek.com/map-shows-countries-urging-residents-to-stockpile-food-12629524" },
    { iso: "032", pais: "Argentina", lat: -34.60, lon: -58.38, nivel: 0, dias: 3, horizonte: "Pide prepararse, sin cifra recogida", nota: "Ha pedido a los hogares tener reservas de emergencia.", fuente: "Newsweek (recopilación)", url: "https://www.newsweek.com/map-shows-countries-urging-residents-to-stockpile-food-12629524" },
  ],
  // Marco común de la UE (Estrategia de la Unión de la Preparación, marzo de 2025)
  paisesUE: { texto: "La Comisión Europea pide que toda la población pueda ser autosuficiente al menos 72 horas. Cada país fija después su propia cifra.", url: "https://commission.europa.eu/topics/preparedness_en" },

  // Checklist de la mochila de 72 horas. "extra" = solo al ampliar a una semana o más.
  checklist: [
    {
      categoria: "Agua",
      icono: "💧",
      items: [
        { id: "agua", texto: "Agua potable: unos 3 L por adulto y día (1,5 para beber, 0,5 para cocinar y 1 de higiene mínima)" },
        { id: "agua-recip", texto: "Recipientes limpios y herméticos, guardados en un lugar fresco y oscuro" },
      ],
    },
    {
      categoria: "Alimentos",
      icono: "🥫",
      items: [
        { id: "conservas", texto: "Conservas y legumbres cocidas" },
        { id: "cereales", texto: "Cereales, frutos secos y barras energéticas" },
        { id: "faciles", texto: "Alimentos fáciles de preparar (sin frío ni cocción larga)" },
        { id: "abrelatas", texto: "Abrelatas manual y cubiertos básicos" },
      ],
    },
    {
      categoria: "Energía y comunicación",
      icono: "🔦",
      items: [
        { id: "linterna", texto: "Linterna con pilas de repuesto" },
        { id: "powerbank", texto: "Batería externa (power bank) cargada y cables" },
        { id: "radio", texto: "Radio portátil de pilas, dinamo o manivela" },
        { id: "silbato", texto: "Silbato para pedir ayuda" },
      ],
    },
    {
      categoria: "Salud",
      icono: "🩹",
      items: [
        { id: "botiquin", texto: "Botiquín de primeros auxilios y material de curación" },
        { id: "medicamentos", texto: "Medicación habitual y copia de las recetas" },
        { id: "higiene", texto: "Artículos de higiene (jabón, gel hidroalcohólico, papel, compresas)" },
      ],
    },
    {
      categoria: "Documentos y dinero",
      icono: "📄",
      items: [
        { id: "docs", texto: "Copias en papel de los documentos de identidad" },
        { id: "efectivo", texto: "Algo de efectivo en billetes pequeños" },
        { id: "contactos", texto: "Lista de contactos de emergencia en papel" },
      ],
    },
    {
      categoria: "Abrigo y utensilios",
      icono: "🧥",
      items: [
        { id: "mantas", texto: "Mantas térmicas" },
        { id: "ropa", texto: "Ropa adecuada a la estación y calzado cómodo" },
        { id: "utensilios", texto: "Utensilios básicos: navaja multiusos, cinta americana, bolsas, mechero" },
      ],
    },
    {
      categoria: "Para una semana o más",
      icono: "📦",
      extra: true,
      items: [
        { id: "ext-agua", texto: "Ampliar la reserva de agua y de alimentos" },
        { id: "ext-medic", texto: "Ampliar medicamentos y pilas" },
        { id: "ext-bebes", texto: "Artículos para bebés (leche de fórmula, pañales), si los hay" },
        { id: "ext-mayores", texto: "Necesidades de personas mayores (gafas de repuesto, ayudas técnicas)" },
        { id: "ext-mascotas", texto: "Comida, agua y transportín para mascotas" },
      ],
    },
    {
      categoria: "Bolsa para volver a casa (coche o trabajo)",
      icono: "🚶",
      gethome: true,
      items: [
        { id: "gh-calzado", texto: "Calzado cómodo para caminar y calcetines de repuesto" },
        { id: "gh-agua", texto: "1–2 L de agua y barritas energéticas" },
        { id: "gh-frontal", texto: "Linterna frontal con pilas" },
        { id: "gh-bateria", texto: "Batería externa pequeña y cable del móvil" },
        { id: "gh-mapa", texto: "Mapa en papel con la ruta a casa y una ruta alternativa" },
        { id: "gh-abrigo", texto: "Chubasquero, gorro y guantes" },
        { id: "gh-botiquin", texto: "Botiquín mínimo y medicación para un día" },
        { id: "gh-efectivo", texto: "Algo de efectivo y una manta térmica" },
      ],
    },
  ],

  // Lecciones recurrentes de la comunidad r/prepping (posts más votados de 2026), redactadas
  // con palabras propias y contrastadas con las recomendaciones oficiales. No se reproducen publicaciones.
  comunidad: [
    { icono: "🥫", titulo: "Come lo que guardas, guarda lo que comes", texto: "Reserva alimentos que tu familia ya come y rótalos en el día a día. Practica recetas con ingredientes de larga duración y guarda también sal, especias y aceite: comer lo mismo tres días seguidos desanima a cualquiera." },
    { icono: "🏠", titulo: "Lo más probable es quedarse en casa", texto: "En la mayoría de emergencias (apagones, temporales, cortes de agua) lo seguro es refugiarse en casa. Huir al monte casi nunca es buena idea: asegura antes el agua, el calor, la luz y la comida en tu propio hogar." },
    { icono: "🎒", titulo: "Una mochila que puedas cargar", texto: "Pésala y camina una hora con ella. Si acabas agotado, sobra peso. Como referencia, que no pase del 10–20 % de tu peso corporal, y lleva solo lo esencial que sepas usar." },
    { icono: "🚗", titulo: "Piensa en cómo volver a casa", texto: "Si trabajas o estudias lejos, la emergencia puede pillarte fuera. Guarda en el coche o en el trabajo una bolsa pequeña para volver andando (tienes la lista en la checklist)." },
    { icono: "💧", titulo: "El agua se acaba antes de lo que crees", texto: "Las roturas de tuberías y los cortes de luz de varios días son de las emergencias más habituales. Guarda los bidones lejos de productos químicos, de la luz y de las heladas, y ten un método para potabilizar." },
    { icono: "🧠", titulo: "Habilidades antes que equipo", texto: "Primeros auxilios, cocinar sin electricidad, potabilizar agua, hacer reparaciones básicas… El conocimiento no pesa ni caduca. Un curso de primeros auxilios vale más que muchos aparatos." },
    { icono: "🤝", titulo: "Tus vecinos son tu mejor reserva", texto: "Conoce a tus vecinos, compartid teléfonos y sabed quién necesitará ayuda (personas mayores o dependientes). Quienes han vivido guerras y crisis largas coinciden: salen adelante mejor los que se apoyan." },
    { icono: "🛒", titulo: "Poco a poco, en cada compra", texto: "No hace falta gastar mucho de golpe. Añade un par de latas y una botella de agua de más en cada compra: en unas semanas tendrás tu reserva sin notarlo y sin acaparar." },
    { icono: "🧰", titulo: "Ordenado y listo para mover", texto: "Guarda los suministros en cajas estancas, por categorías y con etiqueta. Si un día tienes que salir con prisa, sabrás qué coger en minutos." },
    { icono: "🔥", titulo: "El calor también es supervivencia", texto: "En invierno, un apagón largo es sobre todo un problema de frío. Ten mantas, sacos y ropa de abrigo para vestirse por capas. Nunca uses braseros ni barbacoas dentro de casa, y las estufas de combustión solo si están hechas para interior, con ventilación y un detector de monóxido de carbono." },
  ],

  mitos: [
    { mito: "«Me iré al bosque a vivir de la naturaleza»", realidad: "Es duro y peligroso, y exige habilidades y una forma física que casi nadie tiene. Casi siempre es mejor quedarse en casa o ir a la de familiares." },
    { mito: "«Cuanto más equipo, mejor preparado»", realidad: "El equipo que no sabes usar o que no puedes cargar es peso muerto. Pruébalo todo antes de necesitarlo." },
    { mito: "«Enterrar un contenedor marítimo es un búnker barato»", realidad: "Sus paredes y su techo no están hechos para aguantar el empuje de la tierra y pueden hundirse. Cualquier estructura enterrada necesita un proyecto de un ingeniero." },
    { mito: "«Con comida liofilizada ya lo tengo resuelto»", realidad: "Es cara y monótona. Una despensa con lo que ya coméis, bien rotada, sale más barata y es más útil." },
    { mito: "«Prepararse es cosa de paranoicos»", realidad: "Varios gobiernos europeos recomiendan reservas para 72 horas, y Suecia y Noruega para una semana. Es sentido común, como tener un botiquín." },
  ],

  consejos: [
    { titulo: "Revisa cada seis meses", texto: "Rota los alimentos, comprueba fechas de caducidad y renueva las pilas." },
    { titulo: "Guarda bien el agua", texto: "En recipientes limpios y herméticos, en un lugar fresco y oscuro." },
    { titulo: "No compres por impulso", texto: "Calcula lo que tu hogar necesita de verdad y compra de forma gradual. Prepararse no es acaparar." },
    { titulo: "Depósito por encima de la mitad", texto: "Mantén el depósito del coche por encima de la mitad siempre que puedas." },
    { titulo: "Plan familiar", texto: "Acordad un punto de encuentro, contactos fuera de la zona y qué hacer si no hay teléfono." },
    { titulo: "Si se va la luz", texto: "Mantén cerrados el frigorífico y el congelador y consume primero lo más perecedero." },
  ],

  // Guías por tipo de emergencia. Cada cifra lleva su fuente (claves de "cifras").
  guias: [
    {
      id: "apagon", icono: "⚡", titulo: "Apagón",
      resumen: "Lo más habitual. Si dura horas, el problema es la comida del frigorífico; si dura días, el frío o el calor y la comunicación.",
      antes: [
        "Ten linternas (mejor que velas, que provocan incendios), pilas y una radio de pilas o de manivela.",
        "Mantén cargados el móvil y la batería externa. Apunta en papel los teléfonos importantes.",
        "Si alguien depende de un aparato eléctrico (oxígeno, respirador) o de medicación en frío, ten un plan B hablado con su médico.",
      ],
      durante: [
        "No abras la nevera ni el congelador: la nevera conserva el frío unas 4 horas; un congelador lleno, unas 48 horas, y medio lleno, unas 24.",
        "Desenchufa los aparatos sensibles (ordenador, televisor) para protegerlos del pico de tensión cuando vuelva la luz. Deja una lámpara encendida para saber cuándo vuelve.",
        "Nunca uses generadores, barbacoas, hornillos ni estufas de combustión dentro de casa, en el garaje ni en el balcón cerrado. El generador, fuera y a más de 6 metros de puertas y ventanas.",
        "Ahorra batería: brillo al mínimo, modo avión cuando no lo necesites y mensajes en vez de llamadas, que saturan menos la red.",
        "Informa solo por fuentes oficiales (radio, 112, ayuntamiento) y no difundas rumores.",
      ],
      despues: [
        "Tira los alimentos perecederos (carne, pescado, leche, sobras, quesos frescos) que hayan pasado más de 4 horas sin frío. No los pruebes para saber si están bien.",
        "Lo del congelador que aún tenga cristales de hielo o esté a 4 °C o menos se puede volver a congelar.",
        "Vuelve a enchufar los aparatos poco a poco.",
      ],
      cifras: ["nevera", "co"],
    },
    {
      id: "sinluz", icono: "🕯️", titulo: "Sin luz ni fuego",
      resumen: "Cuando no hay electricidad, ni gas, ni forma segura de encender fuego. Todo lo de esta guía funciona sin cocinar y sin llama.",
      antes: [
        "Luz: una linterna frontal LED por persona deja las manos libres y gasta muy poco. Las pilas de litio duran más guardadas y aguantan mejor el frío que las alcalinas. Una lámpara solar o de dinamo no depende de pilas.",
        "Energía: batería externa cargada (una de 10.000 mAh da para 1,5–2 cargas de un móvil actual, porque parte de la energía se pierde al cargar) y, si puedes, un panel solar plegable para cargarla de día.",
        "Comida: marca en la calculadora «sin hornillo ni fuego». Compra legumbres cocidas en bote, conservas, tortitas, picos de pan, frutos secos y copos de avena; nada que haya que hervir.",
        "Agua: ten lejía apta o pastillas potabilizadoras: desinfectan sin necesidad de hervir.",
      ],
      durante: [
        "Come primero lo de la nevera (aguanta unas 4 horas sin luz), luego lo del congelador y, por último, las conservas.",
        "Los copos de avena y el cuscús se ablandan en agua o leche fría en 30–60 minutos, o de la noche a la mañana. No comas legumbres secas, arroz ni pasta crudos: las alubias crudas son tóxicas.",
        "Potabiliza el agua con lejía (2 gotas por litro y 30 minutos) o con pastillas, siguiendo la etiqueta.",
        "Calor sin fuego: vestíos por capas (la de dentro, que no sea de algodón), con gorro y calcetines secos; dormid juntos en la habitación más pequeña con mantas y sacos; tapad las ventanas con mantas por la noche.",
        "Luz: evita las velas siempre que puedas (provocan incendios). Si las usas, en un plato estable, lejos de cortinas y nunca sin vigilar.",
        "Batería del móvil: activa el modo ahorro y el modo avión cuando no lo uses, baja el brillo y usa este portal en «modo apagón». El GPS sigue funcionando en modo avión.",
        "Para cargar el móvil en el coche, arranca el motor solo al aire libre, nunca en un garaje, aunque esté abierto.",
      ],
      despues: ["Repón las pilas y recarga las baterías en cuanto vuelva la luz: el siguiente apagón no avisa."],
      cifras: ["nevera", "lejia", "co"],
    },
    {
      id: "agua", icono: "🚱", titulo: "Corte de agua o aviso de no beber",
      resumen: "Puede ser por una avería, la sequía o la contaminación de la red. Si hay aviso de hervir el agua, la del grifo no es segura sin tratarla.",
      antes: [
        "Guarda unos 3 L por persona y día (la calculadora te dice cuánto en total) y rótala cada 6 meses.",
        "Localiza la llave de paso general de tu casa.",
      ],
      durante: [
        "Usa primero el agua guardada para beber y cocinar. Para el váter, reutiliza el agua de fregar o la de la bañera.",
        "Hay agua aprovechable en casa: la del depósito del termo (con la luz cortada, abre el grifo de abajo) y la del depósito de la cisterna si no lleva productos de limpieza. Potabilízala antes de beberla.",
        "Si hay aviso de hervir el agua: hierve 1 minuto (3 minutos a más de 2.000 m de altitud) o usa lejía apta: 2 gotas por litro y 30 minutos de espera.",
        "Lávate las manos con poca agua y gel hidroalcohólico. Sin agua, el riesgo de diarreas sube mucho.",
      ],
      despues: [
        "Cuando vuelva el agua, deja correr el grifo de agua fría unos minutos hasta que salga clara.",
        "Sigue tratando el agua hasta que las autoridades levanten el aviso.",
      ],
      cifras: ["hervir", "lejia", "aguaRotar"],
    },
    {
      id: "calor", icono: "🌡️", titulo: "Ola de calor",
      resumen: "El calor mata más que cualquier otro fenómeno meteorológico en Europa. Los más vulnerables son los mayores, los bebés, las embarazadas y quienes tienen enfermedades crónicas.",
      antes: [
        "Marca en la calculadora «clima caluroso»: se duplica el agua para beber.",
        "Identifica la habitación más fresca de la casa y un lugar refrigerado cercano (biblioteca, centro comercial, refugio climático municipal).",
      ],
      durante: [
        "Bebe agua aunque no tengas sed y evita el alcohol y las bebidas muy azucaradas.",
        "Evita salir y hacer esfuerzos en las horas centrales del día. Cierra persianas y ventanas de día y ventila por la noche.",
        "Nunca dejes a nadie (ni a una mascota) dentro de un coche cerrado, ni siquiera un momento.",
        "Llama a los mayores que viven solos al menos una vez al día.",
        "Golpe de calor: temperatura muy alta, piel caliente y seca, confusión o desmayo. Llama al 112, lleva a la persona a la sombra y refréscala con agua.",
      ],
      despues: ["Sigue bebiendo y descansando: el cansancio y la deshidratación se acumulan durante varios días."],
      cifras: ["calor"],
    },
    {
      id: "frio", icono: "❄️", titulo: "Ola de frío o apagón en invierno",
      resumen: "En invierno, un apagón largo es sobre todo un problema de frío. La mayor amenaza en casa es el monóxido de carbono de las estufas mal usadas.",
      antes: [
        "Ten mantas, sacos de dormir y ropa de abrigo para vestirse por capas.",
        "Si tienes estufa o chimenea, revísala y ten un detector de monóxido de carbono a pilas.",
      ],
      durante: [
        "Reuníos en una sola habitación, la más pequeña y soleada, y cerrad las demás. Tapa las rendijas de puertas y ventanas.",
        "Vestíos por capas, con gorro y calcetines; comer y beber caliente ayuda a mantener el calor.",
        "Nunca uses el horno, la cocina de gas, braseros ni barbacoas para calentar la casa: el monóxido de carbono no huele y mata.",
        "Hipotermia: temblores intensos, torpeza, habla confusa y somnolencia. Llama al 112, abriga a la persona poco a poco (primero el tronco) y, solo si está consciente y puede tragar, dale bebidas templadas y dulces, sin alcohol.",
      ],
      despues: ["Revisa si hay tuberías congeladas o reventadas antes de volver a abrir la llave de paso."],
      cifras: ["co"],
    },
    {
      id: "inundacion", icono: "🌊", titulo: "Inundación",
      resumen: "Más de la mitad de las muertes por inundación ocurren al conducir o caminar por zonas inundadas.",
      antes: [
        "Infórmate de si tu casa, tu trabajo o el colegio están en zona inundable y de cuál es la ruta segura hacia terreno alto.",
        "Ten la mochila y los documentos en una bolsa estanca, en un lugar alto.",
      ],
      durante: [
        "Sube a pisos altos. Nunca bajes a sótanos ni a garajes para salvar el coche.",
        "No cruces corrientes de agua: 15 cm de agua en movimiento pueden derribar a un adulto; 30 cm arrastran un coche pequeño, y 60 cm, un todoterreno.",
        "Si el agua entra en casa y es seguro hacerlo, corta la luz desde el cuadro general.",
        "Sigue las indicaciones del 112 y de protección civil. Si te piden evacuar, hazlo enseguida.",
      ],
      despues: [
        "No vuelvas a casa hasta que lo permitan las autoridades.",
        "Tira los alimentos que hayan tocado el agua de la inundación, incluidas las latas abolladas o hinchadas.",
        "No bebas agua del grifo hasta que confirmen que es potable.",
      ],
      cifras: ["inundacion"],
    },
    {
      id: "evacuacion", icono: "🚗", titulo: "Evacuación",
      resumen: "Si las autoridades piden salir, sal: cada minuto cuenta y las carreteras se colapsan.",
      antes: [
        "Ten la mochila de 72 h preparada junto a la puerta y el depósito del coche por encima de la mitad.",
        "Acuerda con tu familia dos puntos de encuentro y un contacto fuera de la zona (rellena el plan familiar).",
      ],
      durante: [
        "Coge la mochila, la medicación, los documentos, el cargador y las mascotas. Nada más.",
        "Si da tiempo y lo indican: cierra el gas y el agua y apaga la luz desde el cuadro.",
        "Sigue las rutas que indiquen las autoridades, aunque haya otras más cortas.",
        "Avisa a tu contacto fuera de la zona de adónde vas.",
      ],
      despues: ["Vuelve solo cuando lo indiquen las autoridades y revisa la casa por si hay olor a gas o daños en la instalación eléctrica."],
      cifras: [],
    },
    {
      id: "ciber", icono: "💳", titulo: "Ciberataque o caída de pagos y comunicaciones",
      resumen: "Como en los ataques a supermercados de 2026: pueden fallar a la vez los datáfonos, los cajeros, internet o la cadena de frío.",
      antes: [
        "Guarda algo de efectivo en billetes pequeños: sin luz ni red no funcionan las tarjetas ni los cajeros.",
        "Imprime los teléfonos, el plan familiar y las copias de los documentos.",
        "Ten una radio de pilas: es lo último que deja de funcionar.",
      ],
      durante: [
        "Infórmate por la radio y los canales oficiales. Desconfía de mensajes que pidan datos o dinero «por la emergencia»: los timos aumentan.",
        "Si la cadena de frío de las tiendas ha fallado, evita comprar carne, pescado y lácteos frescos hasta que se restablezca.",
        "Usa tu reserva de casa y no acapares: así quedan productos para quien no tiene.",
      ],
      despues: ["Repón lo que hayas gastado de la reserva poco a poco, en las compras normales."],
      cifras: [],
    },
  ],

  // Material para ir guardando, por niveles. "vida" = cuánto aguanta guardado (aprox., según fabricantes y
  // autoridades); "nota" = para qué sirve o cómo usarlo con seguridad.
  material: {
    niveles: [
      { n: 1, nombre: "Nivel 1 · Lo básico", horizonte: "De 72 horas a 1 semana", texto: "Lo que recomiendan protección civil y la Unión Europea para cualquier hogar. Empieza por aquí." },
      { n: 2, nombre: "Nivel 2 · Despensa ampliada", horizonte: "De 2 semanas a 1 mes", texto: "Para no depender de la luz, el gas ni las tiendas durante semanas: energía solar, cocinar sin red y comida de larga duración." },
      { n: 3, nombre: "Nivel 3 · Autonomía prolongada", horizonte: "Más de 1 mes", texto: "Para crisis largas o casas aisladas. Requiere espacio, dinero y, sobre todo, saber usarlo: fórmate antes de comprar." },
    ],
    categorias: [
      ["luz", "🔦", "Luz y energía"], ["fuego", "🔥", "Fuego, calor y cocina"], ["agua", "💧", "Agua"], ["comida", "🥫", "Comida"],
      ["salud", "🩹", "Salud e higiene"], ["herramientas", "🧰", "Herramientas"], ["comunicacion", "📻", "Comunicación"], ["docs", "📄", "Documentos y dinero"],
    ],
    items: [
      // ---------- Nivel 1 ----------
      { id: "m-linterna", nivel: 1, cat: "luz", texto: "Una linterna LED por persona", nota: "Mejor LED: gastan mucho menos que las de bombilla." },
      { id: "m-frontal", nivel: 1, cat: "luz", texto: "Linterna frontal", nota: "Deja las manos libres para cocinar, curar o bajar escaleras." },
      { id: "m-pilas", nivel: 1, cat: "luz", texto: "Pilas de repuesto: 2 juegos por aparato", vida: "Alcalinas: 5–10 años guardadas; de litio: hasta 20 (según fabricante)", nota: "Usa el mismo tamaño (AA o AAA) en todos los aparatos para poder intercambiarlas." },
      { id: "m-powerbank", nivel: 1, cat: "luz", texto: "Batería externa de 10.000 mAh o más, cargada", vida: "Recárgala cada 3–6 meses: se descarga sola", nota: "Da para 1,5–2 cargas de un móvil actual." },
      { id: "m-mechero", nivel: 1, cat: "fuego", texto: "2 mecheros y una caja de cerillas en una bolsa estanca", vida: "Cerillas: indefinidas si están secas", nota: "Para encender un hornillo o una vela, no para calentar la casa." },
      { id: "m-mantas", nivel: 1, cat: "fuego", texto: "Una manta o saco de dormir y una manta térmica por persona", nota: "La manta térmica (de aluminio) devuelve el calor del cuerpo y pesa 50 g." },
      { id: "m-garrafas", nivel: 1, cat: "agua", texto: "Garrafas de agua según la calculadora", vida: "Embotellada: según su fecha; del grifo: cambiar cada 6 meses" },
      { id: "m-lejia", nivel: 1, cat: "agua", texto: "Lejía apta para agua de bebida o pastillas potabilizadoras", vida: "La lejía pierde fuerza: cámbiala cada 6–12 meses", nota: "2 gotas por litro y 30 minutos (ver «Agua»)." },
      { id: "m-conservas", nivel: 1, cat: "comida", texto: "La reserva de comida de la calculadora (conservas, legumbres de bote, frutos secos)", vida: "Conservas: 2–5 años; mira la fecha y rota" },
      { id: "m-abrelatas", nivel: 1, cat: "comida", texto: "Abrelatas manual, cubiertos, platos y vasos reutilizables" },
      { id: "m-botiquin", nivel: 1, cat: "salud", texto: "Botiquín: gasas, vendas, esparadrapo, antiséptico, tijeras, termómetro, analgésicos", vida: "Revisa las caducidades cada 6 meses" },
      { id: "m-medicacion", nivel: 1, cat: "salud", texto: "Medicación habitual para el horizonte más una semana, y copia de las recetas" },
      { id: "m-higiene", nivel: 1, cat: "salud", texto: "Papel higiénico, gel hidroalcohólico, jabón, compresas y bolsas de basura resistentes" },
      { id: "m-navaja", nivel: 1, cat: "herramientas", texto: "Navaja multiusos, cinta americana y un silbato", nota: "El silbato se oye más lejos que la voz y cansa menos para pedir ayuda." },
      { id: "m-radio", nivel: 1, cat: "comunicacion", texto: "Radio de pilas, de dinamo o de manivela (FM/AM)", nota: "En un apagón, la radio es por donde llegan las instrucciones oficiales." },
      { id: "m-docs", nivel: 1, cat: "docs", texto: "Copias de documentos, teléfonos en papel y efectivo en billetes pequeños" },
      // ---------- Nivel 2 ----------
      { id: "m-solar", nivel: 2, cat: "luz", texto: "Panel solar plegable USB (20–30 W) para cargar baterías y móviles", nota: "Con buen sol, carga un móvil en pocas horas; en invierno o nublado, mucho menos." },
      { id: "m-recargables", nivel: 2, cat: "luz", texto: "Pilas recargables y un cargador USB o solar" },
      { id: "m-farol", nivel: 2, cat: "luz", texto: "Farol LED o lámpara solar para iluminar una habitación", nota: "Más seguro que las velas: no hay riesgo de incendio." },
      { id: "m-hornillo", nivel: 2, cat: "fuego", texto: "Hornillo de camping con cartuchos de gas de repuesto", vida: "Cartuchos: no caducan, pero descarta los oxidados o abollados", nota: "Úsalo solo al aire libre o con una ventana abierta, nunca en un espacio cerrado." },
      { id: "m-co", nivel: 2, cat: "fuego", texto: "Detector de monóxido de carbono a pilas", vida: "Sustitúyelo cuando indique el fabricante (suele ser 7–10 años)", nota: "Imprescindible si vas a usar hornillo, estufa o chimenea." },
      { id: "m-ferro", nivel: 2, cat: "fuego", texto: "Encendedor de ferrocerio (pedernal)", vida: "Miles de chispas; funciona mojado", nota: "Respaldo de los mecheros. Practica antes: no es tan fácil como parece." },
      { id: "m-ollas", nivel: 2, cat: "fuego", texto: "Olla y cazo con tapa para el hornillo", nota: "Con tapa se hierve antes y se gasta menos gas." },
      { id: "m-filtro", nivel: 2, cat: "agua", texto: "Filtro de agua portátil (0,1 micras o menos)", nota: "Elimina bacterias y protozoos; muchos no eliminan virus: combínalo con lejía o hervir." },
      { id: "m-bidones", nivel: 2, cat: "agua", texto: "Bidones apilables de 10–20 L de uso alimentario" },
      { id: "m-deshidratada", nivel: 2, cat: "comida", texto: "Comida deshidratada o liofilizada (sobres que solo necesitan agua)", vida: "Liofilizada: 10–30 años según fabricante; deshidratada casera: meses", nota: "La mayoría necesita agua caliente; algunas se pueden rehidratar en frío con más tiempo." },
      { id: "m-secos", nivel: 2, cat: "comida", texto: "Arroz, pasta y legumbres secas para 2–4 semanas", vida: "Arroz blanco y legumbres: años en envase hermético, lejos de la humedad", nota: "Necesitan hornillo y agua: las legumbres secas, remojo y cocción larga." },
      { id: "m-basicos", nivel: 2, cat: "comida", texto: "Sal, azúcar, aceite, miel, café o cacao y especias", vida: "Sal y miel: no caducan; aceite: 1–2 años" },
      { id: "m-multivit", nivel: 2, cat: "comida", texto: "Complejo vitamínico para periodos largos con dieta de conserva", nota: "Consulta con tu médico o farmacéutico." },
      { id: "m-retrete", nivel: 2, cat: "salud", texto: "Retrete de emergencia: cubo con tapa, bolsas gruesas y serrín o arena para gatos", nota: "Sin agua en la cisterna, evita usar el váter: se atasca y genera focos de infección." },
      { id: "m-ffp2", nivel: 2, cat: "salud", texto: "Mascarillas FFP2 y guantes desechables", nota: "Para humo, polvo de escombros o enfermedades contagiosas." },
      { id: "m-extintor", nivel: 2, cat: "herramientas", texto: "Extintor de polvo ABC de 2–6 kg y manta ignífuga en la cocina", vida: "Revisión según la etiqueta del fabricante" },
      { id: "m-cuerda", nivel: 2, cat: "herramientas", texto: "Guantes de trabajo, cuerda, lona impermeable y bridas" },
      { id: "m-walkie", nivel: 2, cat: "comunicacion", texto: "Walkie-talkies PMR446 (uso libre en la UE, sin licencia)", nota: "Alcance real de 0,5–3 km en ciudad. Acordad un canal en el plan familiar." },
      // ---------- Nivel 3 ----------
      { id: "m-estacion", nivel: 3, cat: "luz", texto: "Estación de energía portátil (500 Wh o más) con panel solar de 100–200 W", nota: "Permite mantener una nevera pequeña, cargar equipos o un aparato médico durante días." },
      { id: "m-saco-inv", nivel: 3, cat: "fuego", texto: "Saco de dormir de invierno (confort a 0 °C o menos) por persona" },
      { id: "m-estufa", nivel: 3, cat: "fuego", texto: "Estufa de leña o de pellets homologada, con salida de humos revisada, y combustible seco", nota: "Solo si la vivienda lo permite. Nunca estufas de exterior dentro de casa." },
      { id: "m-lluvia", nivel: 3, cat: "agua", texto: "Recogida de agua de lluvia (depósito con tapa) y filtro de gravedad grande", nota: "El agua de lluvia del tejado no es potable: fíltrala y desinféctala." },
      { id: "m-despensa", nivel: 3, cat: "comida", texto: "Despensa rotativa de 1–3 meses de lo que coméis habitualmente", nota: "Come lo que guardas y guarda lo que comes: repón al gastar." },
      { id: "m-huerto", nivel: 3, cat: "comida", texto: "Semillas y material para un huerto o macetas (legumbres, patatas, hortalizas)" },
      { id: "m-botiquin3", nivel: 3, cat: "salud", texto: "Botiquín ampliado y un curso de primeros auxilios para al menos un adulto", nota: "Cruz Roja y protección civil organizan cursos, muchos gratuitos." },
      { id: "m-herramientas3", nivel: 3, cat: "herramientas", texto: "Hacha o sierra, pala, martillo, clavos, tornillería y llaves básicas" },
      { id: "m-onda", nivel: 3, cat: "comunicacion", texto: "Receptor de onda corta y, si te interesa, licencia de radioaficionado", nota: "La radioafición sigue funcionando cuando caen internet y la telefonía." },
      { id: "m-copias", nivel: 3, cat: "docs", texto: "Copia digital cifrada de documentos en una memoria USB y efectivo para 2–4 semanas" },
    ],
  },

  // Habilidades: el conocimiento no pesa ni caduca. Pasos verificados con su fuente.
  habilidades: [
    {
      id: "regla3", icono: "3️⃣", titulo: "La regla de los 3", nivel: "Base",
      resumen: "Una forma de priorizar, no una cifra exacta: el orden en que te mata la falta de cada cosa.",
      pasos: [
        "3 minutos sin aire (o con una hemorragia grave sin controlar).",
        "3 horas sin refugio en condiciones extremas de frío, calor, viento o lluvia.",
        "3 días sin agua.",
        "3 semanas sin comida.",
        "Por eso el orden es: primeros auxilios → refugio y abrigo → agua → comida. La comida es lo último, no lo primero.",
      ],
      seguridad: ["Son aproximaciones: con calor, ejercicio, niños o personas enfermas, los márgenes son mucho menores."],
      fuente: "Regla práctica de supervivencia usada en formación de rescate y montaña",
    },
    {
      id: "auxilios", icono: "❤️", titulo: "Primeros auxilios y RCP", nivel: "Imprescindible",
      resumen: "La habilidad que más vidas salva. Nada sustituye a un curso práctico: Cruz Roja y protección civil los organizan.",
      pasos: [
        "PAS: Protege (que no haya más víctimas, empezando por ti), Avisa (112) y Socorre.",
        "Hemorragia: presión directa, fuerte y continua sobre la herida con un paño limpio. No retires el primer paño: pon otro encima.",
        "Si no responde y no respira con normalidad: llama al 112 (con el altavoz) y empieza la RCP.",
        "RCP en adultos: manos en el centro del pecho, brazos rectos, 100–120 compresiones por minuto y 5–6 cm de profundidad, dejando que el pecho vuelva arriba.",
        "Si sabes, 30 compresiones y 2 insuflaciones; si no, solo compresiones sin parar hasta que llegue ayuda o un desfibrilador (DEA).",
        "Si respira pero no responde: posición lateral de seguridad y vigila que siga respirando.",
      ],
      seguridad: ["Las cifras son para adultos; en bebés y niños la técnica cambia: aprende en un curso."],
      fuente: "Consejo Europeo de Resucitación (ERC), guías 2021",
    },
    {
      id: "fuego", icono: "🔥", titulo: "Encender y controlar un fuego", nivel: "Básico",
      resumen: "El fuego necesita tres cosas: combustible, oxígeno y calor. Si falla una, se apaga.",
      pasos: [
        "Prepara antes de encender tres montones: yesca (lo que prende con una chispa: algodón con vaselina, corteza fina, hierba muy seca), astillas finas como un lápiz y leña más gruesa.",
        "Haz un lecho seco: sobre tierra mojada o nieve, pon antes una base de palos.",
        "Enciende la yesca, añade astillas poco a poco sin ahogarla y, cuando prendan bien, la leña.",
        "Con ferrocerio: rasca con firmeza la varilla hacia la yesca, sujetando el rascador quieto y tirando de la varilla hacia atrás.",
        "Apágalo del todo con agua y remueve las brasas hasta que estén frías al tacto.",
      ],
      seguridad: [
        "En España hacer fuego en el monte está prohibido durante la época de riesgo en casi todas las comunidades, y en muchas zonas todo el año: infórmate antes.",
        "Nunca hagas fuego dentro de casa, de una tienda o de un espacio cerrado: el monóxido de carbono mata sin avisar.",
      ],
      fuente: "Normativa autonómica de prevención de incendios; CDC (monóxido de carbono)",
    },
    {
      id: "refugio", icono: "⛺", titulo: "Refugio y abrigo", nivel: "Básico",
      resumen: "Con frío, viento o lluvia, perder calor es lo más urgente. El suelo te roba más calor que el aire.",
      pasos: [
        "Aíslate del suelo: esterilla, mochila, ramas, hojas secas o cartón. Es lo primero.",
        "Protégete del viento y de la lluvia: una lona o un poncho atado entre dos árboles, con el lado bajo hacia el viento.",
        "Cuanto más pequeño, mejor: un refugio pequeño se calienta con el cuerpo.",
        "Vístete por capas: una interior que no sea de algodón (el algodón mojado enfría), una de abrigo y una exterior contra el viento y el agua. Gorro: se pierde mucho calor por la cabeza descubierta.",
        "Mantén la ropa seca: quítate capas antes de sudar.",
      ],
      seguridad: ["No te refugies en cauces secos ni barrancos: una tormenta lejana puede provocar una riada."],
      fuente: "Manuales de montaña y protección civil",
    },
    {
      id: "nudos", icono: "🪢", titulo: "Cuatro nudos útiles", nivel: "Básico",
      resumen: "Con cuatro nudos se resuelven casi todas las situaciones: atar, amarrar, tensar y empalmar.",
      pasos: [
        "As de guía: hace una gaza (lazo) fija que no se cierra ni se suelta. Para atarte, atar una carga o rescatar a alguien.",
        "Ballestrinque: amarra rápido una cuerda a un poste o a un árbol, y se ajusta y se deshace con facilidad.",
        "Nudo tensor (de tensión ajustable): para tensar los vientos de una lona o un tendedero y volver a tensarlos.",
        "Nudo de pescador doble: une dos cuerdas, también de distinto grosor.",
        "Practícalos en casa hasta hacerlos sin mirar y con los ojos cerrados: en una emergencia habrá frío, prisa o poca luz.",
      ],
      seguridad: ["Para escalar, rápel o rescate en altura hace falta formación y material específico."],
      fuente: "Manuales de montaña y náutica",
    },
    {
      id: "orientacion", icono: "🧭", titulo: "Orientarse sin GPS", nivel: "Intermedio",
      resumen: "Si se acaba la batería, una brújula, un mapa en papel y el sol siguen funcionando.",
      pasos: [
        "Brújula: sostenla plana, lejos de metales e imanes; la aguja roja apunta al norte magnético (en España casi coincide con el geográfico).",
        "Orienta el mapa: gíralo hasta que su norte coincida con el de la brújula; así el mapa queda «como el terreno».",
        "Con el sol: sale por el este y se pone por el oeste. En España, a mediodía solar queda hacia el sur.",
        "Con un reloj de agujas (hemisferio norte): apunta la aguja de las horas al sol; el sur queda a medio camino entre esa aguja y las 12 (las 13 en horario de verano).",
        "De noche: busca el Carro (Osa Mayor), prolonga cinco veces la distancia entre sus dos estrellas del extremo y llegarás a la estrella Polar, que marca el norte.",
      ],
      seguridad: ["El musgo «que crece al norte» no es fiable: depende de la humedad y la sombra de cada sitio."],
      fuente: "Técnicas clásicas de orientación; Instituto Geográfico Nacional (declinación magnética)",
    },
    {
      id: "senales", icono: "🆘", titulo: "Señales de socorro", nivel: "Básico",
      resumen: "Tres de cualquier cosa es una señal de auxilio reconocida en todo el mundo.",
      pasos: [
        "Llama al 112: funciona con cualquier operador con cobertura, aunque no sea el tuyo.",
        "Señal de socorro en montaña: 6 señales por minuto (silbato, luz, espejo), una cada 10 segundos, un minuto de pausa y repetir. La respuesta es 3 señales por minuto.",
        "Tres pitidos, tres destellos o tres fuegos en triángulo también se entienden como petición de ayuda.",
        "En morse, SOS: tres cortos, tres largos y tres cortos (··· — — — ···).",
        "Para que te vea un helicóptero: en el suelo, una V grande significa «necesito ayuda» y una X, «necesito asistencia médica». Usa ropa de colores, piedras o ramas, cuanto más grande y contrastada, mejor.",
        "Con un espejo o el móvil apagado puedes lanzar destellos al sol hacia un avión o un helicóptero.",
      ],
      seguridad: ["No hagas estas señales si no necesitas ayuda: movilizan a los equipos de rescate."],
      fuente: "Señal alpina de socorro (comisiones internacionales de rescate en montaña); OACI, señales tierra-aire",
    },
    {
      id: "agua-campo", icono: "💧", titulo: "Agua en el campo", nivel: "Intermedio",
      resumen: "Ninguna agua de río, fuente sin control o lluvia es segura sin tratar, por limpia que parezca.",
      pasos: [
        "Coge el agua de corriente, lejos de pueblos, granjas, caminos y ganado.",
        "Si está turbia, déjala reposar y fíltrala con un paño antes de tratarla.",
        "Trátala: hervir 1 minuto (3 a más de 2.000 m), lejía apta (2 gotas por litro y 30 minutos), pastillas o filtro (y, si el filtro no elimina virus, también cloro).",
        "Recoger rocío o lluvia con una lona limpia da poca agua pero suele ser de buena calidad: trátala igualmente.",
      ],
      seguridad: ["Nunca bebas agua de mar ni orina: deshidratan más.", "El agua con gasóleo o químicos no se arregla hirviéndola."],
      fuente: "CDC y EPA (desinfección del agua)",
    },
  ],

  // Mapas y orientación sin conexión
  mapas: {
    descargar: [
      { titulo: "Organic Maps u OsmAnd", texto: "Apps gratuitas con mapas de OpenStreetMap que se descargan por países o regiones y funcionan del todo sin datos: buscar, calcular rutas a pie o en coche y ver tu posición. Descarga tu provincia y la de tus familiares." },
      { titulo: "Google Maps sin conexión", texto: "En el menú de tu perfil, «Mapas sin conexión» → «Selecciona tu propio mapa». Las zonas descargadas se actualizan solas con wifi; si pasan meses sin conexión, revisa que sigan disponibles." },
      { titulo: "Un mapa en papel", texto: "Imprime o compra el mapa de tu zona y marca en él la casa, los dos puntos de encuentro, el centro de salud y la ruta a pie a casa desde el trabajo y el colegio, con una ruta alternativa. No se queda sin batería." },
    ],
    consejos: [
      "El GPS del móvil funciona sin datos ni cobertura, también en modo avión: lo que necesita internet es descargar el mapa, no saber dónde estás. La primera posición puede tardar un par de minutos al aire libre.",
      "Mirar la posición de vez en cuando gasta poca batería; la navegación continua con la pantalla encendida, mucha.",
      "Sin móvil: el sol sale por el este y se pone por el oeste; a mediodía, en España y en el norte de México, queda hacia el sur. De noche, la estrella Polar marca el norte.",
      "Apunta en papel las coordenadas de tus puntos: cualquiera puede escribirlas en su app de mapas o en un GPS.",
    ],
  },

  // Agua potable: almacenamiento y potabilización
  agua: {
    guardar: [
      "Agua embotellada: es la opción más segura. Respeta la fecha de consumo preferente y guárdala a oscuras, lejos del calor y de productos químicos (el plástico deja pasar los olores).",
      "Agua del grifo: en recipientes de uso alimentario limpios y bien cerrados (no de lejía ni de leche, que no se limpian bien). Cámbiala cada 6 meses.",
      "Escribe en cada garrafa la fecha en que la llenaste.",
    ],
    pasos: [
      { titulo: "1. Si está turbia, aclárala", texto: "Déjala reposar y pásala por un paño limpio, un filtro de café o un papel de cocina. Esto no la desinfecta: solo hace que los pasos siguientes funcionen." },
      { titulo: "2. Hiérvela", texto: "Es el método más seguro: 1 minuto de hervor fuerte (3 minutos a más de 2.000 m de altitud). Déjala enfriar tapada." },
      { titulo: "3. O desinféctala con lejía", texto: "Si no puedes hervir: lejía «apta para la desinfección del agua de bebida», sin perfume ni detergente. 2 gotas por litro (4 si el agua está turbia o muy fría), remueve y espera 30 minutos. Debe oler ligeramente a cloro; si no, repite la dosis y espera 15 minutos más." },
      { titulo: "4. Pastillas o filtros", texto: "Las pastillas potabilizadoras y los filtros portátiles funcionan si sigues las instrucciones del fabricante. Muchos filtros no eliminan virus: combínalos con hervir o con cloro." },
    ],
    avisos: [
      "El agua contaminada con gasóleo, productos químicos o agua de inundación no se arregla hirviéndola ni con lejía. No la bebas.",
      "Para los biberones, usa agua embotellada o hervida, nunca agua tratada solo con lejía.",
    ],
  },

  // De dónde salen los números de la calculadora y de las guías
  // Despensa: productos concretos de supermercado que aguantan sin nevera con el envase cerrado.
  // dura = orientativo con el envase cerrado (manda la fecha de la etiqueta). tipo = tipo del inventario.
  // cocinar: false = se come tal cual o solo con agua o leche fría.
  despensa: {
    reglas: [
      ["🏷️", "Sin nevera, de verdad", "Mira la etiqueta: tiene que poner «conservar en lugar fresco y seco». Si pone «conservar en refrigeración» (lonchas envasadas, quesos tiernos, embutidos cocidos), no sirve para una despensa sin luz."],
      ["📅", "Consumo preferente no es caducidad", "Conservas, arroz, pasta, legumbres, aceite, galletas o miel llevan fecha de consumo preferente: pasada esa fecha pierden calidad, pero siguen siendo seguros si el envase está intacto y tienen buen aspecto, olor y sabor. La fecha de caducidad (productos muy perecederos) sí hay que respetarla."],
      ["🥫", "Raciones pequeñas y abre fácil", "Sin nevera, lo que abres hay que comérselo en el día. Mejor packs de latas pequeñas que una grande, y con abre fácil (aun así, guarda un abrelatas manual)."],
      ["🔁", "Come lo que guardas", "Compra lo que ya coméis, pon lo nuevo detrás y gasta lo de delante. Así nada se pasa de fecha y la reserva se renueva sola."],
      ["⚠️", "Latas dañadas, a la basura", "Tira cualquier lata abombada, oxidada, con fugas o muy abollada en el cierre, y cualquier conserva que al abrirla salpique o huela mal."],
    ],
    categorias: [
      ["proteina", "🐟", "Pescado y carne en conserva"],
      ["embutido", "🥓", "Embutidos y quesos curados"],
      ["legumbre", "🫘", "Legumbres y platos listos"],
      ["hidratos", "🍞", "Pan, cereales y féculas"],
      ["grasas", "🫒", "Aceite, frutos secos y cremas"],
      ["lacteos", "🥛", "Leche y bebidas"],
      ["fruta", "🍑", "Fruta y verdura"],
      ["extras", "🍫", "Dulces, sal y extras"],
    ],
    productos: [
      // Pescado y carne en conserva
      { id: "atun-aceite", cat: "proteina", nombre: "Atún claro en aceite de oliva", formato: "Pack de 3 latas de 80 g, abre fácil", dura: "3–5 años", cocinar: false, tipo: "proteina", al: "pescado", nota: "El aceite de la lata también alimenta: aprovéchalo con pan o legumbres." },
      { id: "atun-natural", cat: "proteina", nombre: "Atún al natural", formato: "Pack de 3 latas de 80 g", dura: "3–5 años", cocinar: false, tipo: "proteina", al: "pescado", nota: "Menos calorías que en aceite: combínalo con aceite o frutos secos." },
      { id: "sardinas", cat: "proteina", nombre: "Sardinas en aceite de oliva", formato: "Lata de 120 g, abre fácil", dura: "3–5 años", cocinar: false, tipo: "proteina", al: "pescado", nota: "Con espina comestible: aportan calcio." },
      { id: "caballa", cat: "proteina", nombre: "Caballa (o melva) en aceite de oliva", formato: "Lata de 120 g", dura: "3–5 años", cocinar: false, tipo: "proteina", al: "pescado" },
      { id: "mejillones", cat: "proteina", nombre: "Mejillones en escabeche", formato: "Lata de 110 g", dura: "3–4 años", cocinar: false, tipo: "proteina", al: "moluscos" },
      { id: "berberechos", cat: "proteina", nombre: "Berberechos o almejas al natural", formato: "Lata de 110 g", dura: "3–4 años", cocinar: false, tipo: "proteina", al: "moluscos" },
      { id: "salmon-lata", cat: "proteina", nombre: "Salmón o bonito en conserva", formato: "Lata de 160 g", dura: "3–4 años", cocinar: false, tipo: "proteina", al: "pescado" },
      { id: "pollo-lata", cat: "proteina", nombre: "Pollo o pavo en conserva", formato: "Lata de 200 g", dura: "2–3 años", cocinar: false, tipo: "proteina", nota: "Para quien no come pescado. Revisa que la etiqueta no pida nevera antes de abrir." },
      { id: "pate", cat: "proteina", nombre: "Paté de hígado o de atún", formato: "Latas pequeñas de 80–100 g", dura: "2–3 años", cocinar: false, tipo: "proteina", nota: "Mucha energía en poco peso; con picos o tostadas es una comida." },
      { id: "albondigas", cat: "proteina", nombre: "Albóndigas o carne guisada en lata", formato: "Lata de 400–450 g", dura: "2–3 años", cocinar: false, tipo: "proteina", nota: "Se puede comer fría; templada en la lata al sol o al baño maría si hay hornillo." },

      // Embutidos y quesos curados
      { id: "chorizo", cat: "embutido", nombre: "Chorizo curado en sarta o vela, entero", formato: "Pieza de 200–250 g sin lonchear", dura: "3–6 meses", cocinar: false, tipo: "proteina", nota: "Solo entero y con «conservar en lugar fresco y seco». Una vez cortado, cómelo en pocos días." },
      { id: "salchichon", cat: "embutido", nombre: "Salchichón o fuet curado, entero", formato: "Pieza de 150–250 g", dura: "2–4 meses", cocinar: false, tipo: "proteina", nota: "El fuet es más fino y se seca antes: rota más a menudo." },
      { id: "lomo", cat: "embutido", nombre: "Lomo embuchado o cecina, en pieza", formato: "Pieza de 200–400 g", dura: "3–6 meses", cocinar: false, tipo: "proteina", nota: "Mucha proteína y poco peso. En pieza, nunca loncheado envasado." },
      { id: "jamon-taco", cat: "embutido", nombre: "Jamón serrano en taco o pieza pequeña", formato: "Taco de 250–500 g al vacío", dura: "6–12 meses", cocinar: false, tipo: "proteina", nota: "Comprueba que el envase no pida nevera; muchos tacos curados no la necesitan cerrados." },
      { id: "queso-aceite", cat: "embutido", nombre: "Queso curado en aceite de oliva", formato: "Tarro de cristal de 250–400 g", dura: "12–24 meses", cocinar: false, tipo: "proteina", al: "leche", nota: "El queso fuera del aceite es perecedero: el tarro aguanta en la despensa." },
      { id: "queso-curado", cat: "embutido", nombre: "Queso viejo o muy curado, cuña entera", formato: "Cuña de 250 g", dura: "Según etiqueta", cocinar: false, tipo: "proteina", al: "leche", nota: "Muchas cuñas envasadas piden nevera: cómpralo solo si la etiqueta no lo exige." },

      // Legumbres y platos listos
      { id: "garbanzos", cat: "legumbre", nombre: "Garbanzos cocidos", formato: "Bote de cristal de 400 g", dura: "2–3 años", cocinar: false, tipo: "legumbres", nota: "Ya cocidos: se comen fríos, aclarados con un poco de agua." },
      { id: "lentejas", cat: "legumbre", nombre: "Lentejas cocidas", formato: "Bote de cristal de 400 g", dura: "2–3 años", cocinar: false, tipo: "legumbres" },
      { id: "alubias", cat: "legumbre", nombre: "Alubias blancas o rojas cocidas", formato: "Bote de cristal de 400 g", dura: "2–3 años", cocinar: false, tipo: "legumbres", nota: "Nunca compres alubias secas para comer sin cocinar: crudas son tóxicas." },
      { id: "fabada", cat: "legumbre", nombre: "Fabada, cocido o lentejas con chorizo en lata", formato: "Lata de 420–440 g (1–2 raciones)", dura: "2–3 años", cocinar: false, tipo: "legumbres", nota: "Comida completa en una lata. Mejor caliente, pero se puede comer templada." },
      { id: "legumbre-seca", cat: "legumbre", nombre: "Lentejas o garbanzos secos", formato: "Paquete de 1 kg", dura: "1–2 años", cocinar: true, tipo: "legumbres", nota: "Muy baratos y ligeros, pero solo si tienes hornillo y agua de sobra para remojar y cocer." },

      // Pan, cereales y féculas
      { id: "picos", cat: "hidratos", nombre: "Picos, regañás o pan tostado", formato: "Bolsa de 250 g", dura: "6–12 meses", cocinar: false, tipo: "cereales", al: "gluten", nota: "El sustituto del pan cuando no hay panadería." },
      { id: "tortitas", cat: "hidratos", nombre: "Tortitas de arroz o de maíz", formato: "Paquete de 130 g", dura: "9–12 meses", cocinar: false, tipo: "cereales", nota: "Sin gluten en muchas marcas: mira la etiqueta si hay celíacos." },
      { id: "galletas", cat: "hidratos", nombre: "Galletas María o tipo digestive", formato: "Paquete de 800 g en raciones", dura: "9–12 meses", cocinar: false, tipo: "cereales", al: "gluten", nota: "Mejor en paquetitos individuales: no se ablandan al abrir." },
      { id: "avena", cat: "hidratos", nombre: "Copos de avena", formato: "Paquete de 500 g", dura: "12 meses", cocinar: false, tipo: "cereales", al: "gluten", nota: "Se ablandan en agua o leche fría en 30–60 minutos." },
      { id: "cuscus", cat: "hidratos", nombre: "Cuscús", formato: "Paquete de 500 g", dura: "1–2 años", cocinar: false, tipo: "cereales", al: "gluten", nota: "Se hidrata con agua: caliente en 5 minutos o fría en 30–60." },
      { id: "arroz", cat: "hidratos", nombre: "Arroz blanco", formato: "Paquete de 1 kg", dura: "1–2 años", cocinar: true, tipo: "cereales", nota: "El de vasitos precocinados se puede comer sin cocinar; el normal, no." },
      { id: "pasta", cat: "hidratos", nombre: "Pasta seca", formato: "Paquete de 500 g", dura: "2–3 años", cocinar: true, tipo: "cereales", al: "gluten" },
      { id: "pure", cat: "hidratos", nombre: "Puré de patata en copos", formato: "Paquete de 4 raciones", dura: "12 meses", cocinar: true, tipo: "cereales", nota: "Solo necesita agua caliente; ligero para la mochila." },

      // Aceite, frutos secos y cremas
      { id: "aceite", cat: "grasas", nombre: "Aceite de oliva", formato: "Botella de 1 L (mejor en lata o botella opaca)", dura: "12–18 meses", cocinar: false, tipo: "grasas", nota: "La forma más fácil de sumar calorías: una cucharada sopera (10 ml) son unas 90 kcal." },
      { id: "frutos-secos", cat: "grasas", nombre: "Frutos secos naturales o tostados", formato: "Bolsa de 200 g (almendras, nueces, cacahuetes)", dura: "6–12 meses", cocinar: false, tipo: "grasas", al: "frutos de cáscara o cacahuete", nota: "Mucha energía en poco espacio. Se enrancian con calor: rota a menudo." },
      { id: "crema-cacahuete", cat: "grasas", nombre: "Crema de cacahuete o de almendra", formato: "Tarro de 350 g", dura: "12 meses", cocinar: false, tipo: "grasas", al: "cacahuete o frutos de cáscara" },
      { id: "semillas", cat: "grasas", nombre: "Pipas peladas o semillas", formato: "Bolsa de 200 g", dura: "6–12 meses", cocinar: false, tipo: "grasas" },

      // Leche y bebidas
      { id: "leche-uht", cat: "lacteos", nombre: "Leche UHT (o bebida vegetal UHT)", formato: "Brik de 1 L", dura: "6–9 meses", cocinar: false, tipo: "lacteos", al: "leche", nota: "Una vez abierta necesita nevera: sin luz, mejor briks pequeños de 200 ml." },
      { id: "leche-polvo", cat: "lacteos", nombre: "Leche en polvo", formato: "Bote de 400–800 g", dura: "12–24 meses", cocinar: false, tipo: "lacteos", al: "leche", nota: "Ocupa poco y no necesita nevera aunque esté abierta; se prepara con agua potable." },
      { id: "leche-condensada", cat: "lacteos", nombre: "Leche condensada en tubo o lata", formato: "Tubo de 170 g o lata de 370 g", dura: "12–18 meses", cocinar: false, tipo: "lacteos", al: "leche", nota: "Energía rápida para niños y para el ánimo." },
      { id: "cacao", cat: "lacteos", nombre: "Cacao soluble y café soluble", formato: "Bote de 400 g / 200 g", dura: "1–2 años", cocinar: false, tipo: "otros", nota: "Se disuelven en frío. El café también es moral." },

      // Fruta y verdura
      { id: "tomate", cat: "fruta", nombre: "Tomate triturado o frito", formato: "Brik o lata de 400 g", dura: "1–2 años", cocinar: false, tipo: "frutaVerdura" },
      { id: "pimientos", cat: "fruta", nombre: "Pimientos asados o del piquillo", formato: "Lata o bote de 250–400 g", dura: "2–3 años", cocinar: false, tipo: "frutaVerdura" },
      { id: "verduras-bote", cat: "fruta", nombre: "Menestra, judías verdes o espárragos en bote", formato: "Bote de cristal de 400 g", dura: "2–3 años", cocinar: false, tipo: "frutaVerdura" },
      { id: "maiz", cat: "fruta", nombre: "Maíz dulce", formato: "Pack de 3 latas pequeñas", dura: "2–3 años", cocinar: false, tipo: "frutaVerdura" },
      { id: "fruta-almibar", cat: "fruta", nombre: "Melocotón o piña en su jugo o en almíbar", formato: "Lata de 400–800 g", dura: "2–3 años", cocinar: false, tipo: "frutaVerdura", nota: "El líquido también hidrata." },
      { id: "fruta-seca", cat: "fruta", nombre: "Fruta deshidratada: pasas, orejones, dátiles, ciruelas", formato: "Bolsa de 200–250 g", dura: "6–12 meses", cocinar: false, tipo: "frutaVerdura" },
      { id: "compota", cat: "fruta", nombre: "Compota o fruta triturada en bolsita", formato: "Bolsitas de 90–100 g", dura: "9–12 meses", cocinar: false, tipo: "frutaVerdura", nota: "Pensado para niños, pero útil para todos." },

      // Dulces, sal y extras
      { id: "chocolate", cat: "extras", nombre: "Chocolate negro", formato: "Tableta de 100–150 g", dura: "12–24 meses", cocinar: false, tipo: "otros", al: "puede contener leche y frutos secos", nota: "Mucha energía y mejora el ánimo." },
      { id: "miel", cat: "extras", nombre: "Miel", formato: "Tarro de 500 g", dura: "Prácticamente indefinida", cocinar: false, tipo: "otros", nota: "No se la des a bebés menores de 1 año." },
      { id: "azucar", cat: "extras", nombre: "Azúcar y sal", formato: "Paquete de 1 kg", dura: "Indefinida si está seca", cocinar: false, tipo: "otros" },
      { id: "barritas", cat: "extras", nombre: "Barritas de cereales o energéticas", formato: "Caja de 6 a 12", dura: "6–12 meses", cocinar: false, tipo: "cereales", al: "gluten, frutos secos (según marca)" },
      { id: "sopas", cat: "extras", nombre: "Sopas o cremas deshidratadas en sobre", formato: "Sobre de 4 raciones", dura: "1–2 años", cocinar: true, tipo: "otros", nota: "Calientan y reconfortan, pero necesitan agua caliente." },
      { id: "especias", cat: "extras", nombre: "Especias, pimentón, orégano y vinagre", formato: "Botes pequeños", dura: "1–3 años", cocinar: false, tipo: "otros", nota: "Comer lo mismo varios días desanima: el sabor también cuenta." },
    ],
  },

  cifras: {
    agua: { dato: "Agua por persona y día", valor: "3 L por adulto: 1,5 L para beber, 0,5 L para cocinar y 1 L de higiene mínima. 3,5 L para mayores de 65 y 2,5 L para niños", fuente: "BLE (Alemania), tabla de reservas de 10 días, 2024; Ready.gov (EE. UU.) recomienda 3,8 L para beber e higiene; Suecia, 3–5 L", url: "https://www.ernaehrungsvorsorge.de/" },
    higiene: { dato: "Higiene básica", valor: "2–6 L por persona y día (la calculadora usa 1 L, el mínimo; si puedes, guarda más)", fuente: "Manual Esfera, normas mínimas de agua y saneamiento", url: "https://interactive.spherestandards.org/" },
    calor: { dato: "Calor intenso", valor: "Puede duplicar el agua necesaria para beber", fuente: "Ready.gov (FEMA)", url: "https://www.ready.gov/water" },
    lactancia: { dato: "Lactancia", valor: "+700 ml de agua y unas +500 kcal al día", fuente: "EFSA, valores de referencia de agua (2010) y energía (2013)", url: "https://www.efsa.europa.eu/" },
    kcal: { dato: "Energía", valor: "2.200 kcal por adulto; 1.900 para mayores de 65; 1.800 para niños de 7 a 13 años y 1.300 de 3 a 6", fuente: "BLE (planificación de la reserva) y valores de referencia D-A-CH (actividad moderada, media de chicos y chicas)", url: "https://www.ernaehrungsvorsorge.de/" },
    kg: { dato: "Kilos de comida", valor: "Peso neto real de lo que sale en la lista; la referencia oficial alemana ronda los 14 kg por persona para 10 días", fuente: "BLE, «Vorratstabelle Mischkost», 2024", url: "https://www.ernaehrungsvorsorge.de/" },
    mascotas: { dato: "Agua para mascotas", valor: "Unos 50–60 ml por kg y día: perro pequeño 0,4 L, mediano 1 L, grande 2 L; gato 0,3 L", fuente: "Referencia veterinaria habitual (varía con el calor, la actividad y la comida húmeda). Canadá pide más margen: 4 L al día por perro medio y 1 L por gato", url: "https://www.canada.ca/en/services/policing/emergencies/preparedness/get-prepared/emergency-planning-resources/animals.html" },
    nevera: { dato: "Comida en un apagón", valor: "Nevera: 4 horas. Congelador lleno: 48 horas; medio lleno: 24 horas (con la puerta cerrada)", fuente: "USDA (Servicio de Inocuidad Alimentaria, FSIS)", url: "https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/keeping-food-safe-during" },
    co: { dato: "Generadores", valor: "Siempre al aire libre y a más de 6 m (20 pies) de puertas, ventanas y rejillas", fuente: "CDC", url: "https://www.cdc.gov/carbon-monoxide/" },
    hervir: { dato: "Hervir el agua", valor: "1 minuto; 3 minutos a más de 2.000 m (6.500 pies)", fuente: "CDC", url: "https://www.cdc.gov/water-emergency/" },
    lejia: { dato: "Lejía", valor: "2 gotas por litro de lejía al 5–8 % (4 si está turbia) y 30 minutos de espera", fuente: "CDC y EPA. En España, solo lejía «apta para la desinfección del agua de bebida»", url: "https://espanol.epa.gov/" },
    aguaRotar: { dato: "Rotar el agua guardada", valor: "Cada 6 meses si es del grifo; la embotellada, según su fecha", fuente: "Ready.gov (FEMA) y CDC", url: "https://www.ready.gov/water" },
    inundacion: { dato: "Agua en movimiento", valor: "15 cm derriban a un adulto; 30 cm arrastran un coche pequeño; 45–60 cm, un todoterreno", fuente: "National Weather Service (EE. UU.)", url: "https://www.weather.gov/safety/flood-turn-around-dont-drown" },
    fechas: { dato: "Fechas de los alimentos", valor: "«Consumo preferente»: calidad (conservas, arroz, pasta, legumbres, aceite, galletas, miel); seguro después si el envase está intacto. «Caducidad»: seguridad; no consumir después", fuente: "AESAN (Agencia Española de Seguridad Alimentaria y Nutrición)", url: "https://www.aesan.gob.es/AECOSAN/web/para_el_consumidor/ampliacion/fechas_caducidad.htm" },
    criterio: { dato: "Criterios propios", valor: "Medicación para el horizonte más 7 días; 7 pañales al día; 110 g de fórmula al día; 1 rollo de papel cada 3 días por persona; pilas y linternas", fuente: "Estimaciones de Preparados72h: ajústalas a tu caso", url: "" },
  },

  // Fuentes generales: texto o { texto, url }.
  fuentes: [
    { texto: "CNBC: «New cyberattack on supermarket fridges sweeps across Europe» (2 nov 2026).", url: "https://www.cnbc.com/2026/11/02/cyberattack-on-fridges-hits-supermarkets-across-europe.html" },
    { texto: "ABC News (AP): «Freezers at supermarkets in several European countries hit by apparent cyberattacks» (nov 2026).", url: "https://abcnews.com/International/wireStory/freezers-supermarkets-european-countries-hit-apparent-cyberattacks-137765494" },
    { texto: "Al Jazeera: «Very cold war: Who’s attacking Europe’s supermarket freezers?» (3 nov 2026).", url: "https://www.aljazeera.com/news/2026/11/3/very-cold-war-whos-attacking-europes-supermarket-freezers" },
    { texto: "La Nación: «Un ciberataque golpea a las heladeras de los supermercados en varios países de Europa por segunda vez en un mes» (2 nov 2026).", url: "https://www.lanacion.com.ar/el-mundo/un-ciberataque-golpea-a-las-heladeras-de-los-supermercados-en-varios-paises-europa-por-segunda-vez-nid02112026/" },
    { texto: "Infobae (agencias): «Ciberataques alteran la refrigeración de alimentos en comercios de cinco países europeos» (2 nov 2026).", url: "https://www.infobae.com/america/agencias/2026/11/02/ciberataques-alteran-la-refrigeracion-de-alimentos-en-comercios-de-cinco-paises-europeos/" },
    { texto: "Recomendaciones oficiales de cada país, con su enlace: sección «Recomendaciones por país».", url: "#paises" },
    "Comunidad r/prepping (Reddit): lecciones recurrentes de los posts más votados de 2026, resumidas y contrastadas con las recomendaciones oficiales.",
    "Ilustraciones de nudos (Wikimedia Commons): as de guía, Phil'enCorse (CC BY-SA 4.0); ballestrinque, Sawims (dominio público); nudo tensor, Chris 73 (CC BY-SA 3.0); pescador doble, LadyofHats (dominio público). Resto de ilustraciones y mapa: propios (contornos de Natural Earth, dominio público).",
    "Las cifras de la calculadora, del agua potable y de las guías tienen su fuente en la tabla «De dónde salen los números».",
  ],
};
