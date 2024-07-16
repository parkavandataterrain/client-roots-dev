import DatePicker from "react-datepicker";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import axios from "axios";

import ClosePNG from "../images/close.png";
import DropDown from "../common/Dropdown";
import TextBox from "../common/TextBox";
// import DateInput from "../common/DateInput";
// import TimeInput from "../common/TimeInput";

const AddUser = ({ toggleModal, setUser, group }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const [groupName, setGroupName] = useState(null);

  const groupOptions = group.map((group) => ({
    value: group.groupName,
    label: group.groupName,
  }));

  const statusOptions = [
    {
      value: "Active",
      label: "Active",
    },
    {
      value: "InActive",
      label: "InActive",
    },
  ];

  // const handleDateChange = (name, value) => {
  //   if (name === "date") {
  //     const formattedDate = format(value, "yyyy-MM-dd");
  //     console.log("name,value", name, formattedDate);
  //     // setDate(formattedDate);
  //   } else if (name === "start_time") {
  //     setStartTime(value);
  //   } else if (name === "end_time") {
  //     setEndTime(value);
  //   }
  //   setValue(name, value);
  // };

  const handleChange = (name, value) => {
    console.log("name, value", name, value);
    setGroupName(value);
    console.log("groupName", groupName);
  };

  const onSubmit = (data) => {
    reset();
    toggleModal();
    console.log("data", data);
    data["groupName"] = groupName;
    data["staffStatus"] = "Active";
    setUser((prevData) => [...prevData, data]);
    // const event = {
    //   summary: data.appointement_title,
    //   start_datetime: data.date,
    //   end_datetime: data.date,
    // };
    // console.log("event", event);

    // // Save the new event
    // axios
    //   .post(`http://192.168.3.24:8000/create_event/`, event)
    //   .then((response) => {
    //     // setSavedEvents(response.data.data);
    //     console.log(response.data);

    //     setShowAlert(true);
    //     fetchEvents();
    //     window.scrollTo({ top: 0, behavior: "smooth" });
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching Client Diagnosis Data:", error);
    //   });

    // setSavedEvents([...savedEvents, data]);
    // console.log("savedEvents", savedEvents);
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  console.log("groupOptions", groupOptions);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col border bg-white border-gray-500 rounded-md">
          <div className=" bg-white rounded-lg">
            <header className="flex flex-row justify-between items-start px-3 py-3">
              <p className="text-gray-600 font-semibold">Add User</p>
              <button onClick={toggleModal} className="">
                <img src={ClosePNG} className="w-4 h-4"></img>
              </button>
            </header>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="border border-gray-500 " />
            <div className="p-3">
              <TextBox name="email" placeholder="Email" register={register} />
            </div>
          </div>
          <div className="flex flex-row">
            <div className="flex-1 p-3">
              <TextBox
                name="userName"
                placeholder="User Name"
                register={register}
              />
            </div>
            <div className="flex-1 p-3">
              <DropDown name="type" placeholder="Type" register={register} />
            </div>
          </div>
          <div className="flex flex-row">
            <div className="p-3">
              <TextBox
                name="firstName"
                placeholder="First Name"
                register={register}
              />
            </div>
            <div className="p-3">
              <TextBox
                name="lastName"
                placeholder="Last Name"
                register={register}
              />
            </div>
          </div>
          <div className="flex flex-row">
            <div className="flex-1 p-3">
              <DropDown
                name="group"
                placeholder="Group"
                // options={group.map((group) => group.groupName)}
                options={groupOptions}
                value={groupName}
                handleChange={(selectedOption) =>
                  handleChange("groupName", selectedOption.value)
                }
                // handleChange={handleChange}
                // handleChange={(e) => handleChange("groupName", e.target.value)}
                // options={[
                //   {
                //     value: "15 mins before time",
                //     label: "15 mins before time",
                //   },
                //   { value: "on time", label: "on time" },
                // ]}
                register={register}
              />
            </div>
            <div className="flex-1 p-3">
              <DropDown
                name="Status"
                placeholder="status"
                options={statusOptions}
                selectedOption={statusOptions[0]}
                handleChange={handleChange}
                register={register}
              />
            </div>
          </div>

          <div className="flex flex-row justify-between items-center pb-4 px-1">
            <div className="p-3">
              <button
                type="cancel"
                className="w-54 h-10 border-1 border-[#43B09C] rounded text-xs py-2 px-4 hover:bg-[#43B09C] hover:text-white"
              >
                Cancel
              </button>
            </div>
            <div className="p-3">
              <button
                type="submit"
                className="w-54 h-10 bg-[#43B09C] rounded text-xs text-white py-2 px-4"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
