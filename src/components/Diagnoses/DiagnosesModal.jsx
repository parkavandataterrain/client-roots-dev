import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import ClosePNG from "../images/close.png";
import DropDown from "../common/Dropdown";
import TextBox from "../common/TextBox";
import DateInput from "../common/DateInput";
import apiURL from "../../apiConfig";

function DiagnosesModal({
  toggleModal,
  clientId,
  fetchData,
  data,
  id,
  disable = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const [startDate, setStartDate] = useState(null);
  const [stopDate, setStopDate] = useState(null);

  const selectedRow = data?.find((row) => row.id === id);

  const handleDateChange = (name, value) => {
    // if (name === "date") {
    //   const formattedDate = format(value, "yyyy-MM-dd");
    //   console.log("name,value", name, formattedDate);
    //   setDate(formattedDate);
    if (name === "start_date") {
      setStartDate(value);
    } else if (name === "stop_date") {
      setStopDate(value);
    }
    setValue(name, value);
  };

  const onSubmit = (data) => {
    reset();
    toggleModal();
    // data["start_date"] = startDate;
    // data["end_date"] = stopDate;
    data["client_id"] = clientId;

    console.log("data", data);
    // const event = {
    //   summary: data.appointement_title,
    //   start_datetime: data.date,
    //   end_datetime: data.date,
    // };
    // console.log("event", event);

    axios
      .post(`${apiURL}/clientdiagnoses-api/`, data)
      .then((response) => {
        // setSavedEvents(response.data.data);
        console.log(response.data);
        fetchData();

        // setShowAlert(true);
        // window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((error) => {
        console.error("Error posting client diagnosis data:", error);
      });

    // setSavedEvents([...savedEvents, data]);
    // console.log("savedEvents", savedEvents);
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col border bg-white border-gray-500 rounded-md">
          <div className=" bg-white rounded-lg">
            <header className="flex flex-row justify-between items-start p-3">
              <p className="text-gray-600 font-semibold">
                {disable ? "Diagnoses Details" : "Add New Diagnoses"}
              </p>
              <button
                onClick={() => {
                  disable = false;
                  toggleModal();
                }}
              >
                <img src={ClosePNG} className="w-4 h-4"></img>
              </button>
            </header>
          </div>
          <div className="flex flex-col">
            <div className="border border-gray-500" />
            <div className="p-3">
              <TextBox
                name="diagnosis_name"
                placeholder="Diagnoses Name"
                value={selectedRow?.diagnosis_name}
                register={register}
                isEdittable={disable}
              />
            </div>
          </div>
          <div className="flex flex-row">
            <div className="p-3">
              <TextBox
                name="diagnosis_status"
                placeholder="Status"
                value={selectedRow?.diagnosis_status}
                register={register}
                isEdittable={disable}
              />
            </div>
            <div className="p-3">
              <TextBox
                name="icd10_code"
                placeholder="ICD10 Code"
                value={selectedRow?.icd10_code}
                register={register}
                isEdittable={disable}
              />
            </div>
          </div>
          <div className="flex flex-row">
            <div className="p-3">
              <DateInput
                name="start_date"
                placeholder="Start Date"
                register={register}
                value={selectedRow?.start_date || startDate}
                isEdittable={disable}
                handleChange={(date) => handleDateChange("start_date", date)}
              />
            </div>
            <div className="p-3">
              <DateInput
                name="stop_date"
                placeholder="Stop Date"
                register={register}
                value={selectedRow?.stop_date || stopDate}
                isEdittable={disable}
                handleChange={(date) => handleDateChange("stop_date", date)}
              />
            </div>
          </div>
          <div className="flex flex-row">
            <div className="p-3 w-full">
              <TextBox
                name="comments"
                placeholder="Comments"
                value={selectedRow?.comments}
                register={register}
                isEdittable={disable}
              />
            </div>
          </div>
          {!disable && (
            <div className="flex flex-row justify-between items-center pb-4">
              <div className="p-3">
                <button
                  type="button"
                  className="h-10 border-1 border-[#43B09C] rounded text-xs  px-6 py-2"
                  onClick={() => {
                    disable = false;
                    toggleModal();
                  }}
                >
                  Cancel
                </button>
              </div>
              <div className="p-3">
                <button
                  type="submit"
                  className="h-10 bg-[#43B09C] rounded text-xs text-white px-6 py-2"
                >
                  Save
                </button>
              </div>
            </div>
          )}
          {disable && (
            <div className="flex flex-row justify-end items-center pb-4">
              <div className="p-3">
                <button
                  type="button"
                  className="h-10 bg-[#43B09C] rounded text-xs text-white px-6 py-2"
                  onClick={() => {
                    disable = false;
                    toggleModal();
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default DiagnosesModal;
