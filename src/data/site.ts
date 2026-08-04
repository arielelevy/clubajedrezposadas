/**
 * Contenido institucional del sitio.
 * Todo el texto y los datos provienen del material oficial del club
 * (reseña histórica del centenario, gráficas de talleres y carpeta de auspicios 2026).
 */

export const club = {
  nombre: 'Club de Ajedrez Posadas',
  siglas: 'CAP',
  lema: 'Ajedrez, comunidad y futuro',
  fundacion: '12 de julio de 1926',
  anioFundacion: 1926,
  anioCentenario: 2026,
  personeriaJuridica: 'N° A-135',
  direccion: 'Jujuy 1514',
  codigoPostal: '3300',
  ciudad: 'Posadas',
  provincia: 'Misiones',
  pais: 'Argentina',
  whatsapp: '3764328118',
  whatsappLink: 'https://wa.me/5493764328118',
  instagram: 'clubdeajedrezposadas',
  instagramLink: 'https://www.instagram.com/clubdeajedrezposadas',
  facebook: 'clubdeajedrezposadas',
  facebookLink: 'https://www.facebook.com/CLUBDEAJEDREZPOSADAS/',
  x: 'ajedrez_posadas',
  xLink: 'https://x.com/ajedrez_posadas',
  mapsLink:
    'https://www.google.com/maps/search/?api=1&query=Jujuy+1514%2C+3300+Posadas%2C+Misiones%2C+Argentina',
  mapsEmbed:
    'https://www.google.com/maps?q=Jujuy%201514%2C%203300%20Posadas%2C%20Misiones%2C%20Argentina&output=embed',
  /** Formularios oficiales de Google (links públicos de respuesta). */
  formularioSocios: 'https://forms.gle/bajZCJdf8p4m6HQG9',
  formularioProyectos: 'https://forms.gle/H8agD4kkmauwwKze7',
} as const

export const navegacion = [
  { label: 'El club', href: '/#el-club' },
  { label: 'Historia', href: '/historia' },
  { label: 'Centenario', href: '/#evento' },
  { label: 'Talleres', href: '/#talleres' },
  { label: 'Partidas', href: '/#partidas' },
  { label: 'Galería', href: '/#galeria' },
  { label: 'Auspicios', href: '/auspicios' },
  { label: 'Socios', href: '/socios' },
] as const

/**
 * Evento central del centenario (datos de la carpeta institucional 2026).
 * Con `publicado: false` la sección y el aviso superior dejan de mostrarse.
 */
export const eventoCentenario = {
  publicado: true,
  sigla: 'IRT',
  nombre: 'IRT "100 Años"',
  subtitulo: 'International Rating Tournament',
  bajada: 'El torneo principal del festejo de los 100 años del Club de Ajedrez Posadas',
  fechaTexto: '5, 6, 7 y 8 de diciembre de 2026',
  fechaISO: '2026-12-05',
  /** Fecha partida para el bloque tipográfico del afiche. */
  diaDesde: '05',
  diaHasta: '08',
  mesCorto: 'Dic',
  anio: '2026',
  lugar: 'Sociedad Italiana de Socorros Mutuos, Posadas',
  /** Ficha rápida del torneo, para la columna de datos del afiche. */
  ficha: [
    { rotulo: 'Sede', valor: 'Sociedad Italiana, Posadas' },
    { rotulo: 'Cupo', valor: 'Hasta 140 jugadores' },
    { rotulo: 'Formato', valor: 'Torneo abierto, todas las categorías' },
    { rotulo: 'Ranking', valor: 'Homologado, con árbitros capacitados' },
    { rotulo: 'Premios', valor: 'En efectivo y trofeos' },
  ],
  descripcion:
    'Una edición especial que busca consolidarse como uno de los eventos ajedrecísticos más importantes de la región, con proyección nacional e internacional. Al ser un torneo abierto participan jugadores de todas las edades y categorías, junto a profesionales titulados nacionales e internacionales.',
  descripcion2:
    'En el marco de su centenario, el club proyecta este evento como un punto de encuentro intergeneracional que combina competencia, formación y desarrollo, posicionando a Posadas como sede de eventos ajedrecísticos de relevancia.',
  caracteristicas: [
    'Jugadores locales, regionales, nacionales e internacionales',
    'Presencia de jugadores profesionales titulados',
    'Árbitros capacitados y homologación para ranking oficial',
    'Premiación en efectivo y trofeos',
    'Cobertura en redes sociales y medios digitales',
  ],
  ctaTexto: 'Consultar por la inscripción',
  avisoSuperior: 'IRT "100 Años" · 5 al 8 de diciembre de 2026 · Posadas',
} as const

