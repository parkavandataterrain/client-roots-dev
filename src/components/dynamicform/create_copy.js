import React, { useState } from "react";
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

function DragDropDemo() {
  const [showPreview, setShowPreview] = useState(false);

  const [items, setItems] = useState([]);
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
        if (typeof element === "undefined" || element === "") {
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
      console.error("Error:", error.response.data.message);
      window.alert("An error occurred. Please try again later.");
    }
  };

  const handleOpenModal = (index) => {
    setShowModal((prevState) => ({ ...prevState, [index]: true }));
  };

  const handleCloseModal = (index) => {
    setShowModal((prevState) => ({ ...prevState, [index]: false }));
  };

  function handleDragStart(e, text) {
    e.dataTransfer.setData("text/plain", text);
  }

  function handleDrop(e) {
    e.preventDefault();
    const text = e.dataTransfer.getData("text/plain");
    const newItem = { type: text };
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
                className="bg-Teal-500 hover:bg-Teal-700 text-block font-bold py-2 px-4 rounded mb-4 mr-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-Teal-500"
                style={{
                  borderRadius: "3px",
                  background: "#9CDADA",
                  marginTop: "20px",
                }}
                fdprocessedid="wgjh4"
                onClick={togglePreview}
              >
                Toggle Preview
              </button>
            </a>
            <form className="form-inline">
              <a>
                <Link
                  to="/createtableform"
                  className="bg-Teal-500 hover:bg-Teal-700 text-block font-bold py-2 px-4 rounded mb-4 mr-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-Teal-500"
                  style={{ borderRadius: "3px", background: "#9CDADA" }}
                >
                  Available Forms
                </Link>
              </a>
              <Link
                to="/alterTable"
                className="bg-Teal-500 hover:bg-Teal-700 text-block font-bold py-2 px-4 rounded mb-4 mr-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-Teal-500"
                style={{ borderRadius: "3px", background: "#9CDADA" }}
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
          <div className="row">
            <label
              htmlFor="tableName"
              className="text-lg font-bold text-gray-800"
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
          </div>

          <div className="row pt-4">
            <form role="form" className="w-3/4">
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

          <div className="row pt-4">
            <div className="col-sm-4" style={{ border: "2px solid #eaeceb" }}>
              <div
                className="input-group mb-3 justify-content-center pt-4 "
                style={{ width: "90%", margin: "auto" }}
              >
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

              <div id="modules">
                <p
                  className="pb-4"
                  style={{ color: "#5bc4bf", fontWeight: "bold" }}
                >
                  Elaments Name
                </p>

                <div className="row">
                  <div className="col-6">
                    <p
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, "VARCHAR(250)")}
                      className="drag"
                    >
                      <Button
                        variant="info"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        <img
                          src={file}
                          alt="Text Icon"
                          style={{
                            width: "15%",
                            height: "15%",
                            marginRight: "10px",
                          }}
                        />
                        <span style={{ fontWeight: "bold", marginLeft: "10%" }}>
                          Text
                        </span>
                      </Button>
                    </p>
                  </div>
                  <div className="col-6">
                    <p
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, "TEXT")}
                      className="drag"
                    >
                      <Button
                        variant="info"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        <img
                          src={file}
                          alt="Text Icon"
                          style={{
                            width: "15%",
                            height: "15%",
                            marginRight: "10px",
                          }}
                        />
                        <span style={{ fontWeight: "bold", marginLeft: "10%" }}>
                          TextArea
                        </span>
                      </Button>
                    </p>
                  </div>
                  <div className="col-6 pt-4">
                    <p
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, "INTEGER")}
                      className="drag"
                    >
                      <Button
                        variant="info"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        <img
                          src={file}
                          alt="Text Icon"
                          style={{
                            width: "15%",
                            height: "15%",
                            marginRight: "10px",
                          }}
                        />
                        <span style={{ fontWeight: "bold", marginLeft: "10%" }}>
                          Number
                        </span>
                      </Button>
                    </p>
                  </div>
                </div>

                <p
                  className="pt-4"
                  style={{ color: "#5bc4bf", fontWeight: "bold" }}
                >
                  Elaments Name
                </p>

                <div className="row ">
                  <div className="col-6 pt-4">
                    <p
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, "FLOAT")}
                      className="drag"
                    >
                      <Button
                        variant="info"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        <img
                          src={file}
                          alt="Text Icon"
                          style={{
                            width: "15%",
                            height: "15%",
                            marginRight: "10px",
                          }}
                        />
                        <span style={{ fontWeight: "bold", marginLeft: "10%" }}>
                          Decimal
                        </span>
                      </Button>
                    </p>
                  </div>
                  <div className="col-6 pt-4">
                    <p
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, "BOOLEAN")}
                      className="drag"
                    >
                      <Button
                        variant="info"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        <img
                          src={file}
                          alt="Text Icon"
                          style={{
                            width: "15%",
                            height: "15%",
                            marginRight: "10px",
                          }}
                        />
                        <span style={{ fontWeight: "bold", marginLeft: "10%" }}>
                          Boolean
                        </span>
                      </Button>
                    </p>
                  </div>
                  <div className="col-6 pt-4">
                    <p
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, "TIMESTAMP")}
                      className="drag"
                    >
                      <Button
                        variant="info"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        <img
                          src={file}
                          alt="Text Icon"
                          style={{
                            width: "15%",
                            height: "15%",
                            marginRight: "10px",
                          }}
                        />
                        <span style={{ fontWeight: "bold", marginLeft: "10%" }}>
                          Date and Time
                        </span>
                      </Button>
                    </p>
                  </div>
                </div>

                <p
                  className="pt-4"
                  style={{ color: "#5bc4bf", fontWeight: "bold" }}
                >
                  Elaments Name
                </p>

                <div className="row">
                  <div className="col-6 pt-4">
                    <p
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, "my_enum_type")}
                      className="drag"
                    >
                      <Button
                        variant="info"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        <img
                          src={file}
                          alt="Text Icon"
                          style={{
                            width: "15%",
                            height: "15%",
                            marginRight: "10px",
                          }}
                        />
                        <span style={{ fontWeight: "bold", marginLeft: "10%" }}>
                          Dropdown
                        </span>
                      </Button>
                    </p>
                  </div>
                  <div className="col-6 pt-4">
                    <p
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, "my_enum_typeb")}
                      className="drag"
                    >
                      <Button
                        variant="info"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        <img
                          src={file}
                          alt="Text Icon"
                          style={{
                            width: "15%",
                            height: "15%",
                            marginRight: "10px",
                          }}
                        />
                        <span style={{ fontWeight: "bold", marginLeft: "10%" }}>
                          Multiple Select
                        </span>
                      </Button>
                    </p>
                  </div>

                  <div className="col-6 pt-4">
                    <p
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, "checkbox")}
                      className="drag"
                    >
                      <Button
                        variant="info"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        <img
                          src={file}
                          alt="Text Icon"
                          style={{
                            width: "15%",
                            height: "15%",
                            marginRight: "10px",
                          }}
                        />
                        <span style={{ fontWeight: "bold", marginLeft: "10%" }}>
                          checkbox
                        </span>
                      </Button>
                    </p>
                  </div>

                  <div className="col-6 pt-4">
                    <p
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, "BYTEA")}
                      className="drag"
                    >
                      <Button
                        variant="info"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        <img
                          src={file}
                          alt="Text Icon"
                          style={{
                            width: "15%",
                            height: "15%",
                            marginRight: "10px",
                          }}
                        />
                        <span style={{ fontWeight: "bold", marginLeft: "10%" }}>
                          Image Upload
                        </span>
                      </Button>
                    </p>
                  </div>
                  <div className="col-6 pt-4">
                    <p
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, "BYTEA")}
                      className="drag"
                    >
                      <Button
                        variant="info"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        <img
                          src={file}
                          alt="Text Icon"
                          style={{
                            width: "15%",
                            height: "15%",
                            marginRight: "10px",
                          }}
                        />
                        <span style={{ fontWeight: "bold", marginLeft: "10%" }}>
                          File Upload
                        </span>
                      </Button>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="col-sm-8 pt-4"
              style={{
                overflowY: "auto",
                maxHeight: "calc(100vh - 56px)",
                border: "2px solid #eaeceb",
              }}
            >
              <div
                id="dropzone"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                {items.map((item, index) => {
                  const key = `${item.type}_${index}`;

                  let inputElement;
                  switch (item.type) {
                    case "VARCHAR(250)":
                      inputElement = (
                        <div key={key}>
                          {/* <label className="block mb-1">Text</label> */}
                          <div className={`${widthList[index]}  pt-4  px-4`}>
                            <div
                              className="row"
                              style={{ display: "flex", alignItems: "center" }}
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
                              Open Modal
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
                                      handleTitleChange(index, e.target.value)
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
                                      handleWidthChange(index, e.target.value)
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
                                    Checkbox
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
                                      "VARCHAR(250)"
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
                              style={{ display: "flex", alignItems: "center" }}
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
                              Open Modal
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
                                      handleTitleChange(index, e.target.value)
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
                                      handleWidthChange(index, e.target.value)
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
                                    Checkbox
                                  </label>
                                </div>
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  variant="info"
                                  onClick={() => {
                                    handleCloseModal(index);
                                    handleColumnTypeChange(index, "INTEGER");
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
                              style={{ display: "flex", alignItems: "center" }}
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
                              Open Modal
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
                                      handleTitleChange(index, e.target.value)
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
                                      handleWidthChange(index, e.target.value)
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
                                    Checkbox
                                  </label>
                                </div>
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  variant="info"
                                  onClick={() => {
                                    handleCloseModal(index);
                                    handleColumnTypeChange(index, "TEXT");
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
                              style={{ display: "flex", alignItems: "center" }}
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
                              Open Modal
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
                                      handleTitleChange(index, e.target.value)
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
                                      handleWidthChange(index, e.target.value)
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
                                    Checkbox
                                  </label>
                                </div>
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  variant="info"
                                  onClick={() => {
                                    handleCloseModal(index);
                                    handleColumnTypeChange(index, "FLOAT");
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
                              style={{ display: "flex", alignItems: "center" }}
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
                              Open Modal
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
                                      handleTitleChange(index, e.target.value)
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
                                      handleWidthChange(index, e.target.value)
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
                                    Checkbox
                                  </label>
                                </div>
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  variant="info"
                                  onClick={() => {
                                    handleCloseModal(index);
                                    handleColumnTypeChange(index, "BOOLEAN");
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
                              style={{ display: "flex", alignItems: "center" }}
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
                              Open Modal
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
                                      handleTitleChange(index, e.target.value)
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
                                      handleWidthChange(index, e.target.value)
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
                                    Checkbox
                                  </label>
                                </div>
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  variant="info"
                                  onClick={() => {
                                    handleCloseModal(index);
                                    handleColumnTypeChange(index, "BYTEA");
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
                              style={{ display: "flex", alignItems: "center" }}
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
                              type="date"
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
                              Open Modal
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
                                      handleTitleChange(index, e.target.value)
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
                                      handleWidthChange(index, e.target.value)
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
                                    Checkbox
                                  </label>
                                </div>
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  variant="info"
                                  onClick={() => {
                                    handleCloseModal(index);
                                    handleColumnTypeChange(index, "TIMESTAMP");
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
                              style={{ display: "flex", alignItems: "center" }}
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
                          <div>
                            <Button
                              variant="info"
                              onClick={() => handleOpenModal(index)}
                            >
                              Open Modal
                            </Button>

                            <Modal
                              show={showModal[index]}
                              onHide={() => handleCloseModal(index)}
                            >
                              <Modal.Header closeButton>
                                <Modal.Title>Modal title</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <input
                                  placeholder="Text title"
                                  className={`w-full border border-gray-300 rounded px-4 py-2`}
                                  value={labelTitleList[index] || ""}
                                  onChange={(e) =>
                                    handleTitleChange(index, e.target.value)
                                  }
                                />
                                <select
                                  className={`w-38 border border-gray-300 rounded px-4 py-2`}
                                  value={widthList[index] || ""}
                                  onChange={(e) =>
                                    handleWidthChange(index, e.target.value)
                                  }
                                >
                                  <option value="">Select</option>
                                  <option value="w-1/2">w-1/2</option>
                                  <option value="w-1/4">w-1/4</option>
                                  <option value="w-3/4">w-3/4</option>
                                  <option value="w-full">w-full</option>
                                </select>
                                <input
                                  type="checkbox"
                                  checked={checkboxList[index] || false}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      index,
                                      e.target.checked
                                    )
                                  }
                                  className="ml-2"
                                />

                                <input
                                  type="text"
                                  value={enumList[index] || ""}
                                  onChange={(e) =>
                                    handleEnumChange(index, e.target.value)
                                  }
                                  placeholder="Enter enum values separated by comma"
                                  className="border border-gray-300 rounded px-4 py-2 mr-4"
                                />
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  variant="info"
                                  onClick={() => {
                                    handleCloseModal(index);
                                    handleColumnTypeChange(index, item.type);
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
                      {inputElement}
                      <button
                        className="remove"
                        onClick={() => handleRemove(index)}
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
              <div
                className="row"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <button
                  onClick={handleClick}
                  className="bg-Teal-500 hover:bg-Teal-700 text-block font-bold mt-2.5 py-2 px-4 rounded mb-4 mr-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-Teal-500 w-48"
                  style={{
                    borderRadius: "3px",
                    background: "#9CDADA",
                    fontSize: "1rem",
                  }}
                >
                  Create Form
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DragDropDemo;
