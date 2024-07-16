import React from "react";

function FormLabel({ children, required, className, ...props }) {
  return (
    <label
      className={`block flex gap-2 text-gray-500 text-xs font-bold my-2 ml-1 ${className}`}
      {...props}
    >
      <span>{children}</span>
      {required && <span className="text-red-500">*</span>}
    </label>
  );
}

export default FormLabel;
