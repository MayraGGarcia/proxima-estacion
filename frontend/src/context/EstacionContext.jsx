import React, { createContext, useState, useContext } from 'react';

// Reporte inicial para que el muro no esté vacío al empezar
const REPORTES_INICIALES = [
  {
    id: "REP-999",
    ruta: "Ruta del Terror Gótico",
    fecha: "Hoy",
    maquinista: "SISTEMA", 
    extracto: "BIENVENIDO MAQUINISTA. EL DESPACHO ESTÁ OPERATIVO.",
    esPropio: false
  }
];

const EstacionContext = createContext();

export const EstacionProvider = ({ children }) => {
  const [rutas, setRutas] = useState([]); 
  const [reportes, setReportes] = useState(REPORTES_INICIALES); 
  const [rutaActiva, setRutaActiva] = useState(null); 

  const despacharRuta = (nuevaRuta) => {
    const rutaConId = { 
      ...nuevaRuta, 
      id: `RT-${Date.now()}`
    };
    setRutas([...rutas, rutaConId]);
    setRutaActiva(rutaConId); 
  };

  const finalizarRuta = (reporteFinal) => {
    setReportes([reporteFinal, ...reportes]);
    setRutaActiva(null);
  };

  return (
    <EstacionContext.Provider value={{ rutas, reportes, rutaActiva, despacharRuta, finalizarRuta }}>
      {children}
    </EstacionContext.Provider>
  );
};

export const useEstacion = () => useContext(EstacionContext);