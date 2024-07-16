import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import GreetingImage from "../images/greetingImg.svg";
import DownArrowIcon from "../images/downArrow.svg";
import "./GreetingCardStyles.css";
import apiURL from '../../apiConfig';

const GreetingCard = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetchUsername();
  }, []);

  const fetchUsername = useCallback(async () => {
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
      const response = await axios.get(`${apiURL}/api/username`, config);
      setUsername(response.data.username);
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  }, []);

  return (
    <div id="greeting-card-one" className="flex justify-between items-center shadow-lg p-6 bg-gradient-to-r from-[#D9F0EF] to-[#5BC4BF] rounded-md col-span-5">
      <div id="greeting-card-two">
        <div id="greeting-card-three" className="text-lg leading-7 tracking-normal font-medium">
          Welcome, {username}
        </div>
        <div id="greeting-card-four" className="text-sm my-4 font-light sm:w-[80%]">
          Get a snapshot of Roots member's overall picture of health and wellness
        </div>
        <button id="greeting-card-five" className="flex justify-center items-center space-x-2 mt-8 px-4 py-2.5 bg-white rounded-sm">
          <span id="greeting-card-six" className="text-[#2F9384] text-sm">Select Staff</span>
          <img id="greeting-card-seven" src={DownArrowIcon} className="size-4" alt="arrow" />
        </button>
      </div>
      <div id="greeting-card-eight">
        <img id="greeting-card-nine" src={GreetingImage} className="size-44" alt="greeting" />
      </div>
    </div>
  );
};

export default React.memo(GreetingCard);
