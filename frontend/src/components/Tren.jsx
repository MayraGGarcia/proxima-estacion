import React from 'react';

const Tren = ({ lineasAleatorias }) => {
  const datosRespaldo = [
    { id: 1, nombre: "Línea_Distopía" },
    { id: 2, nombre: "Línea_Realismo" },
    { id: 3, nombre: "Línea_Sci-Fi" },
    { id: 4, nombre: "Línea_Clásicos" }
  ];

  const datosAMostrar = (lineasAleatorias && lineasAleatorias.length > 0) 
    ? lineasAleatorias 
    : datosRespaldo;

  const trenInfinito = [...datosAMostrar, ...datosAMostrar];

  return (
    <div className="relative w-full overflow-hidden py-12 bg-white/50 border-y-4 border-[#1A1A1A]">
      <style>
        {`
          @keyframes train-run-right {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .train-track {
            display: flex;
            /* Cambiamos a la nueva animación hacia la derecha */
            animation: train-run-right 30s linear infinite;
            width: max-content;
          }
        `}
      </style>

      <div className="train-track hover:[animation-play-state:paused]">
        {trenInfinito.map((linea, index) => (
          <div key={`${linea.id || index}-${index}`} className="flex items-center">
            {/* ENGANCHE IZQUIERDO */}
            <div className="w-8 h-3 bg-[#1A1A1A] -mr-2 shadow-lg z-0"></div>
            
            <div className="flex flex-col items-center z-10">
              {/* VAGÓN */}
              <div className="relative flex items-center bg-[#FF5F00] border-[4px] border-[#1A1A1A] h-24 min-w-[280px] shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] mx-2">
                <div className="flex gap-2 ml-4">
                  <div className="w-8 h-10 bg-white border-[3px] border-[#1A1A1A]"></div>
                  <div className="w-8 h-10 bg-white border-[3px] border-[#1A1A1A]"></div>
                </div>
                <div className="flex-grow px-6 text-center">
                  <span className="block text-[8px] font-mono font-black text-[#1A1A1A] uppercase opacity-60 tracking-tighter">UNIDAD_RED</span>
                  <span className="block text-lg font-black uppercase tracking-tighter text-white truncate max-w-[180px]">
                    {linea.nombre || "Línea_Activa"}
                  </span>
                </div>
                <div className="w-8 h-10 bg-[#1A1A1A] text-[#FF5F00] mr-4 flex items-center justify-center font-black text-xs">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>
              
              {/* RUEDAS */}
              <div className="flex justify-around w-full px-12 -mt-1">
                <div className="w-6 h-6 bg-[#1A1A1A] rounded-full border-4 border-gray-400"></div>
                <div className="w-6 h-6 bg-[#1A1A1A] rounded-full border-4 border-gray-400"></div>
              </div>
            </div>

            {/* ENGANCHE DERECHO */}
            <div className="w-8 h-3 bg-[#1A1A1A] -ml-2 shadow-lg z-0"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tren;