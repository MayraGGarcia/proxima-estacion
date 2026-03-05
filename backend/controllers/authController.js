const db = require('../db');

const registro = async (req, res) => {
  try {
    const { maquinista, password } = req.body;
    if (!maquinista || !password)
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    if (password.length < 4)
      return res.status(400).json({ message: 'La contraseña debe tener al menos 4 caracteres' });

    const maquinistaUp = maquinista.toUpperCase();

    const [rows] = await db.execute(
      'SELECT id FROM usuarios WHERE maquinista = ?',
      [maquinistaUp]
    );
    if (rows.length > 0)
      return res.status(409).json({ message: 'Ese identificador ya está en uso' });

    await db.execute(
      'INSERT INTO usuarios (maquinista, password) VALUES (?, ?)',
      [maquinistaUp, password]
    );

    res.status(201).json({ maquinista: maquinistaUp });
  } catch (err) {
    res.status(500).json({ message: 'Error al registrar', error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { maquinista, password } = req.body;
    if (!maquinista || !password)
      return res.status(400).json({ message: 'Faltan campos obligatorios' });

    const [rows] = await db.execute(
      'SELECT maquinista, password FROM usuarios WHERE maquinista = ?',
      [maquinista.toUpperCase()]
    );

    if (rows.length === 0 || rows[0].password !== password)
      return res.status(401).json({ message: 'Credenciales inválidas' });

    res.json({ maquinista: rows[0].maquinista });
  } catch (err) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });
  }
};

module.exports = { registro, login };