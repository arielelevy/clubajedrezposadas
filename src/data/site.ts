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
  ciudad: 'Posadas',
  provincia: 'Misiones',
  pais: 'Argentina',
  whatsapp: '3764328118',
  whatsappLink: 'https://wa.me/5493764328118',
  instagram: 'clubdeajedrezposadas',
  instagramLink: 'https://www.instagram.com/clubdeajedrezposadas',
  mapsLink: 'https://www.google.com/maps/search/?api=1&query=Jujuy+1514+Posadas+Misiones',
  mapsEmbed:
    'https://www.google.com/maps?q=Jujuy%201514%2C%20Posadas%2C%20Misiones%2C%20Argentina&output=embed',
} as const

export const navegacion = [
  { label: 'El club', href: '/#el-club' },
  { label: 'Historia', href: '/historia' },
  { label: 'Talleres', href: '/#talleres' },
  { label: 'Centenario', href: '/#centenario' },
  { label: 'Auspicios', href: '/auspicios' },
  { label: 'Socios', href: '/socios' },
] as const

export const cifras = [
  { valor: '100', unidad: 'años', detalle: 'de vida institucional ininterrumpida' },
  { valor: '1926', unidad: '', detalle: 'primer club de ajedrez de Misiones' },
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

export const hitos = [
  {
    anio: '1926',
    fecha: '12 de julio',
    titulo: 'Fundación en el Palace Hotel',
    texto:
      'Un grupo de apasionados por el ajedrez funda el primer club dedicado exclusivamente al juego en Misiones. Primer presidente: don Diego Isasa.',
    pieza: 'peon',
  },
  {
    anio: '1926-1979',
    fecha: 'Cinco décadas',
    titulo: 'El club itinerante',
    texto:
      'Sin sede propia, los tableros pasan por el Palace Hotel, la Biblioteca Popular, el Hotel Savoy, la Casa Paraguaya y el Club Tokio, entre otras casas amigas.',
    pieza: 'caballo',
  },
  {
    anio: '1980',
    fecha: '14 de mayo',
    titulo: 'Sede propia en Jujuy 1514',
    texto:
      'Se inaugura la casa del club, que sigue siendo su corazón. El torneo inaugural lo gana el múltiple campeón provincial Miguel Reta.',
    pieza: 'torre',
  },
  {
    anio: '2000s',
    fecha: 'Nuevo milenio',
    titulo: 'Renovación y crecimiento',
    texto:
      'Reafiliación a la Federación Argentina de Ajedrez, torneos con validez para el ranking nacional e internacional, capacitación docente y escuelas de iniciación.',
    pieza: 'alfil',
  },
  {
    anio: '2026',
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
 * Niveles de auspicio de la carpeta institucional 2026.
 * Los montos y el detalle completo de beneficios están en el PDF oficial
 * (public/docs/carpeta-auspicios-2026.pdf), no se replican acá.
 */
export const nivelesAuspicio = [
  {
    nivel: 'Rey Platino',
    rol: 'Sponsor presentador',
    disponibilidad: '1 espacio disponible',
    pieza: 'rey',
    destacado: true,
    beneficios: [
      'Marca presentadora del centenario en toda la comunicación',
      'Máxima jerarquía en gráficas, sede y torneos',
      'Presencia en actos protocolares del centenario',
    ],
  },
  {
    nivel: 'Rey Oro',
    rol: 'Sponsor principal',
    disponibilidad: '2 espacios disponibles',
    pieza: 'rey',
    destacado: true,
    beneficios: [
      'Logo principal en torneos y material institucional',
      'Presencia en redes y prensa del club',
      'Espacio propio en la sede de Jujuy 1514',
    ],
  },
  {
    nivel: 'Caballo',
    rol: 'Auspiciante',
    disponibilidad: 'Cupos disponibles',
    pieza: 'caballo',
    destacado: false,
    beneficios: ['Logo en gráficas de torneos', 'Menciones en redes sociales', 'Presencia en la sede'],
  },
  {
    nivel: 'Alfil',
    rol: 'Auspiciante',
    disponibilidad: 'Cupos disponibles',
    pieza: 'alfil',
    destacado: false,
    beneficios: ['Logo en gráficas seleccionadas', 'Menciones en redes sociales'],
  },
  {
    nivel: 'Torre',
    rol: 'Colaborador',
    disponibilidad: 'Cupos disponibles',
    pieza: 'torre',
    destacado: false,
    beneficios: ['Mención como colaborador del centenario', 'Presencia en la sede'],
  },
  {
    nivel: 'Dama',
    rol: 'Colaborador',
    disponibilidad: 'Cupos disponibles',
    pieza: 'dama',
    destacado: false,
    beneficios: ['Mención como colaborador del centenario'],
  },
] as const

export const pasosSocio = [
  {
    paso: '01',
    titulo: 'Escribinos',
    texto: `Mandá un WhatsApp al ${club.whatsapp} contándonos si es para vos, para un hijo o para toda la familia.`,
  },
  {
    paso: '02',
    titulo: 'Completá la solicitud',
    texto: 'Descargá el formulario de alta de socio, completalo y traelo a la sede o envialo por WhatsApp.',
  },
  {
    paso: '03',
    titulo: 'Vení a jugar',
    texto: 'Te esperamos en Jujuy 1514 en cualquiera de los horarios de taller para tu primera partida.',
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
      'Escribinos por WhatsApp, descargá la solicitud de alta de socio desde la sección Socios y acercate a la sede de Jujuy 1514.',
  },
] as const
