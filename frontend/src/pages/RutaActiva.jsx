import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEstacion } from '../context/EstacionContext';
import { usePerfil } from '../context/PerfilContext';

const RutaActiva = () => {
  const navigate = useNavigate();
  const MAQUINISTA = sessionStorage.getItem('maquinista') || 'ANONIMO';
  const { rutaActiva, guardarProgreso, finalizarRuta, abandonarRuta } = useEstacion();
  const { ganarXP, verificarDesafio } = usePerfil();

  const [tiempoEnVia, setTiempoEnVia] = useState(0);
  const [comentario, setComentario] = useState('');
  const [reporteFinal, setReporteFinal] = useState('');
  const [misResenas, setMisResenas] = useState([]);
  const [sobreescribir, setSobreescribir] = useState(false);
  const [estrellasComentario, setEstrellasComentario] = useState(0);

  // Cargar reseñas del usuario para mostrar badge en estación actual
  useEffect(() => {
    fetch(`http://localhost:5000/api/resenas/maquinista/${MAQUINISTA}`)
      .then(r => r.json())
      .then(data => setMisResenas(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Inicializar estaciones desde el context (ya trae el progreso guardado)
  const [estacionesLocales, setEstacionesLocales] = useState(
    rutaActiva ? rutaActiva.estaciones : []
  );

  // Cronómetro de tránsito
  useEffect(() => {
    const timer = setInterval(() => setTiempoEnVia(p => p + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Cargar reseñas propias para detectar libros ya reseñados
  useEffect(() => {
    fetch(`http://localhost:5000/api/resenas/maquinista/${MAQUINISTA}`)
      .then(r => r.json())
      .then(data => setMisResenas(Array.isArray(data) ? data : []))
      .catch(() => {});
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
  // Si ya tiene reseña previa, puede avanzar sin escribir nada nuevo (usa la reseña como bitácora)
  const resenaActual = misResenas.find(r => r.libroTitulo === estacionActual?.titulo);
  const puedeValidar = resenaActual && !sobreescribir
    ? true
    : comentario.trim().length > 0 && estrellasComentario > 0;

  const handleValidarArribo = async () => {
    if (!puedeValidar) return;
    const textoBitacora = (resenaActual && !sobreescribir)
      ? resenaActual.texto
      : comentario.trim();

    // Guardar o actualizar la reseña en el backend
    const debeGuardarResena = !resenaActual || sobreescribir;
    if (debeGuardarResena && comentario.trim() && estrellasComentario > 0) {
      try {
        const nuevaResena = await fetch('http://localhost:5000/api/resenas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            libroTitulo: estacionActual.titulo,
            libroAutor: estacionActual.autor || 'Desconocido',
            libroPortada: estacionActual.portada || null,
            libroPaginas: estacionActual.paginas || null,
            libroAño: estacionActual.año || null,
            maquinista: MAQUINISTA,
            estrellas: estrellasComentario,
            texto: comentario.trim()
          })
        }).then(r => r.json());
        // Actualizar lista local de reseñas para que el badge aparezca de inmediato
        setMisResenas(prev => {
          const sinEsta = prev.filter(r => r.libroTitulo !== estacionActual.titulo);
          return [...sinEsta, nuevaResena];
        });
      } catch (err) {
        console.error('Error al guardar reseña:', err);
      }
    }

    const nuevasEstaciones = estacionesLocales.map((e, i) =>
      i === estacionActualIdx
        ? { ...e, completada: true, bitacora: textoBitacora }
        : e
    );
    setEstacionesLocales(nuevasEstaciones);
    guardarProgreso(nuevasEstaciones);
    setComentario('');
    setEstrellasComentario(0);
    setSobreescribir(false);
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
          maquinista: MAQUINISTA,
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
    finalizarRuta(reporteFinal.trim());
    navigate(`/muro/${rutaActiva.id}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans relative overflow-x-hidden text-left">

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
                {!rutaFinalizada && (() => {
                  const resenaExistente = misResenas.find(r => r.libroTitulo === estacionActual?.titulo);
                  return (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <p className="text-xl font-bold uppercase italic text-[#FF5F00]">{estacionActual?.autor}</p>
                        <button
                          onClick={() => navigate(`/estacion/${encodeURIComponent(estacionActual?.titulo)}`, {
                            state: {
                              titulo: estacionActual?.titulo,
                              autor: estacionActual?.autor,
                              portada: estacionActual?.portada,
                              paginas: estacionActual?.paginas,
                              año: estacionActual?.año
                            }
                          })}
                          className="border-2 border-[#1A1A1A] px-4 py-2 font-black uppercase text-[9px] hover:bg-[#FF5F00] transition-all bg-white shadow-[3px_3px_0px_0px_#1A1A1A] active:shadow-none"
                        >
                          Ver Ficha →
                        </button>
                      </div>
                      {resenaExistente && (
                        <div className="flex items-center gap-3 bg-[#1A1A1A] border-2 border-[#FF5F00] px-4 py-2 w-fit">
                          <span className="text-[#FF5F00] font-black text-sm">
                            {'★'.repeat(resenaExistente.estrellas)}
                          </span>
                          <span className="text-white font-mono text-[9px] uppercase tracking-widest">
                            Ya reseñaste este libro
                          </span>
                          <button
                            onClick={() => navigate(`/estacion/${encodeURIComponent(estacionActual?.titulo)}`, {
                              state: { titulo: estacionActual?.titulo, autor: estacionActual?.autor, portada: estacionActual?.portada }
                            })}
                            className="text-[#FF5F00] font-mono text-[9px] uppercase hover:underline">
                            Ver →
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {!rutaFinalizada ? (
                <div className="space-y-8">
                  <div className="border-4 border-[#1A1A1A] bg-white p-5 shadow-[4px_4px_0px_0px_#1A1A1A]">
                    <span className="block font-mono text-[10px] uppercase mb-1 text-[#FF5F00] font-black tracking-tighter">Carga de Vía</span>
                    <span className="text-2xl font-black uppercase">{estacionActual?.paginas} KM</span>
                  </div>
                  {resenaActual && !sobreescribir ? (
                    /* RESEÑA PREVIA BLOQUEADA */
                    <div className="border-4 border-[#1A1A1A] bg-[#1A1A1A]">
                      <div className="flex items-center justify-between px-4 py-2 border-b-2 border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="text-[#FF5F00] font-mono text-[9px] uppercase tracking-widest">✓ Reseña anterior</span>
                          <span className="text-[#FF5F00] text-xs">{'★'.repeat(resenaActual.estrellas)}</span>
                        </div>
                        <button
                          onClick={() => { setSobreescribir(true); setComentario(resenaActual.texto); }}
                          className="font-mono text-[9px] uppercase border border-white/20 px-3 py-1 text-white hover:bg-white hover:text-black transition-all">
                          Sobreescribir
                        </button>
                      </div>
                      <div className="p-4">
                        <p className="font-bold text-xs uppercase text-white/60 italic leading-relaxed">
                          "{resenaActual.texto}"
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* TEXTAREA HABILITADO */
                    <div className="relative">
                      {sobreescribir && (
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-[9px] uppercase text-[#FF5F00] font-black">Editando reseña anterior</span>
                          <button
                            onClick={() => { setSobreescribir(false); setComentario(''); }}
                            className="font-mono text-[9px] uppercase border border-black/20 px-2 py-1 hover:bg-black hover:text-white transition-all">
                            Cancelar
                          </button>
                        </div>
                      )}
                      <textarea
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        placeholder="Bitácora de tramo..."
                        className="w-full bg-[#F9F9F9] border-4 border-[#1A1A1A] p-4 font-bold text-xs uppercase outline-none focus:bg-white focus:border-[#FF5F00] h-24 resize-none mb-3"
                      />
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[9px] uppercase font-black text-gray-500">Puntuación</span>
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(i => (
                            <span key={i}
                              className="text-2xl cursor-pointer transition-all"
                              style={{ color: i <= estrellasComentario ? '#FF5F00' : '#D1D5DB' }}
                              onClick={() => setEstrellasComentario(i)}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleValidarArribo}
                    disabled={!puedeValidar}
                    className={`w-full border-4 border-[#1A1A1A] py-5 font-black uppercase italic transition-all
                      ${puedeValidar
                        ? 'bg-[#FF5F00] shadow-[6px_6px_0px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none cursor-pointer'
                        : 'bg-gray-300 opacity-50 cursor-not-allowed'}`}
                  >
                    {puedeValidar ? 'Validar Arribo →' : 'Escribí la bitácora y elegí puntuación para continuar'}
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