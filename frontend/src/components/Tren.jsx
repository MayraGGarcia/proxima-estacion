import React from 'react';

const Tren = ({ lineasAleatorias }) => {
  if (!lineasAleatorias || lineasAleatorias.length === 0) return null;

  const trenInfinito = [...lineasAleatorias, ...lineasAleatorias, ...lineasAleatorias];

  return (
    <div className="relative w-full overflow-hidden py-12 bg-white/50 border-y-2 border-[#1A1A1A]">
      
      {/* VÍAS DEL TREN */}
      <div className="absolute bottom-10 left-0 w-full h-[6px] bg-[#1A1A1A] opacity-10"></div>
      
      {/* TREN */}
      <div className="flex animate-marquee-right hover:[animation-play-state:paused] whitespace-nowrap">
        {trenInfinito.map((linea, index) => (
          <div key={`${linea.id || index}-${index}`} className="inline-flex items-center">
            
            {/* EL VAGÓN NARANJA CLÁSICO */}
            <div className="flex flex-col items-center">
              <div className="relative flex items-center bg-[#FF5F00] border-[4px] border-[#1A1A1A] h-24 min-w-[280px] shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] mx-4">
                
                {/* VENTANAS IZQUIERDA */}
                <div className="flex gap-2 ml-4">
                  <div className="w-8 h-10 bg-white border-[3px] border-[#1A1A1A] flex items-center justify-center">
                    <div className="w-[2px] h-full bg-[#1A1A1A] opacity-20"></div>
                  </div>
                  <div className="w-8 h-10 bg-white border-[3px] border-[#1A1A1A] flex items-center justify-center">
                    <div className="w-[2px] h-full bg-[#1A1A1A] opacity-20"></div>
                  </div>
                </div>

                {/* TEXTO SEGURO */}
                <div className="flex-grow px-6 text-center">
                  <span className="block text-[8px] font-mono font-black text-[#1A1A1A] uppercase mb-1 opacity-60">
                    PRÓXIMA ESTACIÓN
                  </span>
                  <span className="block text-lg font-black uppercase tracking-tighter text-white drop-shadow-[2px_2px_0px_rgba(26,26,26,1)]">
                    {typeof linea.nombre === 'string' ? linea.nombre : "Línea_Activa"}
                  </span>
                </div>

                {/* VENTANAS DERECHA */}
                <div className="flex gap-2 mr-4">
                  <div className="w-8 h-10 bg-white border-[3px] border-[#1A1A1A] flex items-center justify-center text-[#1A1A1A]">
                    X
                  </div>
                </div>
              </div>

              {/* RUEDAS */}
              <div className="flex justify-around w-full px-12 -mt-1">
                <div className="w-6 h-6 bg-[#1A1A1A] rounded-full border-4 border-gray-400"></div>
                <div className="w-6 h-6 bg-[#1A1A1A] rounded-full border-4 border-gray-400"></div>
              </div>
            </div>

            {/* ENGANCHE */}
            <div className="w-8 h-3 bg-[#1A1A1A] -ml-2 -mr-2 z-0 shadow-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tren;