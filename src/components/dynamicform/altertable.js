import React, { useState, useEffect } from "react";
import axios from "axios";
import apiURL from "../../apiConfig";
import ReactModal from "react-modal";
import PrivateComponent from "../PrivateComponent";

function AlterTable({ onAddColumn }) {
  const [tableName, setTableName] = useState("");
  const [tableColumns, setTableColumns] = useState([]);
  const [formData, setFormData] = useState({});
  const [matchingTables, setMatchingTables] = useState([]);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [newColumnType, setNewColumnType] = useState("VARCHAR(250)");
  const [newColumnOptions, setNewColumnOptions] = useState([]);
  const [newColumnWidth, setNewColumnWidth] = useState("");
  const [isRequired, setIsRequired] = useState(false); // Step 1: State for checkbox
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modifiedColumnTitle, setModifiedColumnTitle] = useState("");
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [newColumnInputType, setNewColumnInputType] = useState("default");
  const [hiddenColumns, setHiddenColumns] = useState([]);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleRequiredCheckboxChange = (event) => {
    setIsRequired(event.target.checked);
  };

  const fetchTableStructure = async () => {
    try {
      const response = await axios.get(
        `${apiURL}/get_table_structure/${tableName}`
      );
      if (response.headers["content-type"].includes("application/json")) {
        setTableColumns(response.data.columns);
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Error fetching table structure:", error);
    }
  };

  const handleInputChange = (event, columnName) => {
    if (columnName === "width") {
      setNewColumnWidth(event.target.value);
    } else {
      setFormData({
        ...formData,
        [columnName]: event.target.value,
      });
    }
  };

  const handleFetchStructure = async (clickedTableName) => {
    try {
      setTableName(clickedTableName);
      const response = await axios.get(
        `${apiURL}/get_table_structure/${clickedTableName}`
      );
      if (response.headers["content-type"].includes("application/json")) {
        setTableColumns(response.data.columns);
        // Scroll to the table form heading
        const tableFormHeading = document.getElementById("tableFormHeading");
        if (tableFormHeading) {
          tableFormHeading.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Error fetching table structure:", error);
    }
  };

  const handleDeleteTable = async (tableName) => {
    // Display a confirmation dialog
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${tableName} table?`
    );

    if (confirmDelete) {
      try {
        await axios.delete(`${apiURL}/get_table_structure/${tableName}`);
        const updatedMatchingTables = matchingTables.filter(
          (table) => table !== tableName
        );
        setMatchingTables(updatedMatchingTables);
      } catch (error) {
        console.error("Error deleting table:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any required fields are empty
    const requiredColumns = tableColumns.filter((column) => column.required);
    const emptyRequiredColumns = requiredColumns.filter(
      (column) => !formData[column.name]
    );

    if (emptyRequiredColumns.length > 0) {
      // If any required fields are empty, display an error message or prevent form submission
      console.error("Required fields are empty:", emptyRequiredColumns);
      return;
    }

    // Proceed with form submission if all required fields are filled
    await fetchTableStructure();
  };

  const handleDropColumn = async (columnName) => {
    // Display a confirmation dialog
    const confirmDrop = window.confirm(
      "Are you sure you want to drop this column?"
    );

    if (confirmDrop) {
      try {
        await axios.patch(`${apiURL}/get_table_structure/${tableName}/`, {
          column_name: columnName,
        });
        const updatedColumns = tableColumns.filter(
          (column) => column.name !== columnName
        );
        setTableColumns(updatedColumns);
      } catch (error) {
        console.error("Error dropping column:", error);
      }
    }
  };

  const handleAddColumn = async () => {
    try {
      const min = 100;
      const max = 1000000;
      const randomNumber = Math.floor(Math.random() * (max - min) + min);
      const newColumnName = `col_${randomNumber}`;

      let columnOptions = undefined; // Initialize columnOptions variable
      let columnDataType = newColumnType; // Initialize columnDataType variable

      if (
        newColumnType === "DROPDOWN" ||
        newColumnType === "MULTIPLESELECT" ||
        newColumnType === "CHECKBOX"
      ) {
        // If column type requires options, convert comma-separated options to an array
        columnOptions = newColumnOptions
          .split(",")
          .map((option) => option.trim());
        columnDataType = "ENUM"; // Set column data type to ENUM
      }

      console.log("Received column data type:", newColumnType);
      console.log("Received input type:", newColumnInputType); // Log the newColumnInputType
      console.log("Generated column data type:", columnDataType);

      const response = await axios.put(
        `${apiURL}/get_table_structure/${tableName}/`,
        {
          column_name: newColumnName,
          data_type: columnDataType,
          enum_type: newColumnInputType, // Use newColumnInputType here
          nullable: !isRequired, // Invert isRequired to set nullable status
          name: newColumnTitle,
          options: columnOptions, // Pass the array directly
          width: newColumnWidth,
          required: isRequired,
        }
      );

      if (response.status === 200) {
        // Reset the state variables for the modal fields
        setNewColumnTitle("");
        setNewColumnType("VARCHAR(250)");
        setNewColumnOptions([]);
        setNewColumnWidth("");
        setIsRequired(false); // Reset checkbox state after adding column

        // Close the modal
        setIsModalOpen(false);

        // Fetch table structure
        await fetchTableStructure();

        console.log("Column added successfully");
      } else {
        console.error("Failed to add column:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding column:", error);
    }
  };

  const updateColumnTitle = (title, required) => {
    // return required ? `${title} *` : title;
    return title;
  };

  const handleCheckboxChange = (event, columnName) => {
    const checkedValue = event.target.checked;
    const optionValue = event.target.value;
    const currentFormData = { ...formData };

    if (!checkedValue) {
      // Remove the unchecked option from the form data
      currentFormData[columnName] = currentFormData[columnName].filter(
        (option) => option !== optionValue
      );
    } else {
      // Add the checked option to the form data
      currentFormData[columnName] = [
        ...(currentFormData[columnName] || []),
        optionValue,
      ];
    }

    // Update the form data state
    setFormData(currentFormData);
  };

  const handleTitleChange = (event) => {
    setNewColumnTitle(updateColumnTitle(event.target.value, isRequired));
  };

  const openTitleModal = (column) => {
    console.log("Selected column:", column);

    setSelectedColumn(column);
    setModifiedColumnTitle(column.column_fullname);
    setIsTitleModalOpen(true);
  };

  const closeTitleModal = () => {
    setIsTitleModalOpen(false);
  };

  const handleTitleInputChange = (event) => {
    setModifiedColumnTitle(event.target.value);
  };

  const submitModifiedTitle = async () => {
    try {
      console.log("Modified Column Title:", modifiedColumnTitle);
      const response = await axios.patch(
        `${apiURL}/get_table_structure/${tableName}/${selectedColumn.name}`,
        {
          new_title: modifiedColumnTitle, // Send the new_title field
        }
      );

      if (response.status === 200) {
        setIsTitleModalOpen(false);
        const updatedColumns = tableColumns.map((column) => {
          if (column.name === selectedColumn.name) {
            return { ...column, column_fullname: modifiedColumnTitle };
          }
          return column;
        });
        setTableColumns(updatedColumns); // Update the local state with modified column title
        console.log("Column title updated successfully");
      } else {
        console.error("Failed to update column title:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating column title:", error);
    }
  };

  const handleColumnTypeChange = (event) => {
    const selectedColumnType = event.target.value;
    setNewColumnType(selectedColumnType);

    // Automatically set input type based on column type
    switch (selectedColumnType) {
      case "VARCHAR(250)":
      case "TEXT":
      case "TEXTAREA":
      case "FILE":
      case "IMAGE":
        setNewColumnInputType("default");
        break;
      case "DECIMAL":
      case "INTEGER":
        setNewColumnInputType("number");
        break;
      case "BOOLEAN":
        setNewColumnInputType("boolean");
        break;
      case "TIMESTAMP":
        setNewColumnInputType("datetime-local");
        break;
      case "DROPDOWN":
        setNewColumnInputType("dropdown");
        break;
      case "MULTIPLESELECT":
        setNewColumnInputType("multiple_select");
        break;
      case "CHECKBOX":
        setNewColumnInputType("checkbox");
        break;
      case "ENUM":
        // If the column data type is ENUM, set the input type based on the received input type
        setNewColumnInputType(newColumnInputType); // Use the received input type
        break;
      default:
        setNewColumnInputType("default");
    }
  };

  const handleHideColumn = async (columnName) => {
    try {
      await axios.patch(`${apiURL}/hide_column/${tableName}/${columnName}/`, {
        hidden: true,
      });
      setHiddenColumns([...hiddenColumns, columnName]);
    } catch (error) {
      console.error("Error hiding column:", error);
    }
  };

  const handleUnhideColumn = async (columnName) => {
    try {
      await axios.patch(`${apiURL}/hide_column/${tableName}/${columnName}/`, {
        hidden: false,
      });
      setHiddenColumns(hiddenColumns.filter((name) => name !== columnName));
    } catch (error) {
      console.error("Error unhiding column:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiURL}/get_matching_tables/`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMatchingTables(data.matching_tables);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <form>
        <div className="p-4">
          <h1 className="text-3xl font-bold mb-6">
            Form Structure Modification Page
          </h1>
          <ul>
            {matchingTables.map((tableName, index) => {
              const cleanedTableName = tableName.replace("roots", "");

              return (
                <li
                  key={index}
                  className="flex items-center justify-between mb-4"
                >
                  <span className="text-lg mr-4">
                    {cleanedTableName.charAt(0).toUpperCase() +
                      cleanedTableName.slice(1)}
                  </span>
                  <div className="flex">
                    <PrivateComponent permission="edit_form_templates_for_my_program"><button
                      type="button"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 flex items-center"
                      onClick={() => handleFetchStructure(tableName)}
                    >
                      <svg
                        className="h-5 w-5 mr-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h5a2 2 0 002-2V7a1 1 0 10-2 0v8a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1h3a1 1 0 011 1v2a1 1 0 102 0V5a2 2 0 00-2-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Modify Form Structure
                    </button></PrivateComponent>
                    <PrivateComponent permission="delete_form_templates_for_my_program">  <button
                      type="button"
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
                      onClick={() => handleDeleteTable(tableName)}
                    >
                      <svg
                        className="h-5 w-5 mr-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 14.293a1 1 0 011.414 0L10 17.586l3.293-3.293a1 1 0 111.414 1.414L11.414 19A1 1 0 0110 19l-4.707-.707a1 1 0 01-.707-1.707L8.586 15l-3.293-3.293a1 1 0 010-1.414zm10.414-8.586a1 1 0 00-1.414 0L10 6.414 6.707 3.121a1 1 0 00-1.414 1.414L8.586 8 5.293 11.293a1 1 0 001.414 1.414L10 9.414l3.293 3.293a1 1 0 001.414-1.414L11.414 8l3.293-3.293a1 1 0 000-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Delete
                    </button></PrivateComponent>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </form>

      <div className="container mx-auto px-4">
        <hr className="my-6" style={{ borderTop: "1px solid #ccc" }} />
        <h2
          id="tableFormHeading"
          className="text-xl font-bold mb-4"
          style={{ color: "#333", borderBottom: "2px solid #333" }}
        >
          {tableName ? `Table Form - ${tableName}` : "Table Form"}
        </h2>

        {tableColumns.length > 0 && (
          <form onSubmit={handleSubmit} className="mt-6">
            {tableColumns.map((column, index) => (
              <div key={index} className="mb-4">
                <label className="block mb-1 text-gray-700">
                  {column.column_fullname}
                </label>
                {column.type === "TEXT" ? (
                  <textarea
                    value={formData[column.name] || ""}
                    onChange={(event) => handleInputChange(event, column.name)}
                    className={`border border-gray-300 rounded px-4 py-2 w-full ${
                      column.width || ""
                    } focus:outline-none focus:border-blue-500`}
                  />
                ) : column.type === "TEXTAREA" ? (
                  <textarea
                    value={formData[column.name] || ""}
                    onChange={(event) => handleInputChange(event, column.name)}
                    className={`border border-gray-300 rounded px-4 py-2 w-full ${
                      column.width || ""
                    } focus:outline-none focus:border-blue-500`}
                  />
                ) : column.type === "INTEGER" ? (
                  <input
                    type={column.type === "DECIMAL" ? "number" : "text"}
                    value={formData[column.name] || ""}
                    onChange={(event) => handleInputChange(event, column.name)}
                    className={`border border-gray-300 rounded px-4 py-2 w-full ${
                      column.width || ""
                    } focus:outline-none focus:border-blue-500`}
                  />
                ) : column.type === "DECIMAL" ? (
                  <input
                    type={column.type === "DECIMAL" ? "number" : "text"}
                    step="any" // Allow floating-point numbers
                    value={formData[column.name] || ""}
                    onChange={(event) => handleInputChange(event, column.name)}
                    className={`${column.width} border border-gray-300 rounded px-4 py-2`}
                  />
                ) : column.type === "BOOLEAN" ? (
                  <select
                    value={formData[column.name] || ""}
                    onChange={(event) => handleInputChange(event, column.name)}
                    className={`border border-gray-300 rounded px-4 py-2 w-full ${
                      column.width || ""
                    } focus:outline-none focus:border-blue-500`}
                  >
                    <option value="">Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                ) : column.type === "FILE" || column.type === "IMAGE" ? (
                  <input
                    type="file"
                    accept={column.type === "IMAGE" ? "image/*" : "*/*"}
                    onChange={(event) => handleInputChange(event, column.name)}
                    className={`border border-gray-300 rounded px-4 py-2 w-full ${
                      column.width || ""
                    } focus:outline-none focus:border-blue-500`}
                  />
                ) : column.type === "DATETIME" ? (
                  <input
                    type="datetime-local"
                    value={formData[column.name] || ""}
                    onChange={(event) => handleInputChange(event, column.name)}
                    className={`border border-gray-300 rounded px-4 py-2 w-full ${
                      column.width || ""
                    } focus:outline-none focus:border-blue-500`}
                  />
                ) : column.type === "DROPDOWN" ? (
                  <div className="mb-4">
                    <label className="block mb-1 text-gray-700">
                      Options (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newColumnOptions}
                      onChange={(e) => setNewColumnOptions(e.target.value)}
                      className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ) : column.type === "MULTIPLESELECT" ? (
                  <div className="mb-4">
                    <label className="block mb-1 text-gray-700">
                      Options (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newColumnOptions}
                      onChange={(e) => setNewColumnOptions(e.target.value)}
                      className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ) : column.enum_type === "CHECKBOX" ? (
                  <div className="mb-4">
                    <label className="block mb-1 text-gray-700">
                      {column.column_fullname}
                    </label>
                    {column.options.map((option, optionIndex) => (
                      <div key={optionIndex}>
                        <input
                          type="checkbox"
                          id={`${column.name}_${optionIndex}`}
                          value={option}
                          checked={
                            formData[column.name] &&
                            formData[column.name].includes(option)
                          }
                          onChange={(e) => handleCheckboxChange(e, column.name)}
                          className="mr-2"
                        />

                        <label htmlFor={`${column.name}_${optionIndex}`}>
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={formData[column.name] || ""}
                    onChange={(event) => handleInputChange(event, column.name)}
                    className={`border border-gray-300 rounded px-4 py-2 w-full ${
                      column.width || ""
                    } focus:outline-none focus:border-blue-500`}
                  />
                )}

                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={() => openTitleModal(column)} // Pass 'column' as argument
                >
                  Edit Title
                </button>

                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
                  onClick={() => handleDropColumn(column.name)}
                >
                  Drop Column
                </button>

                <button
                  type="button"
                  onClick={() =>
                    hiddenColumns.includes(column.name)
                      ? handleUnhideColumn(column.name)
                      : handleHideColumn(column.name)
                  }
                  style={{
                    backgroundColor: hiddenColumns.includes(column.name)
                      ? "orange"
                      : "green",
                    color: "white",
                    border: "none",
                    padding: "10px 15px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    margin: "5px",
                  }}
                >
                  {hiddenColumns.includes(column.name) ? "Unhide" : "Hide"}
                </button>
              </div>
            ))}

            <div className="mb-4">
              <label className="block mb-1 text-gray-700">
                New Column Type
              </label>
              <select
                value={newColumnType}
                onChange={handleColumnTypeChange} // Call handleColumnTypeChange when new column type changes
                className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
              >
                {/* <option value="VARCHAR(250)">Text</option> */}
                <option value="TEXT">Text</option>
                <option value="TEXTAREA">Text Area</option>
                <option value="DECIMAL">Decimal</option>
                <option value="INTEGER">Integer</option>
                <option value="BOOLEAN">Boolean</option>
                <option value="FILE">File</option>
                <option value="IMAGE">Image</option>
                <option value="TIMESTAMP">DateTime</option>
                <option value="DROPDOWN">Dropdown</option>
                <option value="MULTIPLESELECT">Multiple Select</option>
                <option value="CHECKBOX">Checkbox</option>
              </select>
            </div>

            {/* <div className="mb-4">
              <label className="block mb-1 text-gray-700">
                New Column Title
              </label>
              <input
                type="text"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700">Column Width</label>
              <select
                value={newColumnWidth}
                onChange={(event) => handleInputChange(event, "width")}
                className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
              >
                <option value="">Select</option>
                <option value="w-1/2">w-1/2</option>
                <option value="w-1/4">w-1/4</option>
                <option value="w-3/4">w-3/4</option>
                <option value="w-full">w-full</option>
              </select>
            </div>
            {(newColumnType === "DROPDOWN" ||
              newColumnType === "MULTIPLESELECT" ||
              newColumnType === "CHECKBOX") && (
              <div className="mb-4">
                <label className="block mb-1 text-gray-700">
                  Options (comma separated)
                </label>
                <input
                  type="text"
                  value={newColumnOptions.join(",")}
                  onChange={(e) =>
                    setNewColumnOptions(e.target.value.split(","))
                  }
                  className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block mb-1 text-gray-700">
                Required Column
                <input
                  type="checkbox"
                  checked={isRequired}
                  onChange={(e) => setIsRequired(e.target.checked)}
                  className="ml-2"
                />
              </label>
            </div> */}
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleModalOpen}
            >
              Add Column Details
            </button>
            <ReactModal
              isOpen={isModalOpen}
              onRequestClose={handleModalClose}
              contentLabel="Add New Column"
              className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50"
              overlayClassName="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50"
            >
              <div className="bg-white rounded-lg p-8 w-1/2">
                {/* Modal content */}
                <h2 className="text-xl font-bold mb-4">Add New Column</h2>
                <div className="mb-4">
                  <label className="block mb-1 text-gray-700">
                    New Column Title
                  </label>
                  <input
                    type="text"
                    value={newColumnTitle}
                    onChange={handleTitleChange}
                    className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                  />
                </div>
                {
                  // Check if the newColumnType is one of "DROPDOWN", "MULTIPLESELECT", or "CHECKBOX"
                  ["DROPDOWN", "MULTIPLESELECT", "CHECKBOX"].includes(
                    newColumnType
                  ) && (
                    // If it is, render the following JSX
                    <div className="mb-4">
                      <label className="block mb-1 text-gray-700">
                        Options (comma separated)
                      </label>
                      {/* Input field for entering options */}
                      <input
                        type="text"
                        value={newColumnOptions}
                        onChange={(e) => setNewColumnOptions(e.target.value)}
                        className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )
                }

                <div className="mb-4">
                  <label className="block mb-1 text-gray-700">
                    Column Width
                  </label>
                  <select
                    value={newColumnWidth}
                    onChange={(event) => handleInputChange(event, "width")}
                    className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="w-1/2">w-1/2</option>
                    <option value="w-1/4">w-1/4</option>
                    <option value="w-3/4">w-3/4</option>
                    <option value="w-full">w-full</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-gray-700">
                    Required Column
                    <input
                      type="checkbox"
                      checked={isRequired}
                      onChange={handleRequiredCheckboxChange}
                      className="ml-2"
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleAddColumn}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Column
                </button>
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
                >
                  Close
                </button>
              </div>
            </ReactModal>

            <ReactModal
              isOpen={isTitleModalOpen}
              onRequestClose={closeTitleModal}
              contentLabel="Modify Column Title"
              className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50"
              overlayClassName="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50"
            >
              <div className="bg-white rounded-lg p-8 w-1/3">
                <h2 className="text-xl font-bold mb-4">Modify Column Title</h2>
                <div className="mb-4">
                  <label className="block mb-1 text-gray-700">
                    New Column Title
                  </label>
                  <input
                    type="text"
                    value={modifiedColumnTitle}
                    onChange={handleTitleInputChange}
                    className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={submitModifiedTitle}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Update Title
                </button>
                <button
                  type="button"
                  onClick={closeTitleModal}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
                >
                  Close
                </button>
              </div>
            </ReactModal>

            {/* <button
              type="button"
              onClick={handleAddColumn}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
            
              Add Column
            </button> 
            <div> 
            */}
          </form>
        )}
      </div>
    </div>
  );
}

export default AlterTable;
