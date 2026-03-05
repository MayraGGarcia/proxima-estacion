// seedUsuarios.js
// ============================================================
// Usuarios demo precargados para Próxima Estación
// ------------------------------------------------------------
// MAQUINISTA_CAMUS    (Martín)  — demo1234 — Estudiante de Filosofía
// LECTORA_DEL_TIEMPO  (Elena)   — demo1234 — Curadora Histórica
// PASAJERO_ERRANTE    (Julián)  — demo1234 — Explorador de Rutas
// ============================================================

const db = require('./db');

// ─────────────────────────────────────────────
// USUARIOS
// ─────────────────────────────────────────────
const USUARIOS = [
  { maquinista: 'MAQUINISTA_CAMUS',    password: 'demo1234' },
  { maquinista: 'LECTORA_DEL_TIEMPO',  password: 'demo1234' },
  { maquinista: 'PASAJERO_ERRANTE',    password: 'demo1234' },
];

// ─────────────────────────────────────────────
// RUTAS PROPIAS DE MARTÍN
// ─────────────────────────────────────────────
const RUTAS_MARTIN = [
  {
    nombre: 'Existencialismo en Orden de Combate',
    metodo: 'Kilometraje', esPublica: true,
    justificacion: 'De textos breves a densos: Camus como introducción, Sartre como desarrollo, Nietzsche como conclusión radical.',
    pasajeros: 3,
    estaciones: [
      { titulo: 'El mito de Sísifo',    autor: 'Albert Camus',        paginas: 159, anio: 1942, portada: 'https://covers.openlibrary.org/b/id/8224161-M.jpg' },
      { titulo: 'El ser y la nada',     autor: 'Jean-Paul Sartre',    paginas: 251, anio: 1943, portada: 'https://covers.openlibrary.org/b/id/8406116-M.jpg' },
      { titulo: 'Así habló Zaratustra', autor: 'Friedrich Nietzsche', paginas: 352, anio: 1883, portada: 'https://covers.openlibrary.org/b/id/8739208-M.jpg' },
    ],
    bitacoras: [
      { texto: 'Camus arranca preguntando por qué no nos suicidamos si la vida no tiene sentido, y termina diciendo que Sísifo es feliz. La respuesta al absurdo no es la evasión ni la negación: es la rebelión. Empezar por acá fue la decisión correcta, es el manifiesto que le da marco a todo lo que viene.' },
      { texto: 'La existencia precede a la esencia. Sartre dice que no tenemos una naturaleza previa que defina lo que somos: nos construimos con cada elección. Eso suena liberador hasta que te das cuenta de que significa que somos completamente responsables de todo lo que somos. La libertad como condena.' },
      { texto: 'El punto de llegada perfecto. Después de Camus y Sartre, Nietzsche cierra el ciclo con la única salida que propone: crear tus propios valores. El superhombre no es un ideal de fuerza, es alguien que deja de buscar sentido afuera y empieza a construirlo. El eterno retorno como prueba definitiva: ¿vivirías esta vida infinitas veces?' },
    ],
    reporteFinal: 'Leer los tres en orden de páginas fue exactamente lo que necesitaba. Camus como introducción al problema, Sartre como desarrollo filosófico, Nietzsche como conclusión radical. Juntos forman una conversación sobre la misma pregunta: qué hacemos con una existencia sin fundamento previo. Cada uno tiene una respuesta distinta y las tres juntas son más completas que cualquiera por separado.',
  },
  {
    nombre: 'Las Raíces del Pensamiento Moderno',
    metodo: 'Kilometraje', esPublica: true,
    justificacion: 'Del estoicismo al racionalismo y al idealismo crítico, en orden de páginas para construir el andamiaje progresivamente.',
    pasajeros: 2,
    estaciones: [
      { titulo: 'Meditaciones',             autor: 'Marco Aurelio',  paginas: 176, anio: 170,  portada: 'https://covers.openlibrary.org/b/id/8406786-M.jpg' },
      { titulo: 'Discurso del método',      autor: 'René Descartes', paginas: 190, anio: 1637, portada: 'https://covers.openlibrary.org/b/id/8739161-M.jpg' },
      { titulo: 'Crítica de la razón pura', autor: 'Immanuel Kant',  paginas: 856, anio: 1781, portada: 'https://covers.openlibrary.org/b/id/8228105-M.jpg' },
    ],
    bitacoras: [
      { texto: 'Empezar por el estoicismo fue acertado. Marco Aurelio escribió esto como diario personal, sin intención de publicarlo, y eso se nota: no hay poses. La idea central es que no controlamos lo que pasa, solo controlamos cómo respondemos. Una filosofía de acción antes de que existiera esa palabra.' },
      { texto: 'El momento en que la filosofía deja de preguntarle a la tradición y empieza a preguntarle a la razón propia. Pienso, luego existo es el punto cero desde donde Descartes reconstruye todo el conocimiento. Leerlo después de los estoicos muestra el salto enorme que fue pasar de la ética a la epistemología como problema central.' },
      { texto: 'El jefe final. Kant intenta resolver la guerra entre los racionalistas como Descartes y los empiristas como Hume preguntando qué condiciones hacen posible el conocimiento. Es difícil, es denso, y requirió releerlo por partes. Pero entender la distinción entre fenómeno y noúmeno cambió completamente cómo pienso la relación entre realidad y percepción.' },
    ],
    reporteFinal: 'Esta ruta me llevó tres meses completos. El criterio de páginas funcionó perfecto: empezar con el texto más corto y accesible de Marco Aurelio me preparó para el rigor de Descartes, y Descartes me dio las herramientas para enfrentar a Kant. Nunca hubiera podido leer la Crítica sin ese recorrido previo. El orden importa tanto como los libros.',
  },
];

// ─────────────────────────────────────────────
// RUTAS PROPIAS DE ELENA
// ─────────────────────────────────────────────
const RUTAS_ELENA = [
  {
    nombre: 'La Gran Novela Histórica: De Scott a Umberto Eco',
    metodo: 'Cronología', esPublica: true,
    justificacion: 'Cada época reescribe la historia a su propia imagen. En cronología se ve cómo el género evolucionó del romanticismo a la posmodernidad.',
    pasajeros: 3,
    estaciones: [
      { titulo: 'Ivanhoe',              autor: 'Walter Scott',  paginas: 519,  anio: 1820, portada: 'https://covers.openlibrary.org/b/id/8457978-M.jpg' },
      { titulo: 'Guerra y paz',         autor: 'León Tolstói',  paginas: 1225, anio: 1869, portada: 'https://covers.openlibrary.org/b/id/8231459-M.jpg' },
      { titulo: 'El nombre de la rosa', autor: 'Umberto Eco',   paginas: 502,  anio: 1980, portada: 'https://covers.openlibrary.org/b/id/8775558-M.jpg' },
    ],
    bitacoras: [
      { texto: 'El texto fundador del género tal como lo conocemos. Scott inventa la fórmula: personaje ficticio en un contexto histórico documentado, conflicto que refleja tensiones de época, y un héroe que navega entre dos mundos. La Inglaterra medieval de Ricardo Corazón de León como escenario no es decorado: es el argumento.' },
      { texto: 'Tolstói lleva la novela histórica a su máxima expresión. Napoleón aparece como personaje pero lo más moderno del libro es su tesis histórica: la historia no la hacen los grandes hombres sino las fuerzas colectivas anónimas. Natasha, Andrei y Pierre son más reales que cualquier personaje de ficción que leí porque Tolstói no los simplifica.' },
      { texto: 'El cierre perfecto de esta ruta. Eco usa la estructura del policial dentro de la novela histórica medieval para hablar de la relación entre conocimiento y poder. Lo que empezó con Scott como aventura romántica termina con Eco como reflexión filosófica sobre la verdad y la censura. El género se pliega sobre sí mismo.' },
    ],
    reporteFinal: 'Armar esta ruta en orden cronológico me permitió ver algo que no era evidente: cada época reescribe la historia a su propia imagen. Scott escribe para el romanticismo, Tolstói para el realismo, Eco para la posmodernidad. Los tres usan el pasado como espejo del presente de cada autor. La novela histórica no es escapismo: es la forma más indirecta de hablar del aquí y ahora.',
  },
  {
    nombre: 'Voces Femeninas en la Historia',
    metodo: 'Cronología', esPublica: true,
    justificacion: 'De objeto del relato a protagonista con conciencia histórica: un proceso de emancipación narrativa entre 1813 y 1982.',
    pasajeros: 2,
    estaciones: [
      { titulo: 'Orgullo y prejuicio',      autor: 'Jane Austen',    paginas: 432, anio: 1813, portada: 'https://covers.openlibrary.org/b/id/8301956-M.jpg' },
      { titulo: 'Middlemarch',              autor: 'George Eliot',   paginas: 880, anio: 1871, portada: 'https://covers.openlibrary.org/b/id/8228691-M.jpg' },
      { titulo: 'La casa de los espíritus', autor: 'Isabel Allende', paginas: 433, anio: 1982, portada: 'https://covers.openlibrary.org/b/id/8743007-M.jpg' },
    ],
    bitacoras: [
      { texto: 'Austen usa la comedia de costumbres para hacer una crítica feroz al sistema de matrimonio como único destino posible para una mujer educada. Elizabeth Bennet es revolucionaria no porque rechace la institución sino porque exige elegir dentro de ella. Austen escribe lo que no puede decir directamente.' },
      { texto: 'La novela más ambiciosa de esta ruta. Eliot construye una comunidad entera para mostrar cómo las restricciones sociales aplastan no solo a las mujeres sino a cualquiera que quiera vivir de forma no convencional. Dorothea Brooke como la inteligencia más brillante de la novela atrapada en los únicos roles que su época le ofrece.' },
      { texto: 'El salto al siglo XX y a América Latina cierra perfectamente el arco. Allende toma la saga familiar como forma pero la llena de política, violencia de Estado y feminismo explícito. Clara, Blanca y Alba son tres generaciones de mujeres que van ganando agencia progresivamente. El realismo mágico al servicio de la historia reciente.' },
    ],
    reporteFinal: 'Esta ruta me tomó cuatro meses y fue la más personal que armé. Los tres libros muestran cómo el lugar de la mujer en la narrativa cambió entre 1813 y 1982: de objeto del relato a protagonista con conciencia histórica. Austen subvierte desde adentro, Eliot expone la trampa, Allende nombra directamente la violencia. Leerlos en cronología es ver un proceso de emancipación narrativa.',
  },
];

