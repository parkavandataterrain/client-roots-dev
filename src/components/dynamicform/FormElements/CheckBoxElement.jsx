import React from "react";
import FormLabel from "./FormLabel";

const CheckBoxElement = ({
  className,
  options, // { label : string , value : string | boolean , checked : boolean}
  name,
  label,
  value,
  checked,
  direction = "column",
  required,
  onChange,
  width,
  ...rest
}) => {
  return (
    <div className={`m-1 ${width}`}>
      {label && <FormLabel required={required}>{label}</FormLabel>}
      <div
        className={`flex ${
          direction !== "row" ? "flex-column gap-2" : "flex-row gap-3"
        } ${className}`}
      >
        {options.map((option, index) => (
          <div key={index} className={`flex gap-1 items-center`}>
            <input
              type="checkbox"
              id={`${label}-${index}`}
              name={name}
              value={option.value || option}
              onChange={onChange}
              checked={value || option.checked}
            />
            <label htmlFor={`${label}-${index}`}>
              {option.label || option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckBoxElement;
