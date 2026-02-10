const FlapStat = ({ label, value }) => (
  <div className="flex flex-col items-center md:items-start">
    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-[0.3em] mb-2">
      {label}
    </span>
    <div className="flex">
      {value.split('').map((char, i) => (
        <span key={i} className="flap-unit text-2xl md:text-4xl font-black animate-[flip_0.6s_ease-in-out_infinite_alternate] shadow-lg">
          {char}
        </span>
      ))}
    </div>
  </div>
);