import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MAQUINISTA = 'ADMIN_01';

const Estrellas = ({ valor, onChange = null, size = 'normal' }) => {
  const [hover, setHover] = useState(0);
  const sizeClass = size === 'large' ? 'text-3xl' : 'text-xl';
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i}
          className={`${sizeClass} transition-all ${onChange ? 'cursor-pointer' : ''}`}
          style={{ color: i <= (hover || valor) ? '#FF5F00' : '#D1D5DB' }}
          onMouseEnter={() => onChange && setHover(i)}
          onMouseLeave={() => onChange && setHover(0)}
          onClick={() => onChange && onChange(i)}>★</span>
      ))}
    </div>
  );
};

const MisResenas = () => {
  const navigate = useNavigate();

  const [resenas, setResenas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Buscador
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);

  // Formulario
  const [estrellas, setEstrellas] = useState(0);
  const [texto, setTexto] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [errorForm, setErrorForm] = useState('');
  const [exito, setExito] = useState(false);

  const cargarResenas = async () => {
    try {
      setCargando(true);
      const data = await fetch(`http://localhost:5000/api/resenas/maquinista/${MAQUINISTA}`).then(r => r.json());
      setResenas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarResenas(); }, []);

  const buscarLibros = async () => {
    if (!busqueda.trim()) return;
    setBuscando(true);
    setResultados([]);
    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(busqueda)}&limit=5&fields=title,author_name,number_of_pages_median,first_publish_year,cover_i`);
      const data = await res.json();
      setResultados((data.docs || []).map(d => ({
        titulo: d.title,
        autor: (d.author_name || ['Desconocido'])[0],
        paginas: d.number_of_pages_median || null,
        año: d.first_publish_year || null,
        portada: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg` : null
      })));
    } catch (err) { console.error(err); }
    finally { setBuscando(false); }
  };

  const seleccionarLibro = (libro) => {
    setLibroSeleccionado(libro);
    setResultados([]);
    // Si ya tiene reseña, pre-cargar
    const existente = resenas.find(r => r.libroTitulo === libro.titulo);
    if (existente) {
      setEstrellas(existente.estrellas);
      setTexto(existente.texto);
    } else {
      setEstrellas(0);
      setTexto('');
    }
    setErrorForm('');
  };

  const handleGuardar = async () => {
    if (!estrellas) return setErrorForm('Seleccioná una puntuación.');
    if (texto.trim().length < 10) return setErrorForm('La reseña debe tener al menos 10 caracteres.');

    setGuardando(true);
    setErrorForm('');
    try {
      const res = await fetch('http://localhost:5000/api/resenas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          libroTitulo: libroSeleccionado.titulo,
          libroAutor: libroSeleccionado.autor || 'Desconocido',
          libroPortada: libroSeleccionado.portada,
          libroPaginas: libroSeleccionado.paginas,
          libroAño: libroSeleccionado.año,
          maquinista: MAQUINISTA,
          estrellas,
          texto: texto.trim()
        })
      });
      if (!res.ok) throw new Error('Error al guardar');
      await cargarResenas();
      setLibroSeleccionado(null);
      setBusqueda('');
      setEstrellas(0);
      setTexto('');
      setExito(true);
      setTimeout(() => setExito(false), 3000);
    } catch (err) {
      setErrorForm('No se pudo guardar. Intentá de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (libroTitulo) => {
    if (!window.confirm('¿Eliminar esta reseña?')) return;
    await fetch(`http://localhost:5000/api/resenas/${encodeURIComponent(libroTitulo)}/${MAQUINISTA}`, { method: 'DELETE' });
    setResenas(prev => prev.filter(r => r.libroTitulo !== libroTitulo));
  };

  const yaResenado = libroSeleccionado && resenas.find(r => r.libroTitulo === libroSeleccionado.titulo);

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans selection:bg-[#FF5F00] selection:text-white">

      {/* FONDO CUADRÍCULA */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* TOAST ÉXITO */}
      {exito && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#1A1A1A] border-4 border-[#FF5F00] px-6 py-4 shadow-[8px_8px_0px_0px_#FF5F00]">
          <p className="font-black uppercase text-[#FF5F00] text-xs">✓ Reseña publicada</p>
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto p-8">

        {/* NAV */}
        <div className="mb-10 flex items-center justify-between">
          <Link to="/perfil"
            className="inline-block border-2 border-[#1A1A1A] px-6 py-2 font-black uppercase text-[10px] hover:bg-[#1A1A1A] hover:text-white transition-all shadow-[4px_4px_0px_0px_#FF5F00] active:shadow-none bg-white">
            ← Volver al Perfil
          </Link>
          <span className="font-mono text-[9px] uppercase text-gray-400 tracking-widest">
            Mis_Reseñas // {MAQUINISTA}
          </span>
        </div>

        {/* CABECERA */}
        <header className="mb-12 border-b-4 border-[#1A1A1A] pb-8">
          <span className="bg-[#FF5F00] text-black px-2 py-1 text-[9px] font-mono uppercase tracking-[0.2em] mb-3 inline-block">
            Bitácora_Personal
          </span>
          <div className="flex items-end justify-between">
            <h1 className="text-6xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85]">
              Libros <br /><span className="text-[#FF5F00]">Leídos</span>.
            </h1>
            <span className="font-black text-8xl text-[#1A1A1A]/5 leading-none">
              {String(resenas.length).padStart(3, '0')}
            </span>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* COLUMNA IZQUIERDA — Buscador + Formulario */}
          <aside className="lg:w-2/5">
            <div className="border-4 border-[#1A1A1A] bg-white shadow-[12px_12px_0px_0px_#1A1A1A] sticky top-8">
              <div className="bg-[#1A1A1A] px-6 py-3 border-b-4 border-[#FF5F00]">
                <span className="text-[#FF5F00] font-mono text-[10px] uppercase tracking-widest">
                  Terminal_Búsqueda
                </span>
              </div>
              <div className="p-6">
                {/* BUSCADOR */}
                <p className="font-mono text-[9px] uppercase font-black text-gray-500 mb-3">
                  Buscar libro
                </p>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Título o autor..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && buscarLibros()}
                    className="flex-grow bg-[#F5F5F5] border-4 border-[#1A1A1A] p-3 font-mono text-xs uppercase outline-none focus:border-[#FF5F00] focus:bg-white transition-all"
                  />
                  <button onClick={buscarLibros} disabled={buscando}
                    className="border-4 border-[#1A1A1A] px-4 font-black uppercase text-[10px] bg-[#1A1A1A] text-white hover:bg-[#FF5F00] hover:text-black transition-all">
                    {buscando ? '...' : '→'}
                  </button>
                </div>

                {/* RESULTADOS */}
                {resultados.length > 0 && (
                  <div className="space-y-2 mb-4 border-t-2 border-dashed border-[#1A1A1A]/10 pt-4">
                    {resultados.map((l, i) => (
                      <button key={i} onClick={() => seleccionarLibro(l)}
                        className="w-full text-left flex items-center gap-3 p-3 border-2 border-[#1A1A1A]/20 hover:border-[#FF5F00] hover:bg-[#FFFAF5] transition-all">
                        <div className="w-8 h-12 bg-[#1A1A1A] flex-shrink-0 overflow-hidden">
                          {l.portada && <img src={l.portada} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-black uppercase text-[10px] leading-tight truncate">{l.titulo}</p>
                          <p className="font-mono text-[8px] text-gray-400 uppercase">{l.autor}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* LIBRO SELECCIONADO + FORMULARIO */}
                {libroSeleccionado && (
                  <div className="border-t-2 border-[#FF5F00] pt-4">
                    <div className="flex items-center gap-3 mb-4 bg-[#FFFAF5] border-2 border-[#1A1A1A]/10 p-3">
                      <div className="w-12 h-16 bg-[#1A1A1A] flex-shrink-0 overflow-hidden border-2 border-[#1A1A1A]">
                        {libroSeleccionado.portada && <img src={libroSeleccionado.portada} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="font-black uppercase text-xs leading-tight">{libroSeleccionado.titulo}</p>
                        <p className="font-mono text-[8px] text-[#FF5F00] uppercase">{libroSeleccionado.autor}</p>
                        {yaResenado && (
                          <span className="font-mono text-[8px] text-green-600 uppercase">✓ Ya reseñado — editando</span>
                        )}
                      </div>
                      <button onClick={() => { setLibroSeleccionado(null); setEstrellas(0); setTexto(''); }}
                        className="font-mono text-[9px] border border-black/20 px-2 py-1 hover:bg-black hover:text-white transition-all flex-shrink-0">
                        [X]
                      </button>
                    </div>

                    <p className="font-mono text-[9px] uppercase font-black text-gray-500 mb-2">Puntuación</p>
                    <Estrellas valor={estrellas} onChange={setEstrellas} size="large" />

                    <p className="font-mono text-[9px] uppercase font-black text-gray-500 mb-2 mt-4">Tu opinión</p>
                    <textarea
                      value={texto}
                      onChange={e => setTexto(e.target.value)}
                      placeholder="¿Qué te pareció este libro?"
                      className="w-full bg-[#F9F9F9] border-4 border-[#1A1A1A] p-3 font-bold text-xs uppercase outline-none focus:bg-white focus:border-[#FF5F00] h-28 resize-none"
                    />

                    {errorForm && (
                      <p className="font-mono text-[9px] uppercase text-red-500 mt-2">{errorForm}</p>
                    )}

                    <button onClick={handleGuardar}
                      disabled={guardando || !estrellas || texto.trim().length < 10}
                      className={`w-full py-4 font-black uppercase text-xs border-4 border-[#1A1A1A] mt-4 transition-all
                        ${(!estrellas || texto.trim().length < 10)
                          ? 'bg-gray-200 opacity-50 cursor-not-allowed'
                          : 'bg-[#FF5F00] shadow-[6px_6px_0px_0px_#1A1A1A] hover:translate-x-1 hover:translate-y-1 hover:shadow-none cursor-pointer'}`}>
                      {guardando ? 'Guardando...' : yaResenado ? 'Actualizar Reseña →' : 'Publicar Reseña →'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* COLUMNA DERECHA — Lista de reseñas */}
          <main className="lg:w-3/5">
            {cargando ? (
              <div className="py-20 text-center font-black uppercase animate-pulse opacity-40 text-xs">
                Cargando reseñas...
              </div>
            ) : resenas.length === 0 ? (
              <div className="py-20 border-4 border-dashed border-[#1A1A1A]/10 text-center uppercase font-black opacity-20">
                Todavía no reseñaste ningún libro
              </div>
            ) : (
              <div className="space-y-4">
                {resenas.map((r, i) => (
                  <div key={i} className="border-4 border-[#1A1A1A] bg-white shadow-[6px_6px_0px_0px_#1A1A1A] p-5 flex gap-5 group">
                    {/* Portada */}
                    <button
                      onClick={() => navigate(`/estacion/${encodeURIComponent(r.libroTitulo)}`, {
                        state: { titulo: r.libroTitulo, autor: r.libroAutor, portada: r.libroPortada, paginas: r.libroPaginas, año: r.libroAño }
                      })}
                      className="w-16 flex-shrink-0 bg-[#1A1A1A] border-2 border-[#1A1A1A] overflow-hidden self-start hover:-translate-y-1 transition-transform shadow-[3px_3px_0px_0px_#FF5F00]"
                      style={{ height: '88px' }}>
                      {r.libroPortada
                        ? <img src={r.libroPortada} alt={r.libroTitulo} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><span className="text-[#FF5F00] font-black text-[8px]">?</span></div>
                      }
                    </button>

                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div>
                          <p className="font-black uppercase text-sm leading-none">{r.libroTitulo}</p>
                          <p className="font-mono text-[9px] text-[#FF5F00] uppercase mt-1">{r.libroAutor}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="flex">
                            {[1,2,3,4,5].map(j => (
                              <span key={j} style={{ color: j <= r.estrellas ? '#FF5F00' : '#D1D5DB' }} className="text-sm">★</span>
                            ))}
                          </div>
                          <button
                            onClick={() => seleccionarLibro({ titulo: r.libroTitulo, autor: r.libroAutor, portada: r.libroPortada, paginas: r.libroPaginas, año: r.libroAño })}
                            className="border-2 border-[#1A1A1A] px-2 py-1 font-black uppercase text-[8px] hover:bg-[#1A1A1A] hover:text-white transition-all bg-white">
                            Editar
                          </button>
                          <button onClick={() => handleEliminar(r.libroTitulo)}
                            className="font-mono text-[9px] border border-black/20 px-2 py-1 hover:bg-red-600 hover:text-white transition-all">
                            [X]
                          </button>
                        </div>
                      </div>

                      <div className="bg-[#FFFAF5] border-l-4 border-[#FF5F00] p-3">
                        <p className="font-bold text-xs italic">"{r.texto}"</p>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <p className="font-mono text-[8px] uppercase text-gray-400">
                          {new Date(r.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </p>
                        <button
                          onClick={() => navigate(`/estacion/${encodeURIComponent(r.libroTitulo)}`, {
                            state: { titulo: r.libroTitulo, autor: r.libroAutor, portada: r.libroPortada, paginas: r.libroPaginas, año: r.libroAño }
                          })}
                          className="font-mono text-[8px] uppercase text-[#FF5F00] hover:underline font-black">
                          Ver opiniones de la red →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MisResenas;