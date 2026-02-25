const Registro = require('../models/Registro');
const Ruta = require('../models/Ruta');

// Guardar el registro completo de un maquinista al finalizar una ruta
const publicarRegistro = async (req, res) => {
  try {
    const { rutaId, maquinista, bitacoras, reporteFinal } = req.body;

    // Verificar que el rutaId es un ObjectId válido antes de buscar
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(rutaId)) {
      return res.status(400).json({ 
        message: "ID de ruta inválido. La ruta debe estar guardada en el servidor antes de poder registrar una bitácora.",
        rutaId 
      });
    }

    const ruta = await Ruta.findById(rutaId);
    if (!ruta) {
      return res.status(404).json({ message: "Ruta no encontrada en la red" });
    }

    const nuevoRegistro = new Registro({ rutaId, maquinista, bitacoras, reporteFinal });
    const registroGuardado = await nuevoRegistro.save();

    await Ruta.findByIdAndUpdate(rutaId, { $inc: { pasajeros: 1 } });

    res.status(201).json(registroGuardado);
  } catch (error) {
    res.status(400).json({ message: "Error al publicar el registro", error: error.message });
  }
};

// Obtener todos los registros de una ruta específica (el muro de esa ruta)
const obtenerRegistrosPorRuta = async (req, res) => {
  try {
    const { rutaId } = req.params;
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(rutaId)) {
      return res.json([]); // ID local, no hay registros en el servidor
    }
    const registros = await Registro.find({ rutaId }).sort({ fechaFinalizacion: -1 });
    res.json(registros);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los registros" });
  }
};

module.exports = { publicarRegistro, obtenerRegistrosPorRuta };