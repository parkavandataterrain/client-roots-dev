import React from "react";
import FormLabel from "./FormLabel";

const InputElement = ({
  className,
  type,
  label,
  required,
  value,
  placeholder,
  disabled = false,
  rounded = true,
  addMargin = true,
  onChange,
  width,
  ...rest
}) => {
  const valueProps =
    type === "file"
      ? {}
      : {
          value: value || "",
        };

  return (
    <div className={`${addMargin ? "mx-1" : ""} ${width}`}>
      {label && <FormLabel required={required}>{label}</FormLabel>}
      <input
        type={type}
        {...rest}
        disabled={disabled}
        onChange={onChange}
        placeholder={placeholder || ""}
        {...valueProps}
        className={`appearance-none border ${rounded ? "rounded" : ""} w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${className}`}
      />
    </div>
  );
};

export default InputElement;
