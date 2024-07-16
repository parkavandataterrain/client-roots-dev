import { useState } from "react";

const TextArea = ({ name, id = { name }, placeholder, width = 480, height = 75, isEdittable, value, handleChange }) => {
    const bgDisabled = isEdittable ? '#F6F7F7' : ''
    const bgLabelDisabled = isEdittable ? '#F6F7F7' : 'white'

    const [isFocused, setIsFocused] = useState(false);
    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    return (
        <div className="relative">
            <textarea
                name={name}
                id={id}
                disabled={isEdittable}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={{ height }}
                placeholder=" "
                // className="w-full px-2 border-1
                // border-gray-600/50
                // placeholder-gray-500 
                // placeholder-opacity-50 
                // rounded-md
                // text-lg"
                className="block px-2.5 pb-2.5 pt-8 w-full text-md rounded-md border-1 focus:outline-none focus:ring-0 peer"
                value={value}
                onChange={handleChange}
            />
            <label
                htmlFor={id}
                className={`absolute px-2 text-sm text-gray-500 duration-300 transform ${isFocused || value ? '-translate-y-6 scale-75 top-4' : 'translate-y-1/2 scale-100 top-1.5'} z-10 origin-[0] start-2.5 peer-focus:text-gray-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto`}
                style={{ background: bgLabelDisabled }}
            >
                {placeholder}
            </label>
        </div>
    );
}

export default TextArea;