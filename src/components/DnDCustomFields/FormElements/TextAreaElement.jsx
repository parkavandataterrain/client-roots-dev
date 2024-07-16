import React from "react";
import FormLabel from "./FormLabel";

const TextAreaElement = ({ label, required, width, ...rest }) => {
  return (
    <div className={`m-1 ${width}`}>
      <FormLabel required={required}>{label}</FormLabel>
      <textarea
        {...rest}
        style={{ resize: "none" }} // Disable textarea resize
        rows={5}
        // Form Builder CSS
        // className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        // Encounter CSS
        className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-keppel`}
      />
    </div>
  );
};

export default TextAreaElement;
