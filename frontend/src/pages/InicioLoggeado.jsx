import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Tren from '../components/Tren';
import { useEstacion } from '../context/EstacionContext';
import { usePerfil } from '../context/PerfilContext';

// --- [COMPONENTE 1]: FLAPSTAT ---
const FlapStat = ({ label, value }) => {
  const isNumeric = !isNaN(value) && !isNaN(parseFloat(value));
  const safeValue = isNumeric 
    ? String(value).padStart(3, '0') 
    : String(value);

  return (
    <div className="flex flex-col items-start border-l-4 border-[#FF5F00] pl-6 py-2 text-left">
      <span className="text-[9px] font-mono text-gray-400 uppercase tracking-[0.3em] mb-4">
        {label}
      </span>
      <div className="flex gap-[2px]">
        {safeValue.split('').map((char, i) => (
          <span 
            key={i} 
            className="text-2xl font-black bg-[#1A1A1A] text-[#FF5F00] p-2 min-w-[32px] text-center rounded-sm relative overflow-hidden shadow-inner"
          >
            {char}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/40"></div>
          </span>
        ))}
      </div>
    </div>
  );
};

// --- [COMPONENTE 2]: MODAL DE BITÁCORA ---
const ModalBitacora = ({ ruta, onClose, onSeguir }) => {
  if (!ruta) return null;

  const criterio = ruta.configuracion?.metodo || 'Manual';
  const justificacion = ruta.configuracion?.justificacion;

  const criterioConfig = {
    'Kilometraje': { label: 'Orden por Kilometraje', color: 'bg-blue-500', detalle: (est) => `${est.paginas || '?'} KM` },
    'Cronología':  { label: 'Orden Cronológico',     color: 'bg-purple-500', detalle: (est) => `${est.año || '?'}` },
    'Manual':      { label: 'Orden Manual',           color: 'bg-[#FF5F00]',  detalle: (est) => null },
  };
  const cfg = criterioConfig[criterio] || criterioConfig['Manual'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1A1A1A]/95 backdrop-blur-md text-left">
      <div className="bg-white border-4 border-[#FF5F00] w-full max-w-2xl shadow-[20px_20px_0px_0px_#1A1A1A] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* HEADER */}
        <div className="bg-[#1A1A1A] p-6 flex justify-between items-center border-b-4 border-[#FF5F00]">
          <div>
            <span className="text-[#FF5F00] font-mono text-[10px] uppercase tracking-widest block mb-1 underline underline-offset-4">Manifiesto de Carga // REF_{ruta._id?.slice(-6).toUpperCase()}</span>
            <h2 className="text-white text-4xl font-black uppercase italic leading-none tracking-tighter">{ruta.nombre}</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-[#FF5F00] font-black text-3xl p-2 transition-colors">✕</button>
        </div>

        {/* BADGE DE CRITERIO */}
        <div className="px-8 pt-6 pb-2 bg-[#F5F5F5] flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className={`${cfg.color} text-white font-black text-[9px] uppercase px-3 py-1 tracking-widest`}>
              {cfg.label}
            </span>
            {criterio !== 'Manual' && (
              <span className="font-mono text-[9px] text-gray-400 uppercase">
                Estaciones ordenadas de menor a mayor
              </span>
            )}
          </div>
          {criterio === 'Manual' && justificacion && (
            <div className="border-l-4 border-[#FF5F00] pl-3 py-1">
              <p className="font-mono text-[9px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Sello de Curaduría</p>
              <p className="font-bold text-xs uppercase italic text-[#1A1A1A]">"{justificacion}"</p>
            </div>
          )}
        </div>

        {/* ESTACIONES */}
        <div className="p-8 bg-[#F5F5F5] space-y-6 max-h-[50vh] overflow-y-auto">
          {ruta.estaciones.map((est, index) => (
            <div key={index} className="flex items-start gap-6 group">
              <div className="flex flex-col items-center pt-2">
                <div className="w-5 h-5 rounded-full border-4 border-[#1A1A1A] bg-[#FF5F00]"></div>
                {index !== ruta.estaciones.length - 1 && <div className="w-1 h-20 bg-[#1A1A1A] my-1"></div>}
              </div>
              <div className="flex-grow p-4 border-2 border-[#1A1A1A] shadow-[6px_6px_0px_0px_#1A1A1A] bg-white flex gap-5">
                <div className="w-16 h-24 bg-gray-200 border-2 border-black flex-shrink-0 overflow-hidden">
                  {est.portada && <img src={est.portada} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="min-w-0 flex flex-col justify-center">
                  <span className="font-black text-lg uppercase italic leading-tight mb-1">{est.titulo}</span>
                  <span className="font-mono text-xs text-gray-500 uppercase font-black tracking-widest">{est.autor}</span>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <span className="text-[10px] font-bold uppercase bg-black text-white px-2 py-0.5 tracking-tighter">EST: {index + 1}</span>
                    <span className="text-[10px] font-bold uppercase border border-black px-2 py-0.5 tracking-tighter">{est.paginas || '000'} KM</span>
                    {cfg.detalle(est) && (
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 tracking-tighter text-white ${cfg.color}`}>
                        {cfg.detalle(est)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="p-6 bg-white border-t-4 border-[#1A1A1A] flex justify-between items-center">
          <div className="text-left border-l-4 border-[#FF5F00] pl-4">
            <p className="font-mono text-[10px] font-black uppercase opacity-50 tracking-widest">Pasajeros Actuales</p>
            <p className="text-3xl font-black text-[#1A1A1A] leading-none italic">{String(Math.max(ruta.pasajeros || 0, 1)).padStart(4, '0')}</p>
          </div>
          <button onClick={() => onSeguir(ruta)} className="bg-[#FF5F00] text-black px-10 py-4 font-black uppercase text-sm shadow-[6px_6px_0px_0px_#1A1A1A] hover:bg-black hover:text-[#FF5F00] transition-all transform active:scale-95">Abordar Línea →</button>
        </div>
      </div>
    </div>
  );
};

// --- [COMPONENTE 3]: BANNER DE DESAFÍO SEMANAL ---
const BannerDesafio = ({ desafio, onAbordar }) => {
  const navigate = useNavigate();
  if (!desafio) return (
    <div className="border-4 border-dashed border-[#1A1A1A] p-10 flex items-center justify-center opacity-30">
      <p className="font-black uppercase text-sm italic">Sin desafío activo esta semana</p>
    </div>
  );

  const ruta = desafio.rutaId;
  const completado = desafio.completado;
  const diasRestantes = Math.max(0, Math.ceil((new Date(desafio.fechaFin) - new Date()) / 86400000));

  return (
    <div className={`border-4 border-[#1A1A1A] p-10 relative overflow-hidden flex flex-col justify-center shadow-[10px_10px_0px_0px_#1A1A1A] transition-all duration-500 text-left
      ${completado ? 'bg-[#1A1A1A] text-[#FF5F00]' : 'bg-[#FF5F00] text-[#1A1A1A]'}`}>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span className={`${completado ? 'bg-[#FF5F00] text-black' : 'bg-[#1A1A1A] text-[#FF5F00]'} px-2 py-0.5 font-black text-[9px] uppercase tracking-tighter`}>
            Desafío_Semanal
          </span>
          {!completado && (
            <span className="font-mono text-[9px] font-black uppercase opacity-60">
              {diasRestantes}d restantes
            </span>
          )}
        </div>

        <h3 className="text-4xl font-black uppercase italic leading-[0.85] mb-2 tracking-tighter">
          {desafio.titulo}
        </h3>
        {ruta && (
          <p className="font-mono text-[11px] font-bold uppercase mb-1 opacity-80">
            Ruta: {ruta.nombre}
          </p>
        )}
        <p className={`font-mono text-[10px] font-bold uppercase mb-6 max-w-sm opacity-70`}>
          {desafio.descripcion}
        </p>

        <div className="flex items-center gap-3 mb-6">
          <span className={`font-black text-2xl ${completado ? 'text-[#FF5F00]' : 'text-[#1A1A1A]'}`}>
            +{desafio.xpRecompensa} XP
          </span>
          <span className="font-mono text-[9px] uppercase opacity-50">al completarla</span>
        </div>

        {completado ? (
          <div className="flex items-center gap-3">
            <span className="text-2xl">✓</span>
            <span className="font-black uppercase text-sm">Desafío completado esta semana</span>
          </div>
        ) : (
          ruta && (
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => onAbordar(ruta)}
                className="border-4 border-[#1A1A1A] px-6 py-3 text-[10px] font-black uppercase bg-[#1A1A1A] text-white hover:bg-white hover:text-[#1A1A1A] transition-all"
              >
                ⚡ Abordar Desafío →
              </button>
              <button
                onClick={() => navigate(`/muro/${ruta._id}`)}
                className="border-4 border-[#1A1A1A] px-6 py-3 text-[10px] font-black uppercase bg-transparent hover:bg-[#1A1A1A] hover:text-white transition-all opacity-60"
              >
                Ver bitácoras →
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

// --- [COMPONENTE 4]: ÚLTIMOS TRANSBORDOS ---
const SeccionTransbordos = ({ rutas }) => (
  <div className="mb-24 text-left">
    <div className="flex items-center gap-4 mb-8">
      <h3 className="text-3xl font-black uppercase italic tracking-tighter">Últimos_Transbordos</h3>
      <div className="flex-grow h-[2px] bg-[#1A1A1A] opacity-10"></div>
      <span className="font-mono text-[10px] font-black animate-pulse text-[#FF5F00]">LIVE_FEED</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {rutas.slice(0, 4).map((r, i) => (
        <div key={i} className="flex items-center justify-between p-4 border-2 border-[#1A1A1A] bg-white hover:bg-[#1A1A1A] hover:text-white transition-all group">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] font-black opacity-30 group-hover:text-[#FF5F00]">{new Date(r.fechaDespacho || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <div className="w-2 h-2 bg-[#FF5F00] rotate-45"></div>
            <span className="font-black uppercase text-xs tracking-widest truncate max-w-[200px]">{r.nombre}</span>
          </div>
          <div className="text-[10px] font-black bg-[#FF5F00] text-black px-2 py-0.5">+{Math.max(r.pasajeros || 0, 1)} PAX</div>
        </div>
      ))}
    </div>
  </div>
);

// --- [COMPONENTE PRINCIPAL]: INICIO LOGGEADO ---
const InicioLoggeado = ({ setIsLogged }) => {
  const navigate = useNavigate();
  const { rutaActiva, despacharRutaActiva } = useEstacion();
  const { ganarXP, desafioActivo } = usePerfil();
  const [rutas, setRutas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState('TODAS');
  const [busqueda, setBusqueda] = useState('');
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [errorTerminal, setErrorTerminal] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/rutas')
      .then(res => res.json())
      .then(data => { 
        setRutas(data); 
        setCargando(false); 
      })
      .catch(() => setCargando(false));
  }, []);

  const handleAbordar = async (ruta) => {
    if (rutaActiva) {
      setErrorTerminal(`BLOQUEO_DE_VÍA: La línea "${rutaActiva.titulo}" sigue activa en tu terminal.`);
      setRutaSeleccionada(null);
      setTimeout(() => setErrorTerminal(null), 5000);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/rutas/${ruta._id}/abordar`, { 
        method: 'PUT' 
      });
      if (!res.ok) throw new Error("Fallo en la sincronización");
      const actualizada = await res.json();
      despacharRutaActiva(actualizada);
      await ganarXP(10, 'ruta_abordada');
      setRutas(rutas.map(r => r._id === actualizada._id ? actualizada : r));
      setRutaSeleccionada(null);
      setErrorTerminal(null);
      navigate('/ruta/activa');
    } catch (err) {
      console.error("Error en la terminal:", err);
      setErrorTerminal("ERROR_CRÍTICO: No se pudo establecer conexión con la vía.");
    }
  };

  const totalPasajeros = rutas.reduce((acc, curr) => acc + Math.max(curr.pasajeros || 0, 1), 0);

  const filtradas = [...rutas]
    .filter(r => r.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => {
      if (filtro === 'MÁS_VOTADAS') return (b.pasajeros || 0) - (a.pasajeros || 0);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans selection:bg-[#FF5F00] selection:text-white relative">
      
      {/* FONDO DE CUADRÍCULA */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative z-10">
        {/* MODALES Y ALERTAS */}
        {errorTerminal && (
          <div className="fixed top-0 left-0 w-full z-[200] bg-red-600 text-white font-black p-4 flex justify-between items-center animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-4">
              <span className="bg-black text-white px-2 py-1 text-[10px]">ALERT_ERR</span>
              <span className="uppercase tracking-tighter text-sm">{errorTerminal}</span>
            </div>
            <button onClick={() => setErrorTerminal(null)} className="border-2 border-white px-4 py-1 hover:bg-white hover:text-red-600 transition-all font-mono text-xs uppercase">[Cerrar]</button>
          </div>
        )}

        {rutaSeleccionada && <ModalBitacora ruta={rutaSeleccionada} onClose={() => setRutaSeleccionada(null)} onSeguir={handleAbordar} />}

        <nav className="p-10 flex justify-between items-center border-b-4 border-[#1A1A1A] sticky top-0 bg-[#F5F5F5]/80 backdrop-blur-md z-50">
          <div className="flex items-center gap-4 font-black uppercase text-2xl italic tracking-tighter">
            <div className="w-10 h-10 bg-[#1A1A1A] text-[#FF5F00] flex items-center justify-center border-b-4 border-[#FF5F00]">P</div>
            Próxima Estación <span className="text-[#FF5F00] not-italic ml-2 font-mono text-xs tracking-widest opacity-40">v.1.0</span>
          </div>
          <div className="flex gap-6 items-center">
            <Link 
              to="/perfil" 
              className="px-8 py-3 bg-[#1A1A1A] text-white font-black uppercase text-xs shadow-[5px_5px_0px_0px_#FF5F00] hover:bg-[#FF5F00] hover:text-black transition-all flex items-center gap-3"
            >
              {/* Símbolo con animación de parpadeo */}
              <span className="text-[#FF5F00] font-mono animate-pulse tracking-tighter">[ o ]</span>
              Terminal Personal // ID
            </Link>
            <button onClick={() => setIsLogged(false)} className="w-10 h-10 border-2 border-black hover:bg-black hover:text-white font-black transition-colors">✕</button>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-16 px-8">
          <header className="mb-20 text-left">
            <span className="bg-[#FF5F00] text-black font-black uppercase text-[10px] px-3 py-1 mb-6 tracking-[0.4em] shadow-[4px_4px_0px_0px_#1A1A1A] inline-block">Red_Global_Sincronizada</span>
            <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] italic mb-8">Líneas en <br/> <span className="text-[#FF5F00] not-italic underline decoration-8">Tránsito</span>.</h1>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-4 border-4 border-[#1A1A1A] bg-[#222] mb-24 shadow-[10px_10px_0px_0px_#FF5F00]">
            <div className="p-8 border-r-2 border-white/5"><FlapStat label="Total_Abordajes" value={totalPasajeros} /></div>
            <div className="p-8 border-r-2 border-white/5"><FlapStat label="Líneas_Red" value={rutas.length} /></div>
            <div className="p-8 border-r-2 border-white/5"><FlapStat label="Sync_Status" value="ONL" /></div>
            <div className="p-8"><FlapStat label="Carga_Sistema" value="99" /></div>
          </div>

          <SeccionTransbordos rutas={rutas} />

          {/* FILTROS */}
          <section className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 items-stretch justify-between border-b-4 border-[#1A1A1A] pb-8">
              <div className="flex gap-2">
                <button onClick={() => setFiltro('TODAS')} className={`px-6 py-2 font-black uppercase text-[10px] tracking-widest border-2 border-black transition-all ${filtro === 'TODAS' ? 'bg-black text-[#FF5F00]' : 'bg-white hover:bg-gray-100'}`}>01. Recientes</button>
                <button onClick={() => setFiltro('MÁS_VOTADAS')} className={`px-6 py-2 font-black uppercase text-[10px] tracking-widest border-2 border-black transition-all ${filtro === 'MÁS_VOTADAS' ? 'bg-black text-[#FF5F00]' : 'bg-white hover:bg-gray-100'}`}>02. Mayor Tráfico</button>
              </div>
              <div className="relative flex-grow max-w-md">
                <input type="text" placeholder="BUSCAR_LÍNEA_ACTIVA..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full bg-white border-2 border-black p-3 font-mono text-xs uppercase outline-none focus:ring-2 ring-[#FF5F00] placeholder:opacity-30" />
              </div>
            </div>
          </section>

          {/* LISTADO DE RUTAS */}
          <div className="grid md:grid-cols-3 gap-10 mb-32">
            {cargando ? (
              <p className="col-span-full font-black uppercase animate-pulse text-center py-20">Sincronizando_Vías...</p>
            ) : filtradas.length > 0 ? (
              filtradas.map(ruta => (
                <article key={ruta._id} className="bg-white border-4 border-[#1A1A1A] p-8 shadow-[12px_12px_0px_0px_#1A1A1A] group hover:translate-x-1 hover:translate-y-1 transition-all text-left flex flex-col h-full">
                  <div className="flex justify-between items-center mb-8 border-b-2 border-gray-100 pb-4">
                    <span className="font-mono text-[10px] font-black text-gray-400 uppercase tracking-widest">Live_Feed // #{ruta._id?.slice(-3)}</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="text-4xl font-black uppercase leading-[0.9] italic mb-8 group-hover:text-[#FF5F00] break-words flex-grow">"{ruta.nombre}"</h3>
                  <div className="flex items-center justify-between gap-4 mt-auto">
                    <div className="bg-gray-100 px-4 py-2 border-l-4 border-black">
                      <span className="text-[8px] font-black uppercase text-gray-400 block">Tráfico</span>
                      <span className="font-mono text-lg font-black">{Math.max(ruta.pasajeros || 0, 1)}</span>
                    </div>
                    <button onClick={() => setRutaSeleccionada(ruta)} className="flex-grow bg-[#1A1A1A] text-white py-4 font-black uppercase text-xs hover:bg-[#FF5F00] hover:text-black transition-all">Ver Bitácora →</button>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full py-20 border-4 border-dashed border-black/10 text-center">
                <p className="font-black uppercase opacity-20">No se encontraron líneas en el sector "{busqueda}"</p>
              </div>
            )}
          </div>

          {/* TREN INTERACTIVO */}
          <div className="-mx-8 mb-32 overflow-visible">
            <div className="px-8 mb-4 font-mono text-[10px] font-bold opacity-30 uppercase tracking-[0.5em]">
              Tráfico de Unidades en Vivo // Red_Global
            </div>
            <Tren lineasAleatorias={rutas.slice(0, 10).map(r => ({ id: r._id, nombre: r.nombre.toUpperCase() }))} />
          </div>

          {/* BANNER Y DESAFÍO */}
          <section className="grid md:grid-cols-2 gap-8 mb-32 text-left">
            <BannerDesafio desafio={desafioActivo} onAbordar={handleAbordar} />
            <div className="border-4 border-[#1A1A1A] p-10 bg-white shadow-[12px_12px_0px_0px_#1A1A1A] flex flex-col justify-center">
              <h3 className="text-2xl font-black uppercase italic mb-4 tracking-tighter">¿Tu ruta aquí?</h3>
              <p className="text-sm font-bold text-gray-400 mb-8 uppercase tracking-tighter leading-tight">Configura tus líneas como "PÚBLICAS" en tu terminal para que la red pueda sincronizarlas con el sistema global.</p>
              <Link to="/perfil" className="underline font-black uppercase text-xs hover:text-[#FF5F00]">Panel de Configuración →</Link>
            </div>
          </section>
        </main>

        <footer className="bg-[#1A1A1A] text-white p-16 border-t-8 border-[#FF5F00] relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16 relative z-10 text-left">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF5F00] text-black flex items-center justify-center font-black">P</div>
                <h4 className="font-black text-3xl uppercase italic tracking-tighter">Próxima Estación</h4>
              </div>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] leading-relaxed">Protocolo de sincronización descentralizada // Despachando conocimiento desde el subsuelo digital.</p>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-black uppercase text-xs text-[#FF5F00] tracking-[0.4em]">Monitor_Vías</span>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(8)].map((_, i) => <div key={i} className={`h-1 w-full bg-[#FF5F00] ${i < 6 ? 'animate-pulse' : 'opacity-20'}`}></div>)}
              </div>
            </div>
            <div className="flex flex-col justify-between items-end">
              <nav className="flex flex-col items-end gap-3 text-right">
                <Link to="/perfil" className="text-xs font-black uppercase hover:text-[#FF5F00]">Configurar Terminal</Link>
                <Link to="/muro" className="text-xs font-black uppercase hover:text-[#FF5F00]">Mapa de la Red</Link>
              </nav>
              <div className="mt-12">
                <span className="text-[10px] font-mono text-gray-600 uppercase block tracking-widest">© 2026 // BY_MGG_DEV</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default InicioLoggeado;