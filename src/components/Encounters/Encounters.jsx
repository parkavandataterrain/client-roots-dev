import React from "react";
import { useState, useMemo } from "react";
import ExternalLinkIcon from "../images/externalLink.svg";
import BasicTable from "../react-table/BasicTable";
import DocumentAddIcon from "../images/documentAdd.svg";
import EditIcon from "../images/edit.svg";
import EyeIcon from "../images/eye.svg";
import { Checkbox } from "@mui/material";
import { useWindowSize } from "../Utils/windowResize";

function Encounters() {
  const { width } = useWindowSize();
  const [data, setData] = useState([
    {
      date: "01-01-2000",
      time: "9 A.M",
      client: "...",
      reason: "...",
      noteStatus: "...",
      appointmentStatus: "No Show",
    },
    {
      date: "01-01-2000",
      time: "9 A.M",
      client: "...",
      reason: "...",
      noteStatus: "...",
      appointmentStatus: "No Show",
    },
    {
      date: "01-01-2000",
      time: "9 A.M",
      client: "...",
      reason: "...",
      noteStatus: "...",
      appointmentStatus: "No Show",
    },
    {
      date: "01-01-2000",
      time: "9 A.M",
      client: "...",
      reason: "...",
      noteStatus: "...",
      appointmentStatus: "No Show",
    },
    {
      date: "01-01-2000",
      time: "9 A.M",
      client: "...",
      reason: "...",
      noteStatus: "...",
      appointmentStatus: "No Show",
    },
  ]);

  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "date",
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
        Header: "Time",
        accessor: "time",
        align: "left",
      },
      {
        Header: "Client",
        align: "left",
        accessor: "client",
        align: "left",
      },
      {
        Header: "Reason",
        accessor: "reason",
        align: "left",
      },
      {
        Header: "Note Status",
        accessor: "noteStatus",
      },
      {
        Header: "Start Note",
        Cell: ({ row }) => (
          <div className="mx-auto flex justify-around space-x-2 items-center">
            <img src={DocumentAddIcon} alt="add" />
            <img src={EditIcon} alt="edit" />
            <img src={EyeIcon} alt="view" />
          </div>
        ),
      },
      {
        Header: "Appointment Status",
        accessor: "appointmentStatus",
      },
    ],
    []
  );

  return (
    <div className="w-full bg-white rounded-md shadow-md flex flex-col">
      <div className="flex justify-between items-center mx-3 sm:mx-4 mt-6">
        <div className="flex items-center space-x-1 sm:space-x-4">
          <span
            className="text-[16px] sm:text-lg font-medium"
            id="encountersTable"
          >
            Encounters
          </span>
          <img src={ExternalLinkIcon} className="size-3 sm:size-4" alt="link" />
        </div>
        <div className="flex items-center space-x-1 sm:space-x-4 text-[8px] sm:text-xs">
          <label htmlFor="client-goal-active" className="flex items-center">
            <Checkbox
              checked={true}
              // onChange={handleChange}
              style={{
                color: "#2F9384",
                padding: width < 600 ? "3px" : "5px",
              }}
              inputProps={{ "aria-label": "controlled" }}
            />
            <span className="text-[#2F9384]">Active</span>
          </label>
          <label htmlFor="client-goal-active" className="flex items-center">
            <Checkbox
              checked={false}
              // onChange={handleChange}
              style={{
                color: "#7397B5",
                padding: "5px",
              }}
              inputProps={{ "aria-label": "controlled" }}
            />
            <span className="text-[#7397B5]">Completed</span>
          </label>
          <button className="px-3 py-1 border-1 rounded-sm border-[#1F4B51] text-[13px] font-medium leading-5 sm:text-xs text-[#1F4B51]">
            View all
          </button>
        </div>
      </div>
      <hr className="w-[98%] mx-auto my-2" />
      <div className="w-full flex-grow flex flex-col">
        <BasicTable type={"encounters"} columns={columns} data={data} />
      </div>
    </div>
  );
}

export default Encounters;
