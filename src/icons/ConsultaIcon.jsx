import React from 'react';
const ConsultaIcon = (props) => (
  <svg
    width={props.size || 32}
    height={props.size || 32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="16" cy="16" r="16" fill="#fff" fillOpacity="0.85" />
    <rect
      x="10"
      y="10"
      width="12"
      height="12"
      rx="2"
      stroke="#b0171b"
      strokeWidth="2"
    />
    <path
      d="M16 14v4M14 16h4"
      stroke="#b0171b"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
export default ConsultaIcon;
