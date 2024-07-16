import React from "react";
import AvatarImg from "../images/avatar.svg";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useWindowSize } from "../Utils/windowResize";

const ActivityItem = () => {

  const {width} = useWindowSize();

  return (
    <div className="flex justify-between">
      <div className="flex space-x-4">
        <img src={AvatarImg} alt="avatar" />
        <div className="space-y-1">
          <div className="text-[12px] sm:text-sm">John Doe completed the program</div>
          <div className="text-[10px] sm:text-xs py-1">Program Name: ECM</div>
          <div className="text-[8px] sm:text-xs">15 mins ago</div>
        </div>
      </div>
      <button>
        <MoreVertIcon sx={{
          fontSize: width > 600 ? "25px" : "20px",
        }} />
      </button>
    </div>
  );
};

function Activities() {

  const {width} = useWindowSize();

  return (
    <div className="bg-white w-full rounded-md shadow-md md:max-xl:">
      <div className="flex justify-between items-center px-3 sm:px-6 mt-6 mb-2">
        <div className="text-[16px] sm:text-lg font-medium" id="activitiesId">Activities</div>
        <button>
          <MoreVertIcon sx={{
          fontSize: width > 600 ? "25px" : "20px",
        }} />
        </button>
      </div>
      <hr className="w-11/12 mx-auto my-2" />
      <div className="flex flex-col justify-between gap-y-5 mx-3 my-8">
        <ActivityItem />
        <ActivityItem />
        <ActivityItem />
        <ActivityItem />
        <ActivityItem />
        <ActivityItem />
      </div>
    </div>
  );
}

export default Activities;