// ─────────────────────────────────────────────
// BITÁCORAS DESAFÍO 1 — Distopías del Siglo XX
// ─────────────────────────────────────────────
const BITACORAS_DISTOPIAS = {
  MARTIN: [
    { texto: 'El doblepensar es el concepto más perturbador que encontré en mucho tiempo. No es solo que el Estado mienta — es que te entrena para creer dos cosas contradictorias sin que el conflicto genere ansiedad. Orwell no escribió una distopía: escribió un manual de epistemología del poder. La destrucción del lenguaje como destrucción del pensamiento me dejó sin palabras, valga la ironía.' },
    { texto: 'Más inquietante que 1984 porque nadie sufre. Huxley entiende algo que Orwell no llegó a ver del todo: la jaula más efectiva es la que el prisionero elige con entusiasmo. El soma como mecanismo de renuncia voluntaria a la profundidad. Me hizo pensar en Nietzsche: el último hombre que parpadea y dice nosotros inventamos la felicidad. Huxley lo novelizó 30 años después.' },
    { texto: 'Bradbury cierra el triángulo perfecto con Orwell y Huxley. Si 1984 destruye el pensamiento por la fuerza y Un Mundo Feliz lo disuelve en placer, Fahrenheit lo elimina por comodidad. Lo más perturbador no son los bomberos — es que los ciudadanos pidieron quemar los libros antes de que el Estado lo ordenara. La autocensura como etapa final de la represión.' },
    { texto: 'Las tres distopías anteriores construyen el horror desde afuera. Atwood lo escribe desde el cuerpo. La reducción de Offred a función reproductiva es la versión más concreta y menos metafórica de las tres: no hay telepantallas ni soma ni bomberos, solo burocracia doméstica y silencio normalizado. La más difícil de leer precisamente porque es la menos fantástica.' },
  ],
  ELENA: [
    { texto: 'Lo que me interesa de Orwell es el contexto: 1948, la Guerra Fría recién empezando, el estalinismo en su apogeo. Invirtió los dos últimos dígitos del año para el título y construyó Oceanía mirando directamente a la URSS. Como documento histórico disfrazado de ciencia ficción es impecable — cada elemento del sistema totalitario tiene un referente real que Orwell conocía de primera mano.' },
    { texto: 'Huxley escribió esto en 1931, entre las dos guerras, cuando el fordismo era la gran promesa del progreso. La fábrica de seres humanos es una crítica directa a la cadena de montaje de Ford aplicada a la biología. Leyendo en cronología se entiende que Huxley y Orwell no se contradicen — describen dos caras del mismo siglo, la del consumo y la del control.' },
    { texto: '1953, plena Guerra Fría y macartismo en Estados Unidos. Bradbury veía cómo los libros y las ideas eran perseguidos en su propio país. Lo que más me llamó la atención es que no es el gobierno quien empieza a quemar — son los ciudadanos que se quejan de que los libros los incomodan. Bradbury entendió que la censura más efectiva es la que viene de abajo.' },
    { texto: 'Atwood en 1985 mira el avance del fundamentalismo religioso en Estados Unidos y construye Gilead con recortes de diario. Dijo que no incluyó nada que no hubiera ocurrido ya en algún lugar del mundo. Leída después de las tres anteriores cierra el arco histórico del siglo: de los totalitarismos europeos al autoritarismo teocrático. La distopía se volvió geografía.' },
  ],
  JULIAN: [
    { texto: 'Nunca lo había leído entero, solo conocía las referencias. Lo que más me sorprendió es que es una novela de amor además de una distopía. Winston y Julia no se rebelan por ideología sino porque se enamoran, y el sistema los destruye exactamente por eso. La habitación encima de la tienda de antigüedades como el único lugar donde el tiempo parece detenerse es la imagen más triste del libro.' },
    { texto: 'Este me costó más que 1984 pero en el buen sentido. El Salvaje que llega desde la reserva y no entiende por qué nadie sufre ni quiere sufrir es el personaje más interesante. Él viene de Shakespeare y encuentra un mundo donde Shakespeare no tiene sentido porque nadie tiene problemas suficientemente complejos para necesitarlo. Me quedé pensando varios días.' },
    { texto: 'El más corto de los cuatro y el que más me movió. Mildred y sus paredes-pantalla, la familia interactiva que no es familia, los auriculares que nunca se sacan — Bradbury describió el streaming y los auriculares inalámbricos en 1953. Lo leí en una tarde y estuve incómodo el resto del día cada vez que agarré el celular. Creo que era la idea.' },
    { texto: 'La más difícil del grupo. No porque sea más compleja sino porque es la más cercana — no hay tecnología futurista ni gobierno mundial, solo una reorganización de cosas que ya existen. Offred narrando como si estuviera memorizando para contarlo después fue lo que más me impactó. No sabe si alguien la va a escuchar pero narra igual. Eso es lo más humano del libro.' },
  ],
};

// ─────────────────────────────────────────────
// BITÁCORAS DESAFÍO 2 — El Gran Viaje Literario
// ─────────────────────────────────────────────
const BITACORAS_VIAJE_LITERARIO = {
  MARTIN: [
    { texto: 'Cervantes inventa la novela moderna en el sentido más literal: un personaje que sabe que es un personaje literario y actúa en consecuencia. El Quijote no es un loco — es alguien que eligió vivir dentro de una ficción porque la realidad le resultaba insuficiente. Leerlo después de estudiar filosofía lo hace completamente distinto a la lectura escolar obligatoria.' },
    { texto: 'García Márquez crea un universo donde lo sobrenatural es tan cotidiano como el calor. Lo que más me impresionó esta vez no fue la magia sino la estructura temporal: la novela entera está contada desde su final, como si el narrador supiera desde el principio que todo está condenado a repetirse. El realismo mágico como fatalismo literario.' },
    { texto: 'Borges en su versión más pura: cada cuento es un problema filosófico disfrazado de historia. La Biblioteca de Babel como metáfora del universo infinito, el Jardín de los senderos como teoría de mundos paralelos. Leerlo al final de esta ruta, después de Cervantes y García Márquez, muestra la línea directa entre los tres: la literatura como máquina de producir realidades alternativas.' },
  ],
  ELENA: [
    { texto: 'Cervantes escribe en 1605 y ya está haciendo metaficción — Don Quijote encuentra en la segunda parte lectores que conocen la primera. Es el texto más moderno que leí en mucho tiempo, paradójicamente. La relación entre Quijote y Sancho como el diálogo entre el idealismo puro y el pragmatismo absoluto nunca se resuelve del todo, y eso es lo más honesto del libro.' },
    { texto: 'La historia de los Buendía como historia de América Latina: la repetición de los mismos errores, la incapacidad de aprender del pasado, la violencia cíclica. García Márquez escribió una novela política disfrazada de saga familiar. Leerla después del Quijote muestra algo interesante: los dos libros son sobre personas que no pueden escapar de su propio destino.' },
    { texto: 'Borges como punto final de esta ruta fue la decisión correcta. Si Cervantes crea mundos y García Márquez los puebla de historia, Borges los convierte en geometría pura. Los cuentos del Aleph son la literatura pensando sobre sí misma — laberintos, bibliotecas infinitas, espejos que multiplican. La conclusión perfecta para un viaje por la literatura en español.' },
  ],
  JULIAN: [
    { texto: 'Primera vez que lo leo completo sin la presión escolar. Sin esa presión es completamente distinto — es un libro de aventuras y humor antes que un clásico. La escena de los molinos de viento es mucho más breve que en mi memoria, y mucho más graciosa. Lo que queda después de cerrar el libro es la amistad entre Quijote y Sancho, no las hazañas.' },
    { texto: 'Tercera vez que lo leo y la primera en una ruta temática. Haberlo precedido por el Quijote lo cambia: ahora veo la herencia cervantina en García Márquez — los dos construyen mundos donde la realidad y la ficción se mezclan sin que ningún personaje parezca notarlo del todo. Macondo como pueblo quijotesco en el trópico.' },
    { texto: 'Más corto de lo que esperaba y más denso de lo que recuerdo. Borges en sus mejores cuentos construye algo que parece un cuento de ciencia ficción pero en realidad es un ensayo filosófico con protagonistas. Pierre Menard, autor del Quijote es el cuento más apropiado para cerrar esta ruta: un hombre que reescribe el libro de Cervantes palabra por palabra y produce algo completamente distinto.' },
  ],
};