/**
 * Contexto de antigüedad: el club es anterior a la propia federación argentina
 * y casi contemporáneo de la FIDE. Dicho así, en tres fechas, se entiende solo.
 */
export const contextoAntiguedad = {
  titulo: 'Más viejo que su propia federación',
  texto:
    'El Club de Ajedrez Posadas se fundó veintidós años antes que la Federación Argentina de Ajedrez, y apenas dos años después de que naciera la Federación Internacional.',
  fechas: [
    { anio: '1924', que: 'Nace la FIDE', propio: false },
    { anio: '1926', que: 'Se funda el club', propio: true },
    { anio: '1948', que: 'Se constituye la FADA', propio: false },
  ],
} as const

export const cifras = [
  { valor: '100', unidad: 'años', detalle: 'de vida institucional ininterrumpida' },
  {
    valor: '1926',
    unidad: '',
    detalle: 'primer club de ajedrez de Misiones y tercero más antiguo del país',
  },
  { valor: '1980', unidad: '', detalle: 'sede propia en Jujuy 1514' },
  { valor: '6', unidad: 'días', detalle: 'de talleres y clases por semana' },
] as const

/** Reseña histórica oficial del centenario (texto institucional del club). */
export const historia = {
  titulo: 'Reseña histórica',
  bajada:
    'Hablar del Club de Ajedrez Posadas es hablar de una parte de la historia de nuestra ciudad y del deporte misionero.',
  parrafos: [
    'El 12 de julio de 1926, un grupo de hombres apasionados por el ajedrez decidió fundar una institución que trascendería generaciones. Aquella reunión, realizada en el histórico Palace Hotel de Posadas, dio origen al primer club dedicado exclusivamente al ajedrez en la provincia de Misiones. Su primer presidente fue don Diego Isasa, acompañado por una comisión integrada, entre otros, por Lorenzo Casanova, Eduardo Gaury, Juan Morales, Carlos Pedernera y León Naboulet.',
    'En aquellos primeros años el club no tenía sede propia. Como tantas instituciones nacientes, fue creciendo gracias al esfuerzo y la voluntad de sus socios. Sus tableros y piezas encontraron distintos hogares: primero el Palace Hotel, luego la Biblioteca Popular, el Hotel Savoy —"Patrimonio Histórico, Cultural y Arquitectónico"—, más tarde la Casa Paraguaya, el Club Tokio, entre tantas otras locaciones que ayudaron a este club, hasta ese entonces itinerante. Hasta que finalmente el sueño de contar con una casa propia comenzó a hacerse realidad.',
    'Ese sueño se concretó el 14 de mayo de 1980, cuando quedó inaugurada la sede de la calle Jujuy 1514, la misma que continúa siendo el corazón del club. La apertura fue celebrada como mejor sabe hacerlo un ajedrecista: jugando. El torneo inaugural fue conquistado por el múltiple campeón provincial Miguel Reta, acompañado por destacados jugadores de la época como Cembrano y Albornoz.',
    'Tener una sede propia fue mucho más que disponer de un edificio. Significó asegurar un lugar de encuentro para generaciones enteras de ajedrecistas. Aún hoy, el Club de Ajedrez Posadas es una de las pocas instituciones ajedrecísticas del país que posee un inmueble propio, un patrimonio construido con el esfuerzo y la visión de quienes soñaron en grande.',
    'Durante estos cien años, el club atravesó distintas etapas. Hubo épocas de intensa actividad y otras en las que sostener abiertas sus puertas fue un verdadero desafío. Sin embargo, nunca dejó de existir. Siempre hubo dirigentes, socios y colaboradores que entendieron que preservar esta institución significaba preservar una parte del patrimonio deportivo y cultural de Misiones.',
    'A comienzos del nuevo milenio comenzó una etapa de renovación y crecimiento. Afiliado nuevamente a la Federación Argentina de Ajedrez, el club impulsó la organización de torneos con validez para el ranking nacional e internacional, capacitaciones para docentes, escuelas de iniciación y actividades abiertas para toda la comunidad. Gracias a ese trabajo sostenido, el Club de Ajedrez Posadas se consolidó como uno de los principales referentes del ajedrez del nordeste argentino y como un espacio de formación para cientos de niños, jóvenes y adultos.',
    'Pero la verdadera historia del club no se mide solamente por los torneos disputados o los títulos obtenidos. Se escribe con los nombres de quienes dedicaron horas de trabajo desinteresado para abrir sus puertas cada semana; con los profesores que enseñaron a mover las primeras piezas; con los jugadores que representaron con orgullo a Posadas y a Misiones; con las familias que acompañaron a sus hijos; con los socios que sostuvieron la institución en los momentos más difíciles; y con cada persona que encontró en este lugar un espacio de amistad, aprendizaje y encuentro.',
    'Cien años durante los cuales el ajedrez fue mucho más que un juego: fue una herramienta para educar, para formar valores y para construir comunidad. Mirar hacia atrás nos llena de orgullo. Mirar hacia adelante nos compromete aún más.',
  ],
  cierre: [
    'Que este centenario sea un homenaje a quienes hicieron posible esta historia y, al mismo tiempo, el punto de partida para seguir escribiendo las próximas páginas del Club de Ajedrez Posadas.',
    'Porque las instituciones centenarias no pertenecen solamente a quienes las integran: pertenecen a toda la comunidad. Y el Club de Ajedrez Posadas, después de cien años, es parte del patrimonio deportivo, cultural e histórico de nuestra ciudad y de nuestra provincia.',
  ],
} as const

