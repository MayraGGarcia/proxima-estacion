import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEstacion } from '../context/EstacionContext';
import { usePerfil } from '../context/PerfilContext';

const RutaActiva = () => {
  const navigate = useNavigate();
  const { rutaActiva, guardarProgreso, finalizarRuta, abandonarRuta } = useEstacion();
  const { ganarXP, verificarDesafio } = usePerfil();

  const [tiempoEnVia, setTiempoEnVia] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [comentario, setComentario] = useState('');
  const [reporteFinal, setReporteFinal] = useState('');

  // Inicializar estaciones desde el context 
  const [estacionesLocales, setEstacionesLocales] = useState(
    rutaActiva ? rutaActiva.estaciones : []
  );

  // Cronómetro de tránsito
  useEffect(() => {
    const timer = setInterval(() => setTiempoEnVia(p => p + 1), 1000);
    return () => clearInterval(timer);
  }, []);

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
  const estacionActual = estacionActualIdx !== -1
    ? estacionesLocales[estacionActualIdx]
    : estacionesLocales[estacionesLocales.length - 1];
  const rutaFinalizada = estacionActualIdx === -1;

  // RN-01: Solo se puede avanzar si la bitácora tiene contenido
  const puedeValidar = comentario.trim().length > 0;

  const handleValidarArribo = () => {
    if (!puedeValidar) return;
    const nuevasEstaciones = estacionesLocales.map((e, i) =>
      i === estacionActualIdx
        ? { ...e, completada: true, bitacora: comentario.trim() }
        : e
    );
    setEstacionesLocales(nuevasEstaciones);
    // Guardar el progreso en el context inmediatamente
    guardarProgreso(nuevasEstaciones);
    setComentario('');
    if (estacionActualIdx === estacionesLocales.length - 1) setShowToast(true);
  };

  // Salir temporalmente: guarda el progreso y vuelve al perfil SIN borrar la ruta
  const handleSalir = () => {
    guardarProgreso(estacionesLocales);
    navigate('/perfil');
  };

  // Abandonar definitivamente: confirma y borra la ruta del context
  const handleAbandonar = () => {
    if (window.confirm('¿Abandonar definitivamente esta ruta? Todo el progreso se perderá.')) {
      abandonarRuta();
      navigate('/perfil');
    }
  };

  const handleEnviarReporte = async () => {
    if (!reporteFinal.trim()) return;

    // Publicar el registro en el backend para que todos los maquinistas lo vean
    try {
      await fetch('http://localhost:5000/api/registros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rutaId: rutaActiva.id,
          maquinista: 'ADMIN_01',
          bitacoras: estacionesLocales.map(e => ({
            estacionTitulo: e.titulo,
            estacionAutor: e.autor,
            texto: e.bitacora || ''
          })),
          reporteFinal: reporteFinal.trim()
        })
      });
    } catch (err) {
      console.error("No se pudo publicar el registro:", err);
    }

    // Sumar XP por completar la ruta
    const bitacorasEscritas = estacionesLocales.filter(e => e.bitacora?.trim()).length;
    await ganarXP(50, 'ruta_completada', { bitacorasNuevas: bitacorasEscritas });

    // Verificar si era el desafío semanal activo
    await verificarDesafio(rutaActiva.id);

    // Guardar localmente en el context (para el historial del perfil)
    finalizarRuta({
      id: rutaActiva.id,
      nombre: rutaActiva.titulo,
      ruta: rutaActiva.titulo,
      fecha: new Date().toLocaleDateString(),
      maquinista: 'ADMIN_01',
      extracto: reporteFinal.trim(),
      esPropio: true,
      estaciones: estacionesLocales
    });
    navigate(`/muro/${rutaActiva.id}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans relative overflow-x-hidden text-left">

      {/* TOAST: Ruta completada */}
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

          <div className="flex gap-3 w-full md:w-auto flex-wrap">
            <div className="bg-white border-4 border-[#1A1A1A] p-4 shadow-[6px_6px_0px_0px_#FF5F00] min-w-[120px]">
              <p className="font-mono text-[9px] font-black uppercase opacity-40 leading-none mb-1">Tiempo_Viaje</p>
              <p className="text-2xl font-black font-mono leading-none">{formatearTiempo(tiempoEnVia)}</p>
            </div>

            {/* Salir: guarda progreso, no borra la ruta */}
            <button
              onClick={handleSalir}
              className="bg-white border-4 border-[#1A1A1A] px-6 py-4 font-black uppercase text-xs hover:bg-[#1A1A1A] hover:text-white transition-all shadow-[4px_4px_0px_0px_#1A1A1A]"
            >
              ← Salir
            </button>

            {/* Abandonar: destruye la ruta (con confirmación) */}
            <button
              onClick={handleAbandonar}
              className="bg-[#1A1A1A] text-white px-6 py-4 font-black uppercase text-xs hover:bg-red-700 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
            >
              Abandonar Ruta
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white border-4 border-[#1A1A1A] p-6 shadow-[8px_8px_0px_0px_#1A1A1A]">
              <h3 className="font-black uppercase text-xs mb-8 border-b-2 border-[#FF5F00] inline-block italic">Progreso de la Línea</h3>
              <div className="space-y-6 relative">
                <div className="absolute left-[15px] top-2 bottom-2 w-1 bg-[#1A1A1A]/10"></div>
                {estacionesLocales.map((e, i) => (
                  <div key={e.id || i} className="flex items-center gap-4 relative z-10">
                    <div className={`w-8 h-8 border-4 flex items-center justify-center font-black text-[10px]
                      ${e.completada
                        ? 'bg-green-500 border-[#1A1A1A]'
                        : e.id === estacionActual?.id && !rutaFinalizada
                          ? 'bg-[#FF5F00] border-[#1A1A1A] animate-pulse'
                          : 'bg-white border-[#1A1A1A]/20'}`}>
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
                  {rutaFinalizada ? "FIN DEL VIAJE" : estacionActual?.titulo}
                </h2>
                {!rutaFinalizada && (
                  <p className="text-xl font-bold uppercase italic text-[#FF5F00]">{estacionActual?.autor}</p>
                )}
              </div>

              {!rutaFinalizada ? (
                <div className="space-y-8">
                  <div className="border-4 border-[#1A1A1A] bg-white p-5 shadow-[4px_4px_0px_0px_#1A1A1A]">
                    <span className="block font-mono text-[10px] uppercase mb-1 text-[#FF5F00] font-black tracking-tighter">Carga de Vía</span>
                    <span className="text-2xl font-black uppercase">{estacionActual?.paginas} KM</span>
                  </div>
                  <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Bitácora de tramo..."
                    className="w-full bg-[#F9F9F9] border-4 border-[#1A1A1A] p-4 font-bold text-xs uppercase outline-none focus:bg-white focus:border-[#FF5F00] h-24 resize-none"
                  />
                  <button
                    onClick={handleValidarArribo}
                    disabled={!puedeValidar}
                    className={`w-full border-4 border-[#1A1A1A] py-5 font-black uppercase italic transition-all
                      ${puedeValidar
                        ? 'bg-[#FF5F00] shadow-[6px_6px_0px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none cursor-pointer'
                        : 'bg-gray-300 opacity-50 cursor-not-allowed'}`}
                  >
                    {puedeValidar ? 'Validar Arribo →' : 'Escribí la bitácora para continuar'}
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <p className="font-mono text-[10px] uppercase text-gray-400">Completaste todas las estaciones. Escribí el reporte final para publicar en el Muro.</p>
                  <textarea
                    value={reporteFinal}
                    onChange={(e) => setReporteFinal(e.target.value)}
                    placeholder="Escribe el reporte final del trayecto..."
                    className="w-full bg-[#F5F5F5] border-4 border-[#1A1A1A] p-6 font-bold text-xs uppercase outline-none focus:bg-white h-40 resize-none"
                  />
                  <button
                    onClick={handleEnviarReporte}
                    disabled={!reporteFinal.trim()}
                    className={`w-full border-4 border-[#1A1A1A] py-5 font-black uppercase italic transition-all
                      ${reporteFinal.trim()
                        ? 'bg-[#FF5F00] shadow-[6px_6px_0px_0px_#1A1A1A] cursor-pointer'
                        : 'bg-gray-300 opacity-50 cursor-not-allowed'}`}
                  >
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