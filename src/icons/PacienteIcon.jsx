import React from 'react';
const PacienteIcon = (props) => (
  <svg
    width={props.size || 32}
    height={props.size || 32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="16" cy="16" r="16" fill="var(--branco)" fillOpacity="0.85" />
    <circle
      cx="16"
      cy="11.5"
      r="4"
      stroke="var(--vermelho-escuro)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 22.5c0-4 4-7 8-7s8 3 8 7"
      stroke="var(--vermelho-escuro)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default PacienteIcon;