/**
 * Primera comisión directiva, según el Acta N° 1 del 12 de julio de 1926.
 *
 * Para los nombres que también aparecen en la reseña institucional se usa la
 * grafía de la reseña, que es la del club. Los cuatro cargos que solo figuran en
 * el acta van marcados con `aConfirmar`: se leyeron de la cursiva original y
 * están a la espera de que el club los verifique contra el libro de actas.
 */
export const comisionFundadora = {
  titulo: 'La primera comisión directiva',
  bajada:
    'Los diez cargos que quedaron asentados en el Acta N.º 1, firmada en el Palace Hotel a las cinco de la tarde del 12 de julio de 1926.',
  nota: 'Los cargos marcados con asterisco figuran solo en el acta y su grafía está pendiente de confirmación.',
  cargos: [
    { cargo: 'Presidente', nombre: 'Diego Isasa', aConfirmar: false },
    { cargo: 'Secretario', nombre: 'Lorenzo Casanova', aConfirmar: false },
    { cargo: 'Tesorero', nombre: 'Eduardo Gaury', aConfirmar: false },
    { cargo: 'Vocal 1.º', nombre: 'Enrique Sanchís', aConfirmar: true },
    { cargo: 'Vocal 2.º', nombre: 'Juan Morales', aConfirmar: false },
    { cargo: 'Vocal 3.º', nombre: 'León R. Naboulet', aConfirmar: false },
    { cargo: 'Vocal 4.º', nombre: 'H. L. de Tejada', aConfirmar: true },
    { cargo: 'Suplente 1.º', nombre: 'Carlos Pedernera', aConfirmar: false },
    { cargo: 'Suplente 2.º', nombre: 'Duarte Sosa', aConfirmar: false },
    { cargo: 'Suplente 3.º', nombre: 'Ladislao Zaragoza', aConfirmar: true },
  ],
} as const

/**
 * Hitos del siglo. `desde`/`hasta` ubican cada hito en el tablero de los cien
 * años del home (un casillero por año, 1926–2025); el hito de 2026 queda fuera
 * del tablero porque es el año que se está jugando.
 */
