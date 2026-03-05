//rutaController.js: Lógica para manejar rutas, estaciones y muro de rutas

const db = require('../db');

// Helper: reconstruir objeto ruta desde filas SQL
const buildRuta = (ruta, estaciones = []) => ({
  id:       ruta.id,
  nombre:   ruta.nombre,
  configuracion: {
    metodo:        ruta.metodo,
    esPublica:     !!ruta.es_publica,
    justificacion: ruta.justificacion,
  },
  pasajeros:      ruta.pasajeros,
  fechaDespacho:  ruta.fecha_despacho,
  estaciones: estaciones
    .sort((a, b) => a.posicion - b.posicion)
    .map(e => ({
      titulo:  e.titulo,
      autor:   e.autor,
      paginas: e.paginas,
      año:     e.anio,
      portada: e.portada,
    })),
});

const despacharRuta = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { nombre, estaciones = [], configuracion = {}, pasajeros } = req.body;

    await conn.beginTransaction();

    const [result] = await conn.execute(
      `INSERT INTO rutas (nombre, metodo, es_publica, justificacion, pasajeros)
       VALUES (?, ?, ?, ?, ?)`,
      [
        nombre,
        configuracion.metodo     ?? 'Manual',
        configuracion.esPublica  ?? true ? 1 : 0,
        configuracion.justificacion ?? null,
        pasajeros ?? 1,
      ]
    );
    const rutaId = result.insertId;

    for (let i = 0; i < estaciones.length; i++) {
      const e = estaciones[i];
      await conn.execute(
        `INSERT INTO estaciones (ruta_id, posicion, titulo, autor, paginas, anio, portada)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [rutaId, i, e.titulo ?? null, e.autor ?? null,
         e.paginas ?? null, e.año ?? null, e.portada ?? null]
      );
    }

    await conn.commit();

    const [rutas] = await conn.execute('SELECT * FROM rutas WHERE id = ?', [rutaId]);
    const [ests]  = await conn.execute('SELECT * FROM estaciones WHERE ruta_id = ?', [rutaId]);

    res.status(201).json(buildRuta(rutas[0], ests));
  } catch (error) {
    await conn.rollback();
    res.status(400).json({ message: 'Error al validar el despacho', error: error.message });
  } finally {
    conn.release();
  }
};

const obtenerMuro = async (req, res) => {
  try {
    const [rutas] = await db.execute(
      'SELECT * FROM rutas WHERE es_publica = 1 ORDER BY fecha_despacho DESC'
    );
    if (rutas.length === 0) return res.json([]);

    const ids = rutas.map(r => r.id);
    const [estaciones] = await db.execute(
      `SELECT * FROM estaciones WHERE ruta_id IN (${ids.map(() => '?').join(',')})`,
      ids
    );

    const estPorRuta = {};
    for (const e of estaciones) {
      if (!estPorRuta[e.ruta_id]) estPorRuta[e.ruta_id] = [];
      estPorRuta[e.ruta_id].push(e);
    }

    res.json(rutas.map(r => buildRuta(r, estPorRuta[r.id] || [])));
  } catch (error) {
    res.status(500).json({ message: 'Error al conectar con la vía de datos' });
  }
};

const abordarRuta = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      'UPDATE rutas SET pasajeros = pasajeros + 1 WHERE id = ?',
      [id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Ruta no encontrada' });

    const [rutas] = await db.execute('SELECT * FROM rutas WHERE id = ?', [id]);
    const [ests]  = await db.execute('SELECT * FROM estaciones WHERE ruta_id = ?', [id]);

    res.json(buildRuta(rutas[0], ests));
  } catch (error) {
    res.status(500).json({ message: 'Error al abordar la unidad' });
  }
};

const obtenerRutaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [rutas] = await db.execute('SELECT * FROM rutas WHERE id = ?', [id]);
    if (rutas.length === 0)
      return res.status(404).json({ message: 'Ruta no encontrada' });

    const [ests] = await db.execute(
      'SELECT * FROM estaciones WHERE ruta_id = ? ORDER BY posicion',
      [id]
    );
    res.json(buildRuta(rutas[0], ests));
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la ruta' });
  }
};

module.exports = { despacharRuta, obtenerMuro, abordarRuta, obtenerRutaPorId };