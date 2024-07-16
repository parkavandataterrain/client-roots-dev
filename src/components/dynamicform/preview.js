import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import DateInput from "./FormElements/DateInput";
import Select from "react-select";

function Preview({
  items,
  title,
  additionalDetails,
  showModal,
  labelTitleList,
  widthList,
  checkboxList,
  columnTypeList,
  enumList,
  tableName,
}) {
  const [tableColumns, setTableColumns] = useState([]);

  const handleClick = async () => {
    const undefinedIndices = [];
    labelTitleList.forEach((element, index) => {
      if (typeof element === undefined || element === "") {
        undefinedIndices.push(index);
      }
    });

    if (undefinedIndices.length > 0) {
      // alert(`Undefined values found at indices: ${undefinedIndices.join(', ')}`);
      // return ;
    }

    const columns = labelTitleList.map((label, index) => ({
      name: labelTitleList[index],
      type: columnTypeList[index],
      notNull: checkboxList[index],
      width: widthList[index],
      enum: enumList[index] ? enumList[index] : [],
    }));

    setTableColumns(columns);
  };

  useEffect(() => {
    handleClick();
  }, [labelTitleList, columnTypeList, checkboxList, widthList, enumList]);

  const renderInputField = (column) => {
    console.log(column);

    let asteriskClass = "";

    console.log("checkboxList", checkboxList);
    let label = column.name;
    console.log("test", column.notNull);

    if (column.notNull === true) {
      label += " *";
      asteriskClass = "red-asterisk";
    }

    switch (column.type) {
      case "VARCHAR(250)":
        return (
          <div key={column.name} className="mb-4">
            <label className="block mb-1">{label}</label>
            <input
              type="text"
              className={`${column.width} border border-gray-300 rounded px-4 py-2`}
            />
          </div>
        );

      case "INTEGER":
        return (
          <div key={column.name} className="mb-4">
            <label className="block mb-1">{label}</label>
            <input
              type="number"
              className={`${column.width} border border-gray-300 rounded px-4 py-2`}
            />
          </div>
        );

      case "TEXT":
        return (
          <div key={column.name} className="mb-4">
            <label className="block mb-1">{label}</label>
            <textarea
              className={`${column.width} border border-gray-300 rounded px-4 py-2`}
            />
          </div>
        );
      case "FLOAT":
        return (
          <div key={column.name} className="mb-4">
            <label className="block mb-1">{label}</label>
            <input
              type="number" // Use type "number" for input validation
              step="any" // Allow floating-point numbers
              className={`${column.width} border border-gray-300 rounded px-4 py-2`}
            />
          </div>
        );
      case "BOOLEAN":
        return (
          <div key={column.name} className="mb-4">
            <label className="block mb-1">{label}</label>
            <select
              className={`${column.width} border border-gray-300 rounded px-4 py-2`}
            >
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        );
      case "BYTEA":
        return (
          <div key={column.name} className="mb-4">
            <label className="block mb-1">{label}</label>
            <input
              type="file"
              accept=".png, .jpg, .jpeg, .pdf"
              className={`${column.width} border border-gray-300 rounded px-4 py-2`}
            />
          </div>
        );

      case "TIMESTAMP":
        return (
          <div key={column.name} className="mb-4">
            <label className="block mb-1">{label}</label>
            <DateInput
              type="date"
              className={`${column.width} border border-gray-300 rounded px-4 py-2`}
              stateless
            />
          </div>
        );

      case "my_enum_type":
        let options = column.enum.length > 0 ? column.enum.split(",") : [];

        return (
          <div key={column.name} className="mb-4">
            <label className="block mb-1">{label}</label>
            <select
              // value={column.name || ''}
              // onChange={(event) => handleInputChange(event, column.name)}
              className={`${column.width} border border-gray-300 rounded px-4 py-2`}
            >
              <option value="">Select</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      case "my_enum_typeb":
        let my_enum_typeb_options =
          column.enum.length > 0 ? column.enum.split(",") : [];

        return (
          <div key={column.name} className="mb-4">
            <label className="block mb-1">{label}</label>
            <Select
              options={my_enum_typeb_options.map((option) => ({
                value: option,
                label: option,
              }))}
              isMulti
              className={`${column.width} border border-gray-300 rounded px-4 py-2`}
              placeholder="Select"
            />
          </div>
        );
      case "checkbox":
        let checkbox_options =
          column.enum.length > 0 ? column.enum.split(",") : [];

        return (
          <div key={column.name} className="mb-4">
            <label className="block mb-1">{label}</label>
            {checkbox_options.map((option) => (
              <div key={option}>
                <input type="checkbox" id={option} value={option} />
                <label htmlFor={option}>{option}</label>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div key={column.name} className="mb-4">
            <label className="block mb-1">{label}</label>
            <input
              type="text"
              // value={formData[column.name] || ''}
              // onChange={(event) => handleInputChange(event, column.name)}
              className={`${column.width} border border-gray-300 rounded px-4 py-2`}
            />
          </div>
        );
    }
  };

  return (
    <div className="container mt-3">
      <div
        className="card p-4 shadow "
        style={{ width: "70%", margin: "auto", backgroundColor: "#f6f6f6" }}
      >
        <div className="card mb-3">
          <div>
            <ul className="grid grid-cols-1 gap-4">
              <motion.li
                key={0}
                className="p-4 bg-white rounded-lg shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-xl font-semibold mb-2"> {title}</h1>
                <h3 className="text-base font-medium text-gray-700">
                  {additionalDetails}
                </h3>
              </motion.li>
            </ul>
          </div>
        </div>

        <div>
          {tableColumns.length > 0 && (
            <form>
              {tableColumns.map((column) => renderInputField(column))}
              <div className="text-center mt-6">
                <button
                  disabled
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
    </div>
  );
}

export default Preview;
