import React, { useState, useMemo, useRef, useEffect } from "react";

import { v4 as uuidv4 } from "uuid";

// Icons

import Attachments_Icon from "../../images/form_builder/attachments.svg";
import Image_upload_Icon from "../../images/form_builder/image_upload.svg";
import Drop_down_Icon from "../../images/form_builder/drop_down.svg";
import Check_box_Icon from "../../images/form_builder/check_box.svg";
import Date_Icon from "../../images/form_builder/date.svg";
import Time_Icon from "../../images/form_builder/time.svg";
import Date_and_time_Icon from "../../images/form_builder/date_and_time.svg";
import Number_Icon from "../../images/form_builder/number.svg";
import Single_line_text_Icon from "../../images/form_builder/single_line_text.svg";
import Text_area_Icon from "../../images/form_builder/text_area.svg";
import Radio_button_Icon from "../../images/form_builder/radio_button.svg";
import DraggableIcon from "../../images/form_builder/draggable.svg";
import ElementsBar from "./ElementsBar";
import FormCanvas from "./FormCanvas";

// DND Kit

import { DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  FormBuilderContextProvider,
  useFormBuilderContext,
} from "./Context/FormBuilderContext";
import FieldProperty from "./FieldProperty";
import FormHeader from "./FormHeader";
import FormPreview from "./FormPreview";
import DragOverlayWrapper from "./DragOverlayWrapper";
import { notify } from "../../../helper/toastNotication";
import PrivateComponent from "../../PrivateComponent";

