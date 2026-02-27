const Resena = require('../models/Resena');

// Crear o actualizar la reseña de un maquinista sobre un libro
const crearResena = async (req, res) => {
  try {
    const { libroTitulo, libroAutor, libroPortada, libroPaginas, libroAño, maquinista, estrellas, texto } = req.body;

    if (!libroTitulo || !libroAutor || !maquinista || !estrellas || !texto) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const resena = await Resena.findOneAndUpdate(
      { libroTitulo, maquinista },
      { libroTitulo, libroAutor, libroPortada, libroPaginas, libroAño, maquinista, estrellas, texto },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json(resena);
  } catch (err) {
    res.status(400).json({ message: 'Error al guardar la reseña', error: err.message });
  }
};

// Obtener todas las reseñas de un libro específico
const obtenerResenasPorLibro = async (req, res) => {
  try {
    const { libroTitulo } = req.params;
    const resenas = await Resena.find({ 
      libroTitulo: { $regex: new RegExp(`^${libroTitulo}$`, 'i') } 
    }).sort({ createdAt: -1 });

    // Calcular promedio de estrellas
    const promedio = resenas.length > 0
      ? (resenas.reduce((acc, r) => acc + r.estrellas, 0) / resenas.length).toFixed(1)
      : null;

    res.json({ resenas, promedio, total: resenas.length });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener reseñas', error: err.message });
  }
};

// Obtener todas las reseñas escritas por un maquinista (para el Perfil)
const obtenerResenasPorMaquinista = async (req, res) => {
  try {
    const { maquinista } = req.params;
    const resenas = await Resena.find({ maquinista }).sort({ createdAt: -1 });
    res.json(resenas);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener reseñas del maquinista', error: err.message });
  }
};

// Eliminar la reseña de un maquinista sobre un libro
const eliminarResena = async (req, res) => {
  try {
    const { libroTitulo, maquinista } = req.params;
    await Resena.findOneAndDelete({ libroTitulo, maquinista });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar reseña', error: err.message });
  }
};

module.exports = { crearResena, obtenerResenasPorLibro, obtenerResenasPorMaquinista, eliminarResena };