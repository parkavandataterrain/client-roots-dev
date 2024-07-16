import React, { useState } from "react";
import { useDnDCustomFieldsContext } from "../Context/DnDCustomFieldsContext";

import InputElement from "../../dynamicform/FormElements/InputElement";
import CheckBoxElement from "../../dynamicform/FormElements/CheckBoxElement";
import { notifyError } from "../../../helper/toastNotication";

export default function FileInputProperty({ isFile = false }) {
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    const maxAllowedSize = 5 * 1024 * 1024;
    if (file.size < maxAllowedSize) {
      const reader = new FileReader();
      reader.onloadend = () => {
        let b64 = reader.result;
        const updatedElement = {
          ...fieldElement,
          props: {
            ...fieldElement.props,
            value: b64,
            base64: b64,
          },
        };

        updateElement(selectedElement, updatedElement);
      };
      reader.readAsDataURL(file);
    } else {
      notifyError("File size must be less than 5MB");
    }
  };

  const handleResetFile = () => {
    const updatedElement = {
      ...fieldElement,
      props: {
        ...fieldElement.props,
        value: "",
        base64: "",
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
          label="Question"
          value={fieldElement.props.label}
          placeholder="Enter Label"
          onChange={handlePropsChange}
        />
      )}
      {enableAnswer && (
        <>
          {fieldElement.props.base64 ? (
            !isFile ? (
              <div className="m-1">
                <label
                  className={`block flex gap-2 text-gray-500 text-xs font-bold my-2 `}
                >
                  <span>Answer</span>
                </label>
                <button
                  onClick={handleResetFile}
                  className="border border-keppel rounded-[3px] text-[#5BC4BF] p-1 px-2 text-xs"
                >
                  Change {isFile ? "File" : "Image"}
                </button>
              </div>
            ) : (
              <></>
            )
          ) : (
            <InputElement
              className="m-0 p-0"
              type="file"
              accept={fieldElement.props.accept}
              name="label"
              label={`Answer ( Max 5MB )`}
              onChange={handleFileChange}
            />
          )}
          {fieldElement.props.base64 && (
            <div className="m-1">
              {isFile && (
                <label
                  className={`block flex gap-2 text-gray-500 text-xs font-bold my-2 `}
                >
                  <span>Answer</span>
                </label>
              )}
              {isFile ? (
                <div className="flex gap-2 items-center">
                  <a
                    className="border border-keppel rounded-[3px] disabled:cursor-not-allowed disabled:bg-[#6cd8d3] bg-[#5BC4BF] text-white p-1 px-2 text-xs"
                    href={fieldElement.props.base64}
                    download={fieldElement.props.label}
                  >
                    Download File
                  </a>

                  <div className="m-1">
                    <button
                      onClick={handleResetFile}
                      className="border border-keppel rounded-[3px] text-[#5BC4BF] p-1 px-2 text-xs"
                    >
                      Change {isFile ? "File" : "Image"}
                    </button>
                  </div>
                </div>
              ) : (
                <img
                  src={fieldElement.props.base64}
                  style={{
                    width: "100px",
                    height: "auto",
                  }}
                />
              )}
            </div>
          )}{" "}
        </>
      )}
    </div>
  );
}
