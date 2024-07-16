import React from "react";
import { useState, useMemo, useEffect } from "react";
import ExternalLinkIcon from "../images/externalLink.svg";
import BasicTable from "../react-table/BasicTable";
import axios from "axios";
import "./PriorityListStyles.css";
import apiURL from "../../apiConfig";
import PriorityListTable from "../react-table/PriorityListTable";
import EditableCell from "../react-table/EditableCell";

function PriorityList() {
  const [data, setData] = useState([]);
  const [oldValues, setOldValues] = useState([])
  const [updatedValues, setUpdatedValues] = useState([])

  const [searchQuery, setSearchQuery] = useState("");
  console.log(data)
  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const fetchData = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      return;
    }

    try {
      const response = await axios.get(
        `${apiURL}/clientprioritylist-api?search=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data);
      console.log("Priority list",data);
      setOldValues(response.data)
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching Client Data:", error);
    }
  };


  const [updateData, setUpdateData] = useState({});

  // const updateMyData = (data, value) => {
  //   // We use a functional update to ensure we don't overwrite other object properties
  //   // that React isn't tracking for the data state.

  //   console.log(data, value, "from updatemydata");
  //   // console.log(oldValues)
  //   // setData((old) =>
  //   //   old.map((row, index) => {
  //   //     if (index === rowIndex) {
  //   //       // Create a new object with the updated value
  //   //       return {
  //   //         ...old[rowIndex],
  //   //         [columnId]: value,
  //   //       };
  //   //     }
  //   //     return row;
  //   //   })
  //   // );

  //   // let payloadData = {
  //   //   dataview: "Admin",
  //   //   client_id: rowIndex, // Replace with the appropriate client ID
  //   //   column_id: columnId,
  //   //   old_value: oldValues,
  //   //   new_value: value,
  //   // }

  //   // setUpdateData({
  //   //   dataview: "Admin",
  //   //   client_id: rowIndex, // Replace with the appropriate client ID
  //   //   column_id: columnId,
  //   //   old_value: oldValues,
  //   //   new_value: value,
  //   // });

  //   // updatedDataApi(payloadData);
  // };

  const updateMyData = (data, newValue, oldValue, columnId) => {

    const matchedObject = data.find((obj) => {
      const values = Object.values(obj);
      return values.includes(oldValue);
    });


    const { id, priority_list_name } = matchedObject;

    

    let payloadData = {
      dataview: "Admin",
      client_id: id, // Replace with the appropriate client ID
      column_id: priority_list_name,
      old_value: oldValue,
      new_value: newValue,
    }
      updatedDataApi(payloadData);
  };
  console.log(data)
  const columns = [
    {
      Header: "Program",
      accessor: "program_name",
      align: "left",
      Cell: (props) => (
        <EditableCell {...props} data={data} updateMyData={updateMyData} />
      ),
    },
    {
      Header: "List Name",
      accessor: "priority_list_name",
      align: "left",
      Cell: (props) => (
        <EditableCell {...props} data={data} updateMyData={updateMyData} />
      ),
    },
    {
      Header: "Total Clients",
      accessor: "total_clients",
      Cell: (props) => (
        <EditableCell {...props} data={data} updateMyData={updateMyData} />
      ),
    },
    {
      Header: "Latest Edit",
      accessor: "last_edited_by_me",
      align: "left",
      Cell: ({ value }) => {
        if (!value) return "";

        // Parse the date string
        const date = new Date(value);
        // Extract day, month, and year
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        // Format date as "dd-mm-yyyy"
        return `${month}-${day}-${year}`;
      },
    },
    {
      Header: "Assigned Staff",
      accessor: "other_assigned_staff",
      align: "left",
      Cell: (props) => (
        <EditableCell {...props} updateMyData={updateMyData} data={data} />
      ),
    },
  ]

  const updatedDataApi = async (payload) => {
    console.log(payload)
    try {
      const response = await axios.patch(
        `${apiURL}/priority_list/mapping/`,
        payload, // Send updateData as the request payload

      );
      console.log(response);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

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
        <div>
          <button
            id="priority-list-5"
            className="px-3 py-1 border-1 sm:border-2 rounded-sm border-[#2F9384] text-[#2F9384] text-[13px] font-medium leading-5"
          >
            View all
          </button>
        </div>
      </div>
      <hr id="priority-list-6" className="w-[98%] mx-auto my-2" />
      <div className="w-full flex-grow flex flex-col">
        <PriorityListTable type={"priorityList"} columns={columns} data={data} />
      </div>
    </div>
  );
}

export default PriorityList;
