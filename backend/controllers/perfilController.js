//perfilController.js: Lógica para manejar perfiles, logros y desafíos

const db = require('../db');

const LOGROS_DEFINICION = [
  { id: 'primera_salida',   nombre: 'Primera Salida',   icono: '🚂', descripcion: 'Completar tu primera ruta',          check: (p) => p.rutas_completadas >= 1 },
  { id: 'bibliofilo',       nombre: 'Bibliófilo',        icono: '📚', descripcion: 'Completar 3 rutas',                 check: (p) => p.rutas_completadas >= 3 },
  { id: 'desafio_cumplido', nombre: 'Desafío Cumplido',  icono: '⚡', descripcion: 'Completar un desafío semanal',       check: (p) => p.desafiosCompletados.length >= 1 },
  { id: 'explorador',       nombre: 'Explorador',        icono: '🗺️', descripcion: 'Abordar 3 rutas de otros usuarios', check: (p) => p.rutas_abordadas >= 3 },
  { id: 'cronista',         nombre: 'Cronista',          icono: '✍️', descripcion: 'Escribir 10 bitácoras',             check: (p) => p.bitacoras_escritas >= 10 },
];

const NIVELES = [
  { nombre: 'TRAINEE',         xpMin: 0    },
  { nombre: 'PASAJERO',        xpMin: 100  },
  { nombre: 'CONDUCTOR',       xpMin: 300  },
  { nombre: 'MAQUINISTA',      xpMin: 600  },
  { nombre: 'MAQUINISTA_JEFE', xpMin: 1000 },
];

const calcularNivel = (xp) => {
  let nivel = NIVELES[0];
  for (const n of NIVELES) if (xp >= n.xpMin) nivel = n;
  const idx = NIVELES.indexOf(nivel);
  const siguiente = NIVELES[idx + 1] || null;
  return {
    nombre:          nivel.nombre,
    xpActual:        xp,
    xpNivelActual:   nivel.xpMin,
    xpSiguienteNivel: siguiente?.xpMin || null,
    progreso: siguiente
      ? Math.round(((xp - nivel.xpMin) / (siguiente.xpMin - nivel.xpMin)) * 100)
      : 100,
  };
};

// Obtener o crear perfil; retorna { perfil, logros[], desafios[] }
const _cargarPerfil = async (conn, maquinista) => {
  let [rows] = await conn.execute(
    'SELECT * FROM perfiles WHERE maquinista = ?', [maquinista]
  );
  if (rows.length === 0) {
    await conn.execute('INSERT INTO perfiles (maquinista) VALUES (?)', [maquinista]);
    [rows] = await conn.execute('SELECT * FROM perfiles WHERE maquinista = ?', [maquinista]);
  }
  const perfil = rows[0];

  const [logros] = await conn.execute(
    'SELECT logro_id FROM perfil_logros WHERE perfil_id = ?', [perfil.id]
  );
  const [desafios] = await conn.execute(
    'SELECT semana_id FROM perfil_desafios_completados WHERE perfil_id = ?', [perfil.id]
  );

  perfil.logros               = logros.map(l => l.logro_id);
  perfil.desafiosCompletados  = desafios.map(d => d.semana_id);
  return perfil;
};

const evaluarLogros = async (conn, perfil) => {
  const nuevos = [];
  for (const logro of LOGROS_DEFINICION) {
    if (!perfil.logros.includes(logro.id) && logro.check(perfil)) {
      await conn.execute(
        'INSERT IGNORE INTO perfil_logros (perfil_id, logro_id) VALUES (?, ?)',
        [perfil.id, logro.id]
      );
      perfil.logros.push(logro.id);
      nuevos.push(logro);
    }
  }
  return nuevos;
};

const obtenerPerfil = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { maquinista } = req.params;
    const perfil = await _cargarPerfil(conn, maquinista);
    const nivel  = calcularNivel(perfil.xp);
    const logrosCompletos = LOGROS_DEFINICION.map(l => ({
      ...l,
      desbloqueado: perfil.logros.includes(l.id),
    }));
    res.json({ ...perfil, nivel, logrosCompletos });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener perfil', error: err.message });
  } finally {
    conn.release();
  }
};

