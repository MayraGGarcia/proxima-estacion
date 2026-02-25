import React, { createContext, useState, useContext, useEffect } from 'react';

const PerfilContext = createContext();

const MAQUINISTA = 'ADMIN_01'; // Temporal hasta autenticación real

export const PerfilProvider = ({ children }) => {
  const [xp, setXp] = useState(0);
  const [nivel, setNivel] = useState(null);
  const [logros, setLogros] = useState([]);
  const [desafioActivo, setDesafioActivo] = useState(null);
  const [logrosNuevos, setLogrosNuevos] = useState([]); // Para notificaciones

  const cargarPerfil = async () => {
    try {
      const [perfilRes, desafioRes] = await Promise.all([
        fetch(`http://localhost:5000/api/perfil/${MAQUINISTA}`),
        fetch(`http://localhost:5000/api/desafio/activo?maquinista=${MAQUINISTA}`)
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

  useEffect(() => { cargarPerfil(); }, []);

  const ganarXP = async (cantidad, motivo, extras = {}) => {
    try {
      const res = await fetch(`http://localhost:5000/api/perfil/${MAQUINISTA}/xp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad, motivo, ...extras })
      });
      const data = await res.json();
      setXp(data.xp);
      setNivel(data.nivel);
      if (data.logrosNuevos?.length > 0) {
        setLogrosNuevos(data.logrosNuevos);
        // Limpiar notificación después de 5 segundos
        setTimeout(() => setLogrosNuevos([]), 5000);
      }
      // Recargar logros completos
      cargarPerfil();
      return data;
    } catch (err) {
      console.error('Error al ganar XP:', err);
    }
  };

  // Verificar si el desafío activo fue completado al finalizar una ruta
  const verificarDesafio = async (rutaId) => {
    if (!desafioActivo || desafioActivo.completado) return false;
    if (String(desafioActivo.rutaId?._id || desafioActivo.rutaId) !== String(rutaId)) return false;

    // Completó el desafío: sumar XP extra
    await ganarXP(desafioActivo.xpRecompensa, 'desafio_completado', {
      desafioId: desafioActivo.semanaId
    });
    setDesafioActivo(prev => ({ ...prev, completado: true }));
    return true;
  };

  return (
    <PerfilContext.Provider value={{
      xp, nivel, logros, desafioActivo, logrosNuevos,
      ganarXP, verificarDesafio, cargarPerfil
    }}>
      {children}
    </PerfilContext.Provider>
  );
};

export const usePerfil = () => useContext(PerfilContext);