// ─────────────────────────────────────────────
// BITÁCORAS DESAFÍO 3 — Viaje al Centro del Yo
// ─────────────────────────────────────────────
const BITACORAS_VIAJE_YO = {
  MARTIN: [
    { texto: 'El absurdo camusiano en su versión más concentrada. Meursault no es un sociópata — es alguien que se niega a mentir sobre sus emociones, y la sociedad lo condena más por esa negativa que por el crimen real. El sol como causa del asesinato es la declaración más honesta del libro: a veces las cosas pasan sin razón suficiente, y reconocerlo es más valiente que inventar una.' },
    { texto: 'Sartre hace filosofía existencialista a través de una novela sin que se note el truco. La náusea de Roquentin no es una enfermedad — es una revelación: la existencia de las cosas no tiene justificación, simplemente están ahí, brutas y excesivas. La escena de la raíz del castaño es la descripción más precisa de una crisis ontológica que existe en toda la literatura.' },
    { texto: 'Kafka cierra esta ruta perfectamente. Si Camus muestra la absurdidad del mundo y Sartre la contingencia de la existencia, Kafka construye un sistema donde la culpa precede al crimen y la burocracia reemplaza a la justicia. Josef K. es culpable porque el sistema lo dice, y el sistema nunca explica de qué. El existencialismo como pesadilla administrativa.' },
  ],
  ELENA: [
    { texto: 'Camus desde una perspectiva histórica: escribe en 1942, en plena ocupación nazi de Francia. La indiferencia de Meursault ante la muerte de su madre, leída en ese contexto, es casi un manifiesto de resistencia a la sentimentalidad obligatoria del régimen. La literatura del absurdo como respuesta política a una época que exigía que todos fingieran creer en algo.' },
    { texto: 'Sartre publica La náusea en 1938, en el umbral de la guerra. La angustia existencial de Roquentin tiene un correlato histórico: Europa entera estaba a punto de colapsar y nadie sabía bien por qué. El existencialismo no es una filosofía de posguerra — ya estaba gestándose antes, como diagnóstico de una civilización que había perdido sus certezas.' },
    { texto: 'Kafka escribe El proceso entre 1914 y 1915, durante la Primera Guerra Mundial, aunque se publica póstumamente en 1925. El sistema kafkiano no es una metáfora — es una descripción precisa de cómo funciona la burocracia estatal cuando se vuelve autónoma de las personas que la componen. Leído después de Camus y Sartre, el absurdo kafkiano parece el más históricamente fundado de los tres.' },
  ],
  JULIAN: [
    { texto: 'Corto, perturbador y perfectamente construido. Meursault es el personaje más honesto de la literatura porque no actúa para la galería — ni siquiera para el lector. La escena del juicio donde todos hablan de él como si no estuviera presente captura algo que reconozco de la vida real: a veces el sistema procesa una versión de vos que no tiene nada que ver con quien sos.' },
    { texto: 'Me costó más que El extranjero pero valió la pena. La náusea que siente Roquentin es difícil de describir sin leerlo — no es asco físico sino una especie de mareo metafísico ante el hecho de que las cosas existen sin necesidad ni razón. Una vez que lo leés empezás a ver esa náusea en momentos cotidianos. No sé si eso es bueno o malo.' },
    { texto: 'El proceso es el libro más kafkiano de Kafka, si eso tiene sentido. Josef K. nunca sabe de qué lo acusan y el libro nunca lo explica — y esa es exactamente la experiencia de leerlo. Terminé el libro sin resolución y me quedé incómodo varios días. Creo que esa incomodidad es la única respuesta posible y que Kafka lo sabía.' },
  ],
};

// ─────────────────────────────────────────────
// REGISTROS DE JULIÁN EN RUTAS DEL MURO
// ─────────────────────────────────────────────
const REGISTROS_JULIAN_MURO = [
  {
    rutaNombre: 'Trasbordo Macondo',
    bitacoras: [
      { texto: 'El más corto de la ruta y el que más me desorientó. Llegué al final sin entender del todo que el narrador estaba muerto desde el principio y tuve que releer las primeras páginas. Cuando lo entendí cambió todo. Rulfo construye la confusión del lector como parte de la experiencia. Cuatro estrellas porque la segunda lectura valió más que la primera.' },
      { texto: 'Ya lo había leído en otra ruta y en este orden cobra otro sentido. Después de Pedro Páramo la fragmentación de Cortázar se siente como una evolución natural, no como un experimento raro. La Maga y Horacio funcionan mejor cuando uno ya viene entrenado por Rulfo para aceptar que la narrativa no tiene por qué explicarlo todo.' },
      { texto: 'Tercera vez que lo leo y la primera en contexto de ruta. Haberlo precedido por Rulfo y Cortázar lo hace completamente distinto — ahora entiendo de dónde vienen las técnicas que García Márquez usa. Los Buendía condenados a repetir no es solo una metáfora familiar: es la región entera, es el continente. Esta vez lo leí más lento y valió cada página extra.' },
      { texto: 'El punto de llegada más político de la ruta. Allende toma la saga familiar y el realismo mágico y los pone al servicio de la historia reciente — el golpe, la represión, los desaparecidos. Lo que más me impactó es que Allende no romantiza nada: la magia y el horror conviven sin que uno excuse al otro.' },
    ],
    reporteFinal: 'La ruta con más pasajeros de la red no miente. El orden cronológico tiene una lógica impecable: cada libro preparó el terreno para el siguiente. Rulfo inventó el lenguaje, Cortázar lo radicalizó, García Márquez lo popularizó, Allende lo politizó. Cuatro etapas de la misma conversación literaria. Una de las mejores rutas que abordé.',
  },
  {
    rutaNombre: 'Ruta del Terror Gótico',
    bitacoras: [
      { texto: 'No esperaba que la primera novela de ciencia ficción de la historia fuera también una de las más filosóficas. La criatura no es el monstruo — Victor Frankenstein es el monstruo, el que crea vida y la abandona porque no quedó como esperaba. Shelley escribió esto a los 18 años en una apuesta entre amigos. Es la parte que más me perturbó de todo el libro.' },
      { texto: 'Más corto que Frankenstein pero igual de denso en lo que dice. Hyde no es una entidad externa que toma el control — es Jekyll liberado de sus restricciones sociales. Stevenson escribió la dualidad humana antes de que Freud tuviera nombre para ella. La revelación final sigue funcionando porque el libro construye bien la tensión antes de llegar ahí.' },
      { texto: 'El más elegante de la ruta. Wilde usa el horror gótico como excusa para escribir sobre el narcisismo, la corrupción moral y la hipocresía victoriana. Dorian no es un villano — es un experimento: qué pasa si alguien hermoso nunca tiene que enfrentar las consecuencias de sus actos. La respuesta de Wilde es feroz aunque la entregue con guantes blancos y frases brillantes.' },
      { texto: 'El cierre perfecto de la ruta. El formato epistolar le da una tensión que las adaptaciones cinematográficas nunca logran capturar — ver cómo los personajes van armando el rompecabezas carta por carta, sin que ninguno tenga el cuadro completo, es adictivo. La escena del barco varado con el capitán atado al timón es la mejor del libro y probablemente de toda la ruta.' },
    ],
    reporteFinal: 'Me metí en esta ruta sin conocer bien el género y salí convencido de que el gótico victoriano es mucho más interesante de lo que pensaba. Los cuatro libros comparten el mismo miedo: lo que el ser humano puede crear, liberar o convertirse cuando cruza ciertos límites. En orden cronológico se ve la evolución del miedo — de la ciencia a la psicología, de la psicología a la moral, de la moral al folklore.',
  },
  {
    rutaNombre: 'Expreso del Neón',
    bitacoras: [
      { texto: 'La pregunta del título es la mejor del libro: ¿qué hace que algo sea humano si puede simularlo todo perfectamente? Dick no da respuesta — pone a Deckard a cazar replicantes y deja que el lector llegue solo a la incomodidad. El mundo de 1968 proyectado al futuro es más sucio y más triste que el de Gibson o Stephenson. Dick no tenía esperanza y se nota, y eso lo hace el más honesto de los tres.' },
      { texto: 'La segunda vez que lo leo y entiendo más cosas. Haber empezado con Dick ayuda — ahora veo de dónde Gibson toma la deshumanización y adónde la lleva. El ciberespacio como territorio físico que se puede hackear, las corporaciones como estados soberanos, la identidad como algo negociable — Gibson inventó el vocabulario que usamos para hablar de internet antes de que internet existiera.' },
      { texto: 'El más divertido de los tres por lejos. Stephenson toma todo lo que Gibson construyó con seriedad y le agrega humor y velocidad. El Metaverso, las pizzas entregadas por la mafia, el protagonista llamado literalmente Hiro Protagonist — Stephenson sabe que el cyberpunk se estaba tomando demasiado en serio y lo dice con el nombre del personaje.' },
    ],
    reporteFinal: 'La ruta más temática de las que abordé. Los tres libros son una conversación directa entre autores — Dick plantea la pregunta, Gibson construye el mundo, Stephenson lo exagera hasta hacerlo cómico. En cronología se ve perfectamente cómo el cyberpunk fue cambiando de tono: del pesimismo filosófico de Dick a la ironía de Stephenson pasando por la densidad de Gibson.',
  },
];

