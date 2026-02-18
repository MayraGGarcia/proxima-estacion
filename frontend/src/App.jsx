import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { EstacionProvider } from './context/EstacionContext';

// Importación de Páginas
import Inicio from './pages/Inicio';
import InicioLoggeado from './pages/InicioLoggeado';
import Auth from './pages/Auth';
import Perfil from './pages/Perfil';
import RutaActiva from './pages/RutaActiva';
import MuroEstaciones from './pages/MuroEstaciones';

function App() {
  // --- ESTADOS GLOBALES ---
  const [isLogged, setIsLogged] = useState(false); 
  const [lineas, setLineas] = useState([]);
  const [lineasAleatorias, setLineasAleatorias] = useState([]);

  // --- LÓGICA DE DATOS (Simulación de la Red de Trenes) ---
  useEffect(() => {
    // Datos de ejemplo para las líneas del tren
    const datosIniciales = [
      { id: 1, nombre: 'Línea Distopía', color: '#FF5F00', estaciones: ['1984', 'Fahrenheit 451', 'Un Mundo Feliz'] },
      { id: 2, nombre: 'Línea Realismo', color: '#1A1A1A', estaciones: ['Rayuela', 'Cien Años de Soledad', 'Pedro Páramo'] },
      { id: 3, nombre: 'Línea Sci-Fi', color: '#FF5F00', estaciones: ['Fundación', 'Dune', 'Neuromante'] },
    ];
    setLineas(datosIniciales);
    setLineasAleatorias(datosIniciales);
  }, []);

  const barajarLineas = () => {
    const barajadas = [...lineas].sort(() => Math.random() - 0.5);
    setLineasAleatorias(barajadas);
  };

  // --- RENDERIZADO DEL SISTEMA ---
  return (
    <EstacionProvider>
    <Router>
      <Routes>
        {/* RUTA PRINCIPAL CON LÓGICA CONDICIONAL */}
        <Route 
          path="/" 
          element={
            isLogged ? (
              <InicioLoggeado 
                lineas={lineas} 
                lineasAleatorias={lineasAleatorias} 
                barajarLineas={barajarLineas} 
                setIsLogged={setIsLogged} 
              />
            ) : (
              <Inicio 
                isLogged={isLogged}
                lineas={lineas}
                lineasAleatorias={lineasAleatorias}
                barajarLineas={barajarLineas}
              />
            )
          } 
        />

        {/* RUTA DE AUTENTICACIÓN (LOGIN/REGISTRO) */}
        <Route 
          path="/auth" 
          element={
            !isLogged ? (
              <Auth setIsLogged={setIsLogged} />
            ) : (
              <Navigate to="/" />
            )
          } 
        />

        {/* RUTA DE PERFIL (Solo accesible si está logueado) */}
        <Route 
          path="/perfil" 
          element={
            isLogged ? (
              <Perfil setIsLogged={setIsLogged} />
            ) : (
              <Navigate to="/auth" />
            )
          } 
        />

        {/* RUTA ACTIVA */}
        <Route path="/ruta/:id" element={<RutaActiva />} />

        {/* MURO DE ESTACIONES */}  
        <Route path="/muro" element={<MuroEstaciones />} />

        {/* RUTA COMODÍN (REDIRECCIÓN) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
    </EstacionProvider>
  );
}

export default App;