import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Tren from '../components/Tren';
import API_URL from '../config';

// Componente para las estadísticas tipo cartel ferroviario
const FlapStat = ({ label, value }) => (
  <div className="flex flex-col items-center md:items-start">
    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-[0.3em] mb-3">
      {label}
    </span>
    <div className="flex gap-[2px]">
      {value.split('').map((char, i) => (
        <span 
          key={i} 
          className="flap-unit animate-flap text-lg md:text-4xl font-black bg-[#1A1A1A] text-[#FF5F00] p-1 md:p-3 min-w-[24px] md:min-w-[40px] text-center rounded relative overflow-hidden"
          style={{ animationDelay: `${i * 0.15}s` }}
        >
          {char}
          <div className="flap-divider"></div>
        </span>
      ))}
    </div>
  </div>
);

const Inicio = ({ isLogged, lineas, lineasAleatorias, barajarLineas }) => {
  const [rutas, setRutas] = useState([]);
  const [stats, setStats] = useState({ rutas: 0, usuarios: 0 });

  useEffect(() => {
    fetch(`${API_URL}/api/rutas`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRutas(data);
          setStats(prev => ({ ...prev, rutas: data.length }));
        }
      })
      .catch(() => {});

    fetch(`${API_URL}/api/auth/stats`)
      .then(r => r.json())
      .then(data => setStats(prev => ({ ...prev, usuarios: data.usuarios || 0 })))
      .catch(() => {});
  }, []);
  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans selection:bg-[#FF5F00] selection:text-white overflow-x-hidden">
      
      {/* FONDO DE CUADRÍCULA TÉCNICA */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative z-10">
        
        {/* NAVEGACIÓN */}
        <nav className="px-4 py-4 md:p-8 flex justify-between items-center border-b-2 border-[#1A1A1A] bg-[#F5F5F5]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF5F00] flex items-center justify-center text-white font-black text-xs uppercase">P</div>
            <span className="font-black uppercase tracking-tighter text-base md:text-xl">Próxima Estación</span>
          </div>
          <Link to="/auth" className="px-3 py-2 md:px-6 border-2 border-[#1A1A1A] font-black uppercase text-xs md:text-sm hover:bg-[#1A1A1A] hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
            {isLogged ? "Ir al Panel" : "Acceder Red"}
          </Link>
        </nav>

        <main className="max-w-7xl mx-auto pt-8 md:pt-20 px-4 md:px-8">
          
          {/* HERO SECTION (TÍTULO + MONITOR) */}
          <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-center mb-16 md:mb-24 lg:min-h-[60vh]">
            <div className="lg:col-span-8">
              <span className="bg-[#1A1A1A] text-white px-3 py-1 text-[10px] font-mono uppercase tracking-[0.3em] mb-6 inline-block">
                Conexión establecida // 2026
              </span>
              <h1 className="text-[14vw] md:text-8xl lg:text-9xl font-black uppercase leading-[0.85] tracking-tighter mb-8 text-[#1A1A1A]">
                Trazando <br /> 
                <span className="text-[#FF5F00]">Nuevas</span> <br />
                Rutas.
              </h1>
              <p className="text-xl md:text-2xl font-bold max-w-md leading-tight border-l-8 border-[#FF5F00] pl-6 italic uppercase text-[#1A1A1A]">
                La plataforma donde tus lecturas no son solo libros, son destinos.
              </p>
            </div>
            
            <div className="lg:col-span-4 w-full self-center hidden lg:block">
              <div className="border-4 border-[#1A1A1A] bg-white shadow-[15px_15px_0px_0px_#1A1A1A]">
                {/* CABECERA */}
                <div className="bg-[#1A1A1A] px-5 py-3 flex justify-between items-center">
                  <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#FF5F00]">Estado_Red</span>
                  <span className="w-2 h-2 bg-green-400 animate-pulse rounded-full"></span>
                </div>
                {/* RUTAS */}
                <div className="divide-y-2 divide-[#1A1A1A]/5 font-mono">
                  {rutas.slice(0, 4).map((r, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-orange-50 transition-colors">
                      <div>
                        <p className="font-black uppercase text-xs leading-none">{r.nombre}</p>
                        <p className="text-[8px] uppercase text-gray-400 mt-0.5">{r.estaciones?.length || 0} estaciones</p>
                      </div>
                      <span className="text-[8px] uppercase font-black text-green-600 border border-green-200 px-2 py-0.5">Disponible</span>
                    </div>
                  ))}
                </div>
                {/* PIE */}
                <div className="bg-[#1A1A1A] px-5 py-2 flex justify-between items-center">
                  <span className="font-mono text-[8px] uppercase text-gray-500">Próxima Estación // 2026</span>
                  <span className="font-mono text-[8px] uppercase text-[#FF5F00]">{rutas.length} líneas activas</span>
                </div>
              </div>
            </div>
          </div>

          {/* PANEL DE ESTADÍSTICAS MECÁNICAS */}
          <div className="grid grid-cols-3 gap-4 md:gap-12 mb-16 md:mb-24 border-4 border-[#1A1A1A] bg-[#222] p-6 md:p-10 shadow-[10px_10px_0px_0px_#FF5F00]">
            <FlapStat label="Líneas_en_Red" value={String(stats.rutas).padStart(3,'0')} />
            <FlapStat label="Maquinistas" value={String(94 + (stats.usuarios || 0)).padStart(3,'0')} />
            <FlapStat label="Estado_Red" value="ACT" />
          </div>

          {/* CINTA DE TRÁNSITO */}
          {rutas.length > 0 && (
            <div className="bg-[#1A1A1A] text-white py-6 -mx-8 mb-24 overflow-hidden whitespace-nowrap flex border-y-4 border-[#FF5F00] rotate-1 shadow-2xl">
              {[0, 1].map(copy => (
                <div key={copy} className={`animate-marquee flex gap-16 font-black uppercase italic tracking-tighter text-3xl ${copy === 1 ? 'ml-16' : ''}`}>
                  {rutas.map((r, i) => (
                    <React.Fragment key={i}>
                      <span>{r.nombre} // {(r.estaciones?.[0]?.titulo || '').split(' ').slice(0,2).join(' ')}</span>
                      <span className="text-[#FF5F00]">/</span>
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* MANUAL DE OPERACIONES */}
          <section className="mb-32">
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter">Manual de Operaciones</h2>
              <div className="h-[2px] flex-grow bg-[#1A1A1A] opacity-20"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-4 border-[#1A1A1A] bg-white shadow-[15px_15px_0px_0px_#1A1A1A]">
              {/* 01 — fila superior izq: borde right + borde bottom */}
              <div className="p-5 md:p-8 border-b-4 border-r-4 border-[#1A1A1A] hover:bg-orange-50 transition-colors group">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1A1A1A] text-white flex items-center justify-center font-black text-lg md:text-2xl mb-4 group-hover:bg-[#FF5F00] transition-colors">01</div>
                <h3 className="font-black uppercase text-base md:text-xl mb-2 leading-tight text-[#1A1A1A]">Abordá una ruta</h3>
                <p className="font-mono text-[10px] md:text-xs uppercase leading-relaxed text-gray-500">Elegís una línea temática y comenzás el viaje.</p>
              </div>
              {/* 02 — fila superior der: solo borde bottom (en md también border-r) */}
              <div className="p-5 md:p-8 border-b-4 md:border-r-4 border-[#1A1A1A] hover:bg-orange-50 transition-colors group">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1A1A1A] text-white flex items-center justify-center font-black text-lg md:text-2xl mb-4 group-hover:bg-[#FF5F00] transition-colors">02</div>
                <h3 className="font-black uppercase text-base md:text-xl mb-2 leading-tight text-[#1A1A1A]">Completá cada estación</h3>
                <p className="font-mono text-[10px] md:text-xs uppercase leading-relaxed text-gray-500">Escribís tu bitácora y puntuás con estrellas.</p>
              </div>
              {/* 03 — fila inferior izq: solo borde right */}
              <div className="p-5 md:p-8 border-r-4 border-[#1A1A1A] hover:bg-orange-50 transition-colors group">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1A1A1A] text-white flex items-center justify-center font-black text-lg md:text-2xl mb-4 group-hover:bg-[#FF5F00] transition-colors">03</div>
                <h3 className="font-black uppercase text-base md:text-xl mb-2 leading-tight text-[#1A1A1A]">Ganá XP y logros</h3>
                <p className="font-mono text-[10px] md:text-xs uppercase leading-relaxed text-gray-500">Cada ruta suma experiencia y desbloquea sellos.</p>
              </div>
              {/* 04 — fila inferior der: sin bordes extra */}
              <div className="p-5 md:p-8 hover:bg-orange-50 transition-colors group">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1A1A1A] text-white flex items-center justify-center font-black text-lg md:text-2xl mb-4 group-hover:bg-[#FF5F00] transition-colors">04</div>
                <h3 className="font-black uppercase text-base md:text-xl mb-2 leading-tight text-[#1A1A1A]">Revisá tu historial</h3>
                <p className="font-mono text-[10px] md:text-xs uppercase leading-relaxed text-gray-500">Rutas y reseñas guardadas en tu perfil.</p>
              </div>
            </div>
          </section>

          <section className="mb-32">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter text-[#1A1A1A]">La Red</h2>
              <div className="h-[2px] flex-grow bg-[#1A1A1A] opacity-20"></div>
            </div>
            <p className="font-mono text-[10px] uppercase text-gray-400 tracking-widest mb-12">
              Rutas disponibles en el sistema — registrate para abordar
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {rutas.slice(0, 4).map((ruta, idx) => (
                <div key={idx} className="border-4 border-[#1A1A1A] bg-white shadow-[8px_8px_0px_0px_#1A1A1A] overflow-hidden">
                  <div className="bg-[#1A1A1A] px-6 py-4 flex justify-between items-center">
                    <div>
                      <p className="font-mono text-[8px] uppercase text-gray-500 tracking-widest">Línea_{String(idx + 1).padStart(2,'0')}</p>
                      <h3 className="font-black uppercase text-lg text-white leading-none">{ruta.nombre}</h3>
                    </div>
                    <span className="font-mono text-[9px] uppercase text-[#FF5F00] border border-[#FF5F00]/30 px-2 py-1">
                      {ruta.estaciones?.length || 0} estaciones
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex gap-2 mb-4">
                      {(ruta.estaciones || []).slice(0, 5).map((e, i) => (
                        <div key={i} className="flex-1 bg-[#1A1A1A] border-2 border-[#1A1A1A] overflow-hidden" style={{ height: '80px' }}>
                          {e.portada
                            ? <img src={e.portada} alt={e.titulo} className="w-full h-full object-cover grayscale opacity-70" />
                            : <div className="w-full h-full bg-[#333]" />}
                        </div>
                      ))}
                      {(ruta.estaciones?.length || 0) > 5 && (
                        <div className="flex-1 border-2 border-dashed border-[#1A1A1A]/20 flex items-center justify-center" style={{ height: '80px' }}>
                          <span className="font-black text-[#1A1A1A]/30 text-xs">+{ruta.estaciones.length - 5}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      {(ruta.estaciones || []).slice(0, 3).map((e, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-[#FF5F00] flex-shrink-0 rounded-full"></span>
                          <p className="font-mono text-[9px] uppercase text-gray-500 truncate">{e.titulo} — {e.autor}</p>
                        </div>
                      ))}
                      {(ruta.estaciones?.length || 0) > 3 && (
                        <p className="font-mono text-[9px] uppercase text-gray-400 pl-3">+ {ruta.estaciones.length - 3} títulos más...</p>
                      )}
                    </div>
                  </div>
                  <div className="border-t-2 border-dashed border-[#1A1A1A]/10 px-5 py-3 flex justify-between items-center bg-[#F5F5F5]">
                    <span className="font-mono text-[8px] uppercase text-gray-400">Requiere registro para abordar</span>
                    <Link to="/auth" className="font-black uppercase text-[9px] text-[#FF5F00] hover:underline">Registrarse →</Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-32 overflow-visible">
            <div className="px-8 mb-4 font-mono text-[10px] font-bold opacity-30 uppercase tracking-[0.5em]">
              Tráfico de Unidades en Vivo // Red_Global
            </div>
            {/* Solo pasamos lineasAleatorias que es lo que espera el componente Tren */}
            <Tren lineasAleatorias={rutas.map(r => ({ id: r._id, nombre: r.nombre.toUpperCase() }))} />
            
          </section>

          <div className="relative border-4 border-[#1A1A1A] bg-white p-6 md:p-12 mb-16 md:mb-20 flex flex-col md:flex-row justify-between items-center gap-10 shadow-[15px_15px_0px_0px_#FF5F00]">
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#F5F5F5] border-4 border-[#1A1A1A] rounded-full hidden md:block"></div>
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#F5F5F5] border-4 border-[#1A1A1A] rounded-full hidden md:block"></div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black uppercase leading-none mb-3 text-[#1A1A1A]">¿Listo para el transbordo?</h2>
              <p className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">Red literaria // Buenos Aires // 2026</p>
            </div>
            <Link to="/auth" className="w-full md:w-auto bg-[#1A1A1A] text-white px-12 py-5 font-black uppercase italic hover:bg-[#FF5F00] transition-colors text-center border-2 border-black">
              Obtener Boleto
            </Link>
          </div>

          {/* FOOTER TERMINAL */}
          <footer className="bg-[#1A1A1A] text-white -mx-8 border-t-4 border-[#FF5F00] px-8 py-8">
            <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#FF5F00] flex items-center justify-center text-white font-black text-sm uppercase">P</div>
                <div>
                  <span className="font-black uppercase tracking-tighter text-lg md:text-2xl block leading-none">Próxima Estación</span>
                  <span className="font-mono text-[8px] uppercase tracking-widest opacity-40 italic">Terminal Global // 2026</span>
                </div>
                <span className="text-gray-700 ml-4">·</span>
                <Link to="/auth" className="font-mono text-[10px] uppercase text-gray-500 hover:text-[#FF5F00] transition-colors tracking-widest">Acceder</Link>
              </div>
              <span className="font-mono text-[10px] uppercase text-gray-600 tracking-widest">2026</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Inicio;