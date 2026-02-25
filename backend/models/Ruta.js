const mongoose = require('mongoose');

const RutaSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true,
    trim: true 
  },
  estaciones: [{
    titulo: String,
    autor: String,
    paginas: Number,
    año: Number,
    portada: String
  }],
  configuracion: {
    metodo: { 
      type: String, 
      enum: ['Manual', 'Kilometraje', 'Cronología'],
      default: 'Manual' 
    },
    esPublica: { 
      type: Boolean, 
      default: true 
    },
    justificacion: { 
      type: String,
      required: function() { return this.configuracion.metodo === 'Manual'; }
    }
  },
  pasajeros: { 
    type: Number, 
    default: 1 
  },
  fechaDespacho: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Ruta', RutaSchema);