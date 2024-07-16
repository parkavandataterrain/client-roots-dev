import React, { useCallback, useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FilterIcon from "../images/filter.svg";
import ClientProfileImg from "../images/clientProfile.svg";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useWindowSize } from "../Utils/windowResize";
import { protectedApi } from "../../services/api";
import { notifyError } from "../../helper/toastNotication";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const NotificationTile = ({ date, time, clientId, carePlanId, message }) => {
  return (
    <div className="flex space-x-4 sm:space-x-6 w-11/12 mx-auto ">
      <span>
        <img
          src={ClientProfileImg}
          className="size-12 sm:size-16"
          alt="profile"
        />
      </span>
      <span className="flex flex-col space-y-2">
        <span className="text-sm">{message}</span>
        <span className="flex items-center space-x-1 text-[12px]">
          <CalendarMonthIcon className="size-2 text-[#5BC4BF]" />
          <span className="text-[#5BC4BF]">{date}</span>
          <span>|</span>
          <AccessTimeIcon className="size-2 text-[#1F4B51]" />
          <span className="text-[#1F4B51]">{time}</span>
        </span>
        <Link
          to={`/care-plan/add/${clientId}/?carePlanId=${carePlanId}&mode=approve`}
        >
          <button
            className="bg-[#5BC4BF] text-xs text-white px-3 sm:px-4 py-1.5 w-fit rounded-sm"
            id="notification-details"
          >
            Details
          </button>
        </Link>
      </span>
    </div>
  );
};

function NotificationCard() {
  const { width } = useWindowSize();
  const [notifications, setNotifications] = useState([]);

  const fetchNotification = useCallback(async () => {
    try {
      const notificationResponse = await protectedApi.get(
        "/care-plan-notifications/"
      );

      return notificationResponse.data;
    } catch (err) {
      notifyError("Failed to fetch notifications");
      console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchNotification().then((data) => {
      setNotifications(data);
    });
  }, []);

  return (
    <div className="bg-white rounded-md shadow-md xl:w-full min-[320px]:w-full">
      <div className="flex justify-between items-center px-6 !pt-6 sm:pt-2">
        <div className="text-xl flex items-center space-x-3 font-medium py-1">
          <div id="notificationsLabel">Notifications</div>
          <img src={FilterIcon} className="size-4" alt="filter" />
        </div>
        <button>
          <MoreVertIcon
            sx={{
              fontSize: width > 600 ? "25px" : "20px",
            }}
          />
        </button>
      </div>
      <hr className="w-11/12 mx-auto my-2" />
      <div className="flex flex-col space-y-7 py-4 items-center max-h-[550px] overflow-y-auto">
        {notifications?.map((notification) => (
          <NotificationTile
            key={notification.id}
            date={
              notification.created_at
                ? format(notification.created_at, "dd MMM yyyy")
                : ""
            }
            time={
              notification.created_at
                ? format(notification.created_at, "hh:mm a")
                : ""
            }
            clientId={notification.client_id}
            carePlanId={notification.care_plan_id}
            message={notification.message}
          />
        ))}
      </div>
    </div>
  );
}

export default NotificationCard;
