import React from "react";

const TogglePassword = ({ type, ariaLabel, onClick, children, addClass }) => {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      onClick={onClick}
      className={`${addClass} absolute inset-y-0 right-2 top-6 flex items-center pr-2 text-gray-500`}
    >
      {children}
    </button>
  );
};

export default TogglePassword;
