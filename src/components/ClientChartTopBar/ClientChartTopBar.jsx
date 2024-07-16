import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchClientInfoAsync } from "../../store/slices/clientInfoSlice";
// import SearchIcon from "@mui/icons-material/Search";
import Icon1 from "../images/ClientChartTopBarIcon1.svg";
import Icon2 from "../images/ClientChartTopBarIcon2.svg";
import SearchIcon from "../images/search.svg";

import { useState } from "react";
import { Link } from "react-router-dom";

function ClientChartTopBar({ clientId }) {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.clientInfo.data);
  const dataLoading = useSelector((state) => state.clientInfo.loading);

  useState(() => {
    if (!dataLoading) {
      dispatch(fetchClientInfoAsync({ clientId }));
    }
  }, []);

  return (
    <div className="w-full bg-white border border-white shadow-sm rounded-md flex justify-between items-center p-3">
      <div className="flex space-x-6 items-center">
        <div className="text-[#28293B] text-[22px] font-medium">
          {data?.first_name} {data?.last_name}
        </div>
        <img src={Icon1} className="size-5" alt="icon1" />
        <img src={Icon2} className="size-5" alt="icon2" />
      </div>

      <div className="flex space-x-2 p-1 items-center border-b-2 border-[#5BC4BF]">
        <img src={SearchIcon} className="w-[20px] h-100" />
        <input
          type={"text"}
          // value={searchText}
          // onChange={handleSearchText}
          placeholder="Search here"
          className={`appearance-none w-full p-2.5 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
        />
      </div>

      <div className="flex items-center gap-x-8 text-base">
        <Link to="/">
          <a href="#" className="text-[#43B09C]">
            Dashboard
          </a>
        </Link>
        <Link to={`/clientprofile/${data?.id}`}>
          <a href="#" className="text-[#43B09C]">
            Client Profile
          </a>
        </Link>
        <a href="#" className="text-[#43B09C]">
          Assignments & Referrals
        </a>
      </div>
    </div>
  );
}

export default ClientChartTopBar;
