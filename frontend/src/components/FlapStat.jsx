const FlapStat = ({ label, value }) => {
  const safeValue = String(value || "000").padStart(3, '0');

  return (
    <div className="flex flex-col items-center md:items-start group">
      <style>
        {`
          @keyframes flip-custom {
            0% { transform: rotateX(0deg); }
            100% { transform: rotateX(-180deg); }
          }
          .flap-unit {
            perspective: 300px;
            position: relative;
          }
        `}
      </style>
      <span className="text-[9px] font-mono text-gray-400 uppercase tracking-[0.3em] mb-2 font-black">
        {label}
      </span>
      <div className="flex gap-1">
        {safeValue.split('').map((char, i) => (
          <div key={i} className="flap-unit w-10 h-14 bg-[#1A1A1A] text-[#FF5F00] flex items-center justify-center rounded-sm border-b-4 border-black shadow-xl">
            <span className="text-3xl font-black italic">{char}</span>
            {/* Línea divisoria central */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/50"></div>
          </div>
        ))}
      </div>
    </div>
  );
};