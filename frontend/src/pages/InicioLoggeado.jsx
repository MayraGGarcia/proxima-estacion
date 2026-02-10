import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Tren from '../components/Tren';

// Componente FlapStat integrado
const FlapStat = ({ label, value }) => {
  const safeValue = (typeof value === 'string' || typeof value === 'number') ? String(value) : "---";

  return (
    <div className="flex flex-col items-start border-l-4 border-[#FF5F00] pl-6 py-2">
      <span className="text-[9px] font-mono text-gray-400 uppercase tracking-[0.3em] mb-4">
        {label}
      </span>
      <div className="flex gap-[2px]">
        {safeValue.split('').map((char, i) => (
          <span 
            key={`${label}-${i}`} 
            className="flap-unit animate-flap text-2xl font-black bg-[#1A1A1A] text-[#FF5F00] p-2 min-w-[32px] text-center rounded-sm relative overflow-hidden shadow-inner"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {char}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/40 z-10"></div>
          </span>
        ))}
      </div>
    </div>
  );
};

const InicioLoggeado = ({ lineas, lineasAleatorias, barajarLineas, setIsLogged }) => {
  const [filtro, setFiltro] = useState('TODAS');

  // Función para salir
  const handleLogout = () => {
    setIsLogged(false);
  };

  // Datos simulados de la comunidad (descubrimiento)
  const recomendacionesGlobales = [
    { id: 101, usuario: "Lectora_Alpha", titulo: "Ruta del Terror Gótico", estaciones: 12, progreso: 80, tags: ["TERROR", "TOP"] },
    { id: 102, usuario: "Viajero_Sideral", titulo: "Expreso de Marte", estaciones: 5, progreso: 20, tags: ["SCI-FI"] },
    { id: 103, usuario: "Neo_Reader", titulo: "Transbordo Cyberpunk", estaciones: 8, progreso: 100, tags: ["CYBER"] },
  ];

  // Datos para el tren de tendencias
  const tendenciasRed = [
    { id: 1, nombre: "Línea Distopía", color: "#FF5F00" },
    { id: 2, nombre: "Ruta: Rayuela", color: "#1A1A1A" },
    { id: 3, nombre: "Expreso: 1984", color: "#FF5F00" },
    { id: 4, nombre: "Línea: Fundación", color: "#1A1A1A" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans selection:bg-[#FF5F00] selection:text-white overflow-x-hidden">
      
      {/* FONDO TÉCNICO */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative z-10">
        
        {/* NAVEGACIÓN SUPERIOR CON BOTÓN DE CERRAR SESIÓN */}
        <nav className="p-8 flex justify-between items-center border-b-2 border-[#1A1A1A] bg-[#F5F5F5]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF5F00] flex items-center justify-center text-white font-black text-xs uppercase">P</div>
            <span className="font-black uppercase tracking-tighter text-xl text-left">Próxima Estación</span>
          </div>
          <div className="flex items-center gap-4">
              <Link to="/perfil" className="px-6 py-2 border-2 border-[#1A1A1A] bg-white text-[#1A1A1A] font-black uppercase text-sm hover:bg-gray-100 transition-all shadow-[4px_4px_0px_0px_#1A1A1A] active:shadow-none">
                Mi Panel
              </Link>
              {/* BOTÓN CERRAR SESIÓN */}
              <button 
                onClick={handleLogout}
                className="px-6 py-2 border-2 border-[#1A1A1A] bg-[#1A1A1A] text-white font-black uppercase text-sm hover:bg-red-600 transition-all shadow-[4px_4px_0px_0px_#FF5F00] active:shadow-none active:translate-x-1 active:translate-y-1"
              >
                Cerrar Sesión
              </button>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto pt-12 px-8 text-left">
          
          {/* HEADER DE EXPLORACIÓN */}
          <header className="mb-12">
              <span className="bg-[#1A1A1A] text-white px-2 py-1 text-[9px] font-mono uppercase tracking-[0.2em] mb-4 inline-block">
                Estado: Conectado // Terminal_Global
              </span>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
                Rutas de la <br /> <span className="text-[#FF5F00]">Comunidad</span>.
              </h1>
              <p className="font-mono text-[11px] uppercase font-bold text-gray-400 max-w-2xl leading-relaxed">
                Visualizando itinerarios públicos de otros pasajeros. Analiza las estaciones conquistadas por la red y descubre tu próximo destino literario.
              </p>
          </header>

          {/* MÉTRICAS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-4 border-[#1A1A1A] bg-[#222] mb-16 shadow-[10px_10px_0px_0px_#FF5F00]">
            <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-white/5"><FlapStat label="Pasajeros" value="1204" /></div>
            <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-white/5"><FlapStat label="Rutas_Red" value="8942" /></div>
            <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-white/5"><FlapStat label="Sync" value="ONL" /></div>
            <div className="p-8"><FlapStat label="Carga" value="012" /></div>
          </div>

          {/* BARRA DE FILTROS */}
          <div className="flex flex-wrap gap-3 mb-12 border-b-2 border-[#1A1A1A] pb-8">
            {['TODAS', 'MÁS_VOTADAS', 'NUEVAS_RUTAS', 'RECOMENDADOS'].map((f) => (
              <button 
                key={f} 
                onClick={() => setFiltro(f)}
                className={`px-4 py-1 font-mono text-[10px] font-black uppercase border-2 border-[#1A1A1A] transition-all ${filtro === f ? 'bg-[#FF5F00] text-white' : 'hover:bg-gray-200'}`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* GRID DE RECOMENDACIONES */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {recomendacionesGlobales.map((linea) => (
              <div key={linea.id} className="border-4 border-[#1A1A1A] bg-white p-6 shadow-[10px_10px_0px_0px_#1A1A1A] group hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-tighter">Operador: {linea.usuario}</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-black uppercase leading-none mb-6 group-hover:text-[#FF5F00] transition-colors italic">
                  "{linea.titulo}"
                </h3>
                <div className="mb-6">
                  <div className="flex justify-between font-mono text-[9px] font-black mb-1 uppercase opacity-50">
                    <span>Avance_Ruta</span>
                    <span>{linea.progreso}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 border-2 border-[#1A1A1A]">
                    <div className="h-full bg-[#FF5F00]" style={{ width: `${linea.progreso}%` }}></div>
                  </div>
                </div>
                <button className="w-full py-3 bg-[#1A1A1A] text-white font-black uppercase text-[10px] hover:bg-[#FF5F00] transition-colors flex items-center justify-center gap-2">
                  Ver Bitácora de Ruta <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            ))}
          </div>

          {/* TABLA DE TRÁFICO */}
          <section className="mb-24">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">Últimos Transbordos</h2>
              <div className="h-[2px] flex-grow bg-[#1A1A1A] opacity-10"></div>
            </div>
            <div className="border-4 border-[#1A1A1A] bg-white overflow-hidden shadow-[12px_12px_0px_0px_#1A1A1A]">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[10px]">
                  <thead>
                    <tr className="bg-[#1A1A1A] text-white uppercase tracking-widest">
                      <th className="p-4">Hora</th>
                      <th className="p-4">Pasajero</th>
                      <th className="p-4">Estación (Libro)</th>
                      <th className="p-4">Línea</th>
                      <th className="p-4 text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-[#1A1A1A]">
                    {[
                      { h: "14:32", u: "User_99", l: "El Resplandor", r: "Terror", s: "COMPLETADO" },
                      { h: "14:28", u: "Reader_X", l: "Fundación", r: "Sci-Fi", s: "EN_CURSO" },
                      { h: "14:15", u: "Lector_B", l: "Anna Karenina", r: "Clásicos", s: "NUEVA_PARADA" },
                      { h: "13:50", u: "Admin_2", l: "1984", r: "Distopía", s: "COMPLETADO" }
                    ].map((t, i) => (
                      <tr key={i} className="hover:bg-orange-50 transition-colors uppercase font-bold">
                        <td className="p-4 opacity-40">{t.h}</td>
                        <td className="p-4">@{t.u}</td>
                        <td className="p-4 italic">"{t.l}"</td>
                        <td className="p-4 font-black text-[#FF5F00]">{t.r}</td>
                        <td className="p-4 text-right font-black text-[9px]">{t.s}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* TREN */}
          <div className="-mx-8 mb-24 overflow-hidden border-y-4 border-[#1A1A1A] bg-white py-12">
            <div className="px-8 mb-6 flex items-center gap-3">
              <span className="w-3 h-3 bg-[#FF5F00] animate-ping"></span>
              <span className="font-mono text-[11px] font-black uppercase opacity-60 tracking-[0.4em]">
                Unidades en Movimiento // Tendencias_Globales
              </span>
            </div>
            <Tren lineasAleatorias={tendenciasRed} />
          </div>

          {/* SECCIÓN DE AVISOS */}
          <section className="mb-32 grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-[#FF5F00] border-4 border-[#1A1A1A] p-10 text-[#1A1A1A] relative overflow-hidden flex flex-col justify-center shadow-[10px_10px_0px_0px_#1A1A1A]">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/20 rotate-45"></div>
              <h3 className="text-4xl font-black uppercase italic leading-[0.8] mb-6 text-left">Aviso de <br />Mantenimiento</h3>
              <p className="font-mono text-[11px] font-bold uppercase leading-tight mb-8">
                La línea de "Realismo Mágico" sufrirá actualizaciones en los nodos de datos durante la madrugada. Se recomienda descargar bitácoras.
              </p>
              <button className="self-start border-2 border-[#1A1A1A] px-6 py-2 text-[10px] font-black uppercase hover:bg-white transition-colors">
                Consultar Protocolo
              </button>
            </div>

            <div className="border-4 border-[#1A1A1A] p-10 bg-white flex flex-col justify-center shadow-[12px_12px_0px_0px_#1A1A1A]">
              <h3 className="text-2xl font-black uppercase mb-4 leading-none text-left">¿Quieres que tu <br />ruta aparezca aquí?</h3>
              <p className="text-sm font-bold text-gray-400 mb-8 uppercase tracking-tight">
                Configura tus líneas como "Públicas" en tu panel para que otros pasajeros puedan seguir tu rastro y votar tus paradas.
              </p>
              <Link to="/perfil" className="self-start underline font-black uppercase text-xs hover:text-[#FF5F00] transition-colors">
                Ir a Mi Configuración →
              </Link>
            </div>
          </section>

        </main>

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
              MODO_EXPLORACIÓN_ACTIVO <br />
              <span className="text-green-500 font-black tracking-normal">Online // Estación_Central</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default InicioLoggeado;