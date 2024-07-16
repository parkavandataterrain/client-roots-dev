import React from "react";
import FormLabel from "./FormLabel";
import Select from "react-select";

export default function MultiSelectElement({
  className,
  options, // [{ label: string, value: string }]
  name,
  label,
  value,
  required,
  onChange,
  width,
  ...rest
}) {
  return (
    <div className={`m-1 ${width}`}>
      {label && <FormLabel required={required}>{label}</FormLabel>}
      <Select
        className={className}
        options={options?.map((option) => {
          return {
            label: option.label || option,
            value: option.value || option,
          };
        })}
        isMulti
        name={name}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </div>
  );
}
