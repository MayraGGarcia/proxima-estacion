import React from 'react';
import { Link } from 'react-router-dom';
import { useEstacion } from '../context/EstacionContext';

const MuroEstaciones = () => {
  const { reportes } = useEstacion();

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans p-4 md:p-8 relative text-left">
      <div className="relative z-10 max-w-5xl mx-auto">
        
        <header className="border-b-8 border-[#1A1A1A] pb-6 mb-12 flex justify-between items-end">
          <div>
            <span className="bg-[#1A1A1A] text-white px-2 py-0.5 font-black text-[10px] uppercase tracking-widest">Frecuencia Comunitaria</span>
            <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none mt-2">REGISTROS</h1>
          </div>
          <Link to="/perfil" className="font-black uppercase text-xs border-4 border-[#1A1A1A] px-6 py-4 hover:bg-[#FF5F00] transition-all shadow-[6px_6px_0px_0px_#1A1A1A]">
            Nueva Ruta
          </Link>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {reportes.map((rep) => (
            <div 
              key={rep.id} 
              className={`border-4 border-[#1A1A1A] p-6 transition-all ${
                rep.esPropio 
                  ? 'bg-white shadow-[10px_10px_0px_0px_#FF5F00] ring-4 ring-[#FF5F00]/20' 
                  : 'bg-white/50 shadow-[6px_6px_0px_0px_#1A1A1A] opacity-80'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${rep.esPropio ? 'bg-[#FF5F00] animate-pulse' : 'bg-[#1A1A1A]'}`}></div>
                  <span className="font-mono text-[10px] font-black uppercase opacity-50 italic">
                    {rep.esPropio ? "Tu Reporte de Vía" : `Transmisión de: ${rep.maquinista}`}
                  </span>
                </div>
                <span className="font-mono text-[10px] font-black bg-[#1A1A1A] text-white px-2 py-1 uppercase">
                  Sello_{rep.id} // {rep.fecha}
                </span>
              </div>

              <h3 className="text-xl font-black uppercase italic mb-3 tracking-tighter">
                {rep.ruta}
              </h3>
              
              <div className="bg-[#1A1A1A] text-white p-4 font-bold text-sm uppercase italic leading-relaxed">
                "{rep.extracto}"
              </div>

              <div className="mt-4 flex gap-4">
                <button className="text-[10px] font-black uppercase underline decoration-2 hover:text-[#FF5F00] transition-colors">
                  [ Sellar Sintonía ]
                </button>
                <button className="text-[10px] font-black uppercase underline decoration-2 hover:text-[#FF5F00] transition-colors">
                  [ Copiar Coordenadas ]
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default MuroEstaciones;