const sumarXP = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { maquinista } = req.params;
    const { cantidad, motivo, desafioId, bitacorasNuevas } = req.body;

    await conn.beginTransaction();

    const perfil = await _cargarPerfil(conn, maquinista);

    // Construir SET dinámico
    let xpTotal = perfil.xp + cantidad;
    let sets = ['xp = ?'];
    let vals = [xpTotal];

    if (motivo === 'ruta_completada') {
      sets.push('rutas_completadas = rutas_completadas + 1');
      sets.push('bitacoras_escritas = bitacoras_escritas + ?');
      vals.push(bitacorasNuevas || 0);
      perfil.rutas_completadas   += 1;
      perfil.bitacoras_escritas  += (bitacorasNuevas || 0);
    }
    if (motivo === 'ruta_abordada') {
      sets.push('rutas_abordadas = rutas_abordadas + 1');
      perfil.rutas_abordadas += 1;
    }
    if (motivo === 'desafio_completado' && desafioId) {
      if (!perfil.desafiosCompletados.includes(desafioId)) {
        await conn.execute(
          'INSERT IGNORE INTO perfil_desafios_completados (perfil_id, semana_id) VALUES (?, ?)',
          [perfil.id, desafioId]
        );
        perfil.desafiosCompletados.push(desafioId);
      }
    }

    vals.push(perfil.id);
    await conn.execute(
      `UPDATE perfiles SET ${sets.join(', ')} WHERE id = ?`, vals
    );
    perfil.xp = xpTotal;

    const logrosNuevos = await evaluarLogros(conn, perfil);
    await conn.commit();

    const nivel = calcularNivel(perfil.xp);
    res.json({ xp: perfil.xp, nivel, logrosNuevos, logrosTotal: perfil.logros });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Error al sumar XP', error: err.message });
  } finally {
    conn.release();
  }
};

const obtenerDesafioActivo = async (req, res) => {
  try {
    const ahora = new Date();
    const [rows] = await db.execute(
      `SELECT d.*, ru.id AS ruta_id_val, ru.nombre AS ruta_nombre,
              ru.metodo, ru.es_publica, ru.justificacion,
              ru.pasajeros, ru.fecha_despacho
       FROM desafios d
       JOIN rutas ru ON ru.id = d.ruta_id
       WHERE d.fecha_inicio <= ? AND d.fecha_fin >= ?
       LIMIT 1`,
      [ahora, ahora]
    );

    if (rows.length === 0) return res.json(null);

    const d = rows[0];
    const [estaciones] = await db.execute(
      'SELECT * FROM estaciones WHERE ruta_id = ? ORDER BY posicion', [d.ruta_id]
    );

    let completado = false;
    const { maquinista } = req.query;
    if (maquinista) {
      const [perfRows] = await db.execute(
        'SELECT id FROM perfiles WHERE maquinista = ?', [maquinista]
      );
      if (perfRows.length > 0) {
        const [comp] = await db.execute(
          'SELECT semana_id FROM perfil_desafios_completados WHERE perfil_id = ? AND semana_id = ?',
          [perfRows[0].id, d.semana_id]
        );
        completado = comp.length > 0;
      }
    }

    res.json({
      id:           d.id,
      semanaId:     d.semana_id,
      titulo:       d.titulo,
      descripcion:  d.descripcion,
      xpRecompensa: d.xp_recompensa,
      fechaInicio:  d.fecha_inicio,
      fechaFin:     d.fecha_fin,
      completado,
      rutaId: {
        id:            d.ruta_id,
        nombre:        d.ruta_nombre,
        configuracion: { metodo: d.metodo, esPublica: !!d.es_publica, justificacion: d.justificacion },
        pasajeros:     d.pasajeros,
        fechaDespacho: d.fecha_despacho,
        estaciones: estaciones.map(e => ({
          titulo: e.titulo, autor: e.autor,
          paginas: e.paginas, año: e.anio, portada: e.portada,
        })),
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener desafío', error: err.message });
  }
};

module.exports = { obtenerPerfil, sumarXP, obtenerDesafioActivo, LOGROS_DEFINICION };