import React from "react";
import FormLabel from "./FormLabel";

export default function SelectElement({
  className,
  options, // [{ label: string, value: string }]
  name,
  label,
  value,
  required,
  onChange,
  placeholder = "Select",
  width,
  ...rest
}) {
  return (
    <div className={`m-1 ${width}`}>
      {label && <FormLabel required={required}>{label}</FormLabel>}
      <select
        className={`form-select ${className}`}
        name={name}
        value={value}
        onChange={onChange}
        {...rest}
      >
        <option disabled value="" defaultChecked>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option
            disabled={option?.disabled === true ? true : false}
            key={index}
            value={option.value || option}
          >
            {option.label || option}
          </option>
        ))}
      </select>
    </div>
  );
}
