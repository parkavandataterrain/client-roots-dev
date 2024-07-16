import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchClientInfoAsync } from "../../store/slices/clientInfoSlice";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import ProfileIcon from "../images/profileIcon2.svg";
// import BadgeIcon from "../images/badge.svg";
import "./ClientProfileStyles.css";

import SilverBadgeIcon from "../images/badge/silver_badge.svg";
import GoldBadgeIcon from "../images/badge/gold_badge.svg";
import BronzeBadgeIcon from "../images/badge/bronze_badge.svg";
import axiosInstance from "../../helper/axiosInstance";

const FormInput = ({ title, label, value, disabled = false, ...restProps }) => {
  return (
    <div>
      <label htmlFor={label} className="text-xs text-[#585A60]">
        {title}
      </label>
      <input
        type="text"
        name={label}
        value={value}
        className="w-full rounded-sm text-xs p-2.5"
        disabled={disabled}
        {...restProps}
      />
    </div>
  );
};

const Content = ({ data, badge }) => {
  // Function to format date as 'mm-dd-yyyy'

  let BadgeIcon = BronzeBadgeIcon;
  if (badge.badge === "Silver") {
    BadgeIcon = SilverBadgeIcon;
  }
  if (badge.badge === "Gold") {
    BadgeIcon = GoldBadgeIcon;
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Return empty string if date is null or undefined
    const date = new Date(dateString);
    const month = date.getMonth() + 1; // Months are zero indexed
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}-${year}`;
  };

  const formData = [
    {
      title: "Preferred Name",
      label: "preferredName",
      value: data?.nickname_preferred_name || "",
      disabled: true,
    },
    {
      title: "Pronouns",
      label: "pronouns",
      value: data?.preferred_pronouns || "",
      disabled: true,
    },
    {
      title: "Date of Birth",
      label: "dateOfBirth",
      value: formatDate(data?.date_of_birth) || "",
      disabled: true,
    },
    {
      title: "Language",
      label: "language",
      value: data?.comfortable_language || "",
      disabled: true,
    },
    {
      title: "Primary Phone",
      label: "primaryPhone",
      value: data?.mobile_number || "",
      disabled: true,
    },
    {
      title: "Email",
      label: "email",
      value: data?.email_address || "",
      disabled: true,
    },
    {
      title: "Insurance",
      label: "insurance",
      value: data?.insurance_primary_carrier_name || "",
      disabled: true,
    },
    {
      title: "Insurance ID",
      label: "insuranceId",
      value: data?.insurance_primary_subscriber_id || "",
      disabled: true,
    },
    {
      title: "Navigator",
      label: "navigator",
      value: data?.navigator_name || "",
      disabled: true,
    },
    {
      title: "Program",
      label: "program",
      value: data?.program_name || "",
      disabled: true,
    },
    {
      title: "Other Programs",
      label: "otherProgram",
      value: data?.other_programs || "",
      disabled: true,
    },
  ];

  return (
    <>
      <hr className="w-[99%] mx-auto text-[#bababa]" />
      <div className="grid grid-cols-10 my-3">
        <div className="col-span-8 grid grid-cols-4 gap-4 p-4 ml-3 bg-[#D4EDEC] rounded-md">
          {formData.map((item, index) => {
            const { title, label, value, ...restProps } = item;

            return (
              <FormInput
                key={index}
                title={title}
                label={label}
                value={value}
                {...restProps}
              />
            );
          })}
        </div>
        <div className="col-span-2 mx-3 bg-[#5BC4BF] rounded-md">
          <div className="w-full relative">
            <img src={ProfileIcon} className="mx-auto size-44" alt="profile" />
            <img
              src={BadgeIcon}
              className="absolute bottom-[1.5rem] left-[8.2rem] size-10 "
              alt="badge"
            />
          </div>
          <div className="text-white text-lg flex flex-col justify-evenly gap-2 my-2.5 font-semibold items-center">
            <div>{data?.first_name}</div>
            <div>#2154984641</div>
          </div>
        </div>
      </div>
    </>
  );
};

function ClientProfile({ clientId }) {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.clientInfo.data);
  const dataLoading = useSelector((state) => state.clientInfo.loading);

  const [badge, setBadge] = useState({});

  const fetchBadge = async () => {
    try {
      const response = await axiosInstance.get(`/UserNameBadge/${clientId}`);
      const { data } = response;
      setBadge(data);
    } catch (e) {
      console.error({ e });
    }
  };

  useEffect(() => {
    fetchBadge();
  }, []);

  useState(() => {
    if (!dataLoading) {
      dispatch(fetchClientInfoAsync({ clientId }));
    }
  }, []);

  const [open, setOpen] = useState(true);

  return (
    <div
      id="clientChartClientProfile"
      className="bg-white rounded-md shadow-sm"
    >
      <div className="flex justify-between p-3">
        <div className="text-[#28293B] text-xl">Client Profile</div>
        <RemoveCircleIcon
          onClick={() => setOpen(!open)}
          className="text-[#585A60] hover:cursor-pointer"
        />
      </div>
      {open && <Content data={data} badge={badge} />}
    </div>
  );
}

export default ClientProfile;
