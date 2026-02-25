const PerfilUsuario = require('../models/PerfilUsuario');
const Desafio = require('../models/Desafio');

// Definición de logros y sus condiciones
const LOGROS_DEFINICION = [
  { id: 'primera_salida',    nombre: 'Primera Salida',    icono: '🚂', descripcion: 'Completar tu primera ruta',           check: (p) => p.rutasCompletadas >= 1 },
  { id: 'bibliofilo',        nombre: 'Bibliófilo',         icono: '📚', descripcion: 'Completar 3 rutas',                  check: (p) => p.rutasCompletadas >= 3 },
  { id: 'desafio_cumplido',  nombre: 'Desafío Cumplido',   icono: '⚡', descripcion: 'Completar un desafío semanal',        check: (p) => p.desafiosCompletados.length >= 1 },
  { id: 'explorador',        nombre: 'Explorador',         icono: '🗺️', descripcion: 'Abordar 3 rutas de otros usuarios',  check: (p) => p.rutasAbordadas >= 3 },
  { id: 'cronista',          nombre: 'Cronista',           icono: '✍️', descripcion: 'Escribir 10 bitácoras',              check: (p) => p.bitacorasEscritas >= 10 },
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
  for (const n of NIVELES) {
    if (xp >= n.xpMin) nivel = n;
  }
  const idx = NIVELES.indexOf(nivel);
  const siguiente = NIVELES[idx + 1] || null;
  return {
    nombre: nivel.nombre,
    xpActual: xp,
    xpNivelActual: nivel.xpMin,
    xpSiguienteNivel: siguiente?.xpMin || null,
    progreso: siguiente
      ? Math.round(((xp - nivel.xpMin) / (siguiente.xpMin - nivel.xpMin)) * 100)
      : 100
  };
};

// Evaluar y desbloquear logros nuevos
const evaluarLogros = (perfil) => {
  const nuevos = [];
  for (const logro of LOGROS_DEFINICION) {
    if (!perfil.logros.includes(logro.id) && logro.check(perfil)) {
      perfil.logros.push(logro.id);
      nuevos.push(logro);
    }
  }
  return nuevos;
};

// Obtener o crear perfil de un maquinista
const obtenerPerfil = async (req, res) => {
  try {
    const { maquinista } = req.params;
    let perfil = await PerfilUsuario.findOne({ maquinista });
    if (!perfil) {
      perfil = await PerfilUsuario.create({ maquinista });
    }
    const nivel = calcularNivel(perfil.xp);
    const logrosCompletos = LOGROS_DEFINICION.map(l => ({
      ...l,
      desbloqueado: perfil.logros.includes(l.id)
    }));
    res.json({ ...perfil.toObject(), nivel, logrosCompletos });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener perfil', error: err.message });
  }
};

// Sumar XP y evaluar logros/niveles
const sumarXP = async (req, res) => {
  try {
    const { maquinista } = req.params;
    const { cantidad, motivo, desafioId, bitacorasNuevas } = req.body;

    let perfil = await PerfilUsuario.findOne({ maquinista });
    if (!perfil) perfil = await PerfilUsuario.create({ maquinista });

    perfil.xp += cantidad;

    // Actualizar contadores según el motivo
    if (motivo === 'ruta_completada') {
      perfil.rutasCompletadas += 1;
      perfil.bitacorasEscritas += (bitacorasNuevas || 0);
    }
    if (motivo === 'ruta_abordada') {
      perfil.rutasAbordadas += 1;
    }
    if (motivo === 'desafio_completado' && desafioId) {
      if (!perfil.desafiosCompletados.includes(desafioId)) {
        perfil.desafiosCompletados.push(desafioId);
      }
    }

    const logrosNuevos = evaluarLogros(perfil);
    await perfil.save();

    const nivel = calcularNivel(perfil.xp);
    res.json({
      xp: perfil.xp,
      nivel,
      logrosNuevos,
      logrosTotal: perfil.logros
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al sumar XP', error: err.message });
  }
};

// Obtener desafío activo (semana actual)
const obtenerDesafioActivo = async (req, res) => {
  try {
    const ahora = new Date();
    const desafio = await Desafio.findOne({
      fechaInicio: { $lte: ahora },
      fechaFin:    { $gte: ahora }
    }).populate('rutaId');

    if (!desafio) return res.json(null);

    // Si viene maquinista en query, indicar si ya lo completó
    const { maquinista } = req.query;
    let completado = false;
    if (maquinista) {
      const perfil = await PerfilUsuario.findOne({ maquinista });
      completado = perfil?.desafiosCompletados.includes(desafio.semanaId) || false;
    }

    res.json({ ...desafio.toObject(), completado });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener desafío', error: err.message });
  }
};

module.exports = { obtenerPerfil, sumarXP, obtenerDesafioActivo, LOGROS_DEFINICION };