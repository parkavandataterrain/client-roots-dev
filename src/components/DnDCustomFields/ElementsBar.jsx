import React, { useState, useMemo } from "react";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

function ElementsBar({ elements = [] }) {
  const handleDragStart = () => {};

  return (
    <div className="flex items-center gap-3 border-[1px] border-[#5BC4BF] p-3">
      {/* Element Box  */}
      <div className="bg-[#F9F9F9] flex items-center gap-2">
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
    <div className="">
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
