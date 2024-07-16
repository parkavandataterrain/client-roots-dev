import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import ClosePNG from "../images/close.png";
import DropDown from "../common/Dropdown";
import TextBox from "../common/TextBox";
import DateInput from "../common/DateInput";
import apiURL from "../../apiConfig";

function MedicationsModal({
  toggleModal,
  clientId,
  fetchData,
  data,
  id,
  update = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const options = [
    { value: "Active", label: "Active" },
    { value: "Pending", label: "Pending" },
    { value: "Done", label: "Done" },
  ];

  const [startDate, setStartDate] = useState(null);
  const [stopDate, setStopDate] = useState(null);
  const [status, setStatus] = useState(null);
  const [medicationData, setMedicationData] = useState(null);

  useEffect(() => {
    // const selectedRow = data?.find((row) => row.id === id);
    setMedicationData(data?.find((row) => row.id === id));
  }, []);

  const handleChange = (name, value) => {
    // if (name === "start_date") {
    //   setStartDate(value);
    // } else if (name === "stop_date") {
    //   setStopDate(value);
    // } else if (name === "status") {
    //   console.log(name, value);
    //   setStatus(value.value);
    // }
    // setValue(name, value);
    console.log("name,value", name, value);
    console.log("medicationData", medicationData);
    setMedicationData((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
    console.log("medicationData", medicationData);
  };

  useEffect(() => {
    console.log("medicationData", medicationData);
  }, [medicationData]);

  const onSubmit = (data) => {
    reset();
    toggleModal();
    data = { ...data, ...medicationData };
    // data["start_date"] = startDate;
    // data["end_date"] = stopDate;
    data["client_id"] = clientId;
    // data["status"] = status;

    console.log("data", data);

    if (update) {
      axios
        .put(`${apiURL}/clientmedication-api/${clientId}`, data)
        .then((response) => {
          console.log(response.data);
          fetchData();
        })
        .catch((error) => {
          console.error("Error updating client medication data:", error);
        });
    } else {
      axios
        .post(`${apiURL}/clientmedication-api/`, data)
        .then((response) => {
          console.log(response.data);
          fetchData();
        })
        .catch((error) => {
          console.error("Error posting client medication data:", error);
        });
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col border bg-white border-gray-500 rounded-md">
          <div className=" bg-white rounded-lg">
            <header className="flex flex-row justify-between items-start p-3">
              <p className="text-gray-600 font-semibold">
                {update ? "Update Medication" : "Add New Medication"}
              </p>
              <button onClick={toggleModal} className="">
                <img src={ClosePNG} className="w-4 h-4"></img>
              </button>
            </header>
          </div>
          <div className="flex flex-col">
            <div className="border border-gray-500" />
            <div className="p-3">
              <TextBox
                name="medication"
                placeholder="Medication"
                value={medicationData?.medication}
                // register={register}
                handleChange={(e) => handleChange("medication", e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="p-3">
              <DropDown
                name="status"
                placeholder="Status"
                options={options}
                borderColor="#5BC4BF"
                selectedOption={medicationData?.status}
                handleChange={(e) => handleChange("status", e.value)}
              />
            </div>
          </div>
          <div className="flex flex-row">
            <div className="p-3">
              <DateInput
                name="start_date"
                placeholder="Start Date"
                register={register}
                value={medicationData?.start_date || startDate}
                handleChange={(date) => handleChange("start_date", date)}
              />
            </div>
            <div className="p-3">
              <DateInput
                name="stop_date"
                placeholder="Stop Date"
                register={register}
                value={medicationData?.stop_date || stopDate}
                handleChange={(date) => handleChange("stop_date", date)}
              />
            </div>
          </div>
          <div className="flex flex-row">
            <div className="p-3 w-full">
              <TextBox
                name="comments"
                placeholder="Comments"
                value={medicationData?.comments}
                register={register}
              />
            </div>
          </div>
          <div className="flex flex-row justify-between items-center pb-4">
            <div className="p-3">
              <button
                type="button"
                className="h-10 border-1 border-[#43B09C] rounded text-xs  px-6 py-2"
                onClick={() => toggleModal()}
              >
                Cancel
              </button>
            </div>
            <div className="p-3">
              <button
                type="submit"
                className="h-10 bg-[#43B09C] rounded text-xs text-white px-6 py-2"
              >
                {update ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default MedicationsModal;