export const hitos = [
  {
    anio: '1926',
    desde: 1926,
    hasta: 1926,
    fecha: '12 de julio',
    titulo: 'Fundación en el Palace Hotel',
    texto:
      'Un grupo de apasionados por el ajedrez funda el primer club dedicado exclusivamente al juego en Misiones. Primer presidente: don Diego Isasa.',
    pieza: 'peon',
  },
  {
    anio: '1926-1979',
    desde: 1927,
    hasta: 1979,
    fecha: 'Cinco décadas',
    titulo: 'El club itinerante',
    texto:
      'Sin sede propia, los tableros pasan por el Palace Hotel, la Biblioteca Popular, el Hotel Savoy, la Casa Paraguaya y el Club Tokio, entre otras casas amigas.',
    pieza: 'caballo',
  },
  {
    anio: '1980',
    desde: 1980,
    hasta: 1980,
    fecha: '14 de mayo',
    titulo: 'Sede propia en Jujuy 1514',
    texto:
      'Se inaugura la casa del club, que sigue siendo su corazón. El torneo inaugural lo gana el múltiple campeón provincial Miguel Reta.',
    pieza: 'torre',
  },
  {
    anio: '2000',
    desde: 2000,
    hasta: 2003,
    fecha: 'Nuevo milenio',
    titulo: 'Los primeros torneos internacionales',
    texto:
      'Reafiliado a la Federación Argentina de Ajedrez, el club empieza a organizar torneos IRT, con validez para el ranking internacional. Hasta 2010 fue el único club activo de la provincia que los organizaba.',
    pieza: 'alfil',
  },
  {
    anio: '2004-2020',
    desde: 2004,
    hasta: 2020,
    fecha: 'Dos décadas',
    titulo: 'De dos jugadores con ELO a cuarenta',
    texto:
      'En 2004 el club tenía solo dos jugadores con ranking internacional. En 2012 ya eran veinticinco, y para 2020 alrededor de cuarenta: la medida más concreta del trabajo sostenido en los talleres.',
    pieza: 'dama',
  },
  {
    anio: '2026',
    desde: 2026,
    hasta: 2026,
    fecha: '12 de julio',
    titulo: 'Centenario',
    texto:
      'Cien años ininterrumpidos. Una de las pocas instituciones ajedrecísticas del país con inmueble propio celebra su siglo de vida junto a toda la comunidad.',
    pieza: 'rey',
  },
] as const

/** Horario semanal completo (gráfica oficial "Horario semanal · Talleres de ajedrez"). */
export const horarioSemanal = [
  {
    dia: 'Lunes',
    abrev: 'LUN',
    turnos: [
      { horario: '17:30 a 20:00', instructor: 'Pablo Paz', grupo: 'Talleres' },
      { horario: '20:00 a 21:30', instructor: 'ACM Cristian Owczarczyn', grupo: 'Adultos · Principiantes' },
    ],
  },
  {
    dia: 'Martes',
    abrev: 'MAR',
    turnos: [
      { horario: '17:00 a 20:00', instructor: 'Inst. Nac. Damián Moore', grupo: 'Talleres' },
      { horario: '20:00 a 21:30', instructor: 'Inst. Nac. Damián Moore', grupo: 'Adultos · Principiantes' },
    ],
  },
  {
    dia: 'Miércoles',
    abrev: 'MIÉ',
    turnos: [{ horario: '17:30 a 20:00', instructor: 'Pablo Paz', grupo: 'Talleres' }],
  },
  {
    dia: 'Jueves',
    abrev: 'JUE',
    turnos: [
      { horario: '17:00 a 20:00', instructor: 'Inst. Nac. Damián Moore', grupo: 'Talleres' },
      { horario: '20:00 a 21:30', instructor: 'ACM Cristian Owczarczyn', grupo: 'Adultos · Intermedio' },
    ],
  },
  {
    dia: 'Viernes',
    abrev: 'VIE',
    turnos: [{ horario: '17:00 a 20:00', instructor: 'Santiago Coronel', grupo: 'Talleres' }],
  },
  {
    dia: 'Sábado',
    abrev: 'SÁB',
    turnos: [{ horario: '09:00 a 11:30', instructor: 'Franco Medina', grupo: 'Talleres' }],
  },
] as const

