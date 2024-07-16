import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import apiURL from "../../apiConfig";

const DataViewTransferList = ({setSaveSuccess, saveSuccess}) => {

  const [selectedOption, setSelectedOption] = useState(null);
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);

  const [loadingData, setLoadingData] = useState(true);
  
  const [items, setItems] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const [state, setState] = useState({
    columns: [],
    data: []
});

  const handleSaveChanges = () => {
      const requestBody = {
          "dataview": "Admin",
     
        }
    const token = localStorage.getItem("access_token");
    // Extract the names of the selected items
    const selectedItemsNames = selectedItems.map((item) => item.name);
    fetch(`${apiURL}/priority_list/`, {
        method: 'POST',
        body: JSON.stringify(selectedItems),
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json())
    .then((datas) => {
        console.log(datas); // Print the response data

        axios
        .post(`${apiURL}/priority_list/mapping/`,requestBody, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setState(response.data);
          console.log("/priority_list/mapping/",response.data);
        })
        .catch((error) => {
          console.error("Error fetching Client Medication Data:", error);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
    setSelectedItems([])
    setItems((prevItems) =>
      prevItems.map((item) => ({ ...item, disabled: false }))
    );
    setSaveSuccess(!saveSuccess)
}

  // Group items by their group property
  const groupedItems = items.reduce((groups, item) => {
    if (!groups[item.group]) {
      groups[item.group] = [];
    }
    groups[item.group].push(item);
    return groups;
  }, {});

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
        setLoadingData(false)
      })
      .catch((error) => console.error("Error fetching items:", error));
  }, []);




  
  

  const handleSubmit = () => {
    if (dataViewName === "") {
      alert("Please provide data view name");
      return false;
    }

    if (rightItems.length === 0) {
      alert("Atleast one Column required to create");
      return false;
    }
    setIsSubmitting(true);
    let mappings = {};
    rightItems.map((item) => {
      if (mappings[item.dbID]) {
        mappings[item.dbID] = {
          table_id: item.dbID,
          field_ids: [...mappings[item.dbID].field_ids, item.columnID],
        };
      } else {
        mappings[item.dbID] = {
          table_id: item.dbID,
          field_ids: [item.columnID],
        };
      }
    });

    let mappingsArray = Object.values(mappings);

    let postData = {
      name: dataViewName,
      mappings: mappingsArray,
    };

    
  };

  console.log({ leftItems, rightItems, selectedOption });

  const [dataViewName, setDataViewName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAvailableItems, setSelectedAvailableItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedSelectedItems, setSelectedSelectedItems] = useState([]);

  const handleSelectAvailable = (item) => {
    setSelectedAvailableItems((prev) => {
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
        selectedSelectedItems.includes(item.name)
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

  const handleSelectSelected = (item) => {
    setSelectedSelectedItems((prev) => {
      if (prev.includes(item)) {
        return prev.filter((i) => i !== item);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleDoubleClickSelected = (itemName) => {
    setSelectedItems((prev) => prev.filter((item) => item !== itemName));
    setItems((prev) =>
      prev.map((item) =>
        item.name === itemName ? { ...item, disabled: false } : item
      )
    );
  };

  return (
    <div className="relative">
      {(loadingData || isSubmitting) && (
        <div className="z-[10] flex flex-column absolute top-0 left-0 items-center justify-center gap-2 w-100 h-100 bg-gray-100/80">
          <svg
            className="animate-spin -ml-1 mr-3 h-8 w-8 text-teal-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-base">
            {loadingData
              ? "Loading..."
              : isSubmitting
              ? "Creating..."
              : "Updating..."}
          </p>
        </div>
      )}
      <div className="flex justify-center">
        <div className="w-[68%] flex justify-between items-center gap-4 mb-4">
          <div>
            {/* <Select
              options={databaseList}
              
              value={selectedDatabase}
              placeholder="Select table"
              className="w-[270px] max-w-[70vw] placeholder:text-sm"
            /> */}
          </div>
          <div className="flex justify-center items-center gap-2">
            <div>
              {/* <input
                type="text"
                value={dataViewName}
                onChange={(e) => setDataViewName(e.target.value)}
                placeholder="DataView Name"
                className={`placeholder:text-sm appearance-none border-1 border-[#5BC4BF] rounded w-full p-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              /> */}
            </div>
            <div>
              <button
                onClick={handleSaveChanges}
                className="m-auto px-3 py-1 border-1 sm:border-2 rounded-sm border-[#2F9384] text-[#2F9384] text-[13px] font-medium leading-5 hover:bg-[#5BC4BF] hover:text-white"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-4">
        <div className="h-[60vh] w-[30%] overflow-auto border-1 border-teal-900">
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
                        !item.disabled && handleSelectAvailable(item.name)
                      }
                      onDoubleClick={() =>
                        !item.disabled && handleDoubleClickAvailable(item.name)
                      }
                      className={`${
                        selectedAvailableItems.includes(item.name)
                          ? "bg-teal-100 border-1 border-b-[2px] border-teal-400"
                          : "bg-white border-b-[1px] border-teal-700"
                      } hover:bg-teal-100 text-xs p-2 cursor-pointer ${
                        item.disabled ? "text-gray-400 cursor-not-allowed" : ""
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
                        {'>>'}
                      </button>
                      <button
                        onClick={moveToAvailable}
                        disabled={selectedSelectedItems.length === 0}
                        className="px-3 py-1 border-1 sm:border-2 rounded-sm border-[#2F9384] text-[#2F9384] text-[13px] font-medium leading-5 hover:bg-[#5BC4BF] hover:text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        {'<<'}
                      </button>
                    </div>
        <div className="h-[60vh] w-[30%] overflow-auto border-1 border-teal-900">
          <ul className="list" id="selected-list">
            {selectedItems.length === 0 ? (
              <li className="flex items-center justify-center h-100 text-center text-xs py-2">
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
    </div>
  );
};

export default DataViewTransferList;


