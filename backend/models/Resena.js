const mongoose = require('mongoose');

const ResenaSchema = new mongoose.Schema({
  // Identificación del libro (usamos título + autor como clave natural)
  libroTitulo: {
    type: String,
    required: true,
    trim: true
  },
  libroAutor: {
    type: String,
    required: true,
    trim: true
  },
  libroPortada: {
    type: String,
    default: null
  },
  libroPaginas: {
    type: Number,
    default: null
  },
  libroAño: {
    type: Number,
    default: null
  },
  // Quién escribe la reseña
  maquinista: {
    type: String,
    required: true,
    trim: true
  },
  // Puntuación de 1 a 5 estrellas
  estrellas: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  // Texto de la reseña
  texto: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

// Índice único: un maquinista solo puede reseñar un libro una vez
ResenaSchema.index({ libroTitulo: 1, maquinista: 1 }, { unique: true });

module.exports = mongoose.model('Resena', ResenaSchema);