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
        "Hipotermia: temblores intensos, torpeza, habla confusa y somnolencia. Abriga a la persona poco a poco, dale bebidas calientes sin alcohol y llama al 112.",
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
  cifras: {
    agua: { dato: "Agua por persona y día", valor: "3 L por adulto: 1,5 L para beber, 0,5 L para cocinar y 1 L de higiene mínima. 3,5 L para mayores de 65 y 2,5 L para niños", fuente: "BLE (Alemania), tabla de reservas de 10 días, 2024; Ready.gov (EE. UU.) recomienda 3,8 L para beber e higiene; Suecia, 3–5 L", url: "https://www.ernaehrungsvorsorge.de/" },
    higiene: { dato: "Higiene básica", valor: "2–6 L por persona y día (la calculadora usa 1 L, el mínimo; si puedes, guarda más)", fuente: "Manual Esfera, normas mínimas de agua y saneamiento", url: "https://spherestandards.org/" },
    calor: { dato: "Calor intenso", valor: "Puede duplicar el agua necesaria para beber", fuente: "Ready.gov (FEMA)", url: "https://www.ready.gov/water" },
    lactancia: { dato: "Lactancia", valor: "+700 ml de agua y unas +500 kcal al día", fuente: "EFSA, valores de referencia de agua (2010) y energía (2013)", url: "https://www.efsa.europa.eu/" },
    kcal: { dato: "Energía", valor: "2.200 kcal por adulto; 1.900 para mayores de 65; 1.800 para niños de 7 a 13 años y 1.300 de 3 a 6", fuente: "BLE (planificación de la reserva) y valores de referencia D-A-CH (actividad moderada, media de chicos y chicas)", url: "https://www.ernaehrungsvorsorge.de/" },
    kg: { dato: "Kilos de comida", valor: "Peso neto real de lo que sale en la lista; la referencia oficial alemana ronda los 14 kg por persona para 10 días", fuente: "BLE, «Vorratstabelle Mischkost», 2024", url: "https://www.ernaehrungsvorsorge.de/" },
    mascotas: { dato: "Agua para mascotas", valor: "Unos 50–60 ml por kg y día: perro pequeño 0,4 L, mediano 1 L, grande 2 L; gato 0,3 L", fuente: "Referencia veterinaria habitual (puede variar con el calor, la actividad y la comida húmeda)", url: "" },
    nevera: { dato: "Comida en un apagón", valor: "Nevera: 4 horas. Congelador lleno: 48 horas; medio lleno: 24 horas (con la puerta cerrada)", fuente: "USDA / FoodSafety.gov", url: "https://www.foodsafety.gov/keep-food-safe/food-safety-in-disaster-or-emergency" },
    co: { dato: "Generadores", valor: "Siempre al aire libre y a más de 6 m (20 pies) de puertas, ventanas y rejillas", fuente: "CDC", url: "https://www.cdc.gov/carbon-monoxide/" },
    hervir: { dato: "Hervir el agua", valor: "1 minuto; 3 minutos a más de 2.000 m (6.500 pies)", fuente: "CDC", url: "https://www.cdc.gov/water-emergency/" },
    lejia: { dato: "Lejía", valor: "2 gotas por litro de lejía al 5–8 % (4 si está turbia) y 30 minutos de espera", fuente: "CDC y EPA. En España, solo lejía «apta para la desinfección del agua de bebida»", url: "https://espanol.epa.gov/" },
    aguaRotar: { dato: "Rotar el agua guardada", valor: "Cada 6 meses si es del grifo; la embotellada, según su fecha", fuente: "Ready.gov (FEMA) y CDC", url: "https://www.ready.gov/water" },
    inundacion: { dato: "Agua en movimiento", valor: "15 cm derriban a un adulto; 30 cm arrastran un coche pequeño; 45–60 cm, un todoterreno", fuente: "National Weather Service (EE. UU.)", url: "https://www.weather.gov/safety/flood-turn-around-dont-drown" },
    criterio: { dato: "Criterios propios", valor: "Medicación para el horizonte más 7 días; 7 pañales al día; 110 g de fórmula al día; 1 rollo de papel cada 3 días por persona; pilas y linternas", fuente: "Estimaciones de Preparados72h: ajústalas a tu caso", url: "" },
  },

  fuentes: [
    "BBC News: “Europe on alert after supermarket freezers hit by cyber-attacks in 10 countries” (3 nov 2026).",
    "Reuters: “Un nuevo ciberataque afecta a los sistemas de refrigeración de supermercados europeos” (2 nov 2026).",
    "El País: “Por qué la segunda oleada de ‘hackeos’ a las neveras en supermercados avisa de lo que viene” (3 nov 2026).",
    "EFE: “Los supermercados españoles dedican los máximos esfuerzos a la seguridad de sus equipos…” (3 nov 2026).",
    "Comunidad r/prepping (Reddit): lecciones recurrentes de los posts más votados de 2026, resumidas y contrastadas con las recomendaciones oficiales.",
    "El Financiero y Heraldo de México: recomendaciones de mochilas de emergencia y reservas de 72 horas a diez días (3–4 nov 2026).",
    "Las cifras de la calculadora, del agua potable y de las guías tienen su fuente en la tabla «De dónde salen los números».",
  ],
};