function RenderFormBuilder() {
  const {
    elements: items,
    addElement,
    removeElement,
    setSelectedElement,
    togglePreview,
    showPreview,
  } = useFormBuilderContext();

  // const [items, setItems] = useState([
  //   {
  //     type: "VARCHAR(250)",
  //     label: "Text",
  //     IconSrc: Single_line_text_Icon,
  //     props: {
  //       type: "text",
  //       label: "New Text",
  //       placeholder: "Enter new text",
  //       required: false,
  //       disabled: false,
  //     },
  //   },
  //   {
  //     type: "TEXT",
  //     label: "TextArea",
  //     IconSrc: Text_area_Icon,
  //     props: {
  //       type: "text",
  //       label: "New Text Area",
  //       placeholder: "Enter new text",
  //       required: false,
  //       disabled: false,
  //     },
  //   },
  //   {
  //     type: "INTEGER",
  //     label: "Number",
  //     IconSrc: Number_Icon,
  //     props: {
  //       type: "number",
  //       label: "New Number",
  //       placeholder: "Enter a number",
  //       required: false,
  //       disabled: false,
  //     },
  //   },

  //   {
  //     type: "TIMESTAMP",
  //     label: "Date and Time",
  //     IconSrc: Date_and_time_Icon,
  //     props: {
  //       type: "date",
  //       label: "New Date",
  //       required: false,
  //       disabled: false,
  //     },
  //   },
  //   {
  //     type: "my_enum_type",
  //     label: "Dropdown",
  //     IconSrc: Drop_down_Icon,
  //     props: {
  //       type: "text",
  //       label: "New Drop Down",
  //       required: false,
  //       disabled: true,
  //       options: ["option-1", "option-2", "option-3"],
  //     },
  //   },
  //   {
  //     type: "my_enum_typeb",
  //     label: "Multiple Select",
  //     IconSrc: Drop_down_Icon,
  //     props: {
  //       type: "text",
  //       label: "New Multi select",
  //       required: false,
  //       disabled: true,
  //       options: ["option-1", "option-2", "option-3"],
  //     },
  //   },
  //   {
  //     type: "checkbox",
  //     label: "Checkbox",
  //     IconSrc: Check_box_Icon,
  //     props: {
  //       type: "text",
  //       label: "New Check box",
  //       required: false,
  //       disabled: true,
  //       options: ["option-1", "option-2", "option-3"],
  //     },
  //   },
  // ]);

  // Define your element groups and their corresponding elements
  const elementGroups = [
    {
      name: "Layout Elements",
      elements: [
        {
          type: "CHAR(250)",
          label: "Header",
          IconSrc: Single_line_text_Icon,
          props: {
            type: "header",
            label: "New Header",
            width: "w-full",
          },
        },
        {
          type: "JSON",
          label: "Sub Header",
          IconSrc: Single_line_text_Icon,
          props: {
            type: "subheader",
            label: "New SubHeader",
            width: "w-full",
          },
        },
        {
          type: "LINE",
          label: "Divider",
          IconSrc: Single_line_text_Icon,
          props: {
            type: "break_line",
            label: "Divider",
            width: "w-full",
          },
        },
      ],
    },
    {
      name: "Text Elements",
      elements: [
        {
          type: "VARCHAR(250)",
          label: "Text",
          IconSrc: Single_line_text_Icon,
          props: {
            type: "text",
            label: "New Text",
            placeholder: "Enter new text",
            required: false,
            disabled: false,
            width: "w-full",
          },
        },
        {
          type: "TEXT",
          label: "TextArea",
          IconSrc: Text_area_Icon,
          props: {
            type: "text",
            label: "New Text Area",
            placeholder: "Enter new text",
            required: false,
            disabled: false,
            width: "w-full",
          },
        },
        {
          type: "INTEGER",
          label: "Number",
          IconSrc: Number_Icon,
          props: {
            type: "number",
            label: "New Number",
            placeholder: "Enter a number",
            required: false,
            disabled: false,
            width: "w-full",
          },
        },
        {
          type: "FLOAT",
          label: "Decimal",
          IconSrc: Number_Icon,
          props: {
            type: "number",
            label: "New Decimal",
            placeholder: "Enter a Decimal",
            step: "0.01",
            required: false,
            disabled: false,
            width: "w-full",
          },
        },
      ],
    },
    {
      name: "Date Elements",
      elements: [
        {
          type: "TIMESTAMP",
          label: "Date and Time",
          IconSrc: Date_and_time_Icon,
          props: {
            type: "date",
            label: "New Date",
            required: false,
            disabled: false,
            width: "w-full",
          },
        },
      ],
    },
    {
      name: "Multi Elements",
      elements: [
        {
          type: "my_enum_type",
          label: "Dropdown",
          IconSrc: Drop_down_Icon,
          props: {
            label: "New Drop Down",
            required: false,
            disabled: false,
            options: ["option-1", "option-2", "option-3"],
            width: "w-full",
          },
        },
        {
          type: "BOOLEAN",
          label: "Yes/No",
          IconSrc: Drop_down_Icon,
          props: {
            label: "New Yes/No",
            required: false,
            disabled: false,
            options: ["Yes", "No"],
            width: "w-full",
          },
        },

        {
          type: "my_enum_typeb",
          label: "Multiple Select",
          IconSrc: Drop_down_Icon,
          props: {
            label: "New Multi select",
            required: false,
            disabled: false,
            options: ["option-1", "option-2", "option-3"],
            width: "w-full",
          },
        },
        {
          type: "checkbox",
          label: "Checkbox",
          IconSrc: Check_box_Icon,
          props: {
            type: "text",
            label: "New Check box",
            required: false,
            disabled: false,
            options: ["option-1", "option-2", "option-3"],
            width: "w-full",
          },
        },
      ],
    },

    {
      name: "Media Elements",
      elements: [
        {
          type: "BYTEA",
          label: "Image Upload",
          IconSrc: Image_upload_Icon,
          props: {
            type: "file",
            accept: ".png, .jpg, .jpeg, .pdf",
            label: "Image Upload",
            required: false,
            disabled: false,
            width: "w-full",
          },
        },
        {
          type: "BYTEA2",
          label: "File Upload",
          IconSrc: Attachments_Icon,
          props: {
            type: "file",
            accept: ".png, .jpg, .jpeg, .pdf",
            label: "File Upload",
            required: false,
            disabled: false,
            width: "w-full",
          },
        },
      ],
    },
  ];

  // const onDragStart = (event) => {
  //   console.log({ OnDragStart: event });
  // };
  // const onDragMove = (event) => {
  //   console.log({ onDragMove: event });
  // };
  // const onDragOver = (event) => {
  //   console.log({ onDragOver: event });
  // };
  // const onDragEndX = (event) => {
  //   const { over, active } = event;
  //   if (
  //     over &&
  //     over.id === "form-builder-drop-zone" &&
  //     active.data &&
  //     active.data.current
  //   ) {
  //     let newItem = active.data.current;
  //     addElement(items.length, newItem);
  //   }

  //   if (
  //     over &&
  //     over.id !== "form-builder-drop-zone" &&
  //     over.data &&
  //     over.data.current &&
  //     active.data &&
  //     active.data.current
  //   ) {
  //     let newItem = active.data.current;
  //     let indexToInsert = parseInt(over.data.current.index);
  //     addElement(indexToInsert, newItem);
  //   }
  // };
  // const onDragCancel = () => {};

  const onDragEnd = (event) => {
    let elements = items;
    const { active, over } = event;
    if (!active || !over) return;

    const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement;
    const isDroppingOverDesignerDropArea =
      over.data?.current?.isDesignerDropArea;

    const droppingSidebarBtnOverDesignerDropArea =
      isDesignerBtnElement && isDroppingOverDesignerDropArea;

    // First scenario
    if (droppingSidebarBtnOverDesignerDropArea) {
      const uniqueKey = uuidv4();
      let newElement = active.data?.current?.element;
      newElement = {
        ...newElement,
        eleKey: uniqueKey,
      };
      addElement(elements.length, newElement);
      return;
    }

    const isDroppingOverDesignerElementTopHalf =
      over.data?.current?.isTopHalfDesignerElement;

    const isDroppingOverDesignerElementBottomHalf =
      over.data?.current?.isBottomHalfDesignerElement;

    const isDroppingOverDesignerElement =
      isDroppingOverDesignerElementTopHalf ||
      isDroppingOverDesignerElementBottomHalf;

    const droppingSidebarBtnOverDesignerElement =
      isDesignerBtnElement && isDroppingOverDesignerElement;

    // Second scenario
    if (droppingSidebarBtnOverDesignerElement) {
      const uniqueKey = uuidv4();
      let newElement = active.data?.current?.element;
      newElement = {
        ...newElement,
        eleKey: uniqueKey,
      };
      const overElementIndex = over.data?.current?.index;

      let indexForNewElement = overElementIndex; // i assume i'm on top-half
      if (isDroppingOverDesignerElementBottomHalf) {
        indexForNewElement = overElementIndex + 1;
      }

      addElement(indexForNewElement, newElement);
      return;
    }

    // Third scenario
    // const isDraggingDesignerElement = active.data?.current?.isDesignerElement;

    // const draggingDesignerElementOverAnotherDesignerElement =
    //   isDroppingOverDesignerElement && isDraggingDesignerElement;

    // if (draggingDesignerElementOverAnotherDesignerElement) {
    //   const activeElementIndex = active.data?.current?.index;
    //   const overElementIndex = over.data?.current?.index;

    //   // const activeElementIndex = elements.findIndex((el) => el.id === activeId);

    //   // const overElementIndex = elements.findIndex((el) => el.id === overId);

    //   if (activeElementIndex === -1 || overElementIndex === -1) {
    //     throw new Error("element not found");
    //   }

    //   const activeElement = { ...elements[activeElementIndex] };
    //   removeElement(activeElementIndex);

    //   let indexForNewElement = overElementIndex; // i assume i'm on top-half
    //   if (isDroppingOverDesignerElementBottomHalf) {
    //     indexForNewElement = overElementIndex + 1;
    //   }

    //   addElement(indexForNewElement, activeElement);
    // }
  };

  console.log({ items });
  console.log({ showPreview });

  return (
    <DndContext
      // onDragStart={onDragStart}
      // onDragMove={onDragMove}
      // onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      // onDragCancel={onDragCancel}
      autoScroll
    >
      {/* <SortableContext items={items} strategy={verticalListSortingStrategy}> */}
      {/* Form Header  */}
      <FormHeader />
      {/* Form Builder */}
      <PrivateComponent permission="create_form_templates_for_my_program">
        {!showPreview && (
          <div className="row">
            {/* Draggable Elements */}
            <div className="col-sm-4 p-2">
              <ElementsBar elementGroups={elementGroups} />
            </div>

            {/* Form Drop Zone */}
            <div className="col-sm-5 p-2">
              <FormCanvas items={items} />
            </div>

            {/* Selected Element Property */}

            <div className="col-sm-3 p-2">
              <FieldProperty />
            </div>
          </div>
        )}
      </PrivateComponent>
      {/* Form Preview */}
      {showPreview && <FormPreview />}
      {/* </SortableContext> */}
      {/* <DragOverlayWrapper /> */}
    </DndContext>
  );
}

function FormBuilder() {
  return (
    <FormBuilderContextProvider>
      <RenderFormBuilder />
    </FormBuilderContextProvider>
  );
}

export default FormBuilder;
