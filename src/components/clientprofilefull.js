import React, { useState } from 'react';
import DynamicFieldForm from './clientprofile/dynamicfield';


function MyComponent() {
  const heading = "Custom Field 🔖";
  const [isImageClicked, setIsImageClicked] = useState(false);

  const handleClick = () => {
    setIsImageClicked(true);
  };

  return (
    <div className="border border-gray-300 bg-gray-40">
      <div className="bg-gray-500/50 h-16 flex items-center p-2 text-lg font-semibold">
        <span>{heading}</span>
        {/* <img src={pen} alt="Pen Icon" className="ml-2 w-6 h-6" /> */}
      </div>
      <div className="p-4 border-t border-gray-300 text-left space-x-4">
        <div className="">
          <button onClick={handleClick} className="bg-gray-400 hover:bg-gray-600 text-black font py-2 px-4 space-x-4 rounded mb-3">
            Add CustomFields
          </button>
          {isImageClicked && <DynamicFieldForm />}
        </div>
      </div>
    </div>
  );
}

export default MyComponent;
