import React, { createContext, useState, useContext, useEffect } from "react";

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

// Create the context
const DnDCustomFieldsContext = createContext();

// Create a provider component
export const DnDCustomFieldsContextProvider = ({ children }) => {
  const DnDFieldElements = [
    {
      type: "text",
      label: "Text",
      IconSrc: Single_line_text_Icon,
      props: {
        type: "text",
        label: "",
        value: "",
        placeholder: "Start typing...",
        width: "w-full",
      },
    },
    {
      type: "textarea",
      label: "Text area",
      IconSrc: Text_area_Icon,
      props: {
        type: "text",
        label: "",
        value: "",
        placeholder: "Start Typing...",
        width: "w-full",
      },
    },
    {
      type: "datetime",
      label: "Date and Time",
      IconSrc: Date_and_time_Icon,
      props: {
        type: "date",
        label: "",
        value: "",
        width: "w-1/4",
      },
    },
    {
      type: "imageupload",
      label: "Image",
      IconSrc: Image_upload_Icon,
      props: {
        type: "file",
        accept: "image/*",
        label: "",
        value: "",
        width: "w-full",
        base64: "",
      },
    },
    {
      type: "fileupload",
      label: "File",
      IconSrc: Attachments_Icon,
      props: {
        type: "file",
        accept:
          ".png, .jpg, .jpeg, .pdf, .doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        label: "",
        value: "",
        width: "w-full",
        base64: "",
        isFile: true,
      },
    },
    {
      type: "divider",
      label: "Divider",
      IconSrc: Single_line_text_Icon,
      props: { width: "w-full" },
    },
    ,
  ];

  // State to hold elements array
  const [config, setConfig] = useState({
    enableAnswer: true,
    enableQuestion: true,
  });
  const [elements, setElements] = useState([]);
  const [deletedElements, setDeletedElements] = useState([]);

  // State to hold index of selected element
  const [selectedElement, setSelectedElement] = useState(null);

  console.log({ deletedElements });

  // Function to remove an element
  const removeElement = (index) => {
    try {
      const eleClone = [...elements];
      setDeletedElements((prev) => {
        console.log({ prev });
        return [...prev, eleClone[index]];
      });

      setElements((prevElements) => {
        const updatedElements = [...prevElements];
        const filteredElements = updatedElements.toSpliced(index, 1);
        return filteredElements;
      });

      if (selectedElement === index) setSelectedElement(null);
      else if (selectedElement > index) setSelectedElement(selectedElement - 1);
    } catch (e) {
      console.log({ e });
    }
  };

  // Function to update an element
  const updateElement = (index, updatedElement) => {
    setElements((prevElements) => {
      const updatedElements = [...prevElements];
      updatedElements[index] = updatedElement;
      return updatedElements;
    });
  };

  // Function to add an element
  const addElement = (index, newElement) => {
    setElements((prevElements) => {
      const updatedElements = [...prevElements];
      updatedElements.splice(index, 0, newElement);
      return updatedElements;
    });
  };

  const cloneElement = (index) => {
    setElements((prevElements) => {
      const updatedElements = [...prevElements];
      const newElement = [...prevElements];
      updatedElements.splice(index, 0, newElement[index]);
      return updatedElements;
    });
  };

  const resetElements = () => {
    setSelectedElement(null);
    setElements([]);
  };

  // Value to be provided by the context
  const contextValue = {
    config,
    setConfig,
    DnDFieldElements,
    elements,
    selectedElement,
    selectedFieldElement:
      selectedElement !== null ? elements[selectedElement] : null,
    setSelectedElement,
    deletedElements,
    setDeletedElements,
    cloneElement,
    removeElement,
    updateElement,
    addElement,
    setElements,
    resetElements,
  };

  // Provide the context value to the children components
  return (
    <DnDCustomFieldsContext.Provider value={contextValue}>
      {children}
    </DnDCustomFieldsContext.Provider>
  );
};

// Custom hook to consume the ElementContext
export const useDnDCustomFieldsContext = () =>
  useContext(DnDCustomFieldsContext);
