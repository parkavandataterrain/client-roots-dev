import React from "react";
import { useDnDCustomFieldsContext } from "../Context/DnDCustomFieldsContext";

import InputElement from "../../dynamicform/FormElements/InputElement";
import DateInput from "../../dynamicform/FormElements/DateInput";
import CheckBoxElement from "../../dynamicform/FormElements/CheckBoxElement";

export default function DateTimeProperty() {
  const { selectedElement, elements, updateElement, config } =
    useDnDCustomFieldsContext();
  const fieldElement = elements[selectedElement];

  const { enableAnswer, enableQuestion } = config;

  const handlePropsChange = (e) => {
    const {
      target: { name, value },
    } = e;

    const updatedElement = {
      ...fieldElement,
      props: {
        ...fieldElement.props,
        [name]: value,
      },
    };

    updateElement(selectedElement, updatedElement);
  };

  const handleDatePropsChange = (e) => {
    const {
      target: { value },
    } = e;

    const updatedElement = {
      ...fieldElement,
      props: {
        ...fieldElement.props,
        value,
      },
    };

    updateElement(selectedElement, updatedElement);
  };

  const handleCheckBoxProps = (e) => {
    const {
      target: { name, value, checked },
    } = e;

    const updatedElement = {
      ...fieldElement,
      props: {
        ...fieldElement.props,
        [name]: checked,
      },
    };

    updateElement(selectedElement, updatedElement);
  };

  return (
    <div className="flex flex-column gap-1">
      {enableQuestion && (
        <InputElement
          className="m-0 p-0"
          type="text"
          name="label"
          value={fieldElement.props.label}
          placeholder="Write a question..."
          label="Question"
          onChange={handlePropsChange}
        />
      )}

      {enableAnswer && (
        <DateInput
          className="m-0 p-0"
          type="text"
          name="value"
          label={"Answer"}
          value={fieldElement.props.value}
          placeholder="Write an answer.."
          onChange={handleDatePropsChange}
        />
      )}
    </div>
  );
}
