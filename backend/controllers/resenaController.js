//resenaController.js: Lógica para manejar reseñas de libros

const db = require('../db');

const crearResena = async (req, res) => {
  try {
    const { libroTitulo, libroAutor, libroPortada, libroPaginas,
            libroAño, maquinista, estrellas, texto } = req.body;

    if (!libroTitulo || !maquinista || !estrellas || !texto)
      return res.status(400).json({ message: 'Faltan campos obligatorios' });

    await db.execute(
      `INSERT INTO resenas
         (libro_titulo, libro_autor, libro_portada, libro_paginas, libro_anio, maquinista, estrellas, texto)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         libro_autor   = VALUES(libro_autor),
         libro_portada = VALUES(libro_portada),
         libro_paginas = VALUES(libro_paginas),
         libro_anio    = VALUES(libro_anio),
         estrellas     = VALUES(estrellas),
         texto         = VALUES(texto),
         updated_at    = CURRENT_TIMESTAMP`,
      [libroTitulo, libroAutor ?? null, libroPortada ?? null,
       libroPaginas ?? null, libroAño ?? null, maquinista, estrellas, texto]
    );

    const [rows] = await db.execute(
      'SELECT * FROM resenas WHERE libro_titulo = ? AND maquinista = ?',
      [libroTitulo, maquinista]
    );

    res.status(201).json(mapearResena(rows[0]));
  } catch (err) {
    res.status(400).json({ message: 'Error al guardar la reseña', error: err.message });
  }
};

const obtenerResenasPorLibro = async (req, res) => {
  try {
    const { libroTitulo } = req.params;
    const [resenas] = await db.execute(
      'SELECT * FROM resenas WHERE libro_titulo = ? ORDER BY created_at DESC',
      [libroTitulo]
    );

    const mapeadas = resenas.map(mapearResena);
    const promedio = mapeadas.length > 0
      ? (mapeadas.reduce((acc, r) => acc + r.estrellas, 0) / mapeadas.length).toFixed(1)
      : null;

    res.json({ resenas: mapeadas, promedio, total: mapeadas.length });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener reseñas' });
  }
};

const obtenerResenasPorMaquinista = async (req, res) => {
  try {
    const { maquinista } = req.params;
    const [resenas] = await db.execute(
      'SELECT * FROM resenas WHERE maquinista = ? ORDER BY created_at DESC',
      [maquinista]
    );
    res.json(resenas.map(mapearResena));
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener reseñas del maquinista' });
  }
};

const eliminarResena = async (req, res) => {
  try {
    const { libroTitulo, maquinista } = req.params;
    await db.execute(
      'DELETE FROM resenas WHERE libro_titulo = ? AND maquinista = ?',
      [libroTitulo, maquinista]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar reseña' });
  }
};

// Helper: snake_case → camelCase
const mapearResena = (r) => ({
  id:           r.id,
  libroTitulo:  r.libro_titulo,
  libroAutor:   r.libro_autor,
  libroPortada: r.libro_portada,
  libroPaginas: r.libro_paginas,
  libroAño:     r.libro_anio,
  maquinista:   r.maquinista,
  estrellas:    r.estrellas,
  texto:        r.texto,
  createdAt:    r.created_at,
  updatedAt:    r.updated_at,
});

module.exports = { crearResena, obtenerResenasPorLibro, obtenerResenasPorMaquinista, eliminarResena };