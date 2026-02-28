const Usuario = require('../models/Usuario');

const registro = async (req, res) => {
  try {
    const { maquinista, password } = req.body;
    if (!maquinista || !password)
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    if (password.length < 4)
      return res.status(400).json({ message: 'La contraseña debe tener al menos 4 caracteres' });

    const existe = await Usuario.findOne({ maquinista: maquinista.toUpperCase() });
    if (existe)
      return res.status(409).json({ message: 'Ese identificador ya está en uso' });

    const usuario = await Usuario.create({ maquinista: maquinista.toUpperCase(), password });
    res.status(201).json({ maquinista: usuario.maquinista });
  } catch (err) {
    res.status(500).json({ message: 'Error al registrar', error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { maquinista, password } = req.body;
    if (!maquinista || !password)
      return res.status(400).json({ message: 'Faltan campos obligatorios' });

    const usuario = await Usuario.findOne({ maquinista: maquinista.toUpperCase() });
    if (!usuario || usuario.password !== password)
      return res.status(401).json({ message: 'Credenciales inválidas' });

    res.json({ maquinista: usuario.maquinista });
  } catch (err) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });
  }
};

module.exports = { registro, login };