import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import apiURL from "../../../apiConfig";
import Swal from "sweetalert2";
import Select from "react-select";
import DateInput from "../FormElements/DateInput";
import InputElement from "../FormElements/InputElement";
import TextAreaElement from "../FormElements/TextAreaElement";
import CheckBoxElement from "../FormElements/CheckBoxElement";

export default function FormView() {
  const { tableName } = useParams();
  const [tableColumns, setTableColumns] = useState([]);
  const [formData, setFormData] = useState({});
  const [tableHeaders, setTableHeaders] = useState([]);
  const [droplist, setDroplist] = useState({});

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      const newDroplist = {};
      for (const column of tableColumns) {
        console.log(column.type);
        console.log("column.name", column.name);

        if (
          column.type === "USER-DEFINED" ||
          ((column.type === "USER-DEFINED" || column.type === "ARRAY") &&
            (column.name.endsWith("_multiple") ||
              column.name.endsWith("_checkbox")))
        ) {
          const enumType = `enum_type_${tableName}_${column.name}_enum_type`;

          try {
            const response = await axios.get(`${apiURL}/get_enum_labels/`, {
              params: {
                enum_type: enumType,
              },
            });
            const dropdownOptions = response.data.enum_labels;
            newDroplist[enumType] = dropdownOptions;
            console.log("Dropdown options for", enumType, ":", dropdownOptions);
          } catch (error) {
            console.error(
              "Error fetching dropdown options for",
              enumType,
              ":",
              error
            );
          }
        }
      }
      setDroplist(newDroplist);
      console.log("Droplist updated:", droplist);
    };

    fetchDropdownOptions();
  }, [tableName, tableColumns]);

  useEffect(() => {
    fetchTableHeaders();
  }, [tableName]);

  useEffect(() => {
    fetchTableStructure();
  }, []);

  // const handleDropdownOptionsFetch = async (enumType) => {
  //     try {
  //         const response = await axios.get(`${apiURL}/get_enum_labels/`, {
  //             params: {
  //                 enum_type: enumType
  //             }
  //         });
  //         const dropdownOptions = response.data.enum_labels;
  //         setDroplist(dropdownOptions);
  //         console.log('Dropdown options:', dropdownOptions);
  //     } catch (error) {
  //         console.error('Error fetching dropdown options:', error);
  //     }
  // };

  const fetchTableHeaders = async () => {
    try {
      const cleanedTableName = tableName.replace("roots", "");
      const response = await axios.get(
        `${apiURL}/insert_header_get/${tableName}/`
      );
      if (response.data.headers) {
        setTableHeaders(response.data.headers);
        console.log("headr", response.data.headers);
      } else {
        console.error("No headers found in response:", response);
      }
    } catch (error) {
      console.error("Error fetching table headers:", error);
    }
  };

  const fetchTableStructure = async () => {
    try {
      const response = await axios.get(
        `${apiURL}/get_table_structure/${tableName}`
      );
      if (response.headers["content-type"].includes("application/json")) {
        console.log("response.data.columns", response.data.columns);
        console.log("response.data", response.data);
        setTableColumns(response.data.columns);
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Error fetching table structure:", error);
    }
  };

  const handleInputChange = (event, columnName) => {
    const value =
      event.target.type === "file" ? event.target.files[0] : event.target.value;
    setFormData((prevState) => ({
      ...prevState,
      [columnName]: value,
    }));
  };

  const handleSubmitPost = async (event) => {
    event.preventDefault();
    try {
      console.log(formData);
      const response = await axios.post(
        `${apiURL}/get_table_structure/${tableName}/`,
        formData
      );

      if (response.status === 201) {
        console.log("Data inserted successfully");
        setFormData({});
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Data inserted successfully",
          timer: 2000,
        });
      } else {
        console.error("Error:", response.data.message);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to insert data. Please fill the required field properly.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "An unexpected error occurred. Please try again later.",
      });
    } // remove error here
  };

  const renderInputField = (column) => {
    let label = column.column_fullname;
    if (column.is_nullable === "NO") {
      label += " *";
    }

    switch (column.type) {
      case "character varying":
        return (
          <div key={column.name} className={`mb-4 ${column.width}`}>
            <label className="block mb-1">{label}</label>
            <InputElement
              type="text"
              value={formData[column.name] || ""}
              onChange={(event) => handleInputChange(event, column.name)}
              className={`border border-gray-300 rounded px-4 py-2`}
            />
          </div>
        );
      case "integer":
        return (
          <div key={column.name} className={`mb-4 ${column.width}`}>
            <label className="block mb-1">{label}</label>
            <InputElement
              type="number"
              value={formData[column.name] || ""}
              onChange={(event) => handleInputChange(event, column.name)}
              className={`border border-gray-300 rounded px-4 py-2`}
            />
          </div>
        );

      case "text":
        return (
          <div key={column.name} className={`mb-4 ${column.width}`}>
            <label className="block mb-1">{label}</label>
            <TextAreaElement
              value={formData[column.name] || ""}
              onChange={(event) => handleInputChange(event, column.name)}
              className={`border border-gray-300 rounded px-4 py-2`}
            />
          </div>
        );
      case "double precision":
        return (
          <div key={column.name} className={`mb-4 ${column.width}`}>
            <label className="block mb-1">{label}</label>
            <InputElement
              type="number" // Use type "number" for input validation
              step="any" // Allow floating-point numbers
              value={formData[column.name] || ""}
              onChange={(event) => handleInputChange(event, column.name)}
              className={`border border-gray-300 rounded px-4 py-2`}
            />
          </div>
        );
      case "boolean":
        return (
          <div key={column.name} className={`mb-4 ${column.width}`}>
            <label className="block mb-1">{label}</label>
            <select
              value={formData[column.name] || ""}
              onChange={(event) => handleInputChange(event, column.name)}
              className={`border border-gray-300 rounded px-4 py-2`}
            >
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        );
      case "bytea":
        return (
          <div key={column.name} className={`mb-4 ${column.width}`}>
            <label className="block mb-1">{label}</label>
            <InputElement
              type="file"
              accept=".png, .jpg, .jpeg, .pdf"
              onChange={(event) => handleInputChange(event, column.name)}
              className={`border border-gray-300 rounded px-4 py-2`}
            />
          </div>
        );

      case "timestamp without time zone":
        return (
          <div key={column.name} className={`mb-4 ${column.width}`}>
            <label className="block mb-1">{label}</label>
            <DateInput
              type="date"
              value={formData[column.name] || ""}
              onChange={(event) => handleInputChange(event, column.name)}
              className={`border border-gray-300 rounded px-4 py-2`}
              width={column.width}
            />
          </div>
        );
      default:
        console.log(column.type);

        // console.log(column.type)

        // const dropdownOptions1=[1,2,3]

        const key = `enum_type_${tableName}_${column.name}_enum_type`;

        console.log(key);

        // console.log("keykey",key)

        if (key.endsWith("multiple_enum_type")) {
          console.log("qdwewwwwwwwwwwwwwww", droplist, droplist[key]);
          return (
            <div key={column.name} className={`mb-4 ${column.width}`}>
              <label className="block mb-1">{label}</label>
              <Select
                options={
                  droplist[key] &&
                  droplist[key].map((option) => ({
                    value: option,
                    label: option,
                  }))
                }
                isMulti
                value={
                  formData[column.name]
                    ? formData[column.name].map((option) => ({
                        value: option,
                        label: option,
                      }))
                    : []
                }
                onChange={(selectedOptions) => {
                  const selectedValues = selectedOptions
                    ? selectedOptions.map((option) => option.value.toString())
                    : [];
                  console.log(
                    column.name,
                    selectedValues,
                    "ssssssssssssssssssssssssssss"
                  );
                  setFormData((prevState) => ({
                    ...prevState,
                    [column.name]: selectedValues,
                  }));
                  console.log(
                    column.name,
                    selectedValues,
                    "ssssssssssssssssssssssssssss"
                  );
                }}
                className={`${column.width} border border-gray-300 rounded px-4 py-2`}
                placeholder="Select"
              />
            </div>
          );
        }

        // else if (key.endsWith("checkbox_enum_type")){
        //     console.log('checkbox_enum_type okkk')
        //     // console.log(droplist[key])
        //     return (
        //         <div key={column.name} className="mb-4">
        //             <label className="block mb-1">{label}</label>
        //             <Select

        //                 options={droplist[key] && droplist[key].map(option => ({ value: option, label: option }))}
        //                 isMulti
        //                 value={formData[column.name] ? formData[column.name].map(option => ({ value: option, label: option })) : []}
        //                 onChange={(selectedOptions) => {
        //                     const selectedValues = selectedOptions ? selectedOptions.map(option => option.value.toString()) : [];
        //                     console.log(column.name,selectedValues,'ssssssssssssssssssssssssssss')
        //                     setFormData(prevState => ({
        //                         ...prevState,
        //                         [column.name]: selectedValues
        //                     }));
        //                     console.log(column.name,selectedValues,'ssssssssssssssssssssssssssss')
        //                 }}
        //                 className={`${column.width} border border-gray-300 rounded px-4 py-2`}
        //                 placeholder="Select"
        //             />

        //         </div>
        //     );

        // }
        else if (key.endsWith("checkbox_enum_type")) {
          console.log("checkbox_enum_type okkk");
          // console.log(droplist[key])
          return (
            <div
              key={column.name}
              className={`mb-4 flex flex-column gap-2  ${column.width}`}
            >
              <label className="block mb-1">{label}</label>
              {droplist[key] &&
                droplist[key].map((option) => (
                  <div key={option} className="flex gap-2">
                    <input
                      type="checkbox"
                      id={option}
                      value={option}
                      checked={
                        formData[column.name] &&
                        formData[column.name].includes(option)
                      }
                      onChange={(event) => {
                        const value = event.target.value;
                        setFormData((prevState) => ({
                          ...prevState,
                          [column.name]: prevState[column.name]
                            ? prevState[column.name].includes(value)
                              ? prevState[column.name].filter(
                                  (val) => val !== value
                                )
                              : [...prevState[column.name], value]
                            : [value],
                        }));
                      }}
                    />
                    <label htmlFor={option}>{option}</label>
                  </div>
                ))}
            </div>
          );
        } else {
          console.log("test");
          console.log("droplist", droplist);

          return (
            <div key={column.name} className={`mb-4 ${column.width}`}>
              <label className="block mb-1">{label}</label>
              <select
                value={formData[column.name] || ""}
                onChange={(event) => handleInputChange(event, column.name)}
                className={`${column.width} border border-gray-300 rounded px-4 py-2`}
              >
                <option value="">Select</option>
                {droplist[key] &&
                  droplist[key].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
            </div>
          );
        }
    }
  };

  return (
    <div className="container mt-3">
      <div
        className="card p-4 shadow "
        style={{ width: "70%", margin: "auto", backgroundColor: "#f6f6f6" }}
      >
        <div className="card mb-3">
          {/* <img className="card-img-top" style={{ hight: '300px'}} src={Screenshot} alt="Card image cap" /> */}

          <div>
            <ul className="grid grid-cols-1 gap-4">
              {tableHeaders.map((header, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-xl font-semibold mb-2">{header[2]}</h1>
                  <h3 className="text-base font-medium text-gray-700">
                    {header[3]}
                  </h3>
                </div>
              ))}
            </ul>
          </div>
        </div>
        {/* <h2 className="text-2xl font-bold mb-4">Form Name - {tableName}</h2> */}
        {tableColumns.length > 0 && (
          <form onSubmit={handleSubmitPost}>
            {tableColumns.map((column) => {
              return renderInputField(column);
            })}
            <div className="text-center mt-6">
              <button
                type="submit"
                className="bg-Teal-500 hover:bg-Teal-700 text-block font-bold py-2 px-4 rounded mb-4 mr-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-Teal-500"
                style={{ borderRadius: "3px", background: "#9CDADA" }}
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
