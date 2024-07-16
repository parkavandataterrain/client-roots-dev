import React, { useRef } from 'react';

const TextBox = ({
  name,
  id = { name },
  placeholder,
  width = 480,
  height = '7vh',
  isEdittable,
  value,
  handleChange,
  register,
  type,
  registerProps = {},
}) => {
  const bgDisabled = isEdittable ? '#F6F7F7' : '';
  const bgLabelDisabled = isEdittable ? '#F6F7F7' : 'white';
  const inputRef = useRef(null);

  if (!register) {
    register = () => {};
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        name={name}
        id={id || name}
        disabled={isEdittable}
        style={{ height: height, background: bgDisabled }}
        className="block px-2.5 z-50 w-full text-md rounded-md border-1 focus:outline-none focus:ring-0 peer"
        placeholder=" "
        value={value}
        type={type}
        onChange={handleChange}
        {...register(name, registerProps)}
      />
      <label
        htmlFor={id}
        className="absolute px-2 text-sm  text-gray-500 duration-300 transform -translate-y-6 scale-75 top-4 z-0 origin-[0] start-2.5 peer-focus:text-gray-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
        style={{ background: bgLabelDisabled }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (inputRef && inputRef.current) {
            inputRef.current.focus();
          }
        }}
      >
        {placeholder}
      </label>
    </div>
  );
};

export default TextBox;
