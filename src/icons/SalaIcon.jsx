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
    <circle cx="16" cy="16" r="16" fill="#fff" fillOpacity="0.85" />
    <rect
      x="10"
      y="12"
      width="12"
      height="8"
      rx="2"
      stroke="#b0171b"
      strokeWidth="2"
    />
    <rect x="14" y="16" width="4" height="4" rx="1" fill="#b0171b" />
  </svg>
);
export default SalaIcon;
