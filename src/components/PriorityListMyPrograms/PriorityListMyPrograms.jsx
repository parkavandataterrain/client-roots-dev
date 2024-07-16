import React from "react";
import { useState, useMemo, useEffect } from "react";
import ExternalLinkIcon from "../images/externalLink.svg";
import BasicTable from "../react-table/BasicTable";
import axios from "axios";
import "./PriorityListMyProgramsStyles.css";

function PriorityListMyPrograms() {
  const [data, setData] = useState([
    {
      program: "ECM",
      listName: "My Panel",
      totalClients: "27",
      latestEdit: "06-01-2024",
      assignedStaff: "...",
    },
    {
      program: "Diabetes",
      listName: "High A1c",
      totalClients: "250",
      latestEdit: "06-01-2024",
      assignedStaff: "...",
    },
  ]);

  const columns = useMemo(
    () => [
      {
        Header: "Program",
        accessor: "program",
        align: "left",
      },
      {
        Header: "List Name",
        accessor: "listName",
        align: "left",
      },
      {
        Header: "Total Clients",
        accessor: "totalClients",
      },
      {
        Header: "Latest Edit",
        accessor: "latestEdit",
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
        accessor: "assignedStaff",
      },
    ],
    []
  );

  return (
    <div className="bg-white rounded-md shadow-md flex flex-col min-[320px]:w-full ">
      <div
        id="priority-list-my-programs-2"
        className="flex justify-between items-center mx-3 sm:mx-8 mt-6"
      >
        <div className="flex items-center space-x-2 sm:space-x-4">
          <span
            id="priority-list-my-programs-3"
            className="text-lg font-medium"
          >
            Priority Lists in my Programs
          </span>
          <img
            id="priority-list-my-programs-4"
            src={ExternalLinkIcon}
            className="size-3 sm:size-4"
            alt="link"
          />
        </div>
        <div>
          <button
            id="priority-list-my-programs-5"
            className="px-3 py-1 border-1 sm:border-2 rounded-sm border-[#7397B5] text-[#28293B] text-[13px] font-medium leading-5"
          >
            View all
          </button>
        </div>
      </div>
      <hr id="priority-list-my-programs-6" className="w-[98%] mx-auto my-2" />
      <div className="w-full flex-grow flex flex-col">
        <BasicTable
          type={"priorityListPrograms"}
          columns={columns}
          data={data}
        />
      </div>
    </div>
  );
}

export default PriorityListMyPrograms;
