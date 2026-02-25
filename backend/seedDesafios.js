const mongoose = require('mongoose');
const Ruta = require('./models/Ruta');
const Desafio = require('./models/Desafio');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://mgg_dev_user:mongopass1@cluster0.apzxdus.mongodb.net/proximaEstacion?retryWrites=true&w=majority";

// Rutas especiales para desafíos semanales
const rutasDesafio = [
  {
    nombre: "El Gran Viaje Literario",
    estaciones: [
      { titulo: "Don Quijote de la Mancha", autor: "Miguel de Cervantes", paginas: 863, año: 1605, portada: "https://covers.openlibrary.org/b/id/8739161-M.jpg" },
      { titulo: "Cien Años de Soledad",     autor: "Gabriel García Márquez", paginas: 496, año: 1967, portada: "https://covers.openlibrary.org/b/id/8228228-M.jpg" },
      { titulo: "El Aleph",                 autor: "Jorge Luis Borges",       paginas: 192, año: 1949, portada: "https://covers.openlibrary.org/b/id/9267864-M.jpg" },
    ],
    configuracion: { metodo: 'Cronología', esPublica: true, justificacion: 'Sistema Automático' },
    pasajeros: 1
  },
  {
    nombre: "Distopías del Siglo XX",
    estaciones: [
      { titulo: "1984",                autor: "George Orwell",   paginas: 328, año: 1949, portada: "https://covers.openlibrary.org/b/id/8575708-M.jpg" },
      { titulo: "Un Mundo Feliz",      autor: "Aldous Huxley",   paginas: 311, año: 1932, portada: "https://covers.openlibrary.org/b/id/8406786-M.jpg" },
      { titulo: "Fahrenheit 451",      autor: "Ray Bradbury",    paginas: 256, año: 1953, portada: "https://covers.openlibrary.org/b/id/8228616-M.jpg" },
      { titulo: "El Cuento de la Criada", autor: "Margaret Atwood", paginas: 311, año: 1985, portada: "https://covers.openlibrary.org/b/id/9176669-M.jpg" },
    ],
    configuracion: { metodo: 'Cronología', esPublica: true, justificacion: 'Sistema Automático' },
    pasajeros: 1
  },
  {
    nombre: "Viaje al Centro del Yo",
    estaciones: [
      { titulo: "El Extranjero",       autor: "Albert Camus",       paginas: 159, año: 1942, portada: "https://covers.openlibrary.org/b/id/8224161-M.jpg" },
      { titulo: "La Náusea",           autor: "Jean-Paul Sartre",   paginas: 251, año: 1938, portada: "https://covers.openlibrary.org/b/id/8406116-M.jpg" },
      { titulo: "El Proceso",          autor: "Franz Kafka",        paginas: 255, año: 1925, portada: "https://covers.openlibrary.org/b/id/8739208-M.jpg" },
    ],
    configuracion: { metodo: 'Cronología', esPublica: true, justificacion: 'Sistema Automático' },
    pasajeros: 1
  },
];

// Calcular la semana ISO de una fecha
const getSemanaId = (fecha) => {
  const d = new Date(fecha);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getFullYear()}-W${String(weekNo).padStart(2, '0')}`;
};

// Generar fechas para las próximas N semanas desde hoy
const generarSemanas = (n) => {
  const semanas = [];
  const hoy = new Date();
  // Ir al lunes de esta semana
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

async function seedDesafios() {
  await mongoose.connect(MONGO_URI);
  console.log('🟢 Conectado');

  // Limpiar desafíos anteriores
  await Desafio.deleteMany({});
  console.log('🧹 Desafíos anteriores eliminados');

  // Crear las rutas de desafío (o reusar si ya existen)
  const rutasCreadas = [];
  for (const rutaData of rutasDesafio) {
    let ruta = await Ruta.findOne({ nombre: rutaData.nombre });
    if (!ruta) {
      ruta = await Ruta.create(rutaData);
      console.log(`📚 Ruta creada: ${ruta.nombre}`);
    } else {
      console.log(`♻️  Ruta reutilizada: ${ruta.nombre}`);
    }
    rutasCreadas.push(ruta);
  }

  // Crear desafíos para las próximas 3 semanas (rota entre las rutas)
  const semanas = generarSemanas(3);
  for (let i = 0; i < semanas.length; i++) {
    const { inicio, fin, semanaId } = semanas[i];
    const ruta = rutasCreadas[i % rutasCreadas.length];
    const titulos = [
      'Protocolo Clásico Activado',
      'Alerta Distópica',
      'Misión Existencial'
    ];
    const descripciones = [
      'Recorre los pilares de la literatura en español e hispanoamericana.',
      'Adentrate en los mundos que imaginaron el futuro más oscuro.',
      'Un viaje por la filosofía existencialista del siglo XX.'
    ];

    await Desafio.create({
      semanaId,
      titulo: titulos[i % titulos.length],
      descripcion: descripciones[i % descripciones.length],
      rutaId: ruta._id,
      xpRecompensa: 150,
      fechaInicio: inicio,
      fechaFin: fin
    });
    console.log(`⚡ Desafío creado: ${semanaId} → ${ruta.nombre}`);
  }

  console.log('✅ Seed de desafíos completado');
  await mongoose.disconnect();
}

seedDesafios().catch(console.error);