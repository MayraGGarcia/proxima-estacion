const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { despacharRuta, obtenerMuro, abordarRuta, obtenerRutaPorId } = require('./controllers/rutaController');
const { publicarRegistro, obtenerRegistrosPorRuta, obtenerRegistrosPorMaquinista } = require('./controllers/registroController');
const { crearResena, obtenerResenasPorLibro, obtenerResenasPorMaquinista, eliminarResena } = require('./controllers/resenaController');
const Resena = require('./models/Resena');
const { registro, login } = require('./controllers/authController');
const { obtenerPerfil, sumarXP, obtenerDesafioActivo } = require('./controllers/perfilController');
const PerfilUsuario = require('./models/PerfilUsuario');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://mgg_dev_user:mongopass1@cluster0.apzxdus.mongodb.net/proximaEstacion?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("🟢 VÍA LIBRE: Conexión exitosa a proximaEstacion"))
  .catch(err => console.error("🔴 ERROR DE ACCESO:", err));

// Rutas (convoys)
app.get('/api/rutas', obtenerMuro);
app.get('/api/rutas/:id', obtenerRutaPorId);
app.post('/api/despacho', despacharRuta);
app.put('/api/rutas/:id/abordar', abordarRuta);

// Registros (bitácoras por ruta)
app.post('/api/registros', publicarRegistro);
app.get('/api/registros/maquinista/:maquinista', obtenerRegistrosPorMaquinista);
app.get('/api/registros/detalle/:id', async (req, res) => {
  try {
    const Registro = require('./models/Registro');
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.json(null);
    const registro = await Registro.findById(req.params.id).populate('rutaId', 'nombre estaciones');
    if (!registro) return res.json(null);
    // Cruzar portadas de la ruta con las bitácoras del registro
    const estaciones = registro.rutaId?.estaciones || [];
    const resultado = {
      _id: registro._id,
      maquinista: registro.maquinista,
      reporteFinal: registro.reporteFinal,
      fechaFinalizacion: registro.fechaFinalizacion,
      bitacoras: registro.bitacoras.map((b, i) => ({
        estacionTitulo: b.estacionTitulo || estaciones[i]?.titulo || '',
        estacionAutor: b.estacionAutor || estaciones[i]?.autor || '',
        portada: estaciones[i]?.portada || null,
        texto: b.texto || ''
      }))
    };
    res.json(resultado);
  } catch { res.json(null); }
});
app.get('/api/registros/:rutaId', obtenerRegistrosPorRuta);

// Perfil de usuario (XP, logros, nivel)
app.get('/api/perfil/:maquinista', obtenerPerfil);
app.post('/api/perfil/:maquinista/xp', sumarXP);

// Desafíos
app.get('/api/desafio/activo', obtenerDesafioActivo);

// Stats públicas para la página de inicio
app.get('/api/auth/stats', async (req, res) => {
  try {
    const Usuario = require('./models/Usuario');
    const usuarios = await Usuario.countDocuments();
    res.json({ usuarios });
  } catch (err) {
    res.json({ usuarios: 0 });
  }
});

// Autenticación
app.post('/api/auth/registro', registro);
app.post('/api/auth/login', login);

// Reseñas de libros
app.post('/api/resenas', crearResena);
app.get('/api/resenas/libro/:libroTitulo', obtenerResenasPorLibro);
app.get('/api/resenas/maquinista/:maquinista', obtenerResenasPorMaquinista);
app.delete('/api/resenas/:libroTitulo/:maquinista', eliminarResena);

// Reset de perfil (para testing)
app.delete('/api/perfil/:maquinista/reset', async (req, res) => {
  try {
    const Registro = require('./models/Registro');
    await Promise.all([
      PerfilUsuario.findOneAndUpdate(
        { maquinista: req.params.maquinista },
        { xp: 0, logros: [], desafiosCompletados: [],
          rutasCompletadas: 0, rutasAbordadas: 0, bitacorasEscritas: 0 },
        { returnDocument: 'after' }
      ),
      Resena.deleteMany({ maquinista: req.params.maquinista }),
      Registro.deleteMany({ maquinista: req.params.maquinista })
    ]);
    res.json({ ok: true, mensaje: 'Perfil, reseñas e historial reseteados correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al resetear perfil', error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Terminal activa en puerto ${PORT}`));