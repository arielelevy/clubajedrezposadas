/**
 * Festival de Ajedrez del Centenario — tres torneos y una jornada de talleres,
 * del 5 al 8 de diciembre de 2026.
 *
 * Todo sale de la presentación oficial "Festival Centenario Posadas" que pasó
 * la comisión (12 diapositivas) y del afiche que acompaña la difusión. Los
 * importes, los IDs FIDE y los alias de pago van transcriptos tal cual: son
 * datos que el jugador copia, no texto de tapa.
 *
 * Dos cosas que la presentación deja abiertas y que conviene tener a mano si
 * alguien las pregunta:
 *
 * - La bolsa. Acá se publica el desglose del documento oficial: $1.100.000 al
 *   IRT más $200.000 al Blitz, que suman $1.300.000. La difusión de WhatsApp
 *   anuncia "más de $1.500.000" incluyendo los premios en especie; hasta que el
 *   club confirme el número redondo se muestra lo que está itemizado.
 * - La escala de inscripción salta del tramo 41-80 al cierre 101-120: los cupos
 *   81 a 100 no tienen arancel asignado en el documento. Por eso el tramo de
 *   cierre se rotula "101 al 120" y no "hasta el cierre".
 */

import { club } from './site'

/** Un tramo de la escala de aranceles. `hasta` vacío en el tramo de cierre. */
type TramoInscripcion = {
  readonly cupos: string
  readonly hasta: string
  readonly precio: string
  readonly nota?: string
}

