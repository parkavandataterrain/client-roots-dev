"use client";

import Activities from "../Activities/Activities";
import Appointment from "../Appointment/Appointment";
import Calendar from "../Calendar1/Calendar"
import NotificationCard from "../NotificationCard/NotificationCard";
import SocialVital from "../SocialVital/SocialVital";

const Panel = () => {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="flex xl:flex-col justify-between space-y-8  w-full gap-x-2 md:max-xl:flex-row md:max-xl:space-y-0 xl:items-center">
        <SocialVital />
        <Calendar />
      </div>
      <div className="flex flex-col justify-between gap-y-4 w-full gap-x-2 md:max-xl:flex-row md:max-xl:gap-y-2 ">
        <NotificationCard />
        <Appointment />
        <Activities />
      </div>
    </div>
  );
};

export default Panel;