export const programas = [
  {
    id: 'infantil',
    titulo: 'Taller infantil y juvenil',
    resumen:
      'Iniciación y perfeccionamiento para chicos y chicas. Se aprende jugando: aperturas, táctica, finales y torneos internos.',
    detalle: [
      'Lunes a viernes de 17:00 a 20:00 hs',
      'Sábados de 09:00 a 11:30 hs',
      'No hace falta saber jugar para empezar',
    ],
    imagen: '/img/talleres-infantil.webp',
    imagenAlt: 'Gráfica oficial del taller de ajedrez infantil del Club de Ajedrez Posadas',
  },
  {
    id: 'adultos',
    titulo: 'Clases para adultos',
    resumen:
      'Dos niveles con instructores titulados: principiantes que arrancan de cero e intermedios que quieren competir.',
    detalle: [
      'Lunes 20:00 a 21:30 · Principiantes · ACM Cristian Owczarczyn',
      'Martes 20:00 a 21:30 · Principiantes · Inst. Nac. Damián Moore',
      'Jueves 20:00 a 21:30 · Intermedio · ACM Cristian Owczarczyn',
    ],
    imagen: '/img/clases-adultos.webp',
    imagenAlt: 'Gráfica oficial de las clases de ajedrez para adultos del Club de Ajedrez Posadas',
  },
  {
    id: 'competencia',
    titulo: 'Torneos y competencia',
    resumen:
      'Torneos con validez para el ranking nacional e internacional, además de rápidos, blitz e internos del club durante todo el año.',
    detalle: [
      'Afiliado a la Federación Argentina de Ajedrez',
      'Torneos válidos para ranking FADA y FIDE',
      'Representación de Posadas y Misiones en el NEA',
    ],
    imagen: '/img/talleres-horarios.webp',
    imagenAlt: 'Gráfica oficial con el horario semanal de talleres del Club de Ajedrez Posadas',
  },
] as const

export const pilaresCentenario = [
  {
    titulo: 'Ajedrez',
    texto:
      'Formación deportiva de niveles: iniciación, perfeccionamiento y competencia con validez para el ranking nacional e internacional.',
  },
  {
    titulo: 'Comunidad',
    texto:
      'Talleres abiertos, capacitación para docentes y actividades en escuelas: el ajedrez como herramienta educativa para toda la ciudad.',
  },
  {
    titulo: 'Futuro',
    texto:
      'Puesta en valor de la sede propia de Jujuy 1514 y del archivo histórico del club, para que el próximo siglo empiece bien plantado.',
  },
] as const

/**
 * Niveles de auspicio de la carpeta institucional 2026 ("Elegí tu jugada").
 * Montos y beneficios según el PDF oficial: public/docs/carpeta-auspicios-2026.pdf
 */
