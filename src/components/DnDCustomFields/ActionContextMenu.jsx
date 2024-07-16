import React from "react";

import CloneIcon from "../images/form_builder/clone.svg";
import TrashIcon from "../images/form_builder/trash.svg";
import { useDnDCustomFieldsContext } from "./Context/DnDCustomFieldsContext";

function ActionContextMenu() {
  const { selectedElement, removeElement, cloneElement } =
    useDnDCustomFieldsContext();

  return (
    <span className="inline-flex items-center gap-3 p-2 bg-white shadow">
      <button
        className="cursor-pointer"
        onClick={(e) => {
          console.log("on clone ele");

          e.stopPropagation();
          cloneElement(selectedElement);
        }}
      >
        <img
          src={CloneIcon}
          style={{
            height: "15px",
            width: "100%",
          }}
        />
      </button>
      <button
        className="cursor-pointer"
        onClick={(e) => {
          console.log("on del ele");

          e.stopPropagation();
          removeElement(selectedElement);
        }}
      >
        <img
          src={TrashIcon}
          style={{
            height: "15px",
            width: "100%",
          }}
        />
      </button>
    </span>
  );
}

export default ActionContextMenu;
