import React from 'react';
import { ErrorMessage } from 'formik';

const ErrorMessageInput = ({name}) => {
    return (
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm"
      />
    );
}

export default ErrorMessageInput;
