import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEstacion } from '../context/EstacionContext';

const RutaActiva = () => {
  const navigate = useNavigate();
  const { rutaActiva, finalizarRuta } = useEstacion();
  const [tiempoEnVia, setTiempoEnVia] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [comentario, setComentario] = useState(""); 
  const [reporteFinal, setReporteFinal] = useState("");
  const [estacionesLocales, setEstacionesLocales] = useState([]);

  useEffect(() => {
    if (rutaActiva) {
      setEstacionesLocales(rutaActiva.estaciones);
    }
    const timer = setInterval(() => setTiempoEnVia(p => p + 1), 1000);
    return () => clearInterval(timer);
  }, [rutaActiva]);

  if (!rutaActiva) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center p-8 font-sans">
        <h2 className="text-4xl font-black italic uppercase mb-8">No hay ruta activa en el sistema</h2>
        <Link to="/perfil" className="bg-[#1A1A1A] text-white px-8 py-4 font-black uppercase text-xs hover:bg-[#FF5F00] shadow-[6px_6px_0px_0px_#FF5F00]">
          Ir al Perfil de Despacho
        </Link>
      </div>
    );
  }

  const formatearTiempo = (s) => {
    const m = Math.floor(s / 60);
    const seg = s % 60;
    return `${m.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
  };

  const estacionActualIdx = estacionesLocales.findIndex(e => !e.completada);
  const estacionActual = estacionActualIdx !== -1 ? estacionesLocales[estacionActualIdx] : estacionesLocales[estacionesLocales.length - 1];
  const rutaFinalizada = estacionActualIdx === -1;

  const handleValidarArribo = () => {
    const nuevasEstaciones = [...estacionesLocales];
    nuevasEstaciones[estacionActualIdx].completada = true;
    setEstacionesLocales(nuevasEstaciones);
    setComentario(""); 
    if (estacionActualIdx === estacionesLocales.length - 1) setShowToast(true);
  };

  const handleEnviarReporte = () => {
    finalizarRuta({
      id: `REP-${Date.now()}`,
      ruta: rutaActiva.titulo,
      fecha: new Date().toLocaleDateString(),
      maquinista: "USUARIO_ACTUAL",
      extracto: reporteFinal,
      esPropio: true
    });
    navigate('/muro');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans relative overflow-x-hidden text-left">
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-md animate-bounce">
          <div className="bg-[#1A1A1A] border-4 border-[#FF5F00] p-6 shadow-[10px_10px_0px_0px_rgba(255,95,0,0.5)]">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-[#FF5F00] flex items-center justify-center font-black text-2xl italic">!</div>
              <div>
                <h4 className="text-[#FF5F00] font-black uppercase italic text-lg leading-none">Misión Completada</h4>
                <p className="text-white font-mono text-[9px] uppercase tracking-widest">Protocolo Final_Línea Ejecutado</p>
              </div>
            </div>
            <button onClick={() => setShowToast(false)} className="w-full bg-[#FF5F00] text-[#1A1A1A] py-2 font-black uppercase text-[10px] hover:bg-white transition-colors">
              [ Archivar Registro ]
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b-4 border-[#1A1A1A] pb-8">
          <div>
            <div className="flex gap-2 mb-4">
              <span className="bg-[#1A1A1A] text-white px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest font-black">Control_Vía</span>
              <span className="border-2 border-[#1A1A1A] px-2 py-0.5 font-mono text-[9px] uppercase font-bold text-[#FF5F00]">ID_{rutaActiva.id}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase italic leading-[0.8] tracking-tighter">{rutaActiva.titulo}</h1>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="bg-white border-4 border-[#1A1A1A] p-4 shadow-[6px_6px_0px_0px_#FF5F00] min-w-[140px]">
              <p className="font-mono text-[9px] font-black uppercase opacity-40 leading-none mb-1">Tiempo_Viaje</p>
              <p className="text-2xl font-black font-mono leading-none">{formatearTiempo(tiempoEnVia)}</p>
            </div>
            <Link to="/perfil" className="bg-[#1A1A1A] text-white px-8 py-4 font-black uppercase text-xs hover:bg-[#FF5F00] flex items-center shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]">
              ← Abandonar
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white border-4 border-[#1A1A1A] p-6 shadow-[8px_8px_0px_0px_#1A1A1A]">
              <h3 className="font-black uppercase text-xs mb-8 border-b-2 border-[#FF5F00] inline-block italic">Progreso de la Línea</h3>
              <div className="space-y-6 relative">
                <div className="absolute left-[15px] top-2 bottom-2 w-1 bg-[#1A1A1A]/10"></div>
                {estacionesLocales.map((e, i) => (
                  <div key={e.id} className="flex items-center gap-4 relative z-10">
                    <div className={`w-8 h-8 border-4 flex items-center justify-center font-black text-[10px] 
                      ${e.completada ? 'bg-green-500 border-[#1A1A1A]' : 
                        e.id === estacionActual.id && !rutaFinalizada ? 'bg-[#FF5F00] border-[#1A1A1A] animate-pulse' : 'bg-white border-[#1A1A1A]/20'}`}>
                      {i + 1}
                    </div>
                    <div>
                      <p className={`text-[11px] font-black uppercase leading-none ${e.completada ? 'text-gray-400 italic line-through' : 'text-[#1A1A1A]'}`}>{e.titulo}</p>
                      <p className="text-[8px] font-mono opacity-50 uppercase font-bold">{e.autor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <main className="lg:col-span-8">
            <div className="bg-white border-4 border-[#1A1A1A] p-8 md:p-12 shadow-[12px_12px_0px_0px_#1A1A1A] relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#FF5F00] text-black font-black text-[10px] px-6 py-1 uppercase italic border-l-4 border-b-4 border-[#1A1A1A]">
                {rutaFinalizada ? "LÍNEA_COMPLETA" : "Estación_Actual"}
              </div>

              <div className="mb-10">
                <h2 className="text-6xl md:text-8xl font-black uppercase italic leading-[0.85] tracking-tighter mb-4">
                  {rutaFinalizada ? "FIN DEL VIAJE" : estacionActual.titulo}
                </h2>
                {!rutaFinalizada && <p className="text-xl font-bold uppercase italic text-[#FF5F00]">{estacionActual.autor}</p>}
              </div>

              {!rutaFinalizada ? (
                <div className="space-y-8">
                  <div className="border-4 border-[#1A1A1A] bg-white p-5 shadow-[4px_4px_0px_0px_#1A1A1A]">
                    <span className="block font-mono text-[10px] uppercase mb-1 text-[#FF5F00] font-black tracking-tighter">Carga de Vía</span>
                    <span className="text-2xl font-black uppercase">{estacionActual.paginas} KM</span>
                  </div>
                  <textarea 
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Bitácora de tramo..."
                    className="w-full bg-[#F9F9F9] border-4 border-[#1A1A1A] p-4 font-bold text-xs uppercase outline-none focus:bg-white focus:border-[#FF5F00] h-24 resize-none"
                  />
                  <button onClick={handleValidarArribo} className="w-full bg-[#FF5F00] border-4 border-[#1A1A1A] py-5 font-black uppercase italic shadow-[6px_6px_0px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    Validar Arribo →
                  </button>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <textarea 
                    value={reporteFinal} 
                    onChange={(e) => setReporteFinal(e.target.value)} 
                    placeholder="Escribe el reporte final del trayecto..." 
                    className="w-full bg-[#F5F5F5] border-4 border-[#1A1A1A] p-6 font-bold text-xs uppercase outline-none focus:bg-white h-40 resize-none"
                  />
                  <button onClick={handleEnviarReporte} className="w-full bg-[#FF5F00] border-4 border-[#1A1A1A] py-5 font-black uppercase italic shadow-[6px_6px_0px_0px_#1A1A1A] transition-all">
                    Enviar Reporte a la Central
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default RutaActiva;