import React from 'react';

const LogoutIcon = (props) => (
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
      d="M13 22H11C9.89543 22 9 21.1046 9 20V12C9 10.8954 9.89543 10 11 10H13"
      stroke="var(--vermelho-escuro)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 19L23 16L20 13"
      stroke="var(--vermelho-escuro)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M23 16H13"
      stroke="var(--vermelho-escuro)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default LogoutIcon;