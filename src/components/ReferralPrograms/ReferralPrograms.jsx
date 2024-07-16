import React from "react";
import { useState, useMemo, useEffect } from "react";
import ExternalLinkIcon from "../images/externalLink.svg";
import BasicTable from "../react-table/BasicTable";
import axios from "axios";
import ClientProfileImg from "../images/clientProfile.svg";
import ClientChartImg from "../images/clientChart.svg";
import "./ReferralProgramsStyles.css";
import apiURL from "../../apiConfig";

function ReferralPrograms() {
  const [data, setData] = useState([]);

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
      const response = await axios.get(
        `${apiURL}/clientreferral-api?search=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
          `${row.original.client_first_name}, ${row.original.client_last_name}`,
      },
      {
        Header: "Program",
        accessor: "program_name",
        align: "left",
      },
      {
        Header: "Referral Date",
        accessor: "referred_date",
        align: "left",
        Cell: ({ value }) => {
          // Split the raw date value into day, month, and year components
          const [day, month, year] = value.split("-");
          // Construct a Date object with the components in the correct order
          const date = new Date(`${year}-${month}-${day}`);
          // Check if the date is valid
          if (isNaN(date.getTime())) {
            return "Invalid Date";
          }
          // Extract month, day, and year
          const formattedMonth = String(date.getMonth() + 1).padStart(2, "0");
          const formattedDay = String(date.getDate()).padStart(2, "0");
          const formattedYear = date.getFullYear();
          // Format date as "mm-dd-yyyy"
          return `${formattedMonth}-${formattedDay}-${formattedYear}`;
        },
      },
      {
        Header: "Referral Comments",
        accessor: "referral_comments",
        align: "left",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Progress Comments",
        accessor: "progress_comments",
        align: "left",
      },
      {
        Header: "Closed Date",
        accessor: "date_closed",
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
        Header: "Closed By",
        accessor: "closed_by",
        align: "left",
      },
    ],
    []
  );

  return (
    <div className="w-full bg-white rounded-md shadow-md flex flex-col">
      <div
        id="referral-programs-2"
        className="flex justify-between items-center mx-3 sm:mx-8 mt-6"
      >
        <div className="flex items-center space-x-4">
          <span id="referral-programs-3" className="text-lg font-medium">
            Referral Programs
          </span>
          <img
            id="referral-programs-4"
            src={ExternalLinkIcon}
            className="size-3 sm:size-4"
            alt="link"
          />
        </div>
        <div>
          <button
            id="referral-programs-5"
            className="px-3 py-1 border-1 sm:border-2 rounded-sm border-[#2F9384] text-[13px] font-medium leading-5 text-[#2F9384]"
          >
            View all
          </button>
        </div>
      </div>
      <hr id="referral-programs-6" className="w-[98%] mx-auto my-2" />
      <div className="w-full flex-grow flex flex-col">
        <BasicTable type={"referralPrograms"} columns={columns} data={data} />
      </div>
    </div>
  );
}

export default ReferralPrograms;
