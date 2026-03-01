// Sistema de audio con Web Audio API (sin archivos externos)
// Todos los sonidos son sintéticos, generados en tiempo real

const ctx = () => {
  if (!window._audioCtx) {
    window._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return window._audioCtx;
};

const gain = (audioCtx, vol) => {
  const g = audioCtx.createGain();
  g.gain.value = vol;
  g.connect(audioCtx.destination);
  return g;
};

// Click mecánico tipo tecla de máquina de escribir
export const sonarClick = () => {
  try {
    const a = ctx();
    const g = gain(a, 0.15);
    const osc = a.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, a.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, a.currentTime + 0.04);
    g.gain.setValueAtTime(0.15, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.05);
    osc.connect(g);
    osc.start();
    osc.stop(a.currentTime + 0.05);
  } catch {}
};

// Pitido de FlapStat (estilo aeropuerto)
export const sonarFlap = () => {
  try {
    const a = ctx();
    const g = gain(a, 0.08);
    const osc = a.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, a.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, a.currentTime + 0.06);
    g.gain.setValueAtTime(0.08, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.08);
    osc.connect(g);
    osc.start();
    osc.stop(a.currentTime + 0.08);
  } catch {}
};

// Traqueteo de rieles — golpes suaves y rítmicos
export const sonarBocina = () => {
  try {
    const a = ctx();
    [0, 0.18, 0.5, 0.68].forEach(t => {
      const g = gain(a, 0.06);
      const buf = a.createBuffer(1, a.sampleRate * 0.04, a.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (a.sampleRate * 0.012));
      }
      const src = a.createBufferSource();
      src.buffer = buf;
      src.connect(g);
      src.start(a.currentTime + t);
    });
  } catch {}
};

// Sonido de logro desbloqueado — fanfarria corta
export const sonarLogro = () => {
  try {
    const a = ctx();
    const notas = [523, 659, 784, 1047]; // Do Mi Sol Do
    notas.forEach((freq, i) => {
      const g = gain(a, 0.1);
      const osc = a.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, a.currentTime + i * 0.1);
      g.gain.linearRampToValueAtTime(0.1, a.currentTime + i * 0.1 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + i * 0.1 + 0.18);
      osc.connect(g);
      osc.start(a.currentTime + i * 0.1);
      osc.stop(a.currentTime + i * 0.1 + 0.2);
    });
  } catch {}
};

// Sonido de completar estación (bitácora enviada)
export const sonarEstacion = () => {
  try {
    const a = ctx();
    const g = gain(a, 0.1);
    const osc = a.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, a.currentTime);
    osc.frequency.setValueAtTime(660, a.currentTime + 0.1);
    g.gain.setValueAtTime(0.1, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.25);
    osc.connect(g);
    osc.start();
    osc.stop(a.currentTime + 0.25);
  } catch {}
};

// Sonido de abordaje (embarcar en ruta)
export const sonarAbordar = () => {
  try {
    const a = ctx();
    const notas = [330, 440, 550];
    notas.forEach((freq, i) => {
      const g = gain(a, 0.09);
      const osc = a.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.09, a.currentTime + i * 0.07);
      g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + i * 0.07 + 0.12);
      osc.connect(g);
      osc.start(a.currentTime + i * 0.07);
      osc.stop(a.currentTime + i * 0.07 + 0.15);
    });
  } catch {}
};

// Desbloquear el audio context (debe llamarse desde interacción del usuario)
export const iniciarAudio = () => {
  try {
    const a = ctx();
    if (a.state === 'suspended') a.resume();
  } catch {}
};