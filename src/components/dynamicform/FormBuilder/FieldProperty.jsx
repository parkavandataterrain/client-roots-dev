import React from "react";
import { useFormBuilderContext } from "./Context/FormBuilderContext";

import GearIcon from "../../images/form_builder/gears.svg";
import InputElement from "../FormElements/InputElement";
import CheckBoxElement from "../FormElements/CheckBoxElement";
import TextInputProperty from "./Property/TextInputProperty";
import DateTimeProperty from "./Property/DateTimeProperty";
import CheckBoxProperty from "./Property/CheckBoxProperty";
import FileInputProperty from "./Property/FileInputProperty";
import SelectProperty from "./Property/SelectProperty";
import BooleanProperty from "./Property/BooleanProperty";
import HeaderProperty from "./Property/HeaderProperty";
import DividerProperty from "./Property/DividerProperty";

function FieldProperty(props) {
  const { selectedElement, elements, updateElement } = useFormBuilderContext();

  const fieldElement = elements[selectedElement];
  console.log({
    fieldElement,
  });

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

  console.log({ selectedElement });

  const renderProperty = () => {
    switch (fieldElement.type) {
      case "VARCHAR(250)":
      case "FLOAT":
      case "INTEGER":
        {
          return <TextInputProperty />;
        }
        break;
      case "BYTEA":
      case "BYTEA2":
        {
          return <FileInputProperty />;
        }
        break;
      case "TEXT":
        {
          return <TextInputProperty />;
        }
        break;
      case "checkbox":
        {
          return <CheckBoxProperty />;
        }
        break;
      case "TIMESTAMP":
        {
          return <DateTimeProperty />;
        }
        break;
      case "BOOLEAN":
        {
          return <BooleanProperty />;
        }
        break;
      case "my_enum_type":
      case "my_enum_typeb":
        {
          return <SelectProperty />;
        }
        break;
      case "CHAR(250)":
      case "JSON":
        {
          return <HeaderProperty />;
        }
        break;
      case "LINE":
        {
          return <DividerProperty />;
        }
        break;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-column h-100">
      <div
        h-50
        className={`h-100 flex flex-column gap-3 border-2 border[#858585] ${
          fieldElement ? "p-2" : "p-4"
        }`}
      >
        {fieldElement ? (
          renderProperty()
        ) : (
          <div className="h-100 w-100 flex flex-column items-center justify-center gap-2">
            <img src={GearIcon} alt="gear" height="25px" width="25px" />
            <p className="m-0 p-0 text-gray-500 text-xs text-center">
              Add or select element and set properties here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FieldProperty;
