// import DatePicker from "react-datepicker";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
// import { format } from "date-fns";
// import axios from "axios";

import ClosePNG from "../images/close.png";
// import DropDown from "../common/Dropdown";
import TextBox from "../common/TextBox";
// import DateInput from "../common/DateInput";
// import TimeInput from "../common/TimeInput";

const AddGroup = ({
  toggleModal,
  setGroup,
  list1,
  setList1,
  list2,
  setList2,
}) => {
  const options = [
    { value: "15 mins before time", label: "15 mins before time" },
    { value: "on time", label: "on time" },
  ];
  const [selectedTime, setSelectedTime] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  // const handleDateChange = (name, value) => {
  //   if (name === "date") {
  //     const formattedDate = format(value, "yyyy-MM-dd");
  //     console.log("name,value", name, formattedDate);
  //     setDate(formattedDate);
  //   } else if (name === "start_time") {
  //     setStartTime(value);
  //   } else if (name === "end_time") {
  //     setEndTime(value);
  //   }
  //   setValue(name, value);
  // };

  const moveItem = (fromList, toList, item, direction) => {
    const newFromList = fromList.filter((i) => i !== item);
    const newToList = [...toList, item];
    if (direction === "right") {
      setList1(newFromList);
      setList2(newToList);
      // setUser((prevUser) => ({
      //   ...prevUser,
      //   permissions: newToList,
      // }));
      console.log("newToList", newToList);
      // console.log("user", user);
      localStorage.setItem("permissions", newToList);
    } else {
      setList1(newToList);
      setList2(newFromList);
      // setUser((prevUser) => ({
      //   ...prevUser,
      //   permissions: newFromList,
      // }));
      localStorage.setItem("permissions", [newFromList]);
    }

    console.log("newFromList", newFromList);
    console.log("newToList", newToList);
    // console.log("user", user);
  };

  const onSubmit = (data) => {
    reset();
    toggleModal();
    console.log(list1);
    console.log(list2);
    data.chosenPermissions = list2;
    console.log("data", data);
    setGroup((prevData) => [...prevData, data]);

    // const event = {
    //   summary: data.appointement_title,
    //   start_datetime: data.date,
    //   end_datetime: data.date,
    // };
    // console.log("event", event);

    // // Save the new event
    // axios
    //   .post(`${apiURL}/create_event/`, event)
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

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col border bg-white border-gray-500 rounded-md">
          <div className=" bg-white rounded-lg">
            <header className="flex flex-row justify-between items-start px-3 py-3">
              <p className="text-gray-600 font-semibold">Add Group</p>
              <button onClick={toggleModal} className="">
                <img src={ClosePNG} className="w-4 h-4"></img>
              </button>
            </header>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="border border-gray-500 " />
            <div className="p-3">
              <TextBox
                name="groupName"
                placeholder="Group Name"
                register={register}
              />
            </div>
          </div>
          <div className="flex flex-col justify-center p-4">
            <div className="flex flex-row space-x-12 justify-center items-center">
              <div className="flex flex-col">
                <label
                  htmlFor="availablePermissions"
                  class="block mb-2 text-sm font-medium "
                >
                  Available Permissions
                </label>
                <select
                  id="availablePermissions"
                  name="availablePermissions"
                  size="5"
                  class="bg-white border border-gray-300  text-sm rounded-lg block w-full p-2.5 dark overflow-hidden"
                >
                  {list1.map((item) => (
                    <option
                      key={item}
                      onClick={() => moveItem(list1, list2, item, "right")}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="chosenPermissions"
                  class="block mb-2 text-sm font-medium "
                >
                  Chosen Permissions
                </label>
                <select
                  id="chosenPermissions"
                  name="chosenPermissions"
                  size="5"
                  class="bg-white border border-gray-300  text-sm rounded-lg block w-full p-2.5 dark overflow-hidden"
                  {...register("chosenPermissions")}
                >
                  {list2.map((item) => (
                    <option
                      key={item}
                      onClick={() => moveItem(list2, list1, item, "left")}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </div>
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

export default AddGroup;
