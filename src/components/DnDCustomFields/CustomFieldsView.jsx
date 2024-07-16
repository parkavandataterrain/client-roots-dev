import React from "react";
import { useDnDCustomFieldsContext } from "./Context/DnDCustomFieldsContext";
import FieldElement from "./FieldElement";
import { notifyError } from "../../helper/toastNotication";

function CustomFieldsView({ viewMode, editMode }) {
  const {
    DnDFieldElements,
    elements: items,
    setElements,
    addElement,
    removeElement,
    setSelectedElement,
    updateElement,
  } = useDnDCustomFieldsContext();

  // onChange Handlers

  const handleInputOnChange = (e, selectedElement, fieldElement) => {
    const {
      target: { name, value },
    } = e;
    const updatedElement = {
      ...fieldElement,
      props: {
        ...fieldElement.props,
        value: value,
      },
    };

    updateElement(selectedElement, updatedElement);
  };

  const handleFileOnChange = (event, selectedElement, fieldElement) => {
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

  const handleResetFile = (selectedElement, fieldElement) => {
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
    <div className="flex flex-column border-[1px] border-[#5BC4BF] h-100">
      <div
        className={`flex flex-column justify-between ${
          items.length === 0 ? "h-100" : ""
        }`}
        style={{
          maxHeight: "623px",
        }}
      >
        <div
          className={`p-3 ${
            items.length === 0 ? "h-100" : "pb-5"
          } flex flex-column gap-2`}
          style={{
            overflowY: "auto",
            // maxHeight: "calc(100vh - 110px)",
            maxHeight: "623px",
          }}
        >
          {items.length === 0 ? (
            <div
              className="w-100 h-100 flex flex-column items-center justify-center gap-2 p-2 pt-[40px]"
              style={{
                maxHeight: "calc(80vh - 56px)",
              }}
            >
              <p className="text-md text-bold m-0">No Custom Field Exist</p>
            </div>
          ) : (
            items.map((item, index) => {
              const key = `${item.type}_${index}`;

              let isFile =
                item.type === "fileupload" || item.type === "imageupload";

              const onChange = (e) => {
                if (isFile) {
                  handleFileOnChange(e, index, item);
                } else {
                  handleInputOnChange(e, index, item);
                }
              };

              const otherProps = {};

              if (isFile) {
                otherProps.handleResetFile = () => handleResetFile(index, item);
              }

              return (
                <FieldElement
                  key={key}
                  field={item}
                  id={key}
                  index={index}
                  onChange={onChange}
                  {...otherProps}
                  editMode={editMode}
                  viewMode={viewMode}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomFieldsView;
