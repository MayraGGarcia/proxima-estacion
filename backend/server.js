const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { despacharRuta, obtenerMuro, abordarRuta, obtenerRutaPorId } = require('./controllers/rutaController');
const { publicarRegistro, obtenerRegistrosPorRuta } = require('./controllers/registroController');
const { crearResena, obtenerResenasPorLibro, obtenerResenasPorMaquinista, eliminarResena } = require('./controllers/resenaController');
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
app.get('/api/registros/:rutaId', obtenerRegistrosPorRuta);

// Perfil de usuario (XP, logros, nivel)
app.get('/api/perfil/:maquinista', obtenerPerfil);
app.post('/api/perfil/:maquinista/xp', sumarXP);

// Desafíos
app.get('/api/desafio/activo', obtenerDesafioActivo);

// Reseñas de libros
app.post('/api/resenas', crearResena);
app.get('/api/resenas/libro/:libroTitulo', obtenerResenasPorLibro);
app.get('/api/resenas/maquinista/:maquinista', obtenerResenasPorMaquinista);
app.delete('/api/resenas/:libroTitulo/:maquinista', eliminarResena);

// Reset de perfil (para testing)
app.delete('/api/perfil/:maquinista/reset', async (req, res) => {
  try {
    await PerfilUsuario.findOneAndUpdate(
      { maquinista: req.params.maquinista },
      { xp: 0, logros: [], desafiosCompletados: [],
        rutasCompletadas: 0, rutasAbordadas: 0, bitacorasEscritas: 0 }
    );
    res.json({ ok: true, mensaje: 'Perfil reseteado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al resetear perfil', error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Terminal activa en puerto ${PORT}`));