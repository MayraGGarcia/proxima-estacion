//registroController.js: Lógica para manejar registros de rutas, bitácoras y reportes finales

const db = require('../db');

const publicarRegistro = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { rutaId, maquinista, bitacoras = [], reporteFinal } = req.body;

    const [rutas] = await conn.execute('SELECT id FROM rutas WHERE id = ?', [rutaId]);
    if (rutas.length === 0)
      return res.status(404).json({ message: 'Ruta no encontrada en la red' });

    await conn.beginTransaction();

    const [result] = await conn.execute(
      `INSERT INTO registros (ruta_id, maquinista, reporte_final)
       VALUES (?, ?, ?)`,
      [rutaId, maquinista, reporteFinal]
    );
    const registroId = result.insertId;

    for (let i = 0; i < bitacoras.length; i++) {
      const b = bitacoras[i];
      await conn.execute(
        `INSERT INTO bitacoras (registro_id, posicion, estacion_titulo, estacion_autor, texto)
         VALUES (?, ?, ?, ?, ?)`,
        [registroId, i, b.estacionTitulo ?? null, b.estacionAutor ?? null, b.texto ?? null]
      );
    }

    await conn.execute(
      'UPDATE rutas SET pasajeros = pasajeros + 1 WHERE id = ?',
      [rutaId]
    );

    await conn.commit();
    res.status(201).json({ id: registroId, rutaId, maquinista, reporteFinal, bitacoras });
  } catch (error) {
    await conn.rollback();
    res.status(400).json({ message: 'Error al publicar el registro', error: error.message });
  } finally {
    conn.release();
  }
};

const obtenerRegistrosPorRuta = async (req, res) => {
  try {
    const { rutaId } = req.params;

    const [registros] = await db.execute(
      `SELECT id, maquinista, reporte_final, fecha_finalizacion
       FROM registros
       WHERE ruta_id = ?
       ORDER BY fecha_finalizacion DESC`,
      [rutaId]
    );
    if (registros.length === 0) return res.json([]);

    const registroIds = registros.map(r => r.id);
    const [estaciones] = await db.execute(
      'SELECT * FROM estaciones WHERE ruta_id = ? ORDER BY posicion',
      [rutaId]
    );
    const [bitacoras] = await db.execute(
      `SELECT * FROM bitacoras
       WHERE registro_id IN (${registroIds.map(() => '?').join(',')})
       ORDER BY posicion`,
      registroIds
    );

    // Índice de estaciones por posición
    const estPorPosicion = {};
    for (const e of estaciones) {
      estPorPosicion[e.posicion] = e;
    }

    // Índice de bitácoras por registro y posición
    const bitsPorRegistro = {};
    for (const b of bitacoras) {
      if (!bitsPorRegistro[b.registro_id]) bitsPorRegistro[b.registro_id] = {};
      bitsPorRegistro[b.registro_id][b.posicion] = b;
    }

    const posiciones = Object.keys(estPorPosicion).map(Number).sort((a, b) => a - b);

    const resultado = registros.map(r => {
      const bits = bitsPorRegistro[r.id] || {};
      return {
        id:                r.id,
        maquinista:        r.maquinista,
        reporteFinal:      r.reporte_final,
        fechaFinalizacion: r.fecha_finalizacion,
        bitacoras: posiciones.map(pos => ({
          estacionTitulo: bits[pos]?.estacion_titulo || estPorPosicion[pos]?.titulo || '',
          estacionAutor:  bits[pos]?.estacion_autor  || estPorPosicion[pos]?.autor  || '',
          portada:        estPorPosicion[pos]?.portada || null,
          texto:          bits[pos]?.texto || '',
        })),
      };
    });

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los registros', error: error.message });
  }
};

const obtenerRegistrosPorMaquinista = async (req, res) => {
  try {
    const { maquinista } = req.params;

    // Query limpia sin JOIN de estaciones — evita multiplicación de filas
    const [registros] = await db.execute(
      `SELECT r.id, r.ruta_id, r.reporte_final, r.fecha_finalizacion,
              ru.nombre AS ruta_nombre
       FROM registros r
       JOIN rutas ru ON ru.id = r.ruta_id
       WHERE r.maquinista = ?
       ORDER BY r.fecha_finalizacion DESC`,
      [maquinista]
    );

    if (registros.length === 0) return res.json([]);

    const registroIds = registros.map(r => r.id);
    const rutaIds     = [...new Set(registros.map(r => r.ruta_id))];

    const [bitacoras] = await db.execute(
      `SELECT * FROM bitacoras
       WHERE registro_id IN (${registroIds.map(() => '?').join(',')})
       ORDER BY posicion`,
      registroIds
    );
    const [estaciones] = await db.execute(
      `SELECT * FROM estaciones
       WHERE ruta_id IN (${rutaIds.map(() => '?').join(',')})
       ORDER BY posicion`,
      rutaIds
    );

    // Índice bitácoras: { registro_id: { posicion: bitacora } }
    const bitsPorRegistro = {};
    for (const b of bitacoras) {
      if (!bitsPorRegistro[b.registro_id]) bitsPorRegistro[b.registro_id] = {};
      bitsPorRegistro[b.registro_id][b.posicion] = b;
    }

    // Índice estaciones: { ruta_id: { posicion: estacion } }
    const estsPorRuta = {};
    for (const e of estaciones) {
      if (!estsPorRuta[e.ruta_id]) estsPorRuta[e.ruta_id] = {};
      estsPorRuta[e.ruta_id][e.posicion] = e;
    }

    const historial = registros.map(r => {
      const ests = estsPorRuta[r.ruta_id] || {};
      const bits = bitsPorRegistro[r.id]  || {};
      const posiciones = Object.keys(ests).map(Number).sort((a, b) => a - b);

      return {
        id:     r.id,
        rutaId: r.ruta_id,
        titulo: r.ruta_nombre || 'Ruta eliminada',
        estaciones: posiciones.map(pos => ({
          titulo:     ests[pos]?.titulo  || '',
          autor:      ests[pos]?.autor   || '',
          portada:    ests[pos]?.portada || null,
          paginas:    ests[pos]?.paginas || null,
          año:        ests[pos]?.anio    || null,
          completada: true,
          bitacora:   bits[pos]?.texto   || '',
        })),
        reporteFinal:      r.reporte_final,
        fechaFinalizacion: r.fecha_finalizacion,
      };
    });

    res.json(historial);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener historial', error: error.message });
  }
};

module.exports = { publicarRegistro, obtenerRegistrosPorRuta, obtenerRegistrosPorMaquinista };