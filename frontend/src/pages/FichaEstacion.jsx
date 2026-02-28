import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const MAQUINISTA = sessionStorage.getItem('maquinista') || 'ANONIMO';

// --- COMPONENTE DE ESTRELLAS ---
const Estrellas = ({ valor, onChange = null, size = 'normal' }) => {
  const [hover, setHover] = useState(0);
  const sizeClass = size === 'large' ? 'text-3xl' : 'text-xl';

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          className={`${sizeClass} transition-all ${onChange ? 'cursor-pointer' : ''}`}
          style={{ color: i <= (hover || valor) ? '#FF5F00' : '#D1D5DB' }}
          onMouseEnter={() => onChange && setHover(i)}
          onMouseLeave={() => onChange && setHover(0)}
          onClick={() => onChange && onChange(i)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

// --- COMPONENTE TARJETA DE RESEÑA ---
const TarjetaResena = ({ resena, esPropia, onEliminar }) => (
  <div className={`border-4 border-[#1A1A1A] bg-white shadow-[8px_8px_0px_0px_#1A1A1A] p-6
    ${esPropia ? 'ring-2 ring-[#FF5F00]/40' : ''}`}>
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#1A1A1A] flex items-center justify-center">
          <span className="text-[#FF5F00] font-black text-[10px]">
            {resena.maquinista.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="font-black uppercase text-xs tracking-widest">{resena.maquinista}</p>
          {esPropia && (
            <span className="text-[#FF5F00] font-mono text-[8px] uppercase tracking-widest">Tu reseña</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Estrellas valor={resena.estrellas} />
        {esPropia && (
          <button
            onClick={() => onEliminar(resena.libroTitulo)}
            className="text-[9px] font-mono uppercase border border-black/20 px-2 py-1 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
          >
            [X]
          </button>
        )}
      </div>
    </div>
    <div className="border-l-4 border-[#FF5F00] pl-4 bg-[#FFFAF5] p-3">
      <p className="font-bold text-sm italic leading-relaxed">"{resena.texto}"</p>
    </div>
    <p className="font-mono text-[8px] uppercase text-gray-400 mt-3">
      {new Date(resena.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
    </p>
  </div>
);

// --- PÁGINA PRINCIPAL ---
const FichaEstacion = () => {
  const { libroTitulo } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Datos del libro pueden venir por state o se reconstruyen desde la URL
  const libroDesdeState = location.state || {};

  const [libro, setLibro] = useState({
    titulo: libroDesdeState.titulo || decodeURIComponent(libroTitulo),
    autor: libroDesdeState.autor || '',
    portada: libroDesdeState.portada || null,
    paginas: libroDesdeState.paginas || null,
    año: libroDesdeState.año || null,
  });

  const [resenas, setResenas] = useState([]);
  const [promedio, setPromedio] = useState(null);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);

  // Formulario nueva reseña
  const [estrellas, setEstrellas] = useState(0);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [errorForm, setErrorForm] = useState('');

  // Reseña propia ya existente
  const resenaPropia = resenas.find(r => r.maquinista === MAQUINISTA);

  const cargarResenas = async () => {
    try {
      setCargando(true);
      const res = await fetch(`http://localhost:5000/api/resenas/libro/${encodeURIComponent(libro.titulo)}`);
      const data = await res.json();
      setResenas(data.resenas || []);
      setPromedio(data.promedio);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Error al cargar reseñas:', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarResenas(); }, [libro.titulo]);

  // Pre-cargar formulario si ya tiene reseña propia
  useEffect(() => {
    if (resenaPropia) {
      setEstrellas(resenaPropia.estrellas);
      setTexto(resenaPropia.texto);
    }
  }, [resenas]);

  const handleEnviar = async () => {
    if (!estrellas) return setErrorForm('Seleccioná una puntuación.');
    if (texto.trim().length < 10) return setErrorForm('La reseña debe tener al menos 10 caracteres.');

    setEnviando(true);
    setErrorForm('');
    try {
      const payload = {
        libroTitulo: libro.titulo,
        libroAutor: libro.autor || 'Desconocido',
        libroPortada: libro.portada,
        libroPaginas: libro.paginas,
        libroAño: libro.año,
        maquinista: MAQUINISTA,
        estrellas,
        texto: texto.trim()
      };
      console.log('[FichaEstacion] Enviando reseña:', payload);
      const res = await fetch('http://localhost:5000/api/resenas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      console.log('[FichaEstacion] Respuesta backend:', res.status, data);
      if (!res.ok) throw new Error(data.message || 'Error al guardar');
      await cargarResenas();
    } catch (err) {
      console.error('[FichaEstacion] Error:', err);
      setErrorForm('No se pudo guardar la reseña. Intentá de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  const handleEliminar = async (titulo) => {
    if (!window.confirm('¿Eliminar tu reseña?')) return;
    try {
      await fetch(`http://localhost:5000/api/resenas/${encodeURIComponent(titulo)}/${MAQUINISTA}`, {
        method: 'DELETE'
      });
      setEstrellas(0);
      setTexto('');
      await cargarResenas();
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  const resenasOtros = resenas.filter(r => r.maquinista !== MAQUINISTA);

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans selection:bg-[#FF5F00] selection:text-white">

      {/* FONDO CUADRÍCULA */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-8">

        {/* NAVEGACIÓN */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-block border-2 border-[#1A1A1A] px-6 py-2 font-black uppercase text-[10px] hover:bg-[#1A1A1A] hover:text-white transition-all shadow-[4px_4px_0px_0px_#FF5F00] active:shadow-none bg-white"
          >
            ← Volver
          </button>
        </div>

        {/* CABECERA DEL LIBRO */}
        <div className="border-4 border-[#1A1A1A] bg-white shadow-[12px_12px_0px_0px_#1A1A1A] mb-10 overflow-hidden">
          <div className="bg-[#1A1A1A] px-8 py-3 border-b-4 border-[#FF5F00]">
            <span className="text-[#FF5F00] font-mono text-[10px] uppercase tracking-widest">
              Ficha_Estación // REF_{libro.titulo.slice(0, 6).toUpperCase().replace(/ /g, '_')}
            </span>
          </div>
          <div className="p-8 flex gap-8 items-start">
            {/* PORTADA */}
            <div className="w-32 h-44 bg-[#1A1A1A] flex-shrink-0 border-4 border-[#1A1A1A] shadow-[8px_8px_0px_0px_#FF5F00] overflow-hidden">
              {libro.portada ? (
                <img src={libro.portada} alt={libro.titulo} className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-[#FF5F00] font-black text-[8px] uppercase">Sin_Portada</span>
                </div>
              )}
            </div>

            {/* INFO */}
            <div className="flex-grow">
              <h1 className="text-4xl md:text-5xl font-black uppercase italic leading-[0.9] tracking-tighter mb-3">
                {libro.titulo}
              </h1>
              <p className="font-mono text-sm uppercase font-black text-[#FF5F00] mb-4">{libro.autor}</p>
              <div className="flex gap-3 flex-wrap mb-6">
                {libro.paginas && (
                  <span className="bg-[#1A1A1A] text-white font-mono text-[9px] px-3 py-1 uppercase font-black">
                    {libro.paginas} KM
                  </span>
                )}
                {libro.año && (
                  <span className="border-2 border-[#1A1A1A] font-mono text-[9px] px-3 py-1 uppercase font-black">
                    AÑO {libro.año}
                  </span>
                )}
              </div>

              {/* PROMEDIO */}
              {total > 0 ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-[#FF5F00]">{promedio}</span>
                    <span className="font-mono text-[9px] uppercase text-gray-400">/ 5.0</span>
                  </div>
                  <div>
                    <Estrellas valor={Math.round(promedio)} size="large" />
                    <p className="font-mono text-[9px] uppercase text-gray-400 mt-1">
                      {total} {total === 1 ? 'reseña' : 'reseñas'}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="font-mono text-[10px] uppercase text-gray-400 italic">
                  Sin reseñas todavía. ¡Sé el primero!
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* FORMULARIO DE RESEÑA */}
          <div className="border-4 border-[#1A1A1A] bg-white shadow-[8px_8px_0px_0px_#1A1A1A] p-6">
            <div className="border-b-2 border-[#1A1A1A] pb-3 mb-6">
              <h2 className="font-black uppercase text-sm tracking-widest">
                {resenaPropia ? 'Tu Reseña' : 'Escribir Reseña'}
              </h2>
              <p className="font-mono text-[8px] uppercase text-gray-400 mt-1">
                {resenaPropia ? 'Podés actualizar tu reseña' : 'Compartí tu opinión con la red'}
              </p>
            </div>

            {/* ESTRELLAS */}
            <div className="mb-4">
              <p className="font-mono text-[9px] uppercase font-black mb-2 text-gray-500">Puntuación</p>
              <Estrellas valor={estrellas} onChange={setEstrellas} size="large" />
            </div>

            {/* TEXTO */}
            <div className="mb-4">
              <p className="font-mono text-[9px] uppercase font-black mb-2 text-gray-500">Tu Opinión</p>
              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Contá qué te pareció este libro..."
                className="w-full bg-[#F9F9F9] border-4 border-[#1A1A1A] p-4 font-bold text-xs uppercase outline-none focus:bg-white focus:border-[#FF5F00] h-32 resize-none"
              />
            </div>

            {errorForm && (
              <p className="font-mono text-[9px] uppercase text-red-500 mb-3">{errorForm}</p>
            )}

            <button
              onClick={handleEnviar}
              disabled={enviando || !estrellas || texto.trim().length < 10}
              className={`w-full py-4 font-black uppercase text-xs border-4 border-[#1A1A1A] transition-all
                ${(!estrellas || texto.trim().length < 10)
                  ? 'bg-gray-200 opacity-50 cursor-not-allowed'
                  : 'bg-[#FF5F00] shadow-[6px_6px_0px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none cursor-pointer'}`}
            >
              {enviando ? 'Enviando...' : resenaPropia ? 'Actualizar Reseña →' : 'Publicar Reseña →'}
            </button>
          </div>

          {/* RESEÑAS DE OTROS + PROPIA */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="font-black uppercase text-sm tracking-widest">Reseñas de la Red</h2>
              <div className="flex-grow h-[2px] bg-[#1A1A1A] opacity-10"></div>
              <span className="font-mono text-[9px] uppercase font-black text-[#FF5F00]">{total}</span>
            </div>

            {cargando ? (
              <p className="font-black uppercase text-xs animate-pulse opacity-40 text-center py-10">
                Sincronizando_Reseñas...
              </p>
            ) : resenas.length === 0 ? (
              <div className="border-4 border-dashed border-[#1A1A1A]/10 py-12 text-center">
                <p className="font-black uppercase opacity-20 text-xs">Sin reseñas todavía</p>
              </div>
            ) : (
              <>
                {/* Reseña propia primero si existe */}
                {resenaPropia && (
                  <TarjetaResena
                    resena={resenaPropia}
                    esPropia={true}
                    onEliminar={handleEliminar}
                  />
                )}
                {/* Reseñas de otros */}
                {resenasOtros.map((r, i) => (
                  <TarjetaResena key={i} resena={r} esPropia={false} onEliminar={handleEliminar} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FichaEstacion;