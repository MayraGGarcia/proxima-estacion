const mongoose = require('mongoose');

// Desafíos semanales: cada uno apunta a una ruta específica
const DesafioSchema = new mongoose.Schema({
  semanaId: {
    type: String,  
    required: true,
    unique: true
  },
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  rutaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ruta',
    required: true
  },
  xpRecompensa: { type: Number, default: 150 },
  fechaInicio: { type: Date, required: true },
  fechaFin:    { type: Date, required: true }
});

module.exports = mongoose.model('Desafio', DesafioSchema);