export const nivelesAuspicio = [
  {
    nivel: 'Rey Platino',
    rol: 'Sponsor presentador',
    aporte: 'Más de $1.500.000',
    disponibilidad: '1 disponible',
    pieza: 'rey',
    destacado: true,
    exclusivo: 'Beneficio exclusivo: nombre del torneo',
    beneficios: [
      'Logo predominante en toda la identidad gráfica',
      'Logo en trofeos, medallas y cartelería',
      'Logo en fondo de entrevistas',
      'Apertura oficial junto a autoridades (si lo desea)',
      'Mención obligatoria en toda comunicación oficial',
      'Prioridad absoluta en acciones comerciales y stand premium',
    ],
  },
  {
    nivel: 'Rey Oro',
    rol: 'Sponsor principal',
    aporte: 'Más de $1.500.000',
    disponibilidad: '2 disponibles',
    pieza: 'rey',
    destacado: true,
    exclusivo: '',
    beneficios: [
      'Logo de igual tamaño al sponsor presentador (excepto en el nombre del torneo)',
      'Logo en banners y frente principal',
      'Presencia en la entrega de premios',
      'Espacio para exhibición y material promocional',
      'Inclusión en todas las publicaciones oficiales',
      'Stand premium (si lo desea)',
    ],
  },
  {
    nivel: 'Caballo',
    rol: 'Auspiciante',
    aporte: '$751.000 a $1.500.000',
    disponibilidad: 'Cupos disponibles',
    pieza: 'caballo',
    destacado: false,
    exclusivo: '',
    beneficios: [
      'Logo destacado en toda la gráfica oficial',
      'Banner exclusivo en zona principal',
      'Stand o espacio institucional en el torneo',
      'Merchandising o regalos para jugadores',
      'Logo en reconocimientos y materiales de los 100 años',
      'Prioridad para futuras acciones institucionales del club',
    ],
  },
  {
    nivel: 'Alfil',
    rol: 'Auspiciante',
    aporte: '$400.001 a $750.000',
    disponibilidad: 'Cupos disponibles',
    pieza: 'alfil',
    destacado: false,
    exclusivo: '',
    beneficios: [
      'Logo en planillas oficiales de anotación',
      'Logo en credenciales de jugadores, árbitros y organización',
      'Banner corporativo en el salón de juego',
      'Logo en el backdrop de fotografías institucionales',
      'Entrega de premios junto a autoridades (si lo desea)',
    ],
  },
  {
    nivel: 'Torre',
    rol: 'Colaborador',
    aporte: '$200.001 a $400.000',
    disponibilidad: 'Cupos disponibles',
    pieza: 'torre',
    destacado: false,
    exclusivo: '',
    beneficios: [
      'Logo en afiches digitales y publicaciones oficiales',
      'Material promocional de la empresa en el espacio del torneo',
      'Logo en los diplomas de reconocimiento a históricos',
      'Mención durante la ceremonia de apertura y cierre',
    ],
  },
  {
    nivel: 'Dama',
    rol: 'Colaborador',
    aporte: 'Aportes hasta $200.000',
    disponibilidad: 'Cupos disponibles',
    pieza: 'dama',
    destacado: false,
    exclusivo: '',
    beneficios: [
      'Logo en la web de inscripciones y reglamento',
      'Mención en redes sociales como sponsor',
      'Logo en el banner institucional de sponsors',
      'Certificado de auspiciante oficial',
      'Derecho a usar la imagen del evento en sus comunicaciones',
    ],
  },
] as const

/** Cada nivel incluye los beneficios de los niveles anteriores. */
export const notaAuspicios =
  'Cada nivel incluye los beneficios de los niveles anteriores. El aporte puede ser económico o en productos, y los festejos del centenario se extienden hasta julio de 2027, con hasta 12 meses de exposición de marca.'

/** Marcas e instituciones que ya acompañan el centenario. */
export const auspiciantesActuales = [
  'Juan Carlos Silva',
  'Sociedad Italiana de Socorros Mutuos',
  'Club Itapúa',
] as const

/** Propuesta de valor para auspiciantes (carpeta 2026). */
export const propuestaValor = [
  { titulo: 'Material gráfico', texto: 'Planillas de anotación, folletos, itinerarios, bonos de premiación y certificados.' },
  { titulo: 'Redes sociales', texto: 'Instagram (feed, stories y ads), Facebook y Threads.' },
  { titulo: 'Tableros y salas de juego', texto: 'Banderas, banners y publicidad general provista por los aportantes.' },
  { titulo: 'Indumentaria oficial', texto: 'Remeras institucionales del club.' },
  { titulo: 'Prensa en actos oficiales', texto: 'Menciones en actos y premiaciones durante todo el año.' },
  { titulo: 'Actividad de RSE', texto: 'Inclusión social y programas de becas.' },
  { titulo: 'Publicidad en el club', texto: 'Paredes disponibles para publicidad directa en la sede, con presencia constante.' },
  { titulo: 'Entradas y experiencias', texto: 'Partidas con titulados, accesos gratuitos al torneo y brindis de celebración.' },
] as const

