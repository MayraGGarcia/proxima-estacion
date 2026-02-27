import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TerminalCreacion from '../components/TerminalCreacion';
import { useEstacion } from '../context/EstacionContext';
import { usePerfil } from '../context/PerfilContext';

// --- TOAST DE LOGRO DESBLOQUEADO ---
const ToastLogro = ({ logros, onClose }) => {
  if (!logros?.length) return null;
  return (
    <div className="fixed bottom-8 right-8 z-[300] space-y-3 animate-in slide-in-from-bottom duration-300">
      {logros.map((logro, i) => (
        <div key={i} className="bg-[#1A1A1A] border-4 border-[#FF5F00] p-5 shadow-[8px_8px_0px_0px_#FF5F00] flex items-center gap-4 min-w-[280px]">
          <span className="text-3xl">{logro.icono}</span>
          <div>
            <p className="font-mono text-[9px] text-[#FF5F00] uppercase tracking-widest">Logro Desbloqueado</p>
            <p className="text-white font-black uppercase text-sm">{logro.nombre}</p>
            <p className="text-white/50 font-mono text-[9px] uppercase">{logro.descripcion}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const Perfil = () => {
  const navigate = useNavigate();
  const { rutaActiva, despacharRutaActiva, sincronizarTerminal, historial } = useEstacion();
  const { xp, nivel, logros, logrosNuevos } = usePerfil();

  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [logrosExpanded, setLogrosExpanded] = useState(false);
  const [verTodasResenas, setVerTodasResenas] = useState(false);
  const [misResenas, setMisResenas] = useState([]);

  useEffect(() => { sincronizarTerminal(); }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/resenas/maquinista/ADMIN_01')
      .then(r => r.json())
      .then(data => setMisResenas(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const handleNuevaRutaDespachada = (rutaGuardada) => {
    despacharRutaActiva(rutaGuardada);
    sincronizarTerminal();
    setIsTerminalOpen(false);
    navigate('/ruta/activa');
  };

  // Ruta activa formateada para la lista
  const entradaActiva = rutaActiva ? {
    id: rutaActiva.id,
    titulo: rutaActiva.titulo,
    progreso: (() => {
      const total = rutaActiva.estaciones.length;
      const completadas = rutaActiva.estaciones.filter(e => e.completada).length;
      return total > 0 ? Math.round((completadas / total) * 100) : 0;
    })(),
    isActiva: true
  } : null;

  const listaCompleta = [
    ...(entradaActiva ? [entradaActiva] : []),
    ...historial
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans selection:bg-[#FF5F00] selection:text-white overflow-x-hidden relative">

      <ToastLogro logros={logrosNuevos} />

      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
           style={{ backgroundImage: 'linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative z-10">
        <div className="max-w-6xl mx-auto p-8">

          <div className="mb-8 text-left">
            <Link to="/" className="inline-block border-2 border-[#1A1A1A] px-6 py-2 font-black uppercase text-[10px] hover:bg-[#1A1A1A] hover:text-white transition-all shadow-[4px_4px_0px_0px_#FF5F00] active:shadow-none bg-white">
              ← Volver a la Red
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mb-20">

            {/* COLUMNA IZQUIERDA */}
            <aside className="lg:w-1/3 space-y-6">

              {/* TARJETA DE USUARIO */}
              <div className="bg-[#E8E4D9] text-[#1A1A1A] p-8 border-4 border-[#1A1A1A] shadow-[12px_12px_0px_0px_#1A1A1A] text-left sticky top-8">
                <div className="w-24 h-24 bg-[#1A1A1A] mb-6 flex items-center justify-center border-4 border-[#FF5F00] shadow-lg rotate-3">
                  <span className="text-4xl font-black text-[#FF5F00]">A1</span>
                </div>
                <h2 className="text-3xl font-black uppercase leading-none mb-1 italic tracking-tighter">Admin_01</h2>
                <p className="font-mono text-[10px] uppercase text-[#1A1A1A]/50 tracking-widest mb-1">ID_PASAJERO: 2026-BA-8821</p>

                {/* RANGO Y XP */}
                {nivel && (
                  <div className="mb-6">
                    <span className="inline-block bg-[#FF5F00] text-black font-black text-[10px] uppercase px-3 py-1 mb-3 tracking-widest">
                      {nivel.nombre}
                    </span>
                    <div className="flex justify-between font-mono text-[9px] font-black mb-1">
                      <span className="opacity-50 uppercase">XP Total</span>
                      <span>{xp} XP</span>
                    </div>
                    {nivel.xpSiguienteNivel && (
                      <>
                        <div className="w-full h-2 bg-white/50 border border-[#1A1A1A]">
                          <div className="h-full bg-[#FF5F00]" style={{ width: `${nivel.progreso}%` }}></div>
                        </div>
                        <p className="font-mono text-[8px] opacity-40 uppercase mt-1">
                          {xp}/{nivel.xpSiguienteNivel} XP → siguiente nivel
                        </p>
                      </>
                    )}
                  </div>
                )}

                <div className="space-y-3 pt-4 border-t-2 border-dashed border-[#1A1A1A]/10">
                  {[
                    { label: "Líneas_Completas", value: String(historial.length).padStart(3, '0') },
                    { label: "XP_Acumulada",     value: String(xp).padStart(4, '0') },
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-end border-b border-[#1A1A1A]/10 pb-2">
                      <span className="font-mono text-[9px] uppercase text-gray-500 font-bold">{stat.label}</span>
                      <span className="font-black text-[#1A1A1A]">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* LOGROS */}
              <div className="border-4 border-[#1A1A1A] bg-white text-left shadow-[8px_8px_0px_0px_#1A1A1A] overflow-hidden">
                <button
                  onClick={() => setLogrosExpanded(v => !v)}
                  className="w-full p-6 flex items-center justify-between hover:bg-[#F5F5F5] transition-all"
                >
                  <div className="text-left">
                    <h4 className="font-black uppercase text-xs leading-none">Sellos de Estación</h4>
                    <p className="font-mono text-[8px] uppercase text-gray-400 mt-1">
                      {logros.filter(l => l.desbloqueado).length}/{logros.length} desbloqueados
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {logros.filter(l => l.desbloqueado).map((l, i) => (
                        <span key={i} className="text-base">{l.icono}</span>
                      ))}
                    </div>
                    <span className={`font-black text-[#FF5F00] text-xs transition-transform duration-300 ${logrosExpanded ? 'rotate-180' : ''}`}>▼</span>
                  </div>
                </button>

                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${logrosExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-6 pb-6 space-y-3 border-t-2 border-dashed border-[#1A1A1A]/10 pt-4">
                    {logros.map((logro, i) => (
                      <div key={i} className={`flex items-center gap-3 p-2 border-2 transition-all
                        ${logro.desbloqueado
                          ? 'border-[#1A1A1A] bg-[#FF5F00]/10'
                          : 'border-[#1A1A1A]/20 opacity-40 grayscale'}`}>
                        <span className="text-xl flex-shrink-0">{logro.icono}</span>
                        <div className="min-w-0">
                          <p className="font-black uppercase text-[10px] leading-none">{logro.nombre}</p>
                          <p className="font-mono text-[8px] text-gray-400 uppercase truncate">{logro.descripcion}</p>
                        </div>
                        {logro.desbloqueado && (
                          <span className="text-[#FF5F00] font-black text-xs flex-shrink-0">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* TARJETA LIBROS LEÍDOS */}
              <div className="border-4 border-[#1A1A1A] bg-white text-left shadow-[8px_8px_0px_0px_#1A1A1A] overflow-hidden">
                <div className="p-5 border-b-2 border-dashed border-[#1A1A1A]/10 flex justify-between items-center">
                  <div>
                    <h4 className="font-black uppercase text-xs leading-none">Libros Leídos</h4>
                    <p className="font-mono text-[8px] uppercase text-gray-400 mt-1">
                      {misResenas.length} {misResenas.length === 1 ? 'reseña' : 'reseñas'}
                    </p>
                  </div>
                  <span className="font-black text-3xl text-[#1A1A1A]/10">
                    {String(misResenas.length).padStart(2,'0')}
                  </span>
                </div>

                {misResenas.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="font-mono text-[8px] uppercase text-gray-400 opacity-60">Sin reseñas todavía</p>
                  </div>
                ) : (
                  <div className="p-5">
                    {/* 3 portadas con más estrellas */}
                    <div className="flex gap-3 mb-4">
                      {[...misResenas]
                        .sort((a, b) => b.estrellas - a.estrellas)
                        .slice(0, 3)
                        .map((r, i) => (
                          <button key={i}
                            onClick={() => navigate(`/estacion/${encodeURIComponent(r.libroTitulo)}`, {
                              state: { titulo: r.libroTitulo, autor: r.libroAutor, portada: r.libroPortada, paginas: r.libroPaginas, año: r.libroAño }
                            })}
                            className="group relative flex-1 bg-[#1A1A1A] border-4 border-[#1A1A1A] overflow-hidden hover:-translate-y-1 transition-transform shadow-[3px_3px_0px_0px_#FF5F00]"
                            style={{ height: '90px' }}
                            title={r.libroTitulo}>
                            {r.libroPortada
                              ? <img src={r.libroPortada} alt={r.libroTitulo} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center"><span className="text-[#FF5F00] font-black text-[8px]">?</span></div>
                            }
                            <div className="absolute bottom-0 inset-x-0 bg-black/70 py-1 flex justify-center">
                              <span className="text-[#FF5F00] text-[8px]">{'★'.repeat(r.estrellas)}</span>
                            </div>
                          </button>
                        ))}
                    </div>
                    <button
                      onClick={() => navigate('/mis-resenas')}
                      className="w-full border-4 border-[#1A1A1A] py-3 font-black uppercase text-[10px] bg-white hover:bg-[#FF5F00] transition-all shadow-[4px_4px_0px_0px_#1A1A1A] active:shadow-none">
                      Ver Todos →
                    </button>
                  </div>
                )}
              </div>

            </aside>

            {/* COLUMNA DERECHA */}
            <main className="lg:w-2/3 text-left">
              <header className="mb-12">
                <span className="bg-[#1A1A1A] text-white px-2 py-1 text-[9px] font-mono uppercase tracking-[0.2em] mb-4 inline-block">User_Personal_Dashboard</span>
                <h1 className="text-6xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85]">
                  Mi Libreta de <br /> <span className="text-[#FF5F00]">Pasajes</span>.
                </h1>
              </header>

              <div className="flex justify-end mb-8 gap-4">
                {rutaActiva ? (
                  <div className="flex items-center gap-4">
                    <div className="bg-[#FF5F00] text-black px-4 py-2 font-black uppercase text-[10px] border-2 border-black animate-pulse">
                      ⚡ Ruta en tránsito: {rutaActiva.titulo}
                    </div>
                    <button
                      onClick={() => navigate('/ruta/activa')}
                      className="bg-[#1A1A1A] text-white px-8 py-4 font-black uppercase text-xs hover:bg-[#FF5F00] hover:text-[#1A1A1A] transition-all shadow-[6px_6px_0px_0px_rgba(255,95,0,0.3)]">
                      Retomar Ruta →
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsTerminalOpen(true)}
                    className="bg-[#1A1A1A] text-white px-8 py-4 font-black uppercase text-xs hover:bg-[#FF5F00] hover:text-[#1A1A1A] transition-all shadow-[6px_6px_0px_0px_rgba(255,95,0,0.3)] active:shadow-none">
                    + Crear Nueva Ruta
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {listaCompleta.length > 0 ? listaCompleta.map((r, index) => (
                  <div key={r.id || index} className={`border-4 border-[#1A1A1A] p-8 flex flex-col md:flex-row justify-between items-center gap-8 transition-all hover:translate-x-1
                    ${r.isActiva
                      ? 'bg-white shadow-[10px_10px_0px_0px_#FF5F00] ring-2 ring-[#FF5F00]/30'
                      : 'bg-[#E8E4D9] shadow-[10px_10px_0px_0px_#1A1A1A] opacity-80'}`}>

                    <div className="text-left flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 ${r.isActiva ? 'bg-[#FF5F00] animate-pulse' : 'bg-green-600'}`}></div>
                        <span className="font-mono text-[9px] font-black uppercase tracking-widest">
                          {r.isActiva ? 'Línea_En_Tránsito' : 'Línea_Finalizada'}
                        </span>
                      </div>
                      <h4 className="text-3xl font-black uppercase italic leading-none mb-2">{r.titulo}</h4>
                    </div>

                    {r.isActiva && (
                      <div className="w-full md:w-48 flex flex-col gap-1">
                        <div className="w-full h-3 bg-white/50 border-2 border-[#1A1A1A]">
                          <div className="h-full bg-[#FF5F00]" style={{ width: `${r.progreso}%` }}></div>
                        </div>
                        <div className="flex justify-between font-mono text-[9px] font-black">
                          <span>PROGRESO</span>
                          <span>{r.progreso}%</span>
                        </div>
                      </div>
                    )}

                    {r.isActiva ? (
                      <button onClick={() => navigate('/ruta/activa')}
                        className="w-full md:w-auto px-6 py-4 font-black uppercase text-[10px] border-2 border-[#1A1A1A] bg-[#1A1A1A] text-white hover:bg-[#FF5F00] hover:text-black transition-all">
                        Abordar →
                      </button>
                    ) : (
                      <button onClick={() => navigate(`/muro/${r.id}`)}
                        className="w-full md:w-auto px-6 py-4 font-black uppercase text-[10px] border-2 border-[#1A1A1A] bg-white hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_#000] active:shadow-none">
                        Ver Bitácora →
                      </button>
                    )}
                  </div>
                )) : (
                  <div className="py-20 border-4 border-dashed border-[#1A1A1A]/10 text-center uppercase font-black opacity-20">
                    No hay registros en la libreta
                  </div>
                )}
              </div>


            </main>
          </div>
        </div>

        <footer className="bg-[#1A1A1A] text-white p-12 text-left border-t-8 border-[#FF5F00]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF5F00] flex items-center justify-center text-white font-black text-sm uppercase">P</div>
              <div>
                <span className="font-black uppercase tracking-tighter text-2xl block leading-none">Próxima Estación</span>
                <span className="font-mono text-[8px] uppercase tracking-widest opacity-40 italic">Global Terminal // 2026</span>
              </div>
            </div>
            <button
              onClick={async () => {
                if (!window.confirm('¿Resetear todo el progreso? XP, logros y desafíos se borrarán.')) return;
                try {
                  await fetch('http://localhost:5000/api/perfil/ADMIN_01/reset', { method: 'DELETE' });
                } catch (e) { console.error('Error al resetear perfil:', e); }
                sessionStorage.clear();
                localStorage.clear();
                window.location.reload();
              }}
              className="text-[9px] font-mono uppercase opacity-30 hover:opacity-100 hover:text-red-400 transition-all border border-white/20 px-4 py-2">
              [ Hard_Reset_Terminal ]
            </button>
          </div>
        </footer>
      </div>

      <TerminalCreacion
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        onSave={handleNuevaRutaDespachada}
      />
    </div>
  );
};

export default Perfil;