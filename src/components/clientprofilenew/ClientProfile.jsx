import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchClientInfoAsync } from "../../store/slices/clientInfoSlice";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import ProfileIcon from "../images/profileIcon2.svg";
import BadgeIcon from "../images/badge.svg";
import "./ClientProfileStyles.css";

const FormInput = ({ title, label, value }) => {
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
      />
    </div>
  );
};

const Content = ({data}) => {
  return (
    <>
      <hr className="w-[99%] mx-auto text-[#bababa]" />
      <div className="grid grid-cols-10 my-3">
        <div className="col-span-8 grid grid-cols-4 gap-4 p-4 ml-3 bg-[#D4EDEC] rounded-md">
          <FormInput
            title={"Preferred Name"}
            label={"preferredName"}
            value={data?.nickname_preferred_name || ""}
          />
          <FormInput title={"Pronouns"} label={"pronouns"} value={data?.preferred_pronouns || ""} />
          <FormInput
            title={"Date of Birth"}
            label={"dateOfBirth"}
            value={data?.date_of_birth || ""}
          />
          <FormInput title={"Language"} label={"language"} value={data?.comfortable_language || ""} />
          <FormInput
            title={"Primary Phone"}
            label={"primaryPhone"}
            value={data?.mobile_number || ""}
          />
          <FormInput title={"Email"} label={"email"} value={data?.email_address || ""} />
          <FormInput
            title={"Insurance"}
            label={"insurance"}
            value={data?.insurance_primary_carrier_name || ""}
          />
          <FormInput title={"Insurance ID"} label={"insuranceId"} value={data?.insurance_primary_subscriber_id || ""} />
          <FormInput
            title={"Navigator"}
            label={"navigator"}
            value={data?.navigator_name || ""}
          />
          <FormInput
            title={"Program"}
            label={"program"}
            value={data?.program_name || ""}
          />
          <FormInput
            title={"Other Programs"}
            label={"otherProgram"}
            value={data?.other_programs || ""}
          />
        </div>
        <div className="col-span-2 mx-3 bg-[#5BC4BF] rounded-md">
          <div className="w-full relative">
            <img src={ProfileIcon} className="mx-auto size-44" alt="profile" />
            <img
              src={BadgeIcon}
              className="absolute bottom-8 left-[9.5rem] size-10 "
              alt="badge"
            />
          </div>
          <div className="text-white flex flex-col justify-evenly gap-2 my-2.5 font-semibold items-center">
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
      {open && <Content data={data} />}
    </div>
  );
}

export default ClientProfile;
