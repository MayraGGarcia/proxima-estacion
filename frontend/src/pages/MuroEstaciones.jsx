import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useEstacion } from '../context/EstacionContext';
import API_URL from '../config';

const PortadaEstacion = ({ est }) => {
  if (!est) return <div className="w-20 h-28 bg-[#1A1A1A]" />;
  
  const url = est.portada || est.imagen || est.cover || 
              (est.coverId ? `https://covers.openlibrary.org/b/id/${est.coverId}-M.jpg` : null);

  return (
    <div className="w-20 h-28 bg-[#1A1A1A] flex-shrink-0 border-2 border-black shadow-[4px_4px_0px_0px_#FF5F00] overflow-hidden relative">
      {url ? (
        <img 
          src={url} 
          alt="Portada" 
          className="w-full h-full object-cover" 
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div className={`${url ? 'hidden' : 'flex'} absolute inset-0 flex-col items-center justify-center bg-[#1A1A1A]`}>
        <span className="text-[#FF5F00] font-black text-[8px]">SIN_DATOS</span>
      </div>
    </div>
  );
};

const BitacoraRuta = ({ rutaId }) => {
  const navigate = useNavigate();
  const [registrosBackend, setRegistrosBackend] = useState([]);
  const [tituloRuta, setTituloRuta] = useState('Cargando...');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // FIX 1: limpiar estado anterior inmediatamente al cambiar de ruta
    setRegistrosBackend([]);
    setTituloRuta('Cargando...');
    setCargando(true);

    const cargar = async () => {
      try {
        // Fetch nombre de ruta y registros en paralelo
        const [rutaRes, regRes] = await Promise.all([
          fetch(`${API_URL}/api/rutas/${rutaId}`),
          fetch(`${API_URL}/api/registros/${rutaId}`)
        ]);

        // Parsear nombre de ruta — no bloquear si falla
        try {
          const rutaData = await rutaRes.json();
          if (rutaData?.nombre) setTituloRuta(rutaData.nombre);
        } catch { setTituloRuta('Ruta'); }

        // Parsear registros — no bloquear si falla
        try {
          const regData = await regRes.json();
          const lista = Array.isArray(regData) ? regData : [regData].filter(Boolean);
          setRegistrosBackend(lista.map(reg => ({
            ...reg,
            reporteFinal: reg.reporteFinal || reg.extracto || '',
            bitacoras: (reg.bitacoras || []).map(b => ({
              estacionTitulo: b.estacionTitulo || b.titulo   || '',
              estacionAutor:  b.estacionAutor  || b.autor    || '',
              portada:        b.portada        || b.imagen   || null,
              texto:          b.texto          || b.bitacora || '',
            }))
          })));
        } catch { setRegistrosBackend([]); }

      } catch (err) {
        console.error('Error cargando muro:', err);
        setTituloRuta('Error al cargar');
        setRegistrosBackend([]);
      } finally {
        // siempre desactivar el spinner — nunca quedar colgado
        setCargando(false);
      }
    };

    cargar();
  }, [rutaId]); // se re-ejecuta cada vez que cambia rutaId

  const maquinistaActual = sessionStorage.getItem('maquinista') || '';
  const registrosFinales = [...registrosBackend].sort((a, b) => {
    if (a.maquinista === maquinistaActual) return -1;
    if (b.maquinista === maquinistaActual) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link to="/perfil" className="inline-block border-2 border-black px-6 py-2 font-black uppercase text-[10px] mb-8 hover:bg-black hover:text-white shadow-[4px_4px_0px_0px_#FF5F00] transition-all">
          ← VOLVER AL PERFIL
        </Link>

        <header className="border-b-8 border-black pb-6 mb-12">
          <span className="bg-[#FF5F00] text-black px-2 py-0.5 font-black text-[10px] uppercase">Terminal de Registros</span>
          <h1 className="text-6xl font-black uppercase italic tracking-tighter mt-2">
            {tituloRuta}
          </h1>
        </header>

        {cargando ? (
          <div className="py-20 text-center font-black uppercase animate-pulse opacity-40 text-xs">
            Sincronizando registros...
          </div>
        ) : registrosFinales.length === 0 ? (
          <div className="py-20 border-4 border-dashed border-[#1A1A1A]/10 text-center uppercase font-black opacity-20">
            Sin registros todavía
          </div>
        ) : (
          <div className="space-y-12">
            {registrosFinales.map((reg, idx) => {
              const esMio = reg.maquinista === maquinistaActual;
              return (
                <div key={idx} className={`border-4 bg-white shadow-[10px_10px_0px_0px_#1A1A1A] ${esMio ? 'border-[#FF5F00]' : 'border-black'}`}>
                  <div className={`p-4 flex justify-between items-center text-white ${esMio ? 'bg-[#FF5F00]' : 'bg-black'}`}>
                    <div className="flex items-center gap-3">
                      <span className={`font-black uppercase italic ${esMio ? 'text-black' : 'text-white'}`}>{reg.maquinista}</span>
                      {esMio && <span className="font-black text-[9px] uppercase bg-black text-[#FF5F00] px-2 py-0.5">Tu Bitácora</span>}
                    </div>
                    <span className={`font-mono text-[10px] opacity-60 ${esMio ? 'text-black' : 'text-white'}`}>
                      {reg.fechaFinalizacion ? new Date(reg.fechaFinalizacion).toLocaleDateString("es-AR") : ""}
                    </span>
                  </div>
                  
                  <div className="divide-y-2 divide-black/5">
                    {reg.bitacoras?.map((bit, i) => (
                      <div key={i} className="p-6 flex gap-6">
                        <PortadaEstacion est={bit} />
                        <div className="flex-grow">
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <p className="font-black uppercase text-sm">{bit.estacionTitulo}</p>
                            <button
                              onClick={() => navigate(`/estacion/${encodeURIComponent(bit.estacionTitulo)}`, {
                                state: { titulo: bit.estacionTitulo, autor: bit.estacionAutor, portada: bit.portada }
                              })}
                              className="flex-shrink-0 border-2 border-[#1A1A1A] px-3 py-1 font-black uppercase text-[8px] hover:bg-[#FF5F00] transition-all bg-white shadow-[2px_2px_0px_0px_#1A1A1A] active:shadow-none"
                            >
                              Ver Ficha →
                            </button>
                          </div>
                          <p className="font-mono text-[9px] text-gray-400 uppercase mb-4">{bit.estacionAutor}</p>
                          <div className="bg-[#F5F5F5] border-l-4 border-[#FF5F00] p-4 text-xs italic font-bold">
                            "{bit.texto || 'Sin comentarios en esta estación.'}"
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {reg.reporteFinal && (
                    <div className="bg-[#FFFAF5] p-6 border-t-4 border-[#FF5F00]">
                      <p className="text-[#FF5F00] font-black text-[8px] uppercase mb-2">Comentario Final:</p>
                      <div className="bg-black text-white p-5 font-bold text-sm italic">
                        "{reg.reporteFinal}"
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const MuroGlobal = ({ rutas, reportes }) => {
  const todas = [
    ...(reportes || []).map(r => ({ ...r, id: r.id, nombre: r.ruta, local: true })),
    ...(rutas || []).filter(r => !reportes.some(rep => String(rep.id) === String(r.id)))
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-8">
      <div className="max-w-5xl mx-auto text-left">
        <header className="border-b-8 border-black pb-6 mb-12">
          <h1 className="text-7xl font-black uppercase italic tracking-tighter">REGISTROS</h1>
        </header>
        <div className="grid grid-cols-1 gap-8">
          {todas.map(r => (
            <div key={r.id} className="border-4 border-black p-8 bg-white shadow-[12px_12px_0px_0px_#1A1A1A]">
              <h3 className="text-3xl font-black uppercase italic mb-6">{r.nombre || r.ruta}</h3>
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {(r.estaciones || []).map((e, i) => (
                  <div key={i} className="w-10 h-14 bg-black flex-shrink-0 border border-black/10">
                    <img src={e.portada || e.imagen} className="w-full h-full object-cover grayscale opacity-50" alt="" onError={(e) => e.target.style.display = 'none'} />
                  </div>
                ))}
              </div>
              <Link to={`/muro/${r.id}`} className="border-2 border-black px-4 py-2 font-black text-[10px] uppercase hover:bg-[#FF5F00] transition-all">
                ABRIR BITÁCORA →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MuroEstaciones = () => {
  const { rutaId } = useParams();
  const { reportes, rutas } = useEstacion();
  return rutaId ? <BitacoraRuta key={rutaId} rutaId={rutaId} /> : <MuroGlobal rutas={rutas} reportes={reportes} />;
};

export default MuroEstaciones;