// ─────────────────────────────────────────────
// RESEÑAS — MARTÍN
// ─────────────────────────────────────────────
const RESENAS_MARTIN = [
  // Libros de sus rutas propias
  { libroTitulo: 'El mito de Sísifo',    libroAutor: 'Albert Camus',        libroPaginas: 159, libroAnio: 1942, libroPortada: 'https://covers.openlibrary.org/b/id/8224161-M.jpg', estrellas: 5, texto: 'El punto de partida de todo el existencialismo posterior. Camus formula la única pregunta filosófica verdaderamente seria: ¿por qué no suicidarse? Y responde con la imagen de Sísifo feliz. La rebelión ante el absurdo no como solución sino como postura. El libro más importante que leí en toda la carrera.' },
  { libroTitulo: 'El ser y la nada',     libroAutor: 'Jean-Paul Sartre',    libroPaginas: 251, libroAnio: 1943, libroPortada: 'https://covers.openlibrary.org/b/id/8406116-M.jpg', estrellas: 4, texto: 'Sartre en su versión más sistemática y menos accesible. La distinción entre el ser-en-sí y el ser-para-sí es densa pero fundamental: el ser-en-sí simplemente existe, el ser-para-sí se define por su falta. La libertad como condena — somos responsables de todo porque no podemos no elegir. Requirió dos lecturas para entenderlo bien.' },
  { libroTitulo: 'Así habló Zaratustra', libroAutor: 'Friedrich Nietzsche', libroPaginas: 352, libroAnio: 1883, libroPortada: 'https://covers.openlibrary.org/b/id/8739208-M.jpg', estrellas: 5, texto: 'La obra más literaria de Nietzsche y la más mal leída. El superhombre no es un ideal de fuerza física sino alguien capaz de crear sus propios valores después de la muerte de Dios. El eterno retorno como experimento mental: ¿vivirías esta misma vida infinitas veces? Si la respuesta es no, algo está mal en cómo la estás viviendo.' },
  { libroTitulo: 'Meditaciones',             libroAutor: 'Marco Aurelio',  libroPaginas: 176, libroAnio: 170,  libroPortada: 'https://covers.openlibrary.org/b/id/8406786-M.jpg', estrellas: 5, texto: 'El libro más práctico de filosofía que existe. Marco Aurelio escribía para sí mismo, sin intención de publicar, y eso se nota en cada página: no hay poses, no hay sistema, solo un hombre intentando ser mejor. La idea central es sencilla pero difícil: no controlas lo que pasa, solo controlas cómo respondés.' },
  { libroTitulo: 'Discurso del método',      libroAutor: 'René Descartes', libroPaginas: 190, libroAnio: 1637, libroPortada: 'https://covers.openlibrary.org/b/id/8739161-M.jpg', estrellas: 4, texto: 'El momento fundacional de la filosofía moderna. Descartes decide dudar de todo hasta llegar a algo indudable y encuentra el cogito. Lo más moderno del libro no es la conclusión sino el método: la razón individual como único árbitro de la verdad. Cambió completamente cómo pienso la relación entre evidencia y certeza.' },
  { libroTitulo: 'Crítica de la razón pura', libroAutor: 'Immanuel Kant',  libroPaginas: 856, libroAnio: 1781, libroPortada: 'https://covers.openlibrary.org/b/id/8228105-M.jpg', estrellas: 4, texto: 'El libro más difícil que leí en toda la carrera y el más importante. Kant resuelve el conflicto entre racionalistas y empiristas preguntando qué condiciones hacen posible el conocimiento. La distinción entre fenómeno y noúmeno — lo que podemos conocer y lo que existe más allá de nuestra percepción — cambió todo lo que vino después en filosofía.' },
  // Reseñas adicionales fuera de rutas
  { libroTitulo: 'La náusea',                libroAutor: 'Jean-Paul Sartre',    libroPaginas: 224, libroAnio: 1938, libroPortada: 'https://covers.openlibrary.org/b/id/8406116-M.jpg', estrellas: 5, texto: 'Sartre hace filosofía existencialista a través de una novela sin que se note el truco. Roquentin no sufre un problema psicológico: tiene una revelación filosófica. La escena de la raíz del castaño es la descripción más precisa de una crisis ontológica que existe en la literatura. Obligatorio antes de leer El ser y la nada.' },
  { libroTitulo: 'El extranjero',             libroAutor: 'Albert Camus',        libroPaginas: 159, libroAnio: 1942, libroPortada: 'https://covers.openlibrary.org/b/id/8224161-M.jpg', estrellas: 5, texto: 'Meursault como encarnación perfecta del absurdo camusiano. No siente lo que se supone que debería sentir, no actúa como se espera, y la sociedad lo condena más por eso que por el crimen real. Una novela que se lee en una tarde y se piensa durante semanas.' },
  { libroTitulo: 'Más allá del bien y del mal', libroAutor: 'Friedrich Nietzsche', libroPaginas: 284, libroAnio: 1886, libroPortada: 'https://covers.openlibrary.org/b/id/8739208-M.jpg', estrellas: 4, texto: 'Nietzsche en modo ensayístico, sin la metáfora del profeta. Más accesible que Zaratustra pero igualmente provocador. La distinción entre moral de señor y moral de esclavo es incómoda pero imposible de refutar del todo. Lo recomiendo como puerta de entrada a Nietzsche antes de los textos más literarios.' },
  // Desafío 1 — Distopías
  { libroTitulo: '1984',                  libroAutor: 'George Orwell',    libroPaginas: 328, libroAnio: 1949, libroPortada: 'https://covers.openlibrary.org/b/id/8575708-M.jpg', estrellas: 5, texto: 'El doblepensar es el concepto más perturbador que leí en mucho tiempo. Orwell no escribió una distopía: escribió un manual de epistemología del poder. La destrucción del lenguaje como destrucción del pensamiento. Imprescindible.' },
  { libroTitulo: 'Un Mundo Feliz',        libroAutor: 'Aldous Huxley',    libroPaginas: 311, libroAnio: 1932, libroPortada: 'https://covers.openlibrary.org/b/id/8406786-M.jpg', estrellas: 5, texto: 'Más inquietante que 1984 porque nadie sufre. La jaula más efectiva es la que el prisionero elige con entusiasmo. El soma como renuncia voluntaria a la profundidad. Huxley entendió algo que Orwell no llegó a ver del todo.' },
  { libroTitulo: 'Fahrenheit 451',        libroAutor: 'Ray Bradbury',     libroPaginas: 256, libroAnio: 1953, libroPortada: 'https://covers.openlibrary.org/b/id/8228616-M.jpg', estrellas: 4, texto: 'Lo más perturbador no son los bomberos — es que los ciudadanos pidieron quemar los libros antes de que el Estado lo ordenara. La autocensura como etapa final de la represión. Bradbury lo vio venir en 1953.' },
  { libroTitulo: 'El Cuento de la Criada', libroAutor: 'Margaret Atwood', libroPaginas: 311, libroAnio: 1985, libroPortada: 'https://covers.openlibrary.org/b/id/9176669-M.jpg', estrellas: 5, texto: 'Las tres distopías anteriores construyen el horror desde afuera. Atwood lo escribe desde el cuerpo. La más difícil de leer precisamente porque es la menos fantástica. Gilead no es ciencia ficción — es geografía.' },
  // Desafío 2 — El Gran Viaje Literario
  { libroTitulo: 'Don Quijote de la Mancha', libroAutor: 'Miguel de Cervantes',    libroPaginas: 863, libroAnio: 1605, libroPortada: 'https://covers.openlibrary.org/b/id/8739161-M.jpg', estrellas: 5, texto: 'Cervantes inventa la metaficción 400 años antes de que existiera el término. Don Quijote sabe en la segunda parte que es un personaje literario — y actúa en consecuencia. Leerlo como filósofo y no como estudiante secundario es una experiencia completamente distinta. La locura como forma de libertad.' },
  { libroTitulo: 'Cien años de soledad',     libroAutor: 'Gabriel García Márquez', libroPaginas: 471, libroAnio: 1967, libroPortada: 'https://covers.openlibrary.org/b/id/8228105-M.jpg', estrellas: 5, texto: 'La novela entera está contada desde su final — el narrador sabe desde la primera página que todo está condenado a repetirse. El realismo mágico no es un recurso estético sino una epistemología: en Macondo lo sobrenatural es tan real como lo cotidiano porque así funciona la memoria colectiva latinoamericana.' },
  { libroTitulo: 'El Aleph',                 libroAutor: 'Jorge Luis Borges',      libroPaginas: 192, libroAnio: 1949, libroPortada: 'https://covers.openlibrary.org/b/id/9267864-M.jpg', estrellas: 5, texto: 'Borges construye en cada cuento un problema filosófico disfrazado de historia. El Aleph como punto del espacio que contiene todos los puntos es la imagen más precisa del infinito que encontré en literatura. Leerlo al final de una ruta sobre literatura en español es la decisión correcta: es la literatura pensando sobre sí misma.' },
  // Desafío 3 — Viaje al Centro del Yo
  { libroTitulo: 'El extranjero',  libroAutor: 'Albert Camus',    libroPaginas: 159, libroAnio: 1942, libroPortada: 'https://covers.openlibrary.org/b/id/8224161-M.jpg', estrellas: 5, texto: 'Ya reseñado aparte, pero releerlo en el contexto de esta ruta cambia todo. Meursault como respuesta al absurdo antes de que Camus teorizara el concepto. El sol que causa el asesinato es la declaración más honesta de la novela: a veces las cosas pasan sin razón suficiente.' },
  { libroTitulo: 'La náusea',      libroAutor: 'Jean-Paul Sartre', libroPaginas: 224, libroAnio: 1938, libroPortada: 'https://covers.openlibrary.org/b/id/8406116-M.jpg', estrellas: 5, texto: 'La contingencia de la existencia como revelación filosófica. Roquentin no está enfermo — está viendo la realidad sin los filtros que normalmente nos protegen de ella. La escena de la raíz del castaño sigue siendo la más precisa descripción de una crisis ontológica en toda la literatura.' },
  { libroTitulo: 'El proceso',     libroAutor: 'Franz Kafka',      libroPaginas: 255, libroAnio: 1925, libroPortada: 'https://covers.openlibrary.org/b/id/8739208-M.jpg', estrellas: 5, texto: 'Kafka cierra el triángulo existencialista perfectamente. Si Camus muestra el absurdo y Sartre la contingencia, Kafka construye la burocracia como sistema de culpa sin crimen. Josef K. es culpable porque el sistema lo dice, y el sistema nunca explica de qué. El existencialismo como pesadilla administrativa.' },
];

