import React from 'react';
import { Link } from 'react-router-dom';
import Tren from '../components/Tren';

// Componente para las estadísticas tipo cartel ferroviario (Split-flap)
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
              <div className="border-4 border-[#1A1A1A] p-6 bg-white shadow-[15px_15px_0px_0px_#1A1A1A]">
                <div className="flex justify-between items-center mb-4 border-b-2 border-[#1A1A1A] pb-2 font-mono text-[10px] font-bold text-[#1A1A1A]">
                  <span>ESTADO_RED</span>
                  <span className="w-3 h-3 bg-green-500 animate-pulse"></span>
                </div>
                <div className="space-y-4 font-mono text-[#1A1A1A]">
                  <div className="border-b border-gray-100 pb-2">
                    <p className="text-[9px] opacity-50 uppercase tracking-tighter">Terminal_Actual</p>
                    <p className="text-lg font-black uppercase truncate">CENTRAL_EST_2026</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-gray-100 p-2"><p className="text-[9px] opacity-50">NIVEL</p><p className="font-bold">01</p></div>
                    <div className="bg-gray-100 p-2"><p className="text-[9px] opacity-50">ESTADO</p><p className="font-bold uppercase">Activo</p></div>
                  </div>
                  <div className="bg-[#1A1A1A] text-[#FF5F00] p-3 text-center text-[10px] font-black animate-pulse uppercase">
                    Sincronizando datos...
                  </div>
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
            <div className="grid md:grid-cols-3 gap-0 border-4 border-[#1A1A1A] bg-white shadow-[15px_15px_0px_0px_#1A1A1A]">
                <div className="p-10 border-b-4 md:border-b-0 md:border-r-4 border-[#1A1A1A] hover:bg-orange-50 transition-colors group">
                    <div className="w-12 h-12 bg-[#1A1A1A] text-white flex items-center justify-center font-black text-2xl mb-6 group-hover:bg-[#FF5F00] transition-colors">01</div>
                    <h3 className="font-black uppercase text-2xl mb-4 leading-none text-[#1A1A1A]">Crea tu propia <br/> Red de lectura</h3>
                    <p className="font-mono text-xs uppercase leading-relaxed text-gray-500">Define tus géneros favoritos como líneas de transporte personalizadas.</p>
                </div>
                <div className="p-10 border-b-4 md:border-b-0 md:border-r-4 border-[#1A1A1A] hover:bg-orange-50 transition-colors group">
                    <div className="w-12 h-12 bg-[#1A1A1A] text-white flex items-center justify-center font-black text-2xl mb-6 group-hover:bg-[#FF5F00] transition-colors">02</div>
                    <h3 className="font-black uppercase text-2xl mb-4 leading-none text-[#1A1A1A]">Marca paradas <br/> en cada libro</h3>
                    <p className="font-mono text-xs uppercase leading-relaxed text-gray-500">Cada título terminado es una estación conquistada en tu mapa literario.</p>
                </div>
                <div className="p-10 hover:bg-orange-50 transition-colors group">
                    <div className="w-12 h-12 bg-[#1A1A1A] text-white flex items-center justify-center font-black text-2xl mb-6 group-hover:bg-[#FF5F00] transition-colors">03</div>
                    <h3 className="font-black uppercase text-2xl mb-4 leading-none text-[#1A1A1A]">Visualiza tu <br/> progreso real</h3>
                    <p className="font-mono text-xs uppercase leading-relaxed text-gray-500">Mira cómo crecen tus rutas a medida que avanzas por nuevas páginas.</p>
                </div>
            </div>
          </section>

          {/* TREN INTERACTIVO */}
          <div className="-mx-8 mb-32 overflow-hidden">
             <div className="px-8 mb-4 font-mono text-[10px] font-bold opacity-30 uppercase tracking-[0.5em]">Tráfico de Unidades en Vivo</div>
            <Tren lineas={lineas} lineasAleatorias={lineasAleatorias} barajarLineas={barajarLineas} />
          </div>


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
          <footer className="bg-[#1A1A1A] text-white -mx-8 p-12 border-t-8 border-[#FF5F00]">
            <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12">
              <div className="md:col-span-5">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-[#FF5F00] flex items-center justify-center text-white font-black text-xs uppercase">P</div>
                  <span className="font-black uppercase tracking-tighter text-2xl">Próxima Estación</span>
                </div>
                <p className="font-mono text-xs uppercase tracking-widest leading-relaxed opacity-60 max-w-sm">
                  Sistema de gestión de itinerarios literarios. Trazando rutas desde 2026. 
                  Todos los derechos reservados.
                </p>
              </div>
              <div className="md:col-span-3 font-mono">
                <h4 className="text-[#FF5F00] font-black text-xs uppercase mb-6 tracking-[0.2em]">Mapa del Sitio</h4>
                <ul className="space-y-4 text-sm uppercase font-bold">
                  <li><a href="#" className="hover:text-[#FF5F00] transition-colors">// Terminal_Central</a></li>
                  <li><a href="#" className="hover:text-[#FF5F00] transition-colors">// Red_Global</a></li>
                </ul>
              </div>
              <div className="md:col-span-4 font-mono">
                <h4 className="text-[#FF5F00] font-black text-xs uppercase mb-6 tracking-[0.2em]">Conexión</h4>
                <div className="border-2 border-white/20 p-4 relative overflow-hidden">
                  <p className="text-[10px] mb-2 opacity-50 uppercase tracking-tighter">Suscripción a alertas:</p>
                  <div className="flex">
                    <input type="text" placeholder="EMAIL_ADRESS" className="bg-transparent border-b-2 border-white/40 flex-grow py-1 text-xs outline-none focus:border-[#FF5F00]" />
                    <button className="ml-2 text-[#FF5F00] font-black text-xs underline uppercase">Enviar</button>
                  </div>
                  <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 animate-pulse m-1"></div>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center opacity-40 font-mono text-[9px] uppercase tracking-[0.4em]">
              <span>System_Status: Optimal</span>
              <span>v.2.6.0_Stable</span>
              <span>Build_Date: FEB_2026</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Inicio;