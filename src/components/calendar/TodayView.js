import React, { useState } from "react";
import dayjs from "dayjs";
import { getTodayTime } from "../utils";
import GoogleIcon from "../images/google_icon.svg";
import TrashIcon from "../images/delete.png";
import CalendarIcon from "../images/calendar-boxed.svg";
import InternalCalendarIcon from "../images/internal-meeting.svg";
import { AppointmentDetail_Modal } from "../Appointment/AppointmentDetail";
import AddAppointment from "./addappointment";

export default function TodayView({
  savedEvents,
  fetchEvents,
  deleteAppointment,
}) {
  const todayTimes = getTodayTime();

  return (
    <>
      <div className="mt-1 p-1">
        {todayTimes.map((time, index) => {
          return (
            <TimeBlock
              key={index}
              time={time}
              savedEvents={savedEvents}
              fetchEvents={fetchEvents}
              deleteAppointment={deleteAppointment}
            />
          );
        })}
      </div>
    </>
  );
}

function TimeBlock({ time, savedEvents, fetchEvents, deleteAppointment }) {
  const startTime = time.format("h:mm A"); // Format the start time
  const endTime = time.add(1, "hour").format("h:mm A"); // Add 1 hour to get the end time

  function getCurrentTimeClass() {
    return time.format("H") === dayjs().format("H")
      ? "bg-[#2F9384] text-white rounded-md h-5 m-0 w-100"
      : "pt-2";
  }

  function getTitleBackGround() {
    const timeHour = dayjs(time).format("HH");

    switch (timeHour) {
      case "01":
      case "13":
        return "text-white bg-fuchsia-900";
      case "02":
      case "14":
        return "text-white bg-emerald-500";
      case "03":
      case "15":
        return "text-white bg-sky-500";
      case "04":
      case "16":
        return "text-white bg-red-500";
      case "05":
      case "17":
        return "text-black bg-yellow-200";
      case "06":
      case "18":
        return "text-white bg-teal-500";
      case "07":
      case "19":
        return "text-white bg-indigo-500";
      case "08":
      case "20":
        return "text-white bg-orange-500";
      case "09":
      case "21":
        return "text-white bg-lime-500";
      case "10":
      case "22":
        return "text-white bg-violet-500";
      case "11":
      case "23":
        return "text-white bg-cyan-500";
      case "12":
      case "00":
        return "text-white bg-rose-500";
      default:
        return "";
    }
  }

  const eventsForHour = savedEvents.filter((event) => {
    const eventTime = dayjs(event.start.dateTime);
    return eventTime.hour() === time.hour() && eventTime.date() === time.date();
  });

  const [showDetailModal, setShowDetailModal] = useState(null);
  const toggleDetailModal = (index) => {
    setShowDetailModal(index);
  };

  const [editEvent, setEditEvent] = useState(false);
  const [viewEvent, setViewEvent] = useState(false);

  const handleDeleteAppointment = (id) => {
    deleteAppointment(id);
  };

  return (
    <div className="flex-1 grid grid-cols-9 gap-2 m-0 opacity-75 border border-gray-200">
      <div className="col-span-1 border-r-2 border-gray-200 flex justify-center items-center">
        <p className={`text-center text-sm ${getCurrentTimeClass()}`}>
          {startTime}
        </p>
      </div>
      <div className="col-span-8">
        {eventsForHour.map((event, index) => {
          const startTime = dayjs(event.start.dateTime).format("HH:mm A");
          const endTime = dayjs(event.end.dateTime).format("HH:mm A");

          let showAppointment = editEvent === index;
          if (viewEvent === index) {
            showAppointment = true;
          }

          return (
            <>
              {" "}
              <div key={index} className="m-2 mb-0 relative">
                <a
                  // href={event.htmlLink}
                  target="_blank"
                  className="block w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleDetailModal(index);
                  }}
                >
                  <div
                    className={`flex flex-row gap-1 items-center justify-between w-full h-7 rounded-tl-sm rounded-tr-sm mx-1 ${getTitleBackGround()}`}
                  >
                    <div className="flex items-center gap-1 flex-grow overflow-hidden max-w-[75%]">
                      <img
                        src={
                          event.isExternal ? GoogleIcon : InternalCalendarIcon
                        }
                        className={
                          event.isExternal
                            ? "h-[16px] w-[16px] ms-1 bg-white rounded-full"
                            : "h-[20px] w-[20px] ms-1"
                        }
                        alt="event-meet"
                      />
                      <div className="text-xs font-normal truncate flex-grow overflow-hidden">
                        {startTime + "-" + endTime + " | " + event.summary}
                      </div>
                    </div>

                    <div className="flex items-center justify-end pe-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAppointment(event.id);
                        }}
                        className="m-auto"
                      >
                        <img className="h-3.5 w-auto" src={TrashIcon} />
                      </button>
                    </div>
                  </div>
                </a>
              </div>
              {showDetailModal === index && (
                <AppointmentDetail_Modal
                  showPreview={showDetailModal === index}
                  toggleModal={() => toggleDetailModal(null)}
                  event={event}
                  toggleEdit={() => {
                    setEditEvent(index);
                    setViewEvent(null);
                  }}
                  toggleView={() => {
                    setEditEvent(null);
                    setViewEvent(index);
                  }}
                  deleteAppointment={handleDeleteAppointment}
                />
              )}
              <AddAppointment
                show={showAppointment}
                toggleModal={() => {
                  setViewEvent(null);
                  setEditEvent(null);
                }}
                setShowAlert={null}
                fetchEvents={fetchEvents}
                appointmentDetail={event}
                appointmentId={event.id}
                isUpdate={editEvent === index}
                isView={viewEvent === index}
              />
            </>
          );
        })}
      </div>
    </div>
  );
}
