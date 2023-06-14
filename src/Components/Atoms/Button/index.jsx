import React from 'react';

const Button = ({type, disabled, addClass, children}) => {
    return (
      <button
        type={type}
        disabled={disabled}
        className={`${addClass} w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
      >
        {children}
      </button>
    );
}

export default Button;
