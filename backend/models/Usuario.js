const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  maquinista: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Usuario', UsuarioSchema);