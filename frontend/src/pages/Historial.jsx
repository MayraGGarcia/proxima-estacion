import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEstacion } from '../context/EstacionContext';

const Historial = () => {
  const navigate = useNavigate();
  const { historial } = useEstacion();

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans selection:bg-[#FF5F00] selection:text-white">

      {/* FONDO CUADRÍCULA */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 max-w-4xl mx-auto p-8">

        {/* NAV */}
        <div className="mb-10 flex items-center justify-between">
          <Link to="/perfil"
            className="inline-block border-2 border-[#1A1A1A] px-6 py-2 font-black uppercase text-[10px] hover:bg-[#1A1A1A] hover:text-white transition-all shadow-[4px_4px_0px_0px_#FF5F00] active:shadow-none bg-white">
            ← Volver al Perfil
          </Link>
          <span className="font-mono text-[9px] uppercase text-gray-400 tracking-widest">
            Historial_Completo
          </span>
        </div>

        {/* CABECERA */}
        <header className="mb-12 border-b-4 border-[#1A1A1A] pb-8">
          <span className="bg-[#1A1A1A] text-white px-2 py-1 text-[9px] font-mono uppercase tracking-[0.2em] mb-3 inline-block">
            Archivo_de_Líneas
          </span>
          <div className="flex items-end justify-between">
            <h1 className="text-6xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85]">
              Rutas <br /><span className="text-[#FF5F00]">Completadas</span>.
            </h1>
            <span className="font-black text-8xl text-[#1A1A1A]/5 leading-none">
              {String(historial.length).padStart(3, '0')}
            </span>
          </div>
        </header>

        {/* LISTA */}
        {historial.length === 0 ? (
          <div className="py-32 border-4 border-dashed border-[#1A1A1A]/10 text-center uppercase font-black opacity-20">
            No completaste ninguna ruta todavía
          </div>
        ) : (
          <div className="space-y-6">
            {historial.map((r, i) => (
              <div key={r.id || i}
                className="border-4 border-[#1A1A1A] bg-[#E8E4D9] shadow-[8px_8px_0px_0px_#1A1A1A] p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:translate-x-1 transition-all">

                <div className="flex-grow">
                  {/* Número de orden */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-black text-4xl text-[#1A1A1A]/10 leading-none">
                      {String(historial.length - i).padStart(2, '0')}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600"></div>
                        <span className="font-mono text-[9px] font-black uppercase tracking-widest text-green-600">
                          Línea_Completada
                        </span>
                      </div>
                      <h3 className="text-2xl font-black uppercase italic leading-none mt-1">{r.titulo}</h3>
                    </div>
                  </div>

                  {/* Estaciones */}
                  {r.estaciones && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {r.estaciones.map((e, j) => (
                        <button
                          key={j}
                          onClick={() => navigate(`/estacion/${encodeURIComponent(e.titulo)}`, {
                            state: { titulo: e.titulo, autor: e.autor, portada: e.portada, paginas: e.paginas, año: e.año }
                          })}
                          className="bg-white border-2 border-[#1A1A1A] px-3 py-1 font-mono text-[8px] uppercase hover:bg-[#FF5F00] hover:border-[#FF5F00] transition-all"
                          title={e.autor}>
                          {e.titulo.length > 20 ? e.titulo.slice(0, 20) + '…' : e.titulo}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/muro/${r.id}`)}
                  className="flex-shrink-0 border-4 border-[#1A1A1A] px-6 py-4 font-black uppercase text-[10px] bg-white hover:bg-[#1A1A1A] hover:text-white transition-all shadow-[4px_4px_0px_0px_#1A1A1A] active:shadow-none">
                  Ver Bitácora →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Historial;