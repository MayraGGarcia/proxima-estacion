const mongoose = require('mongoose');

// Un Registro es el recorrido completo de UN maquinista sobre UNA ruta.
// Muchos maquinistas pueden tener registros de la misma ruta.
const RegistroSchema = new mongoose.Schema({
  rutaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ruta',
    required: true
  },
  maquinista: {
    type: String,
    required: true,
    trim: true
  },
  // Bitácoras por estación: cada entrada corresponde a una estación de la ruta
  bitacoras: [{
    estacionTitulo: String,
    estacionAutor: String,
    texto: String
  }],
  // Reporte final escrito al terminar todas las estaciones
  reporteFinal: {
    type: String,
    required: true
  },
  fechaFinalizacion: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Registro', RegistroSchema);