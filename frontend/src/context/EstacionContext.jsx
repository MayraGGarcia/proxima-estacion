import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

const EstacionContext = createContext();

export const EstacionProvider = ({ children, maquinista }) => {
  const [rutas, setRutas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Claves de sessionStorage personalizadas por usuario
  const KEY_RUTA   = maquinista ? `rutaActiva_${maquinista}` : 'rutaActiva';
  const KEY_REP    = maquinista ? `reportes_${maquinista}`   : 'reportes';
  const KEY_HIST   = maquinista ? `historial_${maquinista}`  : 'historial';

  const [rutaActiva, setRutaActiva] = useState(() => {
    try {
      const guardada = sessionStorage.getItem(KEY_RUTA);
      const rutaRecuperada = guardada ? JSON.parse(guardada) : null;
      if (!rutaRecuperada) localStorage.removeItem('ruta_en_perfil');
      return rutaRecuperada;
    } catch { return null; }
  });

  const [reportes, setReportes] = useState(() => {
    try {
      const guardados = sessionStorage.getItem(KEY_REP);
      const parsed = guardados ? JSON.parse(guardados) : [];

      return parsed.map(r => ({
        ...r,
        reporteFinal: typeof r.reporteFinal === 'object' && r.reporteFinal !== null
          ? (r.reporteFinal.extracto || r.reporteFinal.texto || '')
          : (r.reporteFinal || r.extracto || '')
      }));
    } catch { return []; }
  });

  const [historial, setHistorial] = useState(() => {
    try {
      const guardado = sessionStorage.getItem(KEY_HIST);
      return guardado ? JSON.parse(guardado) : [];
    } catch { return []; }
  });

  // Cuando cambia el maquinista, recargar datos del nuevo usuario
  useEffect(() => {
    if (!maquinista) return;
    // Ruta activa desde sessionStorage
    try {
      const ruta = sessionStorage.getItem(KEY_RUTA);
      setRutaActiva(ruta ? JSON.parse(ruta) : null);
      const rep = sessionStorage.getItem(KEY_REP);
      const parsedRep = rep ? JSON.parse(rep) : [];
      setReportes(parsedRep.map(r => ({
        ...r,
        reporteFinal: typeof r.reporteFinal === 'object' && r.reporteFinal !== null
          ? (r.reporteFinal.extracto || r.reporteFinal.texto || '')
          : (r.reporteFinal || r.extracto || '')
      })));
    } catch { }

    // Historial desde el backend (persiste entre sesiones)
    fetch(`http://localhost:5000/api/registros/maquinista/${maquinista}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setHistorial(data);
      })
      .catch(() => {
        // Fallback a sessionStorage si el backend falla
        try {
          const hist = sessionStorage.getItem(KEY_HIST);
          setHistorial(hist ? JSON.parse(hist) : []);
        } catch { }
      });
  }, [maquinista]);

  const sincronizarTerminal = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/rutas');
      if (!res.ok) throw new Error("Error en la red");
      const data = await res.json();
      setRutas(data);
    } catch (err) {
      console.error("Sincronización fallida:", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { sincronizarTerminal(); }, []);

  useEffect(() => {
    if (rutaActiva) {
      sessionStorage.setItem(KEY_RUTA, JSON.stringify(rutaActiva));
      localStorage.setItem('ruta_en_perfil', JSON.stringify({ id: rutaActiva.id, completada: false }));
    } else {
      sessionStorage.removeItem(KEY_RUTA);
      localStorage.removeItem('ruta_en_perfil');
    }
  }, [rutaActiva]);

  useEffect(() => { sessionStorage.setItem(KEY_REP, JSON.stringify(reportes)); }, [reportes]);
  useEffect(() => { sessionStorage.setItem(KEY_HIST, JSON.stringify(historial)); }, [historial]);

  const despacharRutaActiva = (rutaDespachada) => {
    const nuevaRutaActiva = {
      id: rutaDespachada._id || `LOCAL-${Date.now()}`,
      titulo: rutaDespachada.nombre,
      pasajeros: rutaDespachada.pasajeros || 1,
      estaciones: rutaDespachada.estaciones.map((est, i) => ({
        id: `est-${i}`,
        titulo: est.titulo,
        autor: est.autor,
        paginas: est.paginas,
        año: est.año,
        portada: est.portada,
        completada: false,
        bitacora: ''
      }))
    };
    setRutaActiva(nuevaRutaActiva);
  };

  const guardarProgreso = (estacionesActualizadas) => {
    if (!rutaActiva) return;
    setRutaActiva(prev => ({ ...prev, estaciones: estacionesActualizadas }));
  };

  const finalizarRuta = (reporte) => {
    if (!rutaActiva) return;
    const entradaHistorial = {
      id: rutaActiva.id,
      titulo: rutaActiva.titulo,
      estaciones: rutaActiva.estaciones,
      reporte
    };
    setHistorial(prev => [entradaHistorial, ...prev].slice(0, 50));
    setReportes(prev => [
      {
        id: rutaActiva.id,
        nombre: rutaActiva.titulo,
        ruta: rutaActiva.titulo,
        estaciones: rutaActiva.estaciones,
        reporteFinal: reporte,
        maquinista: maquinista || 'ANONIMO',
        bitacoras: rutaActiva.estaciones.map(e => ({
          estacionTitulo: e.titulo,
          estacionAutor: e.autor,
          portada: e.portada,
          texto: e.bitacora || ''
        }))
      },
      ...prev
    ]);
    setRutaActiva(null);
  };

  const abandonarRuta = () => { setRutaActiva(null); };

  const stats = useMemo(() => ({
    totalPasajeros: rutas.reduce((acc, r) => acc + (r.pasajeros || 0), 0),
    totalRutas: rutas.length
  }), [rutas]);

  return (
    <EstacionContext.Provider value={{
      rutas, stats, cargando, rutaActiva, reportes, historial,
      sincronizarTerminal, despacharRutaActiva,
      guardarProgreso, finalizarRuta, abandonarRuta
    }}>
      {children}
    </EstacionContext.Provider>
  );
};

export const useEstacion = () => useContext(EstacionContext);