const mongoose = require('mongoose');
const Ruta = require('./models/Ruta'); 
require('dotenv').config();

const rutasEjemplo = [
  {
    nombre: "Línea de los Gigantes",
    pasajeros: 1540,
    estaciones: [
      { titulo: "El Nombre del Viento", autor: "Patrick Rothfuss", paginas: 662, año: 2007, portada: "https://covers.openlibrary.org/b/id/8739161-M.jpg" },
      { titulo: "Los Miserables", autor: "Victor Hugo", paginas: 1400, año: 1862, portada: "https://m.media-amazon.com/images/I/81P6p2O6SML.jpg" },
      { titulo: "Guerra y Paz", autor: "León Tolstói", paginas: 1225, año: 1869, portada: "https://m.media-amazon.com/images/I/71Onp8Oas8L.jpg" }
    ],
    configuracion: { metodo: "Kilometraje", esPublica: true, justificacion: "Ruta de gran tonelaje, de menor a mayor." }
  },
  {
    nombre: "Expreso del Neón",
    pasajeros: 2800,
    estaciones: [
      { titulo: "Neuromante", autor: "William Gibson", paginas: 271, año: 1984, portada: "https://m.media-amazon.com/images/I/91SleS993gL.jpg" },
      { titulo: "¿Sueñan los androides con ovejas eléctricas?", autor: "Philip K. Dick", paginas: 210, año: 1968, portada: "https://covers.openlibrary.org/b/id/8091016-M.jpg" },
      { titulo: "Snow Crash", autor: "Neal Stephenson", paginas: 440, año: 1992, portada: "https://covers.openlibrary.org/b/id/8739405-M.jpg" }
    ],
    configuracion: { metodo: "Cronología", esPublica: true, justificacion: "Evolución del cyberpunk, ordenado por año." }
  },
  {
    nombre: "Ruta del Terror Gótico",
    pasajeros: 980,
    estaciones: [
      { titulo: "Frankenstein", autor: "Mary Shelley", paginas: 280, año: 1818, portada: "https://covers.openlibrary.org/b/id/8739161-M.jpg" },
      { titulo: "Drácula", autor: "Bram Stoker", paginas: 418, año: 1897, portada: "https://covers.openlibrary.org/b/id/8091016-M.jpg" },
      { titulo: "El extraño caso del Dr. Jekyll", autor: "R.L. Stevenson", paginas: 141, año: 1886, portada: "https://covers.openlibrary.org/b/id/8739405-M.jpg" },
      { titulo: "El retrato de Dorian Gray", autor: "Oscar Wilde", paginas: 254, año: 1890, portada: "https://covers.openlibrary.org/b/id/8739161-M.jpg" }
    ],
    configuracion: { metodo: "Cronología", esPublica: true, justificacion: "El gótico victoriano en orden histórico." }
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Ruta.deleteMany({}); 
    await Ruta.insertMany(rutasEjemplo);
    console.log("--- [SISTEMA]: Datos de prueba cargados correctamente (3 rutas válidas) ---");
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();