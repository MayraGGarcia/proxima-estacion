//server.js: Configuración del servidor Express, rutas API y conexión a MySQL

const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const db = require('./db');

const { despacharRuta, obtenerMuro, abordarRuta, obtenerRutaPorId } = require('./controllers/rutaController');
const { publicarRegistro, obtenerRegistrosPorRuta, obtenerRegistrosPorMaquinista } = require('./controllers/registroController');
const { crearResena, obtenerResenasPorLibro, obtenerResenasPorMaquinista, eliminarResena } = require('./controllers/resenaController');
const { registro, login } = require('./controllers/authController');
const { obtenerPerfil, sumarXP, obtenerDesafioActivo } = require('./controllers/perfilController');

const app = express();
app.use(cors());
app.use(express.json());

// Verificar conexión al arrancar
db.getConnection()
  .then(conn => { console.log('🟢 VÍA LIBRE: Conexión exitosa a MySQL'); conn.release(); })
  .catch(err  => console.error('🔴 ERROR DE ACCESO:', err));

// Rutas
app.get('/api/rutas',              obtenerMuro);
app.get('/api/rutas/:id',          obtenerRutaPorId);
app.post('/api/despacho',          despacharRuta);
app.put('/api/rutas/:id/abordar',  abordarRuta);

// Registros
app.post('/api/registros',                              publicarRegistro);
app.get('/api/registros/maquinista/:maquinista',        obtenerRegistrosPorMaquinista);
app.get('/api/registros/detalle/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [registros] = await db.execute('SELECT * FROM registros WHERE id = ?', [id]);
    if (registros.length === 0) return res.json(null);

    const r = registros[0];
    const [estaciones] = await db.execute(
      'SELECT * FROM estaciones WHERE ruta_id = ? ORDER BY posicion', [r.ruta_id]
    );
    const [bitacoras] = await db.execute(
      'SELECT * FROM bitacoras WHERE registro_id = ? ORDER BY posicion', [id]
    );
    const [rutas] = await db.execute('SELECT nombre FROM rutas WHERE id = ?', [r.ruta_id]);

    res.json({
      id:                r.id,
      rutaId:            r.ruta_id,
      maquinista:        r.maquinista,
      reporteFinal:      r.reporte_final,
      fechaFinalizacion: r.fecha_finalizacion,
      bitacoras: bitacoras.map((b, i) => ({
        estacionTitulo: b.estacion_titulo || estaciones[i]?.titulo || '',
        estacionAutor:  b.estacion_autor  || estaciones[i]?.autor  || '',
        portada:        estaciones[i]?.portada || null,
        texto:          b.texto || '',
      })),
    });
  } catch { res.json(null); }
});
app.get('/api/registros/:rutaId', obtenerRegistrosPorRuta);

// Perfil
app.get('/api/perfil/:maquinista',       obtenerPerfil);
app.post('/api/perfil/:maquinista/xp',   sumarXP);

// Desafíos
app.get('/api/desafio/activo', obtenerDesafioActivo);

// Stats
app.get('/api/auth/stats', async (req, res) => {
  try {
    const [[{ usuarios }]] = await db.execute('SELECT COUNT(*) AS usuarios FROM usuarios');
    res.json({ usuarios });
  } catch { res.json({ usuarios: 0 }); }
});

// Auth
app.post('/api/auth/registro', registro);
app.post('/api/auth/login',    login);

// Reseñas
app.post('/api/resenas',                              crearResena);
app.get('/api/resenas/libro/:libroTitulo',            obtenerResenasPorLibro);
app.get('/api/resenas/maquinista/:maquinista',        obtenerResenasPorMaquinista);
app.delete('/api/resenas/:libroTitulo/:maquinista',   eliminarResena);

// Reset de perfil (testing)
app.delete('/api/perfil/:maquinista/reset', async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { maquinista } = req.params;
    await conn.beginTransaction();

    const [[perfil]] = await conn.execute(
      'SELECT id FROM perfiles WHERE maquinista = ?', [maquinista]
    );
    if (perfil) {
      await conn.execute(
        `UPDATE perfiles SET xp=0, rutas_completadas=0, rutas_abordadas=0, bitacoras_escritas=0
         WHERE id = ?`, [perfil.id]
      );
      await conn.execute('DELETE FROM perfil_logros WHERE perfil_id = ?', [perfil.id]);
      await conn.execute('DELETE FROM perfil_desafios_completados WHERE perfil_id = ?', [perfil.id]);
    }
    await conn.execute('DELETE FROM resenas WHERE maquinista = ?', [maquinista]);

    // Borrar registros y sus bitácoras
    const [regs] = await conn.execute(
      'SELECT id FROM registros WHERE maquinista = ?', [maquinista]
    );
    if (regs.length > 0) {
      const ids = regs.map(r => r.id);
      await conn.execute(
        `DELETE FROM registros WHERE id IN (${ids.map(() => '?').join(',')})`, ids
      );
    }

    await conn.commit();
    res.json({ ok: true, mensaje: 'Perfil, reseñas e historial reseteados correctamente' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Error al resetear perfil', error: err.message });
  } finally {
    conn.release();
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Terminal activa en puerto ${PORT}`));