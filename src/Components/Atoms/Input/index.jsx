import React from "react";
import { Field } from "formik";

const Input = ({ type, name, id, placeholder, addClass }) => {
  return (
    <Field
      type={type}
      name={name}
      id={id}
      placeholder={placeholder}
      className={
        type !== "checkbox"
          ? `${addClass} bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10`
          : `${addClass} w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300`
      }
    />
  );
};

export default Input;
