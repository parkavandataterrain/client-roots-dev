import React, { useState } from "react";

// DnD Kit

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

// Elements
import InputElement from "./FormElements/InputElement";
import TextAreaElement from "./FormElements/TextAreaElement";
import CheckBoxElement from "./FormElements/CheckBoxElement";
import RadioElement from "./FormElements/RadioElement";
import DateInput from "./FormElements/DateInput";
import { useDnDCustomFieldsContext } from "./Context/DnDCustomFieldsContext";
import ActionContextMenu from "./ActionContextMenu";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import SelectElement from "./FormElements/SelectElement";
import MultiSelectElement from "./FormElements/MultiSelectElement";
import HeaderElement from "./FormElements/HeaderElement";
import DividerElement from "./FormElements/DividerElement";
import FieldProperty from "./FieldProperty";
import FileInputElement from "./FormElements/FileInputElement";

function FieldElement({
  field,
  index,
  id,
  onChange = () => {},
  handleResetFile = () => {},
  viewMode,
  editMode,
}) {
  const { setSelectedElement, selectedElement } = useDnDCustomFieldsContext();

  

  if (viewMode && !editMode) {
    field.props = { ...field.props, disabled: true };
  }

  if (viewMode && editMode) {
    field.props = { ...field.props, disabled: false };
  }

  const key = `${field.type}_${id}`;
  let inputElement;
  switch (field.type) {
    case "text":
      {
        inputElement = <InputElement {...field.props} onChange={onChange} />;
      }
      break;
    case "imageupload":
    case "fileupload":
      {
        inputElement = (
          <FileInputElement
            {...field.props}
            onChange={onChange}
            handleResetFile={handleResetFile}
            viewMode={viewMode}
            editMode={editMode}
            uploadType={field.type}
          />
        );
      }
      break;
    case "textarea":
      {
        inputElement = <TextAreaElement {...field.props} onChange={onChange} />;
      }
      break;
    case "datetime":
      {
        inputElement = <DateInput {...field.props} onChange={onChange} />;
      }
      break;
    case "divider":
      {
        inputElement = <DividerElement {...field.props} />;
      }
      break;
    case "header":
      {
        inputElement = <h1>{field.props.label}</h1>;
      }
      break;
    case "subheader":
      {
        inputElement = <h5 style={{fontSize:"12px",fontWeight:"bold", color:"gray"}}>{field.props.label}</h5>;
      }
      break;
      
      

    default:
      inputElement = null;
  }

  if (viewMode) {
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
  const { selectedElement, setSelectedElement } = useDnDCustomFieldsContext();

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
    <>
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
          
          e.stopPropagation();
          if (selectedElement === index) {
            setSelectedElement(null);
          } else {
            setSelectedElement(index);
          }
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
          <div className="absolute bottom-0 w-full rounded-md h-[7px] bg-black rounded-t-none" />
        )}
        {isSelectedElement && (
          <span className="absolute right-[-0.5%] top-[103%] z-40">
            <ActionContextMenu />
          </span>
        )}
      </div>
      {index === selectedElement && field.type !== "divider" && (
        <FieldProperty />
      )}
    </>
  );
}
