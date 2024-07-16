import React, { useEffect, useMemo, useState } from "react";
import { useFormBuilderContext } from "../Context/FormBuilderContext";

import InputElement from "../../FormElements/InputElement";
import CheckBoxElement from "../../FormElements/CheckBoxElement";
import EnumOptionsComponent from "./EnumOptionsProperty";
import SelectElement from "../../FormElements/SelectElement";

export default function SelectProperty() {
  const {
    selectedElement,
    selectedFieldElement: fieldElement,
    elements,
    updateElement,
  } = useFormBuilderContext();
  // const [fieldElement, setFieldElement] = useState(elements[selectedElement]);
  // useEffect(() => {
  //   setFieldElement(elements[selectedElement]);
  // }, [selectedElement]);

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

  const handleEnumChange = (enumValues) => {
    const updatedElement = {
      ...fieldElement,
      props: {
        ...fieldElement.props,
        options: enumValues.split(","),
      },
    };

    updateElement(selectedElement, updatedElement);
  };

  if (!fieldElement) {
    return null;
  }

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
        <EnumOptionsComponent
          key={fieldElement.eleKey}
          label="Options"
          value={fieldElement.props.options || ""}
          setValue={handleEnumChange}
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
      </div>
    </div>
  );
}