// ─────────────────────────────────────────────
// RESEÑAS — ELENA
// ─────────────────────────────────────────────
const RESENAS_ELENA = [
  // Libros de sus rutas propias
  { libroTitulo: 'Ivanhoe',              libroAutor: 'Walter Scott',         libroPaginas: 519,  libroAnio: 1820, libroPortada: 'https://covers.openlibrary.org/b/id/8457978-M.jpg', estrellas: 4, texto: 'El texto fundador de la novela histórica moderna. Scott inventa la fórmula que usarán todos después: personaje ficticio en contexto histórico documentado. La Inglaterra medieval no es decorado — es argumento. Más interesante como documento histórico del romanticismo que como aventura.' },
  { libroTitulo: 'Guerra y paz',         libroAutor: 'León Tolstói',         libroPaginas: 1225, libroAnio: 1869, libroPortada: 'https://covers.openlibrary.org/b/id/8231459-M.jpg', estrellas: 5, texto: 'La novela histórica más ambiciosa que existe. La tesis de Tolstói sobre la historia — que no la hacen los grandes hombres sino las fuerzas colectivas anónimas — es más moderna que la mayoría de la historiografía del siglo XIX. Natasha, Andrei y Pierre son más reales que cualquier personaje de ficción que leí.' },
  { libroTitulo: 'El nombre de la rosa', libroAutor: 'Umberto Eco',          libroPaginas: 502,  libroAnio: 1980, libroPortada: 'https://covers.openlibrary.org/b/id/8775558-M.jpg', estrellas: 5, texto: 'Eco usa la estructura del policial dentro de la novela histórica medieval para hablar de la relación entre conocimiento y poder. Lo que empezó con Scott como aventura romántica termina con Eco como reflexión filosófica sobre la verdad y la censura. La novela histórica llegó a su máxima expresión posmoderna.' },
  { libroTitulo: 'Orgullo y prejuicio',      libroAutor: 'Jane Austen',    libroPaginas: 432, libroAnio: 1813, libroPortada: 'https://covers.openlibrary.org/b/id/8301956-M.jpg', estrellas: 5, texto: 'Austen usa la comedia de costumbres para hacer una crítica feroz al sistema de matrimonio como único destino posible para una mujer educada. Elizabeth Bennet es revolucionaria no porque rechace la institución sino porque exige elegir dentro de ella. El libro más político disfrazado de romance que conozco.' },
  { libroTitulo: 'Middlemarch',              libroAutor: 'George Eliot',   libroPaginas: 880, libroAnio: 1871, libroPortada: 'https://covers.openlibrary.org/b/id/8228691-M.jpg', estrellas: 5, texto: 'La novela más ambiciosa de la literatura victoriana. Eliot construye una comunidad entera para mostrar cómo las restricciones sociales aplastan no solo a las mujeres sino a cualquiera que quiera vivir de forma no convencional. Dorothea Brooke como la inteligencia más brillante atrapada en los únicos roles que su época le ofrece.' },
  { libroTitulo: 'La casa de los espíritus', libroAutor: 'Isabel Allende', libroPaginas: 433, libroAnio: 1982, libroPortada: 'https://covers.openlibrary.org/b/id/8743007-M.jpg', estrellas: 5, texto: 'Allende toma la saga familiar y el realismo mágico y los pone al servicio de la historia reciente — el golpe, la represión, los desaparecidos. Clara, Blanca y Alba son tres generaciones de mujeres que van ganando agencia progresivamente. El feminismo explícito en la narrativa latinoamericana.' },
  // Reseñas adicionales
  { libroTitulo: 'Ben-Hur',             libroAutor: 'Lew Wallace',          libroPaginas: 544, libroAnio: 1880, libroPortada: null, estrellas: 4, texto: 'Una novela histórica que mezcla el género de aventuras con el relato de época de manera más efectiva de lo que esperaba. El contexto de la Roma imperial está bien documentado y el conflicto personal de Judá Ben-Hur funciona como metáfora del pueblo judío bajo la ocupación. Más interesante históricamente que cinematográficamente.' },
  { libroTitulo: 'Memorias de Adriano', libroAutor: 'Marguerite Yourcenar', libroPaginas: 302, libroAnio: 1951, libroPortada: null, estrellas: 5, texto: 'El mejor ejemplo de novela histórica en primera persona que leí. Yourcenar reconstruye la voz del emperador Adriano con una precisión arqueológica que no aplasta la emoción sino que la potencia. La reflexión sobre el poder, la vejez y el legado desde la perspectiva de quien gobernó el mundo conocido es impresionante.' },
  { libroTitulo: 'Yo, Claudio',         libroAutor: 'Robert Graves',        libroPaginas: 468, libroAnio: 1934, libroPortada: null, estrellas: 5, texto: 'Graves hace algo brillante: toma al personaje histórico considerado débil e inútil y lo convierte en el testigo más lúcido de toda la locura que lo rodea. Claudio fingiendo idiotez para sobrevivir a Calígula y Mesalina es una de las construcciones narrativas más inteligentes del siglo XX.' },
  // Desafío 1 — Distopías
  { libroTitulo: '1984',                   libroAutor: 'George Orwell',    libroPaginas: 328, libroAnio: 1949, libroPortada: 'https://covers.openlibrary.org/b/id/8575708-M.jpg', estrellas: 5, texto: 'Como documento histórico disfrazado de ciencia ficción es impecable. Orwell construyó Oceanía mirando directamente a la URSS. Cada elemento del sistema totalitario tiene un referente real que él conocía de primera mano.' },
  { libroTitulo: 'Un Mundo Feliz',         libroAutor: 'Aldous Huxley',    libroPaginas: 311, libroAnio: 1932, libroPortada: 'https://covers.openlibrary.org/b/id/8406786-M.jpg', estrellas: 4, texto: 'Huxley y Orwell no se contradicen — describen dos caras del mismo siglo, la del consumo y la del control. La fábrica de seres humanos es una crítica directa a la cadena de montaje de Ford aplicada a la biología.' },
  { libroTitulo: 'Fahrenheit 451',         libroAutor: 'Ray Bradbury',     libroPaginas: 256, libroAnio: 1953, libroPortada: 'https://covers.openlibrary.org/b/id/8228616-M.jpg', estrellas: 4, texto: 'No es el gobierno quien empieza a quemar — son los ciudadanos que se quejan de que los libros los incomodan. Bradbury entendió que la censura más efectiva es la que viene de abajo. Escrito en pleno macartismo.' },
  { libroTitulo: 'El Cuento de la Criada', libroAutor: 'Margaret Atwood',  libroPaginas: 311, libroAnio: 1985, libroPortada: 'https://covers.openlibrary.org/b/id/9176669-M.jpg', estrellas: 5, texto: 'Atwood dijo que no incluyó nada que no hubiera ocurrido ya en algún lugar del mundo. Cierra el arco histórico del siglo: de los totalitarismos europeos al autoritarismo teocrático. La distopía se volvió geografía.' },
  // Desafío 2 — El Gran Viaje Literario
  { libroTitulo: 'Don Quijote de la Mancha', libroAutor: 'Miguel de Cervantes',    libroPaginas: 863, libroAnio: 1605, libroPortada: 'https://covers.openlibrary.org/b/id/8739161-M.jpg', estrellas: 5, texto: 'Cervantes escribe en 1605 y ya está haciendo metaficción. La relación entre Quijote y Sancho como el diálogo entre el idealismo puro y el pragmatismo absoluto nunca se resuelve del todo, y eso es lo más honesto del libro. El texto más moderno que leí en mucho tiempo, paradójicamente.' },
  { libroTitulo: 'Cien años de soledad',     libroAutor: 'Gabriel García Márquez', libroPaginas: 471, libroAnio: 1967, libroPortada: 'https://covers.openlibrary.org/b/id/8228105-M.jpg', estrellas: 5, texto: 'García Márquez escribió una novela política disfrazada de saga familiar. La historia de los Buendía como historia de América Latina: la repetición de los mismos errores, la incapacidad de aprender del pasado, la violencia cíclica. Leerla después del Quijote muestra que los dos libros son sobre personas que no pueden escapar de su destino.' },
  { libroTitulo: 'El Aleph',                 libroAutor: 'Jorge Luis Borges',      libroPaginas: 192, libroAnio: 1949, libroPortada: 'https://covers.openlibrary.org/b/id/9267864-M.jpg', estrellas: 5, texto: 'Si Cervantes crea mundos y García Márquez los puebla de historia, Borges los convierte en geometría pura. Los cuentos del Aleph son la literatura pensando sobre sí misma — laberintos, bibliotecas infinitas, espejos que multiplican. La conclusión perfecta para un viaje por la literatura en español.' },
  // Desafío 3 — Viaje al Centro del Yo
  { libroTitulo: 'El extranjero', libroAutor: 'Albert Camus',    libroPaginas: 159, libroAnio: 1942, libroPortada: 'https://covers.openlibrary.org/b/id/8224161-M.jpg', estrellas: 4, texto: 'Camus escribe en 1942, en plena ocupación nazi de Francia. La indiferencia de Meursault leída en ese contexto es casi un manifiesto de resistencia a la sentimentalidad obligatoria del régimen. La literatura del absurdo como respuesta política a una época que exigía que todos fingieran creer en algo.' },
  { libroTitulo: 'La náusea',     libroAutor: 'Jean-Paul Sartre', libroPaginas: 224, libroAnio: 1938, libroPortada: 'https://covers.openlibrary.org/b/id/8406116-M.jpg', estrellas: 4, texto: 'Sartre publica La náusea en 1938, en el umbral de la guerra. La angustia existencial de Roquentin tiene un correlato histórico: Europa entera estaba a punto de colapsar. El existencialismo no es una filosofía de posguerra — ya estaba gestándose antes, como diagnóstico de una civilización que había perdido sus certezas.' },
  { libroTitulo: 'El proceso',    libroAutor: 'Franz Kafka',      libroPaginas: 255, libroAnio: 1925, libroPortada: 'https://covers.openlibrary.org/b/id/8739208-M.jpg', estrellas: 5, texto: 'Kafka escribe El proceso durante la Primera Guerra Mundial. El sistema kafkiano no es una metáfora — es una descripción precisa de cómo funciona la burocracia estatal cuando se vuelve autónoma de las personas que la componen. Leído después de Camus y Sartre, el absurdo kafkiano parece el más históricamente fundado de los tres.' },
];

