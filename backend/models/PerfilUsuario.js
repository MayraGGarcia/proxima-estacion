const mongoose = require('mongoose');

const PerfilUsuarioSchema = new mongoose.Schema({
  maquinista: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  xp: {
    type: Number,
    default: 0
  },
  // Logros desbloqueados: array de IDs de logros
  logros: [{
    type: String
  }],
  // Desafíos completados: array de IDs de semana 
  desafiosCompletados: [{
    type: String
  }],
  // Contadores para evaluar logros
  rutasCompletadas: { type: Number, default: 0 },
  rutasAbordadas:   { type: Number, default: 0 },
  bitacorasEscritas: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('PerfilUsuario', PerfilUsuarioSchema);