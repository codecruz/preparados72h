// Contenido del portal, basado en hackeos_supermercados_preparacion_72h.pdf (5 nov 2026).
window.PREP_DATA = {
  alerta: {
    fecha: "5 de noviembre de 2026",
    titulo: "Ciberataques a la refrigeración de supermercados en Europa",
    resumen:
      "Una segunda oleada de ciberataques contra controladores de refrigeración conectados a internet ha roto la cadena de frío en supermercados de al menos diez países europeos. Varios gobiernos recuerdan a las familias que conviene tener preparada una mochila de emergencia para 72 horas.",
    datos: [
      ["Alcance", "Al menos diez países europeos; segunda oleada tras el ataque en Francia (octubre)."],
      ["Vector de ataque", "Sistemas remotos de control y supervisión de refrigeración conectados a internet."],
      ["Efecto principal", "Pérdida de la cadena de frío y desperdicio de alimentos frescos y congelados."],
      ["Países", "Bélgica, Luxemburgo, Suecia, Países Bajos, Irlanda, Estonia, Finlandia, Portugal y Rumanía."],
      ["Cadenas afectadas", "Delhaize, Carrefour, Spar, ICA, Coop, Intermarché, SuperValu y otros comercios."],
      ["Impacto", "Temperaturas de hasta 50 °C; una tienda en Hoeilaart desechó unos 100.000 € en alimentos."],
      ["Investigación", "Nadie ha reivindicado la autoría; las autoridades y las empresas investigan los incidentes."],
    ],
  },

  paises: [
    { region: "Francia, Reino Unido, Canadá, Japón, México y Países Bajos", horizonte: "Al menos 72 horas", dias: 3 },
    { region: "Ciudad de México", horizonte: "Mochila de emergencia para las primeras 72 horas", dias: 3 },
    { region: "Suecia y Noruega", horizonte: "Aproximadamente una semana", dias: 7 },
    { region: "Alemania", horizonte: "Hasta diez días", dias: 10 },
  ],

  // Checklist de la mochila de 72 horas. "extra" = solo al ampliar a una semana o más.
  checklist: [
    {
      categoria: "Agua",
      icono: "💧",
      items: [
        { id: "agua", texto: "Agua potable: unos 3 litros por persona y día (incluye higiene básica)" },
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
    { icono: "🔥", titulo: "El calor también es supervivencia", texto: "En invierno, un apagón largo es sobre todo un problema de frío. Ten mantas, sacos y ropa de abrigo para vestirse por capas. Nunca uses braseros, estufas de combustión ni barbacoas en interiores sin ventilación." },
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

  fuentes: [
    "BBC News: “Europe on alert after supermarket freezers hit by cyber-attacks in 10 countries” (3 nov 2026).",
    "Reuters: “Un nuevo ciberataque afecta a los sistemas de refrigeración de supermercados europeos” (2 nov 2026).",
    "El País: “Por qué la segunda oleada de ‘hackeos’ a las neveras en supermercados avisa de lo que viene” (3 nov 2026).",
    "EFE: “Los supermercados españoles dedican los máximos esfuerzos a la seguridad de sus equipos…” (3 nov 2026).",
    "Comunidad r/prepping (Reddit): lecciones recurrentes de los posts más votados de 2026, resumidas y contrastadas con las recomendaciones oficiales.",
    "El Financiero y Heraldo de México: recomendaciones de mochilas de emergencia y reservas de 72 horas a diez días (3–4 nov 2026).",
  ],
};