// ─────────────────────────────────────────────
// RESEÑAS — JULIÁN
// ─────────────────────────────────────────────
const RESENAS_JULIAN = [
  // Rutas del muro que abordó
  { libroTitulo: 'Cien años de soledad',          libroAutor: 'Gabriel García Márquez', libroPaginas: 471, libroAnio: 1967, libroPortada: 'https://covers.openlibrary.org/b/id/8228105-M.jpg', estrellas: 5, texto: 'Los Buendía repitiendo los mismos errores generación tras generación es la novela más latinoamericana que existe. Una vez que entrás en el ritmo de Macondo no podés parar.' },
  { libroTitulo: 'Rayuela',                        libroAutor: 'Julio Cortázar',         libroPaginas: 600, libroAnio: 1963, libroPortada: 'https://covers.openlibrary.org/b/id/8291037-M.jpg', estrellas: 5, texto: 'El libro más raro que leí y el que más me gustó en mucho tiempo. La Maga existe en una frecuencia que Horacio no puede sintonizar aunque lo intente toda la novela — y el libro entero es esa frustración convertida en literatura.' },
  { libroTitulo: 'Pedro Páramo',                   libroAutor: 'Juan Rulfo',             libroPaginas: 124, libroAnio: 1955, libroPortada: 'https://covers.openlibrary.org/b/id/8371929-M.jpg', estrellas: 4, texto: 'Llegué al final sin entender del todo que el narrador estaba muerto desde el principio y tuve que releer las primeras páginas. Cuando lo entendí cambió todo. Rulfo construye la confusión del lector como parte de la experiencia.' },
  { libroTitulo: 'La Casa de los Espíritus',       libroAutor: 'Isabel Allende',         libroPaginas: 433, libroAnio: 1982, libroPortada: 'https://covers.openlibrary.org/b/id/8743007-M.jpg', estrellas: 5, texto: 'Allende no romantiza nada: la magia y el horror conviven sin que uno excuse al otro. Clara, Blanca y Alba como tres generaciones de resistencia. El realismo mágico al servicio de la historia más reciente y más dolorosa.' },
  { libroTitulo: 'Frankenstein',                   libroAutor: 'Mary Shelley',           libroPaginas: 280, libroAnio: 1818, libroPortada: 'https://covers.openlibrary.org/b/id/8269561-M.jpg', estrellas: 4, texto: 'La criatura no es el monstruo — Victor Frankenstein es el monstruo, el que crea vida y la abandona porque no quedó como esperaba. Shelley escribió esto a los 18 años. No esperaba que la primera novela de ciencia ficción fuera también una de las más filosóficas.' },
  { libroTitulo: 'Drácula',                        libroAutor: 'Bram Stoker',            libroPaginas: 418, libroAnio: 1897, libroPortada: 'https://covers.openlibrary.org/b/id/8457978-M.jpg', estrellas: 4, texto: 'El formato epistolar le da una tensión que las adaptaciones cinematográficas nunca logran capturar. Ver cómo los personajes van armando el rompecabezas carta por carta, sin que ninguno tenga el cuadro completo, es adictivo.' },
  { libroTitulo: 'El retrato de Dorian Gray',      libroAutor: 'Oscar Wilde',            libroPaginas: 254, libroAnio: 1890, libroPortada: 'https://covers.openlibrary.org/b/id/8301956-M.jpg', estrellas: 4, texto: 'Wilde entrega una crítica feroz a la hipocresía victoriana con guantes blancos y frases brillantes. Dorian no es un villano — es un experimento: qué pasa si alguien hermoso nunca tiene que enfrentar las consecuencias de sus actos.' },
  { libroTitulo: '¿Sueñan los androides con ovejas eléctricas?', libroAutor: 'Philip K. Dick', libroPaginas: 210, libroAnio: 1968, libroPortada: 'https://covers.openlibrary.org/b/id/8091016-M.jpg', estrellas: 5, texto: 'La pregunta del título es la mejor del libro: ¿qué hace que algo sea humano si puede simularlo todo perfectamente? Dick no da respuesta y eso lo hace el más honesto de todos los cyberpunk.' },
  { libroTitulo: 'Neuromante',                     libroAutor: 'William Gibson',         libroPaginas: 271, libroAnio: 1984, libroPortada: 'https://covers.openlibrary.org/b/id/8739405-M.jpg', estrellas: 4, texto: 'Gibson escribe como si el mundo que describe ya existiera y el lector tuviera que ponerse al día solo. Inventó el vocabulario que usamos para hablar de internet antes de que internet existiera. Denso en el arranque, pero una vez que entra no para.' },
  { libroTitulo: 'Snow Crash',                     libroAutor: 'Neal Stephenson',        libroPaginas: 440, libroAnio: 1992, libroPortada: 'https://covers.openlibrary.org/b/id/7886428-M.jpg', estrellas: 4, texto: 'El más divertido de los cyberpunk por lejos. El protagonista llamado literalmente Hiro Protagonist — Stephenson sabe que el género se estaba tomando demasiado en serio y lo dice con el nombre del personaje.' },
  // Reseñas adicionales
  { libroTitulo: 'Cosmos',                         libroAutor: 'Carl Sagan',             libroPaginas: 365, libroAnio: 1980, libroPortada: null, estrellas: 5, texto: 'Sagan tiene el don de hacer que el universo se sienta personal. Cada capítulo conecta la escala cósmica con la historia humana de una manera que hace que los problemas cotidianos parezcan ridículos y al mismo tiempo que la existencia humana parezca más valiosa.' },
  { libroTitulo: 'El código Da Vinci',             libroAutor: 'Dan Brown',              libroPaginas: 489, libroAnio: 2003, libroPortada: null, estrellas: 3, texto: 'Entretenido como thriller pero históricamente flojo. Lo leí de un tirón porque el ritmo narrativo es adictivo, pero recomiendo leer después algo de historia real del Vaticano para limpiar la cabeza.' },
  { libroTitulo: 'Una breve historia del tiempo',  libroAutor: 'Stephen Hawking',        libroPaginas: 212, libroAnio: 1988, libroPortada: null, estrellas: 4, texto: 'Hawking logra explicar agujeros negros, el Big Bang y la relatividad sin una sola ecuación. Lo que más me quedó: el tiempo probablemente no existía antes del Big Bang.' },
  { libroTitulo: 'Ficciones',                      libroAutor: 'Jorge Luis Borges',      libroPaginas: 174, libroAnio: 1944, libroPortada: 'https://covers.openlibrary.org/b/id/9267864-M.jpg', estrellas: 5, texto: 'Borges como punto de encuentro entre literatura y filosofía pura. La Biblioteca de Babel como metáfora del universo infinito. Un libro que te hace más inteligente con cada cuento.' },
  // Desafío 1 — Distopías
  { libroTitulo: '1984',                   libroAutor: 'George Orwell',    libroPaginas: 328, libroAnio: 1949, libroPortada: 'https://covers.openlibrary.org/b/id/8575708-M.jpg', estrellas: 5, texto: 'Es una novela de amor además de una distopía. Winston y Julia no se rebelan por ideología sino porque se enamoran, y el sistema los destruye exactamente por eso. La habitación encima de la tienda de antigüedades es la imagen más triste del libro.' },
  { libroTitulo: 'Un Mundo Feliz',         libroAutor: 'Aldous Huxley',    libroPaginas: 311, libroAnio: 1932, libroPortada: 'https://covers.openlibrary.org/b/id/8406786-M.jpg', estrellas: 4, texto: 'El Salvaje que llega desde la reserva y no entiende por qué nadie sufre es el personaje más interesante. Viene de Shakespeare y encuentra un mundo donde Shakespeare no tiene sentido. Me quedé pensando varios días.' },
  { libroTitulo: 'Fahrenheit 451',         libroAutor: 'Ray Bradbury',     libroPaginas: 256, libroAnio: 1953, libroPortada: 'https://covers.openlibrary.org/b/id/8228616-M.jpg', estrellas: 5, texto: 'Bradbury describió el streaming y los auriculares inalámbricos en 1953. Lo leí en una tarde y estuve incómodo el resto del día cada vez que agarré el celular. El más corto de los cuatro y el que más me movió.' },
  { libroTitulo: 'El Cuento de la Criada', libroAutor: 'Margaret Atwood',  libroPaginas: 311, libroAnio: 1985, libroPortada: 'https://covers.openlibrary.org/b/id/9176669-M.jpg', estrellas: 4, texto: 'La más difícil del grupo porque es la más cercana. Offred narrando como si estuviera memorizando para contarlo después fue lo que más me impactó. No sabe si alguien la va a escuchar pero narra igual. Lo más humano del libro.' },
  // Desafío 2 — El Gran Viaje Literario
  { libroTitulo: 'Don Quijote de la Mancha', libroAutor: 'Miguel de Cervantes',    libroPaginas: 863, libroAnio: 1605, libroPortada: 'https://covers.openlibrary.org/b/id/8739161-M.jpg', estrellas: 5, texto: 'Primera vez que lo leo completo sin la presión escolar. Sin esa presión es completamente distinto — es un libro de aventuras y humor antes que un clásico. Lo que queda después de cerrar el libro es la amistad entre Quijote y Sancho, no las hazañas.' },
  { libroTitulo: 'Cien años de soledad',     libroAutor: 'Gabriel García Márquez', libroPaginas: 471, libroAnio: 1967, libroPortada: 'https://covers.openlibrary.org/b/id/8228105-M.jpg', estrellas: 5, texto: 'Tercera vez que lo leo. Haberlo precedido por el Quijote lo cambia: ahora veo la herencia cervantina en García Márquez. Macondo como pueblo quijotesco en el trópico. Cada lectura descubre algo nuevo.' },
  { libroTitulo: 'El Aleph',                 libroAutor: 'Jorge Luis Borges',      libroPaginas: 192, libroAnio: 1949, libroPortada: 'https://covers.openlibrary.org/b/id/9267864-M.jpg', estrellas: 5, texto: 'Pierre Menard, autor del Quijote es el cuento más apropiado para cerrar esta ruta: un hombre que reescribe el libro de Cervantes palabra por palabra y produce algo completamente distinto. Borges en su versión más lúdica y más filosófica al mismo tiempo.' },
  // Desafío 3 — Viaje al Centro del Yo
  { libroTitulo: 'El extranjero', libroAutor: 'Albert Camus',    libroPaginas: 159, libroAnio: 1942, libroPortada: 'https://covers.openlibrary.org/b/id/8224161-M.jpg', estrellas: 5, texto: 'Corto, perturbador y perfectamente construido. La escena del juicio donde todos hablan de él como si no estuviera presente captura algo que reconozco de la vida real: a veces el sistema procesa una versión de vos que no tiene nada que ver con quien sos.' },
  { libroTitulo: 'La náusea',     libroAutor: 'Jean-Paul Sartre', libroPaginas: 224, libroAnio: 1938, libroPortada: 'https://covers.openlibrary.org/b/id/8406116-M.jpg', estrellas: 4, texto: 'Me costó más que El extranjero pero valió la pena. La náusea que siente Roquentin es difícil de describir sin leerlo. Una vez que lo leés empezás a ver esa náusea en momentos cotidianos. No sé si eso es bueno o malo.' },
  { libroTitulo: 'El proceso',    libroAutor: 'Franz Kafka',      libroPaginas: 255, libroAnio: 1925, libroPortada: 'https://covers.openlibrary.org/b/id/8739208-M.jpg', estrellas: 4, texto: 'Josef K. nunca sabe de qué lo acusan y el libro nunca lo explica — y esa es exactamente la experiencia de leerlo. Terminé el libro sin resolución y me quedé incómodo varios días. Creo que esa incomodidad es la única respuesta posible.' },
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const insertarRuta = async (conn, ruta) => {
  const [res] = await conn.execute(
    `INSERT INTO rutas (nombre, metodo, es_publica, justificacion, pasajeros)
     VALUES (?, ?, 1, ?, ?)`,
    [ruta.nombre, ruta.metodo, ruta.justificacion, ruta.pasajeros]
  );
  const rutaId = res.insertId;
  for (let i = 0; i < ruta.estaciones.length; i++) {
    const e = ruta.estaciones[i];
    await conn.execute(
      `INSERT INTO estaciones (ruta_id, posicion, titulo, autor, paginas, anio, portada)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [rutaId, i, e.titulo, e.autor, e.paginas, e.anio, e.portada ?? null]
    );
  }
  return rutaId;
};

const insertarRegistro = async (conn, rutaId, maquinista, bitacoras, reporteFinal, estaciones) => {
  const [res] = await conn.execute(
    `INSERT INTO registros (ruta_id, maquinista, reporte_final) VALUES (?, ?, ?)`,
    [rutaId, maquinista, reporteFinal]
  );
  const registroId = res.insertId;
  for (let i = 0; i < bitacoras.length; i++) {
    const e = estaciones[i] || {};
    await conn.execute(
      `INSERT INTO bitacoras (registro_id, posicion, estacion_titulo, estacion_autor, texto)
       VALUES (?, ?, ?, ?, ?)`,
      [registroId, i, e.titulo ?? null, e.autor ?? null, bitacoras[i].texto]
    );
  }
  await conn.execute('UPDATE rutas SET pasajeros = pasajeros + 1 WHERE id = ?', [rutaId]);
  return registroId;
};

const insertarResenas = async (conn, maquinista, resenas) => {
  for (const r of resenas) {
    await conn.execute(
      `INSERT IGNORE INTO resenas
         (libro_titulo, libro_autor, libro_portada, libro_paginas, libro_anio, maquinista, estrellas, texto)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [r.libroTitulo, r.libroAutor, r.libroPortada ?? null,
       r.libroPaginas ?? null, r.libroAnio ?? null,
       maquinista, r.estrellas, r.texto]
    );
  }
};

const actualizarPerfil = async (conn, maquinista, xp, rutasCompletadas, rutasAbordadas, bitacorasEscritas, logros, desafiosCompletados) => {
  const [existing] = await conn.execute('SELECT id FROM perfiles WHERE maquinista = ?', [maquinista]);
  let perfilId;
  if (existing.length > 0) {
    perfilId = existing[0].id;
    await conn.execute(
      `UPDATE perfiles SET xp=?, rutas_completadas=?, rutas_abordadas=?, bitacoras_escritas=? WHERE id=?`,
      [xp, rutasCompletadas, rutasAbordadas, bitacorasEscritas, perfilId]
    );
  } else {
    const [res] = await conn.execute(
      `INSERT INTO perfiles (maquinista, xp, rutas_completadas, rutas_abordadas, bitacoras_escritas)
       VALUES (?, ?, ?, ?, ?)`,
      [maquinista, xp, rutasCompletadas, rutasAbordadas, bitacorasEscritas]
    );
    perfilId = res.insertId;
  }
  for (const logro of logros) {
    await conn.execute('INSERT IGNORE INTO perfil_logros (perfil_id, logro_id) VALUES (?, ?)', [perfilId, logro]);
  }
  for (const semanaId of desafiosCompletados) {
    await conn.execute('INSERT IGNORE INTO perfil_desafios_completados (perfil_id, semana_id) VALUES (?, ?)', [perfilId, semanaId]);
  }
};

// ─────────────────────────────────────────────
// SEED PRINCIPAL
// ─────────────────────────────────────────────
const seed = async () => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Usuarios
    console.log('👤 Insertando usuarios demo...');
    for (const u of USUARIOS) {
      await conn.execute('INSERT IGNORE INTO usuarios (maquinista, password) VALUES (?, ?)', [u.maquinista, u.password]);
    }

    // 2. Rutas propias de Martín + registros
    console.log('🚂 Cargando rutas de Martín...');
    for (const ruta of RUTAS_MARTIN) {
      const rutaId = await insertarRuta(conn, ruta);
      await insertarRegistro(conn, rutaId, 'MAQUINISTA_CAMUS', ruta.bitacoras, ruta.reporteFinal, ruta.estaciones);
    }

    // 3. Rutas propias de Elena + registros
    console.log('🚂 Cargando rutas de Elena...');
    for (const ruta of RUTAS_ELENA) {
      const rutaId = await insertarRuta(conn, ruta);
      await insertarRegistro(conn, rutaId, 'LECTORA_DEL_TIEMPO', ruta.bitacoras, ruta.reporteFinal, ruta.estaciones);
    }

    // 4. Perfiles base — ANTES de los desafíos para que la FK funcione
    console.log('🏆 Creando perfiles base...');
    await actualizarPerfil(conn, 'MAQUINISTA_CAMUS',   560, 5, 1, 22, ['primera_salida', 'bibliofilo', 'desafio_cumplido', 'cronista'], []);
    await actualizarPerfil(conn, 'LECTORA_DEL_TIEMPO', 530, 5, 1, 23, ['primera_salida', 'bibliofilo', 'desafio_cumplido', 'cronista'], []);
    await actualizarPerfil(conn, 'PASAJERO_ERRANTE',   480, 0, 7, 24, ['primera_salida', 'desafio_cumplido', 'explorador', 'cronista'],  []);

    // 5. Desafíos semanales — los 3 abordan las 3 rutas
    const rutasDesafio = [
      { nombre: 'Distopías del Siglo XX',    bits: BITACORAS_DISTOPIAS,       reportes: {
        MARTIN: 'Leer estas cuatro en cronología fue ver cómo el siglo XX fue afinando su miedo. Orwell temía la bota, Huxley temía el placer, Bradbury temía la pereza, Atwood temía lo que ya existía. No son cuatro novelas — son cuatro etapas del mismo diagnóstico.',
        ELENA:  'El criterio cronológico fue la única manera correcta de leer esta ruta. Juntos forman una historia del miedo occidental del siglo XX. No son cuatro novelas — son cuatro capítulos de la misma historia que todavía no terminó.',
        JULIAN: 'Abordé esta ruta por el desafío semanal sin conocer todos los libros y fue la mejor decisión. Los cuatro juntos se potencian — ninguno funciona igual leído solo. Definitivamente no es la última ruta ajena que abordo.',
      }},
      { nombre: 'El Gran Viaje Literario',   bits: BITACORAS_VIAJE_LITERARIO, reportes: {
        MARTIN: 'Leer a Cervantes, García Márquez y Borges en un mismo recorrido es ver la columna vertebral de la literatura en español. Los tres comparten el mismo gesto: construir un mundo que tiene sus propias reglas y habitarlo con personajes que creen en él completamente.',
        ELENA:  'En cronología se entiende la conversación entre los tres: Cervantes inventa el juego, García Márquez lo lleva a América y lo carga de historia, Borges lo convierte en filosofía pura. Tres siglos de literatura en español resumidos en tres libros.',
        JULIAN: 'La ruta más clásica que abordé y la que más me sorprendió. Sin la presión escolar, los tres son completamente distintos a lo que recordaba. El Gran Viaje resulta ser un viaje hacia adentro más que hacia afuera.',
      }},
      { nombre: 'Viaje al Centro del Yo',    bits: BITACORAS_VIAJE_YO,        reportes: {
        MARTIN: 'Camus, Sartre y Kafka forman el triángulo perfecto del existencialismo literario. Cada uno responde a la misma pregunta desde un ángulo distinto: Camus con la rebelión, Sartre con la contingencia, Kafka con la burocracia. Juntos son más completos que cualquiera por separado.',
        ELENA:  'Los tres escritores como documentos de su época: Camus en la ocupación, Sartre en el umbral de la guerra, Kafka en la Primera Guerra Mundial. El existencialismo no surge del vacío — es la respuesta filosófica de tres hombres que vivieron en tiempos en que todo el andamiaje de certezas se derrumbó.',
        JULIAN: 'La ruta más incómoda que abordé y la que más me marcó. Los tres libros dejan una sensación parecida: algo entre el mareo metafísico y la lucidez brutal. No sé si los recomendaría a alguien que esté pasando un mal momento, pero sí a alguien que quiera entender por qué lo está pasando.',
      }},
    ];

    const semanaIds = {};
    for (const rutaDesafio of rutasDesafio) {
      console.log(`⚡ Cargando desafío: ${rutaDesafio.nombre}...`);
      const [rows] = await conn.execute(
        `SELECT d.semana_id, ru.id as ruta_id
         FROM desafios d JOIN rutas ru ON ru.id = d.ruta_id
         WHERE ru.nombre = ? LIMIT 1`,
        [rutaDesafio.nombre]
      );
      if (rows.length === 0) {
        console.log(`⚠️  No se encontró la ruta "${rutaDesafio.nombre}" — ejecutá seedDesafios.js primero`);
        continue;
      }
      const { semana_id, ruta_id } = rows[0];
      semanaIds[rutaDesafio.nombre] = semana_id;
      const [estaciones] = await conn.execute(
        'SELECT * FROM estaciones WHERE ruta_id = ? ORDER BY posicion', [ruta_id]
      );
      await insertarRegistro(conn, ruta_id, 'MAQUINISTA_CAMUS',   rutaDesafio.bits.MARTIN, rutaDesafio.reportes.MARTIN, estaciones);
      await insertarRegistro(conn, ruta_id, 'LECTORA_DEL_TIEMPO', rutaDesafio.bits.ELENA,  rutaDesafio.reportes.ELENA,  estaciones);
      await insertarRegistro(conn, ruta_id, 'PASAJERO_ERRANTE',   rutaDesafio.bits.JULIAN, rutaDesafio.reportes.JULIAN, estaciones);

      // Marcar desafío como completado en los 3 perfiles
      for (const maquinista of ['MAQUINISTA_CAMUS', 'LECTORA_DEL_TIEMPO', 'PASAJERO_ERRANTE']) {
        const [p] = await conn.execute('SELECT id FROM perfiles WHERE maquinista = ?', [maquinista]);
        if (p.length > 0) {
          await conn.execute(
            'INSERT IGNORE INTO perfil_desafios_completados (perfil_id, semana_id) VALUES (?, ?)',
            [p[0].id, semana_id]
          );
        }
      }
    }

    // 6. Registros de Julián en rutas del muro
    console.log('🔍 Cargando registros de Julián en rutas del muro...');
    for (const reg of REGISTROS_JULIAN_MURO) {
      const [rutaRows] = await conn.execute('SELECT id FROM rutas WHERE nombre = ? LIMIT 1', [reg.rutaNombre]);
      if (rutaRows.length > 0) {
        const rutaId = rutaRows[0].id;
        const [estaciones] = await conn.execute('SELECT * FROM estaciones WHERE ruta_id = ? ORDER BY posicion', [rutaId]);
        await insertarRegistro(conn, rutaId, 'PASAJERO_ERRANTE', reg.bitacoras, reg.reporteFinal, estaciones);
      } else {
        console.log(`⚠️  Ruta "${reg.rutaNombre}" no encontrada — ejecutá seed.js primero`);
      }
    }

    // 7. Reseñas
    console.log('⭐ Cargando reseñas...');
    await insertarResenas(conn, 'MAQUINISTA_CAMUS',   RESENAS_MARTIN);
    await insertarResenas(conn, 'LECTORA_DEL_TIEMPO', RESENAS_ELENA);
    await insertarResenas(conn, 'PASAJERO_ERRANTE',   RESENAS_JULIAN);

    await conn.commit();
    console.log('');
    console.log('✅ Seed completado correctamente');
    console.log('   MAQUINISTA_CAMUS    / demo1234  — 2 rutas propias + 3 desafíos completados');
    console.log('   LECTORA_DEL_TIEMPO  / demo1234  — 2 rutas propias + 3 desafíos completados');
    console.log('   PASAJERO_ERRANTE    / demo1234  — 3 rutas muro + 3 desafíos abordados');

  } catch (err) {
    await conn.rollback();
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    conn.release();
    process.exit(0);
  }
};

seed();