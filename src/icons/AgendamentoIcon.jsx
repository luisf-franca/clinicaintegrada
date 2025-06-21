import React from 'react';
const AgendamentoIcon = (props) => (
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
      y="11"
      width="14"
      height="10"
      rx="2"
      stroke="var(--vermelho-escuro)"
      strokeWidth="2"
    />
    <path
      d="M12 15h8M12 18h5"
      stroke="var(--vermelho-escuro)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <rect
      x="12"
      y="8"
      width="2"
      height="4"
      rx="1"
      fill="var(--vermelho-escuro)"
    />
    <rect
      x="18"
      y="8"
      width="2"
      height="4"
      rx="1"
      fill="var(--vermelho-escuro)"
    />
  </svg>
);
export default AgendamentoIcon;
