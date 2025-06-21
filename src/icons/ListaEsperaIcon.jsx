import React from 'react';
const ListaEsperaIcon = (props) => (
  <svg
    width={props.size || 32}
    height={props.size || 32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="16" cy="16" r="16" fill="var(--branco)" fillOpacity="0.85" />
    <rect
      x="9"
      y="10"
      width="14"
      height="12"
      rx="2"
      stroke="var(--vermelho-escuro)"
      strokeWidth="2"
    />
    <path
      d="M13 14h6M13 18h6"
      stroke="var(--vermelho-escuro)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
export default ListaEsperaIcon;
