import React, { useState } from "react";
import Select from "react-select";
import FormLabel from "../dynamicform/FormElements/FormLabel";

const DropDown = ({
  name,
  id = name,
  placeholder,
  height = "7vh",
  borderColor = "#E5E7EA",
  fontSize = "1.125rem",
  rounded = true,
  isEdittable,
  required = false,
  handleChange,
  options,
  label,
  selectedOption,
  className
}) => {
  const bgDisabled = isEdittable ? "#F6F7F7" : "white";
  const bgLabelDisabled = isEdittable ? "#F6F7F7" : "white";

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLabelClick = (e) => {
    e.preventDefault();
  };

  return (
    <div className="relative">
      {label && <FormLabel required={required}>{label}</FormLabel>}
      <Select
        name={name}
        id={id}
        options={options}
        placeholder=""
        value={selectedOption ? { value: selectedOption, label: selectedOption } : null}
        onChange={handleChange}
        isDisabled={isEdittable}
        className={className}
        onMenuOpen={() => setIsMenuOpen(true)}
        onMenuClose={() => setIsMenuOpen(false)}
        styles={{
          control: (styles) => ({
            ...styles,
            height: height,
            border: `1px solid ${borderColor}`,
            background: bgDisabled,
            fontSize: fontSize,
            borderRadius: rounded ? "0.375rem" : "0",
          }),
          menu: (styles) => ({
            ...styles,
            background: "white",
            zIndex: 9999,
          }),
          placeholder: (styles) => ({
            ...styles,
            color: 'transparent',  // Hide the default placeholder
          }),
        }}
        components={{
          IndicatorSeparator: () => null,
        }}
      />
      <label
        htmlFor={id}
        onClick={handleLabelClick}
        className={`absolute px-2 text-sm text-gray-500 duration-300 transform 
          ${isMenuOpen || selectedOption
            ? "-translate-y-6 scale-75 top-4"
            : "translate-y-1/2 scale-100 top-1.5"
          } z-10 origin-[0] start-2.5 peer-focus:text-gray-600 
          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
          peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 
          rtl:peer-focus:left-auto cursor-text`}
        style={{ background: bgLabelDisabled, pointerEvents: 'none' }}
      >
        {placeholder}
      </label>
    </div>
  );
};

export default DropDown;