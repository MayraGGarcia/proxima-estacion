//seedDesafios.js: Script para cargar desafíos semanales con rutas predefinidas y estaciones temáticas

const db = require('./db');

const rutasDesafio = [
  {
    nombre: 'El Gran Viaje Literario',
    metodo: 'Cronología', esPublica: true, justificacion: 'Sistema Automático', pasajeros: 1,
    estaciones: [
      { titulo: 'Don Quijote de la Mancha',  autor: 'Miguel de Cervantes',      paginas: 863, anio: 1605, portada: 'https://covers.openlibrary.org/b/id/8739161-M.jpg' },
      { titulo: 'Cien Años de Soledad',      autor: 'Gabriel García Márquez',   paginas: 496, anio: 1967, portada: 'https://covers.openlibrary.org/b/id/8228228-M.jpg' },
      { titulo: 'El Aleph',                  autor: 'Jorge Luis Borges',        paginas: 192, anio: 1949, portada: 'https://covers.openlibrary.org/b/id/9267864-M.jpg' },
    ],
  },
  {
    nombre: 'Distopías del Siglo XX',
    metodo: 'Cronología', esPublica: true, justificacion: 'Sistema Automático', pasajeros: 1,
    estaciones: [
      { titulo: '1984',                   autor: 'George Orwell',    paginas: 328, anio: 1949, portada: 'https://covers.openlibrary.org/b/id/8575708-M.jpg' },
      { titulo: 'Un Mundo Feliz',         autor: 'Aldous Huxley',    paginas: 311, anio: 1932, portada: 'https://covers.openlibrary.org/b/id/8406786-M.jpg' },
      { titulo: 'Fahrenheit 451',         autor: 'Ray Bradbury',     paginas: 256, anio: 1953, portada: 'https://covers.openlibrary.org/b/id/8228616-M.jpg' },
      { titulo: 'El Cuento de la Criada', autor: 'Margaret Atwood',  paginas: 311, anio: 1985, portada: 'https://covers.openlibrary.org/b/id/9176669-M.jpg' },
    ],
  },
  {
    nombre: 'Viaje al Centro del Yo',
    metodo: 'Cronología', esPublica: true, justificacion: 'Sistema Automático', pasajeros: 1,
    estaciones: [
      { titulo: 'El Extranjero', autor: 'Albert Camus',     paginas: 159, anio: 1942, portada: 'https://covers.openlibrary.org/b/id/8224161-M.jpg' },
      { titulo: 'La Náusea',    autor: 'Jean-Paul Sartre',  paginas: 251, anio: 1938, portada: 'https://covers.openlibrary.org/b/id/8406116-M.jpg' },
      { titulo: 'El Proceso',   autor: 'Franz Kafka',       paginas: 255, anio: 1925, portada: 'https://covers.openlibrary.org/b/id/8739208-M.jpg' },
    ],
  },
];

const getSemanaId = (fecha) => {
  const d = new Date(fecha);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getFullYear()}-W${String(weekNo).padStart(2, '0')}`;
};

const generarSemanas = (n) => {
  const semanas = [];
  const hoy = new Date();
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() - (hoy.getDay() === 0 ? 6 : hoy.getDay() - 1));
  lunes.setHours(0, 0, 0, 0);
  for (let i = 0; i < n; i++) {
    const inicio = new Date(lunes);
    inicio.setDate(lunes.getDate() + i * 7);
    const fin = new Date(inicio);
    fin.setDate(inicio.getDate() + 6);
    fin.setHours(23, 59, 59, 999);
    semanas.push({ inicio, fin, semanaId: getSemanaId(inicio) });
  }
  return semanas;
};

const seedDesafios = async () => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Limpiar desafíos anteriores
    await conn.execute('DELETE FROM desafios');
    console.log('🧹 Desafíos anteriores eliminados');

    const rutasCreadas = [];
    for (const rutaData of rutasDesafio) {
      // Reusar ruta si ya existe
      const [existe] = await conn.execute(
        'SELECT id FROM rutas WHERE nombre = ?', [rutaData.nombre]
      );

      let rutaId;
      if (existe.length > 0) {
        rutaId = existe[0].id;
        console.log(`♻️  Ruta reutilizada: ${rutaData.nombre}`);
      } else {
        const [res] = await conn.execute(
          `INSERT INTO rutas (nombre, metodo, es_publica, justificacion, pasajeros)
           VALUES (?, ?, ?, ?, ?)`,
          [rutaData.nombre, rutaData.metodo, 1, rutaData.justificacion, rutaData.pasajeros]
        );
        rutaId = res.insertId;

        for (let i = 0; i < rutaData.estaciones.length; i++) {
          const e = rutaData.estaciones[i];
          await conn.execute(
            `INSERT INTO estaciones (ruta_id, posicion, titulo, autor, paginas, anio, portada)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [rutaId, i, e.titulo, e.autor, e.paginas, e.anio, e.portada]
          );
        }
        console.log(`📚 Ruta creada: ${rutaData.nombre}`);
      }
      rutasCreadas.push({ id: rutaId, nombre: rutaData.nombre });
    }

    const titulos      = ['Protocolo Clásico Activado', 'Alerta Distópica', 'Misión Existencial'];
    const descripciones = [
      'Recorre los pilares de la literatura en español e hispanoamericana.',
      'Adentrate en los mundos que imaginaron el futuro más oscuro.',
      'Un viaje por la filosofía existencialista del siglo XX.',
    ];

    const semanas = generarSemanas(3);
    for (let i = 0; i < semanas.length; i++) {
      const { inicio, fin, semanaId } = semanas[i];
      const ruta = rutasCreadas[i % rutasCreadas.length];

      await conn.execute(
        `INSERT INTO desafios (semana_id, titulo, descripcion, ruta_id, xp_recompensa, fecha_inicio, fecha_fin)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [semanaId, titulos[i], descripciones[i], ruta.id, 150, inicio, fin]
      );
      console.log(`⚡ Desafío creado: ${semanaId} → ${ruta.nombre}`);
    }

    await conn.commit();
    console.log('✅ Seed de desafíos completado');
  } catch (err) {
    await conn.rollback();
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    conn.release();
    process.exit(0);
  }
};

seedDesafios();