export const festival = {
  /** Con `false` desaparecen la sección del inicio y el aviso de la barra. */
  publicado: true,

  /** Aviso de la barra superior, que se despliega volviendo al tope. */
  avisoSuperior: 'IRT "100 Años" · 5 al 8 de diciembre de 2026 · Posadas',

  nombre: 'Festival de Ajedrez del Centenario',
  torneoPrincipal: 'IRT "100 Años"',
  /*
   * La difusión dice "4 torneos", pero el cuarto son los talleres y las
   * simultáneas, que el propio programa llama "eventos paralelos" y no tienen
   * planilla en Chess-Results. Acá se cuenta lo que es exacto: tres torneos y
   * una jornada. La grilla de tarjetas sigue mostrando los cuatro frentes.
   */
  bajada:
    'Tres torneos, cuatro días y cien años de club. Del 5 al 8 de diciembre de 2026 Posadas juega su festival más grande: un IRT válido para el ranking FIDE, un Blitz vespertino, el Prix infanto-juvenil y una jornada de talleres y simultáneas.',

  fechaTexto: '5, 6, 7 y 8 de diciembre de 2026',
  fechaISO: '2026-12-05',
  fechaFinISO: '2026-12-08',
  diaDesde: '05',
  diaHasta: '08',
  mesCorto: 'Dic',
  anio: '2026',

  sede: {
    nombre: 'Sociedad Italiana de Socorros Mutuos',
    direccion: 'Santa Fe 1898, Posadas, Misiones',
    detalle: 'Sala de juego 100 % climatizada.',
    /* Nombre y dirección juntos: el nombre solo era ambiguo (hay más de una
       sociedad de socorros mutuos en Posadas) y la altura sola dependía del
       geocoder. La dirección es la del programa oficial. */
    mapsLink:
      'https://www.google.com/maps/search/?api=1&query=Sociedad+Italiana%2C+Santa+Fe+1898%2C+Posadas%2C+Misiones',
    mapsEmbed:
      'https://www.google.com/maps?q=Sociedad%20Italiana%2C%20Santa%20Fe%201898%2C%20Posadas%2C%20Misiones&output=embed',
  },

  /**
   * Tarifa vigente, en la portada y en rojo: es el único dato de la página que
   * se vence solo. Hay que actualizarlo cuando cambia el tramo (los cortes están
   * en `escala.tramos`); si se deja vacío, la línea no se muestra.
   */
  vencimiento: 'Inscripción de $25.000 hasta el 31 de agosto · después sube por tramos',

  /**
   * Titulares del festival, para la banda de cifras del encabezado. Las cuatro
   * son del festival entero: las 7 rondas y el ritmo 90'+30" son solo del IRT
   * Standard (el Blitz va a 3'+2") y por eso viven en `formato`, no acá.
   */
  cifras: [
    { valor: '$1.300.000', rotulo: 'en premios garantizados' },
    { valor: '3', rotulo: 'torneos, más talleres y simultáneas' },
    { valor: '4', rotulo: 'días en la Sociedad Italiana' },
    { valor: '120', rotulo: 'cupos en el IRT Standard' },
  ],

  /** Bolsa de premios (diapositiva "Bolsa de Premios"). */
  premios: {
    total: '$1.300.000',
    detalle:
      'Incentivo total e inclusivo: la bolsa se reparte entre la general, las franjas de Elo, las categorías por edad y los reconocimientos del centenario.',
    desglose: [
      { torneo: 'IRT Standard', monto: '$1.100.000 ARS' },
      { torneo: 'Blitz IRT Vespertino', monto: '$200.000 ARS' },
    ],
    franjas: [
      'General',
      'Sub-2000',
      'Sub-1700',
      'Sin ranking',
      'Sub-8 a Sub-16',
      'Senior +50',
      'Senior +65',
      'Dama',
      'Socio del club',
      'Internacionales',
    ],
  },

  /** Formato y validez del torneo principal. */
  formato: {
    titulo: 'Validez FIDE y formato',
    items: [
      {
        rotulo: 'Formato',
        valor: 'Sistema suizo a 7 rondas, con pareo acelerado de Bakú.',
      },
      {
        rotulo: 'Ritmo clásico',
        valor: '90 minutos + 30 segundos de incremento desde la jugada 1.',
      },
      {
        rotulo: 'Validez',
        valor: 'Ranking FIDE Standard y normas arbitrales.',
      },
    ],
  },

  /** Garantía arbitral: el dato que mira el jugador con Elo antes de anotarse. */
  arbitraje: {
    titulo: 'Garantía arbitral FIDE',
    integrantes: [
      { rol: 'Director del torneo', nombre: 'Damián Moore Fernández', fide: 'FIDE ID 20045913' },
      { rol: 'Árbitro principal', nombre: 'AN Ignacio Pintos Merlo', fide: 'FIDE ID 178284' },
    ],
    sistema: 'Pareos y publicación con Swiss-Manager oficial.',
  },

  /** Beneficios de inscripción (diapositiva "Beneficios Especiales"). */
  beneficios: [
    {
      titulo: 'Titulados FIDE',
      etiqueta: 'Inscripción gratuita',
      texto:
        'Sin cargo para GM, IM, WGM, FM, WIM y WFM que confirmen su participación antes del 15 de noviembre de 2026.',
      pieza: 'rey',
    },
    {
      titulo: 'Cupo femenino',
      etiqueta: 'Las primeras 20, gratis',
      texto:
        'Inscripción sin cargo para las primeras 20 jugadoras con Elo FIDE. A partir de la 21.ª, 50 % de descuento.',
      pieza: 'dama',
    },
    {
      titulo: 'Socios del club',
      etiqueta: 'Tarifa preferencial',
      texto:
        'Preinscripción a $20.000 ARS para socios del Club de Ajedrez Posadas, en los cupos 1 al 20.',
      pieza: 'torre',
    },
  ],

  /** Packs promocionales, con los cuatro valores de la tabla oficial. */
  packs: {
    titulo: 'Packs promocionales',
    bajada:
      'Cinco opciones según lo que necesites cubrir. Los valores en guaraníes y reales son los de la tabla oficial y se abonan por Sudameris o PIX.',
    monedas: ['ARS', 'USD', 'PYG', 'BRL'],
    filas: [
      {
        pack: 'Todo (con hotel)',
        ars: '$143.000',
        usd: 'USD 95',
        pyg: 'Gs. 572.000',
        brl: 'R$ 493',
      },
      {
        pack: 'Todo (sin hotel)',
        ars: '$43.000',
        usd: 'USD 29',
        pyg: 'Gs. 172.000',
        brl: 'R$ 148',
      },
      { pack: 'Simultánea', ars: '$23.000', usd: 'USD 15', pyg: 'Gs. 92.000', brl: 'R$ 80' },
      {
        pack: 'Pack exclusivo maestros',
        ars: '$200.000',
        usd: 'USD 133',
        pyg: 'Gs. 800.000',
        brl: 'R$ 690',
      },
      {
        pack: 'All inclusive VIP',
        ars: '$243.000',
        usd: 'USD 162',
        pyg: 'Gs. 972.000',
        brl: 'R$ 838',
      },
    ],
  },

  /** Escala de aranceles: sube con los cupos ocupados. */
  escala: {
    titulo: 'Escala de inscripción',
    bajada:
      'El arancel se ajusta progresivamente según los cupos ocupados: anotarse temprano asegura la tarifa inicial.',
    tramos: [
      /* Este primer tramo sale de la diapositiva de beneficios, no de la escala:
         se incluye porque explica por qué la escala general arranca en el cupo
         21, pero el arancel es solo para socios y la nota tiene que decirlo sin
         vueltas. */
      {
        cupos: 'Cupos 1 al 20',
        hasta: 'Preinscripción',
        precio: '$20.000 ARS',
        nota: 'Solo para socios del Club de Ajedrez Posadas.',
      },
      {
        cupos: 'Cupos 21 al 40',
        hasta: 'Hasta el 31 de agosto',
        precio: '$25.000 ARS',
        nota: 'USD 17 · Gs. 100.000 · R$ 86',
      },
      {
        cupos: 'Cupos 41 al 80',
        hasta: 'Hasta el 15 de octubre',
        precio: '$30.000 a $35.000 ARS',
      },
      {
        cupos: 'Cupos 101 al 120',
        hasta: 'Cierre general',
        precio: '$50.000 ARS',
        nota: '$60.000 ARS abonando in situ.',
      },
    ] as readonly TramoInscripcion[],
    aforo:
      'Aforo limitado: la capacidad de la sala climatizada está restringida, así que los cupos son los que son.',
  },

  /** El programa: tres torneos y la jornada de talleres y simultáneas. */
  torneos: [
    {
      nombre: 'IRT Standard FIDE',
      tipo: 'Torneo',
      pieza: 'rey',
      cuando: 'Sábado 5 a martes 8 de diciembre',
      destacado: true,
      items: [
        'Sistema suizo a 7 rondas con pareo acelerado de Bakú',
        'Ritmo 90\' + 30" desde la jugada 1',
        'Válido para el ranking FIDE Standard',
        'Bolsa de $1.100.000 ARS',
      ],
    },
    {
      nombre: 'Blitz IRT Vespertino',
      tipo: 'Torneo',
      pieza: 'caballo',
      cuando: 'Sábado 5 de diciembre, 15:30',
      destacado: false,
      items: [
        'Sistema suizo a 7 rondas',
        'Ritmo 3\' + 2"',
        'Premios: $200.000 ARS ($100.000 / $60.000 / $40.000)',
      ],
    },
    {
      nombre: 'Prix Infanto-Juvenil',
      tipo: 'Torneo',
      pieza: 'peon',
      cuando: 'Domingo 6 de diciembre, 09:00',
      destacado: false,
      items: [
        'Categorías Sub-6 a Sub-18 (Prix Amateur)',
        'Diploma del centenario para todos los participantes',
        'Medallas por categoría',
      ],
    },
    {
      nombre: 'Talleres y simultáneas',
      tipo: 'Actividades',
      pieza: 'alfil',
      cuando: 'Lunes 7 de diciembre, 15:00',
      destacado: false,
      items: [
        'Simultáneas con jugadores titulados',
        'Talleres abiertos durante la jornada',
        'Incluidos en los packs "Todo" y "Simultánea"',
      ],
    },
  ],

  /** Cronograma oficial, día por día. */
  cronograma: {
    titulo: 'Cronograma oficial',
    dias: [
      {
        dia: 'Sábado 5',
        mes: 'Diciembre',
        turnos: [
          { hora: '09:00', que: 'Acreditaciones' },
          { hora: '10:00', que: 'Ronda 1 · IRT' },
          { hora: '15:30', que: 'Blitz IRT' },
          { hora: '19:00', que: 'Ronda 2 · IRT' },
        ],
      },
      {
        dia: 'Domingo 6',
        mes: 'Diciembre',
        turnos: [
          { hora: '09:00', que: 'Torneo infanto-juvenil' },
          { hora: '15:00', que: 'Ronda 3 · IRT' },
          { hora: '19:00', que: 'Ronda 4 · IRT' },
        ],
      },
      {
        dia: 'Lunes 7',
        mes: 'Diciembre',
        turnos: [
          { hora: '10:00', que: 'Ronda 5 · IRT' },
          { hora: '15:00', que: 'Taller y simultánea' },
          { hora: '19:30', que: 'Ronda 6 · IRT' },
        ],
      },
      {
        dia: 'Martes 8',
        mes: 'Diciembre',
        turnos: [
          { hora: '10:00', que: 'Ronda 7 · final' },
          { hora: '14:00', que: 'Premiación y cierre oficial' },
        ],
      },
    ],
  },

  /** Alojamiento con tarifa convenida. */
  alojamiento: {
    lugar: 'Círculo de Oficiales de Policía',
    precio: '$25.000 ARS por noche y por persona',
    detalle: 'Habitaciones con aire acondicionado.',
    reservas: '+54 376 428-8519',
    reservasLink: 'https://wa.me/543764288519',
  },

  /** Medios de pago por país. */
  pagos: [
    { pais: 'Argentina', medio: 'Transferencia', dato: 'Alias CLUB.AJEDREZ.POSADAS' },
    { pais: 'Paraguay', medio: 'Sudameris', dato: 'Alias 3189305' },
    { pais: 'Brasil', medio: 'PIX', dato: 'Se coordina directo por WhatsApp' },
  ],

  /** Formulario e inscripción. */
  inscripcion: {
    formulario: 'https://forms.gle/8rtCRiDFQXgZyXsn7',
    reglamento: 'https://tinyurl.com/Reglamento-CAP-100',
    whatsapp: club.whatsappLink,
    whatsappTexto: '+54 9 376 432-8118',
  },

  /**
   * Seguimiento en vivo. Los tres torneos ya tienen su ficha creada en
   * Chess-Results, pero el club pidió publicarlos a partir del 1.º de
   * septiembre de 2026: hasta esa fecha la página muestra el aviso en lugar de
   * los enlaces (ver `enlacesVigentes` en la página).
   */
  chessResults: {
    desdeISO: '2026-09-01',
    aviso:
      'Las planillas de Chess-Results se publican acá a partir del 1.º de septiembre de 2026, con los pareos y las posiciones ronda por ronda.',
    enlaces: [
      {
        torneo: 'IRT Standard FIDE',
        url: 'https://s2.chess-results.com/Tnr1451594.aspx?lan=2&SNode=S0',
      },
      {
        torneo: 'Blitz IRT Vespertino',
        url: 'https://s1.chess-results.com/tnr1475167.aspx?lan=2&art=0&turdet=YES&flag=30&SNode=S0',
      },
      {
        torneo: 'Prix Infanto-Juvenil',
        url: 'https://s2.chess-results.com/tnr1475173.aspx?lan=2&art=0&turdet=YES&flag=30&SNode=S0',
      },
    ],
  },

  /** Cierre institucional: el homenaje y la cita del estatuto de 1926. */
  espiritu: {
    reconocimientos: {
      titulo: 'Reconocimientos del centenario',
      texto:
        'Durante el festival el club homenajea a sus socios vitalicios y honorarios, y a las leyendas que construyeron cien años de historia del ajedrez misionero.',
    },
    cita: 'Formar el hogar común de los ajedrecistas en una manifestación espiritual de sanos principios morales, en pro de una mejor fraternal vinculación entre todos los que practican este noble juego.',
    citaFuente: 'Estatuto social, artículo 2.º (1926)',
  },

  /** Afiche oficial de difusión. */
  afiche: {
    src: '/img/festival-afiche.webp',
    alt: 'Afiche oficial del IRT "100 Años" del Club de Ajedrez Posadas: 5, 6, 7 y 8 de diciembre de 2026 en la Sociedad Italiana',
    ancho: 900,
    alto: 1125,
  },
} as const
