import React from 'react';

const PaginaAnimada = ({ children, className = '' }) => (
  <div
    className={className}
    style={{
      animation: 'fadeUp 0.45s ease-out both',
    }}
  >
    {children}
  </div>
);

export const ItemAnimado = ({ children, delay = 0, className = '' }) => (
  <div
    className={className}
    style={{
      animation: 'fadeUp 0.4s ease-out both',
      animationDelay: `${delay}s`,
    }}
  >
    {children}
  </div>
);

export default PaginaAnimada;