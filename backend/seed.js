//seed.js: Script para cargar datos de prueba en la base de datos (5 rutas con estaciones)

const db = require('./db');

const rutasEjemplo = [
  {
    nombre: 'Línea de los Gigantes', pasajeros: 67,
    metodo: 'Kilometraje', esPublica: true,
    justificacion: 'Ruta de gran tonelaje, de menor a mayor.',
    estaciones: [
      { titulo: 'El Nombre del Viento',  autor: 'Patrick Rothfuss',  paginas: 662,  anio: 2007, portada: 'https://covers.openlibrary.org/b/id/8739161-M.jpg' },
      { titulo: 'Los Miserables',        autor: 'Victor Hugo',       paginas: 1400, anio: 1862, portada: 'https://covers.openlibrary.org/b/id/109652-M.jpg' },
      { titulo: 'Guerra y Paz',          autor: 'León Tolstói',      paginas: 1225, anio: 1869, portada: 'https://covers.openlibrary.org/b/id/8231459-M.jpg' },
    ],
  },
  {
    nombre: 'Expreso del Neón', pasajeros: 54,
    metodo: 'Cronología', esPublica: true,
    justificacion: 'Evolución del cyberpunk, ordenado por año.',
    estaciones: [
      { titulo: 'Neuromante',                               autor: 'William Gibson',    paginas: 271, anio: 1984, portada: 'https://covers.openlibrary.org/b/id/8739405-M.jpg' },
      { titulo: '¿Sueñan los androides con ovejas eléctricas?', autor: 'Philip K. Dick', paginas: 210, anio: 1968, portada: 'https://covers.openlibrary.org/b/id/8091016-M.jpg' },
      { titulo: 'Snow Crash',                               autor: 'Neal Stephenson',  paginas: 440, anio: 1992, portada: 'https://covers.openlibrary.org/b/id/7886428-M.jpg' },
    ],
  },
  {
    nombre: 'Ruta del Terror Gótico', pasajeros: 38,
    metodo: 'Cronología', esPublica: true,
    justificacion: 'El gótico victoriano en orden histórico.',
    estaciones: [
      { titulo: 'Frankenstein',                    autor: 'Mary Shelley',   paginas: 280, anio: 1818, portada: 'https://covers.openlibrary.org/b/id/8269561-M.jpg' },
      { titulo: 'Drácula',                         autor: 'Bram Stoker',    paginas: 418, anio: 1897, portada: 'https://covers.openlibrary.org/b/id/8457978-M.jpg' },
      { titulo: 'El extraño caso del Dr. Jekyll',  autor: 'R.L. Stevenson', paginas: 141, anio: 1886, portada: 'https://covers.openlibrary.org/b/id/8228691-M.jpg' },
      { titulo: 'El retrato de Dorian Gray',       autor: 'Oscar Wilde',    paginas: 254, anio: 1890, portada: 'https://covers.openlibrary.org/b/id/8301956-M.jpg' },
    ],
  },
  {
    nombre: 'Trasbordo Macondo', pasajeros: 71,
    metodo: 'Cronología', esPublica: true,
    justificacion: 'El Boom latinoamericano en orden de publicación.',
    estaciones: [
      { titulo: 'Cien años de soledad',    autor: 'Gabriel García Márquez', paginas: 471, anio: 1967, portada: 'https://covers.openlibrary.org/b/id/8228105-M.jpg' },
      { titulo: 'Rayuela',                 autor: 'Julio Cortázar',         paginas: 600, anio: 1963, portada: 'https://covers.openlibrary.org/b/id/8291037-M.jpg' },
      { titulo: 'La Casa de los Espíritus',autor: 'Isabel Allende',         paginas: 433, anio: 1982, portada: 'https://covers.openlibrary.org/b/id/8743007-M.jpg' },
      { titulo: 'Pedro Páramo',            autor: 'Juan Rulfo',             paginas: 124, anio: 1955, portada: 'https://covers.openlibrary.org/b/id/8371929-M.jpg' },
    ],
  },
  {
    nombre: 'Línea Noir', pasajeros: 45,
    metodo: 'Kilometraje', esPublica: true,
    justificacion: 'Del relato corto a la novela larga, el thriller en ascenso.',
    estaciones: [
      { titulo: 'El largo adiós',              autor: 'Raymond Chandler', paginas: 379, anio: 1953, portada: 'https://covers.openlibrary.org/b/id/8226197-M.jpg' },
      { titulo: 'El nombre de la rosa',        autor: 'Umberto Eco',      paginas: 502, anio: 1980, portada: 'https://covers.openlibrary.org/b/id/8775558-M.jpg' },
      { titulo: 'Los crímenes de la calle Morgue', autor: 'Edgar Allan Poe', paginas: 189, anio: 1841, portada: 'https://covers.openlibrary.org/b/id/8301956-M.jpg' },
    ],
  },
];

const seedDB = async () => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute('DELETE FROM estaciones');
    await conn.execute('DELETE FROM rutas');

    for (const r of rutasEjemplo) {
      const [res] = await conn.execute(
        `INSERT INTO rutas (nombre, metodo, es_publica, justificacion, pasajeros)
         VALUES (?, ?, ?, ?, ?)`,
        [r.nombre, r.metodo, r.esPublica ? 1 : 0, r.justificacion, r.pasajeros]
      );
      const rutaId = res.insertId;

      for (let i = 0; i < r.estaciones.length; i++) {
        const e = r.estaciones[i];
        await conn.execute(
          `INSERT INTO estaciones (ruta_id, posicion, titulo, autor, paginas, anio, portada)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [rutaId, i, e.titulo, e.autor, e.paginas, e.anio, e.portada]
        );
      }
    }

    await conn.commit();
    console.log('--- [SISTEMA]: Datos de prueba cargados correctamente (5 rutas) ---');
  } catch (err) {
    await conn.rollback();
    console.error(err);
    process.exit(1);
  } finally {
    conn.release();
    process.exit(0);
  }
};

seedDB();