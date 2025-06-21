import React from 'react';
const HomeIcon = (props) => (
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
      d="M8 16.5L16 10L24 16.5"
      stroke="var(--vermelho-escuro)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="11"
      y="17"
      width="10"
      height="7"
      rx="2"
      stroke="var(--vermelho-escuro)"
      strokeWidth="2"
    />
  </svg>
);
export default HomeIcon;
