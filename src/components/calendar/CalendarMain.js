import dayjs from "dayjs";
import { useState, useEffect } from "react";
import axios from "axios";

import {
  getMonth,
  getWeek,
  getToday,
  getYearMonths,
  getMonth2,
} from "../utils";
import Month from "./month";
import CalendarHeader from "./calendarheader";
import AddAppointment from "./addappointment";
import AlertSuccess from "../common/AlertSuccess";
import apiURL from "../.././apiConfig";
import Week from "./week";
import YearView from "./YearView";
import TodayView from "./TodayView";
import useAppointments from "../../hooks/useAppointments";

const CalendarMain = () => {
  // console.table(getMonth(3));

  const CALENDAR_VIEWS = ["Today", "Week", "Month", "Year"];
  const [currentCalendarView, setCurrentCalendarView] = useState("Month");

  const [currentDate, setCurrentDate] = useState(dayjs());

  const handleCalendarChange = (mode) => {
    let dateParameter = "month";
    switch (currentCalendarView) {
      case "Month":
        dateParameter = "month";
        break;
      case "Week":
        dateParameter = "week";
        break;
      case "Year":
        dateParameter = "year";
        break;
      default:
        dateParameter = "month";
        break;
    }
    if (mode === 1) {
      // handle increment
      console.log({
        dateParameter,
        mode,
      });
      setCurrentDate((prev) => prev.add(1, dateParameter));
    }

    if (mode === -1) {
      // handle decrement
      console.log({
        dateParameter,
        mode,
      });
      setCurrentDate((prev) => prev.subtract(1, dateParameter));
    }
  };

  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const submitAppointment = () => {
    setShowModal(false);
    setShowAlert(true);
  };

  const [showAlert, setShowAlert] = useState(false);
  const closeAlert = () => {
    setShowAlert(false);
  };

  const {
    appointmentsLoading,
    internalEventsLoading,
    externalEventsLoading,
    internalEvents,
    externalEvents,
    eventList: savedEvents,
    appointmentsList,
    fetchEvents,
    fetchAppointments,
    deleteAppointment,
  } = useAppointments();

  console.log({ appointmentsList });

  const renderCalendar = () => {
    switch (currentCalendarView) {
      case "Today":
        return (
          <TodayView
            savedEvents={appointmentsList}
            fetchEvents={fetchAppointments}
            deleteAppointment={deleteAppointment}
          />
        );
      case "Week":
        return (
          <Week
            currentDate={currentDate}
            savedEvents={appointmentsList}
            fetchEvents={fetchAppointments}
            deleteAppointment={deleteAppointment}
          />
        );
      case "Month":
        return (
          <Month
            currentDate={currentDate}
            savedEvents={appointmentsList}
            fetchEvents={fetchAppointments}
            deleteAppointment={deleteAppointment}
          />
        );
      case "Year":
        return (
          <YearView
            currentDate={currentDate}
            savedEvents={appointmentsList}
            fetchEvents={fetchAppointments}
            deleteAppointment={deleteAppointment}
          />
        );
      default:
        return <p>No view found</p>;
    }
  };

  return (
    <div className="">
      {showAlert && (
        <AlertSuccess
          message="New Appointment Created"
          handleClose={closeAlert}
        />
      )}
      <div className={`space-y-5 m-5 ${showModal ? "opacity-50" : ""}`}>
        <div className="flex flex-row justify-between items-end">
          <div className="text-gray-900 text-2xl font-medium" id="calendarPage">
            Calendar
          </div>
          <button
            className="w-54 h-12 bg-[#43B09C] rounded text-xs text-white p-3"
            onClick={toggleModal}
          >
            Add new appointment
          </button>
        </div>
        <div className="flex flex-col bg-white border-1 border-teal-400 rounded-md p-10 space-y-3">
          <CalendarHeader
            viewList={CALENDAR_VIEWS}
            currentCalendarView={currentCalendarView}
            handleCalendarView={setCurrentCalendarView}
            onIncrement={() => {
              handleCalendarChange(1);
            }}
            onDecrement={() => {
              handleCalendarChange(-1);
            }}
            currentDate={currentDate}
          />
          {!(internalEventsLoading && externalEventsLoading) &&
            renderCalendar()}
        </div>
      </div>

      <AddAppointment
        show={showModal}
        toggleModal={toggleModal}
        handleSubmit={submitAppointment}
        setShowAlert={setShowAlert}
        fetchEvents={fetchAppointments}
      />
    </div>
  );
};

export default CalendarMain;
