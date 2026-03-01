import React, { useState, useEffect } from 'react';
import API_URL from '../config';

const TerminalCreacion = ({ isOpen, onClose, onSave }) => {
  const [nombreRuta, setNombreRuta] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [convoy, setConvoy] = useState([]);
  const [criterio, setCriterio] = useState('Manual');
  const [esPublica, setEsPublica] = useState(true);
  const [justificacion, setJustificacion] = useState('');
  const [cargando, setCargando] = useState(false);

  // 1. MOTOR DE BÚSQUEDA OPEN LIBRARY
  const buscarLibros = async (e) => {
    if (e) e.preventDefault();
    if (!busqueda.trim()) return;
    setCargando(true);
    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(busqueda.trim())}&limit=6`);
      const data = await response.json();
      if (data.docs) {
        setResultados(data.docs.map((doc, idx) => ({
          id: doc.key || idx,
          titulo: doc.title || "Sin Título",
          autor: doc.author_name ? doc.author_name[0] : "Anon",
          paginas: doc.number_of_pages_median || (Math.floor(Math.random() * 300) + 100),
          año: doc.first_publish_year || 2024,
          portada: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : null
        })));
      }
    } catch (err) {
      console.error("Error técnico:", err);
    } finally {
      setCargando(false);
    }
  };

  // 2. GESTIÓN DE POSICIÓN MANUAL
  const moverVagon = (index, direccion) => {
    if (criterio !== 'Manual') return;
    const nuevoConvoy = [...convoy];
    const [reubicado] = nuevoConvoy.splice(index, 1);
    nuevoConvoy.splice(index + direccion, 0, reubicado);
    setConvoy(nuevoConvoy);
  };

  // 3. AUTO-ORDENAMIENTO
  useEffect(() => {
    if (convoy.length < 2 || criterio === 'Manual') return;
    let ordenado = [...convoy];
    if (criterio === 'Kilometraje') ordenado.sort((a, b) => a.paginas - b.paginas);
    if (criterio === 'Cronología') ordenado.sort((a, b) => a.año - b.año);
    setConvoy(ordenado);
  }, [criterio]);

  // 4. LÓGICA DE DESPACHO AL BACKEND
  const handleDespacharAlServidor = async () => {
  const payload = {
    nombre: nombreRuta,
    estaciones: convoy,
    configuracion: {
      metodo: criterio, // 'Manual', 'Kilometraje' o 'Cronología'
      esPublica: esPublica,
      justificacion: criterio === 'Manual' ? justificacion : 'Sistema Automático'
    },
    pasajeros: 1 //El que creo que la Ruta es el primer pasajero
  };

  try {
    const response = await fetch(`${API_URL}/api/despacho`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Despacho exitoso:", data);
      
      // IMPORTANTE: Pasamos los datos al contexto para que el tren empiece a moverse
      if (onSave) onSave(data); 
      
      onClose(); 
    } else {
      // Si el servidor responde pero con error (ej: 400 o 500)
      const errorData = await response.json();
      console.error("Detalle del error:", errorData);
      alert(`Error en el servidor: ${errorData.error || 'Verifique los datos'}`);
    }
  } catch (err) {
    console.error("Error de conexión:", err);
    alert("No se pudo conectar con el servidor. ¿Está encendido el Backend?");
  }
};

  // VALIDACIÓN DE DESPACHO
  const despachoHabilitado = 
    nombreRuta.trim().length >= 3 &&
    convoy.length >= 3 && 
    (criterio !== 'Manual' || justificacion.trim().length > 5);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
      <div className="bg-[#E8E4D9] border-4 border-[#1A1A1A] w-full max-w-6xl h-[95vh] md:h-[90vh] flex flex-col shadow-[10px_10px_0px_0px_#FF5F00] md:shadow-[20px_20px_0px_0px_#FF5F00] overflow-hidden">
        
        {/* CABECERA */}
        <header className="bg-[#1A1A1A] text-white p-4 flex justify-between items-center border-b-4 border-[#FF5F00]">
          <h2 className="font-black uppercase tracking-tighter text-sm italic">Terminal_de_Despacho_v3.5</h2>
          <button onClick={onClose} className="font-mono hover:text-[#FF5F00] font-black">[X]</button>
        </header>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* PANEL IZQUIERDO */}
          <section className="w-full md:w-1/2 p-4 md:p-8 border-b-2 md:border-b-0 md:border-r-2 border-[#1A1A1A]/20 overflow-y-auto bg-white/20 max-h-[45%] md:max-h-full">
            <div className="mb-6">
              <label className="block font-mono text-[10px] font-black uppercase text-gray-400 mb-1">Identificación_Ruta</label>
              <input 
                className="w-full bg-white border-2 border-[#1A1A1A] p-3 font-mono text-xs outline-none focus:ring-2 ring-[#FF5F00]"
                placeholder="NOMBRE DEL CONVOY..."
                value={nombreRuta}
                onChange={(e) => setNombreRuta(e.target.value)}
              />
            </div>

            <label className="block font-mono text-[10px] font-black uppercase text-gray-400 mb-1">Carga_de_Estaciones</label>
            <form onSubmit={buscarLibros} className="flex gap-2 mb-8">
              <input 
                className="flex-1 bg-white border-2 border-[#1A1A1A] p-3 font-mono text-xs outline-none"
                placeholder="BUSCAR LIBRO..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button type="submit" className="bg-[#1A1A1A] text-white px-6 font-black text-[10px] uppercase hover:bg-[#FF5F00] transition-colors">
                {cargando ? '...' : 'CONSULTAR'}
              </button>
            </form>

            <div className="space-y-3">
              {resultados.map(libro => (
                <div key={libro.id} className="bg-white border-2 border-[#1A1A1A] p-3 flex justify-between items-center shadow-[4px_4px_0px_0px_#1A1A1A]">
                  <div className="flex gap-3 items-center truncate text-left">
                    <div className="w-8 h-10 bg-gray-200 shrink-0 border border-black/10">
                      {libro.portada && <img src={libro.portada} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="truncate">
                      <p className="font-black text-[10px] uppercase truncate">{libro.titulo}</p>
                      <p className="font-mono text-[8px] text-gray-400 italic">{libro.autor}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => convoy.length < 5 && setConvoy([...convoy, libro])}
                    className="bg-[#1A1A1A] text-white p-2 font-black text-xs hover:bg-[#FF5F00]"
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* PANEL DERECHO */}
          <section className="w-full md:w-1/2 flex flex-col bg-black/5 flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <h3 className="font-black uppercase text-2xl italic tracking-tighter text-left">Hoja_de_Ruta</h3>
              
              {/* SELECTOR PRIVACIDAD */}
              <div className="flex items-center justify-between bg-white p-3 border-2 border-[#1A1A1A]">
                <span className="font-mono text-[10px] font-black uppercase">Visibilidad_Vía:</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEsPublica(false)}
                    className={`px-3 py-1 font-black text-[9px] border-2 ${!esPublica ? 'bg-black text-white' : 'bg-white'}`}
                  >
                    PRIVADA
                  </button>
                  <button 
                    onClick={() => setEsPublica(true)}
                    className={`px-3 py-1 font-black text-[9px] border-2 ${esPublica ? 'bg-[#FF5F00] text-black border-black' : 'bg-white'}`}
                  >
                    PÚBLICA
                  </button>
                </div>
              </div>

              {/* CRITERIOS DE ORDEN */}
              <div className="grid grid-cols-3 gap-1">
                {['Manual', 'Kilometraje', 'Cronología'].map(t => (
                  <button key={t} onClick={() => setCriterio(t)} className={`py-2 font-black text-[9px] border-2 border-[#1A1A1A] uppercase ${criterio === t ? 'bg-[#1A1A1A] text-white' : 'bg-white'}`}>
                    {t}
                  </button>
                ))}
              </div>

              {/* SELLO DE CURADURÍA */}
              {criterio === 'Manual' && (
                <div className="animate-pulse-slow">
                  <label className="block font-mono text-[9px] font-black text-[#FF5F00] mb-1">SELLO_DE_CURADURÍA_REQUERIDO</label>
                  <textarea 
                    className="w-full border-2 border-[#1A1A1A] p-3 font-mono text-[10px] h-16 outline-none bg-white"
                    placeholder="Escriba la justificación del orden..."
                    value={justificacion}
                    onChange={(e) => setJustificacion(e.target.value)}
                  />
                </div>
              )}

              {/* LISTADO DE VAGONES */}
              <div className="space-y-2 pb-10">
                <p className="font-mono text-[9px] font-black uppercase border-b-2 border-black/10 pb-1 text-left">Formación_Convoy ({convoy.length}/5)</p>
                {convoy.map((est, i) => (
                  <div key={est.id} className="bg-[#1A1A1A] text-white p-4 flex flex-col border-r-[10px] border-[#FF5F00] shadow-md">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-[11px] font-black uppercase truncate w-48 text-left leading-none">
                        <span className="text-[#FF5F00] mr-2">#{i+1}</span> {est.titulo}
                      </p>
                      <div className="flex gap-3">
                        {criterio === 'Manual' && (
                          <div className="flex gap-1 border-r border-white/20 pr-2">
                            <button onClick={() => i > 0 && moverVagon(i, -1)} className="text-[12px] hover:text-[#FF5F00]">▲</button>
                            <button onClick={() => i < convoy.length - 1 && moverVagon(i, 1)} className="text-[12px] hover:text-[#FF5F00]">▼</button>
                          </div>
                        )}
                        <button onClick={() => setConvoy(convoy.filter(c => c.id !== est.id))} className="text-[10px] font-mono hover:text-[#FF5F00]"> [X] </button>
                      </div>
                    </div>
                    {/* INFO SEGÚN CRITERIO */}
                    <div className="text-left">
                      {criterio === 'Kilometraje' && <p className="text-[#FF5F00] font-mono text-[10px] font-bold tracking-widest">{est.paginas} KILÓMETROS</p>}
                      {criterio === 'Cronología' && <p className="text-[#FF5F00] font-mono text-[10px] font-bold tracking-widest">AÑO {est.año}</p>}
                      {criterio === 'Manual' && <p className="text-gray-500 font-mono text-[9px] uppercase tracking-tighter">{est.paginas} KM / {est.año}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BOTÓN DESPACHO FIJO */}
            <div className="p-4 md:p-8 bg-[#E8E4D9] border-t-4 border-[#1A1A1A]">
              <button 
                disabled={!despachoHabilitado}
                onClick={handleDespacharAlServidor}
                className={`w-full p-5 font-black uppercase text-sm border-4 border-[#1A1A1A] shadow-[10px_10px_0px_0px_#1A1A1A] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all ${despachoHabilitado ? 'bg-[#FF5F00]' : 'bg-gray-300 opacity-50 cursor-not-allowed'}`}
              >
                DESPACHAR_LÍNEA_ACTIVA
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TerminalCreacion;