import React, { useState, useMemo, useEffect } from "react";
import "./create.css";
import { Modal, Button } from "react-bootstrap";

import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import Preview from "./preview";
import apiURL from "../../apiConfig";

import edit from "../../image/edit.jpg";
import bulk from "../../image/bulk.jpg";
import share from "../../image/share.jpg";
import down from "../../image/down.png";
import file from "../../image/file.jpg";
import date from "../../image/date.png";

import Attachments_Icon from "../images/form_builder/attachments.svg";
import Image_upload_Icon from "../images/form_builder/image_upload.svg";
import Drop_down_Icon from "../images/form_builder/drop_down.svg";
import Check_box_Icon from "../images/form_builder/check_box.svg";
import Date_Icon from "../images/form_builder/date.svg";
import Time_Icon from "../images/form_builder/time.svg";
import Date_and_time_Icon from "../images/form_builder/date_and_time.svg";
import Number_Icon from "../images/form_builder/number.svg";
import Single_line_text_Icon from "../images/form_builder/single_line_text.svg";
import Text_area_Icon from "../images/form_builder/text_area.svg";
import Radio_button_Icon from "../images/form_builder/radio_button.svg";
import DraggableIcon from "../images/form_builder/draggable.svg";
import TrashIcon from "../images/form_builder/trash.svg";
import SwitchIcon from "../images/form_builder/switch.svg";

import GearIcon from "../images/form_builder/gears.svg";

import DeleteIcon from "../images/delete.png";
import DateInput from "./FormElements/DateInput";

import FormBuilder from "./FormBuilder";

