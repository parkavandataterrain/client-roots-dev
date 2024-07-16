import React from "react";
import { useFormBuilderContext } from "../Context/FormBuilderContext";

import SelectElement from "../../FormElements/SelectElement";

export default function DividerProperty() {
  const { selectedElement, elements, updateElement } = useFormBuilderContext();
  const fieldElement = elements[selectedElement];

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

  return (
    <div className="flex flex-column gap-3">
      <div className="flex flex-column gap-3 border-b-2 pb-3">
        <p className="text-[14px] font-medium mx-1">{`${fieldElement.label} properties`}</p>
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
      </div>
    </div>
  );
}
