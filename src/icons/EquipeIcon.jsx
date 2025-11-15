import React from 'react';
const EquipeIcon = (props) => (
  <svg
    width={props.size || 32}
    height={props.size || 32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="16" cy="16" r="16" fill="var(--branco)" fillOpacity="0.85" />
    {/* Cabeça central */}
    <circle
      cx="16"
      cy="11.5"
      r="4"
      stroke="var(--vermelho-escuro)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Ombros base do grupo */}
    <path
      d="M7 22.5c0-4.2 4.477-7 9-7s9 2.8 9 7"
      stroke="var(--vermelho-escuro)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Cabeças laterais */}
    <circle
      cx="10"
      cy="15"
      r="2.2"
      stroke="var(--vermelho-escuro)"
      strokeWidth="2"
    />
    <circle
      cx="22"
      cy="15"
      r="2.2"
      stroke="var(--vermelho-escuro)"
      strokeWidth="2"
    />
  </svg>
);
export default EquipeIcon;
