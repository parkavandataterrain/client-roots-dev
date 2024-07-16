import React, { useState, useMemo } from "react";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

function ElementsBar({ elementGroups = [] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredElementGroups = useMemo(() => {
    let searchQueryLower = searchQuery.toLocaleLowerCase();

    return elementGroups.map((eachGroup) => {
      return {
        ...eachGroup,
        elements: eachGroup.elements.filter((eachElement) => {
          return eachElement.label
            .toLocaleLowerCase()
            .includes(searchQueryLower);
        }),
      };
    });
  }, [searchQuery]);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDragStart = () => {};

  return (
    <div className="flex flex-column gap-3 border-2 border[#858585] p-4">
      {/* Search Box */}
      <div className="input-group mb-2 justify-content-center w-100">
        <input
          type="text"
          className="form-control"
          placeholder="Search"
          aria-label="Search forms"
          aria-describedby="basic-addon2"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </div>

      {/* Element Box  */}
      <div id="modules" className="bg-[#F9F9F9]">
        {filteredElementGroups.map((group, index) => {
          if (group.elements.length > 0) {
            return (
              <ElementGroup
                key={index}
                groupName={group.name}
                elements={group.elements}
                handleDragStart={handleDragStart}
                elementGroupData={group}
              />
            );
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
}

export default ElementsBar;

function ElementButton(props) {
  const { elementType, elementLabel, IconSrc, elementData } = props;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: elementType,
    data: {
      element: elementData,
      isDesignerBtnElement: true,
    },
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div className="col-6 my-2">
      <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
        <button className="rounded bg-slate-200 flex items-center gap-2 w-100 bg-[#EAECEB] p-2 py-2.5 hover:bg-teal-400 cursor-pointer">
          <img src={IconSrc} alt="Icon" className="h-[14.06px] w-[14.06px]" />
          <span className="text-xs font-medium">{elementLabel}</span>
        </button>
      </div>
    </div>
  );
}

function ElementGroup({
  groupName,
  elements,
  handleDragStart,
  elementGroupData,
}) {
  return (
    <div>
      <p
        className="m-2 mx-1 text-xs text-[#5bc4bf]"
        style={{ fontWeight: "bold" }}
      >
        {groupName}
      </p>
      <div className="row">
        {elements.map((element, index) => (
          <ElementButton
            key={index}
            elementType={element.type}
            elementLabel={element.label}
            IconSrc={element.IconSrc}
            handleDragStart={handleDragStart}
            elementData={element}
          />
        ))}
      </div>
    </div>
  );
}
