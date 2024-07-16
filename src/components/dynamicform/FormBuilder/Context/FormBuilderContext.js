import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const FormBuilderContext = createContext();

// Create a provider component
export const FormBuilderContextProvider = ({ children }) => {
  // State to hold elements array
  const [elements, setElements] = useState([]);

  // State to hold index of selected element
  const [selectedElement, setSelectedElement] = useState(null);

  // Toggle Preview State
  const [showPreview, setShowPreview] = useState(false);

  const [formDetail, setFormDetail] = useState({
    title: "",
    description: "",
    formName: "",
  });

  const [formDetailErrors, setFormDetailErrors] = useState({
    title: false,
    description: false,
    formName: false,
  });

  useEffect(() => {
    let newErrs = { ...formDetailErrors };

    if (formDetail.formName !== "") {
      newErrs.formName = false;
    }
    if (formDetail.title !== "") {
      newErrs.title = false;
    }
    if (formDetail.description !== "") {
      newErrs.description = false;
    }

    setFormDetailErrors(newErrs);
  }, [formDetail]);

  const handleFormDetailErrors = (name, boolVal) => {
    setFormDetailErrors((prev) => {
      return { ...prev, [name]: boolVal };
    });
  };

  const resetFormDetailErrors = () => {
    setFormDetailErrors({});
  };

  // Function to remove an element
  const removeElement = (index) => {
    setElements((prevElements) => {
      const updatedElements = [...prevElements];
      const filteredElements = updatedElements.toSpliced(index, 1);
      return filteredElements;
    });
    if (selectedElement === index) setSelectedElement(null);
    else if (selectedElement > index) setSelectedElement(selectedElement - 1);
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

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const handleTitle = (value) => {
    setFormDetail((prev) => {
      return { ...prev, title: value };
    });
  };
  const handleDesc = (value) => {
    setFormDetail((prev) => {
      return { ...prev, description: value };
    });
  };
  const handleFormName = (value) => {
    setFormDetail((prev) => {
      return { ...prev, formName: value };
    });
  };

  // Value to be provided by the context
  const contextValue = {
    elements,
    selectedElement,
    selectedFieldElement:
      selectedElement !== null ? elements[selectedElement] : null,
    setSelectedElement,
    cloneElement,
    removeElement,
    updateElement,
    addElement,
    resetElements,
    togglePreview,
    showPreview,
    formDetail,
    handleTitle,
    handleDesc,
    handleFormName,
    formDetailErrors,
    handleFormDetailErrors,
    resetFormDetailErrors,
  };

  // Provide the context value to the children components
  return (
    <FormBuilderContext.Provider value={contextValue}>
      {children}
    </FormBuilderContext.Provider>
  );
};

// Custom hook to consume the ElementContext
export const useFormBuilderContext = () => useContext(FormBuilderContext);
