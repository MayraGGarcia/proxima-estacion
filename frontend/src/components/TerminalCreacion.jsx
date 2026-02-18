import React, { useState } from 'react';
import { useEstacion } from '../context/EstacionContext';

const TerminalCreacion = ({ isOpen, onClose }) => {
  const { despacharRuta } = useEstacion();
  const [nombreLinea, setNombreLinea] = useState('');
  const [criterio, setCriterio] = useState('paginas'); // paginas, fecha, manual
  const [justificacion, setJustificacion] = useState('');
  const [esPublica, setEsPublica] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [estaciones, setEstaciones] = useState([]);

  // Base de datos simulada
  const librosDisponibles = [
    { id: 1, titulo: 'FRANKENSTEIN', autor: 'Mary Shelley', paginas: 280, fecha: '1818' },
    { id: 2, titulo: 'YO, ROBOT', autor: 'Isaac Asimov', paginas: 250, fecha: '1950' },
    { id: 3, titulo: 'DUNE', autor: 'Frank Herbert', paginas: 700, fecha: '1965' },
    { id: 4, titulo: 'DRÁCULA', autor: 'Bram Stoker', paginas: 418, fecha: '1897' },
    { id: 5, titulo: '1984', autor: 'George Orwell', paginas: 328, fecha: '1949' },
  ];

  const obtenerListaOrdenada = () => {
    let lista = [...estaciones];
    if (criterio === 'paginas') return lista.sort((a, b) => a.paginas - b.paginas);
    if (criterio === 'fecha') return lista.sort((a, b) => parseInt(a.fecha) - parseInt(b.fecha));
    return estaciones; 
  };

  const agregarEstacion = (libro) => {
    if (estaciones.length >= 5 || estaciones.find(e => e.id === libro.id)) return;
    setEstaciones([...estaciones, libro]);
    setBusqueda('');
  };

  const moverEstacion = (index, direccion) => {
    if (criterio !== 'manual') return;
    const nuevaLista = [...estaciones];
    const item = nuevaLista.splice(index, 1)[0];
    nuevaLista.splice(index + direccion, 0, item);
    setEstaciones(nuevaLista);
  };

  const handleDespachar = () => {
    const listaFinal = obtenerListaOrdenada();
    despacharRuta({
      titulo: nombreLinea,
      criterio,
      justificacion,
      esPublica,
      estaciones: listaFinal.map(e => ({ ...e, completada: false }))
    });
    onClose();
  };

  if (!isOpen) return null;

  const listaFinal = obtenerListaOrdenada();
  const cumpleMinimo = estaciones.length >= 3; 
  const tieneJustificacion = criterio !== 'manual' || (justificacion.trim().length >= 5);
  const esValido = cumpleMinimo && nombreLinea.trim() !== '' && tieneJustificacion;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
      <div className="bg-[#F5F5DC] border-4 border-black w-full max-w-2xl shadow-[10px_10px_0px_0px_rgba(255,95,0,1)] flex flex-col max-h-[90vh]">
        
        {/* CABECERA */}
        <div className="bg-black text-white p-3 flex justify-between items-center font-black uppercase italic">
          <span className="tracking-widest text-sm">● TERMINAL DE DESPACHO ●</span>
          <button onClick={onClose} className="text-orange-500 hover:scale-110 transition-transform underline text-xs">[ CERRAR ]</button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-left">
          
          {/* IDENTIDAD Y PRIVACIDAD */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2 space-y-1">
              <label className="block font-black text-[10px] uppercase">NOMBRE DE LA LÍNEA:</label>
              <input type="text" value={nombreLinea} onChange={(e)=>setNombreLinea(e.target.value)} placeholder="EJ: RUTA CYBERPUNK" className="w-full bg-white border-4 border-black p-2 font-bold focus:bg-orange-50 uppercase text-xs outline-none" />
            </div>
            <div className="space-y-1">
              <label className="block font-black text-[10px] uppercase text-center">PRIVACIDAD:</label>
              <button 
                onClick={() => setEsPublica(!esPublica)}
                className={`w-full p-2 border-4 border-black font-black text-[10px] uppercase transition-colors ${esPublica ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}
              >
                {esPublica ? 'PÚBLICA' : 'PRIVADA'}
              </button>
            </div>
          </div>

          {/* BUSCADOR */}
          <div className="space-y-1">
            <label className="block font-black text-[10px] uppercase">AÑADIR ESTACIONES (MÍNIMO 3):</label>
            <input type="text" value={busqueda} onChange={(e)=>setBusqueda(e.target.value.toUpperCase())} placeholder="BUSCAR TÍTULO EN LA RED..." className="w-full bg-white border-4 border-black p-2 font-bold text-xs outline-none" />
            {busqueda && (
              <div className="bg-white border-4 border-black mt-[-4px] z-10 relative">
                {librosDisponibles.filter(l => l.titulo.includes(busqueda)).map(l => (
                  <div key={l.id} onClick={() => agregarEstacion(l)} className="p-2 hover:bg-black hover:text-white cursor-pointer font-bold text-[10px] border-b-2 border-black last:border-0">
                    + {l.titulo} ({l.autor})
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CRITERIO DE ORDENAMIENTO */}
          <div className="bg-orange-100 border-4 border-black p-4 space-y-3">
            <p className="font-black text-[10px] uppercase underline">Criterio de Ordenamiento:</p>
            <div className="flex flex-wrap gap-4">
              {['paginas', 'fecha', 'manual'].map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="criterio" value={opt} checked={criterio === opt} onChange={(e) => { setCriterio(e.target.value); setJustificacion(''); }} className="accent-black" />
                  <span className="font-black text-[10px] uppercase">{opt === 'paginas' ? 'Por KM' : opt === 'fecha' ? 'Cronológico' : 'Manual'}</span>
                </label>
              ))}
            </div>
            
            {criterio === 'manual' && (
              <div className="mt-2 animate-in fade-in duration-300">
                <label className="block font-black text-[9px] uppercase text-orange-700 mb-1">Motivo del orden personalizado (Curaduría):</label>
                <textarea value={justificacion} onChange={(e)=>setJustificacion(e.target.value)} placeholder="¿Por qué este orden es mejor para el pasajero?..." className="w-full bg-white border-2 border-black p-2 font-bold text-[10px] h-12 outline-none resize-none" />
              </div>
            )}
          </div>

          {/* FORMACIÓN DEL CONVOY */}
          <div className="space-y-2">
            <p className="font-black text-[10px] uppercase">Vagones en formación: <span className={cumpleMinimo ? "text-green-600" : "text-red-600"}>{estaciones.length}/5</span></p>
            {listaFinal.map((est, index) => {
              const colorEstado = index === 0 ? '#eab308' : '#9ca3af';
              
              return (
                <div key={est.id} className="flex items-center bg-black text-white p-2 border-l-[10px]" style={{borderColor: colorEstado}}>
                  <span className="font-black mr-3 italic text-xs" style={{color: colorEstado}}>#{index + 1}</span>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-tighter leading-tight">{est.titulo}</p>
                    <p className="text-[8px] text-orange-500 font-black uppercase">
                      {criterio === 'paginas' && `${est.paginas} KILÓMETROS`}
                      {criterio === 'fecha' && `AÑO: ${est.fecha}`}
                      {criterio === 'manual' && `ORDEN PERSONALIZADO`}
                    </p>
                  </div>
                  
                  {criterio === 'manual' && (
                    <div className="flex gap-1 mr-2">
                      <button disabled={index === 0} onClick={() => moverEstacion(index, -1)} className="bg-white text-black px-1 text-[8px] font-bold disabled:opacity-20 hover:bg-orange-500 transition-colors">↑</button>
                      <button disabled={index === estaciones.length - 1} onClick={() => moverEstacion(index, 1)} className="bg-white text-black px-1 text-[8px] font-bold disabled:opacity-20 hover:bg-orange-500 transition-colors">↓</button>
                    </div>
                  )}
                  
                  <button onClick={() => setEstaciones(estaciones.filter(e => e.id !== est.id))} className="text-red-500 font-black text-[9px] hover:text-white transition-colors ml-2">[X]</button>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTÓN DE DESPACHO */}
        <div className="p-4 bg-black/5 border-t-4 border-black">
          <button 
            disabled={!esValido}
            onClick={handleDespachar}
            className={`w-full font-black p-4 uppercase border-4 border-black transition-all text-xs
              ${esValido 
                ? "bg-black text-white hover:bg-orange-500 hover:text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"}`}
          >
            {esValido ? "DESPACHAR RUTA A LA RED" : "FALTAN REQUISITOS TÉCNICOS"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TerminalCreacion;