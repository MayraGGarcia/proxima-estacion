import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const Auth = ({ setIsLogged, setMaquinista }) => { 
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    if (!usuario.trim() || !password.trim())
      return setError('Completá todos los campos.');

    setCargando(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/registro';
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maquinista: usuario.trim(), password })
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || 'Error al procesar la solicitud.');

      sessionStorage.setItem('maquinista', data.maquinista);
      setMaquinista(data.maquinista);
      setIsLogged(true);
      navigate('/');
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  const handleModeSwitch = () => {
    setIsLogin(!isLogin);
    setError('');
    setUsuario('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden" 
         style={{ backgroundColor: '#1A1A1A', backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 38px, rgba(255,255,255,0.06) 38px, rgba(255,255,255,0.06) 40px)' }}>
      
      <div className="relative z-10 w-full max-w-xl bg-[#E8E4D9] shadow-[10px_10px_0px_0px_#FF5F00] md:shadow-[20px_20px_0px_0px_#FF5F00] flex flex-col md:flex-row border-4 border-[#1A1A1A]">
        <div className="flex-[2] p-6 md:p-8 border-b-4 md:border-b-0 md:border-r-4 border-dashed border-[#1A1A1A] text-left">
          <div className="flex justify-between items-start mb-10">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-widest leading-none mb-1 text-[#1A1A1A]">Pase_de_Abordaje</p>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none text-[#1A1A1A]">
                {isLogin ? "Acceso" : "Alta"}
              </h1>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleAuth}>
            <div>
              <label className="block font-mono text-[9px] font-black uppercase mb-1 text-[#1A1A1A]">Identificador</label>
              <input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)}
                className="w-full bg-transparent border-2 border-[#1A1A1A] p-3 font-mono text-sm focus:bg-white outline-none placeholder:opacity-30 uppercase text-[#1A1A1A]"
                placeholder={isLogin ? "Tu identificador" : "Elegí un identificador"} disabled={cargando} />
            </div>
            <div>
              <label className="block font-mono text-[9px] font-black uppercase mb-1 text-[#1A1A1A]">Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-2 border-[#1A1A1A] p-3 font-mono text-sm focus:bg-white outline-none placeholder:opacity-30 text-[#1A1A1A]"
                placeholder={isLogin ? "Tu contraseña" : "Elegí una contraseña"} disabled={cargando} />
            </div>

            {error && (
              <p className="font-mono text-[9px] uppercase text-red-600 font-black border-l-4 border-red-600 pl-3">{error}</p>
            )}

            <button type="submit" disabled={cargando}
              className={`w-full mt-4 bg-[#1A1A1A] text-white py-4 font-black uppercase text-sm transition-colors shadow-[6px_6px_0px_0px_#AAA]
                ${cargando ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FF5F00] hover:text-[#1A1A1A]'}`}>
              {cargando ? 'Procesando...' : isLogin ? "Validar Entrada" : "Registrar Pasajero"}
            </button>
          </form>

          <button onClick={handleModeSwitch} disabled={cargando}
            className="mt-6 font-mono text-[10px] font-black uppercase underline decoration-2 underline-offset-4 hover:text-[#FF5F00] text-[#1A1A1A]">
            {isLogin ? "Solicitar nuevo abono →" : "Ya tengo mi credencial →"}
          </button>
        </div>

        <div className="flex-1 bg-[#D9D4C7] p-8 flex flex-col justify-between items-center relative overflow-hidden border-t-4 md:border-t-0 border-[#1A1A1A]">
          <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 bg-[#1A1A1A] rounded-full hidden md:block"></div>
          <div className="text-center w-full">
            <p className="font-mono text-[8px] font-black uppercase opacity-40 mb-4 text-[#1A1A1A]">Código_QR</p>
            <div className="flex gap-[2px] h-20 mb-4 justify-center">
              {[2, 4, 1, 3, 2, 5, 1, 4, 2, 3, 1].map((w, i) => (
                <div key={i} className="bg-[#1A1A1A]" style={{ width: `${w}px` }}></div>
              ))}
            </div>
          </div>
          <div className="rotate-0 md:rotate-90 origin-center whitespace-nowrap">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.5em] text-[#1A1A1A]">Terminal_2026_BA</p>
          </div>
          <div className="mt-8 md:mt-0 text-center w-full">
            <div className="border-2 border-[#1A1A1A] p-2 inline-block">
              <span className="font-black text-xs uppercase italic text-[#1A1A1A]">{isLogin ? 'Acceso' : 'Registro'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;