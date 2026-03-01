import React, { useState, useEffect } from 'react';
import { sonarClick, iniciarAudio } from './hooks/useSonidos';
import PaginaAnimada from './components/PaginaAnimada';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import NotFound from './pages/NotFound';

const ScrollToTop = () => { const { pathname } = useLocation(); useEffect(() => { window.scrollTo(0, 0); }, [pathname]); return null; };

function App() {
  // Sonido global en todos los botones y links
  useEffect(() => {
    const handler = (e) => {
      const el = e.target.closest('button, a, [role="button"]');
      if (el && !el.disabled) {
        iniciarAudio();
        sonarClick();
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);
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
        <ScrollToTop />
        <Routes>
          <Route path="/"
            element={<PaginaAnimada key={isLogged ? "loggeado" : "inicio"}>{isLogged ? <InicioLoggeado setIsLogged={handleLogout} maquinista={maquinista} /> : <Inicio />}</PaginaAnimada>}
          />
          <Route path="/auth"
            element={!isLogged ? <PaginaAnimada key="auth"><Auth setIsLogged={setIsLogged} setMaquinista={setMaquinista} /></PaginaAnimada> : <Navigate to="/" />}
          />
          <Route path="/perfil"
            element={isLogged ? <PaginaAnimada key="perfil"><Perfil setIsLogged={handleLogout} maquinista={maquinista} /></PaginaAnimada> : <Navigate to="/auth" />}
          />
          <Route path="/ruta/activa" element={isLogged ? <PaginaAnimada key="ruta"><RutaActiva maquinista={maquinista} /></PaginaAnimada> : <Navigate to="/auth" />} />
          <Route path="/muro" element={<PaginaAnimada key="muro"><MuroEstaciones /></PaginaAnimada>} />
          <Route path="/muro/:rutaId" element={<PaginaAnimada key="muro"><MuroEstaciones /></PaginaAnimada>} />
          <Route path="/estacion/:libroTitulo" element={<PaginaAnimada key="ficha"><FichaEstacion maquinista={maquinista} /></PaginaAnimada>} />
          <Route path="/mis-resenas" element={isLogged ? <PaginaAnimada key="resenas"><MisResenas maquinista={maquinista} /></PaginaAnimada> : <Navigate to="/auth" />} />
          <Route path="/historial" element={isLogged ? <PaginaAnimada key="historial"><Historial /></PaginaAnimada> : <Navigate to="/auth" />} />
          <Route path="*" element={<PaginaAnimada key="404"><NotFound /></PaginaAnimada>} />
        </Routes>
      </Router>
    </PerfilProvider>
    </EstacionProvider>
  );
}

export default App;