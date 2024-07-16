import React, { useState } from "react";

// DnD Kit

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

// Elements
import InputElement from "../FormElements/InputElement";
import TextAreaElement from "../FormElements/TextAreaElement";
import CheckBoxElement from "../FormElements/CheckBoxElement";
import RadioElement from "../FormElements/RadioElement";
import DateInput from "../FormElements/DateInput";
import { useFormBuilderContext } from "./Context/FormBuilderContext";
import ActionContextMenu from "./ActionContextMenu";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import SelectElement from "../FormElements/SelectElement";
import MultiSelectElement from "../FormElements/MultiSelectElement";
import HeaderElement from "../FormElements/HeaderElement";
import DividerElement from "../FormElements/DividerElement";

function FieldElement({ field, index, id, preview }) {
  const { setSelectedElement, selectedElement } = useFormBuilderContext();

  const key = `${field.type}_${id}`;
  let inputElement;
  switch (field.type) {
    case "VARCHAR(250)":
    case "INTEGER":
    case "FLOAT":
    case "BYTEA":
    case "BYTEA2":
      {
        inputElement = <InputElement {...field.props} />;
      }
      break;
    case "TEXT":
      {
        inputElement = <TextAreaElement {...field.props} />;
      }
      break;
    case "checkbox":
      {
        inputElement = <CheckBoxElement {...field.props} />;
      }
      break;
    case "TIMESTAMP":
      {
        inputElement = <DateInput {...field.props} />;
      }
      break;
    case "BOOLEAN":
    case "my_enum_type":
      {
        inputElement = <SelectElement {...field.props} />;
      }
      break;
    case "my_enum_typeb":
      {
        inputElement = <MultiSelectElement {...field.props} />;
      }
      break;
    case "CHAR(250)":
    case "JSON":
      {
        inputElement = <HeaderElement {...field.props} />;
      }
      break;
    case "LINE":
      {
        inputElement = <DividerElement {...field.props} />;
      }
      break;

    default:
      inputElement = null;
  }

  if (preview) {
    return <div data-id={index}>{inputElement}</div>;
  }

  // return (
  //   <div
  //     data-id={index}
  //     onClick={(e) => {
  //       e.stopPropagation();
  //       setSelectedElement(index);
  //     }}
  //     className={`relative ${
  //       isSelectedElement
  //         ? "outline-teal-400 outline outline-2 outline-offset-1"
  //         : ""
  //     }`}
  //   >
  //     {inputElement}
  //     {isSelectedElement && (
  //       <span className="absolute right-[-0.5%] top-[103%] z-40">
  //         <ActionContextMenu />
  //       </span>
  //     )}
  //   </div>
  // );

  return (
    <FieldElementWrapper index={index} field={field}>
      {inputElement}
    </FieldElementWrapper>
  );
}

export default FieldElement;

function FieldElementWrapper({ index, field, children }) {
  const { selectedElement, setSelectedElement } = useFormBuilderContext();

  const [mouseIsOver, setMouseIsOver] = useState(false);
  const topHalf = useDroppable({
    id: index + "-top",
    data: {
      index: index,
      isTopHalfDesignerElement: true,
    },
  });

  const bottomHalf = useDroppable({
    id: index + "-bottom",
    data: { index: index, isBottomHalfDesignerElement: true },
  });

  const draggable = useDraggable({
    id: index + "-drag-handler",
    data: {
      index: index,
      element: field,
      isDesignerElement: true,
    },
  });

  const isSelectedElement = selectedElement === index;

  if (draggable.isDragging) return null; // temporary remove the element from designer

  return (
    <div
      // ref={draggable.setNodeRef}
      // {...draggable.listeners}
      // {...draggable.attributes}
      className={`relative h-auto flex flex-col text-foreground hover:cursor-pointer rounded-md ${
        topHalf.isOver || bottomHalf.isOver
          ? "ring-1 ring-accent ring-inset"
          : ""
      } ${
        isSelectedElement
          ? "outline-teal-400 outline outline-2 outline-offset-1"
          : ""
      }`}
      // onMouseEnter={() => {
      //   setMouseIsOver(true);
      // }}
      // onMouseLeave={() => {
      //   setMouseIsOver(false);
      // }}
      onClick={(e) => {
        console.log("clickedd...");
        console.log({ index });
        e.stopPropagation();
        setSelectedElement(index);
      }}
    >
      <div
        ref={topHalf.setNodeRef}
        className="absolute w-full h-1/2 rounded-t-md"
      />
      <div
        ref={bottomHalf.setNodeRef}
        className="absolute  w-full bottom-0 h-1/2 rounded-b-md"
      />

      {topHalf.isOver && (
        <div className="absolute top-0 w-full rounded-md h-[7px] bg-primary rounded-b-none" />
      )}
      <div className="flex w-full h-auto items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none opacity-100">
        {children}
      </div>

      {bottomHalf.isOver && (
        <div className="absolute bottom-0 w-full rounded-md h-[7px] bg-primary rounded-t-none" />
      )}
      {isSelectedElement && (
        <span className="absolute right-[-0.5%] top-[103%] z-40">
          <ActionContextMenu />
        </span>
      )}
    </div>
  );
}
