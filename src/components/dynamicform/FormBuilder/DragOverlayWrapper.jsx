import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import React, { useState } from "react";
import { useFormBuilderContext } from "./Context/FormBuilderContext";
import FieldElement from "./FieldElement";

function DragOverlayWrapper() {
  const { elements } = useFormBuilderContext();
  const [draggedItem, setDraggedItem] = useState(null);

  useDndMonitor({
    onDragStart: (event) => {
      setDraggedItem(event.active);
    },
    onDragCancel: () => {
      setDraggedItem(null);
    },
    onDragEnd: () => {
      setDraggedItem(null);
    },
  });

  if (!draggedItem) return null;

  let node = <div>No drag overlay</div>;
  const isSidebarBtnElement = draggedItem.data?.current?.isDesignerBtnElement;

  if (isSidebarBtnElement) {
    return null;
    //TODO - Commented for later use
    // const element = draggedItem.data?.current?.element;
    // node = (
    //   <ElementButtonOverlay
    //     elementType={element.type}
    //     elementLabel={element.label}
    //     IconSrc={element.IconSrc}
    //     elementData={element}
    //   />
    // );
  }

  const isDesignerElement = draggedItem.data?.current?.isDesignerElement;
  if (isDesignerElement) {
    const elementId = draggedItem.data?.current?.index;
    const element = elementId;
    if (!element) node = <div>Element not found!</div>;
    else {
      const elementData = draggedItem.data?.current?.element;

      node = (
        <div className="flex bg-accent border rounded-md h-[120px] w-full py-2 px-4 opacity-80 pointer pointer-events-none">
          <FieldElement
            field={elementData}
            index={elementId}
            id={elementId}
            preview
          />
        </div>
      );
    }
  }

  return <DragOverlay>{node}</DragOverlay>;
}

export default DragOverlayWrapper;

const ElementButtonOverlay = (props) => {
  const { elementType, elementLabel, IconSrc, elementData } = props;

  return (
    <div>
      <button className="rounded bg-slate-200 flex items-center gap-2 w-100 bg-[#EAECEB] p-2 py-2.5 hover:bg-teal-400 cursor-pointer">
        <img src={IconSrc} alt="Icon" className="h-[14.06px] w-[14.06px]" />
        <span className="text-xs font-medium">{elementLabel}</span>
      </button>
    </div>
  );
};
