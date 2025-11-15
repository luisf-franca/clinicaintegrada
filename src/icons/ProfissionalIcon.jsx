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

    {/* Tubos do estetoscópio */}
    <path
      d="M14 15c-1.7 2.1-1.6 4.3 2 7"
      stroke="var(--vermelho-escuro)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 15c1.7 2.1 1.6 4.3-2 7"
      stroke="var(--vermelho-escuro)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Diafragma do estetoscópio */}
    <circle cx="16" cy="22" r="1.1" fill="var(--vermelho-escuro)" />
  </svg>
);

export default ProfissionalIcon;
