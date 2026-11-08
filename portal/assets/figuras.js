// Ilustraciones de las habilidades. Van dentro de la web para que funcionen sin conexión.
// Cada figura: { paso, svg | img, alt, pie, credito? }; paso = índice (desde 0) del paso que ilustra. Las SVG propias usan las clases .f-* de styles.css
// para adaptarse al modo claro, oscuro y apagón.
window.PREP_FIGURAS = {
  nudos: [
    {
      paso: 0,
      img: "assets/img/nudo-as-de-guia.svg",
      alt: "As de guía terminado, con las partes numeradas del 1 al 5",
      pie: "As de guía: 1 parte fija (la que soporta la carga), 2 chicote (el extremo libre), 3 ojo que se hace primero en la parte fija, 4 vuelta del chicote por detrás de la parte fija, 5 gaza que queda fija. El chicote sale por el ojo y queda dentro de la gaza.",
      credito: "Phil'enCorse · Wikimedia Commons · CC BY-SA 4.0",
    },
    {
      paso: 1,
      img: "assets/img/nudo-ballestrinque.svg",
      alt: "Ballestrinque alrededor de un poste: dos vueltas cruzadas en forma de X",
      pie: "Ballestrinque: dos vueltas alrededor del poste; la segunda cruza por encima de la primera formando una X y el chicote sale por debajo de ese cruce, en sentido contrario a la parte fija.",
      credito: "Sawims · Wikimedia Commons · dominio público",
    },
    {
      paso: 2,
      img: "assets/img/nudo-tensor.jpg",
      alt: "Fotos de un nudo tensor alrededor de una vara, antes y después de apretarlo",
      pie: "Nudo tensor: rodea el poste o la estaca, da dos vueltas con el chicote alrededor de la parte fija hacia dentro de la gaza y una tercera por fuera. Desliza el nudo para tensar: bajo carga no se mueve.",
      credito: "Chris 73 · Wikimedia Commons · CC BY-SA 3.0",
    },
    {
      paso: 3,
      img: "assets/img/nudo-pescador-doble.svg",
      alt: "Cuatro pasos del nudo de pescador doble uniendo dos cuerdas",
      pie: "Pescador doble, de arriba abajo: cada chicote da dos vueltas alrededor de la otra cuerda y pasa por dentro de ellas; al tirar de las dos partes fijas, los dos nudos se juntan.",
      credito: "LadyofHats · Wikimedia Commons · dominio público",
    },
  ],

  senales: [
    {
      paso: 4,
      alt: "Señales en el suelo: una V significa necesito ayuda y una X necesito asistencia médica",
      pie: "Señales tierra-aire: hazlas grandes (varios metros) y que contrasten con el suelo.",
      svg: `<svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg">
        <rect class="f-soft" x="6" y="6" width="148" height="138" rx="10"/><rect class="f-soft" x="166" y="6" width="148" height="138" rx="10"/>
        <path class="f-acc-s" d="M45 28 L80 102 L115 28" fill="none" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
        <path class="f-acc-s" d="M207 30 L273 100 M273 30 L207 100" fill="none" stroke-width="14" stroke-linecap="round"/>
        <text class="f-txt" x="80" y="130" text-anchor="middle">Necesito ayuda</text>
        <text class="f-txt" x="240" y="130" text-anchor="middle">Asistencia médica</text></svg>`,
    },
    {
      paso: 1,
      alt: "Ritmo de la señal de socorro en montaña: seis señales en un minuto, un minuto de pausa y repetir",
      pie: "Socorro en montaña: 6 señales por minuto (una cada 10 s), un minuto de pausa y otra vez. Quien te ha visto responde con 3 por minuto.",
      svg: `<svg viewBox="0 0 320 110" xmlns="http://www.w3.org/2000/svg">
        <line class="f-line" x1="14" y1="55" x2="152" y2="55" stroke-width="2"/>
        <line class="f-line" x1="160" y1="55" x2="290" y2="55" stroke-width="2" stroke-dasharray="5 5"/>
        ${[0, 1, 2, 3, 4, 5].map((i) => `<circle class="f-acc" cx="${20 + i * 25}" cy="55" r="8"/>`).join("")}
        <path class="f-line" d="M298 46 a10 10 0 1 1 -6 -4" fill="none" stroke-width="2"/><path class="f-ink" d="M288 36 l8 4 -6 6z"/>
        <text class="f-txt" x="83" y="30" text-anchor="middle">1 minuto: 6 señales</text>
        <text class="f-txt" x="225" y="30" text-anchor="middle">1 minuto de pausa</text>
        <text class="f-txt f-sm" x="83" y="85" text-anchor="middle">pitido · destello · grito</text>
        <text class="f-txt f-sm" x="225" y="85" text-anchor="middle">y repetir</text></svg>`,
    },
    {
      paso: 3,
      alt: "SOS en código morse: tres puntos, tres rayas y tres puntos",
      pie: "SOS en morse: tres cortos, tres largos y tres cortos, sin separar las letras. Sirve con linterna, silbato o golpes.",
      svg: `<svg viewBox="0 0 320 80" xmlns="http://www.w3.org/2000/svg">
        ${[0, 1, 2].map((i) => `<circle class="f-acc" cx="${22 + i * 22}" cy="32" r="8"/>`).join("")}
        ${[0, 1, 2].map((i) => `<rect class="f-acc" x="${102 + i * 40}" y="24" width="30" height="16" rx="8"/>`).join("")}
        ${[0, 1, 2].map((i) => `<circle class="f-acc" cx="${246 + i * 22}" cy="32" r="8"/>`).join("")}
        <text class="f-txt" x="44" y="68" text-anchor="middle">S</text><text class="f-txt" x="157" y="68" text-anchor="middle">O</text><text class="f-txt" x="268" y="68" text-anchor="middle">S</text></svg>`,
    },
  ],

  orientacion: [
    {
      paso: 3,
      alt: "Reloj de agujas con la aguja de las horas apuntando al sol; la bisectriz entre esa aguja y las 12 marca el sur",
      pie: "Con un reloj (hemisferio norte): apunta la aguja de las horas al sol. El sur está a medio camino entre esa aguja y las 12 (las 13 en horario de verano). En el ejemplo son las 4: el sur queda hacia las 2.",
      svg: `<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
        <circle class="f-soft f-line" cx="110" cy="110" r="82" stroke-width="3"/>
        ${Array.from({ length: 12 }, (_, i) => { const a = (i * Math.PI) / 6, s = Math.sin(a), c = Math.cos(a); return `<line class="f-line" x1="${(110 + 70 * s).toFixed(1)}" y1="${(110 - 70 * c).toFixed(1)}" x2="${(110 + 78 * s).toFixed(1)}" y2="${(110 - 78 * c).toFixed(1)}" stroke-width="${i % 3 ? 2 : 4}"/>`; }).join("")}
        <text class="f-txt" x="110" y="58" text-anchor="middle">12</text>
        <line class="f-line" x1="110" y1="110" x2="110" y2="66" stroke-width="2" stroke-dasharray="4 4"/>
        <line class="f-ink-s" x1="110" y1="110" x2="162" y2="140" stroke-width="7" stroke-linecap="round"/>
        <line class="f-acc-s" x1="110" y1="110" x2="205" y2="55" stroke-width="3" stroke-dasharray="7 5"/>
        <circle class="f-ink" cx="110" cy="110" r="6"/>
        <circle class="f-sun" cx="222" cy="174" r="16"/>
        ${Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return `<line class="f-sun-s" x1="${(222 + 21 * Math.cos(a)).toFixed(1)}" y1="${(174 + 21 * Math.sin(a)).toFixed(1)}" x2="${(222 + 28 * Math.cos(a)).toFixed(1)}" y2="${(174 + 28 * Math.sin(a)).toFixed(1)}" stroke-width="3" stroke-linecap="round"/>`; }).join("")}
        <line class="f-line" x1="166" y1="142" x2="200" y2="162" stroke-width="2" stroke-dasharray="3 4"/>
        <text class="f-txt f-b" x="212" y="50">SUR</text>
        <text class="f-txt f-sm" x="166" y="210" text-anchor="middle">aguja de las horas → sol</text></svg>`,
    },
    {
      paso: 4,
      alt: "Constelación de la Osa Mayor; prolongando cinco veces la distancia entre las dos estrellas del extremo se llega a la estrella Polar",
      pie: "De noche: prolonga unas cinco veces la distancia entre las dos estrellas del extremo del Carro (Osa Mayor). Llegas a la Polar, que está casi exactamente sobre el norte.",
      svg: `<svg viewBox="0 0 320 210" xmlns="http://www.w3.org/2000/svg">
        <rect class="f-night" x="0" y="0" width="320" height="210" rx="12"/>
        <polyline class="f-star-s" points="70,176 100,160 130,156 162,160 168,186 204,188 199,160 162,160" fill="none" stroke-width="1.5"/>
        <line class="f-acc-s" x1="204" y1="188" x2="182" y2="32" stroke-width="2" stroke-dasharray="5 5"/>
        ${[[70, 176], [100, 160], [130, 156], [162, 160], [168, 186]].map(([x, y]) => `<circle class="f-star" cx="${x}" cy="${y}" r="4"/>`).join("")}
        <circle class="f-acc" cx="204" cy="188" r="5.5"/><circle class="f-acc" cx="199" cy="160" r="5.5"/>
        <circle class="f-star" cx="182" cy="32" r="7"/>
        ${[1, 2, 3, 4].map((k) => { const x = 199 - 4.2 * k, y = 160 - 28 * k + 4; return `<line class="f-star-s" x1="${x - 6}" y1="${y}" x2="${x + 6}" y2="${y}" stroke-width="1.5"/>`; }).join("")}
        <text class="f-ntxt f-b" x="196" y="30">Polar · NORTE</text>
        <text class="f-ntxt f-sm" x="214" y="112">× 5</text>
        <text class="f-ntxt f-sm" x="40" y="146">Osa Mayor (el Carro)</text></svg>`,
    },
  ],

  fuego: [
    {
      paso: 0,
      alt: "Tres montones preparados antes de encender: yesca, astillas finas y leña, y una estructura en tipi",
      pie: "Prepáralo todo antes de encender: yesca (prende con una chispa), astillas finas como un lápiz y leña. En tipi, la yesca va en el centro y las astillas apoyadas alrededor dejando pasar el aire.",
      svg: `<svg viewBox="0 0 400 170" xmlns="http://www.w3.org/2000/svg">
        <line class="f-line" x1="10" y1="132" x2="390" y2="132" stroke-width="2"/>
        <path class="f-tinder" d="M28 130 q-6-18 10-22 q2-14 18-10 q14-6 18 8 q14 4 8 24z"/>
        <path class="f-line" d="M36 120 q8-6 14 0 q6-8 14-2" fill="none" stroke-width="1.5"/>
        ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<line class="f-wood-s" x1="${112 + i * 6}" y1="130" x2="${126 + i * 7}" y2="${104 + (i % 2) * 4}" stroke-width="3" stroke-linecap="round"/>`).join("")}
        ${[0, 1, 2].map((i) => `<rect class="f-wood" x="${200 + i * 6}" y="${118 - i * 14}" width="62" height="13" rx="6" transform="rotate(${-4 + i * 4} ${231 + i * 6} ${124 - i * 14})"/>`).join("")}
        <path class="f-tinder" d="M326 130 q-4-10 6-12 q4-8 12-4 q8-2 8 8 q6 4 2 8z"/>
        ${[-30, -15, 0, 15, 30].map((d) => `<line class="f-wood-s" x1="${340 + d}" y1="131" x2="${340 + d * 0.12}" y2="74" stroke-width="3" stroke-linecap="round"/>`).join("")}
        <text class="f-txt" x="56" y="156" text-anchor="middle">1 Yesca</text>
        <text class="f-txt" x="138" y="156" text-anchor="middle">2 Astillas</text>
        <text class="f-txt" x="236" y="156" text-anchor="middle">3 Leña</text>
        <text class="f-txt" x="340" y="156" text-anchor="middle">Tipi</text></svg>`,
    },
  ],

  refugio: [
    {
      paso: 1,
      alt: "Refugio de lona inclinado: la cuerda atada entre árboles, la lona baja hacia el viento y una capa aislante en el suelo",
      pie: "Lona en pendiente: el lado bajo hacia el viento y, debajo, una capa gruesa de ramas, hojas secas o esterilla. El suelo roba más calor que el aire.",
      svg: `<svg viewBox="0 0 320 190" xmlns="http://www.w3.org/2000/svg">
        <line class="f-line" x1="8" y1="160" x2="312" y2="160" stroke-width="2"/>
        <rect class="f-wood" x="232" y="50" width="12" height="110"/>
        <circle class="f-tree" cx="238" cy="40" r="30"/>
        <circle class="f-ink" cx="238" cy="78" r="4"/>
        <path class="f-tarp" d="M238 76 L90 156 L104 160 L238 82z"/>
        <line class="f-line" x1="92" y1="156" x2="82" y2="168" stroke-width="3"/>
        <rect class="f-ins" x="112" y="150" width="118" height="10" rx="4"/>
        ${[0, 1, 2].map((i) => `<path class="f-acc-s" d="M14 ${96 + i * 20} h44 m-8 -6 l8 6 -8 6" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`).join("")}
        <text class="f-txt" x="14" y="84">Viento</text>
        <text class="f-txt f-sm" x="170" y="182" text-anchor="middle">aislante: ramas, hojas, esterilla</text>
        <text class="f-txt f-sm" x="252" y="92">cuerda entre</text><text class="f-txt f-sm" x="252" y="106">dos árboles</text></svg>`,
    },
  ],
};
