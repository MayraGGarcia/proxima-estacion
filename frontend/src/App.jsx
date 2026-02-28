import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { EstacionProvider } from './context/EstacionContext';
import { PerfilProvider } from './context/PerfilContext';

import Inicio from './pages/Inicio';
import InicioLoggeado from './pages/InicioLoggeado';
import Auth from './pages/Auth';
import Perfil from './pages/Perfil';
import RutaActiva from './pages/RutaActiva';
import MuroEstaciones from './pages/MuroEstaciones';
import FichaEstacion from './pages/FichaEstacion';
import MisResenas from './pages/MisResenas';
import Historial from './pages/Historial';

function App() {
  const [isLogged, setIsLogged] = useState(() => !!sessionStorage.getItem('maquinista'));
  const [maquinista, setMaquinista] = useState(() => sessionStorage.getItem('maquinista') || '');

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    setIsLogged(false);
    setMaquinista('');
  };

  return (
    <EstacionProvider maquinista={maquinista}>
    <PerfilProvider maquinista={maquinista}>
      <Router>
        <Routes>
          <Route path="/"
            element={isLogged
              ? <InicioLoggeado setIsLogged={handleLogout} maquinista={maquinista} />
              : <Inicio />}
          />
          <Route path="/auth"
            element={!isLogged
              ? <Auth setIsLogged={setIsLogged} setMaquinista={setMaquinista} />
              : <Navigate to="/" />}
          />
          <Route path="/perfil"
            element={isLogged
              ? <Perfil setIsLogged={handleLogout} maquinista={maquinista} />
              : <Navigate to="/auth" />}
          />
          <Route path="/ruta/activa" element={isLogged ? <RutaActiva maquinista={maquinista} /> : <Navigate to="/auth" />} />
          <Route path="/muro" element={<MuroEstaciones />} />
          <Route path="/muro/:rutaId" element={<MuroEstaciones />} />
          <Route path="/estacion/:libroTitulo" element={<FichaEstacion maquinista={maquinista} />} />
          <Route path="/mis-resenas" element={isLogged ? <MisResenas maquinista={maquinista} /> : <Navigate to="/auth" />} />
          <Route path="/historial" element={isLogged ? <Historial /> : <Navigate to="/auth" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </PerfilProvider>
    </EstacionProvider>
  );
}

export default App;