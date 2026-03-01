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
  const { rutas, historial, reportes } = useEstacion();
  const [registrosBackend, setRegistrosBackend] = useState([]);
  const [nombreRuta, setNombreRuta] = useState('');

  const infoLocal = reportes.find(r => String(r.id) === String(rutaId)) || 
                    rutas.find(r => String(r._id) === String(rutaId)) ||
                    historial.find(r => String(r.id) === String(rutaId));

  useEffect(() => {
    const nombreYaResuelto = infoLocal?.nombre || infoLocal?.ruta || infoLocal?.titulo;
    if (nombreYaResuelto) return;
    fetch(`${API_URL}/api/rutas/${rutaId}`)
      .then(r => r.json())
      .then(data => { if (data?.nombre) setNombreRuta(data.nombre); })
      .catch(() => {});
  }, [rutaId, infoLocal]);

  const tituloRuta = infoLocal?.nombre || infoLocal?.ruta || infoLocal?.titulo || nombreRuta || 'Cargando...';

  useEffect(() => {
    const normalizar = (data) => (Array.isArray(data) ? data : [data]).filter(Boolean).map(reg => ({
      ...reg,
      reporteFinal: reg.reporteFinal || reg.extracto || '',
      bitacoras: (reg.bitacoras || []).map(b => ({
        estacionTitulo: b.estacionTitulo || b.titulo,
        estacionAutor: b.estacionAutor || b.autor,
        portada: b.portada || b.imagen,
        texto: b.texto || b.bitacora
      }))
    }));

    fetch(`${API_URL}/api/registros/detalle/${rutaId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && (data.bitacoras?.length > 0 || data._id)) {
          setRegistrosBackend(normalizar(data));
        } else {
          return fetch(`${API_URL}/api/registros/${rutaId}`)
            .then(res => res.json())
            .then(data2 => setRegistrosBackend(normalizar(data2)));
        }
      })
      .catch(() => {
        fetch(`${API_URL}/api/registros/${rutaId}`)
          .then(res => res.json())
          .then(data => setRegistrosBackend(normalizar(data)))
          .catch(err => console.error("Error cargando backend:", err));
      });
  }, [rutaId]);

  const registrosFinales = (() => {
    const local = reportes.find(r => String(r.id) === String(rutaId));
    let lista = [...registrosBackend];

    if (local) {
      const contenidoLocalRaw = local.extracto || local.reporteFinal;
      const contenidoLocal = typeof contenidoLocalRaw === 'object' && contenidoLocalRaw !== null
        ? (contenidoLocalRaw.extracto || contenidoLocalRaw.texto || '')
        : (contenidoLocalRaw || '');
      lista = lista.filter(r => r.reporteFinal !== contenidoLocal);
      
      lista.unshift({
        _id: local.id,
        maquinista: `${sessionStorage.getItem('maquinista') || 'ANONIMO'} (LOCAL)`,
        fechaFinalizacion: local.fecha,
        reporteFinal: contenidoLocal,
        bitacoras: (local.estaciones || []).map(e => ({
          estacionTitulo: e.titulo,
          estacionAutor: e.autor,
          portada: e.portada || e.imagen,
          texto: e.bitacora || e.texto
        }))
      });
    }
    return lista;
  })();

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

        <div className="space-y-12">
          {registrosFinales.map((reg, idx) => (
            <div key={idx} className="border-4 border-black bg-white shadow-[10px_10px_0px_0px_#1A1A1A]">
              <div className="bg-black p-4 flex justify-between items-center text-white">
                <span className="font-black uppercase italic">{reg.maquinista}</span>
                <span className="font-mono text-[10px] opacity-50">{reg.fechaFinalizacion ? new Date(reg.fechaFinalizacion).toLocaleDateString("es-AR") : ""}</span>
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

              {/* REPORTE FINAL RESTAURADO */}
              {reg.reporteFinal && (
                <div className="bg-[#FFFAF5] p-6 border-t-4 border-[#FF5F00]">
                  <p className="text-[#FF5F00] font-black text-[8px] uppercase mb-2">Comentario Final:</p>
                  <div className="bg-black text-white p-5 font-bold text-sm italic">
                    "{reg.reporteFinal}"
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MuroGlobal = ({ rutas, reportes }) => {
  const todas = [
    ...(reportes || []).map(r => ({ ...r, id: r.id, nombre: r.ruta, local: true })),
    ...(rutas || []).filter(r => !reportes.some(rep => String(rep.id) === String(r._id)))
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-8">
      <div className="max-w-5xl mx-auto text-left">
        <header className="border-b-8 border-black pb-6 mb-12">
          <h1 className="text-7xl font-black uppercase italic tracking-tighter">REGISTROS</h1>
        </header>
        <div className="grid grid-cols-1 gap-8">
          {todas.map(r => (
            <div key={r.id || r._id} className="border-4 border-black p-8 bg-white shadow-[12px_12px_0px_0px_#1A1A1A]">
              <h3 className="text-3xl font-black uppercase italic mb-6">{r.nombre || r.ruta}</h3>
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {(r.estaciones || []).map((e, i) => (
                  <div key={i} className="w-10 h-14 bg-black flex-shrink-0 border border-black/10">
                    <img src={e.portada || e.imagen} className="w-full h-full object-cover grayscale opacity-50" alt="" onError={(e)=>e.target.style.display='none'}/>
                  </div>
                ))}
              </div>
              <Link to={`/muro/${r._id || r.id}`} className="border-2 border-black px-4 py-2 font-black text-[10px] uppercase hover:bg-[#FF5F00] transition-all">
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
  return rutaId ? <BitacoraRuta rutaId={rutaId} /> : <MuroGlobal rutas={rutas} reportes={reportes} />;
};

export default MuroEstaciones;