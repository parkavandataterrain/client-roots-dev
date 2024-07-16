import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import LineUpTeal from "../images/lineUpTeal.svg";
import LineUpPurple from "../images/lineUpPurple.svg";
import ClientIcon from "../images/clientsIcon.svg";
import ProgramIcon from "../images/programIcon.svg";
import "./TopStatsCardStyles.css";
import apiURL from '../../apiConfig';

const TopStats = () => {
  const [clientCount, setClientCount] = useState("");
  const [programCount, setProgramCount] = useState("");

  const fetchClientCount = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token"); // Assuming you store the access token in localStorage
      if (!token) {
        throw new Error("No access token found");
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${apiURL}/api/client_program_count`, config);
      setClientCount(response.data.client_count);
      setProgramCount(response.data.staff_program_count);
    } catch (error) {
      console.error("Error fetching client count:", error);
    }
  }, []);

  useEffect(() => {
    fetchClientCount();
  }, [fetchClientCount]);

  return (
    <div id="top-stats-1" className="bg-white rounded-md shadow-md col-span-3 flex-1">
      <div id="top-stats-2" className="flex justify-around text-lg font-medium mt-6 mb-2 text-center">
        <div id="top-stats-3">Total Clients</div>
        <div id="top-stats-4">Total Program</div>
      </div>
      <hr id="top-stats-5" className="w-11/12 mx-auto my-2" />
      <div id="top-stats-6" className="flex justify-around text-5xl font-semibold my-10">
        <div id="top-stats-7 clientCount" className="mx-auto my-auto p-3 rounded-md bg-[#D9F0EF] text-[#43B09C]" >
          <span>{clientCount}</span>
        </div>
        <div id="top-stats-8 programCount" className="mx-auto my-auto px-4 py-3 rounded-md bg-[#E6EAED] text-[#1F4B51]">
          <span>{programCount}</span>
        </div>
      </div>
      <div id="top-stats-9" className="flex justify-around items-center">
        <div id="top-stats-10" className="flex items-center">
          {/* <img id="top-stats-11" src={LineUpTeal} className="size-4 mx-1" alt="lineup" />
          <div id="top-stats-12" className="text-xs"><span className="text-[#43B09C]">28%</span> vs Last Year</div>
          <img id="top-stats-13" src={ClientIcon} className="size-5 mx-2" alt="client" /> */}
        </div>
        <div id="top-stats-10" className="flex items-center">
          {/* <img id="top-stats-11" src={LineUpPurple} className="size-4 mx-1" alt="lineup" />
          <div id="top-stats-12" className="text-xs"><span className="text-[#7397B5]">38%</span> vs Last Year</div>
          <img id="top-stats-13" src={ProgramIcon} className="size-5 mx-2" alt="program" /> */}
        </div>
      </div>
    </div>
  );
};

export default React.memo(TopStats);
