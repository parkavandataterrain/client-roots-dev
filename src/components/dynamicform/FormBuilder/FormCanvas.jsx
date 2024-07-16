import React, { useState } from "react";
import FieldElement from "./FieldElement";

// DnD Kit
import { useDroppable } from "@dnd-kit/core";
import { useFormBuilderContext } from "./Context/FormBuilderContext";

import DraggableIcon from "../../images/form_builder/draggable.svg";

import { useNavigate } from "react-router-dom";

import axios from "axios";
import apiURL from "../../../apiConfig";

import Swal from "sweetalert2";
import { notifyError, notifyWarn } from "../../../helper/toastNotication";

function FormCanvas() {
  const { setNodeRef } = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true,
    },
  });

  const {
    elements: items,
    togglePreview,
    showPreview,
    formDetail,
    formDetailErrors,
    handleFormDetailErrors,
    resetFormDetailErrors,
    handleFormName,
    resetElements,
  } = useFormBuilderContext();

  const [errosDetail, setErrorDetail] = useState({});

  const navigate = useNavigate();

  function transformArrayToString(array) {
    if (array.length === 0) {
      return "";
    } else if (array.length === 1) {
      return array[0];
    } else {
      return array.slice(0, -1).join(", ") + " and " + array[array.length - 1];
    }
  }

  const handleFormNameValidation = (e) => {
    const value = e.target.value;

    const hasSpecialCharacters = /[^\w\s]/.test(value);

    if (hasSpecialCharacters) {
      alert("Please remove special characters from the input.");
      return;
    }

    const sanitizedValue = value.includes(" ")
      ? value.replace(/\s/g, "_")
      : value;
    handleFormName(sanitizedValue);
  };

  function checkHasOnlyNonFields(jsonArray) {
    const allowedTypes = ["CHAR(250)", "JSON", "LINE"];
    for (let obj of jsonArray) {
      if (!allowedTypes.includes(obj.type)) {
        return false;
      }
    }
    notifyWarn("Add any valid fields to create a form");
    return true;
  }

  function checkHasMetaData(formDetail) {
    resetFormDetailErrors();
    if (
      formDetail.title === "" &&
      formDetail.description === "" &&
      formDetail.formName === ""
    ) {
      handleFormDetailErrors("title", true);
      handleFormDetailErrors("description", true);
      handleFormDetailErrors("formName", true);
    }

    if (formDetail.title === "") {
      handleFormDetailErrors("title", true);
    }

    if (formDetail.description === "") {
      handleFormDetailErrors("description", true);
    }

    if (formDetail.formName === "") {
      handleFormDetailErrors("formName", true);
    }

    let isError =
      formDetailErrors.formName === false ||
      formDetailErrors.title === false ||
      formDetailErrors.description === false;

    // {"message":"relation \"rootstest1\" already exists\n"} 400 stats

    if (isError) {
      return false;
    } else {
      return true;
    }
  }

  function toast(msg, type) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton:
          "bg-[#5BC4BF] text-white hover:bg-teal-700 font-bold mt-2.5 p-2 px-4 rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500  text-xs",
        // cancelButton: "btn btn-danger"
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      ...msg,
      icon: type,
    });
  }

  const validation = () => {
    let hasOnlyNonFields = checkHasOnlyNonFields(items);
    let hasValidMetaData = checkHasMetaData(formDetail);
    console.log({ hasOnlyNonFields, hasValidMetaData });
    if (hasOnlyNonFields) {
      return false;
    }
    if (!hasValidMetaData) {
      return false;
    }
    return true;
  };

  const postHeader = async () => {
    try {
      const response = await axios.post(
        `${apiURL}/insert_header/${formDetail.formName}/`,
        {
          tablename: formDetail.formName,
          header_name: formDetail.title,
          sub_header_name: formDetail.description,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async () => {
    console.log("handleSub");
    try {
      if (validation()) {
        const undefinedLabels = [];
        console.log("handleSub valid");

        items.map((item, index) => {
          if (item.props.label === "") {
            undefinedLabels.push(index);
          }
        });

        console.log({ undefinedLabels });

        if (undefinedLabels.length > 0) {
          alert("Please fill lables of all fields");
        } else {
          const columns = items.map((item) => {
            let type = item.type;
            let enumOpt = item.props.options
              ? item.props.options.join(",")
              : [];

            if (item.type === "BYTEA2") {
              type = "BYTEA";
            }

            if (item.type === "BOOLEAN") {
              enumOpt = [];
            }

            return {
              name: item.props.label,
              type: type,
              notNull: item.props.required,
              width: item.props.width || "w-full",
              enum: enumOpt,
            };
          });

          const response = await axios.post(
            `${apiURL}/create_table_endpoint/`,
            {
              table_name: "Roots" + formDetail.formName,
              columns: columns,
            }
          );

          await postHeader();

          navigate("/createtableform");
        }
      }
    } catch (error) {
      console.error("Error:", { error });
      // console.error("Error:", error.response.data.message);

      if (error.response.status === 400) {
        notifyError(
          error.response.data.message ||
            "Network Error ! Please try again later"
        );
      } else {
        notifyError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="flex flex-column border-2 border[#858585] h-100">
      <div className="w-100 bg-[#ECECEC]">
        <div className="row p-4">
          <div className="col-sm-12 p-2">
            <label
              htmlFor="tableName"
              className="text-xs font-medium text-gray-500"
            >
              Form name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              id="tableName"
              value={formDetail.formName}
              placeholder="Enter Form name..."
              onChange={handleFormNameValidation}
              className={`${
                formDetailErrors.formName
                  ? "border-[1px] border-red-500"
                  : "border border-gray-300"
              } rounded px-4 mt-2 py-2 w-100 focus:outline-none focus:border-green-500 transition-colors duration-300`}
            />
            {formDetailErrors.formName && (
              <label className="ms-1 text-xs text-red-500">
                Please fill the form name
              </label>
            )}
          </div>
          <div className="hidden col-sm-5 p-2">
            <label
              htmlFor="tableName"
              className="text-xs font-medium text-gray-500"
            >
              Number of columns
            </label>

            <input
              // id="tableName"
              // value={tableName}
              value={0}
              type="number"
              placeholder="Select Columns"
              // onChange={handleTableNameChange}
              className="border border-gray-300 rounded px-4 mt-2 py-2 w-100 focus:outline-none focus:border-green-500 transition-colors duration-300"
            />
          </div>
        </div>
      </div>
      <div
        className={`flex flex-column justify-between ${
          items.length === 0 ? "h-100" : ""
        }`}
        style={{
          maxHeight: "623px",
        }}
      >
        <div
          ref={setNodeRef}
          className={`p-3 ${items.length === 0 ? "h-100" : "pb-5"}`}
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
              <img
                src={DraggableIcon}
                alt="empty-dropzone"
                width={"65px"}
                height={"100%"}
              />
              <p className="text-md text-bold m-0">Select an element to add</p>
              <p className="text-xs text-gray-300 m-0">Nothing to select</p>
            </div>
          ) : (
            items.map((item, index) => {
              const key = `${item.type}_${index}`;
              return (
                <FieldElement key={key} field={item} id={key} index={index} />
              );
            })
          )}
        </div>
        {items.length > 0 && (
          <div className="flex justify-center items-center gap-2 p-4">
            {/* Action Buttons */}
            <>
              <button
                onClick={resetElements}
                className="bg-[#FFEE99] text-[#1A1F25] hover:bg-amber-300 font-bold mt-2.5 p-2 px-4 rounded  transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500  text-xs"
              >
                Reset
              </button>{" "}
              <button
                onClick={togglePreview}
                className="bg-[#F19F35] text-white hover:bg-amber-700 font-bold mt-2.5 p-2 px-4 rounded  transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500  text-xs"
              >
                Preview
              </button>
              <button
                onClick={handleSubmit}
                className="bg-[#5BC4BF] text-white hover:bg-teal-700 font-bold mt-2.5 p-2 px-4 rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500  text-xs"
              >
                Save
              </button>
            </>
          </div>
        )}
      </div>
    </div>
  );
}

export default FormCanvas;
