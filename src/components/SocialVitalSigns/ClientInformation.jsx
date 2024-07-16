import React from "react";

import BadgeIcon from "../images/badge.svg";
import ProfileIcon from "../images/profileIcon2.svg";

function ClientInformation({ data }) {
  return (
    <div className="bg-gradient-to-r from-[#D9F0EF] to-[#89D6DE] rounded shadow border p-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col justify-around">
          <div className="text-lg font-medium">
            Client Social Vital Signs Information
          </div>
          <div className="text-sm font-normal">
            Input to Calculate Our Metrics for Better Engagement.
          </div>
          <div className="flex flex-row space-x-4">
            <div className="bg-white px-3 py-2 text-normal text-sm">
              Client D.O.B: 24 May 1952
            </div>
            <div className="bg-white px-3 py-2 text-normal text-sm">
              Navigator: Conor
            </div>
          </div>
        </div>
        <div className=" bg-white rounded-md space-y-10 px-4 pt-2">
          <div className="w-full relative">
            <img src={ProfileIcon} className="size-28" alt="profile" />
            <img
              src={BadgeIcon}
              className="absolute bottom-4 left-[5rem] size-8 "
              alt="badge"
            />
          </div>
          <div className="flex flex-col justify-evenly gap-2 my-2.5 font-semibold items-center pb-2">
            <div className="text-[#43B09C] text-normal text-sm">
              {data?.first_name || "Name"}
            </div>
            <div className="text-[#43B09C] text-normal text-sm">
              #2154984641
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientInformation;
