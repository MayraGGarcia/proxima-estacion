import React from 'react';
import { Link } from 'react-router-dom';
import Tren from '../components/Tren';

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
          className="flap-unit animate-flap text-2xl md:text-4xl font-black bg-[#1A1A1A] text-[#FF5F00] p-3 min-w-[40px] text-center rounded relative overflow-hidden"
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
  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans selection:bg-[#FF5F00] selection:text-white overflow-x-hidden">
      
      {/* FONDO DE CUADRÍCULA TÉCNICA */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative z-10">
        
        {/* NAVEGACIÓN */}
        <nav className="p-8 flex justify-between items-center border-b-2 border-[#1A1A1A] bg-[#F5F5F5]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF5F00] flex items-center justify-center text-white font-black text-xs uppercase">P</div>
            <span className="font-black uppercase tracking-tighter text-xl">Próxima Estación</span>
          </div>
          <Link to="/auth" className="px-6 py-2 border-2 border-[#1A1A1A] font-black uppercase text-sm hover:bg-[#1A1A1A] hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
            {isLogged ? "Ir al Panel" : "Acceder Red"}
          </Link>
        </nav>

        <main className="max-w-7xl mx-auto pt-10 md:pt-20 px-8">
          
          {/* HERO SECTION (TÍTULO + MONITOR) */}
          <div className="grid lg:grid-cols-12 gap-12 items-center mb-24 min-h-[60vh]">
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
            
            <div className="lg:col-span-4 w-full self-center">
              <div className="border-4 border-[#1A1A1A] bg-white shadow-[15px_15px_0px_0px_#1A1A1A]">
                {/* CABECERA */}
                <div className="bg-[#1A1A1A] px-5 py-3 flex justify-between items-center">
                  <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#FF5F00]">Estado_Red</span>
                  <span className="w-2 h-2 bg-green-400 animate-pulse rounded-full"></span>
                </div>
                {/* RUTAS */}
                <div className="divide-y-2 divide-[#1A1A1A]/5 font-mono">
                  {[
                    { nombre: "Línea Sci-Fi",        estado: "Disponible", libros: "06 estaciones" },
                    { nombre: "Línea Boom Latino",    estado: "Disponible", libros: "05 estaciones" },
                    { nombre: "Línea Distopía",       estado: "Disponible", libros: "04 estaciones" },
                    { nombre: "Línea Noir",           estado: "Disponible", libros: "04 estaciones" },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-orange-50 transition-colors">
                      <div>
                        <p className="font-black uppercase text-xs leading-none">{r.nombre}</p>
                        <p className="text-[8px] uppercase text-gray-400 mt-0.5">{r.libros}</p>
                      </div>
                      <span className="text-[8px] uppercase font-black text-green-600 border border-green-200 px-2 py-0.5">{r.estado}</span>
                    </div>
                  ))}
                </div>
                {/* PIE */}
                <div className="bg-[#1A1A1A] px-5 py-2 flex justify-between items-center">
                  <span className="font-mono text-[8px] uppercase text-gray-500">Próxima Estación // 2026</span>
                  <span className="font-mono text-[8px] uppercase text-[#FF5F00]">4 líneas activas</span>
                </div>
              </div>
            </div>
          </div>

          {/* PANEL DE ESTADÍSTICAS MECÁNICAS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24 border-4 border-[#1A1A1A] bg-[#222] p-10 shadow-[10px_10px_0px_0px_#FF5F00]">
            <FlapStat label="Líneas_Activas" value="042" />
            <FlapStat label="Pasajeros_Red" value="1204" />
            <FlapStat label="Estado_Sync" value="ONL" />
          </div>

          {/* CINTA DE TRÁNSITO */}
          <div className="bg-[#1A1A1A] text-white py-6 -mx-8 mb-24 overflow-hidden whitespace-nowrap flex border-y-4 border-[#FF5F00] rotate-1 shadow-2xl">
            <div className="animate-marquee flex gap-16 font-black uppercase italic tracking-tighter text-3xl">
              <span>Línea Distopía // 1984</span><span className="text-[#FF5F00]">/</span>
              <span>Línea Realismo // Rayuela</span><span className="text-[#FF5F00]">/</span>
              <span>Línea Sci-Fi // Fundación</span><span className="text-[#FF5F00]">/</span>
            </div>
            <div className="animate-marquee flex gap-16 font-black uppercase italic tracking-tighter text-3xl ml-16">
              <span>Línea Distopía // 1984</span><span className="text-[#FF5F00]">/</span>
              <span>Línea Realismo // Rayuela</span><span className="text-[#FF5F00]">/</span>
              <span>Línea Sci-Fi // Fundación</span><span className="text-[#FF5F00]">/</span>
            </div>
          </div>

          {/* MANUAL DE OPERACIONES */}
          <section className="mb-32">
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">Manual de Operaciones</h2>
              <div className="h-[2px] flex-grow bg-[#1A1A1A] opacity-20"></div>
            </div>
            <div className="grid md:grid-cols-4 gap-0 border-4 border-[#1A1A1A] bg-white shadow-[15px_15px_0px_0px_#1A1A1A]">
              <div className="p-8 border-b-4 md:border-b-0 md:border-r-4 border-[#1A1A1A] hover:bg-orange-50 transition-colors group">
                <div className="w-12 h-12 bg-[#1A1A1A] text-white flex items-center justify-center font-black text-2xl mb-6 group-hover:bg-[#FF5F00] transition-colors">01</div>
                <h3 className="font-black uppercase text-xl mb-3 leading-none text-[#1A1A1A]">Abordá <br/> una ruta</h3>
                <p className="font-mono text-xs uppercase leading-relaxed text-gray-500">Elegís una línea temática — Sci-Fi, Boom Latino, Noir — y comenzás el viaje.</p>
              </div>
              <div className="p-8 border-b-4 md:border-b-0 md:border-r-4 border-[#1A1A1A] hover:bg-orange-50 transition-colors group">
                <div className="w-12 h-12 bg-[#1A1A1A] text-white flex items-center justify-center font-black text-2xl mb-6 group-hover:bg-[#FF5F00] transition-colors">02</div>
                <h3 className="font-black uppercase text-xl mb-3 leading-none text-[#1A1A1A]">Completá <br/> cada estación</h3>
                <p className="font-mono text-xs uppercase leading-relaxed text-gray-500">Al terminar cada libro escribís tu bitácora y lo puntuás con estrellas.</p>
              </div>
              <div className="p-8 border-b-4 md:border-b-0 md:border-r-4 border-[#1A1A1A] hover:bg-orange-50 transition-colors group">
                <div className="w-12 h-12 bg-[#1A1A1A] text-white flex items-center justify-center font-black text-2xl mb-6 group-hover:bg-[#FF5F00] transition-colors">03</div>
                <h3 className="font-black uppercase text-xl mb-3 leading-none text-[#1A1A1A]">Ganá XP <br/> y logros</h3>
                <p className="font-mono text-xs uppercase leading-relaxed text-gray-500">Cada ruta completada suma experiencia y desbloquea sellos de maquinista.</p>
              </div>
              <div className="p-8 hover:bg-orange-50 transition-colors group">
                <div className="w-12 h-12 bg-[#1A1A1A] text-white flex items-center justify-center font-black text-2xl mb-6 group-hover:bg-[#FF5F00] transition-colors">04</div>
                <h3 className="font-black uppercase text-xl mb-3 leading-none text-[#1A1A1A]">Revisá tu <br/> historial</h3>
                <p className="font-mono text-xs uppercase leading-relaxed text-gray-500">Todas tus rutas y reseñas quedan guardadas en tu perfil personal.</p>
              </div>
            </div>
          </section>

          {/* TREN INTERACTIVO */}
          <section className="mb-32 overflow-visible">
            <div className="px-8 mb-4 font-mono text-[10px] font-bold opacity-30 uppercase tracking-[0.5em]">
              Tráfico de Unidades en Vivo // Red_Global
            </div>
            {/* Solo pasamos lineasAleatorias que es lo que espera el componente Tren */}
            <Tren lineasAleatorias={lineasAleatorias} />
            
            <div className="flex justify-center mt-8">
               <button 
                 onClick={barajarLineas}
                 className="font-mono text-[9px] uppercase font-black border-2 border-black px-4 py-2 hover:bg-[#FF5F00] transition-colors bg-white shadow-[4px_4px_0px_0px_#1A1A1A] active:shadow-none"
               >
                 [ Reordenar_Tráfico ]
               </button>
            </div>
          </section>


          {/* REGISTROS DE PASAJEROS (OPINIONES) */}
          <section className="mb-32">
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-[#1A1A1A]">Registros de Pasajeros</h2>
              <div className="h-[2px] flex-grow bg-[#1A1A1A] opacity-20"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { user: "User_88", msg: "La mejor forma de trackear mi línea de Ciencia Ficción. El sistema de estaciones es adictivo.", ruta: "Línea_Asimov" },
                { user: "Reader_Bot", msg: "Visualmente increíble. Por fin mi biblioteca se siente como algo vivo y no un Excel aburrido.", ruta: "Línea_Cyberpunk" },
                { user: "Cap_Lectura", msg: "He completado 12 estaciones este mes. El transbordo entre géneros funciona perfecto.", ruta: "Línea_Clásicos" }
              ].map((testimonio, idx) => (
                <div key={idx} className="border-2 border-[#1A1A1A] p-6 bg-white shadow-[8px_8px_0px_0px_#1A1A1A] group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-[#FF5F00] text-white text-[10px] font-black px-2 py-1 uppercase tracking-tighter">ID: {testimonio.user}</div>
                    <span className="text-[#1A1A1A] opacity-20 text-4xl font-serif">“</span>
                  </div>
                  <p className="font-bold text-lg leading-tight mb-6 italic text-[#1A1A1A]">"{testimonio.msg}"</p>
                  <div className="border-t-2 border-dashed border-gray-200 pt-4 flex justify-between items-center text-[#1A1A1A]">
                    <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-gray-400">Ruta Activa</span>
                    <span className="font-mono text-[9px] uppercase font-black">{testimonio.ruta}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* TICKET DE EMBARQUE */}
          <div className="relative border-4 border-[#1A1A1A] bg-white p-12 mb-20 flex flex-col md:flex-row justify-between items-center gap-10 shadow-[15px_15px_0px_0px_#FF5F00]">
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#F5F5F5] border-4 border-[#1A1A1A] rounded-full hidden md:block"></div>
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#F5F5F5] border-4 border-[#1A1A1A] rounded-full hidden md:block"></div>
            <div className="text-center md:text-left">
              <h2 className="text-5xl font-black uppercase leading-none mb-3 text-[#1A1A1A]">¿Listo para el transbordo?</h2>
              <p className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ticket ID: 2026-RED-PRX-EST</p>
            </div>
            <Link to="/auth" className="w-full md:w-auto bg-[#1A1A1A] text-white px-12 py-5 font-black uppercase italic hover:bg-[#FF5F00] transition-colors text-center border-2 border-black">
              Obtener Boleto
            </Link>
          </div>

          {/* FOOTER TERMINAL */}
          <footer className="bg-[#1A1A1A] text-white -mx-8 border-t-4 border-[#FF5F00] px-8 py-8">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#FF5F00] flex items-center justify-center text-white font-black text-sm uppercase">P</div>
                <div>
                  <span className="font-black uppercase tracking-tighter text-2xl block leading-none">Próxima Estación</span>
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