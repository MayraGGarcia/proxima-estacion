import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TerminalCreacion from '../components/TerminalCreacion';

const Perfil = () => {
  // Datos simulados del usuario
  const estadisticas = [
    { label: "Kilómetros_Leídos", value: "4520" },
    { label: "Estaciones_Visitadas", value: "128" },
    { label: "Líneas_Completas", value: "012" },
    { label: "Rango_Pasajero", value: "PLAT" }
  ];

  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const misLineas = [
    { id: 1, titulo: "Mi Ruta de Terror", progreso: 100, ultimaEstacion: "It (Stephen King)", color: "#FF5F00", estado: "Finalizada" },
    { id: 2, titulo: "Clásicos Rusos", progreso: 100, ultimaEstacion: "Guerra y Paz", color: "#1A1A1A", estado: "Finalizada" },
    { id: 3, titulo: "Lecturas de Verano", progreso: 90, ultimaEstacion: "El Gran Gatsby", color: "#FF5F00", estado: "En Tránsito" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans selection:bg-[#FF5F00] selection:text-white overflow-x-hidden relative">
      
      {/* FONDO TÉCNICO */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative z-10">
        <div className="max-w-6xl mx-auto p-8">
          
          {/* BOTÓN VOLVER */}
          <div className="mb-8 text-left">
            <Link to="/" className="inline-block border-2 border-[#1A1A1A] px-6 py-2 font-black uppercase text-[10px] hover:bg-[#1A1A1A] hover:text-white transition-all shadow-[4px_4px_0px_0px_#FF5F00] active:shadow-none">
              ← Volver a la Red
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mb-20">
            
            {/* COLUMNA IZQUIERDA */}
            <aside className="lg:w-1/3 space-y-8">
              <div className="bg-[#E8E4D9] text-[#1A1A1A] p-8 border-4 border-[#1A1A1A] shadow-[12px_12px_0px_0px_#1A1A1A]">
                <div className="w-24 h-24 bg-[#1A1A1A] mb-6 flex items-center justify-center border-4 border-[#FF5F00] shadow-lg rotate-3">
                  <span className="text-4xl font-black text-[#FF5F00]">A1</span>
                </div>
                <h2 className="text-3xl font-black uppercase leading-none mb-2 italic tracking-tighter">Admin_01</h2>
                <p className="font-mono text-[10px] uppercase text-[#1A1A1A]/50 tracking-widest mb-6">ID_PASAJERO: 2026-BA-8821</p>
                
                <div className="space-y-4 pt-6 border-t-2 border-dashed border-[#1A1A1A]/10">
                  {estadisticas.map((stat, i) => (
                    <div key={i} className="flex justify-between items-end border-b border-[#1A1A1A]/10 pb-2">
                      <span className="font-mono text-[9px] uppercase text-gray-500 font-bold">{stat.label}</span>
                      <span className="font-black text-[#1A1A1A]">{stat.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-[2px] h-8 mt-8 opacity-20 justify-center">
                  {[1, 3, 1, 2, 4, 1, 2, 1, 3, 2].map((w, i) => (
                    <div key={i} className="bg-[#1A1A1A]" style={{ width: `${w}px` }}></div>
                  ))}
                </div>
              </div>

              {/* SELLOS DE ESTACIÓN */}
              <div className="border-4 border-[#1A1A1A] bg-white p-6 text-left shadow-[8px_8px_0px_0px_#FF5F00]">
                <h4 className="font-black uppercase text-xs mb-4 border-b-2 border-[#1A1A1A] inline-block">Sellos de Estación</h4>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className={`aspect-square border-2 border-[#1A1A1A] rounded-full flex items-center justify-center transition-all cursor-help bg-[#F5F5F5] ${i < 5 ? 'opacity-100 bg-[#FF5F00]/20' : 'opacity-20 grayscale'}`}>
                      <div className="w-2 h-2 bg-[#1A1A1A] rounded-full"></div>
                    </div>
                  ))}
                </div>
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

              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setIsTerminalOpen(true)}
                  className="bg-[#1A1A1A] text-white px-8 py-4 font-black uppercase text-xs hover:bg-[#FF5F00] hover:text-[#1A1A1A] transition-all shadow-[6px_6px_0px_0px_rgba(255,95,0,0.3)] active:shadow-none">
                    + Iniciar Nueva Ruta
                </button>
              </div>

              <div className="space-y-6">
                {misLineas.map((linea) => (
                  <div key={linea.id} className={`bg-[#E8E4D9] border-4 border-[#1A1A1A] p-8 flex flex-col md:flex-row justify-between items-center gap-8 shadow-[10px_10px_0px_0px_#1A1A1A] transition-all ${linea.progreso === 100 ? 'opacity-80' : 'hover:shadow-none hover:translate-x-1 hover:translate-y-1'}`}>
                    <div className="text-left flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 ${linea.progreso === 100 ? 'bg-green-600' : 'bg-[#FF5F00]'}`}></div>
                        <span className="font-mono text-[9px] font-black uppercase tracking-widest">
                          {linea.progreso === 100 ? 'Línea_Finalizada' : `Línea_Activa_0${linea.id}`}
                        </span>
                      </div>
                      <h4 className="text-3xl font-black uppercase italic leading-none mb-2">{linea.titulo}</h4>
                      <p className="text-[10px] font-bold text-[#1A1A1A]/40 uppercase">
                        {linea.progreso === 100 ? 'Ruta Completada con Éxito' : `Próxima Parada: ${linea.ultimaEstacion}`}
                      </p>
                    </div>

                    <div className="w-full md:w-56 flex flex-col gap-2">
                      <div className="w-full h-4 bg-white/50 border-2 border-[#1A1A1A] relative">
                        <div className={`h-full ${linea.progreso === 100 ? 'bg-green-600' : 'bg-[#1A1A1A]'}`} style={{ width: `${linea.progreso}%` }}></div>
                      </div>
                      <div className="flex justify-between font-mono text-[9px] font-black">
                        <span>ESTADO</span>
                        <span>{linea.progreso}%</span>
                      </div>
                    </div>

                    <Link 
                      to={`/ruta/${linea.id}`} 
                      className={`w-full md:w-auto px-6 py-4 font-black uppercase text-[10px] transition-colors text-center border-2 border-[#1A1A1A] ${linea.progreso === 100 ? 'bg-white text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white' : 'bg-[#1A1A1A] text-white hover:bg-[#FF5F00] hover:text-[#1A1A1A]'}`}
                    >
                      {linea.progreso === 100 ? 'Revisar Bitácora' : 'Abordar'}
                    </Link>
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
        
        {/* FOOTER */}
        <footer className="bg-[#1A1A1A] text-white p-12 text-left border-t-8 border-[#FF5F00]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF5F00] flex items-center justify-center text-white font-black text-sm uppercase">P</div>
              <div>
                <span className="font-black uppercase tracking-tighter text-2xl block leading-none">Próxima Estación</span>
                <span className="font-mono text-[8px] uppercase tracking-widest opacity-40 italic">Global Discovery Terminal // 2026</span>
              </div>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-40 text-center md:text-right">
              MODO_PERFIL_ACTIVO <br />
              <span className="text-[#FF5F00] font-black tracking-normal">Online // Admin_01</span>
            </div>
          </div>
        </footer>
      </div>

      <TerminalCreacion 
        isOpen={isTerminalOpen} 
        onClose={() => setIsTerminalOpen(false)}
        onSave={async (nuevaRuta) => {
          console.log("Nueva ruta despachada:", nuevaRuta);
          setIsTerminalOpen(false);
        }}
      />

    </div>
  );
};

export default Perfil;