/** Programa de Ajedrez Infantil del centenario. */
export const programaInfantil = {
  titulo: 'Programa de Ajedrez Infantil',
  bajada:
    'No es un evento aislado: es una propuesta sostenida durante todo el año, con lo formativo, lo recreativo y lo competitivo integrados.',
  objetivos: [
    'Estimular el pensamiento lógico y estratégico',
    'Desarrollar la concentración y la toma de decisiones',
    'Fomentar el respeto, la paciencia y el juego limpio',
    'Promover la inclusión y la participación social',
    'Representar al club en competencias regionales y provinciales',
  ],
  actividades: [
    'Torneos infantiles internos',
    'Torneos abiertos a la comunidad',
    'Encuentros recreativos y formativos',
    'Jornadas de ajedrez en plazas y espacios públicos',
    'Participación en torneos oficiales',
    'Acciones de difusión y promoción del ajedrez',
  ],
} as const

export const pasosSocio = [
  {
    paso: '01',
    titulo: 'Escribinos',
    texto: `Mandá un WhatsApp al ${club.whatsapp} contándonos si es para vos, para un hijo o para toda la familia.`,
    enlace: { texto: `Escribir al ${club.whatsapp}`, href: club.whatsappLink },
  },
  {
    paso: '02',
    titulo: 'Completá la solicitud',
    texto:
      'Llená el formulario de alta online, desde el celular y en dos minutos. Si preferís papel, también podés descargar el PDF y traerlo a la sede.',
    enlace: { texto: 'Abrir el formulario de alta', href: club.formularioSocios },
  },
  {
    paso: '03',
    titulo: 'Vení a jugar',
    texto: 'Te esperamos en Jujuy 1514 en cualquiera de los horarios de taller para tu primera partida.',
    enlace: { texto: 'Ver cómo llegar', href: club.mapsLink },
  },
] as const

export const faq = [
  {
    pregunta: '¿Hace falta saber jugar para empezar?',
    respuesta:
      'No. Los talleres arrancan desde cero, tanto para chicos como para adultos: se aprende a mover las piezas en la primera clase.',
  },
  {
    pregunta: '¿Desde qué edad se puede participar?',
    respuesta:
      'El taller infantil recibe chicos y chicas en edad escolar, y las clases para adultos no tienen límite de edad. Si tenés dudas con un caso puntual, escribinos por WhatsApp.',
  },
  {
    pregunta: '¿Hay que llevar tablero o piezas?',
    respuesta: 'No: el club cuenta con tableros, piezas y relojes para las clases y los torneos.',
  },
  {
    pregunta: '¿Los torneos son solo para socios?',
    respuesta:
      'El club organiza torneos internos y también abiertos a la comunidad, con validez para el ranking nacional e internacional. Cada convocatoria aclara las condiciones de participación.',
  },
  {
    pregunta: '¿Cómo me asocio?',
    respuesta:
      'Completá el formulario de alta online desde la sección Socios y acercate a la sede de Jujuy 1514. Si preferís hacerlo en papel, la solicitud también está en PDF, y por WhatsApp te resolvemos cualquier duda.',
  },
  {
    pregunta: '¿Puedo proponer una actividad o un proyecto en el club?',
    respuesta:
      'Sí. El club recibe propuestas de socios, docentes, instituciones y vecinos: talleres, torneos, jornadas en escuelas y plazas, acciones culturales. Hay un formulario para presentarlas y la comisión directiva las evalúa.',
  },
] as const

/**
 * Convocatoria abierta a presentar proyectos en el club.
 * El formulario es el de Google: club.formularioProyectos.
 */
export const proyectos = {
  kicker: 'Convocatoria abierta',
  titulo: 'Presentá tu proyecto en el club',
  bajada:
    'La sede de Jujuy 1514 no es solo un salón de juego: es un espacio disponible para la comunidad. Si tenés una idea que suma al ajedrez posadeño, queremos escucharla.',
  ejemplos: [
    'Talleres, cursos y capacitaciones',
    'Torneos y encuentros recreativos',
    'Jornadas de ajedrez en escuelas, plazas y barrios',
    'Actividades culturales y de inclusión social',
    'Proyectos de archivo, difusión y comunicación',
  ],
  nota: 'Las propuestas las evalúa la comisión directiva. No hace falta ser socio para presentar una.',
  cta: 'Presentar un proyecto',
} as const
