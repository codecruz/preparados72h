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
    "El Financiero y Heraldo de México: recomendaciones de mochilas de emergencia y reservas de 72 horas a diez días (3–4 nov 2026).",
  ],
};
