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
    <circle cx="16" cy="16" r="16" fill="#fff" fillOpacity="0.85" />
    <circle cx="16" cy="13" r="4" stroke="#b0171b" strokeWidth="2" />
    <path
      d="M8 23c0-3.3137 3.134-6 7-6s7 2.6863 7 6"
      stroke="#b0171b"
      strokeWidth="2"
    />
    <circle cx="10" cy="17" r="2" stroke="#b0171b" strokeWidth="1.5" />
    <circle cx="22" cy="17" r="2" stroke="#b0171b" strokeWidth="1.5" />
  </svg>
);
export default EquipeIcon;