export default function DragDropDemo() {
  const [showPreview, setShowPreview] = useState(false);

  const [items, setItems] = useState([]);
  console.log({ items });
  const [title, setTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [additionalDetails, setAdditionalDetails] = useState("");

  const [showModal, setShowModal] = useState({});

  const [labelTitleList, setLabelTitleList] = useState([]);
  const [widthList, setWidthList] = useState([]);
  const [checkboxList, setCheckboxList] = useState([]);
  const [columnTypeList, setColumnTypeList] = useState([]);
  const [enumList, setEnumList] = useState([]);
  const [tableName, setTableName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const undefinedIndices = [];

      console.log("labelTitleList", labelTitleList);

      labelTitleList.forEach((element, index) => {
        if (typeof element === undefined || element === "") {
          undefinedIndices.push(index);
        }
      });

      if (undefinedIndices.length > 0) {
        alert(
          `Undefined values found at indices: ${undefinedIndices.join(", ")}`
        );
        return;
      }

      const columns = labelTitleList.map((label, index) => ({
        name: labelTitleList[index],
        type: columnTypeList[index],
        notNull: checkboxList[index],
        width: widthList[index],
        enum: enumList[index] ? enumList[index] : [],
      }));

      console.log("..................", columns);

      const response = await axios.post(`${apiURL}/create_table_endpoint/`, {
        table_name: "Roots" + tableName,
        columns: columns,
      });

      await insertHeader();

      console.log(response.data);
      navigate("/createtableform");
    } catch (error) {
      console.error("Error:", { error });
      // console.error("Error:", error.response.data.message);
      window.alert("An error occurred. Please try again later.");
    }
  };

  const handleOpenModal = (index) => {
    setShowModal((prevState) => ({ ...prevState, [index]: true }));
  };

  const handleCloseModal = (index) => {
    setShowModal((prevState) => ({ ...prevState, [index]: false }));
  };

  function handleDragStart(e, dataObj) {
    try {
      console.log({ dataObj });
      let stringifiedData = JSON.stringify(dataObj);
      console.log({ stringifiedData });
      e.dataTransfer.setData("text/plain", stringifiedData);
    } catch (e) {
      console.log({ e });
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const eleDataString = e.dataTransfer.getData("text/plain");
    const parsedData = JSON.parse(eleDataString);
    const newItem = {
      type: parsedData.type,
      elementData: parsedData,
    };

    console.log({ eleDataString, newItem });
    setItems((prevItems) => [...prevItems, newItem]);
  }

  function handleRemove(index) {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
    setLabelTitleList((prevTitles) => prevTitles.filter((_, i) => i !== index));
    setWidthList((prevWidths) => prevWidths.filter((_, i) => i !== index));
    setCheckboxList((prevCheckboxes) =>
      prevCheckboxes.filter((_, i) => i !== index)
    );
    setColumnTypeList((prevTypes) => prevTypes.filter((_, i) => i !== index));
  }

  const handleTitleChange = (index, value) => {
    const updatedTitles = [...labelTitleList];
    console.log(index + " has " + value);
    updatedTitles[index] = value;
    setLabelTitleList(updatedTitles);
  };

  const handleWidthChange = (index, value) => {
    const updatedWidths = [...widthList];
    updatedWidths[index] = value;
    setWidthList(updatedWidths);
  };

  const handleCheckboxChange = (index, value) => {
    const updatedCheckboxes = [...checkboxList];
    updatedCheckboxes[index] = value;
    setCheckboxList(updatedCheckboxes);
  };

  const handleColumnTypeChange = (index, value) => {
    const updatedColumnTypes = [...columnTypeList];
    updatedColumnTypes[index] = value;
    setColumnTypeList(updatedColumnTypes);
  };

  const handleEnumChange = (index, enumValues) => {
    console.log("Index: " + index + ", enum values " + enumValues);
    const updatedEnums = [...enumList];
    updatedEnums[index] = enumValues;
    setEnumList(updatedEnums);
  };

  // console.log(labelTitleList);
  // console.log(widthList);
  // console.log(checkboxList);
  // console.log(columnTypeList);
  // console.log(enumList);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const insertHeader = async () => {
    try {
      console.log(
        "checking................",
        tableName,
        title,
        additionalDetails
      );
      console.log(tableName);
      const response = await axios.post(
        `${apiURL}/insert_header/${tableName}/`,
        {
          tablename: tableName,
          header_name: title,
          sub_header_name: additionalDetails,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const handleTableNameChange = (e) => {
    const value = e.target.value;

    const hasSpecialCharacters = /[^\w\s]/.test(value);

    if (hasSpecialCharacters) {
      alert("Please remove special characters from the input.");
      return;
    }

    const sanitizedValue = value.includes(" ")
      ? value.replace(/\s/g, "_")
      : value;
    setTableName(sanitizedValue);
  };

  // Define your element groups and their corresponding elements
  const elementGroups = [
    {
      name: "Text Elements",
      elements: [
        { type: "VARCHAR(250)", label: "Text", IconSrc: Single_line_text_Icon },
        { type: "TEXT", label: "TextArea", IconSrc: Text_area_Icon },
        { type: "INTEGER", label: "Number", IconSrc: Number_Icon },
        { type: "FLOAT", label: "Decimal", IconSrc: Number_Icon },
      ],
    },
    {
      name: "Date Elements",
      elements: [
        {
          type: "TIMESTAMP",
          label: "Date and Time",
          IconSrc: Date_and_time_Icon,
        },
      ],
    },
    {
      name: "Multi Elements",
      elements: [
        { type: "my_enum_type", label: "Dropdown", IconSrc: Drop_down_Icon },
        { type: "BOOLEAN", label: "Yes/No", IconSrc: SwitchIcon },
        {
          type: "my_enum_typeb",
          label: "Multiple Select",
          IconSrc: Drop_down_Icon,
        },
        { type: "checkbox", label: "Checkbox", IconSrc: Check_box_Icon },
      ],
    },

    {
      name: "Media Elements",
      elements: [
        { type: "BYTEA", label: "Image Upload", IconSrc: Image_upload_Icon },
        { type: "BYTEA", label: "File Upload", IconSrc: Attachments_Icon },
      ],
    },
  ];

  const filteredElementGroups = useMemo(() => {
    let searchQueryLower = searchQuery.toLocaleLowerCase();

    return elementGroups.map((eachGroup) => {
      return {
        ...eachGroup,
        elements: eachGroup.elements.filter((eachElement) => {
          return eachElement.label
            .toLocaleLowerCase()
            .includes(searchQueryLower);
        }),
      };
    });
  }, [searchQuery]);

  return (
    <div className="container">
      <div className="row my-4">
        <div
          className="col-12"
          style={{
            borderRadius: "5px 5px 0px 0px",
            border: "1px solid #5BC4BF",
            background: "#F6F6F6",
          }}
        >
          <nav className="navbar navbar-light bg-light justify-content-between">
            <a>
              <button
                className="bg-[#5BC4BF] text-white hover:bg-teal-700 font-medium  p-3 px-4 rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500  text-sm"
                onClick={togglePreview}
              >
                Toggle Preview
              </button>
            </a>
            <form className="form-inline">
              <a>
                <Link
                  to="/createtableform"
                  className="bg-[#5BC4BF] text-white hover:bg-teal-700 font-medium p-3 px-4 m-1 rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  Available Forms
                </Link>
              </a>
              <Link
                to="/alterTable"
                className="bg-[#5BC4BF] text-white hover:bg-teal-700 font-medium p-3 px-4 m-1 rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500  text-sm"
              >
                Alter Available Forms
              </Link>
            </form>
          </nav>
        </div>
      </div>

      {showPreview ? (
        <Preview
          items={items}
          title={title}
          additionalDetails={additionalDetails}
          showModal={showModal}
          labelTitleList={labelTitleList}
          widthList={widthList}
          checkboxList={checkboxList}
          columnTypeList={columnTypeList}
          enumList={enumList}
          tableName={tableName}
        />
      ) : (
        <>
          {/* <div className="row">
            <label
              htmlFor="tableName"
              className="text-xs font-bold text-gray-800"
            >
              Form name <span className="text-red-500">*</span>
            </label>
            {alertMessage && <div className="alert">{alertMessage}</div>}
            <input
              type="text"
              id="tableName"
              value={tableName}
              placeholder="Enter Form name..."
              onChange={handleTableNameChange}
              className="border border-gray-300 rounded px-4 mt-2 py-2 w-96 focus:outline-none focus:border-green-500 transition-colors duration-300"
              style={{
                fontWeight: "bold",
                marginTop: "10px",
                marginLeft: "10px", // Adding some spacing between label and input
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Adding shadow effect
                borderRadius: "8px", // Adjusting border radius
                fontSize: "16px", // Adjusting font size
              }}
            />
          </div>  */}

          <div className="row">
            <form role="form" className="w-100">
              <div className="form-group">
                <input
                  className="form-control border border-gray-300 rounded px-4 mt-2 py-2 focus:outline-none focus:border-green-500 transition-colors duration-300"
                  type="text"
                  name="name"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ marginBottom: "10px" }}
                />
              </div>
              <div className="form-group">
                <textarea
                  className="form-control border border-gray-300 rounded px-4 mt-2 py-2 focus:outline-none focus:border-green-500 transition-colors duration-300"
                  type="text"
                  name="blah"
                  placeholder="Additional details here"
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  style={{ marginBottom: "10px" }}
                />
              </div>
            </form>
          </div>

          <div className="row">
            {/* Draggable Elements */}
            <div className="col-sm-4 p-2">
              <div className="flex flex-column gap-3 border-2 border[#858585] p-4">
                {/* Search Box */}
                <div className="input-group mb-2 justify-content-center w-100">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                    aria-label="Search forms"
                    aria-describedby="basic-addon2"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                  />
                </div>

                {/* Element Box  */}
                <div id="modules" className="bg-[#F9F9F9]">
                  {filteredElementGroups.map((group, index) => {
                    if (group.elements.length > 0) {
                      return (
                        <ElementGroup
                          key={index}
                          groupName={group.name}
                          elements={group.elements}
                          handleDragStart={handleDragStart}
                          elementGroupData={group}
                        />
                      );
                    } else {
                      return null;
                    }
                  })}
                </div>
              </div>
            </div>

            {/* Form Drop Zone */}
            <div className="col-sm-8 p-2">
              <div className="flex flex-column border-2 border[#858585]">
                <div className="w-100 bg-[#ECECEC]">
                  <div className="row p-4">
                    <div className="col-sm-12 p-2">
                      <label
                        htmlFor="tableName"
                        className="text-xs font-medium text-gray-500"
                        id="formName"
                      >
                        Form name <span className="text-red-500">*</span>
                      </label>
                      {alertMessage && (
                        <div className="alert">{alertMessage}</div>
                      )}
                      <input
                        type="text"
                        id="tableName"
                        value={tableName}
                        placeholder="Enter Form name..."
                        onChange={handleTableNameChange}
                        className="border border-gray-300 rounded px-4 mt-2 py-2 w-100 focus:outline-none focus:border-green-500 transition-colors duration-300"
                      />
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
                  id="dropzone"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  style={{
                    overflowY: "auto",
                    maxHeight: "calc(100vh - 56px)",
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
                      <p className="text-md text-bold m-0">
                        Select an element to add
                      </p>
                      <p className="text-xs text-gray-300 m-0">
                        Nothing to select
                      </p>
                    </div>
                  ) : (
                    items.map((item, index) => {
                      const key = `${item.type}_${index}`;
                      console.log({ swtI: item });
                      let inputElement;
                      switch (item.type) {
                        case "VARCHAR(250)":
                          inputElement = (
                            <div key={key}>
                              {/* <label className="block mb-1">Text</label> */}
                              <div
                                className={`${widthList[index]}  pt-4  px-4`}
                              >
                                <div
                                  className="row"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <label
                                    className="block mb-1"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    {labelTitleList[index]}
                                    {checkboxList[index] && (
                                      <span style={{ color: "red" }}> *</span>
                                    )}
                                  </label>
                                </div>

                                <input
                                  type="text"
                                  className={`${widthList[index]} border border-gray-300 rounded pt-4 px-4`}
                                  disabled
                                />
                              </div>
                              <div className="col-auto ">
                                <button
                                  className="remove"
                                  onClick={() => handleRemove(index)}
                                >
                                  Remove
                                </button>
                              </div>
                              <div className="pt-4 pb-4 px-4">
                                <Button
                                  variant="info"
                                  onClick={() => handleOpenModal(index)}
                                >
                                  Settings
                                </Button>

                                <Modal
                                  show={showModal[index]}
                                  onHide={() => handleCloseModal(index)}
                                >
                                  <Modal.Header closeButton>
                                    <Modal.Title>Modal title</Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body>
                                    <div className="pb-4">
                                      <label
                                        htmlFor="textTitle"
                                        className="block mb-1"
                                      >
                                        Text Title
                                      </label>
                                      <input
                                        id="textTitle"
                                        placeholder="Text title"
                                        className={`w-full border border-gray-300 rounded px-4 py-2`}
                                        value={labelTitleList[index] || ""}
                                        onChange={(e) =>
                                          handleTitleChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="pb-4">
                                      <label
                                        htmlFor="selectWidth"
                                        className="block mb-1"
                                      >
                                        Width
                                      </label>
                                      <select
                                        id="selectWidth"
                                        className={`w-38 border border-gray-300 rounded px-4 py-2`}
                                        value={widthList[index] || ""}
                                        onChange={(e) =>
                                          handleWidthChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option value="">Select</option>
                                        <option value="w-1/2">w-1/2</option>
                                        <option value="w-1/4">w-1/4</option>
                                        <option value="w-3/4">w-3/4</option>
                                        <option value="w-full">w-full</option>
                                      </select>
                                    </div>
                                    <div className="pb-4">
                                      <label className="inline-flex items-center">
                                        <input
                                          type="checkbox"
                                          checked={checkboxList[index] || false}
                                          onChange={(e) =>
                                            handleCheckboxChange(
                                              index,
                                              e.target.checked
                                            )
                                          }
                                          className="mr-2"
                                        />
                                        Required
                                      </label>
                                    </div>
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <Button
                                      variant="info"
                                      onClick={() => {
                                        handleCloseModal(index);
                                        handleColumnTypeChange(
                                          index,
                                          item.type
                                        );
                                        handleEnumChange(index, []);
                                      }}
                                    >
                                      Save changes
                                    </Button>
                                  </Modal.Footer>
                                </Modal>
                              </div>
                            </div>
                          );

                          break;

                        case "INTEGER":
                          inputElement = (
                            <div key={key}>
                              <div className={`${widthList[index]}  px-4 py-2`}>
                                <div
                                  className="row"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <label
                                    className="block mb-1"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    {labelTitleList[index]}
                                    {checkboxList[index] && (
                                      <span style={{ color: "red" }}> *</span>
                                    )}
                                  </label>
                                </div>
                                <input
                                  type="number"
                                  className={`${widthList[index]} border border-gray-300 rounded pt-4 px-4`}
                                  disabled
                                />
                              </div>
                              <div className="col-auto">
                                <button
                                  className="remove"
                                  onClick={() => handleRemove(index)}
                                >
                                  Remove
                                </button>
                              </div>
                              <div className="pt-2 pb-4 px-4">
                                <Button
                                  variant="info"
                                  onClick={() => handleOpenModal(index)}
                                >
                                  Settings
                                </Button>

                                <Modal
                                  show={showModal[index]}
                                  onHide={() => handleCloseModal(index)}
                                >
                                  <Modal.Header closeButton>
                                    <Modal.Title>Modal title</Modal.Title>
                                  </Modal.Header>

                                  <Modal.Body>
                                    <div className="pb-4">
                                      <label
                                        htmlFor="textTitle"
                                        className="block mb-1"
                                      >
                                        Text Title
                                      </label>
                                      <input
                                        id="textTitle"
                                        placeholder="Text title"
                                        className={`w-full border border-gray-300 rounded px-4 py-2`}
                                        value={labelTitleList[index] || ""}
                                        onChange={(e) =>
                                          handleTitleChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="pb-4">
                                      <label
                                        htmlFor="selectWidth"
                                        className="block mb-1"
                                      >
                                        Width
                                      </label>
                                      <select
                                        id="selectWidth"
                                        className={`w-38 border border-gray-300 rounded px-4 py-2`}
                                        value={widthList[index] || ""}
                                        onChange={(e) =>
                                          handleWidthChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option value="">Select</option>
                                        <option value="w-1/2">w-1/2</option>
                                        <option value="w-1/4">w-1/4</option>
                                        <option value="w-3/4">w-3/4</option>
                                        <option value="w-full">w-full</option>
                                      </select>
                                    </div>
                                    <div className="pb-4">
                                      <label className="inline-flex items-center">
                                        <input
                                          type="checkbox"
                                          checked={checkboxList[index] || false}
                                          onChange={(e) =>
                                            handleCheckboxChange(
                                              index,
                                              e.target.checked
                                            )
                                          }
                                          className="mr-2"
                                        />
                                        Required
                                      </label>
                                    </div>
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <Button
                                      variant="info"
                                      onClick={() => {
                                        handleCloseModal(index);
                                        handleColumnTypeChange(
                                          index,
                                          item.type
                                        );
                                        handleEnumChange(index, []);
                                      }}
                                    >
                                      Save changes
                                    </Button>
                                  </Modal.Footer>
                                </Modal>
                              </div>
                            </div>
                          );
                          break;

                        case "TEXT":
                          inputElement = (
                            <div key={key}>
                              <div className={`${widthList[index]}  px-4 py-2`}>
                                <div
                                  className="row"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <label
                                    className="block mb-1"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    {labelTitleList[index]}
                                    {checkboxList[index] && (
                                      <span style={{ color: "red" }}> *</span>
                                    )}
                                  </label>
                                </div>
                                <textarea
                                  className={`${
                                    widthList[index] === undefined
                                      ? "w-full"
                                      : widthList[index]
                                  } border border-gray-300 rounded px-4 py-2`}
                                  disabled
                                />
                              </div>
                              <div className="col-auto">
                                <button
                                  className="remove"
                                  onClick={() => handleRemove(index)}
                                >
                                  Remove
                                </button>
                              </div>
                              <div className="pt-2 pb-4 px-4">
                                <Button
                                  variant="info"
                                  onClick={() => handleOpenModal(index)}
                                >
                                  Settings
                                </Button>

                                <Modal
                                  show={showModal[index]}
                                  onHide={() => handleCloseModal(index)}
                                >
                                  <Modal.Header closeButton>
                                    <Modal.Title>Modal title</Modal.Title>
                                  </Modal.Header>

                                  <Modal.Body>
                                    <div className="pb-4">
                                      <label
                                        htmlFor="textTitle"
                                        className="block mb-1"
                                      >
                                        Text Title
                                      </label>
                                      <input
                                        id="textTitle"
                                        placeholder="Text title"
                                        className={`w-full border border-gray-300 rounded px-4 py-2`}
                                        value={labelTitleList[index] || ""}
                                        onChange={(e) =>
                                          handleTitleChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="pb-4">
                                      <label
                                        htmlFor="selectWidth"
                                        className="block mb-1"
                                      >
                                        Width
                                      </label>
                                      <select
                                        id="selectWidth"
                                        className={`w-38 border border-gray-300 rounded px-4 py-2`}
                                        value={widthList[index] || ""}
                                        onChange={(e) =>
                                          handleWidthChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option value="">Select</option>
                                        <option value="w-1/2">w-1/2</option>
                                        <option value="w-1/4">w-1/4</option>
                                        <option value="w-3/4">w-3/4</option>
                                        <option value="w-full">w-full</option>
                                      </select>
                                    </div>
                                    <div className="pb-4">
                                      <label className="inline-flex items-center">
                                        <input
                                          type="checkbox"
                                          checked={checkboxList[index] || false}
                                          onChange={(e) =>
                                            handleCheckboxChange(
                                              index,
                                              e.target.checked
                                            )
                                          }
                                          className="mr-2"
                                        />
                                        Required
                                      </label>
                                    </div>
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <Button
                                      variant="info"
                                      onClick={() => {
                                        handleCloseModal(index);
                                        handleColumnTypeChange(
                                          index,
                                          item.type
                                        );
                                        handleEnumChange(index, []);
                                      }}
                                    >
                                      Save changes
                                    </Button>
                                  </Modal.Footer>
                                </Modal>
                              </div>
                            </div>
                          );

                          break;

                        case "FLOAT":
                          inputElement = (
                            <div key={key}>
                              <div className={`${widthList[index]}  px-4 py-2`}>
                                <div
                                  className="row"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <label
                                    className="block mb-1"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    {labelTitleList[index]}
                                    {checkboxList[index] && (
                                      <span style={{ color: "red" }}> *</span>
                                    )}
                                  </label>
                                </div>

                                <input
                                  type="number"
                                  step="0.01"
                                  className={`${widthList[index]} border border-gray-300 rounded px-4 py-2`}
                                  disabled
                                />
                              </div>
                              <div className="col-auto">
                                <button
                                  className="remove"
                                  onClick={() => handleRemove(index)}
                                >
                                  Remove
                                </button>
                              </div>
                              <div className="pt-2 pb-4 px-4">
                                <Button
                                  variant="info"
                                  onClick={() => handleOpenModal(index)}
                                >
                                  Settings
                                </Button>

                                <Modal
                                  show={showModal[index]}
                                  onHide={() => handleCloseModal(index)}
                                >
                                  <Modal.Header closeButton>
                                    <Modal.Title>Modal title</Modal.Title>
                                  </Modal.Header>

                                  <Modal.Body>
                                    <div className="pb-4">
                                      <label
                                        htmlFor="textTitle"
                                        className="block mb-1"
                                      >
                                        Text Title
                                      </label>
                                      <input
                                        id="textTitle"
                                        placeholder="Text title"
                                        className={`w-full border border-gray-300 rounded px-4 py-2`}
                                        value={labelTitleList[index] || ""}
                                        onChange={(e) =>
                                          handleTitleChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="pb-4">
                                      <label
                                        htmlFor="selectWidth"
                                        className="block mb-1"
                                      >
                                        Width
                                      </label>
                                      <select
                                        id="selectWidth"
                                        className={`w-38 border border-gray-300 rounded px-4 py-2`}
                                        value={widthList[index] || ""}
                                        onChange={(e) =>
                                          handleWidthChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option value="">Select</option>
                                        <option value="w-1/2">w-1/2</option>
                                        <option value="w-1/4">w-1/4</option>
                                        <option value="w-3/4">w-3/4</option>
                                        <option value="w-full">w-full</option>
                                      </select>
                                    </div>
                                    <div className="pb-4">
                                      <label className="inline-flex items-center">
                                        <input
                                          type="checkbox"
                                          checked={checkboxList[index] || false}
                                          onChange={(e) =>
                                            handleCheckboxChange(
                                              index,
                                              e.target.checked
                                            )
                                          }
                                          className="mr-2"
                                        />
                                        Required
                                      </label>
                                    </div>
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <Button
                                      variant="info"
                                      onClick={() => {
                                        handleCloseModal(index);
                                        handleColumnTypeChange(
                                          index,
                                          item.type
                                        );
                                        handleEnumChange(index, []);
                                      }}
                                    >
                                      Save changes
                                    </Button>
                                  </Modal.Footer>
                                </Modal>
                              </div>
                            </div>
                          );

                          break;

                        case "BOOLEAN":
                          inputElement = (
                            <div key={key}>
                              <div className={`${widthList[index]}  px-4 py-2`}>
                                <div
                                  className="row"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <label
                                    className="block mb-1"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    {labelTitleList[index]}
                                    {checkboxList[index] && (
                                      <span style={{ color: "red" }}> *</span>
                                    )}
                                  </label>
                                </div>

                                <select
                                  className={`${widthList[index]} border border-gray-300 rounded px-4 py-2`}
                                >
                                  <option value="">Select</option>
                                  disabled
                                </select>
                              </div>
                              <div className="col-auto">
                                <button
                                  className="remove"
                                  onClick={() => handleRemove(index)}
                                >
                                  Remove
                                </button>
                              </div>
                              <div className="pt-2 pb-4 px-4">
                                <Button
                                  variant="info"
                                  onClick={() => handleOpenModal(index)}
                                >
                                  Settings
                                </Button>

                                <Modal
                                  show={showModal[index]}
                                  onHide={() => handleCloseModal(index)}
                                >
                                  <Modal.Header closeButton>
                                    <Modal.Title>Modal title</Modal.Title>
                                  </Modal.Header>

                                  <Modal.Body>
                                    <div className="pb-4">
                                      <label
                                        htmlFor="textTitle"
                                        className="block mb-1"
                                      >
                                        Text Title
                                      </label>
                                      <input
                                        id="textTitle"
                                        placeholder="Text title"
                                        className={`w-full border border-gray-300 rounded px-4 py-2`}
                                        value={labelTitleList[index] || ""}
                                        onChange={(e) =>
                                          handleTitleChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="pb-4">
                                      <label
                                        htmlFor="selectWidth"
                                        className="block mb-1"
                                      >
                                        Width
                                      </label>
                                      <select
                                        id="selectWidth"
                                        className={`w-38 border border-gray-300 rounded px-4 py-2`}
                                        value={widthList[index] || ""}
                                        onChange={(e) =>
                                          handleWidthChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option value="" disabled>
                                          Select
                                        </option>
                                        <option value="w-1/2">w-1/2</option>
                                        <option value="w-1/4">w-1/4</option>
                                        <option value="w-3/4">w-3/4</option>
                                        <option value="w-full">w-full</option>
                                      </select>
                                    </div>
                                    <div className="pb-4">
                                      <label className="inline-flex items-center">
                                        <input
                                          type="checkbox"
                                          checked={checkboxList[index] || false}
                                          onChange={(e) =>
                                            handleCheckboxChange(
                                              index,
                                              e.target.checked
                                            )
                                          }
                                          className="mr-2"
                                        />
                                        Required
                                      </label>
                                    </div>
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <Button
                                      variant="info"
                                      onClick={() => {
                                        handleCloseModal(index);
                                        handleColumnTypeChange(
                                          index,
                                          item.type
                                        );
                                        handleEnumChange(index, []);
                                      }}
                                    >
                                      Save changes
                                    </Button>
                                  </Modal.Footer>
                                </Modal>
                              </div>
                            </div>
                          );

                          break;

                        case "BYTEA":
                          inputElement = (
                            <div key={key}>
                              <div className={`${widthList[index]}  px-4 py-2`}>
                                <div
                                  className="row"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <label
                                    className="block mb-1"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    {labelTitleList[index]}
                                    {checkboxList[index] && (
                                      <span style={{ color: "red" }}> *</span>
                                    )}
                                  </label>
                                </div>

                                <input
                                  type="file"
                                  accept=".png, .jpg, .jpeg, .pdf"
                                  className={`${widthList[index]} border border-gray-300 rounded px-4 py-2`}
                                  disabled
                                />
                              </div>
                              <div className="col-auto">
                                <button
                                  className="remove"
                                  onClick={() => handleRemove(index)}
                                >
                                  Remove
                                </button>
                              </div>
                              <div className="pt-2 pb-4 px-4">
                                <Button
                                  variant="info"
                                  onClick={() => handleOpenModal(index)}
                                >
                                  Settings
                                </Button>

                                <Modal
                                  show={showModal[index]}
                                  onHide={() => handleCloseModal(index)}
                                >
                                  <Modal.Header closeButton>
                                    <Modal.Title>Modal title</Modal.Title>
                                  </Modal.Header>

                                  <Modal.Body>
                                    <div className="pb-4">
                                      <label
                                        htmlFor="textTitle"
                                        className="block mb-1"
                                      >
                                        Text Title
                                      </label>
                                      <input
                                        id="textTitle"
                                        placeholder="Text title"
                                        className={`w-full border border-gray-300 rounded px-4 py-2`}
                                        value={labelTitleList[index] || ""}
                                        onChange={(e) =>
                                          handleTitleChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="pb-4">
                                      <label
                                        htmlFor="selectWidth"
                                        className="block mb-1"
                                      >
                                        Width
                                      </label>
                                      <select
                                        id="selectWidth"
                                        className={`w-38 border border-gray-300 rounded px-4 py-2`}
                                        value={widthList[index] || ""}
                                        onChange={(e) =>
                                          handleWidthChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option value="">Select</option>
                                        <option value="w-1/2">w-1/2</option>
                                        <option value="w-1/4">w-1/4</option>
                                        <option value="w-3/4">w-3/4</option>
                                        <option value="w-full">w-full</option>
                                      </select>
                                    </div>
                                    <div className="pb-4">
                                      <label className="inline-flex items-center">
                                        <input
                                          type="checkbox"
                                          checked={checkboxList[index] || false}
                                          onChange={(e) =>
                                            handleCheckboxChange(
                                              index,
                                              e.target.checked
                                            )
                                          }
                                          className="mr-2"
                                        />
                                        Required
                                      </label>
                                    </div>
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <Button
                                      variant="info"
                                      onClick={() => {
                                        handleCloseModal(index);
                                        handleColumnTypeChange(
                                          index,
                                          item.type
                                        );
                                        handleEnumChange(index, []);
                                      }}
                                    >
                                      Save changes
                                    </Button>
                                  </Modal.Footer>
                                </Modal>
                              </div>
                            </div>
                          );

                          break;

                        case "TIMESTAMP":
                          inputElement = (
                            <div key={key}>
                              <div className={`${widthList[index]}  px-4 py-2`}>
                                <div
                                  className="row"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <label
                                    className="block mb-1"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    {labelTitleList[index]}
                                    {checkboxList[index] && (
                                      <span style={{ color: "red" }}> *</span>
                                    )}
                                  </label>
                                </div>
                                <DateInput
                                  type="date"
                                  className={`${widthList[index]} border border-gray-300 rounded px-4 py-2`}
                                  disabled
                                />
                                {/* <input
                                  type="date"
                                  className={`${widthList[index]} border border-gray-300 rounded px-4 py-2`}
                                  disabled
                                /> */}
                              </div>
                              <div className="col-auto">
                                <button
                                  className="remove"
                                  onClick={() => handleRemove(index)}
                                >
                                  Remove
                                </button>
                              </div>
                              <div className="pt-2 pb-4 px-4">
                                <Button
                                  variant="info"
                                  onClick={() => handleOpenModal(index)}
                                >
                                  Settings
                                </Button>

                                <Modal
                                  show={showModal[index]}
                                  onHide={() => handleCloseModal(index)}
                                >
                                  <Modal.Header closeButton>
                                    <Modal.Title>Modal title</Modal.Title>
                                  </Modal.Header>

                                  <Modal.Body>
                                    <div className="pb-4">
                                      <label
                                        htmlFor="textTitle"
                                        className="block mb-1"
                                      >
                                        Text Title
                                      </label>
                                      <input
                                        id="textTitle"
                                        placeholder="Text title"
                                        className={`w-full border border-gray-300 rounded px-4 py-2`}
                                        value={labelTitleList[index] || ""}
                                        onChange={(e) =>
                                          handleTitleChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="pb-4">
                                      <label
                                        htmlFor="selectWidth"
                                        className="block mb-1"
                                      >
                                        Width
                                      </label>
                                      <select
                                        id="selectWidth"
                                        className={`w-38 border border-gray-300 rounded px-4 py-2`}
                                        value={widthList[index] || ""}
                                        onChange={(e) =>
                                          handleWidthChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option value="">Select</option>
                                        <option value="w-1/2">w-1/2</option>
                                        <option value="w-1/4">w-1/4</option>
                                        <option value="w-3/4">w-3/4</option>
                                        <option value="w-full">w-full</option>
                                      </select>
                                    </div>
                                    <div className="pb-4">
                                      <label className="inline-flex items-center">
                                        <input
                                          type="checkbox"
                                          checked={checkboxList[index] || false}
                                          onChange={(e) =>
                                            handleCheckboxChange(
                                              index,
                                              e.target.checked
                                            )
                                          }
                                          className="mr-2"
                                        />
                                        Required
                                      </label>
                                    </div>
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <Button
                                      variant="info"
                                      onClick={() => {
                                        handleCloseModal(index);
                                        handleColumnTypeChange(
                                          index,
                                          item.type
                                        );
                                        handleEnumChange(index, []);
                                      }}
                                    >
                                      Save changes
                                    </Button>
                                  </Modal.Footer>
                                </Modal>
                              </div>
                            </div>
                          );

                          break;
                        case "my_enum_type":
                        case "my_enum_typeb":
                        case "checkbox":
                          inputElement = (
                            <div key={key}>
                              <div className={`${widthList[index]}  px-4 py-2`}>
                                <div
                                  className="row"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <label
                                    className="block mb-1"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    {labelTitleList[index]}
                                    {checkboxList[index] && (
                                      <span style={{ color: "red" }}> *</span>
                                    )}
                                  </label>
                                </div>
                                <input
                                  type="text"
                                  className={`${widthList[index]} border border-gray-300 rounded px-4 py-2`}
                                  disabled
                                />
                              </div>
                              <div className="col-auto">
                                <button
                                  className="remove"
                                  onClick={() => handleRemove(index)}
                                >
                                  Remove
                                </button>
                              </div>
                              <div className="pt-4 pb-4 px-4">
                                <Button
                                  variant="info"
                                  onClick={() => handleOpenModal(index)}
                                >
                                  Settings
                                </Button>
                                <Modal
                                  show={showModal[index]}
                                  onHide={() => handleCloseModal(index)}
                                >
                                  <Modal.Header closeButton>
                                    <Modal.Title>Modal title</Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body>
                                    <div className="pb-4">
                                      <label
                                        htmlFor="textTitle"
                                        className="block mb-1"
                                      >
                                        Text Title
                                      </label>

                                      <input
                                        placeholder="Text title"
                                        className={`w-full border border-gray-300 rounded px-4 py-2`}
                                        value={labelTitleList[index] || ""}
                                        onChange={(e) =>
                                          handleTitleChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="pb-4">
                                      <label
                                        htmlFor="selectWidth"
                                        className="block mb-1"
                                      >
                                        Width
                                      </label>
                                      <select
                                        id="selectWidth"
                                        className={`w-38 border border-gray-300 rounded px-4 py-2`}
                                        value={widthList[index] || ""}
                                        onChange={(e) =>
                                          handleWidthChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option value="">Select</option>
                                        <option value="w-1/2">w-1/2</option>
                                        <option value="w-1/4">w-1/4</option>
                                        <option value="w-3/4">w-3/4</option>
                                        <option value="w-full">w-full</option>
                                      </select>
                                    </div>
                                    <div className="pb-4">
                                      <EnumOptionsComponent
                                        label="Options"
                                        value={enumList[index] || ""}
                                        setValue={(value) =>
                                          handleEnumChange(index, value)
                                        }
                                      />
                                    </div>
                                    <div className="pb-4">
                                      <label className="inline-flex items-center">
                                        <input
                                          type="checkbox"
                                          checked={checkboxList[index] || false}
                                          onChange={(e) =>
                                            handleCheckboxChange(
                                              index,
                                              e.target.checked
                                            )
                                          }
                                          className="mr-2"
                                        />
                                        Required
                                      </label>
                                    </div>
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <Button
                                      variant="info"
                                      onClick={() => {
                                        handleCloseModal(index);
                                        handleColumnTypeChange(
                                          index,
                                          item.type
                                        );
                                      }}
                                    >
                                      Save changes
                                    </Button>
                                  </Modal.Footer>
                                </Modal>
                              </div>
                            </div>
                          );

                          break;

                        default:
                          inputElement = null;
                      }

                      return (
                        <div key={key} className="drop-item">
                          <div className="flex items-center justify-start">
                            <span className="bg-teal-400 rounded-md p-1 px-2 m-1 text-xs text-black">
                              {item.elementData.label}
                            </span>
                          </div>
                          {inputElement}
                          <button
                            className="remove"
                            onClick={() => handleRemove(index)}
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="flex justify-center items-center gap-2 p-4">
                  {items.length > 0 && (
                    <>
                      <button
                        onClick={togglePreview}
                        className="bg-[#F19F35] text-white hover:bg-amber-700 font-bold mt-2.5 p-2 px-4 rounded  transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500  text-xs"
                      >
                        Preview
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleClick}
                    className="bg-[#5BC4BF] text-white hover:bg-teal-700 font-bold mt-2.5 p-2 px-4 rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500  text-xs"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
            {/* Active Element Property */}
            <div className="hidden col-sm-2 p-3">
              <div className="h-100 flex flex-column gap-3 border-2 border[#858585] p-4">
                <div className="h-100 w-100 flex flex-column items-center justify-center gap-2">
                  <img src={GearIcon} alt="gear" height="25px" width="25px" />
                  <p className="m-0 p-0 text-gray-500 text-xs text-center">
                    Add or select element and set properties here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ElementButton(props) {
  const { elementType, elementLabel, IconSrc, handleDragStart, elementData } =
    props;

  return (
    <div className="col-6 my-2">
      <p
        draggable="true"
        onDragStart={(e) => handleDragStart(e, elementData)}
        className="drag"
      >
        <button className="rounded bg-slate-200 flex items-center gap-2 w-100 bg-[#EAECEB] p-2 py-2.5 hover:bg-teal-400 cursor-pointer">
          <img src={IconSrc} alt="Icon" className="h-[14.06px] w-[14.06px]" />
          <span className="text-xs font-medium">{elementLabel}</span>
        </button>
        {/* <Button
          variant="info"
          className="bg-gray-400"
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            textAlign: "center",
          }}
        >
          <img src={IconSrc} alt="Icon" className="h-[14.06px] w-[14.06px]" />
          <span
            className="text-xs"
            style={{ fontWeight: "bold", marginLeft: "10%" }}
          >
            {elementLabel}
          </span>
        </Button> */}
      </p>
    </div>
  );
}

function ElementGroup({
  groupName,
  elements,
  handleDragStart,
  elementGroupData,
}) {
  return (
    <div>
      <p
        className="m-2 mx-1 text-xs text-[#5bc4bf]"
        style={{ fontWeight: "bold" }}
      >
        {groupName}
      </p>
      <div className="row">
        {elements.map((element, index) => (
          <ElementButton
            key={index}
            elementType={element.type}
            elementLabel={element.label}
            IconSrc={element.IconSrc}
            handleDragStart={handleDragStart}
            elementData={element}
          />
        ))}
      </div>
    </div>
  );
}

const EnumOptionsComponent = ({ label = "", value, setValue }) => {
  const [enumOptions, setEnumOptions] = useState([]);

  const isEnumOptionsHasValue =
    enumOptions.length > 0
      ? enumOptions[enumOptions.length - 1].length > 0
        ? true
        : false
      : false;

  const onChangeVal = (e) => {
    if (e.target.value[e.target.value.length - 1] !== ",") {
      setEnumOptions((prev) => {
        const updatedItems = [...prev];
        updatedItems[e.target.name] = e.target.value;
        return [...updatedItems];
      });
    }
  };

  const onAddNewOption = () => {
    // console.log("..");
    // console.log({ enumOptions, isEnumOptionsHasValue });

    if (isEnumOptionsHasValue) {
      setEnumOptions((prev) => {
        let updatedEle = [...prev];
        updatedEle.push("");

        return updatedEle;
      });
    }
  };

  const onRemoveOption = (idx) => {
    setEnumOptions((prev) => {
      let updatedEle = [...prev];
      updatedEle = updatedEle.filter((_, index) => {
        return idx !== index;
      });

      return updatedEle;
    });
  };

  useEffect(() => {
    let arrayOfValues = value.split(",");
    setEnumOptions(arrayOfValues);
    return () => {};
  }, []);

  useEffect(() => {
    let hasValue = enumOptions.filter(Boolean);
    let uniqueValues = [...new Set(hasValue)];
    // setEnumOptions(uniqueValues);
    // console.log({ hasValue, uniqueValues });
    let arrayOfValues = uniqueValues.join(",");
    setValue(arrayOfValues);
  }, [enumOptions]);

  useEffect(() => {
    let uniqueValues = [...new Set(enumOptions)];
    if (uniqueValues.length !== enumOptions.length) {
      setEnumOptions(uniqueValues);
    }
  }, [enumOptions]);

  return (
    <div className="flex flex-column gap-2">
      {label && <label className="inline-flex items-center">{label}</label>}
      {enumOptions.length > 0
        ? enumOptions.map((item, idx) => (
            <div className="flex items-center gap-1">
              <input
                type="text"
                onChange={onChangeVal}
                value={enumOptions[idx]}
                name={idx}
                placeholder={`Enter Option ${idx + 1}`}
                className="border border-gray-300 rounded px-4 py-2 mr-4 w-100 placeholder:text-sm"
              />

              <button
                onClick={() => {
                  onRemoveOption(idx);
                }}
                className="flex items-center justify-center p-2 text-white rounded-full focus:outline-none hover:bg-red-100"
              >
                <img src={TrashIcon} alt="trash" className="w-4 h-4" />
              </button>
            </div>
          ))
        : ["newItem"].map((item, idx) => (
            <div className="flex items-center gap-1">
              <input
                type="text"
                onChange={onChangeVal}
                value={enumOptions[idx]}
                name={idx}
                placeholder={`Enter Option ${idx + 1}`}
                className="border border-gray-300 rounded px-4 py-2 mr-4 w-100 placeholder:text-sm"
              />

              <button
                onClick={() => {
                  onRemoveOption(idx);
                }}
                className="hidden flex items-center justify-center p-2 text-white rounded-full focus:outline-none hover:bg-red-100"
              >
                <img src={TrashIcon} alt="trash" className="w-4 h-4" />
              </button>
            </div>
          ))}
      <button
        className="mx-auto bg-[#5BC4BF] text-white hover:bg-teal-700 font-bold mt-2.5 p-2 px-4 rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500  text-xs"
        onClick={onAddNewOption}
        disabled={!isEnumOptionsHasValue}
      >
        Add Option
      </button>
    </div>
  );
};
