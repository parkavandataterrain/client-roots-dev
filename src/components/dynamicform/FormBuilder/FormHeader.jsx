import React from "react";
import { Link } from "react-router-dom";
import { useFormBuilderContext } from "./Context/FormBuilderContext";
import PrivateComponent from "../../PrivateComponent";

function FormHeader() {
  const {
    formDetail,
    formDetailErrors,
    showPreview,
    togglePreview,
    handleTitle,
    handleDesc,
  } = useFormBuilderContext();

  return (
    <>
      <div className="row my-4">
        <div className="col-12">
          <div
            className="navbar navbar-light bg-light justify-between items-center px-2"
            style={{
              borderRadius: "5px 5px 0px 0px",
              border: "1px solid #5BC4BF",
              background: "#F6F6F6",
            }}
          >
            <button
              className="bg-[#5BC4BF] text-white hover:bg-teal-700 font-medium  p-3 px-4 rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500  text-sm"
              onClick={togglePreview}
            >
              Toggle Preview
            </button>
            <div className="flex gap-2 items-center">
              <PrivateComponent permission="view_form_templates_for_my_program">
                <Link
                  to="/createtableform"
                  className="bg-[#5BC4BF] text-white hover:bg-teal-700 font-medium p-3 px-4 m-0 rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  Available Forms
                </Link>
              </PrivateComponent>
              <Link
                to="/alterTable"
                className="bg-[#5BC4BF] text-white hover:bg-teal-700 font-medium p-3 px-4 m-0 rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500  text-sm"
              >
                Alter Available Forms
              </Link>
            </div>
          </div>
        </div>
      </div>
      {!showPreview && (
        <PrivateComponent permission="create_form_templates_for_my_program">
          <div className="row">
            <form role="form" className="w-100">
              <div className="form-group">
                <input
                  className={`form-control ${
                    formDetailErrors.title
                      ? "border-[1px] border-red-500"
                      : "border border-gray-300"
                  } rounded px-4 mt-2 py-2 focus:outline-none focus:border-green-500 transition-colors duration-300`}
                  type="text"
                  name="name"
                  placeholder="Title"
                  value={formDetail.title}
                  onChange={(e) => handleTitle(e.target.value)}
                  style={{
                    marginBottom: formDetailErrors.title ? "2px" : "10px",
                  }}
                />
                {formDetailErrors.title && (
                  <label
                    className="ms-1 text-xs text-red-500"
                    style={{ marginBottom: "10px" }}
                  >
                    Please fill the form title
                  </label>
                )}
              </div>
              <div className="form-group">
                <textarea
                  className={`form-control ${
                    formDetailErrors.description
                      ? "border-[1px] border-red-500"
                      : "border border-gray-300"
                  } rounded px-4 mt-2 py-2 focus:outline-none focus:border-green-500 transition-colors duration-300`}
                  type="text"
                  name="desc"
                  placeholder="Additional details here"
                  value={formDetail.description}
                  onChange={(e) => handleDesc(e.target.value)}
                  style={{
                    marginBottom: formDetailErrors.description ? "2px" : "10px",
                  }}
                />
                {formDetailErrors.description && (
                  <label
                    className="ms-1 text-xs text-red-500"
                    style={{ marginBottom: "10px" }}
                  >
                    Please fill the form description
                  </label>
                )}
              </div>
            </form>
          </div>
        </PrivateComponent>
      )}
    </>
  );
}

export default FormHeader;
