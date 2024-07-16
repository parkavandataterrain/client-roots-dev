import React, { useState, useMemo, useRef, useEffect } from "react";

import { v4 as uuidv4 } from "uuid";

// Icons
import Attachments_Icon from "../images/form_builder/attachments.svg";
import Image_upload_Icon from "../images/form_builder/image_upload.svg";
import Drop_down_Icon from "../images/form_builder/drop_down.svg";
import Check_box_Icon from "../images/form_builder/check_box.svg";
import Date_Icon from "../images/form_builder/date.svg";
import Time_Icon from "../images/form_builder/time.svg";
import Date_and_time_Icon from "../images/form_builder/date_and_time.svg";
import Number_Icon from "../images/form_builder/number.svg";
import Single_line_text_Icon from "../images/form_builder/single_line_text.svg";
import Text_area_Icon from "../images/form_builder/text_area.svg";
import Radio_button_Icon from "../images/form_builder/radio_button.svg";
import DraggableIcon from "../images/form_builder/draggable.svg";
import ElementsBar from "./ElementsBar";
import FormCanvas from "./FormCanvas";

// DND Kit

import { DndContext } from "@dnd-kit/core";

import {
  DnDCustomFieldsContextProvider,
  useDnDCustomFieldsContext,
} from "./Context/DnDCustomFieldsContext";
import FieldProperty from "./FieldProperty";
import FormHeader from "../dynamicform/FormBuilder/FormHeader";
import FormPreview from "../dynamicform/FormBuilder/FormPreview";
import DragOverlayWrapper from "../dynamicform/FormBuilder/DragOverlayWrapper";
import { notify } from "../../helper/toastNotication";
import CustomFieldsView from "./CustomFieldsView";

