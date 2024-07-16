import React from "react";

const DividerElement = ({ className, type, label, width, ...rest }) => {
  // const Text = React.createElement(type === "header" ? "h1" : "h2", {});
  return (
    <div className={`m-1 mb-2 mt-0 ${width}`}>
      <div
        className="border-b-2 border-teal-500 w-100 text-[1px]"
        style={{
          color: "transparent",
        }}
      >
        Divider
      </div>
    </div>
  );
};

export default DividerElement;
