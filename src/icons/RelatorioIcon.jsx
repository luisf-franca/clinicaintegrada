import React from 'react';
const RelatorioIcon = (props) => (
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
      x="10"
      y="8"
      width="12"
      height="16"
      rx="2"
      stroke="var(--vermelho-escuro)"
      strokeWidth="2"
    />
    <path
      d="M13 12h6M13 16h6M13 20h6"
      stroke="var(--vermelho-escuro)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
export default RelatorioIcon;
