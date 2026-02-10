const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Base de datos temporal
let lineasDeUsuarios = [
  { id: 1, nombre: "Realismo Sucio", valoracion: 5, progreso: 80 },
  { id: 2, nombre: "Sci-Fi Soviética", valoracion: 4, progreso: 30 }
];

// Ruta para obtener líneas recomendadas (las enviamos al Inicio)
app.get('/api/recomendados', (req, res) => {
  res.json(lineasDeUsuarios);
});

// Ruta para crear una línea (se llamará desde el Dashboard)
app.post('/api/lineas', (req, res) => {
  const { nombre } = req.body;
  const nueva = { id: Date.now(), nombre, valoracion: 0, progreso: 0 };
  lineasDeUsuarios.push(nueva);
  res.status(201).json(nueva);
});

app.listen(PORT, () => {
  console.log(`🚂 Servidor ferroviario activo en http://localhost:${PORT}`);
});