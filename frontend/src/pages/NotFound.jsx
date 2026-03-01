import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
      <div className="min-h-screen bg-[#1A1A1A] text-white font-sans flex flex-col items-center justify-center p-8 text-center selection:bg-[#FF5F00]">

      {/* FONDO */}
      <div className="fixed inset-0 z-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 max-w-lg">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#FF5F00] block mb-4">
          Error_404 // Vía no encontrada
        </span>

        <h1 className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter text-white/10 select-none">
          404
        </h1>

        <div className="border-4 border-[#FF5F00] p-8 shadow-[10px_10px_0px_0px_#FF5F00] -mt-8 bg-[#1A1A1A]">
          <p className="font-black text-2xl uppercase italic mb-2">Estación inexistente</p>
          <p className="font-mono text-[10px] text-gray-400 uppercase mb-8">
            La línea que buscás no existe en la red. Quizás fue removida o la URL es incorrecta.
          </p>
          <Link to="/"
            className="inline-block bg-[#FF5F00] text-black px-8 py-4 font-black uppercase text-xs shadow-[4px_4px_0px_0px_white] hover:bg-white transition-all active:scale-95">
            ← Volver a la Red
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;