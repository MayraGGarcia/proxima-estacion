import React, { useEffect, useRef } from 'react';
import { sonarBocina, iniciarAudio } from '../hooks/useSonidos';

const Rueda = ({ delay = 0 }) => (
  <div
    className="w-7 h-7 rounded-full border-[3px] border-gray-400 flex items-center justify-center"
    style={{ background: '#1A1A1A', animation: `spin 1.2s linear ${delay}s infinite` }}>
    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
  </div>
);

const Humo = () => (
  <div className="absolute pointer-events-none" style={{ left: 12, top: -8 }}>
    {[0, 1, 2].map(i => (
      <div key={i} className="absolute rounded-full bg-gray-400/50"
        style={{
          width: 10 + i * 6, height: 10 + i * 6,
          left: -5 - i * 3,
          animation: `humo-tren 2s ease-out ${i * 0.4}s infinite`,
        }} />
    ))}
  </div>
);

const Locomotora = () => (
  <div className="flex items-center flex-shrink-0">
    <div className="w-8 h-3 bg-[#1A1A1A] -mr-2 z-0" />
    <div className="flex flex-col items-center z-10">
      <div className="relative flex items-center bg-[#1A1A1A] border-[4px] border-[#1A1A1A] h-24 min-w-[140px] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] mx-2">
        <div className="absolute -top-6 left-8 w-5 h-6 bg-[#333] border-2 border-gray-600" />
        <Humo />
        <div className="flex-grow flex items-center justify-center">
          <span className="text-[#FF5F00] font-black text-3xl" style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>🚂</span>
        </div>
      </div>
      <div className="w-full h-2 bg-[#1A1A1A] mx-2" style={{ marginTop: -2 }} />
      <div className="flex justify-around w-full px-8 -mt-2">
        <Rueda delay={0} /><Rueda delay={0.3} />
      </div>
    </div>
    <div className="w-8 h-3 bg-[#1A1A1A] -ml-2 z-0" />
  </div>
);

const Vagon = ({ linea, index }) => (
  <div className="flex items-center flex-shrink-0">
    <div className="w-8 h-3 bg-[#1A1A1A] -mr-2 z-0" />
    <div className="flex flex-col items-center z-10">
      <div className="relative flex items-center bg-[#FF5F00] border-[4px] border-[#1A1A1A] h-24 min-w-[280px] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] mx-2">
        <div className="flex gap-2 ml-4">
          <div className="w-8 h-10 bg-white border-[3px] border-[#1A1A1A]" />
          <div className="w-8 h-10 bg-white border-[3px] border-[#1A1A1A]" />
        </div>
        <div className="flex-grow px-4 text-center">
          <span className="block text-[7px] font-mono font-black text-[#1A1A1A] uppercase opacity-60 tracking-tighter">UNIDAD_RED</span>
          <span className="block text-base font-black uppercase tracking-tighter text-white truncate max-w-[160px]">
            {linea.nombre || "Línea_Activa"}
          </span>
        </div>
        <div className="w-8 h-10 bg-[#1A1A1A] text-[#FF5F00] mr-4 flex items-center justify-center font-black text-xs">
          {String(index).padStart(2, '0')}
        </div>
      </div>
      <div className="w-full h-2 bg-[#1A1A1A] mx-2" style={{ marginTop: -2 }} />
      <div className="flex justify-around w-full px-8 -mt-2">
        <Rueda delay={0} /><Rueda delay={0.3} />
      </div>
    </div>
    <div className="w-8 h-3 bg-[#1A1A1A] -ml-2 z-0" />
  </div>
);

const Formacion = ({ datos }) => (
  <div className="flex items-end flex-shrink-0">
    <Locomotora />
    {datos.map((linea, i) => (
      <Vagon key={i} linea={linea} index={i + 1} />
    ))}
  </div>
);

const Tren = ({ lineasAleatorias }) => {
  const datosRespaldo = [
    { id: 1, nombre: "Línea_Distopía" },
    { id: 2, nombre: "Línea_Realismo" },
    { id: 3, nombre: "Línea_Sci-Fi" },
    { id: 4, nombre: "Línea_Clásicos" }
  ];

  const datos = (lineasAleatorias?.length > 0) ? lineasAleatorias : datosRespaldo;
  const bocinaRef = useRef(false);

  useEffect(() => {
    const duracion = 22000;
    const intervalo = setInterval(() => {
      const ahora = Date.now() % duracion;
      const mitad = duracion * 0.5;
      const ventana = 500;
      if (ahora > mitad - ventana && ahora < mitad + ventana) {
        if (!bocinaRef.current) { bocinaRef.current = true; sonarBocina(); }
      } else {
        bocinaRef.current = false;
      }
    }, 200);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="relative w-full overflow-hidden py-8 bg-[#F0EDE4] border-y-4 border-[#1A1A1A]" onClick={iniciarAudio}>
      <style>{`
        @keyframes tren-loop {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes humo-tren {
          0%   { transform: translateY(0) scale(1);    opacity: 0.6; }
          100% { transform: translateY(-28px) scale(2.5); opacity: 0; }
        }
        .tren-wrapper {
          display: flex;
          width: max-content;
          animation: tren-loop 22s linear infinite;
        }
        .tren-wrapper:hover { animation-play-state: paused; }
      `}</style>

      <div className="absolute bottom-10 left-0 right-0 h-2 bg-[#1A1A1A] opacity-15" />

      <div className="tren-wrapper">
        <Formacion datos={datos} />
        <Formacion datos={datos} />
      </div>
    </div>
  );
};

export default Tren;