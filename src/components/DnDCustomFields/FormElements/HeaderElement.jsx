import React from "react";
import FormLabel from "./FormLabel";

const HeaderElement = ({ className = "", type, label, width, ...rest }) => {
  // const Text = React.createElement(type === "header" ? "h1" : "h2", {});
  return (
    <div className={`${type === "header" ? "m-1" : "m-1 mt-0"} ${width}`}>
      <h1
        className={`w-full text-gray-700 ${
          type === "header" ? "font-bold text-base py-1 " : "text-xs py-1"
        } ${className}`}
        {...rest}
      >
        {label}
      </h1>
    </div>
  );
};

export default HeaderElement;
