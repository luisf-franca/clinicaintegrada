import React from 'react';
const SalaIcon = (props) => (
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
      x="7"
      y="9"
      width="18"
      height="14"
      rx="2"
      stroke="var(--vermelho-escuro)"
      strokeWidth="2"
    />
    <rect
      x="15"
      y="12.5"
      width="7"
      height="10.5"
      rx="1"
      stroke="var(--vermelho-escuro)"
      strokeWidth="2"
    />
    <circle cx="20.5" cy="18" r="0.9" fill="var(--vermelho-escuro)" />
  </svg>
);
export default SalaIcon;
