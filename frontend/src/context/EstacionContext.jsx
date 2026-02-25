import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

const EstacionContext = createContext();

export const EstacionProvider = ({ children }) => {
  const [rutas, setRutas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [rutaActiva, setRutaActiva] = useState(() => {
    try {
      const guardada = sessionStorage.getItem('rutaActiva');
      const rutaRecuperada = guardada ? JSON.parse(guardada) : null;
      if (!rutaRecuperada) localStorage.removeItem('ruta_en_perfil');
      return rutaRecuperada;
    } catch { return null; }
  });

  const [reportes, setReportes] = useState(() => {
    try {
      const guardados = sessionStorage.getItem('reportes');
      return guardados ? JSON.parse(guardados) : [];
    } catch { return []; }
  });

  const [historial, setHistorial] = useState(() => {
    try {
      const guardado = sessionStorage.getItem('historial');
      return guardado ? JSON.parse(guardado) : [];
    } catch { return []; }
  });

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
      sessionStorage.setItem('rutaActiva', JSON.stringify(rutaActiva));
      localStorage.setItem('ruta_en_perfil', JSON.stringify({ id: rutaActiva.id, completada: false }));
    } else {
      sessionStorage.removeItem('rutaActiva');
      localStorage.removeItem('ruta_en_perfil');
    }
  }, [rutaActiva]);

  useEffect(() => {
    sessionStorage.setItem('reportes', JSON.stringify(reportes));
  }, [reportes]);

  useEffect(() => {
    sessionStorage.setItem('historial', JSON.stringify(historial));
  }, [historial]);

  const despacharRutaActiva = (rutaDespachada) => {
    const nuevaRutaActiva = {
      id: rutaDespachada._id || `LOCAL-${Date.now()}`,
      titulo: rutaDespachada.nombre,
      pasajeros: rutaDespachada.pasajeros || 1,
      estaciones: rutaDespachada.estaciones.map((est, i) => ({
        ...est,
        id: est._id || `est-${i}`,
        // Unificamos el campo de imagen al despachar
        portada: est.portada || est.imagen, 
        completada: false,
        bitacora: ''
      })),
      criterio: rutaDespachada.configuracion?.metodo || 'Manual',
      fechaInicio: new Date().toISOString()
    };
    setRutaActiva(nuevaRutaActiva);
  };

  const guardarProgreso = (estacionesActualizadas) => {
    setRutaActiva(prev => prev ? ({ ...prev, estaciones: estacionesActualizadas }) : null);
  };

  const finalizarRuta = (reporte) => {
    const nombreRuta = reporte.ruta || rutaActiva?.titulo || "Línea_Privada";
    
    // Normalizamos estaciones para el reporte final (incluyendo portadas)
    const estacionesFinales = (reporte.estaciones || rutaActiva?.estaciones || []).map(e => ({
      ...e,
      portada: e.portada || e.imagen
    }));

    const nuevoReporte = { 
      ...reporte, 
      ruta: nombreRuta,
      estaciones: estacionesFinales 
    };
    setReportes(prev => [nuevoReporte, ...prev]);

    const entradaHistorial = {
      id: reporte.id || rutaActiva?.id,
      titulo: nombreRuta,
      fecha: reporte.fecha || new Date().toISOString(),
      estaciones: estacionesFinales,
      extracto: reporte.extracto,
      progreso: 100,
      estado: 'Finalizada'
    };
    setHistorial(prev => [entradaHistorial, ...prev].slice(0, 2));

    setRutaActiva(null);
    sincronizarTerminal();
  };

  const abandonarRuta = () => setRutaActiva(null);

  const stats = useMemo(() => ({
    totalLineas: rutas.length,
    totalPasajeros: rutas.reduce((acc, r) => acc + (r.pasajeros || 0), 0),
    kilometrosTotales: rutas.reduce((acc, r) =>
      acc + (r.estaciones?.reduce((sum, e) => sum + (e.paginas || 0), 0) || 0), 0)
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

export const useEstacion = () => {
  const context = useContext(EstacionContext);
  if (!context) throw new Error("useEstacion debe usarse dentro de un EstacionProvider");
  return context;
};