function RenderDnDCustomFields({
  onDnDItemsChange,
  onDnDItemsDeleted,
  deletedDnDItems = [],
  dndItems = [],
  viewMode = false,
  editMode = false,
  config,
}) {
  const {
    setConfig,
    DnDFieldElements: elements,
    elements: items,
    setElements,
    addElement,
    removeElement,
    setSelectedElement,
    deletedElements,
    setDeletedElements,
  } = useDnDCustomFieldsContext();
  console.log(dndItems, "useDnDCustomFieldsContext")
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
          },
        },
        {
          type: "JSON",
          label: "Sub Header",
          IconSrc: Single_line_text_Icon,
          props: {
            type: "subheader",
            label: "New SubHeader",
          },
        },
        {
          type: "LINE",
          label: "Divider",
          IconSrc: Single_line_text_Icon,
          props: {
            type: "break_line",
            label: "Divider",
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
          },
        },
      ],
    },
  ];

  const prevDnDItems = useRef([]); // from parent
  const prevItems = useRef([]); // in context

  useEffect(() => {
    if (dndItems.length === 0) {
      if (items.length === 0) {
        // ignore
        prevDnDItems.current = [];
        console.log(
          "Not Updated: Got new Incomming State both items & dndItems are [] :",
          dndItems
        );
      } else {
        prevDnDItems.current = [];
        prevItems.current = items;
        setElements(dndItems);
        console.log(
          "Updated: Got new Incomming State dndItems [] but items [] > 0 :",
          dndItems
        );
      }
    } else if (
      JSON.stringify(prevDnDItems.current) !== JSON.stringify(dndItems) &&
      JSON.stringify(items) !== JSON.stringify(dndItems)
    ) {
      prevDnDItems.current = dndItems;
      prevItems.current = items;
      setElements(dndItems);
      console.log("Got new Incomming State :", dndItems);
    } else {
      prevDnDItems.current = dndItems;
      console.log({
        prevAndDnD:
          JSON.stringify(prevDnDItems.current) === JSON.stringify(dndItems),
      });
      console.log({
        itemsAndDnD: JSON.stringify(items) === JSON.stringify(dndItems),
      });
      console.log("Not Updated");
    }
  }, [dndItems]);

  useEffect(() => {
    if (onDnDItemsChange) {
      if (items.length === 0) {
        if (dndItems.length === 0) {
          // ignore
          prevItems.current = [];
          console.log("Not Notified: both items & dndItems are [] :", items);
        } else {
          prevItems.current = [];
          onDnDItemsChange(dndItems);
          console.log("Notified: items [] but dndItems [] > 0 :", dndItems);
        }
      } else if (
        JSON.stringify(prevDnDItems.current) !== JSON.stringify(items) &&
        JSON.stringify(items) !== JSON.stringify(dndItems)
      ) {
        onDnDItemsChange(items);
        console.log("Notifying new change :", items);
      }
    }
  }, [items]);

  //--------- Deleted Elements ----------------//

  const prevDnDDeletedItems = useRef([]); // from parent
  const prevDeleted = useRef([]); // in context

  useEffect(() => {
    if (deletedDnDItems.length === 0) {
      if (deletedElements.length === 0) {
        // ignore
        prevDnDDeletedItems.current = [];
        console.log(
          "Not Updated: Got new Incomming State both deletedElements & deletedDnDItems are [] :",
          deletedDnDItems
        );
      } else {
        prevDnDDeletedItems.current = [];
        prevDeleted.current = deletedElements;
        setDeletedElements(deletedDnDItems);
        console.log(
          "Updated: Got new Incomming State deletedDnDItems [] but deletedElements [] > 0 :",
          deletedDnDItems
        );
      }
    } else if (
      JSON.stringify(prevDnDDeletedItems.current) !==
        JSON.stringify(deletedDnDItems) &&
      JSON.stringify(deletedElements) !== JSON.stringify(deletedDnDItems)
    ) {
      prevDnDDeletedItems.current = deletedDnDItems;
      prevDeleted.current = deletedElements;
      setDeletedElements(deletedDnDItems);
      console.log("Got new Incomming State :", deletedDnDItems);
    } else {
      prevDnDDeletedItems.current = deletedDnDItems;
      console.log({
        prevAndDnD:
          JSON.stringify(prevDnDDeletedItems.current) ===
          JSON.stringify(deletedDnDItems),
      });
      console.log({
        deletedElementsAndDnD:
          JSON.stringify(deletedElements) === JSON.stringify(deletedDnDItems),
      });
      console.log("Not Updated");
    }
  }, [deletedDnDItems]);

  useEffect(() => {
    if (onDnDItemsChange) {
      if (deletedElements.length === 0) {
        if (deletedDnDItems.length === 0) {
          // ignore
          prevDeleted.current = [];
          console.log(
            "Not Notified: both deletedElements & deletedDnDItems are [] :",
            deletedElements
          );
        } else {
          prevDeleted.current = [];
          onDnDItemsDeleted(deletedDnDItems);
          console.log(
            "Notified: deletedElements [] but deletedDnDItems [] > 0 :",
            deletedDnDItems
          );
        }
      } else if (
        JSON.stringify(prevDnDDeletedItems.current) !==
          JSON.stringify(deletedElements) &&
        JSON.stringify(deletedElements) !== JSON.stringify(deletedDnDItems)
      ) {
        onDnDItemsDeleted(deletedElements);
        console.log("Notifying new change :", deletedElements);
      }
    }
  }, [deletedElements]);

  // ----------------------------------------

  // useEffect(() => {
  //   if (
  //     onDnDItemsChange &&
  //     JSON.stringify(items) !== JSON.stringify(dndItems)
  //   ) {
  //     onDnDItemsChange(items);
  //   }
  // }, [items]);

  // useEffect(() => {
  //   if (dndItems) {
  //     if (JSON.stringify(items) !== JSON.stringify(dndItems)) {
  //       setElements(dndItems);
  //     }
  //   }
  // }, [dndItems]);

  // useEffect(() => {
  //   setDeletedElements(deletedDnDItems);
  // }, []);

  // useEffect(() => {
  //   if (
  //     onDnDItemsDeleted &&
  //     deletedElements.length > 0 &&
  //     JSON.stringify(deletedElements) !== JSON.stringify(deletedDnDItems)
  //   ) {
  //     onDnDItemsDeleted(deletedElements);
  //   }
  // }, [deletedElements]);

  // ----------------------------------------------------

  // useEffect(() => {
  //   if (
  //     onDnDItemsDeleted &&
  //     deletedElements.length > 0 &&
  //     JSON.stringify(deletedElements) !== JSON.stringify(deletedDnDItems)
  //   ) {
  //     onDnDItemsDeleted(deletedElements);
  //   }
  // }, [deletedElements]);

  // useEffect(() => {
  //   if (JSON.stringify(deletedElements) !== JSON.stringify(deletedDnDItems)) {
  //     setDeletedElements(deletedDnDItems);
  //   }
  // }, [deletedDnDItems]);

  useEffect(() => {
    setConfig((prev) => {
      return { ...prev, ...config };
    });
  }, [config]);

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

  console.log(items);

  if (viewMode) {
    return (
      <div className="row">
        <div className="col-12 p-2">
          <CustomFieldsView viewMode={viewMode} editMode={editMode} />
        </div>
      </div>
    );
  }

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
      {/* <FormHeader /> */}
      {/* Form Builder */}

      <div className="row">
        {/* Draggable Elements */}
        {
          !viewMode === "encounterView" ?
          <div className="col-12 p-2">
          <ElementsBar elements={elements} />
        </div>
        :
        null
        }
        

        {/* Form Drop Zone */}
        <div className="col-12 p-2">
          <FormCanvas />
        </div>
      </div>

      {/* </SortableContext> */}
      {/* <DragOverlayWrapper /> */}
    </DndContext>
  );
}

// set viewMode = true ------ to view the form only
// set editMode = true ------ to edit the form view
// set viewMode & editMode = false ----- to create drag and drop form
function DnDCustomFields({
  onChange = () => {},
  dndItems,
  viewMode = false,
  editMode = false,
  config,
  onDelete = () => {},
  deletedItems = [],
}) {
  return (
    <DnDCustomFieldsContextProvider>
      <RenderDnDCustomFields
        onDnDItemsChange={onChange}
        dndItems={dndItems}
        viewMode={viewMode}
        editMode={editMode}
        config={config}
        onDnDItemsDeleted={onDelete}
        deletedDnDItems={deletedItems}
      />
    </DnDCustomFieldsContextProvider>
  );
}

export default DnDCustomFields;
