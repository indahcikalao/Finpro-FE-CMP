import React from "react";

const TogglePassword = ({ type, onClick, children, addClass }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${addClass} absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500`}
    >
      {children}
    </button>
  );
};

export default TogglePassword;
