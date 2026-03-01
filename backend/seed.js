const mongoose = require('mongoose');
const Ruta = require('./models/Ruta'); 
require('dotenv').config();

const rutasEjemplo = [
  {
    nombre: "Línea de los Gigantes",
    pasajeros: 67,
    estaciones: [
      { titulo: "El Nombre del Viento", autor: "Patrick Rothfuss", paginas: 662, año: 2007, portada: "https://covers.openlibrary.org/b/id/8739161-M.jpg" },
      { titulo: "Los Miserables", autor: "Victor Hugo", paginas: 1400, año: 1862, portada: "https://covers.openlibrary.org/b/id/109652-M.jpg" },
      { titulo: "Guerra y Paz", autor: "León Tolstói", paginas: 1225, año: 1869, portada: "https://covers.openlibrary.org/b/id/8231459-M.jpg" }
    ],
    configuracion: { metodo: "Kilometraje", esPublica: true, justificacion: "Ruta de gran tonelaje, de menor a mayor." }
  },
  {
    nombre: "Expreso del Neón",
    pasajeros: 54,
    estaciones: [
      { titulo: "Neuromante", autor: "William Gibson", paginas: 271, año: 1984, portada: "https://covers.openlibrary.org/b/id/8739405-M.jpg" },
      { titulo: "¿Sueñan los androides con ovejas eléctricas?", autor: "Philip K. Dick", paginas: 210, año: 1968, portada: "https://covers.openlibrary.org/b/id/8091016-M.jpg" },
      { titulo: "Snow Crash", autor: "Neal Stephenson", paginas: 440, año: 1992, portada: "https://covers.openlibrary.org/b/id/7886428-M.jpg" }
    ],
    configuracion: { metodo: "Cronología", esPublica: true, justificacion: "Evolución del cyberpunk, ordenado por año." }
  },
  {
    nombre: "Ruta del Terror Gótico",
    pasajeros: 38,
    estaciones: [
      { titulo: "Frankenstein", autor: "Mary Shelley", paginas: 280, año: 1818, portada: "https://covers.openlibrary.org/b/id/8269561-M.jpg" },
      { titulo: "Drácula", autor: "Bram Stoker", paginas: 418, año: 1897, portada: "https://covers.openlibrary.org/b/id/8457978-M.jpg" },
      { titulo: "El extraño caso del Dr. Jekyll", autor: "R.L. Stevenson", paginas: 141, año: 1886, portada: "https://covers.openlibrary.org/b/id/8228691-M.jpg" },
      { titulo: "El retrato de Dorian Gray", autor: "Oscar Wilde", paginas: 254, año: 1890, portada: "https://covers.openlibrary.org/b/id/8301956-M.jpg" }
    ],
    configuracion: { metodo: "Cronología", esPublica: true, justificacion: "El gótico victoriano en orden histórico." }
  },
  {
    nombre: "Trasbordo Macondo",
    pasajeros: 71,
    estaciones: [
      { titulo: "Cien años de soledad", autor: "Gabriel García Márquez", paginas: 471, año: 1967, portada: "https://covers.openlibrary.org/b/id/8228105-M.jpg" },
      { titulo: "Rayuela", autor: "Julio Cortázar", paginas: 600, año: 1963, portada: "https://covers.openlibrary.org/b/id/8291037-M.jpg" },
      { titulo: "La Casa de los Espíritus", autor: "Isabel Allende", paginas: 433, año: 1982, portada: "https://covers.openlibrary.org/b/id/8743007-M.jpg" },
      { titulo: "Pedro Páramo", autor: "Juan Rulfo", paginas: 124, año: 1955, portada: "https://covers.openlibrary.org/b/id/8371929-M.jpg" }
    ],
    configuracion: { metodo: "Cronología", esPublica: true, justificacion: "El Boom latinoamericano en orden de publicación." }
  },
  {
    nombre: "Línea Noir",
    pasajeros: 45,
    estaciones: [
      { titulo: "El largo adiós", autor: "Raymond Chandler", paginas: 379, año: 1953, portada: "https://covers.openlibrary.org/b/id/8226197-M.jpg" },
      { titulo: "El nombre de la rosa", autor: "Umberto Eco", paginas: 502, año: 1980, portada: "https://covers.openlibrary.org/b/id/8775558-M.jpg" },
      { titulo: "Los crímenes de la calle Morgue", autor: "Edgar Allan Poe", paginas: 189, año: 1841, portada: "https://covers.openlibrary.org/b/id/8301956-M.jpg" }
    ],
    configuracion: { metodo: "Kilometraje", esPublica: true, justificacion: "Del relato corto a la novela larga, el thriller en ascenso." }
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Ruta.deleteMany({}); 
    await Ruta.insertMany(rutasEjemplo);
    console.log("--- [SISTEMA]: Datos de prueba cargados correctamente (5 rutas válidas) ---");
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();