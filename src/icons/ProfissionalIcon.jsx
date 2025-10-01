import React from 'react';

const ProfissionalIcon = (props) => (
  <svg
    width={props.size || 32}
    height={props.size || 32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="16" cy="16" r="16" fill="var(--branco)" fillOpacity="0.85" />
    <path
      d="M20 29v-3a6 6 0 0 0-6-6h-4a6 6 0 0 0-6 6v3"
      stroke="var(--vermelho-escuro)"
      strokeWidth="2"
    />
    <circle
      cx="10"
      cy="11"
      r="6"
      stroke="var(--vermelho-escuro)"
      strokeWidth="2"
    />
    <path
      d="M30 29v-3a6 6 0 0 0-4.5-5.81"
      stroke="var(--vermelho-escuro)"
      strokeWidth="2"
    />
    <path
      d="M20 5.19a6 6 0 0 1 0 11.62"
      stroke="var(--vermelho-escuro)"
      strokeWidth="2"
    />
  </svg>
);

export default ProfissionalIcon;
