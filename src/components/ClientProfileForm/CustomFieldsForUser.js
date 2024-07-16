import { useEffect, useMemo, useState } from "react";

import DnDCustomFields from "../DnDCustomFields";

import TextBox from "../common/TextBox";
import OpenAccordianPNG from "../images/open-accordion.png";
import ClosedAccordianPNG from "../images/closed-accordion.png";
import axios from "../../helper/axiosInstance";
import { notifySuccess } from "../../helper/toastNotication";

const CustomFieldsForUser = ({
  id,
  onChange,
  dndItems,
  viewMode,
  mode,
  editMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (dndItems.length > 0) {
      if (!isOpen) {
        setIsOpen(true);
      }
    }
  }, [dndItems]);

  console.log({ dndItems });
  console.count("dndItems");

  return (
    <div
      className="border border-gray-300  bg-gray-50 rounded-md"
      id={`accordian-${id}`}
    >
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={toggleAccordion}
      >
        <div>
          <h2 className="text-lg font-medium">Custom Fields</h2>

          <p>Custom fields for the client profiles.</p>
        </div>
        <img
          src={isOpen ? OpenAccordianPNG : ClosedAccordianPNG}
          alt={isOpen ? "Open accordian" : "Close accordion"}
          className="ml-2 w-6 h-6"
        />
      </div>
      {isOpen && (
        <>
          <div className="p-4 border-t border-gray-300">
            <div className="flex flex-col justify-between space-y-6">
              <DnDCustomFields
                onChange={onChange}
                dndItems={dndItems}
                viewMode={viewMode}
                editMode={editMode}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomFieldsForUser;
