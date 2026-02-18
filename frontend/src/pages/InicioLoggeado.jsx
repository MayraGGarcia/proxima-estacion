import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Tren from '../components/Tren';

// --- DATOS PARA SIMULACIÓN DE TRÁFICO ---
const USUARIOS_DEMO = ["Lectora_Alpha", "Gabo_Fan", "Cyber_Reader", "User_77", "BookDragon", "Void_Walker", "Maquinista_X", "Neo_Reader"];
const ESTACIONES_DEMO = ["Cien Años de Soledad", "Neuromante", "Drácula", "Fundación", "Rayuela", "1984", "La Tregua", "Ficciones"];
const ESTADOS_DEMO = ["SINCRO_OK", "EN_CURSO", "TRANSBORDO", "FINALIZADO"];

// --- COMPONENTE: MODAL DE BITÁCORA ---
const ModalBitacora = ({ ruta, onClose, onSeguir }) => {
  if (!ruta) return null;

  const estaciones = [
    { id: 1, titulo: "Estación de Inicio", leido: true },
    { id: 2, titulo: "Libro de Transbordo", leido: ruta.progreso >= 50 },
    { id: 3, titulo: "Terminal de Destino", leido: ruta.progreso === 100 },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1A1A1A]/90 backdrop-blur-sm text-left">
      <div className="bg-white border-4 border-[#FF5F00] w-full max-w-lg shadow-[15px_15px_0px_0px_#1A1A1A] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-[#1A1A1A] p-4 flex justify-between items-center">
          <div>
            <span className="text-[#FF5F00] font-mono text-[10px] uppercase tracking-widest block">Bitácora de Ruta // {ruta.id}</span>
            <h2 className="text-white text-2xl font-black uppercase italic leading-none">{ruta.titulo}</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-[#FF5F00] font-black text-2xl transition-colors">✕</button>
        </div>

        <div className="p-6 bg-[#F5F5F5] space-y-4">
          {estaciones.map((est, index) => (
            <div key={est.id} className="flex items-center gap-4 group">
              <div className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full border-2 border-[#1A1A1A] flex items-center justify-center ${est.leido ? 'bg-green-500' : 'bg-white'}`}>
                  {est.leido && <div className="w-1.5 h-1.5 bg-[#1A1A1A] rounded-full"></div>}
                </div>
                {index !== estaciones.length - 1 && <div className="w-0.5 h-8 bg-[#1A1A1A]"></div>}
              </div>
              <div className={`flex-grow p-3 border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] bg-white ${est.leido ? 'opacity-60' : ''}`}>
                <div className="flex justify-between items-center">
                  <span className="font-black text-xs uppercase italic">{est.titulo}</span>
                  <span className={`font-mono text-[9px] font-black ${est.leido ? 'text-green-600' : 'text-[#FF5F00]'}`}>
                    {est.leido ? 'ESTACIÓN_CONQUISTADA' : 'PENDIENTE_DE_SYNC'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t-2 border-[#1A1A1A] flex justify-between items-center">
          <div className="text-left">
            <p className="font-mono text-[10px] font-black uppercase opacity-40">Sincronía Actual</p>
            <p className="text-2xl font-black text-[#FF5F00] leading-none">{ruta.progreso}%</p>
          </div>
          <button onClick={() => onSeguir(ruta.titulo)} className="bg-[#1A1A1A] text-white px-6 py-2 font-black uppercase text-xs hover:bg-[#FF5F00] transition-colors">
            Seguir esta Línea →
          </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE: BANNER DE DESAFÍO ---
const BannerDesafio = ({ progresoActual, meta, aceptado, onAceptar }) => {
  const porcentaje = (progresoActual / meta) * 100;
  return (
    <div className={`border-4 border-[#1A1A1A] p-10 relative overflow-hidden flex flex-col justify-center shadow-[10px_10px_0px_0px_#1A1A1A] group transition-all duration-500 ${aceptado ? 'bg-[#1A1A1A] text-[#FF5F00]' : 'bg-[#FF5F00] text-[#1A1A1A]'}`}>
      <div className={`absolute -right-8 -top-8 w-32 h-32 rotate-45 transition-transform group-hover:scale-110 ${aceptado ? 'bg-orange-500/10' : 'bg-white/20'}`}></div>
      <div className="relative z-10 text-left">
        <span className={`${aceptado ? 'bg-[#FF5F00] text-black' : 'bg-[#1A1A1A] text-[#FF5F00]'} px-2 py-0.5 font-black text-[9px] uppercase tracking-tighter mb-4 inline-block`}>
          {aceptado ? 'DESAFÍO_EN_CURSO' : 'Evento_Global_Activo'}
        </span>
        <h3 className="text-5xl font-black uppercase italic leading-[0.8] mb-4 tracking-tighter">
          {aceptado ? 'MODO_TURBO_ACTIVO' : 'Protocolo de Aceleración'}
        </h3>
        <p className={`font-mono text-[11px] font-bold uppercase mb-8 max-w-sm ${aceptado ? 'text-white/80' : 'text-[#1A1A1A]'}`}>
          {aceptado ? "Sincronizando con tus rutas..." : `Completa ${meta} estaciones para obtener el rango de Maquinista.`}
        </p>
        <div className="flex flex-wrap gap-6 items-end">
          <button onClick={onAceptar} disabled={aceptado} className={`border-4 border-[#1A1A1A] px-6 py-2 text-[10px] font-black uppercase transition-all ${aceptado ? 'bg-green-500 text-black border-green-500' : 'bg-[#1A1A1A] text-white hover:bg-white hover:text-[#1A1A1A]'}`}>
            {aceptado ? '✓ RASTREANDO' : 'Aceptar Desafío →'}
          </button>
          <div className="flex flex-col gap-1 min-w-[140px]">
            <span className="font-black text-[9px] uppercase opacity-70">Progreso: {progresoActual}/{meta}</span>
            <div className={`w-full h-3 border-2 border-[#1A1A1A] ${aceptado ? 'bg-orange-950' : 'bg-[#1A1A1A]/10'}`}>
              <div className={`h-full ${aceptado ? 'bg-[#FF5F00]' : 'bg-[#1A1A1A]'}`} style={{ width: `${porcentaje}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE: FLAPSTAT ---
const FlapStat = ({ label, value }) => {
  const safeValue = String(value || "---");
  return (
    <div className="flex flex-col items-start border-l-4 border-[#FF5F00] pl-6 py-2 text-left">
      <span className="text-[9px] font-mono text-gray-400 uppercase tracking-[0.3em] mb-4">{label}</span>
      <div className="flex gap-[2px]">
        {safeValue.split('').map((char, i) => (
          <span key={i} className="text-2xl font-black bg-[#1A1A1A] text-[#FF5F00] p-2 min-w-[32px] text-center rounded-sm relative overflow-hidden shadow-inner">
            {char}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/40"></div>
          </span>
        ))}
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
const InicioLoggeado = ({ setIsLogged }) => {
  const [filtro, setFiltro] = useState('TODAS');
  const [desafioAceptado, setDesafioAceptado] = useState(false);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [notificacion, setNotificacion] = useState(null);
  
  // Estado para los transbordos en tiempo real
  const [transbordos, setTransbordos] = useState([
    { h: "00:45", u: "Admin_Master", l: "Manifiesto Brutalista", s: "SINCRO_OK" },
    { h: "00:42", u: "Neo_Reader", l: "Dune", s: "EN_CURSO" },
    { h: "00:38", u: "Gabo_Fan", l: "Cien Años de Soledad", s: "SINCRO_OK" }
  ]);

  // Lógica de actualización de transbordos
  useEffect(() => {
    const intervalo = setInterval(() => {
      const nuevoTransbordo = {
        h: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        u: USUARIOS_DEMO[Math.floor(Math.random() * USUARIOS_DEMO.length)],
        l: ESTACIONES_DEMO[Math.floor(Math.random() * ESTACIONES_DEMO.length)],
        s: ESTADOS_DEMO[Math.floor(Math.random() * ESTADOS_DEMO.length)]
      };

      setTransbordos(prev => [nuevoTransbordo, ...prev.slice(0, 4)]);
    }, 6000); // Actualización cada 6 segundos

    return () => clearInterval(intervalo);
  }, []);

  const handleSeguirRuta = (titulo) => {
    setNotificacion(`Sincronizando: ${titulo}...`);
    setRutaSeleccionada(null);
    setTimeout(() => setNotificacion(null), 3500);
  };

  const todasLasRutas = {
    'TODAS': [
      { id: 101, usuario: "Lectora_Alpha", titulo: "Ruta del Terror Gótico", progreso: 80 },
      { id: 102, usuario: "Viajero_Sideral", titulo: "Expreso de Marte", progreso: 20 },
      { id: 103, usuario: "Neo_Reader", titulo: "Transbordo Cyberpunk", progreso: 100 },
    ],
    'MÁS_VOTADAS': [
      { id: 201, usuario: "Admin_Master", titulo: "El Canon Occidental", progreso: 95 },
      { id: 202, usuario: "Gabo_Fan", titulo: "Macondo Express", progreso: 60 },
    ],
    'NUEVAS_RUTAS': [
      { id: 301, usuario: "User_New", titulo: "Línea: Poesía Beat", progreso: 10 },
      { id: 302, usuario: "Draft_Reader", titulo: "Borradores del Futuro", progreso: 45 },
    ]
  };

  const rutasAMostrar = todasLasRutas[filtro] || todasLasRutas['TODAS'];

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans overflow-x-hidden relative">
      
      {/* TOAST NOTIFICACIÓN */}
      {notificacion && (
        <div className="fixed bottom-10 right-10 z-[110] bg-[#1A1A1A] text-[#FF5F00] border-2 border-[#FF5F00] p-4 font-mono text-xs shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-bounce">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[#FF5F00] animate-pulse"></span>
            <p>[SISTEMA]: {notificacion} <span className="text-white">LINK_ESTABLECIDO</span></p>
          </div>
        </div>
      )}

      {/* MODAL */}
      {rutaSeleccionada && (
        <ModalBitacora ruta={rutaSeleccionada} onClose={() => setRutaSeleccionada(null)} onSeguir={handleSeguirRuta} />
      )}

      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="relative z-10">
        <nav className="p-8 flex justify-between items-center border-b-2 border-[#1A1A1A] bg-[#F5F5F5]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF5F00] flex items-center justify-center text-white font-black text-xs uppercase">P</div>
            <span className="font-black uppercase tracking-tighter text-xl text-left">Próxima Estación</span>
          </div>
          <div className="flex gap-4">
            <Link to="/perfil" className="px-6 py-2 border-2 border-[#1A1A1A] bg-white text-[#1A1A1A] font-black uppercase text-sm shadow-[4px_4px_0px_0px_#1A1A1A]">Mi Panel</Link>
            <button onClick={() => setIsLogged(false)} className="px-6 py-2 border-2 border-[#1A1A1A] bg-[#1A1A1A] text-white font-black uppercase text-sm shadow-[4px_4px_0px_0px_#FF5F00]">Cerrar Sesión</button>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto pt-12 px-8 text-left">
          <header className="mb-12">
            <span className="bg-[#1A1A1A] text-white px-2 py-1 text-[9px] font-mono uppercase tracking-[0.2em] mb-4 inline-block">Estado: Conectado // Terminal_Global</span>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8">Rutas de la <br /> <span className="text-[#FF5F00]">Comunidad</span>.</h1>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-4 border-4 border-[#1A1A1A] bg-[#222] mb-16 shadow-[10px_10px_0px_0px_#FF5F00]">
            <div className="p-8 border-r-2 border-white/5"><FlapStat label="Pasajeros" value="1204" /></div>
            <div className="p-8 border-r-2 border-white/5"><FlapStat label="Rutas_Red" value="8942" /></div>
            <div className="p-8 border-r-2 border-white/5"><FlapStat label="Sync" value="ONL" /></div>
            <div className="p-8"><FlapStat label="Carga" value="012" /></div>
          </div>

          <div className="flex flex-wrap gap-3 mb-12 border-b-2 border-[#1A1A1A] pb-8">
            {Object.keys(todasLasRutas).map((f) => (
              <button key={f} onClick={() => setFiltro(f)} className={`px-4 py-1 font-mono text-[10px] font-black uppercase border-2 border-[#1A1A1A] transition-all ${filtro === f ? 'bg-[#FF5F00] text-white' : 'hover:bg-gray-200'}`}>{f.replace('_', ' ')}</button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {rutasAMostrar.map((linea) => (
              <div key={linea.id} className="border-4 border-[#1A1A1A] bg-white p-6 shadow-[10px_10px_0px_0px_#1A1A1A] group hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer">
                <div className="flex justify-between mb-4 text-left"><span className="text-[10px] font-mono font-bold text-gray-400 uppercase">@{linea.usuario}</span><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div></div>
                <h3 className="text-3xl font-black uppercase leading-[0.9] mb-6 italic group-hover:text-[#FF5F00]">"{linea.titulo}"</h3>
                <div className="mb-6">
                  <div className="flex justify-between font-mono text-[9px] mb-1 uppercase opacity-50"><span>Tu Sincronía</span><span>{linea.progreso}%</span></div>
                  <div className="w-full h-3 bg-gray-100 border-2 border-[#1A1A1A]"><div className={`h-full ${linea.progreso === 100 ? 'bg-green-500' : 'bg-[#FF5F00]'}`} style={{ width: `${linea.progreso}%` }}></div></div>
                </div>
                <button onClick={() => setRutaSeleccionada(linea)} className="w-full py-3 bg-[#1A1A1A] text-white font-black uppercase text-[10px] hover:bg-[#FF5F00]">Ver Bitácora →</button>
              </div>
            ))}
          </div>

          {/* TABLA DE TRÁFICO DINÁMICA */}
          <section className="mb-24">
            <h2 className="text-3xl font-black uppercase mb-6 italic">Últimos Transbordos</h2>
            <div className="border-4 border-[#1A1A1A] bg-white overflow-hidden shadow-[12px_12px_0px_0px_#1A1A1A]">
              <table className="w-full text-left font-mono text-[10px]">
                <thead>
                  <tr className="bg-[#1A1A1A] text-white uppercase">
                    <th className="p-4">Hora</th>
                    <th className="p-4">Pasajero</th>
                    <th className="p-4">Estación</th>
                    <th className="p-4 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#1A1A1A]">
                  {transbordos.map((t, i) => (
                    <tr key={i} className={`hover:bg-orange-50 uppercase font-bold transition-all duration-500 ${i === 0 ? 'bg-orange-100/50 animate-pulse' : ''}`}>
                      <td className="p-4 opacity-40">{t.h}</td>
                      <td className="p-4">@{t.u}</td>
                      <td className="p-4 italic">"{t.l}"</td>
                      <td className={`p-4 text-right font-black ${t.s === 'SINCRO_OK' ? 'text-green-600' : 'text-[#FF5F00]'}`}>{t.s}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="-mx-8 mb-24 overflow-hidden border-y-4 border-[#1A1A1A] bg-white py-12">
            <Tren lineasAleatorias={[{id:1, nombre: "TENDENCIAS_RED", color: "#FF5F00"}, {id:2, nombre: "RUTAS_CRÍTICAS", color: "#1A1A1A"}]} />
          </div>

          <section className="mb-32 grid md:grid-cols-2 gap-8">
            <BannerDesafio progresoActual={1} meta={3} aceptado={desafioAceptado} onAceptar={() => { setDesafioAceptado(true); setNotificacion("PROTOCOLO ACTIVADO"); setTimeout(() => setNotificacion(null), 3000); }} />
            <div className="border-4 border-[#1A1A1A] p-10 bg-white shadow-[12px_12px_0px_0px_#1A1A1A]">
              <h3 className="text-2xl font-black uppercase mb-4 italic leading-none">¿Tu ruta aquí?</h3>
              <p className="text-sm font-bold text-gray-400 mb-8 uppercase">Configura tus líneas como "PÚBLICAS" en tu panel.</p>
              <Link to="/perfil" className="underline font-black uppercase text-xs hover:text-[#FF5F00]">Configuración →</Link>
            </div>
          </section>
        </main>

        <footer className="bg-[#1A1A1A] text-white p-12 text-left border-t-8 border-[#FF5F00]">
          <div className="max-w-7xl mx-auto flex flex-col md:grid md:grid-cols-2 justify-between items-center gap-10">
            <div className="flex items-center gap-3 w-full justify-start">
              <div className="w-10 h-10 bg-[#FF5F00] flex items-center justify-center text-white font-black text-sm uppercase">P</div>
              <div>
                <span className="font-black uppercase tracking-tighter text-2xl block leading-none">Próxima Estación</span>
                <span className="font-mono text-[8px] uppercase tracking-widest opacity-40 italic">Global Discovery Terminal // 2026</span>
              </div>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-40 text-center md:text-right w-full">
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