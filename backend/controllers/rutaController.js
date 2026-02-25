const Ruta = require('../models/Ruta');

// Guardar nueva ruta despachada desde la Terminal
const despacharRuta = async (req, res) => {
  try {
    const nuevaRuta = new Ruta(req.body);
    const rutaGuardada = await nuevaRuta.save();
    res.status(201).json(rutaGuardada);
  } catch (error) {
    res.status(400).json({ message: "Error al validar el despacho", error: error.message });
  }
};

// Obtener rutas para el Muro (filtrando por públicas)
const obtenerMuro = async (req, res) => {
  try {
    const rutas = await Ruta.find({ "configuracion.esPublica": true })
                            .sort({ fechaDespacho: -1 });
    res.json(rutas);
  } catch (error) {
    res.status(500).json({ message: "Error al conectar con la vía de datos" });
  }
};

// Incrementar pasajeros (Abordar)
const abordarRuta = async (req, res) => {
  try {
    const { id } = req.params;
    const rutaActualizada = await Ruta.findByIdAndUpdate(
      id,
      { $inc: { pasajeros: 1 } },
      { new: true }
    );
    if (!rutaActualizada) {
      return res.status(404).json({ message: "Ruta no encontrada" });
    }
    res.json(rutaActualizada);
  } catch (error) {
    res.status(500).json({ message: "Error al abordar la unidad" });
  }
};

const obtenerRutaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const ruta = await Ruta.findById(id);
    if (!ruta) return res.status(404).json({ message: "Ruta no encontrada" });
    res.json(ruta);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la ruta" });
  }
};

module.exports = { despacharRuta, obtenerMuro, abordarRuta, obtenerRutaPorId };