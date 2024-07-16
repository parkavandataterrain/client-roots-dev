import React from "react";
import { useDnDCustomFieldsContext } from "../Context/DnDCustomFieldsContext";

import InputElement from "../../dynamicform/FormElements/InputElement";
import CheckBoxElement from "../../dynamicform/FormElements/CheckBoxElement";
import TextAreaElement from "../FormElements/TextAreaElement";

export default function TextInputProperty() {
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

  let isTextArea = fieldElement.type === "textarea";

  let AnswerInput = isTextArea ? TextAreaElement : InputElement;

  return (
    <div className="flex flex-column gap-1">
      {!isTextArea && enableQuestion && (
        <InputElement
          className="m-0 p-0"
          type="text"
          name="label"
          label="Question"
          value={fieldElement.props.label}
          placeholder="Write a question..."
          onChange={handlePropsChange}
        />
      )}

      {enableAnswer && (
        <AnswerInput
          className="m-0 p-0"
          type="text"
          name="value"
          label="Answer"
          value={fieldElement.props.value}
          placeholder="Write an answer.."
          onChange={handlePropsChange}
          rows={5}
        />
      )}

      {!enableAnswer && !enableQuestion && <p>No Property Availabel</p>}
    </div>
  );
}
