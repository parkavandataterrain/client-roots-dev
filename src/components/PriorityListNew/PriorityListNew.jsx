import React, { useState, useEffect } from "react";
import axios from "axios";
// import { useState, useMemo } from "react";
import ExternalLinkIcon from "../images/externalLink.svg";
import BasicTable from "../react-table-filtered/BasicTable";
import "./PriorityListNew.css";
import Modal from "react-bootstrap/Modal";
// import DataContext from './DataContext';
// import AddColumnModal from "../AddColumnModal/AddColumnModal";
import apiURL from "../.././apiConfig";
import EditableCell from "../react-table/EditableCell";

function PriorityListNew() {
  const token = localStorage.getItem("access_token");

  const [show, setShow] = useState(false);
  const [state, setState] = useState({
    columns: [],
    data: [],
  });
  // const [state,setState] = useContext(DataContext,{columns: [],data: []});
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const requestBody = {
    dataview: "Admin",
  };
  useEffect(() => {
    axios
      .post(`${apiURL}/priority_list/mapping/`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setState(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Client Medication Data:", error);
      });
  }, []);

  const { columns, data } = state;

  console.log(data, "data");

  // const token = localStorage.getItem("access_token");

  const updatedDataApi = async (payload) => {
    console.log(payload);
    try {
      const response = await axios.patch(
        `${apiURL}/priority_list/mapping/`,
        payload // Send updateData as the request payload
      );
      console.log(response);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const updateMyData = (data, newValue, oldValue, columnId) => {
    console.log(newValue, oldValue, columnId);
    let payloadData = {
      dataview: "Admin",
      client_id: columnId, // Replace with the appropriate client ID
      column_id: columnId,
      old_value: oldValue,
      new_value: newValue,
    };
    updatedDataApi(payloadData);
  };
  const createColumns = (columns) => {
    return columns.map((column) => ({
      ...column,
      Cell: (props) => (
        <EditableCell {...props} data={data} updateMyData={updateMyData} />
      ),
    }));
  };

  const columnsWithEditableCells = createColumns(columns);

  console.log(columnsWithEditableCells);

  const handleSaveChanges = () => {
    console.log("Clicked button");

    // Extract the names of the selected items
    const selectedItemsNames = selectedItems.map((item) => item.name);
    fetch(`${apiURL}/priority_list/`, {
      method: "POST",
      body: JSON.stringify(selectedItems),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((datas) => {
        console.log(datas); // Print the response data

        axios
          .post(`${apiURL}/priority_list/mapping/`, requestBody, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setState(response.data);
            console.log("/priority_list/mapping/", response.data);
          })
          .catch((error) => {
            console.error("Error fetching Client Medication Data:", error);
          });

        const { columns, data } = state;
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    handleClose();
  };

  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedAvailableItems, setSelectedAvailableItems] = useState([]);
  const [selectedSelectedItems, setSelectedSelectedItems] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    // Fetch items from the API
    fetch(`${apiURL}/priority_list`) // Replace with your API URL
      .then((response) => response.json())
      .then((data) => {
        setItems(data);

        // Initialize the expandedGroups state
        const initialExpandedGroups = data.reduce((groups, item) => {
          if (!groups[item.group]) {
            groups[item.group] = false; // Initially collapse all groups
          }
          return groups;
        }, {});
        console.log(initialExpandedGroups);
        setExpandedGroups(initialExpandedGroups);
      })
      .catch((error) => console.error("Error fetching items:", error));
  }, []);

  const handleSelectAvailable = (item) => {
    setSelectedAvailableItems((prev) => {
      if (prev.includes(item)) {
        return prev.filter((i) => i !== item);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleSelectSelected = (item) => {
    setSelectedSelectedItems((prev) => {
      if (prev.includes(item)) {
        return prev.filter((i) => i !== item);
      } else {
        return [...prev, item];
      }
    });
  };

  const moveToSelected = () => {
    setSelectedItems((prev) => [...prev, ...selectedAvailableItems]);
    setItems((prev) =>
      prev.map((item) =>
        selectedAvailableItems.includes(item.name)
          ? { ...item, disabled: true }
          : item
      )
    );
    setSelectedAvailableItems([]);
  };

  const moveToAvailable = () => {
    setSelectedItems((prev) =>
      prev.filter((item) => !selectedSelectedItems.includes(item))
    );
    setItems((prev) =>
      prev.map((item) =>
        // selectedSelectedItems.includes(item.name) ? { ...item, disabled: false } : item
        selectedSelectedItems.includes(item)
          ? { ...item, disabled: false }
          : item
      )
    );
    setSelectedSelectedItems([]);
  };

  const handleDoubleClickAvailable = (itemName) => {
    setSelectedItems((prev) => [...prev, itemName]);
    setItems((prev) =>
      prev.map((item) =>
        item.name === itemName ? { ...item, disabled: true } : item
      )
    );
  };

  const handleDoubleClickSelected = (itemName) => {
    setSelectedItems((prev) => prev.filter((item) => item !== itemName));
    setItems((prev) =>
      prev.map((item) =>
        item.name === itemName ? { ...item, disabled: false } : item
      )
    );
  };

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  // Group items by their group property
  const groupedItems = items.reduce((groups, item) => {
    if (!groups[item.group]) {
      groups[item.group] = [];
    }
    groups[item.group].push(item);
    return groups;
  }, {});
  return (
    <div className="bg-white rounded-md shadow-md flex flex-col min-[320px]:w-full">
      <div
        id="priority-list-2"
        className="flex justify-between items-center mx-3 sm:mx-8 mt-6"
      >
        <div className="flex items-center space-x-4">
          <span id="priority-list-3" className="text-lg font-medium">
            Priority Lists
          </span>
          <img
            id="priority-list-4"
            src={ExternalLinkIcon}
            className="size-3 sm:size-4"
            alt="link"
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <button
            id="priority-list-5"
            className="px-3 py-1 border-1 sm:border-2 rounded-md border-[#2F9384] text-[#2F9384] text-[13px] font-medium leading-5"
          >
            View all
          </button>

          <a
            href="/table-list-view"
            id="priority-list-5"
            className="px-3 py-1 border-1 sm:border-2 rounded-md border-[#2F9384] text-[#2F9384] text-[13px] font-medium leading-5"
            onClick={handleShow}
          >
            Customize view
          </a>

          {/* <Modal show={show} onHide={handleClose} className="custom-modal">
            <Modal.Header closeButton className="custom-modal-header">
              <Modal.Title>Available and Selected Items</Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body">
              <div className="flex justify-center items-start gap-4">
                <div className="h-[60vh] w-[35%] px-2 overflow-auto border-1 border-teal-900">
                  <div className="border-b-2">
                    <div className="flex justify-between items-center w-100 bg-[#ffffff] text-black p-2.5 px-4 font-bold">
                      Available Items
                    </div>
                  </div>
                  {Object.keys(groupedItems).map((group) => (
                    <div key={group} className="mb-4">
                      <div
                        onClick={() => toggleGroup(group)}
                        className="bg-[#5BC4BF] text-white flex justify-between font-medium p-2 cursor-pointer "
                      >
                        {group} {expandedGroups[group] ? "▲" : "▼"}
                      </div>
                      {expandedGroups[group] && (
                        <ul>
                          {groupedItems[group].map((item) => (
                            <li
                              key={item.name}
                              onClick={() =>
                                !item.disabled &&
                                handleSelectAvailable(item.name)
                              }
                              onDoubleClick={() =>
                                !item.disabled &&
                                handleDoubleClickAvailable(item.name)
                              }
                              className={`${
                                selectedAvailableItems.includes(item.name)
                                  ? "bg-teal-100 border-1 border-b-[2px] border-teal-400"
                                  : "bg-white border-b-[1px] border-teal-700"
                              } hover:bg-teal-100 text-xs p-2 cursor-pointer ${
                                item.disabled
                                  ? "text-gray-400 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {item.name.split(".")[1]}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex flex-column gap-2 h-100 justify-center items-center">
                  <button
                    onClick={moveToSelected}
                    disabled={selectedAvailableItems.length === 0}
                    className="px-3 py-1 border-1 sm:border-2 rounded-sm border-[#2F9384] text-[#2F9384] text-[13px] font-medium leading-5 hover:bg-[#5BC4BF] hover:text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    {">>"}
                  </button>
                  <button
                    onClick={moveToAvailable}
                    disabled={selectedSelectedItems.length === 0}
                    className="px-3 py-1 border-1 sm:border-2 rounded-sm border-[#2F9384] text-[#2F9384] text-[13px] font-medium leading-5 hover:bg-[#5BC4BF] hover:text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    {"<<"}
                  </button>
                </div>
                <div className="h-[60vh] w-[35%] overflow-auto border-1 border-teal-900">
                  <div className="border-b-2">
                    <div className="flex justify-between items-center w-100 bg-[#ffffff] text-black p-2.5 px-4 font-bold">
                      Selected Items
                    </div>
                  </div>
                  <ul className="list" id="selected-list">
                    {selectedItems.length === 0 ? (
                      <li className="flex items-center justify-center h-100 text-center text-xs">
                        No items selected
                      </li>
                    ) : (
                      selectedItems.map((item) => (
                        <li
                          key={item}
                          onClick={() => handleSelectSelected(item)}
                          onDoubleClick={() => handleDoubleClickSelected(item)}
                          className="bg-white border-b-[1px] border-teal-700 hover:bg-teal-100 text-xs p-2 cursor-pointer"
                        >
                          {item}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="custom-modal-footer">
              <button
                onClick={handleClose}
                className="px-3 py-1 border-1 sm:border-2 rounded-sm border-[#2F9384] text-[#2F9384] text-[13px] font-medium leading-5 hover:bg-[#5BC4BF] hover:text-white"
              >
                Close
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-3 py-1 border-1 sm:border-2 rounded-sm border-[#2F9384] text-[#2F9384] text-[13px] font-medium leading-5 hover:bg-[#5BC4BF] hover:text-white"
              >
                Save Changes
              </button>
            </Modal.Footer>
          </Modal> */}
        </div>
      </div>
      <hr id="priority-list-6" className="w-[98%] mx-auto my-2" />
      <div className="w-full flex-grow flex flex-col">
        <BasicTable
          type={"priorityList"}
          columns={columnsWithEditableCells}
          data={data}
        />
      </div>
    </div>
  );
}

export default PriorityListNew;
