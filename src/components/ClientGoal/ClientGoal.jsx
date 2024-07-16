import React from "react";
import axios from "axios";
import { useState, useMemo, useEffect } from "react";
import ExternalLinkIcon from "../images/externalLink.svg";
import BasicTable from "../react-table/BasicTable";
import CarePlanImg from "../images/carePlan.svg";
import { Checkbox } from "@mui/material";
import { useWindowSize } from "../Utils/windowResize";
import apiURL from "../../apiConfig";
import { Link } from "react-router-dom";

function ClientGoal() {
  const [data, setData] = useState([]);
  const { width } = useWindowSize();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const fetchData = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      return;
    }

    try {
      const response = await axios.get(`${apiURL}/api/client-goals/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching Client Data:", error);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Client",
        accessor: "first_name",
        align: "left",
        Cell: ({ row }) =>
          `${row.original.first_name}, ${row.original.last_name}`,
      },
      {
        Header: "D.O.B",
        accessor: "dob",
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
        Header: "Goal",
        accessor: "smart_goal_summary",
        align: "left",
      },
      {
        Header: "Problem",
        accessor: "problem",
        align: "left",
      },
      {
        Header: "Status",
        accessor: "goal_status",
      },
      {
        Header: "Status Date",
        accessor: "goal_date",
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
        Header: "Created Date",
        accessor: "care_plan_created_date",
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
        Header: "Care Plan",
        Cell: ({ row }) => (
          <Link to={`/care-plan/${row.original.care_plan_id}`}>
            {" "}
            {/* Pass care plan ID to the care plan page */}
            <img src={CarePlanImg} className="size-6 mx-auto" alt="client" />
          </Link>
        ),
      },
    ],
    []
  );

  return (
    <div className="xl:w-full bg-white rounded-md shadow-md flex flex-col min-[320px]:w-full">
      <div className="flex justify-between items-center mx-3 sm:mx-4 mt-6">
        <div className="flex items-center space-x-1 sm:space-x-4">
          <span className="text-[16px] sm:text-lg font-medium" id="clientGoal">
            Client Goals
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
          <button className="px-3 py-1 border-1 sm:border-2 rounded-sm border-[#7397B5] text-[13px] font-medium leading-5 sm:text-xs text-[#28293B]">
            View all
          </button>
        </div>
      </div>
      <hr className="w-[98%] mx-auto my-2" />
      <div className="w-full flex-grow flex flex-col">
        <BasicTable type={"clientGoal"} columns={columns} data={data} />
      </div>
    </div>
  );
}

export default ClientGoal;
