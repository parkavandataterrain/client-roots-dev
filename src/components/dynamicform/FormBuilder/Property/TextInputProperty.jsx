import React from "react";
import { useFormBuilderContext } from "../Context/FormBuilderContext";

import InputElement from "../../FormElements/InputElement";
import CheckBoxElement from "../../FormElements/CheckBoxElement";
import SelectElement from "../../FormElements/SelectElement";

export default function TextInputProperty() {
  const { selectedElement, elements, updateElement } = useFormBuilderContext();
  const fieldElement = elements[selectedElement];

  console.log({ fieldElement });

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

  return (
    <div className="flex flex-column gap-3">
      <div className="flex flex-column gap-3 border-b-2 pb-3">
        <p className="text-[14px] font-medium mx-1">{`${fieldElement.label} properties`}</p>
        <InputElement
          className="m-0 p-0"
          type="text"
          name="label"
          value={fieldElement.props.label}
          placeholder="Enter Label"
          onChange={handlePropsChange}
        />
      </div>
      <div className="flex flex-column gap-3 pb-3">
        {/* <p className="text-[14px] font-medium mx-1">{`${fieldElement.label} properties`}</p> */}

        {/* <InputElement
          className="m-0 p-0"
          type="text"
          name="placeholder"
          label={"Placeholder"}
          value={fieldElement.props.placeholder}
          placeholder="Enter Placeholder"
          onChange={handlePropsChange}
        /> */}

        {/* <InputElement
          className="m-0 p-0"
          type="number"
          name="rows"
          label={"Rows"}
          value={fieldElement.props.rows || 0}
          placeholder="No. of rows"
          onChange={(e) => {
            if (e.target.value >= 0) handlePropsChange(e);
          }}
        /> */}

        <SelectElement
          options={[
            {
              label: "w-1/2",
              value: "w-1/2",
            },
            {
              label: "w-1/4",
              value: "w-1/4",
            },
            {
              label: "w-3/4",
              value: "w-3/4",
            },
            {
              label: "w-full",
              value: "w-full",
            },
          ]}
          className="m-0 p-0 placeholder:text-xs"
          label={"Width"}
          name="width"
          value={fieldElement.props.width || ""}
          placeholder="Select width"
          onChange={handlePropsChange}
        />

        <CheckBoxElement
          options={[
            {
              label: "is Required",
              value: "required",
              checked: fieldElement.props.required,
            },
          ]}
          name={"required"}
          onChange={handleCheckBoxProps}
        />

        {/* <CheckBoxElement
          options={[
            {
              label: "Disable",
              value: "disabled",
              checked: fieldElement.props.disabled,
            },
          ]}
          name={"disabled"}
          onChange={handleCheckBoxProps}
        /> */}
      </div>
    </div>
  );
}
