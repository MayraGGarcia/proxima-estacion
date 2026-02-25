import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { EstacionProvider } from './context/EstacionContext';
import { PerfilProvider } from './context/PerfilContext';

import Inicio from './pages/Inicio';
import InicioLoggeado from './pages/InicioLoggeado';
import Auth from './pages/Auth';
import Perfil from './pages/Perfil';
import RutaActiva from './pages/RutaActiva';
import MuroEstaciones from './pages/MuroEstaciones';

function App() {
  const [isLogged, setIsLogged] = useState(false); 

  return (
    <EstacionProvider>
    <PerfilProvider>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              isLogged ? (
                <InicioLoggeado setIsLogged={setIsLogged} />
              ) : (
                <Inicio />
              )
            } 
          />
          <Route 
            path="/auth" 
            element={!isLogged ? <Auth setIsLogged={setIsLogged} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/perfil" 
            element={isLogged ? <Perfil setIsLogged={setIsLogged} /> : <Navigate to="/auth" />} 
          />
          <Route path="/ruta/activa" element={isLogged ? <RutaActiva /> : <Navigate to="/auth" />} />
          <Route path="/muro" element={<MuroEstaciones />} />
          <Route path="/muro/:rutaId" element={<MuroEstaciones />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </PerfilProvider>
    </EstacionProvider>
  );
}

export default App;