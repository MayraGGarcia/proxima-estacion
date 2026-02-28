import React, { createContext, useState, useContext, useEffect } from 'react';

const PerfilContext = createContext();

export const PerfilProvider = ({ children, maquinista }) => {
  const [xp, setXp] = useState(0);
  const [nivel, setNivel] = useState(null);
  const [logros, setLogros] = useState([]);
  const [desafioActivo, setDesafioActivo] = useState(null);
  const [logrosNuevos, setLogrosNuevos] = useState([]);

  const cargarPerfil = async () => {
    if (!maquinista) return;
    try {
      const [perfilRes, desafioRes] = await Promise.all([
        fetch(`http://localhost:5000/api/perfil/${maquinista}`),
        fetch(`http://localhost:5000/api/desafio/activo?maquinista=${maquinista}`)
      ]);
      const perfil = await perfilRes.json();
      const desafio = await desafioRes.json();
      setXp(perfil.xp);
      setNivel(perfil.nivel);
      setLogros(perfil.logrosCompletos);
      setDesafioActivo(desafio);
    } catch (err) {
      console.error('Error al cargar perfil:', err);
    }
  };

  // Recargar perfil cada vez que cambia el maquinista
  useEffect(() => {
    setXp(0);
    setNivel(null);
    setLogros([]);
    setDesafioActivo(null);
    cargarPerfil();
  }, [maquinista]);

  const ganarXP = async (cantidad, motivo, extras = {}) => {
    if (!maquinista) return;
    try {
      const res = await fetch(`http://localhost:5000/api/perfil/${maquinista}/xp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad, motivo, ...extras })
      });
      const data = await res.json();
      setXp(data.xp);
      setNivel(data.nivel);
      if (data.logrosNuevos?.length > 0) {
        setLogrosNuevos(data.logrosNuevos);
        setTimeout(() => setLogrosNuevos([]), 5000);
      }
      cargarPerfil();
      return data;
    } catch (err) {
      console.error('Error al ganar XP:', err);
    }
  };

  const verificarDesafio = async (rutaId) => {
    if (!desafioActivo || desafioActivo.completado) return false;
    if (String(desafioActivo.rutaId?._id || desafioActivo.rutaId) !== String(rutaId)) return false;
    await ganarXP(desafioActivo.xpRecompensa, 'desafio_completado', { desafioId: desafioActivo.semanaId });
    setDesafioActivo(prev => ({ ...prev, completado: true }));
    return true;
  };

  return (
    <PerfilContext.Provider value={{
      xp, nivel, logros, desafioActivo, logrosNuevos,
      ganarXP, verificarDesafio, cargarPerfil, maquinista
    }}>
      {children}
    </PerfilContext.Provider>
  );
};

export const usePerfil = () => useContext(PerfilContext);